import path from "path";
import { bundle } from "@remotion/bundler";
import {
  renderMedia,
  selectComposition,
  getCompositions,
} from "@remotion/renderer";

interface RenderOptions {
  templateId: string;
  aspectRatioId: string;
  toneId: string;
  inputs: Record<string, string>;
  bgmSrc: string | null;
  withSFX: boolean;
  logoSrc: string | null;
  outputPath?: string;
  onProgress?: (progress: number) => void;
}

export async function renderVideo(options: RenderOptions): Promise<string> {
  const {
    templateId,
    aspectRatioId,
    toneId,
    inputs,
    bgmSrc,
    withSFX,
    logoSrc,
    outputPath,
    onProgress,
  } = options;

  console.log(`[render] Starting render for Template${templateId}-${aspectRatioId}`);

  // Bundle the Remotion project
  const bundlePath = await bundle({
    entryPoint: path.resolve(process.cwd(), "src/index.ts"),
    onProgress: (progress) => {
      if (progress % 10 === 0) {
        console.log(`[render] Bundling: ${progress}%`);
      }
    },
  });

  console.log(`[render] Bundle complete: ${bundlePath}`);

  // Select the composition
  const compositionId = `Template${templateId}-${aspectRatioId}`;

  // Import tones dynamically
  const { TONES } = await import("../remotion/tones");
  const { ASPECT_RATIOS } = await import("../remotion/aspectRatios");

  const tone = TONES[toneId];
  const aspectRatio = ASPECT_RATIOS[aspectRatioId];

  if (!tone || !aspectRatio) {
    throw new Error(`Invalid tone "${toneId}" or aspect ratio "${aspectRatioId}"`);
  }

  const inputProps = {
    templateId,
    inputs,
    tone,
    aspectRatio,
    bgmSrc,
    withSFX,
    logoSrc,
    durationInFrames: 450,
    fps: 30,
  };

  const compositions = await getCompositions(bundlePath, { inputProps });
  const composition = compositions.find((c) => c.id === compositionId);

  if (!composition) {
    const available = compositions.map((c) => c.id).join(", ");
    throw new Error(
      `Composition "${compositionId}" not found. Available: ${available}`
    );
  }

  console.log(`[render] Rendering composition: ${compositionId}`);

  const finalOutputPath =
    outputPath ||
    path.resolve(
      process.cwd(),
      "out",
      `${compositionId}-${Date.now()}.mp4`
    );

  await renderMedia({
    composition,
    serveUrl: bundlePath,
    codec: "h264",
    outputLocation: finalOutputPath,
    inputProps,
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (pct % 10 === 0) {
        console.log(`[render] Rendering: ${pct}%`);
      }
      onProgress?.(progress);
    },
  });

  console.log(`[render] Complete! Output: ${finalOutputPath}`);
  return finalOutputPath;
}

// CLI mode
if (process.argv[1]?.includes("render-video")) {
  const args = process.argv.slice(2);
  const configPath = args[0];

  if (!configPath) {
    console.log("Usage: tsx src/render/render-video.ts <config.json>");
    console.log(
      "Config JSON: { templateId, aspectRatioId, toneId, inputs, bgmSrc, withSFX, logoSrc }"
    );
    process.exit(1);
  }

  import("fs")
    .then(async (fs) => {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      const output = await renderVideo(config);
      console.log(`Output: ${output}`);
    })
    .catch((err) => {
      console.error("Render failed:", err);
      process.exit(1);
    });
}
