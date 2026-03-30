import { interpolate, spring } from 'remotion';

/**
 * Bouncy scale entrance using spring physics
 */
export function springScale(
  frame: number,
  fps: number,
  delay: number = 0,
  config?: { damping?: number; mass?: number; stiffness?: number },
): number {
  if (frame < delay) return 0;
  return spring({
    frame: frame - delay,
    fps,
    config: {
      damping: config?.damping ?? 12,
      mass: config?.mass ?? 0.8,
      stiffness: config?.stiffness ?? 200,
    },
  });
}

/**
 * Elastic slide in from a direction
 */
export function elasticSlideIn(
  frame: number,
  fps: number,
  direction: 'left' | 'right' | 'top' | 'bottom',
  delay: number = 0,
  distance: number = 300,
): number {
  if (frame < delay) return direction === 'left' || direction === 'top' ? -distance : distance;

  const progress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 10,
      mass: 0.6,
      stiffness: 180,
    },
  });

  const startOffset = direction === 'left' || direction === 'top' ? -distance : distance;
  return interpolate(progress, [0, 1], [startOffset, 0]);
}

/**
 * Staggered reveal - returns opacity for a given index in a sequence
 */
export function staggeredReveal(
  frame: number,
  fps: number,
  index: number,
  staggerDelay: number = 5,
  baseDelay: number = 0,
): { opacity: number; translateY: number } {
  const itemDelay = baseDelay + index * staggerDelay;
  if (frame < itemDelay) return { opacity: 0, translateY: 40 };

  const progress = spring({
    frame: frame - itemDelay,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 200 },
  });

  return {
    opacity: progress,
    translateY: interpolate(progress, [0, 1], [40, 0]),
  };
}

/**
 * Ken Burns effect - zoom and pan on image
 */
