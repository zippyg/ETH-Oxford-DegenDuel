"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "@scaffold-ui/components";
import { CountdownTimer } from "./CountdownTimer";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

interface ActiveDuelProps {
  duel?: any;
  currentPrice?: number;
  entryPrice?: number;
  onSettle?: (duelId: bigint) => void;
  isSettling?: boolean;
  bonusTriggered?: boolean;
}

const PlayerBox = ({
  address,
  prediction,
  stake,
  isWinning,
  isUser,
  label,
}: {
  address: string;
  prediction: boolean; // true = UP
  stake: string;
  isWinning: boolean;
  isUser: boolean;
  label: string;
}) => {
  return (
    <div
      className={`relative flex-1 rounded-xl p-4 card-glass transition-all duration-500 ${
        isWinning
          ? prediction
            ? "border-glow-green border border-[#10B981]/30"
            : "border-glow-red border border-[#EF4444]/30"
          : "border border-[rgba(148,163,184,0.08)]"
      }`}
    >
      {isUser && (
        <div className="absolute -top-2 left-3 px-2 py-0.5 bg-[#E62058] rounded text-[10px] font-bold text-white">
          YOU
        </div>
      )}
      {isWinning && (
        <div className="absolute -top-2 right-3 px-2 py-0.5 bg-[#F59E0B] rounded text-[10px] font-bold text-black">
          WINNING
        </div>
      )}
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          <Address address={address} size="xs" />
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 text-sm font-bold ${
              prediction ? "text-[#10B981]" : "text-[#EF4444]"
            }`}
          >
            {prediction ? (
              <>
                <ArrowUpIcon className="w-4 h-4" /> UP
              </>
            ) : (
              <>
                <ArrowDownIcon className="w-4 h-4" /> DOWN
              </>
            )}
          </div>
          <span className="font-mono text-sm text-[#F59E0B] tabular-nums">{stake} FLR</span>
        </div>
      </div>
    </div>
  );
};

export const ActiveDuel = ({ duel, currentPrice, entryPrice, onSettle, isSettling, bonusTriggered }: ActiveDuelProps) => {
  const { address: connectedAddress } = useAccount();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const entryLineRef = useRef<any>(null);
  const [priceHistory, setPriceHistory] = useState<{ time: number; value: number }[]>([]);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [priceFlash, setPriceFlash] = useState<"green" | "red" | null>(null);

  // Track price changes for flash animation
  useEffect(() => {
    if (currentPrice && prevPrice !== null && currentPrice !== prevPrice) {
      setPriceFlash(currentPrice > prevPrice ? "green" : "red");
      const timeout = setTimeout(() => setPriceFlash(null), 500);
      return () => clearTimeout(timeout);
    }
    if (currentPrice) {
      setPrevPrice(currentPrice);
    }
  }, [currentPrice]);

  // Build price history
  useEffect(() => {
    if (currentPrice) {
      setPriceHistory(prev => {
        const now = Math.floor(Date.now() / 1000);
        const newEntry = { time: now, value: currentPrice };
        const updated = [...prev, newEntry];
        // Keep last 100 data points
        return updated.slice(-100);
      });
    }
  }, [currentPrice]);

  // Initialize and update chart
  useEffect(() => {
    if (!chartContainerRef.current || !duel) return;

    let chart: any;
    let series: any;

    const initChart = async () => {
      const { createChart, ColorType, LineStyle, AreaSeries } = await import("lightweight-charts");

      if (!chartContainerRef.current) return;

      // Destroy existing chart
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
        entryLineRef.current = null;
      }

      chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "#94A3B8",
          fontFamily: "JetBrains Mono, monospace",
        },
        grid: {
          vertLines: { color: "rgba(148, 163, 184, 0.05)" },
          horzLines: { color: "rgba(148, 163, 184, 0.05)" },
        },
        crosshair: {
          vertLine: { color: "rgba(230, 32, 88, 0.3)" },
          horzLine: { color: "rgba(230, 32, 88, 0.3)" },
        },
        timeScale: {
          borderColor: "rgba(148, 163, 184, 0.1)",
          timeVisible: true,
          secondsVisible: true,
        },
        rightPriceScale: {
          borderColor: "rgba(148, 163, 184, 0.1)",
        },
        width: chartContainerRef.current.clientWidth,
        height: 250,
      });

      // Determine color based on who's winning
      const isBullWinning = currentPrice && entryPrice ? currentPrice >= entryPrice : true;

      series = chart.addSeries(AreaSeries, {
        topColor: isBullWinning ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)",
        bottomColor: isBullWinning ? "rgba(16, 185, 129, 0.0)" : "rgba(239, 68, 68, 0.0)",
        lineColor: isBullWinning ? "#10B981" : "#EF4444",
        lineWidth: 2,
      });

      if (priceHistory.length > 0) {
        series.setData(priceHistory);
      }

      // Add entry price line
      if (entryPrice) {
        entryLineRef.current = series.createPriceLine({
          price: entryPrice,
          color: "#E62058",
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: "Entry",
        });
      }

      chartRef.current = chart;
      seriesRef.current = series;

      // Handle resize
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          chart.applyOptions({ width: entry.contentRect.width });
        }
      });
      resizeObserver.observe(chartContainerRef.current);

      return () => {
        resizeObserver.disconnect();
        chart.remove();
      };
    };

    initChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [duel?.id]);

  // Update chart data when price changes
  useEffect(() => {
    if (seriesRef.current && priceHistory.length > 0) {
      seriesRef.current.setData(priceHistory);

      // Update chart colors based on who's winning
      const isBullWinning = currentPrice && entryPrice ? currentPrice >= entryPrice : true;
      seriesRef.current.applyOptions({
        topColor: isBullWinning ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)",
        bottomColor: isBullWinning ? "rgba(16, 185, 129, 0.0)" : "rgba(239, 68, 68, 0.0)",
        lineColor: isBullWinning ? "#10B981" : "#EF4444",
      });
    }
  }, [priceHistory, currentPrice, entryPrice]);

  // Empty state
  if (!duel) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl card-glass p-8 flex flex-col items-center justify-center min-h-[400px]"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="text-6xl mb-4"
        >
          <svg width="80" height="80" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="empty-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E62058" />
                <stop offset="100%" stopColor="#6C93EC" />
              </linearGradient>
            </defs>
            <path d="M 6 36 L 16 28 L 22 32 L 30 18 L 42 8" stroke="url(#empty-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
            <path d="M 6 12 L 14 18 L 22 16 L 32 30 L 42 40" stroke="url(#empty-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
          </svg>
        </motion.div>
        <h3 className="text-2xl font-bold text-[#E62058] mb-2">No Active Duel</h3>
        <p className="text-slate-500 text-center">Create a duel or accept an open challenge to see the arena come alive.</p>
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-4 text-sm text-[#E62058] font-mono"
        >
          Waiting for battle...
        </motion.div>
      </motion.div>
    );
  }

  // Active duel rendering
  const feedId = duel.feedId as string;
  const FEED_IDS: Record<string, string> = {
    "FLR/USD": "0x01464c522f55534400000000000000000000000000",
    "BTC/USD": "0x014254432f55534400000000000000000000000000",
    "ETH/USD": "0x014554482f55534400000000000000000000000000",
    "XRP/USD": "0x015852502f55534400000000000000000000000000",
    "SOL/USD": "0x01534f4c2f55534400000000000000000000000000",
  };
  const feedName =
    Object.keys(FEED_IDS).find(key => FEED_IDS[key].toLowerCase() === feedId.toLowerCase()) || "UNKNOWN";

  const stakeFormatted = parseFloat(formatEther(duel.stakeAmount)).toFixed(2);
  const isBullWinning = currentPrice && entryPrice ? currentPrice >= entryPrice : null;
  const priceChange = currentPrice && entryPrice ? currentPrice - entryPrice : 0;
  const priceChangePct =
    currentPrice && entryPrice && entryPrice > 0
      ? ((priceChange / entryPrice) * 100).toFixed(4)
      : "0.0000";

  const playerAIsUp = duel.playerAPrediction;
  const playerAWinning = playerAIsUp ? isBullWinning : isBullWinning === false;

  // Check if duel is past deadline (ready to settle)
  const now = Math.floor(Date.now() / 1000);
  const isPastDeadline = now > Number(duel.deadline);
  const isSettled = Number(duel.status) === 2; // 2 = SETTLED
  const hasBothPlayers = duel.playerB && duel.playerB !== "0x0000000000000000000000000000000000000000";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl card-glass-dense overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(148,163,184,0.08)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider">Live Duel</span>
            {bonusTriggered && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className="px-3 py-1 bg-gradient-to-r from-[#F59E0B] to-[#EAB308] rounded-lg text-black font-black text-xs uppercase border-glow-gold"
              >
                2x BONUS!
              </motion.div>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">{feedName}</h2>
        </div>
        <CountdownTimer
          deadline={Number(duel.deadline)}
          size={80}
          totalDuration={90}
        />
      </div>

      {/* Chart */}
      <div className="px-4 py-2">
        <div ref={chartContainerRef} className="w-full rounded-lg overflow-hidden" />
      </div>

      {/* Player boxes */}
      <div className="px-6 py-3 flex gap-4">
        <PlayerBox
          address={duel.playerA}
          prediction={playerAIsUp}
          stake={stakeFormatted}
          isWinning={playerAWinning === true}
          isUser={connectedAddress?.toLowerCase() === duel.playerA?.toLowerCase()}
          label="Player A (Creator)"
        />
        {duel.playerB && duel.playerB !== "0x0000000000000000000000000000000000000000" ? (
          <PlayerBox
            address={duel.playerB}
            prediction={!playerAIsUp}
            stake={stakeFormatted}
            isWinning={playerAWinning === false}
            isUser={connectedAddress?.toLowerCase() === duel.playerB?.toLowerCase()}
            label="Player B (Challenger)"
          />
        ) : (
          <div className="flex-1 rounded-xl border border-dashed border-[#E62058]/20 p-4 flex items-center justify-center">
            <span className="text-sm text-[#E62058] font-mono">Waiting for challenger...</span>
          </div>
        )}
      </div>

      {/* Live stats bar */}
      <div className="px-6 py-4 border-t border-[rgba(148,163,184,0.08)] flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="text-xs text-slate-500">Current Price</span>
          <div
            className={`font-mono text-lg font-bold tabular-nums ${
              priceFlash === "green"
                ? "text-[#10B981] text-glow-green"
                : priceFlash === "red"
                ? "text-[#EF4444] text-glow-red"
                : "text-slate-100"
            }`}
          >
            ${currentPrice?.toFixed(4) || "---"}
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500">Entry Price</span>
          <div className="font-mono text-lg text-slate-400 tabular-nums">
            ${entryPrice?.toFixed(4) || "---"}
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500">Change</span>
          <div
            className={`font-mono text-lg font-bold tabular-nums ${
              priceChange >= 0 ? "text-[#10B981]" : "text-[#EF4444]"
            }`}
          >
            {priceChange >= 0 ? "+" : ""}
            {priceChange.toFixed(4)} ({priceChangePct}%)
          </div>
        </div>
        {isBullWinning !== null && (
          <div>
            <span className="text-xs text-slate-500">Favoring</span>
            <div
              className={`text-sm font-bold ${
                playerAWinning ? "text-[#E62058]" : "text-[#6C93EC]"
              }`}
            >
              {playerAWinning ? "Player A" : "Player B"}
            </div>
          </div>
        )}
      </div>

      {/* Settlement section */}
      {isSettled ? (
        <div className="px-6 py-4 border-t border-[rgba(148,163,184,0.08)] bg-[rgba(245,158,11,0.1)]">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-bold text-[#F59E0B]">DUEL SETTLED</span>
          </div>
        </div>
      ) : isPastDeadline && hasBothPlayers && onSettle ? (
        <div className="px-6 py-4 border-t border-[rgba(148,163,184,0.08)]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSettle(duel.id)}
            disabled={isSettling}
            className="w-full btn border-0 bg-gradient-to-r from-[#E62058] to-[#6C93EC] hover:from-[#C41B4C] hover:to-[#5A7FD4] text-white font-bold uppercase tracking-wider btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSettling ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Settling...
              </span>
            ) : (
              "SETTLE DUEL"
            )}
          </motion.button>
        </div>
      ) : null}
    </motion.div>
  );
};
