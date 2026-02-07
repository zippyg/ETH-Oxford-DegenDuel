"use client";

import React from "react";
import { hardhat } from "viem/chains";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

/**
 * Site footer - DegenDuel
 */
export const Footer = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <div className="min-h-0 py-6 px-4 mt-8">
      {/* Faucet for local dev */}
      {isLocalNetwork && (
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            <Faucet />
          </div>
        </div>
      )}

      {/* Footer content */}
      <div className="max-w-7xl mx-auto">
        <div className="border-t border-[rgba(148,163,184,0.06)] pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Brand */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Built on</span>
              <span className="font-bold text-[#8B5CF6]">Flare</span>
              <span className="text-slate-700">|</span>
              <span>ETH Oxford 2026</span>
            </div>

            {/* Center: Protocol badges */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[rgba(139,92,246,0.1)] text-[#8B5CF6] border border-[#8B5CF6]/20">
                FTSO v2
              </div>
              <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[rgba(6,182,212,0.1)] text-[#06B6D4] border border-[#06B6D4]/20">
                FDC
              </div>
              <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[rgba(34,197,94,0.1)] text-[#22C55E] border border-[#22C55E]/20">
                RNG
              </div>
            </div>

            {/* Right: Tagline */}
            <div className="text-xs text-slate-600 font-mono">
              Predict. Duel. Win.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
