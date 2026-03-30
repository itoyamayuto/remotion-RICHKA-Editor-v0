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
import { ReviewCard } from "../remotion/components/ReviewCard";
import { ParticleOverlay } from "../remotion/components/ParticleOverlay";
import {
  springScale,
  counterAnimation,
  pulseGlow,
  staggeredReveal,
} from "../remotion/animations";

function isVert(ar: AspectRatio) {
  return ar.id === "vertical";
}
function isHoriz(ar: AspectRatio) {
  return ar.id === "horizontal";
}

const SCENE = 90;

export const Template06_Testimonial: React.FC<VideoAdProps> = ({
  inputs,
  tone,
  aspectRatio,
  bgmSrc,
  logoSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const review1 = inputs.review1 || "この商品を使ってから生活が変わりました！";
  const reviewer1 = inputs.reviewer1 || "田中 花子";
  const review2 = inputs.review2 || "友人にもおすすめしています。本当に良い！";
  const reviewer2 = inputs.reviewer2 || "鈴木 太郎";
  const rating = parseFloat(inputs.rating || "4.8");
  const totalReviews = inputs.totalReviews || "2,450";
  const ctaText = inputs.ctaText || "今すぐチェック";

  const cardWidth = isVert(aspectRatio) ? width * 0.85 : isHoriz(aspectRatio) ? width * 0.5 : width * 0.7;
  const titleSize = isVert(aspectRatio) ? 36 : isHoriz(aspectRatio) ? 44 : 40;
  const bigNumSize = isVert(aspectRatio) ? 100 : isHoriz(aspectRatio) ? 130 : 120;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {bgmSrc && <Audio src={staticFile(bgmSrc)} volume={0.3} />}

      {/* Scene 1: Star Rating Reveal */}
      <Sequence from={0} durationInFrames={SCENE}>
        <SceneWrapper startFrame={0} endFrame={SCENE} aspectRatio={aspectRatio} transition="zoom">
          <GradientBackground tone={tone} variant="radial" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              fontFamily: "Noto Sans JP, sans-serif",
            }}
          >
            {/* Subtitle */}
            <AnimatedText
              text="お客様満足度"
              tone={tone}
              fontSize={titleSize}
              fontWeight={700}
              mode="wave"
              delay={5}
            />
            {/* Big rating number */}
            <div
              style={{
                fontSize: bigNumSize,
                fontWeight: 900,
                color: tone.accent,
                transform: `scale(${springScale(frame, fps, 15)})`,
                textShadow: `0 0 30px ${tone.accent}66`,
                lineHeight: 1,
              }}
            >
              {counterAnimation(frame, fps, rating * 10, 15, 1.2) / 10}
            </div>
            {/* Stars */}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {Array.from({ length: 5 }, (_, i) => {
                const starDelay = 25 + i * 5;
                const scale = springScale(frame, fps, starDelay);
                const isFilled = i < Math.round(rating);
                return (
                  <div
                    key={i}
                    style={{
                      fontSize: isVert(aspectRatio) ? 40 : 52,
                      transform: `scale(${scale}) rotate(${(1 - scale) * 180}deg)`,
                      color: isFilled ? "#FFD700" : `${tone.textSecondary}40`,
                      filter: isFilled ? "drop-shadow(0 0 8px #FFD70088)" : "none",
                    }}
                  >
                    {isFilled ? "\u2605" : "\u2606"}
                  </div>
                );
              })}
            </div>
            {/* Review count */}
            <div
              style={{
                fontSize: 20,
                color: tone.textSecondary,
                opacity: springScale(frame, fps, 50),
                marginTop: 8,
              }}
            >
              {totalReviews}件のレビュー
            </div>
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 2: Review Card 1 */}
      <Sequence from={SCENE} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE} endFrame={SCENE * 2} aspectRatio={aspectRatio} transition="wipe">
          <GradientBackground tone={tone} variant="mesh" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: isVert(aspectRatio) ? "40px 20px" : "40px",
            }}
          >
            <div
              style={{
                fontSize: 22,
                color: tone.accent,
                fontWeight: 700,
                fontFamily: "Noto Sans JP, sans-serif",
                marginBottom: 20,
                opacity: springScale(frame, fps, 0),
              }}
            >
              VOICE 01
            </div>
            <ReviewCard
              tone={tone}
              reviewText={review1}
              reviewerName={reviewer1}
              rating={Math.round(rating)}
              delay={8}
              width={cardWidth}
            />
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 3: Review Card 2 */}
      <Sequence from={SCENE * 2} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE * 2} endFrame={SCENE * 3} aspectRatio={aspectRatio} transition="wipe">
          <GradientBackground tone={tone} variant="mesh" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: isVert(aspectRatio) ? "40px 20px" : "40px",
            }}
          >
            <div
              style={{
                fontSize: 22,
                color: tone.accent,
                fontWeight: 700,
                fontFamily: "Noto Sans JP, sans-serif",
                marginBottom: 20,
                opacity: springScale(frame, fps, 0),
              }}
            >
              VOICE 02
            </div>
            <ReviewCard
              tone={tone}
              reviewText={review2}
              reviewerName={reviewer2}
              rating={5}
              delay={8}
              width={cardWidth}
            />
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 4: Aggregate Stats */}
      <Sequence from={SCENE * 3} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE * 3} endFrame={SCENE * 4} aspectRatio={aspectRatio} transition="zoom">
          <GradientBackground tone={tone} variant="radial" />
          <ParticleOverlay tone={tone} count={20} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: isVert(aspectRatio) ? "column" : "row",
              alignItems: "center",
              justifyContent: "center",
              gap: isVert(aspectRatio) ? 40 : 80,
              fontFamily: "Noto Sans JP, sans-serif",
            }}
          >
            {/* Total Reviews */}
            {(() => {
              const s1 = staggeredReveal(frame, fps, 0, 10, 5);
              return (
                <div
                  style={{
                    textAlign: "center",
                    opacity: s1.opacity,
                    transform: `translateY(${s1.translateY}px)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: isVert(aspectRatio) ? 64 : 80,
                      fontWeight: 900,
                      color: tone.textPrimary,
                      lineHeight: 1,
                    }}
                  >
                    {totalReviews}
                    <span style={{ fontSize: 28, color: tone.textSecondary }}>件</span>
                  </div>
                  <div style={{ fontSize: 20, color: tone.textSecondary, marginTop: 8 }}>
                    累計レビュー数
                  </div>
                </div>
              );
            })()}
            {/* Average Rating */}
            {(() => {
              const s2 = staggeredReveal(frame, fps, 1, 10, 5);
              return (
                <div
                  style={{
                    textAlign: "center",
                    opacity: s2.opacity,
                    transform: `translateY(${s2.translateY}px)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: isVert(aspectRatio) ? 64 : 80,
                      fontWeight: 900,
                      color: tone.accent,
                      lineHeight: 1,
                    }}
                  >
                    {rating}
                  </div>
                  <div style={{ fontSize: 32, color: "#FFD700", marginTop: 4 }}>
                    {"\u2605".repeat(Math.round(rating))}
                  </div>
                  <div style={{ fontSize: 20, color: tone.textSecondary, marginTop: 8 }}>
                    平均評価
                  </div>
                </div>
              );
            })()}
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 5: CTA */}
      <Sequence from={SCENE * 4} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE * 4} endFrame={SCENE * 5} aspectRatio={aspectRatio} transition="fade">
          <GradientBackground tone={tone} variant="default" />
          <ParticleOverlay tone={tone} count={15} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 32,
            }}
          >
            <AnimatedText
              text="多くのお客様に選ばれています"
              tone={tone}
              fontSize={isVert(aspectRatio) ? 28 : 34}
              fontWeight={700}
              mode="wave"
              delay={5}
            />
            <CTAButton text={ctaText} tone={tone} delay={20} />
            <div style={{ marginTop: 20 }}>
              <LogoReveal
                serviceName=""
                tone={tone}
                delay={30}
                logoImageSrc={logoSrc || undefined}
              />
            </div>
          </div>
        </SceneWrapper>
      </Sequence>
    </div>
  );
};
