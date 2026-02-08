import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DotGrid } from "../components/DotGrid";
import { NeonGlow } from "../components/NeonGlow";
import { GlassCard } from "../components/GlassCard";
import { COLORS, FONTS } from "../styles/theme";

// Simulated price animation
const getAnimatedPrice = (frame: number): string => {
  const base = 97432.5;
  const variation = Math.sin(frame * 0.08) * 15 + Math.cos(frame * 0.13) * 8;
  return (base + variation).toFixed(2);
};

// Price ticker items
const TICKER_ITEMS = [
  { symbol: "FLR", price: "0.0243" },
  { symbol: "BTC", price: "97,432.50" },
  { symbol: "ETH", price: "3,241.18" },
  { symbol: "XRP", price: "2.4120" },
  { symbol: "SOL", price: "198.45" },
];

export const DuelSimulation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene phases
  const phase1End = 60;  // Create UI appears
  const phase2End = 150; // Selection animation
  const phase3End = 240; // Duel card appears
  const phase4End = 360; // Settlement + confetti

  // Price ticker scroll — one set of 5 items is ~620px wide (with gaps).
  // We render 10 copies (~6200px) to guarantee coverage well beyond 1920px viewport,
  // and cycle the offset over one set width so the loop is seamless.
  const TICKER_SET_WIDTH = 620;
  const tickerX = -(frame * 1.5) % TICKER_SET_WIDTH;

  // Create card slides in
  const createCardY = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  // Asset selection (BTC highlights)
  const btcSelected = frame > 30;
  const upSelected = frame > 60;
  const stakeVisible = frame > 80;

  // Challenge button pulses
  const challengeScale = frame > 100
    ? 1 + Math.sin(frame * 0.15) * 0.03
    : 1;

  // Duel card appears
  const duelCardOpacity = interpolate(frame, [phase2End, phase2End + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Opponent joins flash
  const opponentJoined = frame > phase3End - 40;
  const flashOpacity = opponentJoined
    ? interpolate(frame, [phase3End - 40, phase3End - 20, phase3End], [0, 0.6, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Settlement
  const settling = frame > phase3End;
  const winReveal = frame > phase3End + 40;

  // Confetti particles
  const confettiColors = [COLORS.primary, COLORS.accent, COLORS.success, COLORS.secondary];
  const confettiParticles = winReveal
    ? Array.from({ length: 30 }, (_, i) => ({
        x: 960 + Math.sin(i * 2.1 + frame * 0.05) * (200 + i * 15),
        y: 400 - (frame - phase3End - 40) * (3 + i * 0.5) + Math.sin(i) * 100,
        color: confettiColors[i % confettiColors.length],
        size: 6 + (i % 4) * 3,
        rotation: frame * (5 + i),
      }))
    : [];

  // Winnings counter
  const winAmount = winReveal
    ? interpolate(frame, [phase3End + 40, phase3End + 70], [0, 1.9], {
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill>
      <DotGrid fadeIn={false} />
      <NeonGlow color={COLORS.primaryAlpha(0.1)} />

      {/* Price Ticker Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 48,
          background: "rgba(5, 5, 6, 0.6)",
          borderBottom: `1px solid ${COLORS.border}`,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 32,
            transform: `translateX(${tickerX}px)`,
            whiteSpace: "nowrap",
          }}
        >
          {Array(10).fill(TICKER_ITEMS).flat().map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 14, fontWeight: 700, color: COLORS.primary }}>
                {item.symbol}
              </span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 14, color: "#E2E8F0" }}>
                ${item.symbol === "BTC" ? getAnimatedPrice(frame) : item.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 48,
          padding: "80px 80px 40px",
        }}
      >
        {/* Left: Create Duel Card */}
        <div
          style={{
            width: duelCardOpacity > 0.01 ? 560 : 640,
            flexShrink: 0,
            transform: `translateY(${40 * (1 - createCardY)}px)`,
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <GlassCard style={{ padding: 40 }}>
            {/* Header */}
            <h2 style={{ fontFamily: FONTS.mono, fontSize: 30, fontWeight: 700, color: COLORS.primary, margin: "0 0 6px" }}>
              CREATE A DUEL
            </h2>
            <p style={{ fontFamily: FONTS.sans, fontSize: 15, color: "#64748B", margin: "0 0 24px" }}>
              Pick an asset, predict the direction, stake your FLR
            </p>

            {/* Mode Toggle */}
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              <div style={{
                flex: 1, padding: "14px 0", borderRadius: 10, textAlign: "center",
                fontFamily: FONTS.mono, fontSize: 16, fontWeight: 700,
                background: COLORS.primary, color: "white",
                boxShadow: `0 0 15px ${COLORS.primaryAlpha(0.3)}`,
              }}>
                PRICE
              </div>
              <div style={{
                flex: 1, padding: "14px 0", borderRadius: 10, textAlign: "center",
                fontFamily: FONTS.mono, fontSize: 16, fontWeight: 700,
                background: COLORS.secondaryAlpha(0.1), color: COLORS.textSlate400,
              }}>
                DATA
              </div>
            </div>

            {/* Asset Pills */}
            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
              {["BTC", "ETH", "FLR", "XRP", "SOL"].map((asset) => (
                <div
                  key={asset}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 10,
                    fontFamily: FONTS.mono,
                    fontSize: 16,
                    fontWeight: 700,
                    background: btcSelected && asset === "BTC"
                      ? COLORS.primary
                      : COLORS.primaryAlpha(0.1),
                    color: btcSelected && asset === "BTC"
                      ? "white"
                      : COLORS.textSlate400,
                    boxShadow: btcSelected && asset === "BTC"
                      ? `0 0 15px ${COLORS.primaryAlpha(0.3)}`
                      : "none",
                  }}
                >
                  {asset}
                </div>
              ))}
            </div>

            {/* Price Display */}
            <div style={{
              padding: 16, borderRadius: 10, marginBottom: 24,
              background: COLORS.primaryAlpha(0.05),
              border: `1px solid ${COLORS.primaryAlpha(0.15)}`,
            }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 14, color: "#64748B" }}>Current BTC/USD Price</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 32, fontWeight: 700, color: "#F1F5F9" }}>
                ${getAnimatedPrice(frame)}
              </div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 13, color: "#64748B", marginTop: 4 }}>
                via Flare FTSO v2 — updates every ~1.8s
              </div>
            </div>

            {/* Direction Buttons */}
            <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
              <div style={{
                flex: 1, padding: "20px 0", borderRadius: 14, textAlign: "center",
                fontFamily: FONTS.mono, fontSize: 24, fontWeight: 700,
                background: upSelected ? COLORS.success : COLORS.successAlpha(0.1),
                color: upSelected ? "white" : COLORS.successAlpha(0.6),
                boxShadow: upSelected ? `0 0 20px ${COLORS.successAlpha(0.4)}` : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              }}>
                ▲ UP
              </div>
              <div style={{
                flex: 1, padding: "20px 0", borderRadius: 14, textAlign: "center",
                fontFamily: FONTS.mono, fontSize: 24, fontWeight: 700,
                background: COLORS.errorAlpha(0.1),
                color: COLORS.errorAlpha(0.6),
                border: `1px solid ${COLORS.errorAlpha(0.2)}`,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              }}>
                ▼ DOWN
              </div>
            </div>

            {/* Stake */}
            {stakeVisible && (
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  padding: "16px 20px", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "rgba(5, 5, 6, 0.6)",
                  border: `1px solid ${COLORS.primaryAlpha(0.3)}`,
                  boxShadow: `0 0 15px ${COLORS.primaryAlpha(0.1)}`,
                }}>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 24, color: "#F1F5F9" }}>1.00</span>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 16, fontWeight: 700, color: COLORS.accent }}>FLR</span>
                </div>
              </div>
            )}

            {/* Challenge Button */}
            <div style={{
              padding: "20px 0", borderRadius: 14, textAlign: "center",
              fontFamily: FONTS.mono, fontSize: 22, fontWeight: 700,
              background: stakeVisible
                ? `linear-gradient(to right, ${COLORS.primary}, #A01540)`
                : "#1E293B",
              color: stakeVisible ? "white" : "#64748B",
              transform: `scale(${challengeScale})`,
              boxShadow: stakeVisible ? `0 0 25px ${COLORS.primaryAlpha(0.5)}` : "none",
            }}>
              CHALLENGE
            </div>
          </GlassCard>
        </div>

        {/* Right: Duel Card / Settlement — only mount when visible */}
        {duelCardOpacity > 0.01 && (
        <div
          style={{
            width: 560,
            flexShrink: 0,
            opacity: duelCardOpacity,
          }}
        >
          {!winReveal ? (
            <GlassCard style={{ padding: 32 }}>
              {/* Duel in progress */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 8,
                    background: COLORS.primaryAlpha(0.15),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: FONTS.mono, fontWeight: 700, fontSize: 16, color: COLORS.primary,
                  }}>
                    BTC
                  </div>
                  <div>
                    <div style={{ fontFamily: FONTS.sans, fontSize: 16, fontWeight: 600, color: "#E2E8F0" }}>BTC/USD</div>
                    <div style={{ fontFamily: FONTS.sans, fontSize: 13, color: COLORS.success, display: "flex", alignItems: "center", gap: 4 }}>
                      ▲ UP
                    </div>
                  </div>
                </div>
                <div style={{
                  padding: "4px 8px", borderRadius: 4,
                  background: COLORS.primary, color: "white",
                  fontFamily: FONTS.mono, fontSize: 11, fontWeight: 700,
                }}>
                  PRICE
                </div>
              </div>

              {/* Stake */}
              <div style={{ fontFamily: FONTS.mono, fontSize: 20, fontWeight: 700, color: COLORS.accent, marginBottom: 8 }}>
                1.00 FLR
              </div>

              {/* Timer */}
              <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.textSlate400, marginBottom: 24 }}>
                {settling ? "Settling..." : `${Math.max(0, 89 - Math.floor((frame - phase2End) * 0.5))}s remaining`}
              </div>

              {/* VS graphic */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 24,
                padding: "24px 0",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.success, marginBottom: 4 }}>You</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 20, fontWeight: 700, color: COLORS.success }}>▲ UP</div>
                </div>
                <div style={{
                  fontFamily: FONTS.mono, fontSize: 24, fontWeight: 700,
                  color: COLORS.primaryAlpha(0.4),
                }}>
                  VS
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: opponentJoined ? COLORS.error : "#334155", marginBottom: 4 }}>
                    {opponentJoined ? "0x3f...8a2c" : "Waiting..."}
                  </div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 20, fontWeight: 700, color: opponentJoined ? COLORS.error : "#334155" }}>
                    ▼ DOWN
                  </div>
                </div>
              </div>
            </GlassCard>
          ) : (
            /* Win State */
            <GlassCard
              style={{
                padding: 48,
                textAlign: "center",
                border: `2px solid ${COLORS.successAlpha(0.3)}`,
                boxShadow: `0 0 40px ${COLORS.successAlpha(0.2)}`,
              }}
            >
              <div style={{
                fontFamily: FONTS.mono, fontSize: 64, fontWeight: 700,
                color: COLORS.success,
                textShadow: `0 0 60px ${COLORS.successAlpha(0.5)}`,
                marginBottom: 8,
              }}>
                YOU WIN!
              </div>
              <div style={{
                fontFamily: FONTS.mono, fontSize: 36, fontWeight: 700,
                color: COLORS.accent,
                textShadow: `0 0 40px ${COLORS.accentAlpha(0.5)}`,
              }}>
                +{winAmount.toFixed(2)} FLR
              </div>
              <div style={{
                fontFamily: FONTS.sans, fontSize: 14, color: COLORS.textMuted,
                marginTop: 12,
              }}>
                Settled by Flare FTSO v2 in 1.8 seconds
              </div>
            </GlassCard>
          )}
        </div>
        )}
      </AbsoluteFill>

      {/* Opponent Flash */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 70% 50%, ${COLORS.primaryAlpha(flashOpacity)} 0%, transparent 50%)`,
          }}
        />
      )}

      {/* Confetti */}
      {confettiParticles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.size > 8 ? 2 : "50%",
            transform: `rotate(${p.rotation}deg)`,
            opacity: interpolate(
              frame,
              [phase3End + 40, phase3End + 100],
              [1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
