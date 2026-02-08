import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../styles/theme";

export const DotGrid: React.FC<{ fadeIn?: boolean }> = ({ fadeIn = true }) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn
    ? interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" })
    : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        backgroundImage: `radial-gradient(${COLORS.primaryAlpha(0.15)} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        opacity,
      }}
    />
  );
};
