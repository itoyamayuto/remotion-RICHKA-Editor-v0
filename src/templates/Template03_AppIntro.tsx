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
import { springScale, elasticSlideIn, staggeredReveal } from '../remotion/animations';

const SCENE_DURATION = 90;
const FONT_FAMILY = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif';

function isVert(ar: AspectRatio) { return ar.id === 'vertical'; }
function isHoriz(ar: AspectRatio) { return ar.id === 'horizontal'; }

function resolveImageSrc(src: string): string {
  if (src.startsWith('blob:') || src.startsWith('data:') || src.startsWith('http')) return src;
  return staticFile(src);
}

export const Template03_AppIntro: React.FC<VideoAdProps> = ({
  inputs,
  tone,
  aspectRatio,
  bgmSrc,
  logoSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appName = inputs.appName || 'MyApp';
  const problemText = inputs.problemText || '毎日の家計管理が面倒...';
  const screenshotImage = inputs.screenshotImage || '';
  const feature1 = inputs.feature1 || 'ワンタップで記録';
  const feature2 = inputs.feature2 || '自動カテゴリ分類';
  const downloadCount = inputs.downloadCount || '100万DL突破';
  const ctaText = inputs.ctaText || '無料ダウンロード';

  const vert = isVert(aspectRatio);
  const horiz = isHoriz(aspectRatio);

  const titleSize = vert ? 40 : horiz ? 34 : 38;
  const bodySize = vert ? 24 : horiz ? 22 : 24;
  const smallSize = vert ? 18 : horiz ? 16 : 18;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', fontFamily: FONT_FAMILY }}>
      {bgmSrc && <Audio src={staticFile(bgmSrc)} volume={0.3} />}

      {/* ── Scene 1: Problem statement ── */}
      <Sequence from={0} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={0} endFrame={SCENE_DURATION} aspectRatio={aspectRatio} transition="fade">
          {/* Dark moody background */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(180deg, ${tone.bgDark}, #0a0a0a)`,
          }} />

          {/* Subtle grid pattern */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.05,
            backgroundImage: `
              linear-gradient(${tone.textSecondary}33 1px, transparent 1px),
              linear-gradient(90deg, ${tone.textSecondary}33 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: vert ? '60px 36px' : '40px 56px',
            gap: vert ? 28 : 20,
          }}>
            {/* Problem icon */}
            {(() => {
              const iconScale = springScale(frame, fps, 5);
              return (
                <div style={{
                  fontSize: 52,
                  transform: `scale(${iconScale})`,
                  opacity: iconScale,
                  filter: `drop-shadow(0 0 20px ${tone.textSecondary}44)`,
                }}>
                  😰
                </div>
              );
            })()}

            <AnimatedText
              text="こんなお悩みありませんか？"
              tone={tone}
              fontSize={smallSize + 2}
              fontWeight={500}
              mode="typewriter"
              delay={10}
              color={tone.textSecondary}
            />

            <AnimatedText
              text={problemText}
              tone={tone}
              fontSize={titleSize * 0.85}
              fontWeight={700}
              mode="charReveal"
              delay={25}
              color={tone.textPrimary}
              style={{ textAlign: 'center', maxWidth: '90%' }}
            />
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 2: App screenshot reveal ── */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION} endFrame={SCENE_DURATION * 2} aspectRatio={aspectRatio} transition="wipe">
          <GradientBackground tone={tone} variant="radial" />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex',
            flexDirection: vert ? 'column' : 'row',
            alignItems: 'center', justifyContent: 'center',
            padding: vert ? '40px 24px' : '32px 40px',
            gap: vert ? 24 : 40,
          }}>
            {/* App name intro */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: vert ? 'center' : 'flex-start',
              gap: 8,
              flex: horiz ? '0 0 40%' : undefined,
            }}>
              <AnimatedText
                text={`${appName} なら`}
                tone={tone}
                fontSize={titleSize}
                fontWeight={800}
                mode="wave"
                delay={5}
                color={tone.accent}
              />
              <AnimatedText
                text="解決できます"
                tone={tone}
                fontSize={bodySize}
                fontWeight={500}
                mode="typewriter"
                delay={22}
                color={tone.textSecondary}
              />
            </div>

            {/* Phone mockup with screenshot */}
            {(() => {
              const localFrame = frame;
              const slideY = elasticSlideIn(localFrame, fps, 'bottom', 15, 200);
              const phoneWidth = vert ? 180 : horiz ? 160 : 170;
              const phoneHeight = phoneWidth * 2;
              return (
                <div style={{
                  transform: `translateY(${slideY}px)`,
                  position: 'relative',
                  width: phoneWidth,
                  height: phoneHeight,
                  borderRadius: 24,
                  overflow: 'hidden',
                  border: `3px solid ${tone.textSecondary}44`,
                  boxShadow: `0 20px 60px ${tone.bgDark}88, 0 0 30px ${tone.accent}22`,
                  background: '#1a1a1a',
                  flexShrink: 0,
                }}>
                  {/* Notch */}
                  <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: '40%', height: 24, borderRadius: '0 0 14px 14px',
                    background: '#1a1a1a', zIndex: 2,
                  }} />
                  {screenshotImage ? (
                    <ImageWithEffect
                      src={resolveImageSrc(screenshotImage)}
                      effect="reveal"
                      durationFrames={SCENE_DURATION}
                      delay={10}
                    />
                  ) : (
                    <div style={{
                      position: 'absolute', inset: 6, borderRadius: 18,
                      background: `linear-gradient(180deg, ${tone.primary}44, ${tone.bgDark})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 48, fontWeight: 900, color: tone.accent }}>{appName.charAt(0)}</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 3: Feature walkthrough ── */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION * 2} endFrame={SCENE_DURATION * 3} aspectRatio={aspectRatio} transition="slide">
          <GradientBackground tone={tone} variant="mesh" />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: vert ? '48px 28px' : '36px 48px',
            gap: vert ? 32 : 24,
          }}>
            <AnimatedText
              text="主な機能"
              tone={tone}
              fontSize={smallSize + 4}
              fontWeight={600}
              mode="typewriter"
              delay={0}
              color={tone.textSecondary}
            />

            {[feature1, feature2].map((feat, i) => {
              const localFrame = frame;
              const reveal = staggeredReveal(localFrame, fps, i, 12, 10);
              const icons = ['⚡', '🎯'];
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center',
                  gap: 16,
                  opacity: reveal.opacity,
                  transform: `translateY(${reveal.translateY}px)`,
                  width: '100%',
                  maxWidth: 400,
                  background: `${tone.bgDark}BB`,
                  borderRadius: 16,
                  padding: '20px 24px',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${tone.primary}33`,
                }}>
                  <div style={{
                    width: 52, height: 52,
                    borderRadius: 14,
                    background: `linear-gradient(135deg, ${tone.primary}44, ${tone.accent}44)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, flexShrink: 0,
                  }}>
                    {icons[i]}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{
                      fontSize: smallSize - 2, fontWeight: 500,
                      color: tone.accent,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}>
                      Feature {i + 1}
                    </span>
                    <span style={{
                      fontSize: bodySize, fontWeight: 700,
                      color: tone.textPrimary,
                    }}>
                      {feat}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 4: Download stats ── */}
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION * 3} endFrame={SCENE_DURATION * 4} aspectRatio={aspectRatio} transition="zoom">
          <GradientBackground tone={tone} variant="radial" />
          <ParticleOverlay tone={tone} count={20} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '40px 32px',
            gap: vert ? 28 : 20,
          }}>
            <AnimatedText
              text="多くの方に選ばれています"
              tone={tone}
              fontSize={smallSize + 2}
              fontWeight={500}
              mode="typewriter"
              delay={0}
              color={tone.textSecondary}
            />

            <StatCounter
              value={downloadCount}
              label="ダウンロード"
              tone={tone}
              delay={10}
              size="large"
            />

            {/* Star rating */}
            {(() => {
              const localFrame = frame;
              const starsOpacity = interpolate(localFrame, [35, 50], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              });
              return (
                <div style={{
                  display: 'flex', gap: 4,
                  opacity: starsOpacity,
                  transform: `scale(${0.8 + starsOpacity * 0.2})`,
                }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{
                      fontSize: 28, color: '#FFD700',
                      filter: 'drop-shadow(0 0 6px #FFD70088)',
                    }}>
                      ★
                    </span>
                  ))}
                </div>
              );
            })()}
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 5: CTA download ── */}
      <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION * 4} endFrame={SCENE_DURATION * 5} aspectRatio={aspectRatio} transition="fade">
          <GradientBackground tone={tone} variant="mesh" />
          <ParticleOverlay tone={tone} count={25} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '40px 32px',
            gap: vert ? 36 : 28,
          }}>
            <LogoReveal
              serviceName={appName}
              tone={tone}
              delay={0}
              size="large"
              logoImageSrc={logoSrc || undefined}
            />

            <AnimatedText
              text="今すぐ始めよう"
              tone={tone}
              fontSize={bodySize + 4}
              fontWeight={600}
              mode="typewriter"
              delay={18}
              color={tone.textSecondary}
            />

            <CTAButton text={ctaText} tone={tone} delay={25} />

            {/* Store badges hint */}
            {(() => {
              const localFrame = frame;
              const badgesOpacity = interpolate(localFrame, [45, 60], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              });
              return (
                <div style={{
                  display: 'flex', gap: 16,
                  opacity: badgesOpacity,
                }}>
                  {['App Store', 'Google Play'].map((store, i) => (
                    <div key={i} style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: `${tone.textPrimary}11`,
                      border: `1px solid ${tone.textSecondary}33`,
                    }}>
                      <span style={{
                        fontSize: smallSize - 2,
                        fontWeight: 500,
                        color: tone.textSecondary,
                      }}>
                        {store}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </SceneWrapper>
      </Sequence>
    </div>
  );
};
