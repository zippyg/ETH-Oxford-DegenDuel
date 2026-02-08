"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "@scaffold-ui/components";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { PriceTicker } from "~~/components/degenduel/PriceTicker";
import { CountdownTimer } from "~~/components/degenduel/CountdownTimer";
import { fireWinConfetti } from "~~/components/degenduel/WinConfetti";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

const FEED_NAMES: Record<string, string> = {
  "0x01464c522f55534400000000000000000000000000": "FLR/USD",
  "0x014254432f55534400000000000000000000000000": "BTC/USD",
  "0x014554482f55534400000000000000000000000000": "ETH/USD",
  "0x015852502f55534400000000000000000000000000": "XRP/USD",
  "0x01534f4c2f55534400000000000000000000000000": "SOL/USD",
};

const STATUS_CONFIG = {
  0: { label: "OPEN", color: "#E62058", bg: "rgba(230,32,88,0.1)" },
  1: { label: "ACTIVE", color: "#6C93EC", bg: "rgba(108,147,236,0.1)" },
  2: { label: "SETTLED", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  3: { label: "CANCELLED", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  4: { label: "EXPIRED", color: "#475569", bg: "rgba(71,85,105,0.1)" },
};

const DUEL_TYPE_LABELS = {
  0: "PRICE",
  1: "DATA",
};

const DuelDetailPage = () => {
  const { id } = useParams();
  const { address: userAddress } = useAccount();
  const [currentPrice, setCurrentPrice] = useState<string | null>(null);
  const [isSettling, setIsSettling] = useState(false);

  const duelId = id ? BigInt(id as string) : undefined;

  const { data: duel, refetch: refetchDuel } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getDuel",
    args: [duelId],
    watch: true,
  });

  const { data: priceData } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getCurrentPrice",
    args: [duel?.feedId as `0x${string}`],
    watch: true,
  });

  const { writeContractAsync } = useScaffoldWriteContract("DegenDuel");

  useEffect(() => {
    if (priceData && Array.isArray(priceData) && priceData.length >= 2) {
      const value = priceData[0] as bigint;
      const decimals = Math.abs(Number(priceData[1]));
      const price = (Number(value) / Math.pow(10, decimals)).toFixed(decimals > 4 ? 4 : decimals);
      setCurrentPrice(price);
    }
  }, [priceData]);

  if (!duel) {
    return (
      <div className="min-h-screen">
        <PriceTicker />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="text-center text-slate-400">Loading duel...</div>
        </div>
      </div>
    );
  }

  const status = Number(duel.status);
  const duelType = Number(duel.duelType);
  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
  const feedName = FEED_NAMES[duel.feedId as string] || "Unknown Asset";
  const stake = formatEther(duel.stakeAmount || 0n);
  const deadline = Number(duel.deadline);
  const now = Math.floor(Date.now() / 1000);
  const isPastDeadline = now > deadline;
  const canSettle = status === 1 && isPastDeadline;
  const isSettled = status === 2;
  const isUserPlayerA = userAddress && duel.playerA.toLowerCase() === userAddress.toLowerCase();
  const isUserPlayerB = userAddress && duel.playerB && duel.playerB.toLowerCase() === userAddress.toLowerCase();
  const isUserInDuel = isUserPlayerA || isUserPlayerB;
  const winner = duel.winner;
  const isUserWinner = userAddress && winner && winner.toLowerCase() === userAddress.toLowerCase();
  const payout = stake ? (parseFloat(stake) * 2).toFixed(4) : "0.0000";

  const playerAPredictionLabel = duelType === 0 ? (duel.playerAPrediction ? "UP" : "DOWN") : (duel.playerAPrediction ? "ABOVE" : "BELOW");
  const playerBPredictionLabel = duelType === 0
    ? (duel.playerAPrediction ? "DOWN" : "UP")
    : (duel.playerAPrediction ? "BELOW" : "ABOVE");

  const handleSettle = async () => {
    if (!duelId) return;
    setIsSettling(true);
    try {
      await writeContractAsync({
        functionName: "settlePriceDuel",
        args: [duelId],
      });
      await refetchDuel();
      if (isUserWinner) {
        fireWinConfetti();
      }
    } catch (error) {
      console.error("Error settling duel:", error);
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <div className="min-h-screen">
      <PriceTicker />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-4xl font-black text-[#E62058]">DUEL #{id}</h1>
          <div
            className="px-3 py-1 rounded-lg text-xs font-bold uppercase"
            style={{ color: statusConfig.color, backgroundColor: statusConfig.bg }}
          >
            {statusConfig.label}
          </div>
        </motion.div>

        {/* Current Price Section (for PRICE duels) */}
        {duelType === 0 && currentPrice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl card-glass-dense p-6 mb-6"
          >
            <div className="text-center">
              <div className="text-slate-500 text-xs uppercase mb-2">Current Price</div>
              <div className="text-4xl font-black font-mono tabular-nums text-[#E8E8E8]">
                ${currentPrice}
              </div>
              <div className="text-slate-400 text-sm mt-1">{feedName}</div>
            </div>
          </motion.div>
        )}

        {/* Players Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          {/* Player A */}
          <div className="rounded-2xl card-glass-dense p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="text-slate-400 text-xs uppercase">Player A</div>
              {isSettled && winner && winner.toLowerCase() === duel.playerA.toLowerCase() && (
                <CheckCircleIcon className="w-5 h-5 text-[#10B981]" />
              )}
            </div>
            <div className="overflow-hidden">
              <Address address={duel.playerA} format="long" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {duel.playerAPrediction ? (
                  <ArrowTrendingUpIcon className="w-5 h-5 text-[#10B981]" />
                ) : (
                  <ArrowTrendingDownIcon className="w-5 h-5 text-[#EF4444]" />
                )}
                <span className="font-bold text-sm">{playerAPredictionLabel}</span>
              </div>
              <div className="font-mono tabular-nums text-slate-300">
                {stake} FLR
              </div>
            </div>
          </div>

          {/* Player B */}
          <div className="rounded-2xl card-glass-dense p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="text-slate-400 text-xs uppercase">Player B</div>
              {isSettled && winner && duel.playerB && winner.toLowerCase() === duel.playerB.toLowerCase() && (
                <CheckCircleIcon className="w-5 h-5 text-[#10B981]" />
              )}
            </div>
            {duel.playerB && duel.playerB !== "0x0000000000000000000000000000000000000000" ? (
              <>
                <div className="overflow-hidden">
                  <Address address={duel.playerB} format="long" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!duel.playerAPrediction ? (
                      <ArrowTrendingUpIcon className="w-5 h-5 text-[#10B981]" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-5 h-5 text-[#EF4444]" />
                    )}
                    <span className="font-bold text-sm">{playerBPredictionLabel}</span>
                  </div>
                  <div className="font-mono tabular-nums text-slate-300">
                    {stake} FLR
                  </div>
                </div>
              </>
            ) : (
              <div className="text-slate-500 text-sm">Waiting for opponent...</div>
            )}
          </div>
        </motion.div>

        {/* Duel Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl card-glass-dense p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-[#E62058] mb-4">Duel Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-slate-500 text-xs uppercase mb-1">Type</div>
              <div className="font-bold">{DUEL_TYPE_LABELS[duelType as keyof typeof DUEL_TYPE_LABELS]}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs uppercase mb-1">Asset</div>
              <div className="font-bold">{feedName}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs uppercase mb-1">Threshold</div>
              <div className="font-mono tabular-nums">
                ${(Number(duel.priceThreshold) / Math.pow(10, Number(duel.priceDecimals))).toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-xs uppercase mb-1">Time Remaining</div>
              <div className="flex items-center gap-2">
                <CountdownTimer deadline={deadline} size={40} totalDuration={90} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settle Button */}
        {canSettle && isUserInDuel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6"
          >
            <button
              onClick={handleSettle}
              disabled={isSettling}
              className="w-full btn-primary py-4 px-6 text-lg font-bold rounded-xl"
            >
              {isSettling ? "SETTLING..." : "SETTLE DUEL"}
            </button>
          </motion.div>
        )}

        {/* Result Section */}
        {isSettled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl card-glass-dense p-8 text-center"
          >
            <h2 className="text-2xl font-black text-[#E62058] mb-4">DUEL SETTLED</h2>
            {winner && winner !== "0x0000000000000000000000000000000000000000" ? (
              <>
                <div className="mb-4">
                  <div className="text-slate-400 text-sm uppercase mb-2">Winner</div>
                  <div className="overflow-hidden">
                    <Address address={winner} format="long" />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-slate-400 text-sm uppercase mb-2">Payout</div>
                  <div className="text-3xl font-black font-mono tabular-nums text-[#10B981]">
                    {payout} FLR
                  </div>
                </div>
                {isUserWinner && (
                  <div className="px-6 py-3 rounded-xl bg-[rgba(16,185,129,0.1)] inline-block">
                    <span className="text-[#10B981] font-black text-xl">YOU WON!</span>
                  </div>
                )}
                {isUserInDuel && !isUserWinner && (
                  <div className="px-6 py-3 rounded-xl bg-[rgba(239,68,68,0.1)] inline-block">
                    <span className="text-[#EF4444] font-black text-xl">YOU LOST</span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-slate-500">No winner (draw or cancelled)</div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DuelDetailPage;
