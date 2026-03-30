import React from 'react';
import { useCurrentFrame, useVideoConfig, Img, staticFile, interpolate, spring } from 'remotion';
import { kenBurns } from '../animations';

type EffectType = 'kenBurns' | 'parallax' | 'reveal' | 'zoomIn';

interface ImageWithEffectProps {
  src: string;
  effect?: EffectType;
  durationFrames?: number;
  delay?: number;
  style?: React.CSSProperties;
  overlayColor?: string;
  overlayOpacity?: number;
  kenBurnsConfig?: {
    startScale?: number;
    endScale?: number;
    panX?: number;
    panY?: number;
  };
}

const resolveImageSrc = (src: string): string => {
  if (src.startsWith('blob:') || src.startsWith('data:') || src.startsWith('http')) {
    return src;
  }
  return staticFile(src);
};

export const ImageWithEffect: React.FC<ImageWithEffectProps> = ({
  src,
  effect = 'kenBurns',
  durationFrames = 90,
  delay = 0,
  style,
  overlayColor,
  overlayOpacity = 0.5,
  kenBurnsConfig,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const effectiveFrame = Math.max(0, frame - delay);

  let imageTransform = '';
  let containerStyle: React.CSSProperties = {};

  switch (effect) {
    case 'kenBurns': {
      const kb = kenBurns(
        effectiveFrame,
        durationFrames,
        kenBurnsConfig?.startScale ?? 1.0,
        kenBurnsConfig?.endScale ?? 1.2,
        kenBurnsConfig?.panX ?? -20,
        kenBurnsConfig?.panY ?? -10,
      );
      imageTransform = `scale(${kb.scale}) translate(${kb.translateX}px, ${kb.translateY}px)`;
      break;
    }
    case 'parallax': {
      const parallaxY = interpolate(effectiveFrame, [0, durationFrames], [20, -20], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      imageTransform = `scale(1.15) translateY(${parallaxY}px)`;
      break;
    }
    case 'reveal': {
      const revealProgress = spring({
        frame: effectiveFrame,
        fps,
        config: { damping: 15, mass: 1, stiffness: 100 },
      });
      containerStyle = {
        clipPath: `inset(0 ${(1 - revealProgress) * 100}% 0 0)`,
      };
      imageTransform = 'scale(1.05)';
      break;
    }
    case 'zoomIn': {
      const zoomProgress = interpolate(effectiveFrame, [0, durationFrames], [1.3, 1.0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const blurAmount = interpolate(effectiveFrame, [0, 15], [8, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      imageTransform = `scale(${zoomProgress})`;
      containerStyle = { filter: `blur(${blurAmount}px)` };
      break;
    }
  }

  const resolvedSrc = resolveImageSrc(src);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...containerStyle,
        ...style,
      }}
    >
      <Img
        src={resolvedSrc}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: imageTransform,
        }}
      />
      {overlayColor && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      )}
    </div>
  );
};
