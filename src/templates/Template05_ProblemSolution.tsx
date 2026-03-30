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
import { LogoReveal } from '../remotion/components/LogoReveal';
import { StatCounter } from '../remotion/components/StatCounter';
import { ParticleOverlay } from '../remotion/components/ParticleOverlay';
import { springScale, pulseGlow, staggeredReveal } from '../remotion/animations';

const SCENE_DURATION = 90;
const FONT_FAMILY = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif';

function isVert(ar: AspectRatio) { return ar.id === 'vertical'; }
function isHoriz(ar: AspectRatio) { return ar.id === 'horizontal'; }

export const Template05_ProblemSolution: React.FC<VideoAdProps> = ({
  inputs,
  tone,
  aspectRatio,
  bgmSrc,
  logoSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const problemText = inputs.problemText || 'こんなお悩みありませんか？';
  const painPoint = inputs.painPoint || '毎月の経費精算に3時間...';
  const solutionText = inputs.solutionText || 'AIが自動で経費処理';
  const howItWorks = inputs.howItWorks || 'レシートを撮るだけ';
  const benefitStat = inputs.benefitStat || '作業時間90%削減';
  const ctaText = inputs.ctaText || '無料で試す';

  const vert = isVert(aspectRatio);
  const horiz = isHoriz(aspectRatio);

  const titleSize = vert ? 42 : horiz ? 36 : 40;
  const bodySize = vert ? 24 : horiz ? 22 : 24;
  const labelSize = vert ? 18 : horiz ? 16 : 18;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', fontFamily: FONT_FAMILY }}>
      {bgmSrc && <Audio src={staticFile(bgmSrc)} volume={0.3} />}

      {/* ── Scene 1: Problem text ── */}
      <Sequence from={0} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={0} endFrame={SCENE_DURATION} aspectRatio={aspectRatio} transition="fade">
          {/* Dark dramatic background */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, #0d0d1a, #1a0a0a)',
          }} />

          {/* Ominous radial glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse at 50% 60%, #FF222215, transparent 70%)`,
          }} />

          {/* Animated stress lines */}
          {Array.from({ length: 6 }).map((_, i) => {
            const opacity = interpolate(frame, [10 + i * 5, 20 + i * 5], [0, 0.08], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const yPos = 15 + i * 14;
            return (
              <div key={i} style={{
                position: 'absolute',
                top: `${yPos}%`, left: 0, right: 0,
                height: 1,
                background: `linear-gradient(90deg, transparent, #FF444444, transparent)`,
                opacity,
              }} />
            );
          })}

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: vert ? '60px 36px' : '40px 56px',
            gap: vert ? 28 : 20,
          }}>
            {/* Question mark effect */}
            {(() => {
              const scale = springScale(frame, fps, 3);
              const pulse = pulseGlow(frame, fps, 1.5, 5, 15);
              return (
                <div style={{
                  fontSize: 56,
                  transform: `scale(${scale * pulse.scale})`,
                  filter: `drop-shadow(0 0 ${pulse.blur}px #FF444488)`,
                  opacity: scale,
                }}>
                  ❓
                </div>
              );
            })()}

            <AnimatedText
              text={problemText}
              tone={tone}
              fontSize={titleSize}
              fontWeight={800}
              mode="charReveal"
              delay={12}
              color="#E8E8E8"
              style={{ textShadow: '0 2px 24px rgba(0,0,0,0.6)' }}
            />
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 2: Pain amplification ── */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION} endFrame={SCENE_DURATION * 2} aspectRatio={aspectRatio} transition="wipe">
          {/* Deep dark with red accent */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #0d0d1a, #1a0505)',
          }} />

          {/* Pulsing red vignette */}
          {(() => {
            const localFrame = frame;
            const pulse = Math.sin(localFrame * 0.08) * 0.15 + 0.3;
            return (
              <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse at center, transparent 40%, #FF000011 70%, #FF000022 100%)`,
                opacity: pulse,
              }} />
            );
          })()}

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: vert ? '48px 32px' : '36px 56px',
            gap: vert ? 32 : 24,
          }}>
            {/* Pain icon */}
            {(() => {
              const localFrame = frame;
              const iconScale = springScale(localFrame, fps, 5);
              return (
                <div style={{
                  fontSize: 48, transform: `scale(${iconScale})`,
                  filter: 'drop-shadow(0 0 16px #FF444466)',
                }}>
                  😫
                </div>
              );
            })()}

            <AnimatedText
              text={painPoint}
              tone={tone}
              fontSize={titleSize * 0.9}
              fontWeight={700}
              mode="wave"
              delay={10}
              color="#FF8888"
              style={{ textShadow: '0 0 20px #FF444444' }}
            />

            {/* Impact emphasis items */}
            {(() => {
              const localFrame = frame;
              const items = ['時間がない', 'ストレス', 'コスト増'];
              return (
                <div style={{
                  display: 'flex',
                  flexDirection: vert ? 'column' : 'row',
                  gap: vert ? 12 : 20,
                  marginTop: 8,
                }}>
                  {items.map((item, i) => {
                    const reveal = staggeredReveal(localFrame, fps, i, 8, 30);
                    return (
                      <div key={i} style={{
                        padding: '8px 20px',
                        borderRadius: 24,
                        background: '#FF333315',
                        border: '1px solid #FF444466',
                        opacity: reveal.opacity,
                        transform: `translateY(${reveal.translateY}px)`,
                      }}>
                        <span style={{
                          fontSize: labelSize, fontWeight: 600,
                          color: '#FF9999',
                        }}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 3: Solution intro ── */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION * 2} endFrame={SCENE_DURATION * 3} aspectRatio={aspectRatio} transition="zoom">
          <GradientBackground tone={tone} variant="radial" />
          <ParticleOverlay tone={tone} count={20} />

          {/* Bright transition overlay */}
          {(() => {
            const localFrame = frame;
            const flashOpacity = interpolate(localFrame, [0, 8, 18], [0.8, 0.8, 0], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <div style={{
                position: 'absolute', inset: 0,
                background: '#FFFFFF',
                opacity: flashOpacity,
                pointerEvents: 'none',
              }} />
            );
          })()}

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: vert ? '48px 32px' : '36px 56px',
            gap: vert ? 28 : 20,
          }}>
            {/* Solution icon */}
            {(() => {
              const localFrame = frame;
              const iconScale = springScale(localFrame, fps, 10);
              return (
                <div style={{
                  fontSize: 56,
                  transform: `scale(${iconScale})`,
                  filter: `drop-shadow(0 0 16px ${tone.accent}66)`,
                }}>
                  💡
                </div>
              );
            })()}

            <AnimatedText
              text="その悩み、解決します"
              tone={tone}
              fontSize={labelSize + 4}
              fontWeight={500}
              mode="typewriter"
              delay={12}
              color={tone.textSecondary}
            />

            <AnimatedText
              text={solutionText}
              tone={tone}
              fontSize={titleSize}
              fontWeight={800}
              mode="wave"
              delay={22}
              color={tone.accent}
              style={{ textShadow: `0 0 24px ${tone.accent}44` }}
            />

            {/* Decorative accent line */}
            {(() => {
              const localFrame = frame;
              const lineWidth = spring({
                frame: Math.max(0, localFrame - 40),
                fps,
                config: { damping: 15, stiffness: 120 },
              });
              return (
                <div style={{
                  width: `${lineWidth * 60}%`,
                  height: 3,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, transparent, ${tone.accent}, transparent)`,
                }} />
              );
            })()}
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 4: How it works ── */}
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION * 3} endFrame={SCENE_DURATION * 4} aspectRatio={aspectRatio} transition="slide">
          <GradientBackground tone={tone} variant="mesh" />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: vert ? '48px 28px' : '36px 48px',
            gap: vert ? 28 : 22,
          }}>
            <AnimatedText
              text="かんたん3ステップ"
              tone={tone}
              fontSize={labelSize + 4}
              fontWeight={600}
              mode="typewriter"
              delay={0}
              color={tone.textSecondary}
            />

            {/* Steps */}
            {(() => {
              const localFrame = frame;
              const steps = [
                { num: '1', text: howItWorks },
                { num: '2', text: '自動で処理' },
                { num: '3', text: '完了！' },
              ];
              return (
                <div style={{
                  display: 'flex',
                  flexDirection: vert ? 'column' : 'row',
                  gap: vert ? 18 : 24,
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: 'center',
                }}>
                  {steps.map((step, i) => {
                    const reveal = staggeredReveal(localFrame, fps, i, 12, 8);
                    return (
                      <React.Fragment key={i}>
                        <div style={{
                          display: 'flex',
                          flexDirection: vert ? 'row' : 'column',
                          alignItems: 'center',
                          gap: vert ? 14 : 10,
                          opacity: reveal.opacity,
                          transform: `translateY(${reveal.translateY}px)`,
                        }}>
                          {/* Step number circle */}
                          <div style={{
                            width: 44, height: 44,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${tone.primary}, ${tone.accent})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: `0 4px 16px ${tone.accent}44`,
                          }}>
                            <span style={{
                              fontSize: 22, fontWeight: 900, color: '#FFFFFF',
                            }}>
                              {step.num}
                            </span>
                          </div>
                          <span style={{
                            fontSize: bodySize - 2, fontWeight: 600,
                            color: tone.textPrimary,
                            textAlign: 'center',
                          }}>
                            {step.text}
                          </span>
                        </div>
                        {/* Arrow between steps */}
                        {i < steps.length - 1 && (
                          <div style={{
                            fontSize: 20, color: tone.accent,
                            opacity: reveal.opacity,
                            transform: vert ? 'rotate(90deg)' : undefined,
                          }}>
                            →
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 5: Benefit stat + CTA ── */}
      <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION * 4} endFrame={SCENE_DURATION * 5} aspectRatio={aspectRatio} transition="fade">
          <GradientBackground tone={tone} variant="mesh" />
          <ParticleOverlay tone={tone} count={30} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '40px 32px',
            gap: vert ? 28 : 22,
          }}>
            <LogoReveal
              serviceName={solutionText.slice(0, 12)}
              tone={tone}
              delay={0}
              size="medium"
              logoImageSrc={logoSrc || undefined}
            />

            {/* Benefit stat */}
            <StatCounter
              value={benefitStat}
              label="導入効果"
              tone={tone}
              delay={12}
              size="large"
            />

            <CTAButton text={ctaText} tone={tone} delay={28} />

            {/* Trust signals */}
            {(() => {
              const localFrame = frame;
              const trustOpacity = interpolate(localFrame, [50, 65], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              });
              return (
                <div style={{
                  display: 'flex', gap: 16,
                  opacity: trustOpacity,
                }}>
                  {['初期費用0円', '即日利用可', 'サポート充実'].map((badge, i) => (
                    <div key={i} style={{
                      padding: '6px 14px',
                      borderRadius: 20,
                      background: `${tone.textPrimary}08`,
                      border: `1px solid ${tone.textSecondary}22`,
                    }}>
                      <span style={{
                        fontSize: labelSize - 4,
                        fontWeight: 500,
                        color: tone.textSecondary,
                      }}>
                        {badge}
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
