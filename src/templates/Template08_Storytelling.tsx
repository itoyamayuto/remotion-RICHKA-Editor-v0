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
  elasticSlideIn,
  glitchText,
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

export const Template08_Storytelling: React.FC<VideoAdProps> = ({
  inputs,
  tone,
  aspectRatio,
  bgmSrc,
  logoSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const characterDesc = inputs.characterDesc || "毎日忙しく働くあなたへ";
  const conflictText = inputs.conflictText || "でも、体の疲れが取れない日々が続いていませんか？";
  const journeyText = inputs.journeyText || "そんな時、一つの出会いが全てを変えました";
  const resolutionText = inputs.resolutionText || "今では毎朝スッキリ目覚められるように！";
  const tagline = inputs.tagline || "あなたの物語を、ここから。";
  const ctaText = inputs.ctaText || "始めてみる";

  const textSize = isVert(aspectRatio) ? 30 : isHoriz(aspectRatio) ? 38 : 34;
  const taglineSize = isVert(aspectRatio) ? 36 : isHoriz(aspectRatio) ? 52 : 44;
  const padding = isVert(aspectRatio) ? "0 32px" : isHoriz(aspectRatio) ? "0 100px" : "0 60px";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {bgmSrc && <Audio src={staticFile(bgmSrc)} volume={0.3} />}

      {/* Scene 1: Character Intro - cinematic gradient */}
      <Sequence from={0} durationInFrames={SCENE}>
        <SceneWrapper startFrame={0} endFrame={SCENE} aspectRatio={aspectRatio} transition="fade">
          <GradientBackground tone={tone} variant="mesh" />
          {/* Cinematic letterbox bars */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: height * 0.1,
              background: "black",
              opacity: interpolate(
                spring({ frame, fps, config: { damping: 20, stiffness: 80 } }),
                [0, 1],
                [0, 0.7]
              ),
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: height * 0.1,
              background: "black",
              opacity: interpolate(
                spring({ frame, fps, config: { damping: 20, stiffness: 80 } }),
                [0, 1],
                [0, 0.7]
              ),
              zIndex: 2,
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
              padding,
              zIndex: 1,
            }}
          >
            {/* Chapter label */}
            <div
              style={{
                fontSize: 16,
                color: tone.accent,
                fontWeight: 600,
                fontFamily: FONT,
                letterSpacing: "0.3em",
                marginBottom: 24,
                opacity: springScale(frame, fps, 5),
                textTransform: "uppercase",
              }}
            >
              CHAPTER 1
            </div>
            <AnimatedText
              text={characterDesc}
              tone={tone}
              fontSize={textSize}
              fontWeight={700}
              mode="typewriter"
              delay={12}
              style={{ textAlign: "center" }}
            />
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 2: Conflict - darker mood with shake */}
      <Sequence from={SCENE} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE} endFrame={SCENE * 2} aspectRatio={aspectRatio} transition="fade">
          {/* Dark overlay gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, ${tone.bgDark}, ${tone.bgDark}EE, ${tone.gradientStart}44)`,
            }}
          />
          {/* Subtle vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
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
              padding,
            }}
          >
            <div
              style={{
                fontSize: 16,
                color: "#FF6B6B",
                fontWeight: 600,
                fontFamily: FONT,
                letterSpacing: "0.3em",
                marginBottom: 24,
                opacity: springScale(frame, fps, 5),
              }}
            >
              CHAPTER 2
            </div>
            {/* Conflict text with subtle shake effect */}
            {(() => {
              const localFrame = frame;
              const shakeX = localFrame > 15 && localFrame < 60
                ? Math.sin(localFrame * 1.5) * 2.5
                : 0;
              const shakeY = localFrame > 15 && localFrame < 60
                ? Math.cos(localFrame * 1.8) * 1.5
                : 0;
              return (
                <div style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
                  <AnimatedText
                    text={conflictText}
                    tone={tone}
                    fontSize={textSize}
                    fontWeight={700}
                    color="#FF6B6B"
                    mode="charReveal"
                    delay={12}
                    style={{ textAlign: "center" }}
                  />
                </div>
              );
            })()}
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 3: Journey - transition to brighter */}
      <Sequence from={SCENE * 2} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE * 2} endFrame={SCENE * 3} aspectRatio={aspectRatio} transition="slide">
          {/* Transitional gradient - mid brightness */}
          {(() => {
            const localFrame = frame;
            const brightProgress = interpolate(localFrame, [0, SCENE], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const morph = morphGradient(localFrame, SCENE, 180, 360);
            return (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(${morph.angle}deg, ${tone.bgDark}, ${tone.gradientStart}${Math.round(brightProgress * 200).toString(16).padStart(2, "0")}, ${tone.accent}${Math.round(brightProgress * 100).toString(16).padStart(2, "0")})`,
                }}
              />
            );
          })()}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding,
            }}
          >
            <div
              style={{
                fontSize: 16,
                color: tone.accent,
                fontWeight: 600,
                fontFamily: FONT,
                letterSpacing: "0.3em",
                marginBottom: 24,
                opacity: springScale(frame, fps, 5),
              }}
            >
              CHAPTER 3
            </div>
            <AnimatedText
              text={journeyText}
              tone={tone}
              fontSize={textSize}
              fontWeight={700}
              mode="wave"
              delay={12}
              style={{ textAlign: "center" }}
            />
            {/* Rising arrow motif */}
            <div
              style={{
                marginTop: 24,
                fontSize: 36,
                opacity: springScale(frame, fps, 40),
                transform: `translateY(${interpolate(
                  springScale(frame, fps, 40),
                  [0, 1],
                  [20, 0]
                )}px)`,
                color: tone.accent,
              }}
            >
              ↑
            </div>
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 4: Resolution - bright/positive with particles */}
      <Sequence from={SCENE * 3} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE * 3} endFrame={SCENE * 4} aspectRatio={aspectRatio} transition="zoom">
          <GradientBackground tone={tone} variant="mesh" />
          <ParticleOverlay tone={tone} count={35} />
          {/* Bright overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 50% 50%, ${tone.accent}15, transparent 70%)`,
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
              padding,
            }}
          >
            <div
              style={{
                fontSize: 16,
                color: tone.accent,
                fontWeight: 600,
                fontFamily: FONT,
                letterSpacing: "0.3em",
                marginBottom: 24,
                opacity: springScale(frame, fps, 5),
              }}
            >
              CHAPTER 4
            </div>
            <AnimatedText
              text={resolutionText}
              tone={tone}
              fontSize={textSize + 4}
              fontWeight={800}
              mode="wave"
              delay={10}
              style={{ textAlign: "center" }}
            />
            {/* Success sparkle */}
            <div
              style={{
                marginTop: 20,
                fontSize: 40,
                opacity: springScale(frame, fps, 35),
                transform: `scale(${springScale(frame, fps, 35)})`,
              }}
            >
              ✨
            </div>
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 5: Tagline + CTA */}
      <Sequence from={SCENE * 4} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE * 4} endFrame={SCENE * 5} aspectRatio={aspectRatio} transition="fade">
          <GradientBackground tone={tone} variant="radial" />
          <ParticleOverlay tone={tone} count={20} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 28,
              padding,
            }}
          >
            <AnimatedText
              text={tagline}
              tone={tone}
              fontSize={taglineSize}
              fontWeight={800}
              mode="typewriter"
              delay={5}
              style={{ textAlign: "center" }}
            />
            <CTAButton text={ctaText} tone={tone} delay={30} />
            <div style={{ marginTop: 16 }}>
              <LogoReveal
                serviceName=""
                tone={tone}
                delay={40}
                logoImageSrc={logoSrc || undefined}
              />
            </div>
          </div>
        </SceneWrapper>
      </Sequence>
    </div>
  );
};
