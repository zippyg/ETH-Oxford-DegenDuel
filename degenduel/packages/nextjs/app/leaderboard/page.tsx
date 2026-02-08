"use client";

import { motion } from "framer-motion";
import { Leaderboard } from "~~/components/degenduel/Leaderboard";
import { PriceTicker } from "~~/components/degenduel/PriceTicker";
import { TrophyIcon } from "@heroicons/react/24/solid";

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen">
      <PriceTicker />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <TrophyIcon className="w-8 h-8 text-[#F59E0B]" />
            <h1 className="text-4xl font-black text-[#E62058]">LEADERBOARD</h1>
            <TrophyIcon className="w-8 h-8 text-[#F59E0B]" />
          </div>
          <p className="text-slate-500 text-sm">
            Top duelists ranked by wins. Compete to climb the ranks.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Leaderboard fullPage={true} />
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
