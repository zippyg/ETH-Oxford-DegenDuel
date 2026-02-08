// DegenDuel brand colors — exact match with frontend globals.css + DaisyUI theme
export const COLORS = {
  primary: "#E62058",
  secondary: "#6C93EC",
  accent: "#F59E0B",
  success: "#10B981",
  error: "#EF4444",
  indigo: "#4F46E5",

  bg: "#0A0A0B",
  bgDeep: "#050506",
  bgDeepest: "#020202",

  text: "#E8E8E8",
  textMuted: "#888888",
  textSlate400: "#94A3B8",

  border: "rgba(148, 163, 184, 0.1)",
  borderMedium: "rgba(148, 163, 184, 0.12)",

  // Transparent variants
  primaryAlpha: (a: number) => `rgba(230, 32, 88, ${a})`,
  secondaryAlpha: (a: number) => `rgba(108, 147, 236, ${a})`,
  accentAlpha: (a: number) => `rgba(245, 158, 11, ${a})`,
  successAlpha: (a: number) => `rgba(16, 185, 129, ${a})`,
  errorAlpha: (a: number) => `rgba(239, 68, 68, ${a})`,
} as const;

export const GRADIENTS = {
  textPrimary: "linear-gradient(135deg, #E62058, #F59E0B)",
  border: "linear-gradient(135deg, #E62058, #6C93EC)",
  borderGold: "linear-gradient(135deg, #F59E0B, #EAB308)",
  body: `radial-gradient(ellipse at top, rgba(230, 32, 88, 0.04) 0%, transparent 50%),
         radial-gradient(ellipse at bottom right, rgba(108, 147, 236, 0.03) 0%, transparent 50%),
         #0A0A0B`,
} as const;

// Using system fonts since we can't load Google Fonts easily in Remotion
// JetBrains Mono will be loaded via @remotion/google-fonts or staticFile
export const FONTS = {
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as const;

export const VIDEO_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 1350, // 45 seconds
} as const;

// Scene timing (in frames at 30fps)
export const SCENES = {
  logoReveal: { from: 0, duration: 120 },       // 0s - 4s
  tagline: { from: 120, duration: 90 },          // 4s - 7s
  howItWorks: { from: 210, duration: 270 },      // 7s - 16s
  duelSimulation: { from: 480, duration: 360 },  // 16s - 28s
  techStack: { from: 840, duration: 300 },       // 28s - 38s
  closing: { from: 1140, duration: 210 },        // 38s - 45s
} as const;
