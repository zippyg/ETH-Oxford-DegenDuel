"use client";

import { useEffect, useRef, useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const FEED_IDS = {
  "FLR/USD": "0x01464c522f55534400000000000000000000000000",
  "BTC/USD": "0x014254432f55534400000000000000000000000000",
  "ETH/USD": "0x014554482f55534400000000000000000000000000",
  "XRP/USD": "0x015852502f55534400000000000000000000000000",
  "SOL/USD": "0x01534f4c2f55534400000000000000000000000000",
} as const;

type FeedName = keyof typeof FEED_IDS;

const ASSET_SYMBOLS: Record<string, string> = {
  FLR: "FLR",
  BTC: "BTC",
  ETH: "ETH",
  XRP: "XRP",
  SOL: "SOL",
};

const PriceItem = ({
  feedName,
  price,
  prevPrice,
}: {
  feedName: string;
  price: string;
  prevPrice: string | null;
}) => {
  const [flashClass, setFlashClass] = useState("");
  const symbol = feedName.split("/")[0];

  useEffect(() => {
    if (prevPrice && price !== prevPrice) {
      const current = parseFloat(price);
      const prev = parseFloat(prevPrice);
      if (!isNaN(current) && !isNaN(prev)) {
        setFlashClass(current > prev ? "price-flash-green" : "price-flash-red");
        const timeout = setTimeout(() => setFlashClass(""), 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [price, prevPrice]);

  return (
    <div className="flex items-center gap-2 whitespace-nowrap px-4">
      <span className="text-[#E62058] font-bold text-sm">{ASSET_SYMBOLS[symbol] || symbol}</span>
      <span className={`font-mono text-sm tabular-nums text-slate-200 ${flashClass}`}>
        ${price}
      </span>
    </div>
  );
};

export const PriceTicker = () => {
  const prevPricesRef = useRef<Record<string, string>>({});
  const [prices, setPrices] = useState<Record<string, string>>({});

  const { data: allPrices } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getPrices",
    args: [Object.values(FEED_IDS) as `0x${string}`[]],
    watch: true,
  });

  const feedNames = Object.keys(FEED_IDS) as FeedName[];

  useEffect(() => {
    if (allPrices && Array.isArray(allPrices) && allPrices.length >= 2) {
      const values = allPrices[0] as bigint[];
      const decimals = allPrices[1] as number[];
      const newPrices: Record<string, string> = {};

      feedNames.forEach((feedName, idx) => {
        if (values && decimals && values[idx] !== undefined && decimals[idx] !== undefined) {
          const decimalValue = Math.abs(Number(decimals[idx]));
          newPrices[feedName] = (Number(values[idx]) / Math.pow(10, decimalValue)).toFixed(
            decimalValue > 4 ? 4 : decimalValue,
          );
        }
      });

      prevPricesRef.current = prices;
      setPrices(newPrices);
    }
  }, [allPrices]);

  const tickerItems = feedNames.map(feedName => (
    <PriceItem
      key={feedName}
      feedName={feedName}
      price={prices[feedName] || "---"}
      prevPrice={prevPricesRef.current[feedName] || null}
    />
  ));

  return (
    <div className="w-full overflow-hidden border-b border-[rgba(148,163,184,0.08)] bg-[rgba(5,5,6,0.6)] backdrop-blur-sm">
      <div className="flex animate-marquee py-2">
        {/* Duplicate items for seamless scroll */}
        <div className="flex shrink-0 items-center gap-2">
          {tickerItems}
          <span className="text-slate-700 px-2">|</span>
          {tickerItems}
          <span className="text-slate-700 px-2">|</span>
          {tickerItems}
          <span className="text-slate-700 px-2">|</span>
          {tickerItems}
        </div>
      </div>
    </div>
  );
};
