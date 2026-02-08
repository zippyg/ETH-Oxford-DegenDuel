import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DotGrid } from "../components/DotGrid";
import { AnimatedLogo } from "../components/Logo";
import { NeonGlow } from "../components/NeonGlow";
import { GradientText } from "../components/GradientText";
import { COLORS, FONTS } from "../styles/theme";

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scales in
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.8 },
  });

  // Text fades in after logo
  const textOpacity = interpolate(frame, [50, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textY = interpolate(frame, [50, 80], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow intensifies
  const glowOpacity = interpolate(frame, [0, 60], [0, 0.2], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <DotGrid />
      <NeonGlow color={`rgba(230, 32, 88, ${glowOpacity})`} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Animated Logo */}
        <div style={{ transform: `scale(${logoScale})` }}>
          <AnimatedLogo size={180} />
        </div>

        {/* Brand Name */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          <GradientText fontSize={72}>DEGENDUEL</GradientText>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
