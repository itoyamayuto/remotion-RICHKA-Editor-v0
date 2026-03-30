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
import { springScale, wipeTransition } from '../remotion/animations';

const SCENE_DURATION = 90;
const FONT_FAMILY = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif';

function isVert(ar: AspectRatio) { return ar.id === 'vertical'; }
function isHoriz(ar: AspectRatio) { return ar.id === 'horizontal'; }

function resolveImageSrc(src: string): string {
  if (src.startsWith('blob:') || src.startsWith('data:') || src.startsWith('http')) return src;
  return staticFile(src);
}

export const Template04_BeforeAfter: React.FC<VideoAdProps> = ({
  inputs,
  tone,
  aspectRatio,
  bgmSrc,
  logoSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const beforeImage = inputs.beforeImage || '';
  const afterImage = inputs.afterImage || '';
  const beforeText = inputs.beforeText || '導入前';
  const afterText = inputs.afterText || '導入後';
  const metricBefore = inputs.metricBefore || '作業時間 8時間';
  const metricAfter = inputs.metricAfter || '作業時間 1時間';
  const ctaText = inputs.ctaText || '詳しくはこちら';

  const vert = isVert(aspectRatio);
  const horiz = isHoriz(aspectRatio);

  const titleSize = vert ? 44 : horiz ? 38 : 42;
  const bodySize = vert ? 24 : horiz ? 22 : 24;
  const labelSize = vert ? 18 : horiz ? 16 : 18;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', fontFamily: FONT_FAMILY }}>
      {bgmSrc && <Audio src={staticFile(bgmSrc)} volume={0.3} />}

      {/* ── Scene 1: Before state ── */}
      <Sequence from={0} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={0} endFrame={SCENE_DURATION} aspectRatio={aspectRatio} transition="fade">
          {/* Dark desaturated background */}
          <div style={{ position: 'absolute', inset: 0, background: '#1a1a2e' }} />

          {beforeImage ? (
            <ImageWithEffect
              src={resolveImageSrc(beforeImage)}
              effect="kenBurns"
              durationFrames={SCENE_DURATION}
              overlayColor="#1a1a2e"
              overlayOpacity={0.55}
              kenBurnsConfig={{ startScale: 1.05, endScale: 1.15, panX: -10, panY: 5 }}
              style={{ filter: 'grayscale(70%) brightness(0.7)' }}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, #1a1a2e, #0f0f1a)',
            }} />
          )}

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: vert ? '60px 32px' : '40px 56px',
            gap: vert ? 24 : 18,
          }}>
            {/* BEFORE label */}
            {(() => {
              const labelScale = springScale(frame, fps, 5);
              return (
                <div style={{
                  padding: '8px 28px',
                  borderRadius: 8,
                  background: '#FF444422',
                  border: '2px solid #FF4444',
                  transform: `scale(${labelScale})`,
                }}>
                  <span style={{
                    fontSize: labelSize, fontWeight: 800,
                    color: '#FF6666',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  }}>
                    BEFORE
                  </span>
                </div>
              );
            })()}

            <AnimatedText
              text={beforeText}
              tone={tone}
              fontSize={titleSize}
              fontWeight={800}
              mode="charReveal"
              delay={15}
              color="#E0E0E0"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            />

            {/* Mood: frustrated */}
            {(() => {
              const opacity = interpolate(frame, [35, 50], [0, 0.6], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              });
              return (
                <div style={{ fontSize: 48, opacity }}>😞</div>
              );
            })()}
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 2: Dramatic wipe transition ── */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION} endFrame={SCENE_DURATION * 2} aspectRatio={aspectRatio} transition="none">
          {/* Before side (left/top) */}
          {(() => {
            const localFrame = frame;
            const wipeProgress = wipeTransition(localFrame, 10, 40);
            const isVertical = vert;

            return (
              <>
                {/* Before layer */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: '#1a1a2e',
                  clipPath: isVertical
                    ? `inset(0 0 ${wipeProgress * 100}% 0)`
                    : `inset(0 ${wipeProgress * 100}% 0 0)`,
                }}>
                  {beforeImage ? (
                    <ImageWithEffect
                      src={resolveImageSrc(beforeImage)}
                      effect="kenBurns"
                      durationFrames={SCENE_DURATION}
                      overlayColor="#1a1a2e"
                      overlayOpacity={0.5}
                      style={{ filter: 'grayscale(70%) brightness(0.7)' }}
                    />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, background: '#1a1a2e' }} />
                  )}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      fontSize: titleSize * 0.7, fontWeight: 800,
                      color: '#FF6666', opacity: 1 - wipeProgress,
                    }}>
                      {beforeText}
                    </span>
                  </div>
                </div>

                {/* After layer */}
                <div style={{
                  position: 'absolute', inset: 0,
                  clipPath: isVertical
                    ? `inset(${(1 - wipeProgress) * 100}% 0 0 0)`
                    : `inset(0 0 0 ${(1 - wipeProgress) * 100}%)`,
                }}>
                  {afterImage ? (
                    <ImageWithEffect
                      src={resolveImageSrc(afterImage)}
                      effect="kenBurns"
                      durationFrames={SCENE_DURATION}
                      overlayColor={tone.bgDark}
                      overlayOpacity={0.3}
                    />
                  ) : (
                    <GradientBackground tone={tone} variant="radial" />
                  )}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      fontSize: titleSize * 0.7, fontWeight: 800,
                      color: tone.accent, opacity: wipeProgress,
                    }}>
                      {afterText}
                    </span>
                  </div>
                </div>

                {/* Wipe line */}
                <div style={{
                  position: 'absolute',
                  ...(isVertical
                    ? { left: 0, right: 0, top: `${(1 - wipeProgress) * 100}%`, height: 4 }
                    : { top: 0, bottom: 0, left: `${(1 - wipeProgress) * 100}%`, width: 4 }),
                  background: `linear-gradient(${isVertical ? '90deg' : '180deg'}, ${tone.accent}, #FFFFFF, ${tone.accent})`,
                  boxShadow: `0 0 20px ${tone.accent}88`,
                  opacity: wipeProgress > 0.05 && wipeProgress < 0.95 ? 1 : 0,
                }} />
              </>
            );
          })()}
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 3: After state ── */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION * 2} endFrame={SCENE_DURATION * 3} aspectRatio={aspectRatio} transition="zoom">
          {afterImage ? (
            <ImageWithEffect
              src={resolveImageSrc(afterImage)}
              effect="kenBurns"
              durationFrames={SCENE_DURATION}
              overlayColor={tone.bgDark}
              overlayOpacity={0.35}
              kenBurnsConfig={{ startScale: 1.0, endScale: 1.12, panX: 10, panY: -5 }}
            />
          ) : (
            <GradientBackground tone={tone} variant="radial" />
          )}

          <ParticleOverlay tone={tone} count={20} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: vert ? '60px 32px' : '40px 56px',
            gap: vert ? 24 : 18,
          }}>
            {/* AFTER label */}
            {(() => {
              const labelScale = springScale(frame, fps, 5);
              return (
                <div style={{
                  padding: '8px 28px',
                  borderRadius: 8,
                  background: `${tone.accent}22`,
                  border: `2px solid ${tone.accent}`,
                  transform: `scale(${labelScale})`,
                }}>
                  <span style={{
                    fontSize: labelSize, fontWeight: 800,
                    color: tone.accent,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  }}>
                    AFTER
                  </span>
                </div>
              );
            })()}

            <AnimatedText
              text={afterText}
              tone={tone}
              fontSize={titleSize}
              fontWeight={800}
              mode="wave"
              delay={12}
              color={tone.textPrimary}
            />

            {/* Mood: happy */}
            {(() => {
              const opacity = interpolate(frame, [35, 50], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              });
              return (
                <div style={{ fontSize: 52, opacity, filter: `drop-shadow(0 0 12px ${tone.accent}44)` }}>🎉</div>
              );
            })()}
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 4: Metric comparison ── */}
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION * 3} endFrame={SCENE_DURATION * 4} aspectRatio={aspectRatio} transition="slide">
          <GradientBackground tone={tone} variant="default" />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: vert ? '48px 28px' : '36px 48px',
            gap: vert ? 28 : 20,
          }}>
            <AnimatedText
              text="数字で見る変化"
              tone={tone}
              fontSize={labelSize + 4}
              fontWeight={600}
              mode="typewriter"
              delay={0}
              color={tone.textSecondary}
            />

            <div style={{
              display: 'flex',
              flexDirection: vert ? 'column' : 'row',
              gap: vert ? 24 : 40,
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
            }}>
              {/* Before metric */}
              {(() => {
                const localFrame = frame;
                const opacity = interpolate(localFrame, [8, 22], [0, 1], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                });
                return (
                  <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 8, opacity,
                    transform: `translateY(${(1 - opacity) * 30}px)`,
                  }}>
                    <span style={{
                      fontSize: labelSize, fontWeight: 600,
                      color: '#FF6666', letterSpacing: '0.1em',
                    }}>
                      BEFORE
                    </span>
                    <div style={{
                      padding: '16px 24px', borderRadius: 12,
                      background: '#FF444411', border: '1px solid #FF444444',
                    }}>
                      <StatCounter
                        value={metricBefore}
                        label=""
                        tone={{ ...tone, accent: '#FF6666' }}
                        delay={15}
                        size="medium"
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Arrow */}
              {(() => {
                const localFrame = frame;
                const arrowScale = springScale(localFrame, fps, 30);
                return (
                  <div style={{
                    fontSize: 36, color: tone.accent,
                    transform: `scale(${arrowScale}) rotate(${vert ? 90 : 0}deg)`,
                  }}>
                    →
                  </div>
                );
              })()}

              {/* After metric */}
              {(() => {
                const localFrame = frame;
                const opacity = interpolate(localFrame, [35, 50], [0, 1], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                });
                return (
                  <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 8, opacity,
                    transform: `scale(${0.8 + opacity * 0.2})`,
                  }}>
                    <span style={{
                      fontSize: labelSize, fontWeight: 600,
                      color: tone.accent, letterSpacing: '0.1em',
                    }}>
                      AFTER
                    </span>
                    <div style={{
                      padding: '16px 24px', borderRadius: 12,
                      background: `${tone.accent}11`, border: `1px solid ${tone.accent}44`,
                    }}>
                      <StatCounter
                        value={metricAfter}
                        label=""
                        tone={tone}
                        delay={40}
                        size="medium"
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 5: CTA ── */}
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
              serviceName={afterText}
              tone={tone}
              delay={0}
              size="medium"
              logoImageSrc={logoSrc || undefined}
            />

            <AnimatedText
              text="あなたも変わりませんか？"
              tone={tone}
              fontSize={bodySize}
              fontWeight={600}
              mode="typewriter"
              delay={15}
              color={tone.textSecondary}
            />

            <CTAButton text={ctaText} tone={tone} delay={25} />
          </div>
        </SceneWrapper>
      </Sequence>
    </div>
  );
};
