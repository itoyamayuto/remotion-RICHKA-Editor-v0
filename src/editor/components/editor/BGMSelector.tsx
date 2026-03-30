import React from "react";
import { useEditorStore } from "../../store";
import { BGM_OPTIONS } from "../../../templates/registry";

export const BGMSelector: React.FC = () => {
  const bgmId = useEditorStore((s) => s.bgmId);
  const setBgm = useEditorStore((s) => s.setBgm);

  return (
    <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto">
      <BgmItem isSelected={bgmId === null} onClick={() => setBgm(null)} icon="—" name="なし" mood="BGMなしで作成" />
      {BGM_OPTIONS.map((bgm) => (
        <BgmItem key={bgm.id} isSelected={bgmId === bgm.id} onClick={() => setBgm(bgm.id)} icon="♪" name={bgm.name} mood={bgm.mood} />
      ))}
    </div>
  );
};

const BgmItem: React.FC<{ isSelected: boolean; onClick: () => void; icon: string; name: string; mood: string }> = ({
  isSelected, onClick, icon, name, mood,
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2.5 text-left transition-all"
    style={{
      borderRadius: "var(--radius-sm)",
      border: isSelected ? "1px solid var(--accent)" : "1px solid transparent",
      background: isSelected ? "var(--accent-light)" : "transparent",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "var(--surface-hover)"; }}
    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        background: isSelected ? "var(--accent)" : "#f0f1f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        color: isSelected ? "#fff" : "var(--text-tertiary)",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? "var(--accent)" : "var(--text-primary)" }}>
        {name}
      </div>
      <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>
        {mood}
      </div>
    </div>
  </button>
);
