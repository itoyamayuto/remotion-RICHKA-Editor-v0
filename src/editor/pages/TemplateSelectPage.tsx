import React from "react";
import { AspectRatioSelector } from "../components/template-select/AspectRatioSelector";
import { TemplateGrid } from "../components/template-select/TemplateGrid";

export const TemplateSelectPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 animate-in">
      {/* Friendly hero */}
      <div className="mb-8 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-4"
          style={{
            background: "var(--accent-light)",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            color: "var(--accent)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          かんたん3ステップで動画完成
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
          テンプレートを選んで始めよう
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          テンプレートを選択 → テキストや画像を入力 → 動画を書き出し
        </p>
      </div>

      {/* Aspect ratio */}
      <div className="flex justify-center mb-8">
        <AspectRatioSelector />
      </div>

      {/* Template grid */}
      <TemplateGrid />
    </div>
  );
};