export function kenBurns(
  frame: number,
  durationFrames: number,
  startScale: number = 1.0,
  endScale: number = 1.15,
  panX: number = 0,
  panY: number = 0,
): { scale: number; translateX: number; translateY: number } {
  const progress = interpolate(frame, [0, durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Smooth easing
  const eased = progress * progress * (3 - 2 * progress);

  return {
    scale: interpolate(eased, [0, 1], [startScale, endScale]),
    translateX: interpolate(eased, [0, 1], [0, panX]),
    translateY: interpolate(eased, [0, 1], [0, panY]),
  };
}

/**
 * Glitch text offset effect
 */
export function glitchText(
  frame: number,
  intensity: number = 1,
): { offsetX: number; offsetY: number; clipTop: number; clipBottom: number; opacity: number } {
  // Create pseudo-random based on frame
  const seed = Math.sin(frame * 12.9898 + frame * 78.233) * 43758.5453;
  const random = seed - Math.floor(seed);

  // Glitch every ~8 frames for 2 frames
  const isGlitching = frame % 8 < 2 && random > 0.3;

  if (!isGlitching) {
    return { offsetX: 0, offsetY: 0, clipTop: 0, clipBottom: 100, opacity: 1 };
  }

  return {
    offsetX: (random - 0.5) * 20 * intensity,
    offsetY: (Math.sin(frame * 3.14) - 0.5) * 10 * intensity,
    clipTop: random * 30,
    clipBottom: 70 + random * 30,
    opacity: random > 0.5 ? 1 : 0.8,
  };
}

/**
 * Animated gradient angle/position morph
 */
export function morphGradient(
  frame: number,
  durationFrames: number,
  startAngle: number = 135,
  endAngle: number = 225,
): { angle: number; position: number } {
  const progress = interpolate(frame, [0, durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Use sine for smooth oscillation
  const oscillation = Math.sin(progress * Math.PI);

  return {
    angle: interpolate(oscillation, [0, 1], [startAngle, endAngle]),
    position: interpolate(progress, [0, 1], [0, 100]),
  };
}

/**
 * Pulsing glow effect
 */
export function pulseGlow(
  frame: number,
  fps: number,
  pulseSpeed: number = 2,
  minGlow: number = 10,
  maxGlow: number = 30,
): { blur: number; opacity: number; scale: number } {
  const t = frame / fps;
  const pulse = (Math.sin(t * Math.PI * pulseSpeed) + 1) / 2;

  return {
    blur: interpolate(pulse, [0, 1], [minGlow, maxGlow]),
    opacity: interpolate(pulse, [0, 1], [0.4, 0.8]),
    scale: interpolate(pulse, [0, 1], [1, 1.05]),
  };
}

/**
 * Number counter animation
 */
export function counterAnimation(
  frame: number,
  fps: number,
  targetValue: number,
  delay: number = 0,
  durationSeconds: number = 1.5,
): number {
  if (frame < delay) return 0;

  const elapsed = frame - delay;
  const totalFrames = durationSeconds * fps;
  const progress = interpolate(elapsed, [0, totalFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Ease out cubic for natural deceleration
  const eased = 1 - Math.pow(1 - progress, 3);
  return Math.round(targetValue * eased);
}

/**
 * Wave motion for individual text characters
 */
export function waveText(
  frame: number,
  fps: number,
  charIndex: number,
  amplitude: number = 15,
  frequency: number = 3,
  waveDelay: number = 3,
): { translateY: number; opacity: number; scale: number } {
  const t = frame / fps;
  const charOffset = charIndex * waveDelay;
  const effectiveFrame = frame - charOffset;

  if (effectiveFrame < 0) {
    return { translateY: amplitude, opacity: 0, scale: 0.8 };
  }

  // Entrance animation
  const entranceProgress = interpolate(effectiveFrame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Continuous wave after entrance
  const wave = Math.sin((t - charIndex * 0.1) * Math.PI * frequency) * amplitude * 0.3;

  return {
    translateY: interpolate(entranceProgress, [0, 1], [amplitude, 0]) + (entranceProgress >= 1 ? wave : 0),
    opacity: entranceProgress,
    scale: interpolate(entranceProgress, [0, 1], [0.8, 1]),
  };
}

/**
 * Particle system - returns position for a single particle
 */
export function particleSystem(
  frame: number,
  fps: number,
  particleIndex: number,
  canvasWidth: number,
  canvasHeight: number,
): { x: number; y: number; opacity: number; scale: number; rotation: number } {
  // Deterministic pseudo-random for consistent particles
  const seed1 = Math.sin(particleIndex * 127.1 + 311.7) * 43758.5453;
  const seed2 = Math.sin(particleIndex * 269.5 + 183.3) * 43758.5453;
  const seed3 = Math.sin(particleIndex * 419.2 + 371.9) * 43758.5453;

  const r1 = seed1 - Math.floor(seed1);
  const r2 = seed2 - Math.floor(seed2);
  const r3 = seed3 - Math.floor(seed3);

  const t = frame / fps;
  const speed = 0.3 + r1 * 0.7;
  const startX = r2 * canvasWidth;
  const startY = canvasHeight + 20;

  // Float upward with slight horizontal drift
  const y = startY - t * speed * 120;
  const x = startX + Math.sin(t * (1 + r3 * 2) + particleIndex) * 50;

  // Fade in and out based on position (inputRange must be ascending)
  const lifeProgress = interpolate(y, [-20, canvasHeight], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = lifeProgress < 0.2
    ? interpolate(lifeProgress, [0, 0.2], [0, 0.6])
    : lifeProgress > 0.8
      ? interpolate(lifeProgress, [0.8, 1], [0.6, 0])
      : 0.6;

  return {
    x: x % canvasWidth,
    y: ((y % (canvasHeight + 40)) + canvasHeight + 40) % (canvasHeight + 40) - 20,
    opacity: Math.max(0, opacity),
    scale: 0.5 + r3 * 1.0,
    rotation: t * (50 + r1 * 100),
  };
}

/**
 * Scene transition - wipe effect progress
 */
export function wipeTransition(
  frame: number,
  startFrame: number,
  durationFrames: number = 15,
  direction: 'left' | 'right' | 'up' | 'down' = 'left',
): number {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Ease in-out for smooth wipe
  return progress * progress * (3 - 2 * progress);
}

/**
 * Typewriter effect - returns how many characters to show
 */
export function typewriterProgress(
  frame: number,
  totalChars: number,
  delay: number = 0,
  charsPerFrame: number = 0.8,
): number {
  if (frame < delay) return 0;
  const elapsed = frame - delay;
  return Math.min(Math.floor(elapsed * charsPerFrame), totalChars);
}
