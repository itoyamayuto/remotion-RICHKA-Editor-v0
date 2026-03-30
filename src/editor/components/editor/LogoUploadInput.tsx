import React, { useRef } from "react";
import { useEditorStore } from "../../store";

export const LogoUploadInput: React.FC = () => {
  const logoSrc = useEditorStore((s) => s.logoSrc);
  const setLogo = useEditorStore((s) => s.setLogo);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogo(url);
  };

  const handleRemove = () => {
    if (logoSrc) URL.revokeObjectURL(logoSrc);
    setLogo(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
        ロゴ
      </h3>

      {logoSrc ? (
        <div className="relative group flex items-center gap-3 p-3 rounded-lg border border-zinc-700 bg-zinc-800/50">
          <img
            src={logoSrc}
            alt="ロゴ"
            className="w-12 h-12 object-contain rounded bg-white/10 p-1"
          />
          <span className="text-xs text-zinc-400 flex-1">
            ロゴが設定されています
          </span>
          <button
            onClick={handleRemove}
            className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
          >
            削除
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full py-3 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-800/30 text-zinc-500 text-xs flex items-center justify-center gap-2 hover:border-zinc-500 hover:text-zinc-400 transition-all"
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
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          ロゴ画像をアップロード
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
