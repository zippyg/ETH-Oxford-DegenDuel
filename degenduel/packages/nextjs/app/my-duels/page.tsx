"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { PriceTicker } from "~~/components/degenduel/PriceTicker";
import { TrophyIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/solid";

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

interface Duel {
  id: bigint;
  playerA: string;
  playerB: string;
  stakeAmount: bigint;
  deadline: bigint;
  feedId: string;
  priceThreshold: bigint;
  priceDecimals: number;
  dataThreshold: bigint;
  playerAPrediction: boolean;
  status: number;
  winner: string;
  duelType: number;
}

const DuelCard = ({ duel, userAddress }: { duel: Duel; userAddress: string }) => {
  const status = Number(duel.status);
  const duelType = Number(duel.duelType);
  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
  const feedName = FEED_NAMES[duel.feedId] || "Unknown";
  const stake = formatEther(duel.stakeAmount);
  const isUserPlayerA = duel.playerA.toLowerCase() === userAddress.toLowerCase();
  const winner = duel.winner;
  const isSettled = status === 2;
  const isUserWinner = winner && winner.toLowerCase() === userAddress.toLowerCase();

  const userPrediction = isUserPlayerA
    ? duel.playerAPrediction
    : !duel.playerAPrediction;

  const predictionLabel = duelType === 0
    ? (userPrediction ? "UP" : "DOWN")
    : (userPrediction ? "ABOVE" : "BELOW");

  return (
    <Link href={`/duel/${duel.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl card-glass-dense p-6 cursor-pointer hover:shadow-[0_0_30px_rgba(230,32,88,0.15)] transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-slate-500 text-xs uppercase mb-1">Duel #{duel.id.toString()}</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#E62058]">{feedName}</span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                style={{ color: statusConfig.color, backgroundColor: statusConfig.bg }}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>
          <div
            className="px-2 py-1 rounded text-xs font-bold uppercase"
            style={{
              color: duelType === 0 ? "#E62058" : "#6C93EC",
              backgroundColor: duelType === 0 ? "rgba(230,32,88,0.1)" : "rgba(108,147,236,0.1)",
            }}
          >
            {DUEL_TYPE_LABELS[duelType as keyof typeof DUEL_TYPE_LABELS]}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-slate-500 text-xs uppercase mb-1">Your Stake</div>
            <div className="font-mono tabular-nums text-lg font-bold">{stake} FLR</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs uppercase mb-1">Your Prediction</div>
            <div className="flex items-center gap-2">
              {userPrediction ? (
                <ArrowTrendingUpIcon className="w-4 h-4 text-[#10B981]" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 text-[#EF4444]" />
              )}
              <span className="font-bold text-sm">{predictionLabel}</span>
            </div>
          </div>
        </div>

        {isSettled && (
          <div className="pt-4 border-t border-[rgba(148,163,184,0.1)]">
            {isUserWinner ? (
              <div className="flex items-center justify-between">
                <span className="text-[#10B981] font-bold">YOU WON!</span>
                <span className="font-mono tabular-nums text-[#10B981] font-bold">
                  +{(parseFloat(stake) * 2).toFixed(4)} FLR
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-[#EF4444] font-bold">YOU LOST</span>
                <span className="font-mono tabular-nums text-[#EF4444] font-bold">
                  -{stake} FLR
                </span>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </Link>
  );
};

const MyDuelsPage = () => {
  const { address } = useAccount();

  const { data: playerDuels } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getPlayerDuels",
    args: [address],
    watch: true,
  });

  const { data: playerStats } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getPlayerStats",
    args: [address],
    watch: true,
  });

  const duels = (playerDuels || []) as readonly Duel[];
  const wins = playerStats ? Number(playerStats[0]) : 0;
  const earnings = playerStats ? formatEther(playerStats[1] as bigint) : "0";

  if (!address) {
    return (
      <div className="min-h-screen">
        <PriceTicker />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-400 mb-4">Connect your wallet</div>
            <p className="text-slate-500">Connect your wallet to view your duels</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PriceTicker />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <TrophyIcon className="w-8 h-8 text-[#E62058]" />
            <h1 className="text-4xl font-black text-[#E62058]">MY DUELS</h1>
            <TrophyIcon className="w-8 h-8 text-[#E62058]" />
          </div>
          <p className="text-slate-500 text-sm">
            Track your duel history and performance
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="rounded-2xl card-glass-dense p-6 text-center">
            <div className="text-slate-500 text-xs uppercase mb-2">Total Duels</div>
            <div className="text-3xl font-black text-[#E62058]">{duels.length}</div>
          </div>
          <div className="rounded-2xl card-glass-dense p-6 text-center">
            <div className="text-slate-500 text-xs uppercase mb-2">Wins</div>
            <div className="text-3xl font-black text-[#10B981]">{wins}</div>
          </div>
          <div className="rounded-2xl card-glass-dense p-6 text-center">
            <div className="text-slate-500 text-xs uppercase mb-2">Total Earnings</div>
            <div className="text-2xl font-black font-mono tabular-nums text-[#F59E0B]">
              {parseFloat(earnings).toFixed(4)} FLR
            </div>
          </div>
        </motion.div>

        {/* Duels List */}
        {duels.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl card-glass-dense p-12 text-center"
          >
            <div className="text-slate-500 mb-4">
              <TrophyIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">No duels yet. Create your first duel!</p>
            </div>
            <Link href="/create">
              <button className="btn-primary px-6 py-3 rounded-xl font-bold">
                CREATE DUEL
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {duels.map((duel, index) => (
              <motion.div
                key={duel.id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
              >
                <DuelCard duel={duel} userAddress={address} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDuelsPage;
