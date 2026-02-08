import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface NeonGlowProps {
  color?: string;
  x?: string;
  y?: string;
  size?: number;
  pulse?: boolean;
}

export const NeonGlow: React.FC<NeonGlowProps> = ({
  color = "rgba(230, 32, 88, 0.15)",
  x = "50%",
  y = "30%",
  size = 600,
  pulse = true,
}) => {
  const frame = useCurrentFrame();
  const pulseScale = pulse
    ? interpolate(Math.sin(frame * 0.05), [-1, 1], [0.9, 1.1])
    : 1;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%, -50%) scale(${pulseScale})`,
          width: size,
          height: size * 0.66,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};
