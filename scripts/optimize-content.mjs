#!/usr/bin/env node
/**
 * Turns raw exports (Higgsfield/Drive PNGs and MP4s) into web-optimized files
 * for the content gallery:
 *   - images → WebP, max 1600px, into public/content/<folder>/
 *   - video  → H.264 MP4 (target < ~8MB) + WebP poster frame, into public/content/video/
 *
 * Usage:
 *   node scripts/optimize-content.mjs <source-dir>
 *
 * The source dir should mirror the target layout, e.g.
 *   <source-dir>/nom/NOM_S7_torturetest.png
 *   <source-dir>/ngm/NGM_S6_value.png
 *   <source-dir>/video/NO_UGC_SOFIA_smoke.mp4
 *   <source-dir>/before-after/before.png
 * File names (minus extension) must match the ids in src/data/content.ts.
 *
 * Video needs ffmpeg on PATH. Never point this at client work that hasn't
 * been approved for public use.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/optimize-content.mjs <source-dir>");
  process.exit(1);
}
const OUT = path.join(process.cwd(), "public", "content");
const IMAGE = /\.(png|jpe?g|webp)$/i;
const VIDEO = /\.(mp4|mov|webm)$/i;
const MAX_VIDEO_BYTES = 8 * 1024 * 1024;

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function encodeVideo(input, output, crf) {
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-i", input,
    "-vf", "scale='min(1080,iw)':-2",
    "-c:v", "libx264", "-preset", "slow", "-crf", String(crf),
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    "-c:a", "aac", "-b:a", "96k", output,
  ]);
}

for await (const file of walk(src)) {
  const rel = path.relative(src, file);
  const base = rel.replace(/\.[^.]+$/, "");
  if (IMAGE.test(file)) {
    const out = path.join(OUT, `${base}.webp`);
    await fs.mkdir(path.dirname(out), { recursive: true });
    await sharp(file)
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);
    console.log(`✓ image  ${path.relative(process.cwd(), out)}`);
  } else if (VIDEO.test(file)) {
    const out = path.join(OUT, `${base}.mp4`);
    const poster = path.join(OUT, `${base}.webp`);
    await fs.mkdir(path.dirname(out), { recursive: true });
    let crf = 23;
    encodeVideo(file, out, crf);
    while ((await fs.stat(out)).size > MAX_VIDEO_BYTES && crf < 35) {
      crf += 3;
      encodeVideo(file, out, crf);
    }
    const tmpPng = `${out}.poster.png`;
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", "0.5", "-i", file, "-frames:v", "1", tmpPng]);
    await sharp(tmpPng).resize({ width: 1080, withoutEnlargement: true }).webp({ quality: 80 }).toFile(poster);
    await fs.rm(tmpPng);
    const mb = ((await fs.stat(out)).size / 1024 / 1024).toFixed(1);
    console.log(`✓ video  ${path.relative(process.cwd(), out)} (${mb} MB, crf ${crf}) + poster`);
  }
}
