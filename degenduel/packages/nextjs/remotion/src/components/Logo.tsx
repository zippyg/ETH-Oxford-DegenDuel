import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface LogoProps {
  size?: number;
}

export const AnimatedLogo: React.FC<LogoProps> = ({ size = 200 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Green line draws in (0 to 1)
  const greenProgress = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 80, mass: 1 },
  });

  // Red line draws in (delayed)
  const redProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 30, stiffness: 80, mass: 1 },
  });

  // Center dot scales in
  const dotScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 200, mass: 0.5 },
  });

  // Glow pulse on center dot
  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.3, 0.8],
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E62058" />
          <stop offset="100%" stopColor="#6C93EC" />
        </linearGradient>
        <linearGradient id="logo-green" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#6C93EC" />
        </linearGradient>
        <linearGradient id="logo-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#E62058" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Green upward line */}
      <path
        d="M 6 36 L 16 28 L 22 32 L 30 18 L 42 8"
        stroke="url(#logo-green)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray="80"
        strokeDashoffset={80 * (1 - greenProgress)}
      />

      {/* Red downward line */}
      <path
        d="M 6 12 L 14 18 L 22 16 L 32 30 L 42 40"
        stroke="url(#logo-red)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray="80"
        strokeDashoffset={80 * (1 - Math.max(0, redProgress))}
      />

      {/* Center dot with glow */}
      <circle
        cx="24"
        cy="24"
        r={3 * Math.max(0, dotScale)}
        fill="url(#logo-gradient)"
        filter="url(#glow)"
        opacity={glowIntensity}
      />
    </svg>
  );
};
