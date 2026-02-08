"use client";

import { motion } from "framer-motion";
import { CreateDuel } from "~~/components/degenduel/CreateDuel";
import { PriceTicker } from "~~/components/degenduel/PriceTicker";

const CreatePage = () => {
  return (
    <div className="min-h-screen">
      <PriceTicker />

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-black text-[#E62058] mb-2">CREATE A DUEL</h1>
          <p className="text-slate-500 text-sm">
            Pick your asset. Choose your side. Stake your FLR. Settled in 90 seconds by Flare FTSO.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CreateDuel />
        </motion.div>

        {/* Info section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-xl card-glass p-5"
        >
          <h3 className="text-sm font-bold text-slate-300 mb-3">How it works</h3>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-[rgba(230,32,88,0.2)] flex items-center justify-center shrink-0 text-xs font-bold text-[#E62058]">
                1
              </div>
              <div className="text-xs text-slate-400">
                <strong className="text-slate-300">Create:</strong> Choose an asset, predict UP or DOWN from current price, set your stake.
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-[rgba(108,147,236,0.2)] flex items-center justify-center shrink-0 text-xs font-bold text-[#6C93EC]">
                2
              </div>
              <div className="text-xs text-slate-400">
                <strong className="text-slate-300">Match:</strong> An opponent takes the opposite side with matching stake.
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-[rgba(16,185,129,0.2)] flex items-center justify-center shrink-0 text-xs font-bold text-[#10B981]">
                3
              </div>
              <div className="text-xs text-slate-400">
                <strong className="text-slate-300">Settle:</strong> After 90 seconds, Flare FTSO reads the price. Winner takes the pot (minus 2% protocol fee).
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePage;
