import React, { useCallback } from "react";
import { useEditorStore } from "./store";
import { TemplateSelectPage } from "./pages/TemplateSelectPage";
import { EditorPage } from "./pages/EditorPage";
import { Toast } from "./components/Toast";

export const App: React.FC = () => {
  const step = useEditorStore((s) => s.step);
  const toast = useEditorStore((s) => s.toast);
  const clearToast = useEditorStore((s) => s.clearToast);

  const handleCloseToast = useCallback(() => {
    clearToast();
  }, [clearToast]);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between h-14 px-6"
        style={{
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Friendly logo with gradient */}
          <div
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #a78bfa)",
              boxShadow: "0 2px 8px rgba(99, 102, 241, 0.25)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              RICHKA
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-tertiary)", marginLeft: 6 }}>
              動画エディター
            </span>
          </div>
        </div>

        {step === "edit" && (
          <div
            className="flex items-center gap-2 px-3 py-1.5"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--success)",
              background: "#ecfdf5",
              borderRadius: 20,
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--success)" }} />
            プレビュー中
          </div>
        )}
      </header>

      <main>
        <div key={step} className={step === "edit" ? "page-slide-in-right" : "page-slide-in-left"}>
          {step === "select" && <TemplateSelectPage />}
          {step === "edit" && <EditorPage />}
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={!!toast}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
};
