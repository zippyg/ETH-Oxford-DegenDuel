import { Context, Effect, Layer, Schedule } from "effect";
import { FdcPrepareError, FdcSubmitError, FdcTimeoutError, FdcProofError } from "./errors";
import { ConfigService } from "./config";

export interface AttestationParams {
  readonly url: string;
  readonly httpMethod: string;
  readonly postProcessJq: string;
  readonly abiSignature: string;
}

export interface AttestationResult {
  readonly abiEncodedRequest: string;
  readonly roundId: number;
  readonly proof: unknown;
}

export interface IFdcService {
  readonly prepareRequest: (params: AttestationParams) => Effect.Effect<string, FdcPrepareError>;
  readonly fullAttestation: (params: AttestationParams) => Effect.Effect<AttestationResult, FdcPrepareError | FdcSubmitError | FdcTimeoutError | FdcProofError>;
}

export class FdcService extends Context.Tag("FdcService")<
  FdcService,
  IFdcService
>() {}

function toHex(s: string): string {
  let h = "";
  for (let i = 0; i < s.length; i++) h += s.charCodeAt(i).toString(16);
  return "0x" + h.padEnd(64, "0");
}

export const FdcServiceLive = Layer.effect(
  FdcService,
  Effect.gen(function* () {
    const config = yield* ConfigService;

    const prepareRequest = (params: AttestationParams): Effect.Effect<string, FdcPrepareError> =>
      Effect.tryPromise({
        try: async () => {
          const response = await fetch(config.verifierUrl, {
            method: "POST",
            headers: {
              "X-API-KEY": config.verifierApiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              attestationType: toHex("Web2Json"),
              sourceId: toHex("PublicWeb2"),
              requestBody: {
                url: params.url,
                httpMethod: params.httpMethod,
                headers: "{}",
                queryParams: "{}",
                body: "{}",
                postProcessJq: params.postProcessJq,
                abiSignature: params.abiSignature,
              },
            }),
          });
          const data = await response.json();
          if (data.status !== "VALID") throw new Error(`Verifier returned: ${data.status}`);
          return data.abiEncodedRequest as string;
        },
        catch: (error) => new FdcPrepareError({ message: `FDC prepare failed: ${error}`, cause: error }),
      }).pipe(
        Effect.retry(Schedule.recurs(2)),
        Effect.tap(() => Effect.logInfo("FDC: Attestation request prepared")),
      );

    const submitRequest = (abiEncodedRequest: string): Effect.Effect<{ roundId: number; requestBytes: string }, FdcSubmitError> =>
      Effect.tryPromise({
        try: async () => {
          const response = await fetch("/api/fdc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "submit",
              abiEncodedRequest,
            }),
          });
          if (!response.ok) {
            const error = await response.text();
            throw new Error(`API error: ${error}`);
          }
          const data = await response.json();
          return { roundId: data.roundId, requestBytes: data.requestBytes };
        },
        catch: (error) => new FdcSubmitError({ message: `FDC submit failed: ${error}`, cause: error }),
      }).pipe(
        Effect.retry(Schedule.exponential("2 seconds").pipe(Schedule.compose(Schedule.recurs(3)))),
        Effect.tap(({ roundId }) => Effect.logInfo(`FDC: Request submitted, roundId: ${roundId}`)),
      );

    const awaitFinalization = (roundId: number, requestBytes: string): Effect.Effect<unknown, FdcTimeoutError | FdcProofError> => {
      const pollOnce = Effect.tryPromise({
        try: async () => {
          const response = await fetch("/api/fdc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "poll",
              roundId,
              requestBytes,
            }),
          });
          if (!response.ok) {
            const error = await response.text();
            throw new Error(`Poll error: ${error}`);
          }
          const data = await response.json();
          if (!data.ready) {
            throw new Error("Proof not ready yet");
          }
          return data.proof;
        },
        catch: (error) => new FdcProofError({ roundId, message: `FDC polling failed: ${error}`, cause: error }),
      });

      return pollOnce.pipe(
        Effect.retry(
          Schedule.exponential("10 seconds").pipe(
            Schedule.compose(Schedule.recurs(30)), // 30 attempts with exponential backoff
            Schedule.whileInput((error: FdcProofError) =>
              error.message.includes("not ready yet")
            ),
          ),
        ),
        Effect.timeout("10 minutes"),
        Effect.catchTag("TimeoutException", () =>
          new FdcTimeoutError({ roundId, message: `Attestation timed out after 10 minutes for round ${roundId}` })
        ),
        Effect.tap(() => Effect.logInfo(`FDC: Proof retrieved for round ${roundId}`)),
      );
    };

    const fullAttestation = (params: AttestationParams) =>
      Effect.gen(function* () {
        // Step 1: Prepare the request
        const abiEncodedRequest = yield* prepareRequest(params);
        yield* Effect.logInfo("FDC: Step 1/4 - Request prepared");

        // Step 2: Submit to FdcHub on-chain
        const { roundId, requestBytes } = yield* submitRequest(abiEncodedRequest);
        yield* Effect.logInfo(`FDC: Step 2/4 - Submitted to FdcHub (round ${roundId})`);

        // Step 3: Wait for finalization on DA layer
        yield* Effect.logInfo("FDC: Step 3/4 - Waiting for DA layer finalization...");
        const proof = yield* awaitFinalization(roundId, requestBytes);
        yield* Effect.logInfo("FDC: Step 4/4 - Proof retrieved successfully");

        return {
          abiEncodedRequest,
          roundId,
          proof,
        } as AttestationResult;
      });

    return { prepareRequest, fullAttestation };
  })
);
