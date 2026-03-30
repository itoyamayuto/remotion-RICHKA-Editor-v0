import React, { useRef } from "react";

interface MultiImageUploadInputProps {
  value: string; // JSON array string: '["blob:...", "blob:..."]'
  onChange: (jsonArrayStr: string) => void;
  label: string;
  maxImages?: number;
}

function parseImages(value: string): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Backwards compat: if it's a single blob URL string
    return value.startsWith("blob:") || value.startsWith("data:") || value.startsWith("http")
      ? [value]
      : [];
  }
}

export const MultiImageUploadInput: React.FC<MultiImageUploadInputProps> = ({
  value,
  onChange,
  label,
  maxImages = 5,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const images = parseImages(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      if (images.length + newUrls.length >= maxImages) break;
      newUrls.push(URL.createObjectURL(files[i]));
    }

    const updated = [...images, ...newUrls];
    onChange(JSON.stringify(updated));

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    const url = images[index];
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    const updated = images.filter((_, i) => i !== index);
    onChange(updated.length > 0 ? JSON.stringify(updated) : "");
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="flex flex-col gap-2">
      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="relative group aspect-square">
              <img
                src={url}
                alt={`${label} ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-zinc-900/80 text-zinc-300 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:text-white"
              >
                ✕
              </button>
              <span className="absolute bottom-1 left-1 text-[10px] bg-zinc-900/70 text-zinc-300 px-1.5 py-0.5 rounded">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      {canAddMore && (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full h-20 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-800/30 text-zinc-500 text-xs flex flex-col items-center justify-center gap-1 hover:border-zinc-500 hover:text-zinc-400 transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          画像を追加（{images.length}/{maxImages}）
        </button>
      )}

      {/* Counter when full */}
      {!canAddMore && (
        <p className="text-[10px] text-zinc-600 text-center">
          最大{maxImages}枚まで（{images.length}/{maxImages}）
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
