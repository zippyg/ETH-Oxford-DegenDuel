import React from "react";
import { COLORS } from "../styles/theme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accentColor?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  accentColor,
}) => {
  return (
    <div
      style={{
        background: "rgba(10, 10, 11, 0.8)",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: 32,
        boxShadow: accentColor
          ? `0 0 20px ${accentColor}22`
          : "0 0 12px rgba(0,0,0,0.1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
