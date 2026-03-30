import React from "react";
import { TEMPLATE_REGISTRY } from "../../../templates/registry";
import { useEditorStore } from "../../store";
import { TemplateCard } from "./TemplateCard";
import type { TemplateId } from "../../../remotion/types";

export const TemplateGrid: React.FC = () => {
  const templateId = useEditorStore((s) => s.templateId);
  const setTemplate = useEditorStore((s) => s.setTemplate);
  const setInputs = useEditorStore((s) => s.setInputs);
  const setStep = useEditorStore((s) => s.setStep);

  const handleSelect = (id: string) => {
    const meta = TEMPLATE_REGISTRY[id];
    if (!meta) return;

    setTemplate(id as TemplateId);

    const defaults: Record<string, string> = {};
    for (const field of meta.fields) {
      defaults[field.key] = field.defaultValue ?? field.placeholder ?? "";
    }
    setInputs(defaults);
    setStep("edit");
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 14,
      }}
    >
      {Object.entries(TEMPLATE_REGISTRY).map(([id, meta], index) => (
        <TemplateCard
          key={id}
          templateId={id}
          metadata={meta}
          isSelected={templateId === id}
          onClick={() => handleSelect(id)}
          index={index}
        />
      ))}
    </div>
  );
};
