import { Audio, Composition, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { LogoReveal } from "./scenes/LogoReveal";
import { Tagline } from "./scenes/Tagline";
import { HowItWorks } from "./scenes/HowItWorks";
import { DuelSimulation } from "./scenes/DuelSimulation";
import { TechStack } from "./scenes/TechStack";
import { Closing } from "./scenes/Closing";
import { VIDEO_CONFIG, SCENES } from "./styles/theme";

const BackgroundMusic: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in over the first 1s (30 frames), fade out over the last 2s (60 frames)
  const volume = interpolate(
    frame,
    [0, 30, VIDEO_CONFIG.durationInFrames - 60, VIDEO_CONFIG.durationInFrames],
    [0, 0.35, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return <Audio src={staticFile("music.mp3")} volume={volume} />;
};

export const DegenDuelPromo: React.FC = () => {
  return (
    <>
      {/* Background music with fade in/out */}
      <BackgroundMusic />

      <Sequence from={SCENES.logoReveal.from} durationInFrames={SCENES.logoReveal.duration}>
        <LogoReveal />
      </Sequence>

      <Sequence from={SCENES.tagline.from} durationInFrames={SCENES.tagline.duration}>
        <Tagline />
      </Sequence>

      <Sequence from={SCENES.howItWorks.from} durationInFrames={SCENES.howItWorks.duration}>
        <HowItWorks />
      </Sequence>

      <Sequence from={SCENES.duelSimulation.from} durationInFrames={SCENES.duelSimulation.duration}>
        <DuelSimulation />
      </Sequence>

      <Sequence from={SCENES.techStack.from} durationInFrames={SCENES.techStack.duration}>
        <TechStack />
      </Sequence>

      <Sequence from={SCENES.closing.from} durationInFrames={SCENES.closing.duration}>
        <Closing />
      </Sequence>
    </>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DegenDuelPromo"
        component={DegenDuelPromo}
        durationInFrames={VIDEO_CONFIG.durationInFrames}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />

      {/* Individual scene compositions for previewing/testing */}
      <Composition
        id="LogoReveal"
        component={LogoReveal}
        durationInFrames={SCENES.logoReveal.duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="Tagline"
        component={Tagline}
        durationInFrames={SCENES.tagline.duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="HowItWorks"
        component={HowItWorks}
        durationInFrames={SCENES.howItWorks.duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="DuelSimulation"
        component={DuelSimulation}
        durationInFrames={SCENES.duelSimulation.duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="TechStack"
        component={TechStack}
        durationInFrames={SCENES.techStack.duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="Closing"
        component={Closing}
        durationInFrames={SCENES.closing.duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
    </>
  );
};
