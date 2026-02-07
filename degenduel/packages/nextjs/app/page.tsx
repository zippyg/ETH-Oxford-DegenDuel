"use client";

import { useState, useEffect } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { useScaffoldReadContract, useScaffoldWriteContract, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { PriceTicker } from "~~/components/degenduel/PriceTicker";
import { ActiveDuel } from "~~/components/degenduel/ActiveDuel";
import { CreateDuel } from "~~/components/degenduel/CreateDuel";
import { AIHintCard } from "~~/components/degenduel/AIHintCard";
import { DuelCard } from "~~/components/degenduel/DuelCard";
import { Leaderboard } from "~~/components/degenduel/Leaderboard";
import { fireWinConfetti, fireBonusConfetti } from "~~/components/degenduel/WinConfetti";
import { notification } from "~~/utils/scaffold-eth";

const Dashboard = () => {
  useAccount();
  const [activeDuel, setActiveDuel] = useState<any>(null);
  const [isSettling, setIsSettling] = useState(false);
  const [bonusTriggeredDuels, setBonusTriggeredDuels] = useState<Set<bigint>>(new Set());

  const { data: openDuels } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getOpenDuels",
    watch: true,
  });

  const { data: activeDuels } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getActiveDuels",
    watch: true,
  });

  const { data: stats } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getProtocolStats",
    watch: true,
  });

  // Watch for BonusTriggered events
  const { data: bonusEvents } = useScaffoldEventHistory({
    contractName: "DegenDuel",
    eventName: "BonusTriggered",
    fromBlock: 0n,
    watch: true,
  });

  // Get active duel price data if one is selected
  const activeFeedId = activeDuel?.feedId as `0x${string}` | undefined;
  const { data: activePriceData } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getCurrentPrice",
    args: [activeFeedId ?? "0x0000000000000000000000000000000000000000000000"],
    watch: true,
    query: { enabled: !!activeFeedId },
  });

  const currentPrice =
    activePriceData && Array.isArray(activePriceData) && activePriceData.length >= 2
      ? Number(activePriceData[0]) / Math.pow(10, Math.abs(Number(activePriceData[1])))
      : undefined;

  // Use threshold as entry price
  const entryPrice = activeDuel
    ? Number(activeDuel.priceThreshold) /
      Math.pow(10, Math.abs(Number(activeDuel.priceDecimals)))
    : undefined;

  // Auto-select the first open duel as active (for demo purposes)
  useEffect(() => {
    if (!activeDuel && openDuels && Array.isArray(openDuels) && openDuels.length > 0) {
      setActiveDuel(openDuels[0]);
    }
  }, [openDuels, activeDuel]);

  // Handle bonus events
  useEffect(() => {
    if (bonusEvents && bonusEvents.length > 0) {
      bonusEvents.forEach((event: any) => {
        const duelId = event.args?.duelId;
        if (duelId && !bonusTriggeredDuels.has(duelId)) {
          // New bonus event detected
          setBonusTriggeredDuels(prev => new Set(prev).add(duelId));

          // Fire bonus confetti
          fireBonusConfetti();

          // Show notification
          notification.success("2X BONUS TRIGGERED! 🎰 RNG gods smile upon this duel!");
        }
      });
    }
  }, [bonusEvents]);

  const { writeContractAsync } = useScaffoldWriteContract("DegenDuel");

  const handleJoinDuel = async (duelId: bigint) => {
    // Find the duel to get stake amount
    const duel = Array.isArray(openDuels) ? openDuels.find((d: any) => d.id === duelId) : null;
    if (!duel) return;

    try {
      await writeContractAsync({
        functionName: "joinDuel",
        args: [duelId],
        value: duel.stakeAmount,
      });
      setActiveDuel(duel);
    } catch (error) {
      console.error("Error joining duel:", error);
    }
  };

  const handleSettlePriceDuel = async (duelId: bigint) => {
    setIsSettling(true);
    try {
      await writeContractAsync({
        functionName: "settlePriceDuel",
        args: [duelId],
      });
      // Fire confetti on successful settlement
      fireWinConfetti();
    } catch (error) {
      console.error("Error settling duel:", error);
    } finally {
      setIsSettling(false);
    }
  };

  const totalDuels = stats ? Number(stats[0]) : 0;
  const settledDuels = stats ? Number(stats[1]) : 0;
  const volume = stats ? formatEther(stats[2]) : "0";

  const openDuelsList = Array.isArray(openDuels) ? openDuels : [];
  const activeDuelsList = Array.isArray(activeDuels) ? activeDuels : [];
  void activeDuelsList; // referenced in JSX below

  return (
    <div className="min-h-screen">
      {/* Price Ticker */}
      <PriceTicker />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Protocol Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 px-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
              Live Arena
            </span>
          </div>
          <div className="flex gap-6 text-xs">
            <div>
              <span className="text-slate-500">Duels </span>
              <span className="font-mono text-[#8B5CF6] tabular-nums">{totalDuels}</span>
            </div>
            <div>
              <span className="text-slate-500">Settled </span>
              <span className="font-mono text-[#06B6D4] tabular-nums">{settledDuels}</span>
            </div>
            <div>
              <span className="text-slate-500">Volume </span>
              <span className="font-mono text-[#F59E0B] tabular-nums">
                {parseFloat(volume).toFixed(2)} FLR
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Grid: Active Duel + Create/Open Duels */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Active Duel (60%) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <ActiveDuel
              duel={activeDuel}
              currentPrice={currentPrice}
              entryPrice={entryPrice}
              onSettle={handleSettlePriceDuel}
              isSettling={isSettling}
              bonusTriggered={activeDuel?.id ? bonusTriggeredDuels.has(activeDuel.id) : false}
            />
          </motion.div>

          {/* Right: Create Duel + Open Duels (40%) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <CreateDuel />

            <AIHintCard />

            {/* Active Duels List (ready to settle) */}
            {activeDuelsList.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Active Duels
                  </h3>
                  <span className="text-xs font-mono text-[#06B6D4] tabular-nums">
                    {activeDuelsList.length} ongoing
                  </span>
                </div>
                <div className="space-y-2">
                  {activeDuelsList.map((duel: any, idx: number) => {
                    const isPastDeadline = Math.floor(Date.now() / 1000) > Number(duel.deadline);
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        className="group relative flex items-center gap-4 rounded-xl card-glass hover-lift cursor-pointer overflow-hidden"
                        onClick={() => setActiveDuel(duel)}
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#06B6D4]" />
                        <div className="flex items-center justify-between w-full px-5 py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
                              <span className="font-bold text-sm text-[#06B6D4]">LIVE</span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-200">Duel #{Number(duel.id)}</div>
                              <div className="text-xs text-slate-500">
                                {isPastDeadline ? (
                                  <span className="text-[#F59E0B] font-bold">Ready to settle</span>
                                ) : (
                                  <span>In progress</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm font-bold text-[#F59E0B] tabular-nums">
                              {parseFloat(formatEther(duel.stakeAmount)).toFixed(2)} FLR
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Open Duels List */}
            {openDuelsList.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Open Duels
                  </h3>
                  <span className="text-xs font-mono text-[#8B5CF6] tabular-nums">
                    {openDuelsList.length} active
                  </span>
                </div>
                <div className="space-y-2">
                  {openDuelsList.map((duel: any, idx: number) => (
                    <DuelCard
                      key={idx}
                      duel={duel}
                      onJoin={handleJoinDuel}
                      index={idx}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Below the fold: Leaderboard + Settlement Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Leaderboard />

          {/* Settlement / Protocol Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl card-glass-dense overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-[rgba(148,163,184,0.08)]">
              <h2 className="text-lg font-bold text-slate-100">Powered by Flare</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.15)] flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-[#8B5CF6]">F</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">FTSO v2 Price Feeds</div>
                  <div className="text-xs text-slate-500">
                    Real-time decentralized price data. Updates every ~1.8s block time. Free to read on Coston2.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-[#06B6D4]">D</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">FDC Web2Json Attestation</div>
                  <div className="text-xs text-slate-500">
                    Cross-chain data attestation. External API data verified by 100+ validators for data duels.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.15)] flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-[#22C55E]">R</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">Secure Random Number</div>
                  <div className="text-xs text-slate-500">
                    Verifiable on-chain randomness for fair tiebreaking and random duel matching.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
