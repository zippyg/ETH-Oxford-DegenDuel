import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DotGrid } from "../components/DotGrid";
import { NeonGlow } from "../components/NeonGlow";
import { AnimatedLogo } from "../components/Logo";
import { GradientText } from "../components/GradientText";
import { COLORS, FONTS } from "../styles/theme";

export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scales in
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.8 },
  });

  // Brand name
  const nameOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [60, 80], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Built on Flare"
  const flareOpacity = interpolate(frame, [90, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing glow
  const glowPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.1, 0.25],
  );

  return (
    <AbsoluteFill>
      <DotGrid fadeIn={false} />
      <NeonGlow color={`rgba(230, 32, 88, ${glowPulse})`} size={800} />
      <NeonGlow color="rgba(108, 147, 236, 0.06)" x="30%" y="60%" size={400} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {/* Logo */}
        <div style={{ transform: `scale(${logoScale})`, marginBottom: 8 }}>
          <AnimatedLogo size={160} />
        </div>

        {/* Brand Name */}
        <div style={{ opacity: nameOpacity }}>
          <GradientText fontSize={80}>DEGENDUEL</GradientText>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 24,
            color: COLORS.textMuted,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            margin: 0,
          }}
        >
          Trustless Predictions. Provable Fairness.
        </p>

        {/* Built on Flare */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 32,
            opacity: flareOpacity,
          }}
        >
          <div
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: `1px solid ${COLORS.primaryAlpha(0.3)}`,
              background: COLORS.primaryAlpha(0.05),
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 16,
                fontWeight: 700,
                color: COLORS.primary,
              }}
            >
              Built on Flare
            </span>
          </div>

          <div style={{ color: COLORS.textSlate400, fontSize: 14 }}>|</div>

          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 14,
              color: COLORS.textSlate400,
            }}
          >
            ETH Oxford 2026
          </span>
        </div>

        {/* GitHub / URL */}
        <div
          style={{
            opacity: flareOpacity,
            marginTop: 16,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 14,
              color: COLORS.textMuted,
            }}
          >
            github.com/zippyg/ETH-Oxford-DegenDuel
          </span>
        </div>

        {/* Creator */}
        <div
          style={{
            opacity: flareOpacity,
            marginTop: 24,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.sans,
              fontSize: 16,
              fontStyle: "italic",
              color: COLORS.primary,
            }}
          >
            by Zain
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
