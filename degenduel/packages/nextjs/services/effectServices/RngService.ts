import { Context, Effect, Layer, Schedule } from "effect";
import { RngError } from "./errors";
import { ConfigService } from "./config";

export interface RandomData {
  readonly value: bigint;
  readonly isSecure: boolean;
  readonly timestamp: number;
}

export interface IRngService {
  readonly getRandomNumber: () => Effect.Effect<RandomData, RngError>;
  readonly isInBonusRange: (value: bigint, chanceBps: number) => Effect.Effect<boolean, never>;
}

export class RngService extends Context.Tag("RngService")<
  RngService,
  IRngService
>() {}

export const RngServiceLive = Layer.effect(
  RngService,
  Effect.gen(function* () {
    const config = yield* ConfigService;

    const getRandomNumber = (): Effect.Effect<RandomData, RngError> =>
      Effect.tryPromise({
        try: async () => {
          const response = await fetch(config.rpcUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              method: "eth_call",
              params: [{
                to: config.contractAddress,
                data: "0x493e3e97", // getRandomNumber() selector
              }, "latest"],
              id: 1,
            }),
          });
          const json = await response.json();
          if (json.error) throw new Error(json.error.message);
          const data = json.result.slice(2);
          return {
            value: BigInt("0x" + data.slice(0, 64)),
            isSecure: BigInt("0x" + data.slice(64, 128)) !== 0n,
            timestamp: Number(BigInt("0x" + data.slice(128, 192))),
          };
        },
        catch: (error) => new RngError({ message: `RNG read failed: ${error}`, cause: error }),
      }).pipe(
        Effect.retry(Schedule.recurs(2)),
        Effect.tap((rng) => Effect.logInfo(`RNG: value=${rng.value.toString().slice(0, 10)}..., secure=${rng.isSecure}`)),
      );

    const isInBonusRange = (value: bigint, chanceBps: number): Effect.Effect<boolean, never> =>
      Effect.succeed(Number(value % 10000n) < chanceBps);

    return { getRandomNumber, isInBonusRange };
  })
);
