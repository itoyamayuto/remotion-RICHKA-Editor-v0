// === Tone/Color Theme ===
export type ToneId = "trust" | "pop" | "brand" | "nature" | "tech" | "luxury";
export type AspectRatioId = "vertical" | "square" | "horizontal";
export type TemplateId =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10";

export interface ToneTheme {
  id: ToneId;
  name: string;
  primary: string;
  accent: string;
  bgDark: string;
  bgLight: string;
  textPrimary: string;
  textSecondary: string;
  gradientStart: string;
  gradientEnd: string;
}

export interface AspectRatio {
  id: AspectRatioId;
  name: string;
  width: number;
  height: number;
  label: string;
}

// === Template Field System ===
export interface TemplateFieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "images" | "color" | "number";
  required: boolean;
  placeholder?: string;
  maxLength?: number;
  maxImages?: number;
  defaultValue?: string;
}

export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  nameEn: string;
  description: string;
  category: string;
  fields: TemplateFieldDef[];
  sceneCount: number;
}

export interface TemplateInputData {
  [key: string]: string;
}

// === BGM ===
export interface BGMOption {
  id: string;
  name: string;
  file: string;
  mood: string;
}

// === Video Ad Props (passed to template compositions) ===
export interface VideoAdProps {
  templateId: TemplateId;
  inputs: TemplateInputData;
  tone: ToneTheme;
  aspectRatio: AspectRatio;
  bgmSrc: string | null;
  withSFX: boolean;
  logoSrc: string | null;
  durationInFrames: number;
  fps: number;
}
