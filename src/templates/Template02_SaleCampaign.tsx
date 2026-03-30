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
import { ParticleOverlay } from '../remotion/components/ParticleOverlay';
import { glitchText, pulseGlow, springScale } from '../remotion/animations';

const SCENE_DURATION = 90;
const FONT_FAMILY = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif';

function isVert(ar: AspectRatio) { return ar.id === 'vertical'; }
function isHoriz(ar: AspectRatio) { return ar.id === 'horizontal'; }

function resolveImageSrc(src: string): string {
  if (src.startsWith('blob:') || src.startsWith('data:') || src.startsWith('http')) return src;
  return staticFile(src);
}

export const Template02_SaleCampaign: React.FC<VideoAdProps> = ({
  inputs,
  tone,
  aspectRatio,
  bgmSrc,
  logoSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const saleTitle = inputs.saleTitle || 'MEGA SALE';
  const discountText = inputs.discountText || '最大70%OFF';
  const productImage = inputs.productImage || '';
  const originalPrice = inputs.originalPrice || '¥9,800';
  const salePrice = inputs.salePrice || '¥2,980';
  const deadline = inputs.deadline || '3日間限定';
  const ctaText = inputs.ctaText || '今すぐ購入';

  const vert = isVert(aspectRatio);
  const horiz = isHoriz(aspectRatio);

  const titleSize = vert ? 56 : horiz ? 48 : 52;
  const discountSize = vert ? 72 : horiz ? 60 : 66;
  const bodySize = vert ? 24 : horiz ? 22 : 24;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', fontFamily: FONT_FAMILY }}>
      {bgmSrc && <Audio src={staticFile(bgmSrc)} volume={0.3} />}

      {/* ── Scene 1: Flash attention ── */}
      <Sequence from={0} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={0} endFrame={SCENE_DURATION} aspectRatio={aspectRatio} transition="zoom">
          <div style={{ position: 'absolute', inset: 0, background: tone.bgDark }} />

          {/* Animated burst lines */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 360;
            const scale = springScale(frame, fps, 5 + i * 2);
            return (
              <div key={i} style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: 4, height: vert ? '60%' : '50%',
                background: `linear-gradient(to bottom, ${tone.accent}00, ${tone.accent}88, ${tone.accent}00)`,
                transformOrigin: 'center top',
                transform: `translate(-50%, 0) rotate(${angle}deg) scaleY(${scale})`,
                opacity: 0.4,
              }} />
            );
          })}

          <ParticleOverlay tone={tone} count={25} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: vert ? 20 : 14,
          }}>
            {/* Sale title with glitch */}
            {(() => {
              const glitch = glitchText(frame, 1.5);
              return (
                <div style={{ position: 'relative' }}>
                  {/* Glitch red layer */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0,
                    fontSize: titleSize, fontWeight: 900,
                    color: '#FF3333',
                    letterSpacing: '0.08em',
                    transform: `translate(${glitch.offsetX}px, ${glitch.offsetY}px)`,
                    clipPath: `inset(${glitch.clipTop}% 0 ${100 - glitch.clipBottom}% 0)`,
                    opacity: glitch.opacity * 0.7,
                  }}>
                    {saleTitle}
                  </div>
                  {/* Glitch cyan layer */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0,
                    fontSize: titleSize, fontWeight: 900,
                    color: '#00CCFF',
                    letterSpacing: '0.08em',
                    transform: `translate(${-glitch.offsetX}px, ${-glitch.offsetY}px)`,
                    clipPath: `inset(${glitch.clipTop}% 0 ${100 - glitch.clipBottom}% 0)`,
                    opacity: glitch.opacity * 0.5,
                  }}>
                    {saleTitle}
                  </div>
                  {/* Main text */}
                  <div style={{
                    fontSize: titleSize, fontWeight: 900,
                    color: tone.textPrimary,
                    letterSpacing: '0.08em',
                    textShadow: `0 0 30px ${tone.accent}66`,
                  }}>
                    {saleTitle}
                  </div>
                </div>
              );
            })()}

            {/* Discount badge */}
            {(() => {
              const badgeScale = springScale(frame, fps, 18);
              const glow = pulseGlow(Math.max(0, frame - 25), fps, 3, 8, 25);
              return (
                <div style={{
                  background: `linear-gradient(135deg, ${tone.accent}, ${tone.primary})`,
                  borderRadius: 16,
                  padding: '12px 32px',
                  transform: `scale(${badgeScale * glow.scale})`,
                  boxShadow: `0 0 ${glow.blur}px ${tone.accent}88`,
                }}>
                  <span style={{
                    fontSize: discountSize * 0.6,
                    fontWeight: 900,
                    color: '#FFFFFF',
                    letterSpacing: '0.04em',
                  }}>
                    {discountText}
                  </span>
                </div>
              );
            })()}
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 2: Discount detail ── */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION} endFrame={SCENE_DURATION * 2} aspectRatio={aspectRatio} transition="wipe">
          <GradientBackground tone={tone} variant="default" />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: vert ? '40px 32px' : '32px 48px',
            gap: vert ? 28 : 20,
          }}>
            {/* Original price (crossed out) */}
            {(() => {
              const localFrame = frame;
              const slideIn = springScale(localFrame, fps, 5);
              const lineProgress = interpolate(localFrame, [20, 35], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              });
              return (
                <div style={{
                  opacity: slideIn,
                  transform: `translateY(${(1 - slideIn) * 30}px)`,
                  position: 'relative',
                }}>
                  <span style={{
                    fontSize: bodySize + 8,
                    fontWeight: 500,
                    color: tone.textSecondary,
                  }}>
                    通常価格
                  </span>
                  <span style={{
                    fontSize: bodySize + 16,
                    fontWeight: 700,
                    color: tone.textSecondary,
                    marginLeft: 12,
                  }}>
                    {originalPrice}
                  </span>
                  {/* Strikethrough line */}
                  <div style={{
                    position: 'absolute',
                    top: '50%', left: 0,
                    width: `${lineProgress * 100}%`,
                    height: 3,
                    background: '#FF4444',
                    borderRadius: 2,
                    transform: 'translateY(-50%) rotate(-5deg)',
                  }} />
                </div>
              );
            })()}

            {/* Arrow */}
            {(() => {
              const localFrame = frame;
              const arrowOpacity = interpolate(localFrame, [30, 40], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              });
              return (
                <div style={{
                  fontSize: 36, color: tone.accent, opacity: arrowOpacity,
                  transform: `translateY(${Math.sin(frame * 0.15) * 4}px)`,
                }}>
                  ▼
                </div>
              );
            })()}

            {/* Sale price (big) */}
            {(() => {
              const localFrame = frame;
              const priceScale = spring({
                frame: Math.max(0, localFrame - 35),
                fps,
                config: { damping: 8, mass: 0.6, stiffness: 250 },
              });
              const glow = pulseGlow(Math.max(0, localFrame - 45), fps, 2.5, 10, 30);
              return (
                <div style={{
                  transform: `scale(${priceScale * glow.scale})`,
                  opacity: priceScale,
                }}>
                  <span style={{
                    fontSize: bodySize, fontWeight: 500,
                    color: tone.accent,
                  }}>
                    セール価格
                  </span>
                  <div style={{
                    fontSize: discountSize,
                    fontWeight: 900,
                    color: tone.accent,
                    textShadow: `0 0 ${glow.blur}px ${tone.accent}44`,
                    letterSpacing: '-0.02em',
                  }}>
                    {salePrice}
                  </div>
                </div>
              );
            })()}
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 3: Product showcase ── */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION * 2} endFrame={SCENE_DURATION * 3} aspectRatio={aspectRatio} transition="slide">
          <div style={{ position: 'absolute', inset: 0, background: tone.bgDark }} />

          {productImage ? (
            <ImageWithEffect
              src={resolveImageSrc(productImage)}
              effect="zoomIn"
              durationFrames={SCENE_DURATION}
              overlayColor={tone.bgDark}
              overlayOpacity={0.2}
            />
          ) : (
            <GradientBackground tone={tone} variant="radial" />
          )}

          {/* Sale badge overlay */}
          {(() => {
            const localFrame = frame;
            const badgeScale = springScale(localFrame, fps, 20);
            return (
              <div style={{
                position: 'absolute',
                top: vert ? 60 : 40,
                right: vert ? 24 : 40,
                transform: `scale(${badgeScale}) rotate(-12deg)`,
              }}>
                <div style={{
                  background: '#FF2222',
                  borderRadius: '50%',
                  width: vert ? 100 : 90,
                  height: vert ? 100 : 90,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(255,0,0,0.4)',
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#FFF' }}>SALE</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#FFF', lineHeight: 1 }}>{discountText}</span>
                </div>
              </div>
            );
          })()}
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 4: Urgency ── */}
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION * 3} endFrame={SCENE_DURATION * 4} aspectRatio={aspectRatio} transition="fade">
          <GradientBackground tone={tone} variant="mesh" />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '40px 32px',
            gap: vert ? 32 : 24,
          }}>
            {/* Warning icon */}
            {(() => {
              const localFrame = frame;
              const iconScale = springScale(localFrame, fps, 5);
              const pulse = pulseGlow(localFrame, fps, 4, 5, 20);
              return (
                <div style={{
                  fontSize: 48, transform: `scale(${iconScale * pulse.scale})`,
                  filter: `drop-shadow(0 0 ${pulse.blur}px ${tone.accent}88)`,
                }}>
                  ⏰
                </div>
              );
            })()}

            <AnimatedText
              text={deadline}
              tone={tone}
              fontSize={discountSize * 0.7}
              fontWeight={900}
              mode="wave"
              delay={12}
              color={tone.accent}
              style={{ textShadow: `0 0 20px ${tone.accent}44` }}
            />

            <AnimatedText
              text="お見逃しなく！"
              tone={tone}
              fontSize={bodySize + 4}
              fontWeight={600}
              mode="typewriter"
              delay={35}
              color={tone.textSecondary}
            />

            {/* Urgency bar */}
            {(() => {
              const localFrame = frame;
              const barWidth = interpolate(localFrame, [40, 75], [100, 15], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              });
              return (
                <div style={{
                  width: '80%', height: 12, borderRadius: 6,
                  background: `${tone.textSecondary}22`,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${barWidth}%`, height: '100%',
                    borderRadius: 6,
                    background: barWidth < 40
                      ? '#FF4444'
                      : `linear-gradient(90deg, ${tone.accent}, ${tone.primary})`,
                    transition: 'background 0.3s',
                  }} />
                </div>
              );
            })()}
          </div>
        </SceneWrapper>
      </Sequence>

      {/* ── Scene 5: CTA ── */}
      <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION}>
        <SceneWrapper startFrame={SCENE_DURATION * 4} endFrame={SCENE_DURATION * 5} aspectRatio={aspectRatio} transition="zoom">
          <GradientBackground tone={tone} variant="mesh" />
          <ParticleOverlay tone={tone} count={30} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '40px 32px',
            gap: vert ? 36 : 28,
          }}>
            <LogoReveal
              serviceName={saleTitle}
              tone={tone}
              delay={0}
              size="medium"
              logoImageSrc={logoSrc || undefined}
            />

            <AnimatedText
              text={discountText}
              tone={tone}
              fontSize={bodySize + 12}
              fontWeight={800}
              mode="wave"
              delay={10}
              color={tone.accent}
            />

            <CTAButton text={ctaText} tone={tone} delay={18} />

            <AnimatedText
              text={deadline}
              tone={tone}
              fontSize={bodySize - 4}
              fontWeight={500}
              mode="typewriter"
              delay={30}
              color={tone.textSecondary}
            />
          </div>
        </SceneWrapper>
      </Sequence>
    </div>
  );
};
