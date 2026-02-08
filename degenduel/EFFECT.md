# Effect-TS in DegenDuel

## Overview

DegenDuel's entire off-chain service layer is built with [Effect-TS](https://effect.website/) (v3.19). The codebase demonstrates **12 distinct effect types** across 9 service files and 2 API routes, composing into a single `AppLayerLive` via the Service/Layer pattern.

This is not a wrapper or a demo. Every blockchain interaction — reading FTSO price feeds, running FDC attestation workflows, generating randomness, streaming events, and calling FLock AI — flows through Effect pipelines with typed errors, retries, timeouts, and structured concurrency.

---

## Architecture

```
AppLayerLive (index.ts)
  |
  +-- ConfigServiceLive      (config.ts)         — dependency-injected configuration
  +-- FtsoServiceLive         (FtsoService.ts)    — FTSO v2 price feed reads
  +-- FdcServiceLive          (FdcService.ts)     — FDC Web2Json attestation pipeline
  +-- RngServiceLive          (RngService.ts)     — Flare Secure RNG
  +-- FlockServiceLive        (FlockService.ts)   — FLock AI strategy hints
  +-- EventServiceLive        (EventService.ts)   — real-time duel event streaming
  +-- DuelServiceLive         (DuelService.ts)    — orchestration, state, cancellation
```

All services live in [`packages/nextjs/services/effectServices/`](packages/nextjs/services/effectServices/).

Layer composition in [`index.ts`](packages/nextjs/services/effectServices/index.ts):

```ts
export const AppLayerLive = Layer.mergeAll(
  FtsoServiceLive,
  FdcServiceLive,
  RngServiceLive,
  FlockServiceLive,
  EventServiceLive,
  DuelServiceLive,
).pipe(Layer.provide(ConfigServiceLive));
```

---

## 12 Effect Types Demonstrated

| # | Effect Type | API | File | Line(s) | What It Does |
|---|------------|-----|------|---------|--------------|
| 1 | **Network I/O** | `Effect.tryPromise` | `FtsoService.ts` | 39-58 | HTTP/RPC calls to Flare Coston2 for price feed reads |
| 2 | **Typed Errors** | `Data.TaggedError` | `errors.ts` | 1-63 | 11 tagged error types (`FtsoError`, `FdcPrepareError`, `FdcSubmitError`, `FdcTimeoutError`, `FdcProofError`, `ContractError`, `RngError`, `FlockError`, `ConfigError`, `EventError`, `FdcError`) with discriminated union `AppError` |
| 3 | **Timeout** | `Effect.timeout` | `FlockService.ts` | 53 | 10-second timeout on FLock AI API calls |
| | | | `FdcService.ts` | 130 | 10-minute timeout on FDC attestation finalization |
| 4 | **Retry with Backoff** | `Schedule.exponential`, `Schedule.recurs` | `FtsoService.ts` | 60 | Exponential backoff (500ms base) with 3 retries on price reads |
| | | | `FdcService.ts` | 68, 92, 123 | 2 retries on prepare, exponential (2s base) with 3 retries on submit, exponential (10s base) with 30 retries on proof polling |
| 5 | **Concurrency** | `Effect.all` with `{ concurrency: "unbounded" }` | `FtsoService.ts` | 65 | Reads 5 FTSO price feeds (FLR, BTC, ETH, XRP, SOL) in parallel |
| 6 | **Streaming** | `Stream.Stream`, `Stream.repeatEffect`, `Stream.async` | `FtsoService.ts` | 67-70 | Continuous price feed stream at configurable interval |
| | | | `EventService.ts` | 92-137, 156-190 | WebSocket event stream with polling fallback |
| 7 | **Configuration** | `Context.Tag`, `Layer.succeed` | `config.ts` | 15-30 | `ConfigService` provides chain ID, RPC URL, contract address, FDC verifier URL, FLock API key via dependency injection |
| 8 | **Logging** | `Effect.logInfo`, `Effect.logWarning`, `Effect.logDebug`, `Effect.logError` | All services | Throughout | Structured logging at every pipeline step (e.g., `"FDC: Step 2/4 - Submitted to FdcHub (round ${roundId})"`) |
| 9 | **Scheduling** | `Schedule.spaced` | `FtsoService.ts` | 69 | Configurable polling interval for price stream |
| | | | `EventService.ts` | 136 | 5-second interval for event polling fallback |
| 10 | **Resource Management** | `Effect.acquireRelease` | `EventService.ts` | 33-89 | WebSocket lifecycle: acquire opens connection + subscribes to contract events, release closes socket on cleanup |
| 11 | **State** | `Ref.make`, `Ref.update`, `Ref.get` | `DuelService.ts` | 62-104 | Mutable state reference tracking duel pipeline progress through 7 states: `idle` -> `preparing` -> `submitting` -> `awaiting` -> `proving` -> `settling` -> `settled` (or `failed`) |
| 12 | **Cancellation** | `Fiber.interrupt` | `DuelService.ts` | 114-126 | Interrupts running FDC attestation fibers on user cancellation, with cleanup logging |

