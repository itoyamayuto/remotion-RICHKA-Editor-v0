import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import type { ToneTheme } from '../types';
import { pulseGlow } from '../animations';

interface CTAButtonProps {
  text: string;
  tone: ToneTheme;
  delay?: number;
  width?: number | string;
  height?: number;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  text,
  tone,
  delay = 0,
  width = 'auto',
  height = 70,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 10, mass: 0.7, stiffness: 200 },
  });

  const glow = pulseGlow(Math.max(0, frame - delay - 15), fps, 2.5, 15, 40);

  const scaleY = interpolate(entrance, [0, 0.5, 1], [0, 1.1, 1]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: entrance,
        transform: `scale(${entrance * glow.scale}) scaleY(${scaleY})`,
      }}
    >
      {/* Glow layer */}
      <div
        style={{
          position: 'absolute',
          inset: -10,
          borderRadius: height / 2 + 10,
          background: tone.accent,
          filter: `blur(${glow.blur}px)`,
          opacity: glow.opacity * 0.5,
        }}
      />
      {/* Button */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width,
          height,
          paddingLeft: 50,
          paddingRight: 50,
          borderRadius: height / 2,
          background: `linear-gradient(135deg, ${tone.accent}, ${tone.primary})`,
          boxShadow: `0 4px 20px ${tone.accent}66, 0 0 ${glow.blur}px ${tone.accent}33`,
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            fontSize: Math.round(height * 0.36),
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.05em',
            fontFamily:
              '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          {text}
        </span>
        {/* Arrow icon */}
        <span
          style={{
            marginLeft: 12,
            fontSize: Math.round(height * 0.3),
            color: '#FFFFFF',
            transform: `translateX(${Math.sin(frame * 0.15) * 4}px)`,
            display: 'inline-block',
          }}
        >
          {'\u25B6'}
        </span>
      </div>
    </div>
  );
};
