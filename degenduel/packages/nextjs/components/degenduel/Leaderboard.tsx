"use client";

import { useMemo } from "react";
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
          ? "border border-[#E62058]/30 border-glow-crimson bg-[rgba(230,32,88,0.05)]"
          : rankStyle
          ? `${rankStyle.bg} ${rankStyle.glow}`
          : "bg-[rgba(5,5,6,0.3)]"
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
            <span className="px-1.5 py-0.5 bg-[#E62058] rounded text-[9px] font-bold text-white">
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
          <div className="font-mono text-sm tabular-nums text-[#10B981]">
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

// DuelStatus enum from the contract
const DUEL_STATUS_SETTLED = 2;

export const Leaderboard = ({ fullPage = false }: { fullPage?: boolean }) => {
  const { address: connectedAddress } = useAccount();

  // Read protocol stats
  const { data: stats } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getProtocolStats",
    watch: true,
  });

  // Read total number of duels to iterate through
  const { data: nextDuelId } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "nextDuelId",
    watch: true,
  });

  // Read individual duels (up to 20 for leaderboard)
  const duelCount = nextDuelId ? Number(nextDuelId) : 0;
  const { data: duel0 } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getDuel",
    args: [BigInt(0)],
    query: { enabled: duelCount > 0 },
  });

  const { data: duel1 } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getDuel",
    args: [BigInt(1)],
    query: { enabled: duelCount > 1 },
  });

  const { data: duel2 } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getDuel",
    args: [BigInt(2)],
    query: { enabled: duelCount > 2 },
  });

  const { data: duel3 } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getDuel",
    args: [BigInt(3)],
    query: { enabled: duelCount > 3 },
  });

  const { data: duel4 } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getDuel",
    args: [BigInt(4)],
    query: { enabled: duelCount > 4 },
  });

  const { data: duel5 } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getDuel",
    args: [BigInt(5)],
    query: { enabled: duelCount > 5 },
  });

  const { data: duel6 } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getDuel",
    args: [BigInt(6)],
    query: { enabled: duelCount > 6 },
  });

  const { data: duel7 } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getDuel",
    args: [BigInt(7)],
    query: { enabled: duelCount > 7 },
  });

  const { data: duel8 } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getDuel",
    args: [BigInt(8)],
    query: { enabled: duelCount > 8 },
  });

  const { data: duel9 } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getDuel",
    args: [BigInt(9)],
    query: { enabled: duelCount > 9 },
  });

  const allDuels = [duel0, duel1, duel2, duel3, duel4, duel5, duel6, duel7, duel8, duel9].filter(
    (d): d is NonNullable<typeof d> => d != null,
  );

  const totalDuels = stats ? Number(stats[0]) : 0;
  const settledDuels = stats ? Number(stats[1]) : 0;
  const volume = stats ? formatEther(stats[2]) : "0";

  const isLoading = duelCount > 0 && allDuels.length === 0;

  // Build leaderboard from on-chain duel data (no event scanning needed)
  const entries: LeaderboardEntry[] = useMemo(() => {
    if (allDuels.length === 0) return [];

    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    // Build player stats map: address -> {wins, losses, totalEarnings, recentResults[]}
    const playerStatsMap = new Map<
      string,
      {
        wins: number;
        losses: number;
        totalEarnings: bigint;
        recentResults: boolean[]; // true = win, false = loss
      }
    >();

    const initPlayer = (addr: string) => {
      const key = addr.toLowerCase();
      if (!playerStatsMap.has(key)) {
        playerStatsMap.set(key, {
          wins: 0,
          losses: 0,
          totalEarnings: 0n,
          recentResults: [],
        });
      }
      return playerStatsMap.get(key)!;
    };

    // Process each duel directly from contract state
    allDuels.forEach(duel => {
      // Only process settled duels (status === 2)
      const status = Number(duel.status);
      if (status !== DUEL_STATUS_SETTLED) return;

      const playerA = duel.playerA as string;
      const playerB = duel.playerB as string;
      const winner = duel.winner as string;
      const payout = duel.payout as bigint;

      if (!winner || winner === ZERO_ADDRESS) return;

      // Process playerA
      if (playerA && playerA !== ZERO_ADDRESS) {
        const statsA = initPlayer(playerA);
        if (playerA.toLowerCase() === winner.toLowerCase()) {
          statsA.wins += 1;
          statsA.totalEarnings += payout || 0n;
          statsA.recentResults.push(true);
        } else {
          statsA.losses += 1;
          statsA.recentResults.push(false);
        }
      }

      // Process playerB
      if (playerB && playerB !== ZERO_ADDRESS) {
        const statsB = initPlayer(playerB);
        if (playerB.toLowerCase() === winner.toLowerCase()) {
          statsB.wins += 1;
          statsB.totalEarnings += payout || 0n;
          statsB.recentResults.push(true);
        } else {
          statsB.losses += 1;
          statsB.recentResults.push(false);
        }
      }
    });

    // Calculate streaks (consecutive wins from most recent games)
    const calculateStreak = (results: boolean[]): number => {
      let streak = 0;
      for (let i = results.length - 1; i >= 0; i--) {
        if (results[i]) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    };

    // Convert to leaderboard entries
    const leaderboardEntries: LeaderboardEntry[] = Array.from(playerStatsMap.entries()).map(
      ([address, pStats]) => ({
        address,
        wins: pStats.wins,
        losses: pStats.losses,
        earnings: parseFloat(formatEther(pStats.totalEarnings)).toFixed(4),
        streak: calculateStreak(pStats.recentResults),
        rank: 0, // Will be assigned after sorting
      }),
    );

    // Sort by wins (descending), then by earnings (descending)
    leaderboardEntries.sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      return parseFloat(b.earnings) - parseFloat(a.earnings);
    });

    // Assign ranks
    leaderboardEntries.forEach((entry, idx) => {
      entry.rank = idx + 1;
    });

    return leaderboardEntries;
  }, [allDuels]);

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
            <span className="font-mono text-[#E62058] tabular-nums">{totalDuels}</span>
          </div>
          <div>
            <span className="text-slate-500">Settled: </span>
            <span className="font-mono text-[#6C93EC] tabular-nums">{settledDuels}</span>
          </div>
          <div>
            <span className="text-slate-500">Volume: </span>
            <span className="font-mono text-[#F59E0B] tabular-nums">{parseFloat(volume).toFixed(2)} FLR</span>
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="p-4 space-y-2">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#E62058]"></div>
            <p className="text-slate-500 text-sm mt-2">Loading leaderboard...</p>
          </div>
        ) : entries.length === 0 ? (
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
              <div className="text-2xl font-bold font-mono text-[#E62058] tabular-nums">{totalDuels}</div>
              <div className="text-xs text-slate-500">Total Duels</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-[#10B981] tabular-nums">{settledDuels}</div>
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
