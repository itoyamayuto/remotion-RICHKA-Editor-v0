import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import type { AspectRatio } from '../types';

interface SceneWrapperProps {
  startFrame: number;
  endFrame: number;
  aspectRatio: AspectRatio;
  children: React.ReactNode;
  transition?: 'fade' | 'wipe' | 'slide' | 'zoom' | 'none';
  transitionDuration?: number;
}

export const SceneWrapper: React.FC<SceneWrapperProps> = ({
  startFrame,
  endFrame,
  aspectRatio: _aspectRatio,
  children,
  transition = 'wipe',
  transitionDuration = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // When used inside <Sequence>, useCurrentFrame() returns local frame (starting from 0).
  // So we use local frame directly with scene duration.
  const sceneDuration = endFrame - startFrame;
  const localFrame = frame;

  let enterTransform = '';
  let enterOpacity = 1;
  let exitTransform = '';
  let exitOpacity = 1;

  // Entrance animation
  switch (transition) {
    case 'fade': {
      enterOpacity = interpolate(localFrame, [0, transitionDuration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      break;
    }
    case 'wipe': {
      const wipeProgress = spring({
        frame: localFrame,
        fps,
        config: { damping: 15, mass: 1, stiffness: 120 },
      });
      enterTransform = `translateX(${(1 - wipeProgress) * 100}%)`;
      break;
    }
    case 'slide': {
      const slideProgress = spring({
        frame: localFrame,
        fps,
        config: { damping: 14, mass: 0.8, stiffness: 160 },
      });
      enterTransform = `translateY(${(1 - slideProgress) * 50}%)`;
      enterOpacity = slideProgress;
      break;
    }
    case 'zoom': {
      const zoomProgress = spring({
        frame: localFrame,
        fps,
        config: { damping: 12, mass: 0.7, stiffness: 200 },
      });
      enterTransform = `scale(${0.8 + zoomProgress * 0.2})`;
      enterOpacity = zoomProgress;
      break;
    }
    case 'none':
      break;
  }

  // Exit fade
  const exitStart = sceneDuration - transitionDuration;
  if (localFrame > exitStart) {
    exitOpacity = interpolate(
      localFrame,
      [exitStart, sceneDuration],
      [1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: Math.min(enterOpacity, exitOpacity),
        transform: [enterTransform, exitTransform].filter(Boolean).join(' ') || undefined,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};
