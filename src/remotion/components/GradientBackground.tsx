import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { ToneTheme } from '../types';
import { morphGradient } from '../animations';

interface GradientBackgroundProps {
  tone: ToneTheme;
  durationFrames?: number;
  startAngle?: number;
  endAngle?: number;
  style?: React.CSSProperties;
  variant?: 'default' | 'radial' | 'mesh';
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  tone,
  durationFrames = 90,
  startAngle = 135,
  endAngle = 225,
  style,
  variant = 'default',
}) => {
  const frame = useCurrentFrame();
  const morph = morphGradient(frame, durationFrames, startAngle, endAngle);

  let background: string;

  switch (variant) {
    case 'radial': {
      const posX = 50 + Math.sin(frame * 0.02) * 20;
      const posY = 50 + Math.cos(frame * 0.015) * 20;
      background = `radial-gradient(ellipse at ${posX}% ${posY}%, ${tone.gradientStart}, ${tone.bgDark})`;
      break;
    }
    case 'mesh': {
      const p1x = 30 + Math.sin(frame * 0.03) * 20;
      const p1y = 30 + Math.cos(frame * 0.02) * 20;
      const p2x = 70 + Math.sin(frame * 0.025 + 2) * 20;
      const p2y = 70 + Math.cos(frame * 0.035 + 1) * 20;
      background = [
        `radial-gradient(circle at ${p1x}% ${p1y}%, ${tone.gradientStart}88, transparent 50%)`,
        `radial-gradient(circle at ${p2x}% ${p2y}%, ${tone.accent}66, transparent 50%)`,
        `linear-gradient(${morph.angle}deg, ${tone.bgDark}, ${tone.bgDark})`,
      ].join(', ');
      break;
    }
    default:
      background = `linear-gradient(${morph.angle}deg, ${tone.gradientStart}, ${tone.gradientEnd}, ${tone.bgDark})`;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background,
        ...style,
      }}
    />
  );
};
