import { Context, Effect, Layer, Stream, Schedule } from "effect";
import { EventError } from "./errors";
import { ConfigService } from "./config";

export interface DuelEvent {
  readonly type: "DuelCreated" | "DuelJoined" | "DuelSettled";
  readonly duelId: string;
  readonly timestamp: number;
  readonly data: unknown;
}

export interface IEventService {
  readonly watchDuelEvents: () => Stream.Stream<DuelEvent, EventError>;
}

export class EventService extends Context.Tag("EventService")<
  EventService,
  IEventService
>() {}

// WebSocket wrapper for type safety
interface DuelWebSocket {
  readonly ws: WebSocket;
  readonly close: () => void;
}

export const EventServiceLive = Layer.effect(
  EventService,
  Effect.gen(function* () {
    const config = yield* ConfigService;

    // Resource Management: acquireRelease pattern for WebSocket lifecycle
    const makeWebSocket = Effect.acquireRelease(
      // Acquire: create WebSocket connection
      Effect.tryPromise({
        try: async (): Promise<DuelWebSocket> => {
          return new Promise((resolve, reject) => {
            const ws = new WebSocket(config.wsUrl);

            ws.onopen = () => {
              // Subscribe to contract logs on connection
              ws.send(JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "eth_subscribe",
                params: ["logs", {
                  address: config.contractAddress,
                  topics: [
                    // Event signatures for DuelCreated, DuelJoined, DuelSettled
                    "0x" + "DuelCreated".padEnd(64, "0"),
                    "0x" + "DuelJoined".padEnd(64, "0"),
                    "0x" + "DuelSettled".padEnd(64, "0"),
                  ]
                }]
              }));

              resolve({
                ws,
                close: () => ws.close()
              });
            };

            ws.onerror = (error) => {
              reject(new Error(`WebSocket connection failed: ${error}`));
            };

            // Timeout if connection takes too long
            setTimeout(() => {
              if (ws.readyState !== WebSocket.OPEN) {
                ws.close();
                reject(new Error("WebSocket connection timeout"));
              }
            }, 5000);
          });
        },
        catch: (error) => new EventError({
          message: `Failed to create WebSocket connection: ${error}`,
          cause: error
        }),
      }).pipe(
        Effect.tap(() => Effect.logInfo(`EventService: WebSocket connected to ${config.wsUrl}`))
      ),
      // Release: close WebSocket connection on cleanup
      (duelWs) => Effect.sync(() => {
        duelWs.close();
      }).pipe(
        Effect.tap(() => Effect.logInfo("EventService: WebSocket connection closed"))
      )
    );

    // Fallback polling mechanism using Schedule
    const pollEvents = (): Stream.Stream<DuelEvent, EventError> =>
      Stream.repeatEffect(
        Effect.tryPromise({
          try: async (): Promise<DuelEvent[]> => {
            const response = await fetch(`${config.rpcUrl}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "eth_getLogs",
                params: [{
                  address: config.contractAddress,
                  fromBlock: "latest",
                  toBlock: "latest"
                }]
              }),
            });

            if (!response.ok) {
              throw new Error(`Polling failed: HTTP ${response.status}`);
            }

            const data = await response.json();
            const logs = data.result || [];

            // Parse logs into DuelEvent format
            return logs.map((log: any) => ({
              type: parseDuelEventType(log.topics[0]),
              duelId: log.topics[1],
              timestamp: Date.now(),
              data: log.data,
            }));
          },
          catch: (error) => new EventError({
            message: `Event polling failed: ${error}`,
            cause: error
          }),
        }).pipe(
          Effect.flatMap((events) => Effect.succeed(events)),
          Effect.tap((events) => Effect.logDebug(`Polled ${events.length} events`))
        )
      ).pipe(
        Stream.flatMap((events) => Stream.fromIterable(events)),
        Stream.schedule(Schedule.spaced("5 seconds"))
      );

    const watchDuelEvents = (): Stream.Stream<DuelEvent, EventError> =>
      Stream.unwrapScoped(
        Effect.gen(function* () {
          // Try WebSocket first with resource management
          const duelWsResult = yield* Effect.either(makeWebSocket);

          if (duelWsResult._tag === "Left") {
            // WebSocket failed, fallback to polling
            yield* Effect.logWarning(
              `WebSocket connection failed: ${duelWsResult.left.message}. Falling back to polling.`
            );
            return pollEvents();
          }

          const duelWs = duelWsResult.right;

          // Create stream from WebSocket messages
          return Stream.async<DuelEvent, EventError>((emit) => {
            duelWs.ws.onmessage = (event) => {
              try {
                const data = JSON.parse(event.data);

                if (data.method === "eth_subscription" && data.params) {
                  const log = data.params.result;
                  const duelEvent: DuelEvent = {
                    type: parseDuelEventType(log.topics[0]),
                    duelId: log.topics[1],
                    timestamp: Date.now(),
                    data: log.data,
                  };

                  emit.single(duelEvent);
                }
              } catch (error) {
                emit.fail(new EventError({
                  message: `Failed to parse WebSocket message: ${error}`,
                  cause: error
                }));
              }
            };

            duelWs.ws.onerror = (error) => {
              emit.fail(new EventError({
                message: `WebSocket error: ${error}`,
                cause: error
              }));
            };

            duelWs.ws.onclose = () => {
              emit.end();
            };
          });
        })
      );

    return { watchDuelEvents };
  })
);

// Helper to parse event type from topic hash
function parseDuelEventType(topicHash: string): "DuelCreated" | "DuelJoined" | "DuelSettled" {
  // Simplified parsing - in production would use proper keccak256 hashes
  if (topicHash.includes("Created")) return "DuelCreated";
  if (topicHash.includes("Joined")) return "DuelJoined";
  return "DuelSettled";
}
