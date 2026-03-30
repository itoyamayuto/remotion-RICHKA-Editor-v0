import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { ToneTheme } from '../types';
import { waveText, typewriterProgress } from '../animations';

type AnimationMode = 'wave' | 'typewriter' | 'charReveal';

interface AnimatedTextProps {
  text: string;
  tone: ToneTheme;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  mode?: AnimationMode;
  delay?: number;
  style?: React.CSSProperties;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right';
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  tone,
  fontSize = 48,
  fontWeight = 700,
  color,
  mode = 'wave',
  delay = 0,
  style,
  lineHeight = 1.4,
  textAlign = 'center',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const effectiveFrame = frame - delay;

  const textColor = color ?? tone.textPrimary;
  const chars = text.split('');

  if (mode === 'typewriter') {
    const visibleChars = typewriterProgress(frame, chars.length, delay);
    return (
      <div
        style={{
          fontSize,
          fontWeight,
          color: textColor,
          lineHeight,
          textAlign,
          fontFamily:
            '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
          whiteSpace: 'pre-wrap',
          ...style,
        }}
      >
        {text.slice(0, visibleChars)}
        <span
          style={{
            opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
            color: tone.accent,
          }}
        >
          |
        </span>
      </div>
    );
  }

  if (mode === 'charReveal') {
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent:
            textAlign === 'center'
              ? 'center'
              : textAlign === 'right'
                ? 'flex-end'
                : 'flex-start',
          fontSize,
          fontWeight,
          lineHeight,
          fontFamily:
            '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
          ...style,
        }}
      >
        {chars.map((char, i) => {
          const charDelay = delay + i * 2;
          const progress =
            effectiveFrame >= 0
              ? Math.min(1, Math.max(0, (frame - charDelay) / 8))
              : 0;
          const eased = progress * progress * (3 - 2 * progress);
          return (
            <span
              key={`${i}-${char}`}
              style={{
                display: 'inline-block',
                color: textColor,
                opacity: eased,
                transform: `translateY(${(1 - eased) * 30}px) scale(${0.5 + eased * 0.5})`,
                filter: `blur(${(1 - eased) * 4}px)`,
                whiteSpace: char === ' ' ? 'pre' : undefined,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  }

  // Wave mode (default)
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent:
          textAlign === 'center'
            ? 'center'
            : textAlign === 'right'
              ? 'flex-end'
              : 'flex-start',
        fontSize,
        fontWeight,
        lineHeight,
        fontFamily:
          '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
        ...style,
      }}
    >
      {chars.map((char, i) => {
        const wave = waveText(effectiveFrame < 0 ? 0 : effectiveFrame, fps, i);
        return (
          <span
            key={`${i}-${char}`}
            style={{
              display: 'inline-block',
              color: textColor,
              opacity: wave.opacity,
              transform: `translateY(${wave.translateY}px) scale(${wave.scale})`,
              whiteSpace: char === ' ' ? 'pre' : undefined,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};
