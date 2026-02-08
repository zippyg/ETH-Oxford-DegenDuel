"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, SparklesIcon } from "@heroicons/react/24/solid";

interface AIHint {
  confidence: number;
  rationale: string;
  alternativeThreshold: number | null;
}

export const AIHintCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<AIHint | null>(null);

  const fetchHint = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_FLOCK_API_KEY;
      if (!apiKey) {
        setHint({
          confidence: 50,
          rationale: "AI hints powered by FLock — configure API key to enable",
          alternativeThreshold: null,
        });
        setLoading(false);
        return;
      }
      const response = await fetch("https://api.flock.io/v1/chat/completions", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "x-litellm-api-key": apiKey,
        },
        body: JSON.stringify({
          model: "qwen3-30b-a3b-instruct-2507",
          messages: [
            {
              role: "system",
              content:
                'You are a crypto market analyst for DegenDuel. Respond ONLY with valid JSON: {"confidence": 0-100, "rationale": "string max 100 chars"}',
            },
            {
              role: "user",
              content: `Should I go UP or DOWN on BTC/USD in the next 90 seconds? Current market context: hackathon demo.`,
            },
          ],
          max_tokens: 256,
          temperature: 0.7,
          stream: false,
        }),
      });
      const data = await response.json();
      const content = data.choices[0].message.content;
      const parsed = JSON.parse(content);
      setHint(parsed);
    } catch {
      setHint({
        confidence: 50,
        rationale: "AI analysis temporarily unavailable. Trust your instincts!",
        alternativeThreshold: null,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // Auto-fetch first hint on mount
    fetchHint();
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 60) return "#10B981"; // Green
    if (confidence >= 40) return "#F59E0B"; // Yellow
    return "#EF4444"; // Red
  };

  const getConfidenceGlow = (confidence: number) => {
    if (confidence >= 60) return "border-glow-green";
    if (confidence >= 40) return "border-glow-gold";
    return "border-glow-red";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.12 }}
      className="rounded-2xl card-glass overflow-hidden"
    >
      {/* Header - Always Visible */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[rgba(230,32,88,0.05)] transition-all"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-[#E62058]"
          >
            <SparklesIcon className="w-5 h-5" />
          </motion.div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">AI HINT</h3>
            <p className="text-xs text-slate-500">Powered by FLock</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDownIcon className="w-5 h-5 text-slate-400" />
        </motion.div>
      </motion.button>

      {/* Expandable Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-[rgba(148,163,184,0.08)]">
              {loading ? (
                // Loading State
                <div className="space-y-3">
                  <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="h-20 rounded-lg bg-[rgba(230,32,88,0.1)]"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                    className="h-12 rounded-lg bg-[rgba(230,32,88,0.1)]"
                  />
                </div>
              ) : hint ? (
                // Hint Display
                <div className="space-y-4">
                  {/* Confidence Badge */}
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center border-2 ${getConfidenceGlow(
                        hint.confidence,
                      )}`}
                      style={{
                        borderColor: getConfidenceColor(hint.confidence),
                        background: `radial-gradient(circle, ${getConfidenceColor(
                          hint.confidence,
                        )}20, transparent)`,
                      }}
                    >
                      <div className="text-center">
                        <div
                          className="font-mono font-black text-xl tabular-nums"
                          style={{ color: getConfidenceColor(hint.confidence) }}
                        >
                          {hint.confidence}
                        </div>
                        <div className="text-[8px] text-slate-500 uppercase">conf</div>
                      </div>
                    </motion.div>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1">Confidence Score</div>
                      <div className="text-sm text-slate-300">
                        {hint.confidence >= 60
                          ? "High confidence"
                          : hint.confidence >= 40
                          ? "Moderate confidence"
                          : "Low confidence"}
                      </div>
                    </div>
                  </div>

                  {/* Rationale */}
                  <div className="p-3 rounded-lg bg-[rgba(230,32,88,0.05)] border border-[rgba(230,32,88,0.15)]">
                    <div className="text-xs text-slate-500 mb-1.5">AI Rationale</div>
                    <p className="text-sm text-slate-200 leading-relaxed">{hint.rationale}</p>
                  </div>

                  {/* Get New Hint Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={fetchHint}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#E62058] to-[#A01540] text-white font-bold text-sm uppercase tracking-wider hover:from-[#C41B4C] hover:to-[#8A1237] transition-all btn-glow"
                  >
                    Get New Hint
                  </motion.button>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
