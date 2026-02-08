import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DotGrid } from "../components/DotGrid";
import { GlassCard } from "../components/GlassCard";
import { COLORS, FONTS } from "../styles/theme";

const steps = [
  {
    number: "01",
    title: "CREATE",
    description: "Choose an asset. Predict UP or DOWN from the current FTSO price. Stake your FLR.",
  },
  {
    number: "02",
    title: "MATCH",
    description: "An opponent takes the opposite side with matching stake. The duel is now live.",
  },
  {
    number: "03",
    title: "SETTLE",
    description: "After the deadline, Flare's FTSO v2 reads the price on-chain. Winner takes the pot.",
  },
];

export const HowItWorks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section title
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 20], [30, 0], {
    extrapolateRight: "clamp",
  });

  // Code comment at bottom
  const commentOpacity = interpolate(frame, [200, 230], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <DotGrid fadeIn={false} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          padding: "0 80px",
        }}
      >
        {/* Section Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontFamily: FONTS.mono,
              fontWeight: 700,
              fontSize: 64,
              color: COLORS.text,
              margin: 0,
            }}
          >
            HOW IT WORKS
          </h2>
          <p
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              color: COLORS.textMuted,
              margin: "8px 0 0",
            }}
          >
            Three steps. No middlemen. Pure PvP.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "flex",
            gap: 32,
            width: "100%",
            justifyContent: "center",
            marginTop: 48,
          }}
        >
          {steps.map((step, index) => {
            const cardDelay = 30 + index * 50; // staggered
            const cardProgress = spring({
              frame: frame - cardDelay,
              fps,
              config: { damping: 20, stiffness: 80, mass: 1 },
            });

            const cardOpacity = interpolate(
              frame,
              [cardDelay, cardDelay + 20],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            return (
              <div
                key={step.number}
                style={{
                  flex: 1,
                  opacity: cardOpacity,
                  transform: `translateY(${40 * (1 - Math.max(0, cardProgress))}px)`,
                }}
              >
                <GlassCard
                  accentColor={COLORS.primary}
                  style={{ height: "100%", padding: 40 }}
                >
                  {/* Step Number */}
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontWeight: 700,
                      fontSize: 80,
                      color: COLORS.primaryAlpha(0.15),
                      textShadow: `0 0 40px ${COLORS.primaryAlpha(0.1)}`,
                      lineHeight: 1,
                      marginBottom: 16,
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: FONTS.mono,
                      fontWeight: 700,
                      fontSize: 28,
                      color: COLORS.text,
                      margin: "0 0 12px",
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: FONTS.sans,
                      fontSize: 18,
                      color: COLORS.textMuted,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {step.description}
                  </p>
                </GlassCard>
              </div>
            );
          })}
        </div>

        {/* Code comment */}
        <p
          style={{
            fontFamily: FONTS.mono,
            fontSize: 16,
            color: COLORS.primaryAlpha(0.6),
            marginTop: 48,
            opacity: commentOpacity,
          }}
        >
          {"// no backend. no middleman. just smart contracts."}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
