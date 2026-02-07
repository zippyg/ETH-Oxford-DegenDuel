import { Context, Effect, Layer, Ref, Fiber } from "effect";
import { FdcService, type AttestationParams, type AttestationResult } from "./FdcService";
import { FdcPrepareError, FdcSubmitError, FdcTimeoutError, FdcProofError } from "./errors";

// State type for tracking duel pipeline progress
export type DuelPipelineState =
  | "idle"
  | "preparing"
  | "submitting"
  | "awaiting"
  | "proving"
  | "settling"
  | "settled"
  | "failed";

export interface DuelProgress {
  readonly state: DuelPipelineState;
  readonly duelId: string;
  readonly timestamp: number;
  readonly roundId?: number;
  readonly error?: string;
}

export interface IDuelService {
  readonly trackDuelProgress: (
    duelId: string,
    params: AttestationParams
  ) => Effect.Effect<
    { result: AttestationResult; finalState: DuelProgress },
    FdcPrepareError | FdcSubmitError | FdcTimeoutError | FdcProofError
  >;

  readonly cancelPendingAttestation: (
    fiber: Fiber.RuntimeFiber<any, any>
  ) => Effect.Effect<void, never>;

  readonly getProgress: (
    stateRef: Ref.Ref<DuelProgress>
  ) => Effect.Effect<DuelProgress, never>;
}

export class DuelService extends Context.Tag("DuelService")<
  DuelService,
  IDuelService
>() {}

export const DuelServiceLive = Layer.effect(
  DuelService,
  Effect.gen(function* () {
    const fdcService = yield* FdcService;

    // STATE MANAGEMENT: Track duel pipeline progress using Ref
    const trackDuelProgress = (
      duelId: string,
      params: AttestationParams
    ): Effect.Effect<
      { result: AttestationResult; finalState: DuelProgress },
      FdcPrepareError | FdcSubmitError | FdcTimeoutError | FdcProofError
    > =>
      Effect.gen(function* () {
        // Create mutable state reference (STATE effect type #11)
        const stateRef = yield* Ref.make<DuelProgress>({
          state: "idle",
          duelId,
          timestamp: Date.now(),
        });

        // Helper to update state
        const updateState = (newState: DuelPipelineState, roundId?: number, error?: string) =>
          Ref.update(stateRef, (current) => ({
            ...current,
            state: newState,
            timestamp: Date.now(),
            roundId: roundId ?? current.roundId,
            error,
          })).pipe(
            Effect.tap(() => Effect.logInfo(`Duel ${duelId}: ${newState}`))
          );

        try {
          // Step 1: Preparing
          yield* updateState("preparing");
          yield* Effect.sleep("500 millis"); // Simulated prep time

          // Step 2: Execute full attestation with state tracking
          yield* updateState("submitting");

          const result = yield* fdcService.fullAttestation(params).pipe(
            Effect.tap(({ roundId }) => updateState("awaiting", roundId)),
            Effect.tap(() => Effect.sleep("1 second")),
            Effect.tap(() => updateState("proving")),
            Effect.tap(() => Effect.sleep("500 millis")),
            Effect.tap(() => updateState("settling")),
            Effect.catchAll((error) =>
              updateState("failed", undefined, error.message).pipe(
                Effect.flatMap(() => Effect.fail(error))
              )
            )
          );

          // Step 3: Settled successfully
          yield* updateState("settled", result.roundId);

          const finalState = yield* Ref.get(stateRef);

          return { result, finalState };
        } catch (error) {
          yield* updateState("failed", undefined, String(error));
          throw error;
        }
      });

    // CANCELLATION: Interrupt running attestation fiber (CANCELLATION effect type #12)
    const cancelPendingAttestation = (
      fiber: Fiber.RuntimeFiber<any, any>
    ): Effect.Effect<void, never> =>
      Fiber.interrupt(fiber).pipe(
        Effect.tap(() => Effect.logWarning("Duel attestation cancelled by user")),
        Effect.tap(() => Effect.logInfo("Fiber interrupted successfully")),
        Effect.asVoid,
        Effect.catchAll((error) =>
          Effect.logError(`Failed to cancel attestation: ${error}`).pipe(
            Effect.asVoid
          )
        )
      );

    // Helper to get current progress state
    const getProgress = (
      stateRef: Ref.Ref<DuelProgress>
    ): Effect.Effect<DuelProgress, never> =>
      Ref.get(stateRef).pipe(
        Effect.tap((progress) =>
          Effect.logDebug(`Current progress: ${progress.state} (${progress.duelId})`)
        )
      );

    return {
      trackDuelProgress,
      cancelPendingAttestation,
      getProgress,
    };
  })
);
