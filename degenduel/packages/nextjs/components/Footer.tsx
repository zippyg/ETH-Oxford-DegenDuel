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
              <span className="font-bold text-[#E62058]">Flare</span>
              <span className="text-slate-700">|</span>
              <span>ETH Oxford 2026</span>
            </div>

            {/* Center: Protocol badges */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[rgba(230,32,88,0.1)] text-[#E62058] border border-[#E62058]/20">
                FTSO v2
              </div>
              <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[rgba(108,147,236,0.1)] text-[#6C93EC] border border-[#6C93EC]/20">
                FDC
              </div>
              <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[rgba(16,185,129,0.1)] text-[#10B981] border border-[#10B981]/20">
                RNG
              </div>
            </div>

            {/* Right: Credit */}
            <div className="text-xs text-slate-500 font-mono">
              Developed by <span className="text-[#E8E8E8] font-bold">Zain Mughal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
