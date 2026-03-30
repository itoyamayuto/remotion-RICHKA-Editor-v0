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
import { CountdownTimer } from "../remotion/components/CountdownTimer";
import { ParticleOverlay } from "../remotion/components/ParticleOverlay";
import {
  springScale,
  pulseGlow,
  elasticSlideIn,
  staggeredReveal,
} from "../remotion/animations";

function isVert(ar: AspectRatio) {
  return ar.id === "vertical";
}
function isHoriz(ar: AspectRatio) {
  return ar.id === "horizontal";
}

const SCENE = 90;
const FONT = "Noto Sans JP, sans-serif";

export const Template09_Countdown: React.FC<VideoAdProps> = ({
  inputs,
  tone,
  aspectRatio,
  bgmSrc,
  logoSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const urgencyHook = inputs.urgencyHook || "見逃し厳禁！";
  const offerDetail = inputs.offerDetail || "全品50%OFF";
  const deadline = inputs.deadline || "3日間";
  const bonusText = inputs.bonusText || "今だけ送料無料＋限定特典付き！";
  const ctaText = inputs.ctaText || "今すぐ購入";

  const hookSize = isVert(aspectRatio) ? 40 : isHoriz(aspectRatio) ? 56 : 48;
  const offerSize = isVert(aspectRatio) ? 52 : isHoriz(aspectRatio) ? 72 : 64;
  const timerSize = isVert(aspectRatio) ? 180 : isHoriz(aspectRatio) ? 240 : 220;
  const padding = isVert(aspectRatio) ? "0 28px" : isHoriz(aspectRatio) ? "0 80px" : "0 50px";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {bgmSrc && <Audio src={staticFile(bgmSrc)} volume={0.3} />}

      {/* Scene 1: Urgency Hook - flashing/pulsing */}
      <Sequence from={0} durationInFrames={SCENE}>
        <SceneWrapper startFrame={0} endFrame={SCENE} aspectRatio={aspectRatio} transition="zoom">
          <GradientBackground tone={tone} variant="default" />
          {/* Pulsing radial highlight */}
          {(() => {
            const glow = pulseGlow(frame, fps, 4, 0, 40);
            return (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at 50% 50%, ${tone.accent}${Math.round(glow.opacity * 40).toString(16).padStart(2, "0")}, transparent 60%)`,
                }}
              />
            );
          })()}
          {/* Flash overlay */}
          {(() => {
            const flashOpacity = frame < 8
              ? interpolate(frame, [0, 4, 8], [0.8, 0, 0.4])
              : frame < 16
                ? interpolate(frame, [8, 12, 16], [0.4, 0, 0.2])
                : 0;
            return (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: tone.accent,
                  opacity: flashOpacity,
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
              gap: 16,
              padding,
            }}
          >
            {/* Alert icon */}
            <div
              style={{
                fontSize: isVert(aspectRatio) ? 48 : 60,
                transform: `scale(${springScale(frame, fps, 3)}) rotate(${Math.sin(frame * 0.3) * 10}deg)`,
              }}
            >
              ⚡
            </div>
            <AnimatedText
              text={urgencyHook}
              tone={tone}
              fontSize={hookSize}
              fontWeight={900}
              color={tone.accent}
              mode="wave"
              delay={8}
              style={{ textAlign: "center" }}
            />
            {/* Pulsing border frame */}
            {(() => {
              const glow = pulseGlow(frame, fps, 3, 5, 20);
              return (
                <div
                  style={{
                    position: "absolute",
                    inset: 30,
                    border: `3px solid ${tone.accent}`,
                    borderRadius: 16,
                    opacity: glow.opacity * 0.6,
                    boxShadow: `inset 0 0 ${glow.blur}px ${tone.accent}33, 0 0 ${glow.blur}px ${tone.accent}33`,
                    pointerEvents: "none",
                  }}
                />
              );
            })()}
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 2: Offer Details */}
      <Sequence from={SCENE} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE} endFrame={SCENE * 2} aspectRatio={aspectRatio} transition="wipe">
          <GradientBackground tone={tone} variant="radial" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              padding,
            }}
          >
            {/* Sale badge */}
            <div
              style={{
                background: tone.accent,
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: 700,
                fontFamily: FONT,
                padding: "8px 24px",
                borderRadius: 24,
                letterSpacing: "0.1em",
                opacity: springScale(frame, fps, 0),
                transform: `scale(${springScale(frame, fps, 0)})`,
              }}
            >
              期間限定セール
            </div>
            {/* Big offer text */}
            <div
              style={{
                fontSize: offerSize,
                fontWeight: 900,
                color: tone.textPrimary,
                fontFamily: FONT,
                textAlign: "center",
                opacity: springScale(frame, fps, 10),
                transform: `scale(${springScale(frame, fps, 10)})`,
                textShadow: `0 0 40px ${tone.accent}44`,
                lineHeight: 1.2,
              }}
            >
              {offerDetail}
            </div>
            {/* Decorative line */}
            <div
              style={{
                width: interpolate(
                  springScale(frame, fps, 25),
                  [0, 1],
                  [0, isVert(aspectRatio) ? width * 0.5 : width * 0.25]
                ),
                height: 3,
                background: `linear-gradient(90deg, transparent, ${tone.accent}, transparent)`,
                borderRadius: 2,
              }}
            />
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 3: Countdown Timer */}
      <Sequence from={SCENE * 2} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE * 2} endFrame={SCENE * 3} aspectRatio={aspectRatio} transition="zoom">
          <GradientBackground tone={tone} variant="mesh" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: tone.textSecondary,
                fontFamily: FONT,
                letterSpacing: "0.15em",
                opacity: springScale(frame, fps, 0),
              }}
            >
              終了まで
            </div>
            <div
              style={{
                opacity: springScale(frame, fps, 8),
                transform: `scale(${springScale(frame, fps, 8)})`,
              }}
            >
              <CountdownTimer tone={tone} deadline={deadline} size={timerSize} />
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: tone.accent,
                fontFamily: FONT,
                opacity: springScale(frame, fps, 30),
                animation: "none",
              }}
            >
              お急ぎください！
            </div>
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 4: Last Chance - Bonus */}
      <Sequence from={SCENE * 3} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE * 3} endFrame={SCENE * 4} aspectRatio={aspectRatio} transition="wipe">
          <GradientBackground tone={tone} variant="radial" />
          <ParticleOverlay tone={tone} count={25} />
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
            {/* Last chance badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity: springScale(frame, fps, 0),
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  transform: `rotate(${Math.sin(frame * 0.2) * 15}deg)`,
                }}
              >
                🎁
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: tone.accent,
                  fontFamily: FONT,
                  letterSpacing: "0.1em",
                }}
              >
                LAST CHANCE
              </div>
            </div>
            <AnimatedText
              text={bonusText}
              tone={tone}
              fontSize={isVert(aspectRatio) ? 28 : 36}
              fontWeight={700}
              mode="wave"
              delay={12}
              style={{ textAlign: "center" }}
            />
            {/* Urgency bar */}
            {(() => {
              const localFrame = frame;
              const barProgress = interpolate(localFrame, [30, 70], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const barWidth = isVert(aspectRatio) ? width * 0.7 : width * 0.35;
              return (
                <div
                  style={{
                    width: barWidth,
                    height: 8,
                    borderRadius: 4,
                    background: `${tone.bgDark}CC`,
                    overflow: "hidden",
                    opacity: springScale(localFrame, fps, 25),
                  }}
                >
                  <div
                    style={{
                      width: `${barProgress * 100}%`,
                      height: "100%",
                      borderRadius: 4,
                      background: `linear-gradient(90deg, ${tone.accent}, #FF4444)`,
                      boxShadow: `0 0 10px ${tone.accent}66`,
                    }}
                  />
                </div>
              );
            })()}
            <div
              style={{
                fontSize: 16,
                color: tone.textSecondary,
                fontFamily: FONT,
                opacity: springScale(frame, fps, 45),
              }}
            >
              ※在庫がなくなり次第終了
            </div>
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 5: CTA with urgency */}
      <Sequence from={SCENE * 4} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE * 4} endFrame={SCENE * 5} aspectRatio={aspectRatio} transition="fade">
          <GradientBackground tone={tone} variant="default" />
          <ParticleOverlay tone={tone} count={20} />
          {/* Urgent pulsing background */}
          {(() => {
            const glow = pulseGlow(frame, fps, 3, 0, 30);
            return (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at 50% 60%, ${tone.accent}${Math.round(glow.opacity * 25).toString(16).padStart(2, "0")}, transparent 60%)`,
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
              gap: 28,
            }}
          >
            <AnimatedText
              text="このチャンスをお見逃しなく！"
              tone={tone}
              fontSize={isVert(aspectRatio) ? 26 : 32}
              fontWeight={700}
              color={tone.accent}
              mode="wave"
              delay={3}
            />
            <CTAButton text={ctaText} tone={tone} delay={15} />
            <div style={{ marginTop: 16 }}>
              <LogoReveal
                serviceName=""
                tone={tone}
                delay={28}
                logoImageSrc={logoSrc || undefined}
              />
            </div>
          </div>
        </SceneWrapper>
      </Sequence>
    </div>
  );
};
