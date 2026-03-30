import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { ToneTheme } from "../types";

interface CountdownTimerProps {
  tone: ToneTheme;
  deadline: string;
  size?: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  tone,
  deadline,
  size = 200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = Math.sin((frame / fps) * Math.PI * 3) * 0.5 + 0.5;
  const glowSize = interpolate(pulse, [0, 1], [10, 25]);
  const scale = interpolate(pulse, [0, 1], [1, 1.03]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `4px solid ${tone.accent}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 ${glowSize}px ${tone.accent}40`,
          transform: `scale(${scale})`,
          background: `${tone.bgDark}CC`,
        }}
      >
        <div
          style={{
            fontSize: size * 0.18,
            fontWeight: 700,
            color: tone.accent,
            fontFamily: "Noto Sans JP, sans-serif",
          }}
        >
          残り
        </div>
        <div
          style={{
            fontSize: size * 0.35,
            fontWeight: 700,
            color: tone.textPrimary,
            lineHeight: 1,
            fontFamily: "Noto Sans JP, sans-serif",
          }}
        >
          {deadline}
        </div>
      </div>
    </div>
  );
};