---

## Typed Error Hierarchy

Defined in [`errors.ts`](packages/nextjs/services/effectServices/errors.ts):

```ts
// Each error is a tagged discriminated union
export class FtsoError extends Data.TaggedError("FtsoError")<{
  readonly feedId: string;
  readonly message: string;
  readonly cause?: unknown;
}> {}

export class FdcPrepareError extends Data.TaggedError("FdcPrepareError")<{ ... }> {}
export class FdcSubmitError  extends Data.TaggedError("FdcSubmitError")<{ ... }> {}
export class FdcTimeoutError extends Data.TaggedError("FdcTimeoutError")<{ ... }> {}
export class FdcProofError   extends Data.TaggedError("FdcProofError")<{ ... }> {}
export class ContractError   extends Data.TaggedError("ContractError")<{ ... }> {}
export class RngError        extends Data.TaggedError("RngError")<{ ... }> {}
export class FlockError      extends Data.TaggedError("FlockError")<{ ... }> {}
export class ConfigError     extends Data.TaggedError("ConfigError")<{ ... }> {}
export class EventError      extends Data.TaggedError("EventError")<{ ... }> {}
export class FdcError        extends Data.TaggedError("FdcError")<{ ... }> {}

// Union type for exhaustive matching
export type AppError = FtsoError | FdcError | ContractError | RngError
                     | FlockError | ConfigError | EventError;
```

Every service function declares its error type in the return signature. For example, `FdcService.fullAttestation` returns:

```ts
Effect.Effect<AttestationResult, FdcPrepareError | FdcSubmitError | FdcTimeoutError | FdcProofError>
```

This means callers know at the type level exactly which errors can occur and must handle them — no unchecked exceptions.

---

## Service/Layer Pattern

Each service follows the same structure:

1. **Interface** — defines the service contract
2. **Tag** — `Context.Tag` creates a unique identifier for dependency injection
3. **Live implementation** — `Layer.effect` provides the concrete implementation
4. **Dependency resolution** — `Effect.gen` yields dependencies from the context

Example from [`FtsoService.ts`](packages/nextjs/services/effectServices/FtsoService.ts):

```ts
// 1. Interface
export interface IFtsoService {
  readonly getCurrentPrice: (feedId: string) => Effect.Effect<PriceData, FtsoError>;
  readonly getMultiplePrices: (feedIds: string[]) => Effect.Effect<PriceData[], FtsoError>;
  readonly streamPrices: (feedIds: string[], intervalMs: number) => Stream.Stream<PriceData[], FtsoError>;
}

// 2. Tag
export class FtsoService extends Context.Tag("FtsoService")<FtsoService, IFtsoService>() {}

// 3. Live implementation
export const FtsoServiceLive = Layer.effect(
  FtsoService,
  Effect.gen(function* () {
    // 4. Resolve ConfigService dependency from context
    const config = yield* ConfigService;

    const getCurrentPrice = (feedId: string): Effect.Effect<PriceData, FtsoError> =>
      Effect.tryPromise({ ... }).pipe(
        Effect.retry(Schedule.exponential("500 millis").pipe(Schedule.compose(Schedule.recurs(3)))),
        Effect.tap((price) => Effect.logInfo(`FTSO price read: ${feedId} = ${price.formatted}`)),
      );

    // ...
    return { getCurrentPrice, getMultiplePrices, streamPrices };
  })
);
```

---

## FDC Attestation Pipeline — Where Effect Shines

The FDC (Flare Data Connector) attestation is a multi-step async workflow that takes 3-8 minutes. It is the most complex pipeline in the application and uses 6 effect types in a single flow.

