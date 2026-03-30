import React from "react";
import { useEditorStore } from "../../store";
import { ASPECT_RATIOS } from "../../../remotion/aspectRatios";
import type { AspectRatioId } from "../../../remotion/types";

const RATIO_ICONS: Record<string, { w: number; h: number }> = {
  vertical: { w: 9, h: 16 },
  horizontal: { w: 16, h: 9 },
  square: { w: 12, h: 12 },
};

export const AspectRatioSelector: React.FC = () => {
  const aspectRatioId = useEditorStore((s) => s.aspectRatioId);
  const setAspectRatio = useEditorStore((s) => s.setAspectRatio);

  return (
    <div
      className="inline-flex items-center gap-1 p-1"
      style={{
        background: "#f0f1f5",
        borderRadius: "var(--radius-md)",
      }}
    >
      {Object.entries(ASPECT_RATIOS).map(([key, ratio]) => {
        const isSelected = aspectRatioId === key;
        const icon = RATIO_ICONS[key] ?? { w: 12, h: 12 };
        const scale = 14 / Math.max(icon.w, icon.h);

        return (
          <button
            key={key}
            onClick={() => setAspectRatio(key as AspectRatioId)}
            className="flex items-center gap-2 px-4 py-2 transition-all"
            style={{
              borderRadius: 10,
              background: isSelected ? "#fff" : "transparent",
              boxShadow: isSelected ? "var(--shadow-md)" : "none",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                width: icon.w * scale,
                height: icon.h * scale,
                borderRadius: 2,
                background: isSelected ? "var(--accent)" : "#b0b3c0",
                transition: "background 0.2s",
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              {ratio.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
