"use client";

import { formatEther } from "viem";
import { motion } from "framer-motion";
import { Address } from "@scaffold-ui/components";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

const FEED_IDS: Record<string, string> = {
  "FLR/USD": "0x01464c522f55534400000000000000000000000000",
  "BTC/USD": "0x014254432f55534400000000000000000000000000",
  "ETH/USD": "0x014554482f55534400000000000000000000000000",
  "XRP/USD": "0x015852502f55534400000000000000000000000000",
  "SOL/USD": "0x01534f4c2f55534400000000000000000000000000",
};

interface DuelCardProps {
  duel: any;
  onJoin: (id: bigint) => void;
  index?: number;
}

export const DuelCard = ({ duel, onJoin, index = 0 }: DuelCardProps) => {
  const deadline = Number(duel.deadline) * 1000;
  const now = Date.now();
  const timeLeft = Math.max(0, deadline - now);
  const minutes = Math.floor(timeLeft / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const duelType = Number(duel.duelType || 0); // 0 = PRICE, 1 = DATA
  const isDataDuel = duelType === 1;

  const feedId = duel.feedId as string;
  const feedName = isDataDuel
    ? "Data Duel"
    : Object.keys(FEED_IDS).find(key => FEED_IDS[key].toLowerCase() === feedId.toLowerCase()) ||
      "Unknown";
  const symbol = isDataDuel ? "DATA" : feedName.split("/")[0];

  // Creator chose playerAPrediction = true means ABOVE/UP
  const creatorPrediction = duel.playerAPrediction;
  // The accepter takes the opposite side
  const accepterSide = creatorPrediction ? "DOWN" : "UP";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative flex items-center gap-4 rounded-xl card-glass hover-lift cursor-pointer overflow-hidden"
      onClick={() => onJoin(duel.id)}
    >
      {/* Left color accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          creatorPrediction ? "bg-[#22C55E]" : "bg-[#EF4444]"
        }`}
      />

      {/* PRICE/DATA badge in top-right */}
      <div className="absolute top-2 right-2 z-10">
        <div
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            isDataDuel
              ? "bg-[#06B6D4] text-white"
              : "bg-[#8B5CF6] text-white"
          }`}
        >
          {isDataDuel ? "DATA" : "PRICE"}
        </div>
      </div>

      <div className="flex items-center justify-between w-full px-5 py-4 pl-6">
        {/* Asset + Direction */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.15)] flex items-center justify-center">
            <span className="font-bold text-sm text-[#8B5CF6]">{symbol}</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-200">{feedName}</div>
            <div className="flex items-center gap-1 text-xs">
              {creatorPrediction ? (
                <span className="flex items-center gap-0.5 text-[#22C55E]">
                  <ArrowUpIcon className="w-3 h-3" /> {isDataDuel ? "ABOVE" : "UP"}
                </span>
              ) : (
                <span className="flex items-center gap-0.5 text-[#EF4444]">
                  <ArrowDownIcon className="w-3 h-3" /> {isDataDuel ? "BELOW" : "DOWN"}
                </span>
              )}
              <span className="text-slate-500">
                {isDataDuel ? "threshold" : "by creator"}
              </span>
            </div>
          </div>
        </div>

        {/* Stake */}
        <div className="text-right">
          <div className="font-mono text-sm font-bold text-[#F59E0B] tabular-nums">
            {parseFloat(formatEther(duel.stakeAmount)).toFixed(2)} FLR
          </div>
          <div className="text-xs text-slate-500">
            {minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`} left
          </div>
        </div>

        {/* Creator address */}
        <div className="hidden md:block">
          <Address address={duel.playerA} size="xs" />
        </div>

        {/* Accept button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`btn btn-sm border-0 font-bold text-white ${
            accepterSide === "UP"
              ? "bg-[#22C55E] hover:bg-[#16A34A] btn-glow btn-glow-green"
              : "bg-[#EF4444] hover:bg-[#DC2626] btn-glow btn-glow-red"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onJoin(duel.id);
          }}
        >
          {accepterSide === "UP" ? (
            <span className="flex items-center gap-1">
              <ArrowUpIcon className="w-3.5 h-3.5" /> BET UP
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <ArrowDownIcon className="w-3.5 h-3.5" /> BET DOWN
            </span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
