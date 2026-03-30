import type { AspectRatio } from "./types";

export const ASPECT_RATIOS: Record<string, AspectRatio> = {
  vertical: {
    id: "vertical",
    name: "縦型",
    width: 1080,
    height: 1920,
    label: "9:16",
  },
  square: {
    id: "square",
    name: "正方形",
    width: 1080,
    height: 1080,
    label: "1:1",
  },
  horizontal: {
    id: "horizontal",
    name: "横型",
    width: 1920,
    height: 1080,
    label: "16:9",
  },
};
