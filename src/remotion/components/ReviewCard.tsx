import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { ToneTheme } from "../types";

interface ReviewCardProps {
  tone: ToneTheme;
  reviewText: string;
  reviewerName: string;
  rating?: number;
  delay?: number;
  width?: number;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  tone,
  reviewText,
  reviewerName,
  rating = 5,
  delay = 0,
  width = 600,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 180 },
  });

  const opacity = entrance;
  const translateY = interpolate(entrance, [0, 1], [60, 0]);

  const stars = "★".repeat(Math.min(5, Math.max(0, Math.round(rating))));
  const emptyStars = "☆".repeat(5 - Math.min(5, Math.max(0, Math.round(rating))));

  return (
    <div
      style={{
        width,
        padding: 32,
        borderRadius: 16,
        background: `${tone.bgDark}E6`,
        border: `1px solid ${tone.primary}40`,
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: "Noto Sans JP, sans-serif",
      }}
    >
      {/* Stars */}
      <div style={{ fontSize: 28, marginBottom: 16 }}>
        <span style={{ color: tone.accent }}>{stars}</span>
        <span style={{ color: `${tone.textSecondary}40` }}>{emptyStars}</span>
      </div>

      {/* Review text */}
      <div
        style={{
          fontSize: 24,
          lineHeight: 1.6,
          color: tone.textPrimary,
          marginBottom: 16,
        }}
      >
        「{reviewText}」
      </div>

      {/* Reviewer */}
      <div
        style={{
          fontSize: 18,
          color: tone.textSecondary,
          textAlign: "right",
        }}
      >
        — {reviewerName}
      </div>
    </div>
  );
};
