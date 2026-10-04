#!/usr/bin/env node
/**
 * Pulls DaVinci's EQ Skyrise (Limited Edition: Quartz) photos and EQ films
 * into /public so the giveaway page never hotlinks. Safe to re-run.
 *
 *   node scripts/fetch-davinci-eq-assets.mjs
 *
 * Needs network access to davincivaporizer.com and cdn.shopify.com, curl,
 * and ffmpeg on PATH for the videos (they're skipped without it).
 *
 * Photos come from the product listing, matched by file name so a reordered
 * gallery doesn't scramble them. Videos are the EQ clips on the homepage,
 * re-encoded to small, silent, web-ready MP4s with a poster frame each.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const ORIGIN = "https://davincivaporizer.com";
const HANDLE = "eq-skyrise-limited-edition-quartz";
const OUT = path.join(process.cwd(), "public", "giveaway", "davinci-eq-skyrise");
// The store serves a bot check to bare clients; a normal browser header set passes.
const HEADERS = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36",
  accept: "application/json, text/javascript, text/html, */*",
  "accept-language": "en-US,en;q=0.9",
};

/** listing file-name fragment → output name and treatment */
const PHOTOS = [
  // Transparent cut-outs, one per finish (hero stage).
  { match: "H6_Sideview_Transparent_Skyrise_Cap_OFF", out: "cutout-amethyst", width: 1000, png: "og-product" },
  { match: "H6_BLUESideview_Transparent", out: "cutout-sapphire", width: 1000 },
  { match: "H6_GunmetalSideview_Transparent", out: "cutout-gunmetal", width: 1000 },
  { match: "H6_blackSideview_Transparent", out: "cutout-onyx", width: 1000 },
  // Studio shots per finish (colorway showcase).
  { match: "/Amethyst.png", out: "studio-amethyst", width: 1400 },
  { match: "/Sapphire.png", out: "studio-sapphire", width: 1400 },
  { match: "/Gunmetal.png", out: "studio-gunmetal", width: 1400 },
  { match: "/Onyx.png", out: "studio-onyx", width: 1400 },
  // Gallery + backgrounds.
  { match: "EQ-Gunmetal-Skyrise-Smoke", out: "gallery-1", width: 1000 },
  { match: "EQ_Skyrise_CC_ENV", out: "gallery-2", width: 1200 },
  { match: "PDP_3.4Turn_Water_Transparent", out: "gallery-3", width: 1000 },
  { match: "DV_Skyrise_CloseUp", out: "gallery-4", width: 1600 },
  { match: "H4_Screenview_Transparent", out: "gallery-5", width: 1000 },
  { match: "PDP_Sideview_Water_Transparent", out: "gallery-6", width: 1000 },
  { match: "DV_Skyrise_CloseUp", out: "closeup-wide", width: 1920 },
];

const VIDEO_BASE = `${ORIGIN}/cdn/shop/videos/c/vp`;
const VIDEOS = [
  // Homepage hero: "EQ Jacuzzi Collection • EQ Skyrise Limited" (macro of the quartz crucible).
  { id: "11d4b6adc7634270aa84ba5dc9a850c4", file: "SD-480p-1.2Mbps-92053698", out: "quartz-macro", vf: "scale=480:480", crf: 24 },
  // "The EQ Ecosystem" film.
  { id: "1a94ec64c8ab46fcad5c5f37442794b3", file: "HD-1080p-7.2Mbps-92043330", out: "film-ecosystem", vf: "scale=-2:720", crf: 27 },
  // "Build your own · EQ" film (glass close-ups).
  { id: "fb8d7c09b0224938898ebe291df2d754", file: "HD-1080p-7.2Mbps-92239796", out: "film-build", vf: "scale=-2:720", crf: 27 },
];

/** Downloads with curl: the store's bot check rejects Node's fetch but not curl. */
async function get(url) {
  const full = url.startsWith("//") ? `https:${url}` : url;
  const headers = Object.entries(HEADERS).flatMap(([k, v]) => ["-H", `${k}: ${v}`]);
  try {
    return execFileSync("curl", ["-sSfL", "--max-time", "120", ...headers, full], { maxBuffer: 256 * 1024 * 1024 });
  } catch (err) {
    throw new Error(`${full} → ${err.stderr?.toString().trim() || err.message}`);
  }
}

function hasFfmpeg() {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

await fs.mkdir(OUT, { recursive: true });

// Photos
const raw = (await get(`${ORIGIN}/products/${HANDLE}.js`)).toString("utf8");
if (raw.trimStart().startsWith("<")) throw new Error("Store returned an HTML bot check instead of product JSON.");
const product = JSON.parse(raw);
const sources = (product.media ?? []).filter((m) => m.media_type === "image").map((m) => m.src);
console.log(`${product.title} · $${(product.price / 100).toFixed(0)} · ${sources.length} photos\n`);

const cache = new Map();
for (const p of PHOTOS) {
  const src = sources.find((s) => s.split("?")[0].includes(p.match));
  if (!src) {
    console.warn(`✗ ${p.out}: no listing photo matches "${p.match}"`);
    continue;
  }
  if (!cache.has(src)) cache.set(src, await get(src));
  const img = sharp(cache.get(src)).resize({ width: p.width, height: p.width, fit: "inside", withoutEnlargement: true });
  await img.clone().webp({ quality: 84, alphaQuality: 90 }).toFile(path.join(OUT, `${p.out}.webp`));
  if (p.png) await img.clone().resize({ width: 800 }).png({ compressionLevel: 9 }).toFile(path.join(OUT, `${p.png}.png`));
  console.log(`✓ ${p.out}.webp${p.png ? ` (+ ${p.png}.png)` : ""}`);
}

// Videos
if (!hasFfmpeg()) {
  console.warn("\n✗ ffmpeg not found; skipping videos. Install it and re-run.");
} else {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "eq-video-"));
  for (const v of VIDEOS) {
    const src = path.join(tmp, `${v.out}-src.mp4`);
    const dest = path.join(OUT, `${v.out}.mp4`);
    await fs.writeFile(src, await get(`${VIDEO_BASE}/${v.id}/${v.id}.${v.file}.mp4?v=0`));
    execFileSync("ffmpeg", [
      "-v", "error", "-y", "-i", src, "-an",
      "-vf", `${v.vf},format=yuv420p`,
      "-c:v", "libx264", "-preset", "slow", "-crf", String(v.crf), "-profile:v", "high",
      "-movflags", "+faststart", dest,
    ]);
    const poster = path.join(tmp, `${v.out}.png`);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", "1.2", "-i", dest, "-frames:v", "1", poster]);
    await sharp(poster).webp({ quality: 80 }).toFile(path.join(OUT, `${v.out}.webp`));
    const { size } = await fs.stat(dest);
    console.log(`✓ ${v.out}.mp4 (${(size / 1e6).toFixed(1)} MB) + poster`);
  }
  await fs.rm(tmp, { recursive: true, force: true });
}

console.log(`\nSaved to ${path.relative(process.cwd(), OUT)}/`);
