import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { ToneTheme } from '../types';
import { particleSystem } from '../animations';

interface ParticleOverlayProps {
  tone: ToneTheme;
  count?: number;
  style?: React.CSSProperties;
}

export const ParticleOverlay: React.FC<ParticleOverlayProps> = ({
  tone,
  count = 25,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const particles = Array.from({ length: count }, (_, i) => {
    const p = particleSystem(frame, fps, i, width, height);
    return p;
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        ...style,
      }}
    >
      {particles.map((p, i) => {
        // Alternate between circles and diamonds
        const isCircle = i % 3 !== 0;
        const size = 4 + p.scale * 6;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: size,
              height: size,
              opacity: p.opacity,
              transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
              borderRadius: isCircle ? '50%' : '2px',
              background:
                i % 2 === 0
                  ? tone.accent
                  : tone.primary,
              boxShadow: `0 0 ${size * 2}px ${i % 2 === 0 ? tone.accent : tone.primary}66`,
            }}
          />
        );
      })}
    </div>
  );
};
