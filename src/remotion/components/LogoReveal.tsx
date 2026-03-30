import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from 'remotion';
import type { ToneTheme } from '../types';

interface LogoRevealProps {
  serviceName: string;
  tone: ToneTheme;
  delay?: number;
  size?: 'small' | 'medium' | 'large';
  logoImageSrc?: string;
}

const resolveImageSrc = (src: string): string => {
  if (src.startsWith('blob:') || src.startsWith('data:') || src.startsWith('http')) {
    return src;
  }
  return staticFile(src);
};

export const LogoReveal: React.FC<LogoRevealProps> = ({
  serviceName,
  tone,
  delay = 0,
  size = 'medium',
  logoImageSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const effectiveFrame = Math.max(0, frame - delay);

  // Icon bounce in
  const iconScale = spring({
    frame: effectiveFrame,
    fps,
    config: { damping: 8, mass: 0.6, stiffness: 250 },
  });

  // Text slide in (after icon)
  const textProgress = spring({
    frame: Math.max(0, effectiveFrame - 8),
    fps,
    config: { damping: 12, mass: 0.7, stiffness: 180 },
  });

  // Underline draw
  const underlineWidth = spring({
    frame: Math.max(0, effectiveFrame - 16),
    fps,
    config: { damping: 15, mass: 1, stiffness: 120 },
  });

  // Glow pulse
  const glowPulse = Math.sin(effectiveFrame * 0.08) * 0.3 + 0.7;

  const sizes = {
    small: { icon: 40, text: 28, gap: 10 },
    medium: { icon: 60, text: 44, gap: 14 },
    large: { icon: 80, text: 64, gap: 18 },
  };

  const s = sizes[size];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: s.gap,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: s.icon,
            height: s.icon,
            borderRadius: s.icon * 0.25,
            background: logoImageSrc
              ? 'transparent'
              : `linear-gradient(135deg, ${tone.primary}, ${tone.accent})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${iconScale}) rotate(${(1 - iconScale) * -180}deg)`,
            boxShadow: logoImageSrc
              ? 'none'
              : `0 0 ${20 * glowPulse}px ${tone.accent}44`,
            overflow: 'hidden',
          }}
        >
          {logoImageSrc ? (
            <Img
              src={resolveImageSrc(logoImageSrc)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <span
              style={{
                fontSize: s.icon * 0.5,
                fontWeight: 900,
                color: '#FFFFFF',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              F
            </span>
          )}
        </div>
        {/* Service name */}
        <div
          style={{
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <span
            style={{
              fontSize: s.text,
              fontWeight: 800,
              color: tone.textPrimary,
              fontFamily:
                '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
              letterSpacing: '-0.02em',
              opacity: textProgress,
              transform: `translateX(${interpolate(textProgress, [0, 1], [-30, 0])}px)`,
              display: 'inline-block',
            }}
          >
            {serviceName}
          </span>
        </div>
      </div>
      {/* Animated underline */}
      <div
        style={{
          width: `${underlineWidth * 100}%`,
          maxWidth: s.icon + s.gap + s.text * serviceName.length * 0.6,
          height: 3,
          borderRadius: 1.5,
          background: `linear-gradient(90deg, ${tone.accent}, ${tone.primary})`,
          opacity: underlineWidth * 0.8,
        }}
      />
    </div>
  );
};
