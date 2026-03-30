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
import { RankingBar } from "../remotion/components/RankingBar";
import { ParticleOverlay } from "../remotion/components/ParticleOverlay";
import {
  springScale,
  elasticSlideIn,
  pulseGlow,
} from "../remotion/animations";

function isVert(ar: AspectRatio) {
  return ar.id === "vertical";
}
function isHoriz(ar: AspectRatio) {
  return ar.id === "horizontal";
}

const SCENE = 90;

export const Template07_Ranking: React.FC<VideoAdProps> = ({
  inputs,
  tone,
  aspectRatio,
  bgmSrc,
  logoSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const category = inputs.category || "人気ランキング 2024";
  const rank3Name = inputs.rank3Name || "プランC";
  const rank3Desc = inputs.rank3Desc || "コスパ重視の選択肢";
  const rank2Name = inputs.rank2Name || "プランB";
  const rank2Desc = inputs.rank2Desc || "バランスの取れた万能タイプ";
  const rank1Name = inputs.rank1Name || "プランA";
  const rank1Desc = inputs.rank1Desc || "圧倒的な人気No.1！";
  const ctaText = inputs.ctaText || "詳しくはこちら";

  const barPadding = isVert(aspectRatio) ? "0 24px" : isHoriz(aspectRatio) ? "0 80px" : "0 60px";
  const categorySize = isVert(aspectRatio) ? 34 : isHoriz(aspectRatio) ? 48 : 42;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {bgmSrc && <Audio src={staticFile(bgmSrc)} volume={0.3} />}

      {/* Scene 1: Category Intro */}
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
              gap: 24,
              fontFamily: "Noto Sans JP, sans-serif",
            }}
          >
            {/* Trophy icon */}
            <div
              style={{
                fontSize: isVert(aspectRatio) ? 64 : 80,
                transform: `scale(${springScale(frame, fps, 5)})`,
                filter: `drop-shadow(0 0 20px ${tone.accent}66)`,
              }}
            >
              🏆
            </div>
            <AnimatedText
              text={category}
              tone={tone}
              fontSize={categorySize}
              fontWeight={800}
              mode="wave"
              delay={10}
            />
            {/* Decorative line */}
            <div
              style={{
                width: interpolate(
                  spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 15, stiffness: 120 } }),
                  [0, 1],
                  [0, isVert(aspectRatio) ? width * 0.6 : width * 0.3]
                ),
                height: 3,
                borderRadius: 2,
                background: `linear-gradient(90deg, transparent, ${tone.accent}, transparent)`,
              }}
            />
            <div
              style={{
                fontSize: 22,
                color: tone.textSecondary,
                opacity: springScale(frame, fps, 40),
              }}
            >
              TOP 3 発表！
            </div>
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 2: #3 Bronze */}
      <Sequence from={SCENE} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE} endFrame={SCENE * 2} aspectRatio={aspectRatio} transition="wipe">
          <GradientBackground tone={tone} variant="default" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: barPadding,
              gap: 24,
            }}
          >
            {/* Rank label */}
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#CD7F32",
                fontFamily: "Noto Sans JP, sans-serif",
                opacity: springScale(frame, fps, 0),
                letterSpacing: "0.1em",
              }}
            >
              THIRD PLACE
            </div>
            <div style={{ width: "100%", maxWidth: isHoriz(aspectRatio) ? 700 : 500 }}>
              <RankingBar
                tone={tone}
                rank={3}
                name={rank3Name}
                description={rank3Desc}
                delay={10}
              />
            </div>
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 3: #2 Silver */}
      <Sequence from={SCENE * 2} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE * 2} endFrame={SCENE * 3} aspectRatio={aspectRatio} transition="wipe">
          <GradientBackground tone={tone} variant="default" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: barPadding,
              gap: 24,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#C0C0C0",
                fontFamily: "Noto Sans JP, sans-serif",
                opacity: springScale(frame, fps, 0),
                letterSpacing: "0.1em",
              }}
            >
              SECOND PLACE
            </div>
            <div style={{ width: "100%", maxWidth: isHoriz(aspectRatio) ? 700 : 500 }}>
              <RankingBar
                tone={tone}
                rank={2}
                name={rank2Name}
                description={rank2Desc}
                delay={10}
              />
            </div>
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 4: #1 Gold Winner */}
      <Sequence from={SCENE * 3} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE * 3} endFrame={SCENE * 4} aspectRatio={aspectRatio} transition="zoom">
          <GradientBackground tone={tone} variant="mesh" />
          <ParticleOverlay tone={tone} count={30} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: barPadding,
              gap: 20,
            }}
          >
            {/* Crown effect */}
            <div
              style={{
                fontSize: isVert(aspectRatio) ? 56 : 72,
                transform: `scale(${springScale(frame, fps, 0)}) translateY(${Math.sin(frame * 0.1) * 5}px)`,
                filter: "drop-shadow(0 0 15px #FFD70088)",
              }}
            >
              👑
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: tone.accent,
                fontFamily: "Noto Sans JP, sans-serif",
                opacity: springScale(frame, fps, 5),
                letterSpacing: "0.15em",
                textShadow: `0 0 20px ${tone.accent}44`,
              }}
            >
              FIRST PLACE
            </div>
            <div style={{ width: "100%", maxWidth: isHoriz(aspectRatio) ? 700 : 500 }}>
              <RankingBar
                tone={tone}
                rank={1}
                name={rank1Name}
                description={rank1Desc}
                delay={15}
                isWinner
              />
            </div>
          </div>
        </SceneWrapper>
      </Sequence>

      {/* Scene 5: CTA */}
      <Sequence from={SCENE * 4} durationInFrames={SCENE}>
        <SceneWrapper startFrame={SCENE * 4} endFrame={SCENE * 5} aspectRatio={aspectRatio} transition="fade">
          <GradientBackground tone={tone} variant="radial" />
          <ParticleOverlay tone={tone} count={15} />
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
              text="あなたも1位を体験しませんか？"
              tone={tone}
              fontSize={isVert(aspectRatio) ? 26 : 32}
              fontWeight={700}
              mode="wave"
              delay={5}
            />
            <CTAButton text={ctaText} tone={tone} delay={20} />
            <div style={{ marginTop: 16 }}>
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