Defined in [`FdcService.ts`](packages/nextjs/services/effectServices/FdcService.ts) `fullAttestation`:

```
Step 1: prepareRequest    → Effect.tryPromise + retry(2)
Step 2: submitRequest     → Effect.tryPromise + exponential backoff (2s, 3 retries)
Step 3: awaitFinalization → Effect.tryPromise + exponential backoff (10s, 30 retries)
                            + timeout(10 minutes) + catchTag("TimeoutException")
Step 4: return proof      → structured logging at each step
```

```ts
const fullAttestation = (params: AttestationParams) =>
  Effect.gen(function* () {
    const abiEncodedRequest = yield* prepareRequest(params);
    yield* Effect.logInfo("FDC: Step 1/4 - Request prepared");

    const { roundId, requestBytes } = yield* submitRequest(abiEncodedRequest);
    yield* Effect.logInfo(`FDC: Step 2/4 - Submitted to FdcHub (round ${roundId})`);

    yield* Effect.logInfo("FDC: Step 3/4 - Waiting for DA layer finalization...");
    const proof = yield* awaitFinalization(roundId, requestBytes);
    yield* Effect.logInfo("FDC: Step 4/4 - Proof retrieved successfully");

    return { abiEncodedRequest, roundId, proof } as AttestationResult;
  });
```

The `awaitFinalization` step is particularly interesting — it uses conditional retry via `Schedule.whileInput` to only retry when the error indicates the proof isn't ready yet, combined with a hard 10-minute timeout that converts `TimeoutException` into a typed `FdcTimeoutError`:

```ts
pollOnce.pipe(
  Effect.retry(
    Schedule.exponential("10 seconds").pipe(
      Schedule.compose(Schedule.recurs(30)),
      Schedule.whileInput((error: FdcProofError) =>
        error.message.includes("not ready yet")
      ),
    ),
  ),
  Effect.timeout("10 minutes"),
  Effect.catchTag("TimeoutException", () =>
    new FdcTimeoutError({ roundId, message: `Attestation timed out after 10 minutes` })
  ),
);
```

---

## State Management with Ref

[`DuelService.ts`](packages/nextjs/services/effectServices/DuelService.ts) tracks pipeline progress through a state machine using `Ref`:

```ts
type DuelPipelineState =
  | "idle" | "preparing" | "submitting" | "awaiting"
  | "proving" | "settling" | "settled" | "failed";

const stateRef = yield* Ref.make<DuelProgress>({
  state: "idle",
  duelId,
  timestamp: Date.now(),
});

const updateState = (newState: DuelPipelineState, roundId?: number) =>
  Ref.update(stateRef, (current) => ({
    ...current,
    state: newState,
    timestamp: Date.now(),
    roundId: roundId ?? current.roundId,
  })).pipe(
    Effect.tap(() => Effect.logInfo(`Duel ${duelId}: ${newState}`))
  );
```

---

## Resource Management with acquireRelease

[`EventService.ts`](packages/nextjs/services/effectServices/EventService.ts) manages WebSocket connections with guaranteed cleanup:

```ts
const makeWebSocket = Effect.acquireRelease(
  // Acquire: open WebSocket, subscribe to contract events
  Effect.tryPromise({
    try: async (): Promise<DuelWebSocket> => {
      return new Promise((resolve, reject) => {
        const ws = new WebSocket(config.wsUrl);
        ws.onopen = () => {
          ws.send(JSON.stringify({
            jsonrpc: "2.0", method: "eth_subscribe",
            params: ["logs", { address: config.contractAddress, topics: [...] }]
          }));
          resolve({ ws, close: () => ws.close() });
        };
        ws.onerror = (error) => reject(new Error(`WebSocket failed: ${error}`));
      });
    },
    catch: (error) => new EventError({ message: `..`, cause: error }),
  }),
  // Release: close WebSocket — guaranteed to run even on fiber interruption
  (duelWs) => Effect.sync(() => duelWs.close()).pipe(
    Effect.tap(() => Effect.logInfo("EventService: WebSocket connection closed"))
  )
);
```

If the WebSocket fails, the service falls back to polling via `Stream.repeatEffect` with `Schedule.spaced("5 seconds")`.

---

