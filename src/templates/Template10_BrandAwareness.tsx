import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
  interpolate,
  Sequence,
  spring,
} from "remotion";
import type { VideoAdProps, AspectRatio } from "../remotion/types";
import { SceneWrapper } from "../remotion/components/SceneWrapper";
import { AnimatedText } from "../remotion/components/AnimatedText";
import { CTAButton } from "../remotion/components/CTAButton";
import { GradientBackground } from "../remotion/components/GradientBackground";
import { LogoReveal } from "../remotion/components/LogoReveal";
import { ParticleOverlay } from "../remotion/components/ParticleOverlay";
import {
  springScale,
  staggeredReveal,
  morphGradient,
  pulseGlow,
} from "../remotion/animations";

function isVert(ar: AspectRatio) {
  return ar.id === "vertical";
}
function isHoriz(ar: AspectRatio) {
  return ar.id === "horizontal";
}

const SCENE = 90;
const FONT = "Noto Sans JP, sans-serif";

export const Template10_BrandAwareness: React.FC<VideoAdProps> = ({
  inputs,
  tone,
  aspectRatio,
  bgmSrc,
  logoSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const brandVision = inputs.brandVision || "世界をもっと、美しく。";
  const value1 = inputs.value1 || "品質へのこだわり";
  const value2 = inputs.value2 || "持続可能な未来";
  const value3 = inputs.value3 || "人と人をつなぐ";
  const tagline = inputs.tagline || "未来を創る、私たちの約束。";
  const ctaText = inputs.ctaText || "ブランドサイトへ";

  const visionSize = isVert(aspectRatio) ? 34 : isHoriz(aspectRatio) ? 48 : 42;
  const valueSize = isVert(aspectRatio) ? 26 : isHoriz(aspectRatio) ? 34 : 30;
  const taglineSize = isVert(aspectRatio) ? 38 : isHoriz(aspectRatio) ? 56 : 48;
  const padding = isVert(aspectRatio) ? "0 36px" : isHoriz(aspectRatio) ? "0 120px" : "0 80px";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {bgmSrc && <Audio src={staticFile(bgmSrc)} volume={0.3} />}

      {/* Scene 1: Brand Vision - elegant gradient + typewriter */}
      <Sequence from={0} durationInFrames={SCENE}>
        <SceneWrapper startFrame={0} endFrame={SCENE} aspectRatio={aspectRatio} transition="fade">
          <GradientBackground tone={tone} variant="mesh" />
          {/* Elegant subtle light */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at 50% 40%, ${tone.gradientStart}22, transparent 70%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
              padding,
            }}
          >
            {/* Thin decorative line above */}
            <div
              style={{
                width: interpolate(
                  spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 20, stiffness: 80 } }),
                  [0, 1],
                  [0, 60]
                ),
                height: 1,
                background: `${tone.accent}88`,
              }}
            />
            <AnimatedText
              text={brandVision}
              tone={tone}
              fontSize={visionSize}
              fontWeight={300}
              mode="typewriter"
              delay={10}
              style={{
                textAlign: "center",
                letterSpacing: "0.1em",
              }}
            />
            {/* Thin decorative line below */}
            <div
              style={{
                width: interpolate(
                  spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 20, stiffness: 80 } }),
                  [0, 1],
                  [0, 60]
                ),
                height: 1,
                background: `${tone.accent}88`,
              }}
            />
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 2: Values Reveal - staggered minimal design */}
      <Sequence from={SCENE} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE} endFrame={SCENE * 2} aspectRatio={aspectRatio} transition="fade">
          <GradientBackground tone={tone} variant="default" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: isVert(aspectRatio) ? 40 : 48,
              padding,
            }}
          >
            {/* Section label */}
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: tone.accent,
                fontFamily: FONT,
                letterSpacing: "0.4em",
                opacity: springScale(frame, fps, 0),
                textTransform: "uppercase",
              }}
            >
              OUR VALUES
            </div>

            {/* Three values staggered */}
            {[value1, value2, value3].map((val, i) => {
              const s = staggeredReveal(frame, fps, i, 12, 10);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    opacity: s.opacity,
                    transform: `translateY(${s.translateY}px)`,
                  }}
                >
                  {/* Number */}
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: tone.accent,
                      fontFamily: FONT,
                      letterSpacing: "0.1em",
                      minWidth: 36,
                    }}
                  >
                    0{i + 1}
                  </div>
                  {/* Vertical line */}
                  <div
                    style={{
                      width: 1,
                      height: 30,
                      background: `${tone.accent}66`,
                    }}
                  />
                  {/* Value text */}
                  <div
                    style={{
                      fontSize: valueSize,
                      fontWeight: 400,
                      color: tone.textPrimary,
                      fontFamily: FONT,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {val}
                  </div>
                </div>
              );
            })}
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 3: Visual Montage - morphing gradient + particles */}
      <Sequence from={SCENE * 2} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE * 2} endFrame={SCENE * 3} aspectRatio={aspectRatio} transition="fade">
          {/* Animated morphing gradient */}
          {(() => {
            const localFrame = frame;
            const m = morphGradient(localFrame, SCENE, 0, 360);
            return (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: [
                    `radial-gradient(circle at ${30 + Math.sin(localFrame * 0.04) * 25}% ${40 + Math.cos(localFrame * 0.03) * 25}%, ${tone.gradientStart}99, transparent 50%)`,
                    `radial-gradient(circle at ${70 + Math.cos(localFrame * 0.035) * 20}% ${60 + Math.sin(localFrame * 0.045) * 20}%, ${tone.accent}66, transparent 50%)`,
                    `radial-gradient(circle at ${50 + Math.sin(localFrame * 0.05) * 15}% ${30 + Math.cos(localFrame * 0.04) * 15}%, ${tone.primary}44, transparent 40%)`,
                    `linear-gradient(${m.angle}deg, ${tone.bgDark}, ${tone.bgDark})`,
                  ].join(", "),
                }}
              />
            );
          })()}
          <ParticleOverlay tone={tone} count={40} />
          {/* Subtle center glow */}
          {(() => {
            const glow = pulseGlow(frame, fps, 1.5, 10, 50);
            return (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: tone.accent,
                  filter: `blur(${glow.blur * 2}px)`,
                  opacity: glow.opacity * 0.15,
                }}
              />
            );
          })()}
          {/* Floating brand essence text */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: isVert(aspectRatio) ? 20 : 24,
                fontWeight: 300,
                color: `${tone.textPrimary}88`,
                fontFamily: FONT,
                letterSpacing: "0.5em",
                opacity: interpolate(
                  frame,
                  [10, 30, 60, 80],
                  [0, 0.8, 0.8, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                ),
              }}
            >
              BRAND STORY
            </div>
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 4: Tagline - big elegant text */}
      <Sequence from={SCENE * 3} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE * 3} endFrame={SCENE * 4} aspectRatio={aspectRatio} transition="fade">
          <GradientBackground tone={tone} variant="radial" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding,
              gap: 20,
            }}
          >
            {/* Thin line accent */}
            <div
              style={{
                width: interpolate(
                  springScale(frame, fps, 0),
                  [0, 1],
                  [0, 40]
                ),
                height: 1,
                background: tone.accent,
              }}
            />
            <AnimatedText
              text={tagline}
              tone={tone}
              fontSize={taglineSize}
              fontWeight={300}
              mode="charReveal"
              delay={8}
              style={{
                textAlign: "center",
                letterSpacing: "0.08em",
                lineHeight: 1.6,
              }}
            />
            <div
              style={{
                width: interpolate(
                  springScale(frame, fps, 50),
                  [0, 1],
                  [0, 40]
                ),
                height: 1,
                background: tone.accent,
              }}
            />
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 5: Logo + CTA (minimal, elegant) */}
      <Sequence from={SCENE * 4} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE * 4} endFrame={SCENE * 5} aspectRatio={aspectRatio} transition="fade">
          <GradientBackground tone={tone} variant="mesh" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 36,
            }}
          >
            <LogoReveal
              serviceName=""
              tone={tone}
              delay={5}
              size="large"
              logoImageSrc={logoSrc || undefined}
            />
            {/* Minimal spacer */}
            <div
              style={{
                width: 40,
                height: 1,
                background: `${tone.textSecondary}44`,
                opacity: springScale(frame, fps, 20),
              }}
            />
            <CTAButton text={ctaText} tone={tone} delay={25} />
          </div>
        </SceneWrapper>
      </Sequence>
    </div>
  );
};
