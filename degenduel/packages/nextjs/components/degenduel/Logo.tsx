"use client";

export const Logo = ({ size = 40 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
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
      </defs>
      {/* Upward price line (green/cyan) */}
      <path
        d="M 6 36 L 16 28 L 22 32 L 30 18 L 42 8"
        stroke="url(#logo-green)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Downward price line (red/purple) */}
      <path
        d="M 6 12 L 14 18 L 22 16 L 32 30 L 42 40"
        stroke="url(#logo-red)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Center dot at crossing point */}
      <circle cx="24" cy="24" r="3" fill="url(#logo-gradient)" />
    </svg>
  );
};
