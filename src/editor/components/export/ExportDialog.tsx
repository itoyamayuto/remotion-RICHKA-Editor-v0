import React, { useCallback, useRef, useState } from "react";
import { useEditorStore } from "../../store";
import { TEMPLATE_REGISTRY, BGM_OPTIONS } from "../../../templates/registry";
import { ASPECT_RATIOS } from "../../../remotion/aspectRatios";
import { TONES } from "../../../remotion/tones";

const RENDER_SERVER_URL = "http://localhost:3002";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onClose,
}) => {
  const templateId = useEditorStore((s) => s.templateId);
  const aspectRatioId = useEditorStore((s) => s.aspectRatioId);
  const toneId = useEditorStore((s) => s.toneId);
  const inputs = useEditorStore((s) => s.inputs);
  const bgmId = useEditorStore((s) => s.bgmId);
  const withSFX = useEditorStore((s) => s.withSFX);
  const logoSrc = useEditorStore((s) => s.logoSrc);
  const isExporting = useEditorStore((s) => s.isExporting);
  const exportProgress = useEditorStore((s) => s.exportProgress);
  const setExporting = useEditorStore((s) => s.setExporting);
  const setExportProgress = useEditorStore((s) => s.setExportProgress);

  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const meta = templateId ? TEMPLATE_REGISTRY[templateId] : null;
  const aspect = ASPECT_RATIOS[aspectRatioId];
  const tone = TONES[toneId];
  const bgm = bgmId ? BGM_OPTIONS.find((b) => b.id === bgmId) : null;

  // Check required fields
  const missingFields: string[] = [];
  if (meta) {
    for (const field of meta.fields) {
      if (field.required && !(inputs[field.key]?.trim())) {
        missingFields.push(field.label);
      }
    }
  }
  const hasMissing = missingFields.length > 0;

  const convertBlobToBase64 = async (
    blobUrl: string
  ): Promise<string | null> => {
    if (!blobUrl.startsWith("blob:")) return null;
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const handleExport = useCallback(async () => {
    setExporting(true);
    setExportProgress(0);
    setError(null);
    setDownloadUrl(null);

    try {
      // Convert blob URLs to base64 for server
      const images: Record<string, string> = {};
      for (const [key, value] of Object.entries(inputs)) {
        if (value?.startsWith("blob:")) {
          const base64 = await convertBlobToBase64(value);
          if (base64) images[key] = base64;
        }
      }

      let logoBase64 = null;
      if (logoSrc?.startsWith("blob:")) {
        logoBase64 = await convertBlobToBase64(logoSrc);
      }

      const response = await fetch(`${RENDER_SERVER_URL}/api/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          aspectRatioId,
          toneId,
          inputs,
          bgmSrc: bgm?.file ?? null,
          withSFX,
          logoSrc: logoBase64 || logoSrc,
          images,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setJobId(data.jobId);

      // Poll for progress
      pollRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(
            `${RENDER_SERVER_URL}/api/render/${data.jobId}`
          );
          const statusData = await statusRes.json();

          if (statusData.status === "rendering") {
            setExportProgress(Math.round(statusData.progress * 100));
          } else if (statusData.status === "complete") {
            setExportProgress(100);
            setExporting(false);
            setDownloadUrl(
              `${RENDER_SERVER_URL}/api/render/${data.jobId}/download`
            );
            if (pollRef.current) clearInterval(pollRef.current);
          } else if (statusData.status === "error") {
            setError(statusData.error || "書き出しに失敗しました");
            setExporting(false);
            if (pollRef.current) clearInterval(pollRef.current);
          }
        } catch {
          // Polling error, continue trying
        }
      }, 1000);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "サーバーに接続できません";
      setError(
        `${msg}\n\nレンダーサーバーを起動してください:\nnpm run render:server`
      );
      setExporting(false);
    }
  }, [
    templateId,
    aspectRatioId,
    toneId,
    inputs,
    bgm,
    withSFX,
    logoSrc,
    setExporting,
    setExportProgress,
  ]);

  const handleClose = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setJobId(null);
    setError(null);
    setDownloadUrl(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isExporting ? handleClose : undefined}
      />

      <div
        className="relative w-full max-w-md mx-4 rounded-xl shadow-2xl p-6"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-medium)",
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
          動画を書き出し
        </h2>

        {/* Missing fields warning */}
        {hasMissing && (
          <div
            style={{
              marginBottom: 16,
              padding: "10px 14px",
              borderRadius: 8,
              background: "rgba(244, 63, 94, 0.06)",
              border: "1px solid rgba(244, 63, 94, 0.2)",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: "#f43f5e", marginBottom: 4 }}>
              未入力の必須項目があります
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {missingFields.map((name, i) => (
                <span key={name}>
                  {i > 0 && "、"}
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div
          className="flex flex-col gap-2 mb-6 p-4 rounded-lg"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)" }}
        >
          <SummaryRow label="テンプレート" value={meta?.name ?? "-"} />
          <SummaryRow
            label="アスペクト比"
            value={`${aspect.label} (${aspect.width}x${aspect.height})`}
          />
          <SummaryRow label="トーン" value={tone.name} />
          <SummaryRow label="BGM" value={bgm?.name ?? "なし"} />
          <SummaryRow label="フォーマット" value="MP4 (H.264)" />
          <SummaryRow label="尺" value="15秒 / 30fps" />
        </div>

        {isExporting && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>
                {exportProgress < 5 ? "バンドル中..." : "書き出し中..."}
              </span>
              <span>{exportProgress}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm whitespace-pre-line">
            {error}
          </div>
        )}

        {downloadUrl && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
            <p className="text-green-400 text-sm mb-2">
              書き出しが完了しました
            </p>
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-500 transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              ダウンロード
            </a>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            disabled={isExporting}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-subtle)",
              cursor: isExporting ? "not-allowed" : "pointer",
              opacity: isExporting ? 0.5 : 1,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { if (!isExporting) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
          >
            閉じる
          </button>
          {!downloadUrl && (
            <button
              onClick={handleExport}
              disabled={isExporting || hasMissing}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                background: (isExporting || hasMissing) ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                cursor: (isExporting || hasMissing) ? "not-allowed" : "pointer",
                opacity: (isExporting || hasMissing) ? 0.5 : 1,
                transition: "all 0.2s ease",
                boxShadow: (isExporting || hasMissing) ? "none" : "0 4px 16px rgba(99, 102, 241, 0.3)",
              }}
            >
              {isExporting ? "書き出し中..." : "書き出し開始"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between" style={{ fontSize: 12 }}>
    <span style={{ color: "var(--text-tertiary)" }}>{label}</span>
    <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{value}</span>
  </div>
);
