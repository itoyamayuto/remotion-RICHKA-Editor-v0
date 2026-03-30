import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import type { ToneTheme, AspectRatio } from "../types";

interface BeforeAfterSplitProps {
  tone: ToneTheme;
  aspectRatio: AspectRatio;
  beforeImage?: string;
  afterImage?: string;
  beforeText: string;
  afterText: string;
  revealProgress?: number;
}

function resolveImageSrc(src: string): string {
  if (src.startsWith("blob:") || src.startsWith("data:") || src.startsWith("http")) {
    return src;
  }
  return staticFile(src);
}

export const BeforeAfterSplit: React.FC<BeforeAfterSplitProps> = ({
  tone,
  aspectRatio,
  beforeImage,
  afterImage,
  beforeText,
  afterText,
  revealProgress,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress =
    revealProgress ??
    interpolate(frame, [0, 60], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const splitPosition = interpolate(progress, [0, 1], [100, 50]);

  const { width, height } = aspectRatio;
  const isVertical = height > width;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Before side */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${splitPosition}%`,
          height: "100%",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${tone.bgDark}, #333)`,
        }}
      >
        {beforeImage && (
          <Img
            src={resolveImageSrc(beforeImage)}
            style={{
              width: `${(100 / splitPosition) * 100}%`,
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(60%) brightness(0.7)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            bottom: isVertical ? "15%" : "10%",
            left: "50%",
            transform: "translateX(-50%)",
            background: `${tone.bgDark}CC`,
            padding: "12px 32px",
            borderRadius: 8,
            fontFamily: "Noto Sans JP, sans-serif",
            fontWeight: 700,
            fontSize: isVertical ? 32 : 28,
            color: tone.textSecondary,
            whiteSpace: "nowrap",
          }}
        >
          {beforeText}
        </div>
      </div>

      {/* After side */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: `${100 - splitPosition}%`,
          height: "100%",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${tone.primary}, ${tone.accent})`,
        }}
      >
        {afterImage && (
          <Img
            src={resolveImageSrc(afterImage)}
            style={{
              width: `${(100 / (100 - splitPosition)) * 100}%`,
              height: "100%",
              objectFit: "cover",
              marginLeft: `-${(splitPosition / (100 - splitPosition)) * 100}%`,
              filter: "brightness(1.1) saturate(1.2)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            bottom: isVertical ? "15%" : "10%",
            left: "50%",
            transform: "translateX(-50%)",
            background: `${tone.accent}CC`,
            padding: "12px 32px",
            borderRadius: 8,
            fontFamily: "Noto Sans JP, sans-serif",
            fontWeight: 700,
            fontSize: isVertical ? 32 : 28,
            color: tone.bgDark,
            whiteSpace: "nowrap",
          }}
        >
          {afterText}
        </div>
      </div>

      {/* Divider line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${splitPosition}%`,
          width: 4,
          height: "100%",
          background: tone.accent,
          boxShadow: `0 0 20px ${tone.accent}`,
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
};
