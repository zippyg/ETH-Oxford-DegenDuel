"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/solid";

interface PriceItem {
  feedId: string;
  value: string;
  decimals: number;
  timestamp: number;
  formatted: number;
}

interface PricesResponse {
  success: boolean;
  timestamp: number;
  prices: PriceItem[];
  partial?: boolean;
  meta: {
    effectRuntime: string;
    feedCount?: number;
    successCount?: number;
    failedCount?: number;
    totalFeeds?: number;
    chain: string;
  };
}

// Map feed IDs to human-readable names
const FEED_ID_MAP: Record<string, string> = {
  "0x01464c522f55534400000000000000000000000000": "FLR/USD",
  "0x014254432f55534400000000000000000000000000": "BTC/USD",
  "0x014554482f55534400000000000000000000000000": "ETH/USD",
  "0x015852502f55534400000000000000000000000000": "XRP/USD",
  "0x01534f4c2f55534400000000000000000000000000": "SOL/USD",
};

// Format price based on asset type
function formatPrice(name: string, price: number): string {
  if (name === "BTC/USD") {
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (name === "ETH/USD" || name === "SOL/USD") {
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    // FLR/USD, XRP/USD - show more decimals for smaller values
    return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  }
}

// Get relative time string
function getRelativeTime(timestampMs: number): string {
  const seconds = Math.floor((Date.now() - timestampMs) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return "over 1h ago";
}

export const EffectPrices = () => {
  const [data, setData] = useState<PricesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [priceChanges, setPriceChanges] = useState<Map<string, "up" | "down">>(new Map());
  const dataRef = useRef<PricesResponse | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const response = await fetch("/api/ftso-prices");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const json = await response.json();

      if (!json.success) {
        throw new Error(json.error || "Failed to fetch prices");
      }

      // Track price changes for animations (use ref to avoid stale closure)
      const prev = dataRef.current;
      if (prev) {
        const changes = new Map<string, "up" | "down">();
        json.prices.forEach((newPrice: PriceItem, idx: number) => {
          const oldPrice = prev.prices[idx];
          if (oldPrice && newPrice.formatted !== oldPrice.formatted) {
            changes.set(newPrice.feedId, newPrice.formatted > oldPrice.formatted ? "up" : "down");
          }
        });
        setPriceChanges(changes);
        setTimeout(() => setPriceChanges(new Map()), 500);
      }

      dataRef.current = json;
      setData(json);
      setLastUpdate(Date.now());
      setError(null);
    } catch (err) {
      // Only show error if we have NO data yet — otherwise keep stale data and silently retry
      if (!dataRef.current) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Update relative time every second
  const [relativeTime, setRelativeTime] = useState("");
  useEffect(() => {
    const updateTime = () => setRelativeTime(getRelativeTime(lastUpdate));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl card-glass-dense overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[rgba(148,163,184,0.08)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h2 className="text-lg font-bold text-slate-100">LIVE PRICES</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-[rgba(79,70,229,0.15)]">
            <div className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse" />
            <span className="text-xs font-mono font-bold text-[#4F46E5]">Effect-TS</span>
          </div>
        </div>
        {!loading && !error && (
          <div className="text-xs text-slate-500">
            <span className="hidden sm:inline">Last update: </span>
            {relativeTime}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && !data ? (
          // Initial loading skeleton
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[rgba(5,5,6,0.3)] animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-5 bg-slate-700 rounded" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-5 bg-slate-700 rounded" />
                  <div className="w-5 h-5 bg-slate-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-8">
            <div className="text-[#EF4444] text-sm font-semibold mb-2">Failed to load prices</div>
            <div className="text-slate-500 text-xs">{error}</div>
            <button
              onClick={fetchPrices}
              className="mt-4 px-4 py-2 bg-[#E62058] text-white rounded-lg text-sm font-semibold hover:bg-[#C61A4A] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : data ? (
          // Price list
          <div className="space-y-2">
            {data.prices.map((price, idx) => {
              const name = FEED_ID_MAP[price.feedId] || "UNKNOWN";
              const change = priceChanges.get(price.feedId);
              const isFlashing = change !== undefined;

              return (
                <motion.div
                  key={price.feedId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center justify-between p-3 rounded-xl bg-[rgba(5,5,6,0.3)] hover:bg-[rgba(5,5,6,0.5)] transition-colors ${
                    isFlashing ? (change === "up" ? "price-flash-green" : "price-flash-red") : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-300 text-sm">{name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-lg tabular-nums text-slate-100">
                      ${formatPrice(name, price.formatted)}
                    </span>
                    {change === "up" ? (
                      <ArrowTrendingUpIcon className="w-5 h-5 text-[#10B981]" />
                    ) : change === "down" ? (
                      <ArrowTrendingDownIcon className="w-5 h-5 text-[#EF4444]" />
                    ) : (
                      <div className="w-5 h-5" /> // Spacer
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : null}

        {/* Footer Info */}
        {data && !error && (
          <div className="mt-6 pt-6 border-t border-[rgba(148,163,184,0.08)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-[#4F46E5]">Powered by Effect.runPromise()</span>
                <span className="mx-2 hidden sm:inline">•</span>
                <span className="block sm:inline mt-1 sm:mt-0">{data.meta.chain}</span>
              </div>
              <div className="text-xs font-mono text-slate-500">
                {data.meta.successCount ?? data.meta.feedCount ?? data.prices.length} feeds
                {data.partial && (
                  <span className="ml-1 text-[#F59E0B]">(partial)</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
