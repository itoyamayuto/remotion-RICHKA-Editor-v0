import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { ToneTheme } from "../types";

interface RankingBarProps {
  tone: ToneTheme;
  rank: number;
  name: string;
  description: string;
  delay?: number;
  isWinner?: boolean;
}

export const RankingBar: React.FC<RankingBarProps> = ({
  tone,
  rank,
  name,
  description,
  delay = 0,
  isWinner = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 200 },
  });

  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const opacity = entrance;
  const translateX = interpolate(entrance, [0, 1], [-100, 0]);

  const rankColors: Record<number, string> = {
    1: tone.accent,
    2: "#C0C0C0",
    3: "#CD7F32",
  };

  const rankColor = rankColors[rank] ?? tone.textSecondary;
  const bgOpacity = isWinner ? "F0" : "CC";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: isWinner ? "28px 36px" : "20px 28px",
        borderRadius: 16,
        background: isWinner
          ? `linear-gradient(135deg, ${tone.primary}${bgOpacity}, ${tone.accent}40)`
          : `${tone.bgDark}${bgOpacity}`,
        border: isWinner
          ? `2px solid ${tone.accent}`
          : `1px solid ${tone.primary}30`,
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
        fontFamily: "Noto Sans JP, sans-serif",
        boxShadow: isWinner ? `0 0 30px ${tone.accent}20` : "none",
      }}
    >
      {/* Rank number */}
      <div
        style={{
          fontSize: isWinner ? 56 : 44,
          fontWeight: 700,
          color: rankColor,
          minWidth: 70,
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        {rank}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: isWinner ? 32 : 26,
            fontWeight: 700,
            color: tone.textPrimary,
            marginBottom: 4,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: isWinner ? 20 : 18,
            color: tone.textSecondary,
          }}
        >
          {description}
        </div>
      </div>

      {/* Crown for winner */}
      {isWinner && (
        <div style={{ fontSize: 48 }}>👑</div>
      )}
    </div>
  );
};
