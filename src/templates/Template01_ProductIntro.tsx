import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
  interpolate,
  Sequence,
  spring,
} from 'remotion';
import type { VideoAdProps, AspectRatio } from '../remotion/types';
import { SceneWrapper } from '../remotion/components/SceneWrapper';
import { AnimatedText } from '../remotion/components/AnimatedText';
import { CTAButton } from '../remotion/components/CTAButton';
import { GradientBackground } from '../remotion/components/GradientBackground';
import { ImageWithEffect } from '../remotion/components/ImageWithEffect';
import { LogoReveal } from '../remotion/components/LogoReveal';
import { StatCounter } from '../remotion/components/StatCounter';
import { ParticleOverlay } from '../remotion/components/ParticleOverlay';
import { staggeredReveal } from '../remotion/animations';

const SCENE_DURATION = 90;
const FONT_FAMILY = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif';

function isVert(ar: AspectRatio) { return ar.id === 'vertical'; }
function isHoriz(ar: AspectRatio) { return ar.id === 'horizontal'; }

function resolveImageSrc(src: string): string {
  if (src.startsWith('blob:') || src.startsWith('data:') || src.startsWith('http')) return src;
  return staticFile(src);
}

export const Template01_ProductIntro: React.FC<VideoAdProps> = ({
  inputs,
  tone,
  aspectRatio,
  bgmSrc,
  logoSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const catchcopy = inputs.catchcopy || 'あなたの毎日をもっと特別に';
  const subcopy = inputs.subcopy || '新しい体験をお届けします';
  const productImage = inputs.productImage || '';
  const feature1 = inputs.feature1 || '高品質な素材';
  const feature2 = inputs.feature2 || '安心の国内製造';
  const feature3 = inputs.feature3 || '送料無料';
  const stat = inputs.stat || '累計10万個突破';
  const ctaText = inputs.ctaText || '今すぐチェック';

  const vert = isVert(aspectRatio);
  const horiz = isHoriz(aspectRatio);

  const baseFontSize = vert ? 44 : horiz ? 38 : 42;
  const subFontSize = vert ? 22 : horiz ? 20 : 22;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', fontFamily: FONT_FAMILY }}>
      {bgmSrc && <Audio src={staticFile(bgmSrc)} volume={0.3} />}

      {/* ── Scene 1: Hero ── */}
      <Sequence from={0} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={0} endFrame={SCENE_DURATION} aspectRatio={aspectRatio} transition="fade">
          <GradientBackground tone={tone} variant="mesh" />
          <ParticleOverlay tone={tone} count={20} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: vert ? '60px 32px' : '40px 48px',
            gap: vert ? 24 : 16,
          }}>
            {/* Decorative line */}
            <div style={{
              width: interpolate(
                spring({ frame, fps, config: { damping: 15, stiffness: 120 } }),
                [0, 1], [0, 80],
              ),
              height: 3,
              borderRadius: 2,
              background: tone.accent,
              marginBottom: 8,
            }} />

            <AnimatedText
              text={catchcopy}
              tone={tone}
              fontSize={baseFontSize}
              fontWeight={800}
              mode="wave"
              delay={8}
              style={{ textShadow: `0 2px 24px ${tone.bgDark}88` }}
            />

            <AnimatedText
              text={subcopy}
              tone={tone}
              fontSize={subFontSize}
              fontWeight={400}
              mode="typewriter"
              delay={30}
              color={tone.textSecondary}
            />
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 2: Product ── */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION} endFrame={SCENE_DURATION * 2} aspectRatio={aspectRatio} transition="wipe">
          <div style={{ position: 'absolute', inset: 0, background: tone.bgDark }} />

          {productImage ? (
            <ImageWithEffect
              src={resolveImageSrc(productImage)}
              effect="kenBurns"
              durationFrames={SCENE_DURATION}
              overlayColor={tone.bgDark}
              overlayOpacity={0.35}
              kenBurnsConfig={{ startScale: 1.0, endScale: 1.15, panX: -15, panY: -8 }}
            />
          ) : (
            <GradientBackground tone={tone} variant="radial" />
          )}

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex',
            flexDirection: vert ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: vert ? 'flex-end' : 'center',
            padding: vert ? '0 32px 80px' : '0 60px',
            gap: 24,
          }}>
            {/* Feature highlights staggered */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              background: `${tone.bgDark}CC`,
              borderRadius: 16,
              padding: vert ? '24px 28px' : '20px 32px',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${tone.primary}33`,
            }}>
              {[feature1, feature2].map((feat, i) => {
                const localFrame = frame;
                const reveal = staggeredReveal(localFrame, fps, i, 8, 15);
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    opacity: reveal.opacity,
                    transform: `translateY(${reveal.translateY}px)`,
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: tone.accent,
                      boxShadow: `0 0 8px ${tone.accent}66`,
                    }} />
                    <span style={{
                      fontSize: subFontSize,
                      fontWeight: 600,
                      color: tone.textPrimary,
                    }}>
                      {feat}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 3: Features ── */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION * 2} endFrame={SCENE_DURATION * 3} aspectRatio={aspectRatio} transition="slide">
          <GradientBackground tone={tone} variant="default" />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: vert ? '40px 28px' : '32px 48px',
            gap: vert ? 28 : 20,
          }}>
            <AnimatedText
              text="特徴"
              tone={tone}
              fontSize={subFontSize + 4}
              fontWeight={600}
              mode="typewriter"
              delay={0}
              color={tone.textSecondary}
            />

            <div style={{
              display: 'flex',
              flexDirection: vert ? 'column' : 'row',
              gap: vert ? 20 : 28,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {[feature1, feature2, feature3].map((feat, i) => {
                const localFrame = frame;
                const reveal = staggeredReveal(localFrame, fps, i, 10, 10);
                const icons = ['✦', '◆', '●'];
                return (
                  <div key={i} style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 10,
                    opacity: reveal.opacity,
                    transform: `translateY(${reveal.translateY}px)`,
                    background: `${tone.bgDark}88`,
                    borderRadius: 16,
                    padding: vert ? '20px 24px' : '24px 20px',
                    minWidth: horiz ? 140 : vert ? '80%' : 120,
                    border: `1px solid ${tone.primary}44`,
                  }}>
                    <div style={{
                      width: 48, height: 48,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${tone.primary}, ${tone.accent})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22, color: '#fff',
                    }}>
                      {icons[i]}
                    </div>
                    <span style={{
                      fontSize: vert ? 20 : 18,
                      fontWeight: 700,
                      color: tone.textPrimary,
                      textAlign: 'center',
                    }}>
                      {feat}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 4: Stats ── */}
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION * 3} endFrame={SCENE_DURATION * 4} aspectRatio={aspectRatio} transition="zoom">
          <GradientBackground tone={tone} variant="radial" />
          <ParticleOverlay tone={tone} count={15} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '40px 32px',
            gap: 20,
          }}>
            <AnimatedText
              text="実績"
              tone={tone}
              fontSize={subFontSize}
              fontWeight={500}
              mode="typewriter"
              delay={5}
              color={tone.textSecondary}
            />
            <StatCounter
              value={stat}
              label=""
              tone={tone}
              delay={10}
              size="large"
            />
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 5: CTA ── */}
      <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION * 4} endFrame={SCENE_DURATION * 5} aspectRatio={aspectRatio} transition="fade">
          <GradientBackground tone={tone} variant="mesh" />
          <ParticleOverlay tone={tone} count={30} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '40px 32px',
            gap: vert ? 40 : 32,
          }}>
            <LogoReveal
              serviceName={catchcopy.slice(0, 10)}
              tone={tone}
              delay={5}
              size="medium"
              logoImageSrc={logoSrc || undefined}
            />
            <CTAButton text={ctaText} tone={tone} delay={20} />
          </div>
        </SceneWrapper>
      </Sequence>
    </div>
  );
};
