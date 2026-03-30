import React from "react";
import type { TemplateMetadata } from "../../../remotion/types";

interface TemplateCardProps {
  templateId: string;
  metadata: TemplateMetadata;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  商品紹介: { bg: "#eef0ff", text: "#6366f1", dot: "#6366f1" },
  セール: { bg: "#fef2f2", text: "#ef4444", dot: "#ef4444" },
  アプリ: { bg: "#ecfeff", text: "#0891b2", dot: "#0891b2" },
  比較: { bg: "#fffbeb", text: "#d97706", dot: "#d97706" },
  訴求: { bg: "#ecfdf5", text: "#059669", dot: "#059669" },
  口コミ: { bg: "#faf5ff", text: "#9333ea", dot: "#9333ea" },
  ストーリー: { bg: "#fdf2f8", text: "#db2777", dot: "#db2777" },
  緊急: { bg: "#fef2f2", text: "#dc2626", dot: "#dc2626" },
  ブランド: { bg: "#f5f3ff", text: "#7c3aed", dot: "#7c3aed" },
};

export const TemplateCard: React.FC<TemplateCardProps> = ({
  templateId,
  metadata,
  isSelected,
  onClick,
  index,
}) => {
  const cat = CATEGORY_COLORS[metadata.category] ?? { bg: "#eef0ff", text: "#6366f1", dot: "#6366f1" };

  return (
    <button
      onClick={onClick}
      className="card-hover group relative flex flex-col text-left"
      style={{
        borderRadius: "var(--radius-lg)",
        border: isSelected ? `2px solid ${cat.dot}` : "1px solid var(--border-subtle)",
        background: "var(--bg-card)",
        padding: "20px 18px 16px",
        boxShadow: isSelected ? `0 4px 16px ${cat.dot}15` : "var(--shadow-sm)",
        cursor: "pointer",
        transition: "all 0.25s ease, transform 0.15s ease",
        animationDelay: `${index * 50}ms`,
        animationFillMode: "backwards",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
    >
      {/* Category badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: cat.text,
            background: cat.bg,
            padding: "3px 10px",
            borderRadius: 20,
          }}
        >
          {metadata.category}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: "var(--text-tertiary)",
            opacity: 0.5,
          }}
        >
          #{templateId}
        </span>
      </div>

      {/* Name */}
      <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.3 }}>
        {metadata.name}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          marginBottom: 14,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical" as const,
          overflow: "hidden",
        }}
      >
        {metadata.description}
      </p>

      {/* Footer */}
      <div
        className="mt-auto flex items-center gap-3 pt-3"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <FooterTag icon="◇" label={`${metadata.sceneCount}シーン`} />
        <FooterTag icon="◈" label={`${metadata.fields.length}入力`} />
        <FooterTag icon="▷" label="15秒" />
      </div>
    </button>
  );
};

const FooterTag: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <span
    style={{
      fontSize: 10,
      fontWeight: 600,
      color: "var(--text-tertiary)",
      display: "flex",
      alignItems: "center",
      gap: 3,
    }}
  >
    <span style={{ fontSize: 7, opacity: 0.6 }}>{icon}</span>
    {label}
  </span>
);
