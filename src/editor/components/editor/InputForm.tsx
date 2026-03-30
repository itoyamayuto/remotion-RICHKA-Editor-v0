import React, { useState, useCallback } from "react";
import { useEditorStore } from "../../store";
import { TEMPLATE_REGISTRY } from "../../../templates/registry";
import { ImageUploadInput } from "./ImageUploadInput";
import { MultiImageUploadInput } from "./MultiImageUploadInput";

export const InputForm: React.FC = () => {
  const templateId = useEditorStore((s) => s.templateId);
  const inputs = useEditorStore((s) => s.inputs);
  const updateInput = useEditorStore((s) => s.updateInput);

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = useCallback((key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  if (!templateId) return null;
  const meta = TEMPLATE_REGISTRY[templateId];
  if (!meta) return null;

  const inputStyle = (showError: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "9px 12px",
    borderRadius: "var(--radius-sm)",
    background: "#f8f9fc",
    border: showError ? "1.5px solid var(--danger)" : "1px solid var(--border-subtle)",
    fontSize: 13,
    color: "var(--text-primary)",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
  });

  return (
    <div className="flex flex-col gap-4">
      {meta.fields.map((field) => {
        const maxImages = field.maxImages ?? 1;
        const value = inputs[field.key] ?? "";
        const isTouched = touched[field.key] ?? false;
        const showError = field.required && isTouched && !value.trim();

        return (
          <div key={field.key} className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)" }}>
              {field.label}
              {field.required && <span style={{ color: "var(--danger)", fontSize: 10 }}>*</span>}
              {field.maxLength && field.type !== "image" && field.type !== "images" && (
                <span className="ml-auto" style={{ fontSize: 10, fontWeight: 500, color: "var(--text-tertiary)" }}>
                  {value.length}/{field.maxLength}
                </span>
              )}
            </label>

            {field.type === "images" && maxImages > 1 ? (
              <MultiImageUploadInput value={value} onChange={(val) => updateInput(field.key, val)} label={field.label} maxImages={maxImages} />
            ) : field.type === "images" && maxImages === 1 ? (
              <ImageUploadInput value={value} onChange={(url) => updateInput(field.key, url)} label={field.label} />
            ) : field.type === "image" ? (
              <ImageUploadInput value={value} onChange={(url) => updateInput(field.key, url)} label={field.label} />
            ) : field.type === "textarea" ? (
              <textarea
                value={value}
                onChange={(e) => updateInput(field.key, e.target.value)}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                rows={2}
                style={{ ...inputStyle(showError), resize: "none" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-light)"; }}
                onBlur={(e) => { markTouched(field.key); e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = field.required && !e.currentTarget.value.trim() ? "var(--danger)" : "var(--border-subtle)"; }}
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => updateInput(field.key, e.target.value)}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                style={inputStyle(showError)}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-light)"; }}
                onBlur={(e) => { markTouched(field.key); e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = field.required && !e.currentTarget.value.trim() ? "var(--danger)" : "var(--border-subtle)"; }}
              />
            )}

            {showError && (
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--danger)" }}>
                必須項目です
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
