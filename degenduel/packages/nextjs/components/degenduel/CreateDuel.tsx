"use client";

import { useState, useEffect } from "react";
import { parseEther } from "viem";
import { motion } from "framer-motion";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const FEED_IDS = {
  "FLR/USD": "0x01464c522f55534400000000000000000000000000",
  "BTC/USD": "0x014254432f55534400000000000000000000000000",
  "ETH/USD": "0x014554482f55534400000000000000000000000000",
  "XRP/USD": "0x015852502f55534400000000000000000000000000",
  "SOL/USD": "0x01534f4c2f55534400000000000000000000000000",
} as const;

type FeedName = keyof typeof FEED_IDS;
type DuelMode = "PRICE" | "DATA";

const ASSET_PILLS = [
  { name: "BTC", feed: "BTC/USD" as FeedName },
  { name: "ETH", feed: "ETH/USD" as FeedName },
  { name: "FLR", feed: "FLR/USD" as FeedName },
  { name: "XRP", feed: "XRP/USD" as FeedName },
  { name: "SOL", feed: "SOL/USD" as FeedName },
];

export const CreateDuel = () => {
  const [duelMode, setDuelMode] = useState<DuelMode>("PRICE");
  const [selectedFeed, setSelectedFeed] = useState<FeedName>("BTC/USD");
  const [prediction, setPrediction] = useState<"UP" | "DOWN" | null>(null);
  const [stake, setStake] = useState("0.01");
  const [isCreating, setIsCreating] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [createdDuelId, setCreatedDuelId] = useState<bigint | null>(null);
  const [duelExpired, setDuelExpired] = useState(false);

  // Data duel specific state
  const [dataSource, setDataSource] = useState("");
  const [dataThreshold, setDataThreshold] = useState("");

  const { writeContractAsync } = useScaffoldWriteContract("DegenDuel");

  // Read nextDuelId so we know what ID the created duel will get
  const { data: nextDuelId } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "nextDuelId",
    watch: true,
  });

  // Poll the created duel's on-chain state while waiting
  const { data: createdDuelData } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getDuel",
    args: [createdDuelId ?? 0n],
    watch: true,
    query: { enabled: isWaiting && createdDuelId !== null },
  });

  // When the duel becomes ACTIVE (status 1 = someone joined), show success and auto-reset
  // Also detect if duel expired (deadline passed with no opponent)
  useEffect(() => {
    if (!isWaiting || !createdDuelData) return;
    const duelStatus = Number((createdDuelData as any).status ?? (createdDuelData as any)[2]);
    if (duelStatus === 1) {
      // Duel is now ACTIVE -- opponent joined!
      notification.success("Opponent has joined your duel! The battle is ON!");
      const timeout = setTimeout(() => {
        setIsWaiting(false);
        setCreatedDuelId(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    // Check if deadline has passed while still OPEN (no opponent)
    if (duelStatus === 0) {
      const deadline = Number((createdDuelData as any).deadline);
      if (deadline > 0 && Math.floor(Date.now() / 1000) >= deadline) {
        setDuelExpired(true);
      }
    }
  }, [isWaiting, createdDuelData]);

  // Periodic check for expiry while waiting (in case createdDuelData doesn't change)
  useEffect(() => {
    if (!isWaiting || duelExpired || !createdDuelData) return;
    const deadline = Number((createdDuelData as any).deadline);
    if (deadline <= 0) return;

    const check = () => {
      if (Math.floor(Date.now() / 1000) >= deadline) {
        setDuelExpired(true);
      }
    };
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [isWaiting, duelExpired, createdDuelData]);

  const handleCancelCreatedDuel = async () => {
    if (createdDuelId === null) return;
    try {
      await writeContractAsync({
        functionName: "cancelDuel",
        args: [createdDuelId],
      });
      notification.success("Duel cancelled — stake refunded!");
      setIsWaiting(false);
      setCreatedDuelId(null);
      setDuelExpired(false);
    } catch (error) {
      console.error("Error cancelling duel:", error);
      notification.error("Failed to cancel duel");
    }
  };

  const { data: priceData } = useScaffoldReadContract({
    contractName: "DegenDuel",
    functionName: "getCurrentPrice",
    args: [FEED_IDS[selectedFeed] as `0x${string}`],
    watch: true,
  });

  // Keep last known good price so RPC blips don't blank the display
  const [lastGoodPrice, setLastGoodPrice] = useState<{ display: string; decimals: number; raw: bigint } | null>(null);

  useEffect(() => {
    if (priceData && Array.isArray(priceData) && priceData.length >= 2) {
      setLastGoodPrice({
        display: (Number(priceData[0]) / Math.pow(10, Math.abs(Number(priceData[1])))).toFixed(4),
        decimals: Number(priceData[1]),
        raw: priceData[0] as bigint,
      });
    }
  }, [priceData]);

  // Reset cached price when switching assets
  useEffect(() => {
    setLastGoodPrice(null);
  }, [selectedFeed]);

  const currentPrice = lastGoodPrice?.display ?? "---";
  const priceDecimals = lastGoodPrice?.decimals ?? -5;

  const handleCreate = async () => {
    try {
      if (!prediction) {
        return;
      }
      const stakeAmount = parseFloat(stake);
      if (isNaN(stakeAmount) || stakeAmount < 0.01) {
        return;
      }

      setIsCreating(true);

      // Capture the duel ID before the tx (nextDuelId is what the contract will assign)
      const duelIdToTrack = nextDuelId !== undefined ? BigInt(nextDuelId as bigint) : null;

      if (duelMode === "PRICE") {
        // Use current price as threshold (they're betting on direction from now)
        const thresholdScaled = lastGoodPrice?.raw ?? BigInt(0);

        // Deadline 90 seconds from now
        const deadlineTimestamp = BigInt(Math.floor(Date.now() / 1000) + 90);

        await writeContractAsync({
          functionName: "createPriceDuel",
          args: [
            FEED_IDS[selectedFeed] as `0x${string}`,
            thresholdScaled,
            priceDecimals,
            deadlineTimestamp,
            prediction === "UP",
          ],
          value: parseEther(stake),
        });
      } else {
        // DATA mode
        const threshold = parseFloat(dataThreshold);
        if (isNaN(threshold)) {
          return;
        }

        // Deadline 300 seconds (5 min) from now for data duels
        const deadlineTimestamp = BigInt(Math.floor(Date.now() / 1000) + 300);

        await writeContractAsync({
          functionName: "createDataDuel",
          args: [
            BigInt(Math.floor(threshold)),
            deadlineTimestamp,
            prediction === "UP", // UP = ABOVE, DOWN = BELOW
          ],
          value: parseEther(stake),
        });
      }

      // Store the duel ID so we can poll its on-chain status
      if (duelIdToTrack !== null) {
        setCreatedDuelId(duelIdToTrack);
      }
      setIsWaiting(true);
      setStake("0.01");
      setPrediction(null);
      setDataSource("");
      setDataThreshold("");
    } catch (error: any) {
      console.error("Error creating duel:", error);

      const errorMsg = error?.message || error?.toString() || "";

      if (errorMsg.includes("insufficient funds") || errorMsg.includes("exceeds the balance")) {
        notification.error("Insufficient FLR balance. Get testnet FLR from the Coston2 faucet.");
      } else if (errorMsg.includes("User rejected") || errorMsg.includes("user rejected") || errorMsg.includes("User denied")) {
        notification.error("Transaction cancelled.");
      } else if (errorMsg.includes("execution reverted")) {
        notification.error("Transaction reverted. The duel may have invalid parameters.");
      } else {
        notification.error("Failed to create duel. Please try again.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Check if the created duel is now ACTIVE (opponent joined)
  const createdDuelStatus = createdDuelData
    ? Number((createdDuelData as any).status ?? (createdDuelData as any)[2])
    : 0;
  const isDuelActive = isWaiting && createdDuelStatus === 1;

  // Waiting for opponent state — 3 sub-states: active, expired, waiting
  if (isWaiting) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl card-glass p-6 flex flex-col items-center justify-center min-h-[300px]"
      >
        {isDuelActive ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-12 h-12 rounded-full bg-[#10B981] flex items-center justify-center mb-4"
            >
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h3 className="text-lg font-bold text-[#10B981] mb-2">Duel Active!</h3>
            <p className="text-slate-400 text-sm text-center">Opponent has joined -- the battle is on!</p>
            <p className="text-slate-500 text-xs mt-2">Returning to create form...</p>
          </>
        ) : duelExpired ? (
          <>
            <div className="w-12 h-12 rounded-full bg-[rgba(239,68,68,0.15)] flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#EF4444] mb-2">Duel Expired</h3>
            <p className="text-slate-400 text-sm text-center mb-1">No opponent joined before the deadline.</p>
            {createdDuelId !== null && (
              <p className="text-slate-500 text-xs font-mono mb-4">Duel #{Number(createdDuelId)}</p>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancelCreatedDuel}
              className="w-full btn border-0 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold uppercase tracking-wider"
            >
              CANCEL &amp; RECLAIM STAKE
            </motion.button>
            <button
              className="mt-3 btn btn-sm btn-ghost text-slate-500"
              onClick={() => { setIsWaiting(false); setCreatedDuelId(null); setDuelExpired(false); }}
            >
              Create Another
            </button>
          </>
        ) : (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-12 h-12 rounded-full border-2 border-[#E62058] border-t-transparent mb-4"
            />
            <h3 className="text-lg font-bold text-[#E62058] mb-2">Duel Created!</h3>
            <p className="text-slate-400 text-sm text-center">Waiting for an opponent to accept your challenge...</p>
            {createdDuelId !== null && (
              <p className="text-slate-500 text-xs mt-1 font-mono">Duel #{Number(createdDuelId)}</p>
            )}
          </>
        )}
        {!duelExpired && (
          <button
            className="mt-4 btn btn-sm btn-ghost text-slate-500"
            onClick={() => { setIsWaiting(false); setCreatedDuelId(null); setDuelExpired(false); }}
          >
            Create Another
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl card-glass overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <h2 className="text-xl font-bold text-[#E62058] mb-1">CREATE A DUEL</h2>
        <p className="text-xs text-slate-500 mb-5">
          {duelMode === "PRICE"
            ? "Pick an asset, predict the direction, stake your FLR"
            : "Bet on external API data via Flare FDC attestation"}
        </p>

        {/* PRICE/DATA mode toggle */}
        <div className="flex gap-2 mb-5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDuelMode("PRICE")}
            className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              duelMode === "PRICE"
                ? "bg-[#E62058] text-white border-glow-crimson"
                : "bg-[rgba(230,32,88,0.1)] text-slate-400 hover:text-white hover:bg-[rgba(230,32,88,0.2)]"
            }`}
          >
            PRICE
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDuelMode("DATA")}
            className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              duelMode === "DATA"
                ? "bg-[#6C93EC] text-white border-glow-cyan"
                : "bg-[rgba(108,147,236,0.1)] text-slate-400 hover:text-white hover:bg-[rgba(108,147,236,0.2)]"
            }`}
          >
            DATA
          </motion.button>
        </div>

        {duelMode === "PRICE" ? (
          <>
            {/* Asset selector pills */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {ASSET_PILLS.map(asset => (
                <motion.button
                  key={asset.feed}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFeed(asset.feed)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    selectedFeed === asset.feed
                      ? "bg-[#E62058] text-white border-glow-crimson"
                      : "bg-[rgba(230,32,88,0.1)] text-slate-400 hover:text-white hover:bg-[rgba(230,32,88,0.2)]"
                  }`}
                >
                  {asset.name}
                </motion.button>
              ))}
            </div>

            {/* Current price */}
            <div className="mb-5 p-3 rounded-lg bg-[rgba(230,32,88,0.05)] border border-[rgba(230,32,88,0.15)]">
              <div className="text-xs text-slate-500">Current {selectedFeed} Price</div>
              <div className="font-mono text-xl font-bold text-slate-100 tabular-nums">${currentPrice}</div>
              <div className="text-xs text-slate-500 mt-0.5">via Flare FTSO v2 -- updates every ~1.8s</div>
            </div>
          </>
        ) : (
          <>
            {/* Data source input (cosmetic) */}
            <div className="mb-4">
              <label className="text-xs text-slate-500 mb-1.5 block">Data Source (description)</label>
              <input
                type="text"
                placeholder="e.g., BTC Fear & Greed Index, ETH Gas Price"
                value={dataSource}
                onChange={e => setDataSource(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-[rgba(5,5,6,0.6)] border border-[rgba(148,163,184,0.1)] text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#6C93EC] focus:border-glow-cyan transition-all"
              />
            </div>

            {/* Data threshold input */}
            <div className="mb-5 p-3 rounded-lg bg-[rgba(108,147,236,0.05)] border border-[rgba(108,147,236,0.15)]">
              <label className="text-xs text-slate-500 mb-1.5 block">Threshold Value</label>
              <input
                type="number"
                placeholder="Enter numeric threshold"
                value={dataThreshold}
                onChange={e => setDataThreshold(e.target.value)}
                step="1"
                className="w-full py-2 px-3 rounded-lg bg-[rgba(5,5,6,0.6)] border border-[rgba(148,163,184,0.1)] text-slate-100 font-mono text-lg placeholder:text-slate-600 focus:outline-none focus:border-[#6C93EC] transition-all"
              />
              <div className="text-xs text-slate-500 mt-2">External data will be fetched via FDC attestation</div>
            </div>
          </>
        )}

        {/* Direction selector */}
        <div className="flex gap-3 mb-5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPrediction("UP")}
            className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              prediction === "UP"
                ? "bg-[#10B981] text-white border-glow-green shadow-lg"
                : "bg-[rgba(16,185,129,0.1)] text-[#10B981]/60 border border-[#10B981]/20 hover:bg-[rgba(16,185,129,0.15)]"
            }`}
          >
            <ArrowUpIcon className="w-6 h-6" />
            {duelMode === "PRICE" ? "UP" : "ABOVE"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPrediction("DOWN")}
            className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              prediction === "DOWN"
                ? "bg-[#EF4444] text-white border-glow-red shadow-lg"
                : "bg-[rgba(239,68,68,0.1)] text-[#EF4444]/60 border border-[#EF4444]/20 hover:bg-[rgba(239,68,68,0.15)]"
            }`}
          >
            <ArrowDownIcon className="w-6 h-6" />
            {duelMode === "PRICE" ? "DOWN" : "BELOW"}
          </motion.button>
        </div>

        {/* Stake input */}
        <div className="mb-5">
          <div className="relative">
            <input
              type="number"
              placeholder="0.01"
              value={stake}
              onChange={e => setStake(e.target.value)}
              step="0.01"
              min="0.01"
              className="w-full py-3 px-4 pr-16 rounded-xl bg-[rgba(5,5,6,0.6)] border border-[rgba(148,163,184,0.1)] text-slate-100 font-mono text-lg placeholder:text-slate-600 focus:outline-none focus:border-[#E62058] focus:border-glow-crimson transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#F59E0B]">
              FLR
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1.5 pl-1">
            Min stake: 0.01 FLR | Duel settles in {duelMode === "PRICE" ? "90 seconds" : "5 minutes"}
          </div>
        </div>

        {/* Challenge button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={isCreating || !prediction || !stake || parseFloat(stake) < 0.01}
          onClick={handleCreate}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all btn-glow ${
            isCreating || !prediction || !stake || parseFloat(stake) < 0.01
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-[#E62058] to-[#A01540] text-white hover:from-[#C41B4C] hover:to-[#8A1237]"
          }`}
        >
          {isCreating ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 rounded-full border-2 border-white border-t-transparent inline-block"
              />
              Creating...
            </span>
          ) : (
            "CHALLENGE"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
