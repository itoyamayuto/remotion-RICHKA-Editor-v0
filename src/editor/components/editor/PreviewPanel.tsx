import React, { useMemo, useState, useEffect, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { useEditorStore } from "../../store";
import { TEMPLATE_COMPONENTS } from "../../../Root";
import { ASPECT_RATIOS } from "../../../remotion/aspectRatios";
import { TONES } from "../../../remotion/tones";
import { BGM_OPTIONS } from "../../../templates/registry";
import type { VideoAdProps } from "../../../remotion/types";

export const PreviewPanel: React.FC = () => {
  const templateId = useEditorStore((s) => s.templateId);
  const aspectRatioId = useEditorStore((s) => s.aspectRatioId);
  const toneId = useEditorStore((s) => s.toneId);
  const inputs = useEditorStore((s) => s.inputs);
  const logoSrc = useEditorStore((s) => s.logoSrc);
  const bgmId = useEditorStore((s) => s.bgmId);
  const withSFX = useEditorStore((s) => s.withSFX);

  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<PlayerRef>(null);
  const initialLoadRef = useRef(false);

  const aspectRatio = ASPECT_RATIOS[aspectRatioId];
  const tone = TONES[toneId];
  const bgm = bgmId ? BGM_OPTIONS.find((b) => b.id === bgmId) : null;

  const videoAdProps: VideoAdProps | null = useMemo(() => {
    if (!templateId || !aspectRatio || !tone) return null;
    return {
      templateId,
      inputs,
      tone,
      aspectRatio,
      bgmSrc: bgm?.file ?? null,
      withSFX,
      logoSrc,
      durationInFrames: 450,
      fps: 30,
    };
  }, [templateId, inputs, tone, aspectRatio, bgm, withSFX, logoSrc]);

  // Mark player ready after initial load
  useEffect(() => {
    if (!videoAdProps || initialLoadRef.current) return;
    const timer = setTimeout(() => {
      setPlayerReady(true);
      initialLoadRef.current = true;
    }, 800);
    return () => clearTimeout(timer);
  }, [videoAdProps]);

  if (!templateId || !videoAdProps) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: "var(--text-tertiary)", fontSize: 13 }}>
        テンプレートを選択してください
      </div>
    );
  }

  const Component = TEMPLATE_COMPONENTS[templateId];
  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: "#f43f5e", fontSize: 13 }}>
        テンプレートが見つかりません
      </div>
    );
  }

  const ratio = aspectRatio.width / aspectRatio.height;
  const isVertical = aspectRatio.height > aspectRatio.width;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div
        style={{
          width: isVertical ? `min(${ratio * 100}vh, 100%)` : "100%",
          maxWidth: isVertical ? "360px" : "100%",
          maxHeight: "calc(100vh - 180px)",
          aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}`,
          position: "relative",
        }}
      >
        {/* Shimmer loading placeholder */}
        {!playerReady && (
          <div
            className="shimmer"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 8,
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-tertiary)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.5 }}
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                読み込み中...
              </span>
            </div>
          </div>
        )}
        <Player
          ref={playerRef}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={Component as any}
          inputProps={videoAdProps as unknown as Record<string, unknown>}
          compositionWidth={aspectRatio.width}
          compositionHeight={aspectRatio.height}
          durationInFrames={450}
          fps={30}
          style={{
            width: "100%",
            height: "100%",
            opacity: playerReady ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          controls
          autoPlay
          loop
          acknowledgeRemotionLicense
          renderLoading={() => null}
        />
      </div>

      <div className="flex items-center gap-4 shrink-0" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
        <span>
          {aspectRatio.label} ({aspectRatio.width}x{aspectRatio.height})
        </span>
        <span>{tone.name}</span>
        {bgm && <span>BGM: {bgm.name}</span>}
      </div>
    </div>
  );
};
