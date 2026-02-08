import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DotGrid } from "../components/DotGrid";
import { NeonGlow } from "../components/NeonGlow";
import { GradientText } from "../components/GradientText";
import { COLORS, FONTS } from "../styles/theme";

export const Tagline: React.FC = () => {
  const frame = useCurrentFrame();

  const title = "PREDICT. DUEL. WIN.";

  // Typewriter: reveal one character at a time
  const charsVisible = Math.floor(
    interpolate(frame, [0, 40], [0, title.length], {
      extrapolateRight: "clamp",
    }),
  );
  const displayedTitle = title.slice(0, charsVisible);

  // Subtitle fades in after title is typed
  const subtitleOpacity = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [45, 60], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Built at ETH Oxford" badge
  const badgeOpacity = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing dot
  const dotOpacity = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.4, 1],
  );

  return (
    <AbsoluteFill>
      <DotGrid fadeIn={false} />
      <NeonGlow />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Main Title - Typewriter */}
        <div style={{ minHeight: 120, display: "flex", alignItems: "center" }}>
          <GradientText fontSize={112}>
            {displayedTitle}
            <span
              style={{
                opacity: frame % 15 < 8 ? 1 : 0,
                color: COLORS.primary,
              }}
            >
              |
            </span>
          </GradientText>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 28,
            color: COLORS.textMuted,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            maxWidth: 900,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          PvP prediction duels settled by Flare&apos;s native protocols.
          <br />
          No oracles. No trust. Just data.
        </p>

        {/* ETH Oxford Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: badgeOpacity,
            marginTop: 24,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: COLORS.primary,
              opacity: dotOpacity,
            }}
          />
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 14,
              color: COLORS.primary,
            }}
          >
            Built at ETH Oxford 2026
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
