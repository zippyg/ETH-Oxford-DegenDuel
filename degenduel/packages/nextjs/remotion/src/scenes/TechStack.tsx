import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DotGrid } from "../components/DotGrid";
import { GlassCard } from "../components/GlassCard";
import { COLORS, FONTS } from "../styles/theme";

const technologies = [
  {
    title: "FTSO v2",
    description: "Decentralized price feeds from 100+ validators. Free to read. Updates every block.",
    accentColor: COLORS.primary,
    logo: "logos/flare.svg",
  },
  {
    title: "FDC Web2Json",
    description: "Any API becomes an oracle. Validators fetch, verify, and produce Merkle proofs.",
    accentColor: COLORS.secondary,
    logo: "logos/flare.svg",
  },
  {
    title: "Secure RNG",
    description: "Verifiable on-chain randomness. Powers the 10% bonus multiplier.",
    accentColor: COLORS.success,
    logo: "logos/flare.svg",
  },
  {
    title: "Effect-TS",
    description: "12 effect types in production. Type-safe functional programming for the entire backend.",
    accentColor: COLORS.indigo,
    logo: "logos/effect-ts.png",
  },
  {
    title: "FLock AI",
    description: "Decentralized AI strategy hints. Powered by qwen3-30b on FLock's network.",
    accentColor: COLORS.secondary,
    logo: "logos/flock.png",
  },
  {
    title: "ETH Oxford 2026",
    description: "Built in 24 hours at Europe's premier Ethereum hackathon.",
    accentColor: COLORS.accent,
    logo: "logos/eth-oxford.svg",
  },
];

// Fixed card height so all 6 cards are identical size
const CARD_HEIGHT = 200;

export const TechStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <DotGrid fadeIn={false} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontFamily: FONTS.mono,
            fontWeight: 700,
            fontSize: 64,
            color: COLORS.text,
            textAlign: "center",
            marginBottom: 56,
            opacity: titleOpacity,
          }}
        >
          POWERED BY
        </h2>

        {/* Grid of tech cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 28,
            width: "100%",
            maxWidth: 1600,
          }}
        >
          {technologies.map((tech, index) => {
            const delay = 30 + index * 20;
            const cardProgress = spring({
              frame: frame - delay,
              fps,
              config: { damping: 20, stiffness: 80, mass: 0.8 },
            });

            const cardOpacity = interpolate(
              frame,
              [delay, delay + 15],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            // Subtle hover-lift simulation
            const liftAmount = cardOpacity === 1
              ? Math.sin((frame - delay) * 0.05 + index) * 3
              : 0;

            return (
              <div
                key={tech.title}
                style={{
                  opacity: cardOpacity,
                  transform: `translateY(${30 * (1 - Math.max(0, cardProgress)) + liftAmount}px) scale(${0.95 + 0.05 * Math.max(0, cardProgress)})`,
                }}
              >
                <GlassCard
                  accentColor={tech.accentColor}
                  style={{
                    padding: 32,
                    height: CARD_HEIGHT,
                    display: "flex",
                    flexDirection: "column",
                    borderColor: `${tech.accentColor}14`,
                  }}
                >
                  {/* Logo */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 10,
                      background: `${tech.accentColor}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 18,
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <Img
                      src={staticFile(tech.logo)}
                      style={{
                        width: 32,
                        height: 32,
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: FONTS.mono,
                      fontWeight: 700,
                      fontSize: 22,
                      color: COLORS.text,
                      margin: "0 0 10px",
                    }}
                  >
                    {tech.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: FONTS.sans,
                      fontSize: 16,
                      color: COLORS.textMuted,
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {tech.description}
                  </p>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
