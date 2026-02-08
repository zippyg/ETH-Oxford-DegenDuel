import { Effect, Layer } from "effect";
import { NextResponse } from "next/server";
import { ConfigServiceLive } from "~~/services/effectServices/config";
import { FEED_IDS, FtsoService, FtsoServiceLive, type PriceData } from "~~/services/effectServices/FtsoService";

/**
 * Effect-TS Runtime Integration Demo
 *
 * This API route demonstrates server-side Effect-TS execution in production.
 * It uses Effect.runPromise() to orchestrate the FtsoService, which reads
 * live FTSO price feeds from Flare's Coston2 testnet.
 *
 * Key Effect-TS patterns demonstrated:
 * - Layer composition (ConfigServiceLive + FtsoServiceLive)
 * - Effect.gen for sequential async operations
 * - Effect.runPromise for server-side execution
 * - Proper error handling with Effect error types
 *
 * This is a REAL integration: the service makes RPC calls to Flare blockchain.
 */

// Build the dependency injection layer
const MainLayer = Layer.provide(FtsoServiceLive, ConfigServiceLive);

// Helper to serialize BigInt values for JSON response
function serializePriceData(price: PriceData) {
  return {
    feedId: price.feedId,
    value: price.value.toString(), // BigInt → string
    decimals: price.decimals,
    timestamp: price.timestamp,
    formatted: price.formatted,
  };
}

export async function GET() {
  const feedIds = Object.values(FEED_IDS);

  // Define the Effect program
  const program = Effect.gen(function* () {
    const ftsoService = yield* FtsoService;
    return yield* ftsoService.getMultiplePrices(feedIds);
  });

  try {
    // Run the Effect program with the composed layer
    const prices = await Effect.runPromise(program.pipe(Effect.provide(MainLayer)));

    const partial = prices.length < feedIds.length;

    // Always return 200 — partial results are fine
    return NextResponse.json({
      success: true,
      partial,
      timestamp: Date.now(),
      prices: prices.map(serializePriceData),
      meta: {
        effectRuntime: "Effect.runPromise",
        successCount: prices.length,
        failedCount: feedIds.length - prices.length,
        totalFeeds: feedIds.length,
        chain: "Coston2 Testnet (Chain ID 114)",
      },
    });
  } catch (error) {
    // Only 500 if the Effect runtime itself crashes
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        meta: {
          effectRuntime: "Effect.runPromise",
          failedStep: "runtime crash",
        },
      },
      { status: 500 },
    );
  }
}
