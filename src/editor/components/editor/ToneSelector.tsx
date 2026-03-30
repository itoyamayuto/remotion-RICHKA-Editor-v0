import React from "react";
import { useEditorStore } from "../../store";
import { TONES } from "../../../remotion/tones";
import type { ToneId } from "../../../remotion/types";

export const ToneSelector: React.FC = () => {
  const toneId = useEditorStore((s) => s.toneId);
  const setTone = useEditorStore((s) => s.setTone);

  return (
    <div className="grid grid-cols-3 gap-2">
      {Object.entries(TONES).map(([key, tone]) => {
        const isSelected = toneId === key;
        return (
          <button
            key={key}
            onClick={() => setTone(key as ToneId)}
            className="flex flex-col items-center gap-2 py-3 px-1.5 transition-all"
            style={{
              borderRadius: "var(--radius-md)",
              border: isSelected ? `2px solid ${tone.primary}` : "1px solid var(--border-subtle)",
              background: isSelected ? `${tone.primary}08` : "var(--bg-card)",
              cursor: "pointer",
              boxShadow: isSelected ? `0 2px 12px ${tone.primary}20` : "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${tone.gradientStart}, ${tone.gradientEnd})`,
                boxShadow: `0 2px 8px ${tone.primary}30`,
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: isSelected ? tone.primary : "var(--text-secondary)",
                lineHeight: 1.2,
                textAlign: "center",
              }}
            >
              {tone.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