## Cancellation with Fiber.interrupt

[`DuelService.ts`](packages/nextjs/services/effectServices/DuelService.ts) supports cancelling long-running FDC attestation fibers:

```ts
const cancelPendingAttestation = (
  fiber: Fiber.RuntimeFiber<any, any>
): Effect.Effect<void, never> =>
  Fiber.interrupt(fiber).pipe(
    Effect.tap(() => Effect.logWarning("Duel attestation cancelled by user")),
    Effect.asVoid,
    Effect.catchAll((error) =>
      Effect.logError(`Failed to cancel attestation: ${error}`).pipe(Effect.asVoid)
    )
  );
```

This is essential for the FDC pipeline which can take up to 10 minutes — users can cancel at any point, and the fiber interruption propagates through the entire Effect chain, triggering `acquireRelease` cleanup handlers.

---

## Server-Side Runtime Execution

Effect-TS is not just used as a type-level abstraction. It runs in production on the server via Next.js API routes.

[`/api/ftso-prices/route.ts`](packages/nextjs/app/api/ftso-prices/route.ts):

```ts
const MainLayer = Layer.provide(FtsoServiceLive, ConfigServiceLive);

export async function GET() {
  const program = Effect.gen(function* () {
    const ftsoService = yield* FtsoService;
    const feedIds = Object.values(FEED_IDS);
    const prices = yield* ftsoService.getMultiplePrices(feedIds);
    return prices;
  });

  const prices = await Effect.runPromise(program.pipe(Effect.provide(MainLayer)));
  return NextResponse.json({ success: true, prices: prices.map(serializePriceData) });
}
```

`Effect.runPromise()` is the boundary between the Effect world and the Node.js runtime. The composed `MainLayer` resolves all dependencies at the edge.

---

## How to Test

```bash
# Start the Next.js dev server
cd packages/nextjs
yarn dev

# Call the Effect-powered API route
curl http://localhost:3000/api/ftso-prices
```

Expected response:

```json
{
  "success": true,
  "timestamp": 1738961234567,
  "prices": [
    {
      "feedId": "0x01464c522f55534400000000000000000000000000",
      "value": "123456789",
      "decimals": 5,
      "timestamp": 1738961230,
      "formatted": 1234.56789
    }
  ],
  "meta": {
    "effectRuntime": "Effect.runPromise",
    "feedCount": 5,
    "chain": "Coston2 Testnet (Chain ID 114)"
  }
}
```

---

## File Reference

| File | Lines | Purpose |
|------|-------|---------|
| [`services/effectServices/errors.ts`](packages/nextjs/services/effectServices/errors.ts) | 64 | 11 tagged error types + `AppError` union |
| [`services/effectServices/config.ts`](packages/nextjs/services/effectServices/config.ts) | 31 | `ConfigService` with `Context.Tag` + `Layer.succeed` |
| [`services/effectServices/FtsoService.ts`](packages/nextjs/services/effectServices/FtsoService.ts) | 96 | FTSO v2 price reads, parallel fetch, streaming |
| [`services/effectServices/FdcService.ts`](packages/nextjs/services/effectServices/FdcService.ts) | 163 | FDC Web2Json 4-step attestation pipeline |
| [`services/effectServices/RngService.ts`](packages/nextjs/services/effectServices/RngService.ts) | 63 | Flare Secure RNG reads |
| [`services/effectServices/FlockService.ts`](packages/nextjs/services/effectServices/FlockService.ts) | 84 | FLock AI API with timeout + fallback |
| [`services/effectServices/EventService.ts`](packages/nextjs/services/effectServices/EventService.ts) | 205 | WebSocket event stream with acquireRelease |
| [`services/effectServices/DuelService.ts`](packages/nextjs/services/effectServices/DuelService.ts) | 145 | State machine (Ref), cancellation (Fiber.interrupt) |
| [`services/effectServices/index.ts`](packages/nextjs/services/effectServices/index.ts) | 28 | `AppLayerLive` composition + re-exports |
| [`app/api/ftso-prices/route.ts`](packages/nextjs/app/api/ftso-prices/route.ts) | 79 | Server-side `Effect.runPromise()` execution |
| [`app/api/fdc/route.ts`](packages/nextjs/app/api/fdc/route.ts) | 233 | FDC submit/poll/settle API (consumed by FdcService) |
