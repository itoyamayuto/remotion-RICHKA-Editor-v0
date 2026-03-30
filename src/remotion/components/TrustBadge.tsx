import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import type { ToneTheme } from '../types';

interface TrustBadgeProps {
  text: string;
  tone: ToneTheme;
  delay?: number;
  index?: number;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  text,
  tone,
  delay = 0,
  index = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const itemDelay = delay + index * 8;

  const scaleIn = spring({
    frame: Math.max(0, frame - itemDelay),
    fps,
    config: { damping: 10, mass: 0.6, stiffness: 220 },
  });

  const slideX = interpolate(scaleIn, [0, 1], [80, 0]);

  // Shimmer effect
  const shimmerPos = interpolate(
    (frame - itemDelay) % 60,
    [0, 60],
    [-100, 200],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 24px',
        borderRadius: 40,
        background: `${tone.accent}18`,
        border: `1.5px solid ${tone.accent}44`,
        opacity: scaleIn,
        transform: `translateX(${slideX}px) scale(${0.9 + scaleIn * 0.1})`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Shimmer overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: `${shimmerPos}%`,
          width: '30%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${tone.accent}22, transparent)`,
          pointerEvents: 'none',
        }}
      />
      {/* Check icon */}
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: tone.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          color: '#FFFFFF',
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {'\u2713'}
      </div>
      <span
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: tone.textPrimary,
          fontFamily:
            '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
    </div>
  );
};
