import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { renderVideo } from "./render-video";

const app = express();
const PORT = parseInt(process.env.RENDER_PORT || "3002", 10);

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Ensure output and public/tmp directories exist
const outDir = path.resolve(process.cwd(), "out");
const publicDir = path.resolve(process.cwd(), "public");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Track active renders
const activeRenders = new Map<
  string,
  { progress: number; status: string; outputPath?: string; error?: string }
>();

// Start a render job
app.post("/api/render", async (req, res) => {
  const {
    templateId,
    aspectRatioId,
    toneId,
    inputs,
    bgmSrc,
    withSFX,
    logoSrc,
    images, // base64 encoded images from editor
  } = req.body;

  const jobId = `render-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Save base64 images to public/tmp/ so staticFile() can find them
  const processedInputs = { ...inputs };
  const tmpPublicDir = path.resolve(publicDir, "tmp", jobId);

  if (images && Object.keys(images).length > 0) {
    fs.mkdirSync(tmpPublicDir, { recursive: true });

    for (const [key, base64Data] of Object.entries(images)) {
      if (typeof base64Data === "string" && base64Data.startsWith("data:")) {
        const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
        if (matches) {
          const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
          const data = Buffer.from(matches[2], "base64");
          const filename = `${key}.${ext}`;
          const filepath = path.resolve(tmpPublicDir, filename);
          fs.writeFileSync(filepath, data);
          // Use relative path from public/ for staticFile()
          processedInputs[key] = `tmp/${jobId}/${filename}`;
        }
      }
    }
  }

  // Process logo - save to public/tmp/ as well
  let processedLogoSrc = logoSrc;
  if (logoSrc && logoSrc.startsWith("data:")) {
    if (!fs.existsSync(tmpPublicDir)) {
      fs.mkdirSync(tmpPublicDir, { recursive: true });
    }
    const matches = logoSrc.match(/^data:image\/(\w+);base64,(.+)$/);
    if (matches) {
      const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
      const data = Buffer.from(matches[2], "base64");
      const filename = `logo.${ext}`;
      const filepath = path.resolve(tmpPublicDir, filename);
      fs.writeFileSync(filepath, data);
      processedLogoSrc = `tmp/${jobId}/${filename}`;
    }
  }

  activeRenders.set(jobId, { progress: 0, status: "rendering" });

  res.json({ jobId, status: "started" });

  // Run render in background
  try {
    const outputPath = await renderVideo({
      templateId,
      aspectRatioId,
      toneId,
      inputs: processedInputs,
      bgmSrc,
      withSFX,
      logoSrc: processedLogoSrc,
      onProgress: (progress) => {
        activeRenders.set(jobId, {
          progress,
          status: "rendering",
        });
      },
    });

    activeRenders.set(jobId, {
      progress: 1,
      status: "complete",
      outputPath,
    });

    // Clean up temp files
    if (fs.existsSync(tmpPublicDir)) {
      fs.rmSync(tmpPublicDir, { recursive: true, force: true });
    }

    console.log(`[server] Render complete: ${outputPath}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    activeRenders.set(jobId, {
      progress: 0,
      status: "error",
      error: errorMessage,
    });
    console.error(`[server] Render failed:`, err);

    // Clean up temp files on error too
    if (fs.existsSync(tmpPublicDir)) {
      fs.rmSync(tmpPublicDir, { recursive: true, force: true });
    }
  }
});

// Check render progress
app.get("/api/render/:jobId", (req, res) => {
  const { jobId } = req.params;
  const job = activeRenders.get(jobId);

  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  res.json({ jobId, ...job });
});

// Download rendered video
app.get("/api/render/:jobId/download", (req, res) => {
  const { jobId } = req.params;
  const job = activeRenders.get(jobId);

  if (!job || job.status !== "complete" || !job.outputPath) {
    res.status(404).json({ error: "Video not ready" });
    return;
  }

  res.download(job.outputPath);
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", activeRenders: activeRenders.size });
});

app.listen(PORT, () => {
  console.log(`[server] RICHKA Render Server running on http://localhost:${PORT}`);
  console.log(`[server] POST /api/render - Start a render job`);
  console.log(`[server] GET /api/render/:jobId - Check progress`);
  console.log(`[server] GET /api/render/:jobId/download - Download video`);
});
