import React, { useState, useRef, useEffect } from "react";
import { useEditorStore } from "../store";
import { TEMPLATE_REGISTRY } from "../../templates/registry";
import { ToneSelector } from "../components/editor/ToneSelector";
import { InputForm } from "../components/editor/InputForm";
import { BGMSelector } from "../components/editor/BGMSelector";
import { LogoUploadInput } from "../components/editor/LogoUploadInput";
import { PreviewPanel } from "../components/editor/PreviewPanel";
import { ExportDialog } from "../components/export/ExportDialog";
import { AspectRatioSelector } from "../components/template-select/AspectRatioSelector";

export const EditorPage: React.FC = () => {
  const templateId = useEditorStore((s) => s.templateId);
  const withSFX = useEditorStore((s) => s.withSFX);
  const setWithSFX = useEditorStore((s) => s.setWithSFX);
  const reset = useEditorStore((s) => s.reset);
  const setExportProgress = useEditorStore((s) => s.setExportProgress);
  const showToast = useEditorStore((s) => s.showToast);
  const getRequiredFieldsStatus = useEditorStore((s) => s.getRequiredFieldsStatus);

  const [exportOpen, setExportOpen] = useState(false);
  const meta = templateId ? TEMPLATE_REGISTRY[templateId] : null;

  const handleBack = () => { showToast("テンプレート選択に戻りました", "info"); reset(); };
  const handleOpenExport = () => { setExportProgress(0); setExportOpen(true); };

  const { allFilled } = getRequiredFieldsStatus();

  return (
    <div className="flex" style={{ height: "calc(100vh - 56px)" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col"
        style={{
          width: 360,
          minWidth: 360,
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-subtle)",
          boxShadow: "2px 0 8px rgba(0,0,0,0.03)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-3"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 transition-colors"
            style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            戻る
          </button>
          {meta && (
            <span className="truncate" style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>
              {meta.name}
            </span>
          )}
        </div>

        {/* Step indicator */}
        <div
          className="flex items-center gap-1.5 px-5 py-2.5"
          style={{ borderBottom: "1px solid var(--border-subtle)", background: "#fafbfd" }}
        >
          <StepPill number={1} label="選択" done />
          <StepArrow />
          <StepPill number={2} label="入力" active />
          <StepArrow />
          <StepPill number={3} label="書き出し" />
        </div>

        {/* Scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
          <CollapsibleSection label="比率" defaultOpen>
            <AspectRatioSelector />
          </CollapsibleSection>

          <CollapsibleSection label="カラートーン" defaultOpen>
            <ToneSelector />
          </CollapsibleSection>

          <CollapsibleSection label="コンテンツ" defaultOpen>
            <InputForm />
          </CollapsibleSection>

          <CollapsibleSection label="BGM" defaultOpen>
            <BGMSelector />
          </CollapsibleSection>

          <div className="flex items-center justify-between px-1 py-1">
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>効果音 (SFX)</span>
            <button
              onClick={() => setWithSFX(!withSFX)}
              style={{
                width: 40,
                height: 22,
                borderRadius: 11,
                background: withSFX ? "var(--accent)" : "#d4d7e0",
                border: "none",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s",
              }}
            >
              <span
                className="absolute rounded-full bg-white"
                style={{
                  width: 18,
                  height: 18,
                  top: 2,
                  left: withSFX ? 20 : 2,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  transition: "left 0.2s ease",
                }}
              />
            </button>
          </div>

          <CollapsibleSection label="ロゴ" defaultOpen>
            <LogoUploadInput />
          </CollapsibleSection>
        </div>

        {/* Export button */}
        <div className="p-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <button
            onClick={handleOpenExport}
            disabled={!allFilled}
            className="w-full py-3 transition-all"
            style={{
              borderRadius: "var(--radius-md)",
              fontSize: 14,
              fontWeight: 800,
              color: "#fff",
              background: allFilled ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#d4d7e0",
              boxShadow: allFilled ? "0 4px 16px rgba(99, 102, 241, 0.3)" : "none",
              border: "none",
              cursor: allFilled ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
            }}
          >
            {allFilled ? "✨ 動画を書き出す" : "必須項目を入力してください"}
          </button>
        </div>
      </aside>

      {/* Preview area */}
      <div
        className="flex-1 relative"
        style={{
          background: "var(--bg-primary)",
          backgroundImage: "radial-gradient(circle at 50% 30%, rgba(99,102,241,0.04), transparent 60%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative h-full p-6">
          <PreviewPanel />
        </div>
      </div>

      <ExportDialog open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
};

/* Step pill */
const StepPill: React.FC<{ number: number; label: string; done?: boolean; active?: boolean }> = ({
  number, label, done, active,
}) => (
  <div
    className="flex items-center gap-1.5 px-2.5 py-1"
    style={{
      borderRadius: 20,
      background: done ? "#ecfdf5" : active ? "var(--accent-light)" : "transparent",
      transition: "all 0.2s",
    }}
  >
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 18,
        height: 18,
        borderRadius: "50%",
        fontSize: 10,
        fontWeight: 800,
        background: done ? "var(--success)" : active ? "var(--accent)" : "#e8eaef",
        color: done || active ? "#fff" : "var(--text-tertiary)",
      }}
    >
      {done ? "✓" : number}
    </span>
    <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: done ? "var(--success)" : active ? "var(--accent)" : "var(--text-tertiary)" }}>
      {label}
    </span>
  </div>
);

const StepArrow: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4d7e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* Collapsible section */
const CollapsibleSection: React.FC<{ label: string; children: React.ReactNode; defaultOpen?: boolean }> = ({
  label, children, defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
  }, [children]);

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-tertiary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s ease", flexShrink: 0 }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="section-label" style={{ cursor: "pointer" }}>{label}</span>
      </button>
      <div
        ref={contentRef}
        className={`collapsible-content ${open ? "expanded" : "collapsed"}`}
        style={{ maxHeight: open ? (contentHeight ?? 2000) : 0 }}
      >
        {children}
      </div>
    </div>
  );
};
