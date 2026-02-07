import { Context, Effect, Layer, Schedule } from "effect";
import { FlockError } from "./errors";
import { ConfigService } from "./config";

export interface StrategyHint {
  readonly confidence: number;
  readonly rationale: string;
  readonly alternativeThreshold: number | null;
}

export interface IFlockService {
  readonly getStrategyHint: (prompt: string) => Effect.Effect<StrategyHint, FlockError>;
  readonly analyzeOutcome: (prompt: string) => Effect.Effect<string, FlockError>;
}

export class FlockService extends Context.Tag("FlockService")<
  FlockService,
  IFlockService
>() {}

export const FlockServiceLive = Layer.effect(
  FlockService,
  Effect.gen(function* () {
    const config = yield* ConfigService;

    const callFlock = (prompt: string, systemPrompt: string): Effect.Effect<string, FlockError> =>
      Effect.tryPromise({
        try: async () => {
          const response = await fetch(config.flockApiUrl, {
            method: "POST",
            headers: {
              "accept": "application/json",
              "Content-Type": "application/json",
              "x-litellm-api-key": config.flockApiKey,
            },
            body: JSON.stringify({
              model: "qwen3-30b-a3b-instruct-2507",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
              ],
              max_tokens: 2048,
              temperature: 0.7,
              stream: false,
            }),
          });
          if (!response.ok) throw new Error(`FLock API returned ${response.status}`);
          const data = await response.json();
          return data.choices[0].message.content;
        },
        catch: (error) => new FlockError({ message: `FLock API failed: ${error}`, cause: error }),
      }).pipe(
        Effect.timeout("10 seconds"),
        Effect.catchTag("TimeoutException", () =>
          Effect.fail(new FlockError({ message: "FLock API request timed out after 10 seconds" }))
        ),
        Effect.retry(Schedule.recurs(1)),
      );

    const getStrategyHint = (prompt: string): Effect.Effect<StrategyHint, FlockError> =>
      callFlock(prompt, "You are a crypto market analyst for DegenDuel prediction game. Respond with JSON: {confidence: 0-100, rationale: string, alternativeThreshold: number|null}").pipe(
        Effect.map((response) => {
          try {
            return JSON.parse(response) as StrategyHint;
          } catch {
            return { confidence: 50, rationale: response.slice(0, 200), alternativeThreshold: null };
          }
        }),
        Effect.catchAll(() => Effect.succeed({
          confidence: 50,
          rationale: "AI analysis temporarily unavailable. Make your own call!",
          alternativeThreshold: null,
        })),
      );

    const analyzeOutcome = (prompt: string): Effect.Effect<string, FlockError> =>
      callFlock(prompt, "You are an analyst for DegenDuel. Explain in 2-3 sentences what drove the outcome. Keep under 75 words.").pipe(
        Effect.catchAll(() => Effect.succeed("Analysis unavailable.")),
      );

    return { getStrategyHint, analyzeOutcome };
  })
);
