import React from "react";
import { GRADIENTS, FONTS } from "../styles/theme";

interface GradientTextProps {
  children: React.ReactNode;
  fontSize?: number;
  gradient?: string;
  style?: React.CSSProperties;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  fontSize = 96,
  gradient = GRADIENTS.textPrimary,
  style,
}) => {
  return (
    <span
      style={{
        fontFamily: FONTS.mono,
        fontWeight: 700,
        fontSize,
        background: gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        lineHeight: 1.1,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
