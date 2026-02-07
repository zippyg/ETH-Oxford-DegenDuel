"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  deadline: number; // Unix timestamp in seconds
  size?: number;
  totalDuration?: number; // Total duel duration in seconds for ring calculation
}

export const CountdownTimer = ({ deadline, size = 100, totalDuration = 90 }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const tick = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = Math.max(0, deadline - now);
      setTimeLeft(remaining);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalDuration > 0 ? timeLeft / totalDuration : 0;
  const dashOffset = circumference * (1 - progress);

  const isUrgent = timeLeft <= 10;
  const isCritical = timeLeft <= 5;
  const isExpired = timeLeft === 0;

  const ringColor = isExpired ? "#475569" : isUrgent ? "#EF4444" : "#8B5CF6";

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "0s";
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      animate={
        isCritical && !isExpired
          ? { scale: [1, 1.05, 1] }
          : {}
      }
      transition={
        isCritical ? { repeat: Infinity, duration: 0.8 } : {}
      }
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.1)"
          strokeWidth="4"
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            filter: isUrgent ? `drop-shadow(0 0 6px ${ringColor})` : `drop-shadow(0 0 4px ${ringColor}80)`,
          }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-mono font-bold tabular-nums ${
            isExpired
              ? "text-slate-500 text-xs"
              : isUrgent
              ? "text-red-400 text-glow-red"
              : "text-slate-200"
          }`}
          style={{ fontSize: size * 0.22 }}
        >
          {isExpired ? "ENDED" : formatTime(timeLeft)}
        </span>
      </div>
    </motion.div>
  );
};
