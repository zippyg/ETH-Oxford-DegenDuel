"use client";

import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { Address } from "@scaffold-ui/components";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { TrophyIcon, FireIcon } from "@heroicons/react/24/solid";

interface LeaderboardEntry {
  address: string;
  wins: number;
  losses: number;
  earnings: string;
  streak: number;
  rank: number;
}

const RANK_COLORS: Record<number, { bg: string; text: string; glow: string }> = {
  1: { bg: "bg-[rgba(245,158,11,0.1)]", text: "text-[#F59E0B]", glow: "border-glow-gold" },
  2: { bg: "bg-[rgba(148,163,184,0.08)]", text: "text-slate-300", glow: "" },
  3: { bg: "bg-[rgba(180,130,80,0.08)]", text: "text-[#CD7F32]", glow: "" },
};

const LeaderboardRow = ({
  entry,
  isUser,
  index,
}: {
  entry: LeaderboardEntry;
  isUser: boolean;
  index: number;
}) => {
  const rankStyle = RANK_COLORS[entry.rank];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all hover-lift ${
        isUser
          ? "border border-[#8B5CF6]/30 border-glow-purple bg-[rgba(139,92,246,0.05)]"
          : rankStyle
          ? `${rankStyle.bg} ${rankStyle.glow}`
          : "bg-[rgba(8,11,22,0.3)]"
      }`}
    >
      {/* Rank */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm ${
          rankStyle ? rankStyle.text : "text-slate-500"
        }`}
      >
        {entry.rank === 1 ? (
          <TrophyIcon className="w-5 h-5 text-[#F59E0B]" />
        ) : (
          `#${entry.rank}`
        )}
      </div>

      {/* Address */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Address address={entry.address} size="xs" />
          {isUser && (
            <span className="px-1.5 py-0.5 bg-[#8B5CF6] rounded text-[9px] font-bold text-white">
              YOU
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-right">
        <div>
          <div className="font-mono text-sm tabular-nums text-slate-200">
            {entry.wins}W / {entry.losses}L
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="font-mono text-sm tabular-nums text-[#22C55E]">
            +{entry.earnings} FLR
          </div>
        </div>
        {entry.streak >= 3 && (
          <div className="flex items-center gap-0.5 text-[#F59E0B]">
            <FireIcon className="w-4 h-4" />
            <span className="font-mono text-xs font-bold">{entry.streak}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const Leaderboard = ({ fullPage = false }: { fullPage?: boolean }) => {
  const { address: connectedAddress } = useAccount();

  const { data: stats } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getProtocolStats",
    watch: true,
  });

  const { data: playerStats } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getPlayerStats",
    args: [connectedAddress ?? "0x0000000000000000000000000000000000000000"],
    watch: true,
    query: { enabled: !!connectedAddress },
  });

  const totalDuels = stats ? Number(stats[0]) : 0;
  const settledDuels = stats ? Number(stats[1]) : 0;
  const volume = stats ? formatEther(stats[2]) : "0";

  const playerWins =
    playerStats && Array.isArray(playerStats) && playerStats.length >= 2
      ? Number(playerStats[0])
      : 0;
  const playerEarnings =
    playerStats && Array.isArray(playerStats) && playerStats.length >= 2
      ? parseFloat(formatEther(playerStats[1])).toFixed(4)
      : "0";

  // Build a mock leaderboard since we don't have a getLeaderboard function
  // In production, this would query contract events
  const entries: LeaderboardEntry[] = [];
  if (connectedAddress) {
    entries.push({
      address: connectedAddress,
      wins: playerWins,
      losses: 0,
      earnings: playerEarnings,
      streak: playerWins >= 3 ? playerWins : 0,
      rank: 1,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`rounded-2xl card-glass-dense overflow-hidden ${fullPage ? "" : ""}`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[rgba(148,163,184,0.08)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrophyIcon className="w-5 h-5 text-[#F59E0B]" />
          <h2 className="text-lg font-bold text-slate-100">Leaderboard</h2>
        </div>
        <div className="flex gap-4 text-xs">
          <div>
            <span className="text-slate-500">Duels: </span>
            <span className="font-mono text-[#8B5CF6] tabular-nums">{totalDuels}</span>
          </div>
          <div>
            <span className="text-slate-500">Settled: </span>
            <span className="font-mono text-[#06B6D4] tabular-nums">{settledDuels}</span>
          </div>
          <div>
            <span className="text-slate-500">Volume: </span>
            <span className="font-mono text-[#F59E0B] tabular-nums">{parseFloat(volume).toFixed(2)} FLR</span>
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="p-4 space-y-2">
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">No duels completed yet.</p>
            <p className="text-slate-600 text-xs mt-1">Create or join a duel to appear on the leaderboard.</p>
          </div>
        ) : (
          entries.map((entry, idx) => (
            <LeaderboardRow
              key={entry.address}
              entry={entry}
              isUser={
                connectedAddress?.toLowerCase() === entry.address.toLowerCase()
              }
              index={idx}
            />
          ))
        )}
      </div>

      {/* Protocol stats footer */}
      {fullPage && (
        <div className="px-6 py-4 border-t border-[rgba(148,163,184,0.08)]">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-[#8B5CF6] tabular-nums">{totalDuels}</div>
              <div className="text-xs text-slate-500">Total Duels</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-[#22C55E] tabular-nums">{settledDuels}</div>
              <div className="text-xs text-slate-500">Settled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-[#F59E0B] tabular-nums">
                {parseFloat(volume).toFixed(2)}
              </div>
              <div className="text-xs text-slate-500">Volume (FLR)</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
