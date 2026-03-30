import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import type { ToneTheme } from '../types';

interface StatCounterProps {
  value: string;
  label: string;
  tone: ToneTheme;
  delay?: number;
  index?: number;
  size?: 'small' | 'medium' | 'large';
}

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  label,
  tone,
  delay = 0,
  index = 0,
  size = 'medium',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const itemDelay = delay + index * 10;

  const scaleProgress = spring({
    frame: Math.max(0, frame - itemDelay),
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 200 },
  });

  const slideUp = interpolate(
    spring({
      frame: Math.max(0, frame - itemDelay),
      fps,
      config: { damping: 14, mass: 0.6, stiffness: 180 },
    }),
    [0, 1],
    [60, 0],
  );

  // Extract numeric part for counter animation
  const numMatch = value.match(/[\d,.]+/);
  const numericPart = numMatch ? numMatch[0] : '';
  const prefix = value.slice(0, value.indexOf(numericPart));
  const suffix = value.slice(value.indexOf(numericPart) + numericPart.length);

  // Animate the number
  const targetNum = parseFloat(numericPart.replace(/,/g, ''));
  const counterProgress = interpolate(frame - itemDelay, [0, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const easedCounter = 1 - Math.pow(1 - counterProgress, 3);
  const currentNum = Math.round(targetNum * easedCounter);

  // Format number with commas
  const formattedNum = isNaN(currentNum)
    ? numericPart
    : currentNum.toLocaleString();

  const fontSizes = {
    small: { value: 36, label: 16 },
    medium: { value: 52, label: 20 },
    large: { value: 72, label: 28 },
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        opacity: scaleProgress,
        transform: `translateY(${slideUp}px) scale(${0.8 + scaleProgress * 0.2})`,
      }}
    >
      <div
        style={{
          fontSize: fontSizes[size].value,
          fontWeight: 900,
          color: tone.accent,
          fontFamily:
            '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
          letterSpacing: '-0.02em',
          textShadow: `0 0 20px ${tone.accent}44`,
        }}
      >
        {prefix}
        {formattedNum}
        {suffix}
      </div>
      <div
        style={{
          fontSize: fontSizes[size].label,
          fontWeight: 500,
          color: tone.textSecondary,
          fontFamily:
            '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
        }}
      >
        {label}
      </div>
    </div>
  );
};
