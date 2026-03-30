import { create } from "zustand";
import type { TemplateId, AspectRatioId, ToneId } from "../remotion/types";
import { TEMPLATE_REGISTRY } from "../templates/registry";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

interface EditorState {
  templateId: TemplateId | null;
  aspectRatioId: AspectRatioId;
  toneId: ToneId;
  inputs: Record<string, string>;
  logoSrc: string | null;
  bgmId: string | null;
  withSFX: boolean;
  step: "select" | "edit";
  isExporting: boolean;
  exportProgress: number;
  toast: ToastState | null;

  setTemplate: (id: TemplateId) => void;
  setAspectRatio: (id: AspectRatioId) => void;
  setTone: (id: ToneId) => void;
  updateInput: (key: string, value: string) => void;
  setInputs: (inputs: Record<string, string>) => void;
  setLogo: (src: string | null) => void;
  setBgm: (id: string | null) => void;
  setWithSFX: (v: boolean) => void;
  setStep: (step: "select" | "edit") => void;
  setExporting: (v: boolean) => void;
  setExportProgress: (v: number) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  clearToast: () => void;
  getRequiredFieldsStatus: () => { allFilled: boolean; missingFields: string[] };
  reset: () => void;
}

const initialState = {
  templateId: null as TemplateId | null,
  aspectRatioId: "vertical" as AspectRatioId,
  toneId: "trust" as ToneId,
  inputs: {} as Record<string, string>,
  logoSrc: null as string | null,
  bgmId: null as string | null,
  withSFX: true,
  step: "select" as const,
  isExporting: false,
  exportProgress: 0,
  toast: null as ToastState | null,
};

export const useEditorStore = create<EditorState>((set, get) => ({
  ...initialState,

  setTemplate: (id) => set({ templateId: id }),
  setAspectRatio: (id) => set({ aspectRatioId: id }),
  setTone: (id) => set({ toneId: id }),
  updateInput: (key, value) =>
    set((state) => ({ inputs: { ...state.inputs, [key]: value } })),
  setInputs: (inputs) => set({ inputs }),
  setLogo: (src) => set({ logoSrc: src }),
  setBgm: (id) => set({ bgmId: id }),
  setWithSFX: (v) => set({ withSFX: v }),
  setStep: (step) => set({ step }),
  setExporting: (v) => set({ isExporting: v }),
  setExportProgress: (v) => set({ exportProgress: v }),
  showToast: (message, type = "info") => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
  getRequiredFieldsStatus: () => {
    const { templateId, inputs } = get();
    if (!templateId) return { allFilled: true, missingFields: [] };
    const meta = TEMPLATE_REGISTRY[templateId];
    if (!meta) return { allFilled: true, missingFields: [] };
    const missingFields: string[] = [];
    for (const field of meta.fields) {
      if (field.required && !(inputs[field.key]?.trim())) {
        missingFields.push(field.label);
      }
    }
    return { allFilled: missingFields.length === 0, missingFields };
  },
  reset: () => set(initialState),
}));
