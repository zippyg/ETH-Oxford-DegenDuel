import { Context, Either, Effect, Layer, Schedule, Stream } from "effect";
import { FtsoError } from "./errors";
import { ConfigService } from "./config";

export interface PriceData {
  readonly feedId: string;
  readonly value: bigint;
  readonly decimals: number;
  readonly timestamp: number;
  readonly formatted: number;
}

export interface IFtsoService {
  readonly getCurrentPrice: (feedId: string) => Effect.Effect<PriceData, FtsoError>;
  readonly getMultiplePrices: (feedIds: string[]) => Effect.Effect<PriceData[], never>;
  readonly streamPrices: (feedIds: string[], intervalMs: number) => Stream.Stream<PriceData[], never>;
}

export class FtsoService extends Context.Tag("FtsoService")<
  FtsoService,
  IFtsoService
>() {}

// Feed ID constants
export const FEED_IDS = {
  "FLR/USD": "0x01464c522f55534400000000000000000000000000",
  "BTC/USD": "0x014254432f55534400000000000000000000000000",
  "ETH/USD": "0x014554482f55534400000000000000000000000000",
  "XRP/USD": "0x015852502f55534400000000000000000000000000",
  "SOL/USD": "0x01534f4c2f55534400000000000000000000000000",
} as const;

export const FtsoServiceLive = Layer.effect(
  FtsoService,
  Effect.gen(function* () {
    const config = yield* ConfigService;

    const getCurrentPrice = (feedId: string): Effect.Effect<PriceData, FtsoError> =>
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
                data: encodeFunctionCall("getCurrentPrice", feedId),
              }, "latest"],
              id: 1,
            }),
          });
          const json = await response.json();
          if (json.error) throw new Error(json.error.message);
          return decodePriceResult(feedId, json.result);
        },
        catch: (error) => new FtsoError({ feedId, message: `Failed to read FTSO price: ${error}`, cause: error }),
      }).pipe(
        Effect.retry(Schedule.exponential("500 millis").pipe(Schedule.compose(Schedule.recurs(3)))),
        Effect.tap((price) => Effect.logInfo(`FTSO price read: ${feedId} = ${price.formatted}`)),
      );

    const getMultiplePrices = (feedIds: string[]): Effect.Effect<PriceData[], never> =>
      Effect.gen(function* () {
        // Use Effect.either per feed so one failure doesn't kill the batch
        const results = yield* Effect.all(
          feedIds.map((id) => Effect.either(getCurrentPrice(id))),
          { concurrency: "unbounded" },
        );

        const successes: PriceData[] = [];
        for (const result of results) {
          if (Either.isRight(result)) {
            successes.push(result.right);
          } else {
            yield* Effect.logWarning(`FTSO feed failed (partial ok): ${result.left.message}`);
          }
        }

        return successes;
      });

    const streamPrices = (feedIds: string[], intervalMs: number): Stream.Stream<PriceData[], never> =>
      Stream.repeatEffect(getMultiplePrices(feedIds)).pipe(
        Stream.schedule(Schedule.spaced(`${intervalMs} millis`)),
      );

    return { getCurrentPrice, getMultiplePrices, streamPrices };
  })
);

// Helper: encode getCurrentPrice(bytes21) function call
function encodeFunctionCall(fn: string, feedId: string): string {
  // getCurrentPrice selector: keccak256("getCurrentPrice(bytes21)") = first 4 bytes
  // For simplicity, we'll use the known selector
  const selector = "0xa908f021"; // getCurrentPrice(bytes21)
  const paddedFeedId = feedId.slice(2).padEnd(64, "0");
  return selector + paddedFeedId;
}

// Helper: decode (uint256, int8, uint64) tuple
function decodePriceResult(feedId: string, hexData: string): PriceData {
  const data = hexData.slice(2);
  const value = BigInt("0x" + data.slice(0, 64));
  // int8 is sign-extended to 32 bytes in ABI — read last byte only
  const lastByte = parseInt(data.slice(126, 128), 16);
  const decimals = lastByte > 127 ? lastByte - 256 : lastByte; // int8 sign handling
  const timestamp = Number(BigInt("0x" + data.slice(128, 192)));
  const formatted = Number(value) * Math.pow(10, -decimals);
  return { feedId, value, decimals, timestamp, formatted };
}
