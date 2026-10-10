#!/usr/bin/env node
/**
 * Pulls DaVinci's EQ Electric Quartz: Jacuzzi Collection photos and EQ films
 * into /public so the giveaway page never hotlinks. Safe to re-run.
 *
 *   node scripts/fetch-davinci-eq-assets.mjs
 *
 * Needs network access to davincivaporizer.com, www.miracleofthedesert.com
 * and cdn.shopify.com, curl,
 * and ffmpeg on PATH for the videos (they're skipped without it).
 *
 * Photos come from the product listing, matched by file name so a reordered
 * gallery doesn't scramble them. Videos are the listing's product film and
 * the quartz-crucible clip from the homepage, re-encoded to small, silent,
 * web-ready MP4s with a poster frame each.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const ORIGIN = "https://davincivaporizer.com";
const HANDLE = "eq-e-rig-electric-quartz-system";
const OUT = path.join(process.cwd(), "public", "giveaway", "davinci-eq-jacuzzi");
// The store serves a bot check to bare clients; a normal browser header set passes.
const HEADERS = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36",
  accept: "application/json, text/javascript, text/html, */*",
  "accept-language": "en-US,en;q=0.9",
};

const FINISHES = ["Amethyst", "Sapphire", "Gunmetal", "Onyx"];

/** listing file-name fragment → output name and treatment */
const PHOTOS = [
  ...FINISHES.flatMap((f) => {
    const id = f.toLowerCase();
    return [
      // Transparent 3/4 cut-out (hero stage). Amethyst also feeds the share card.
      { match: `EQ_PDP_${f}_1000x1000_T_Side3Water`, out: `cutout-${id}`, width: 1000, png: id === "amethyst" ? "og-product" : null },
      // Transparent front view with the touchscreen (colorway showcase).
      { match: `EQ_PDP_${f}_1000x1000_T_FrontScreen`, out: `front-${id}`, width: 1000 },
      // Full kit on white, travel case and accessories ("in the box").
      { match: `EQ_PDP_${f}_Web_WB_InTheBox`, out: `kit-${id}`, width: 1200 },
    ];
  }),
  // Studio and lifestyle shots (gallery) and the final CTA backdrop.
  { match: "JacuzziCollection-Onyx-PDP-1", out: "gallery-1", width: 1200 },
  { match: "JacuzziCollection-Amethyst-PDP-4", out: "gallery-2", width: 1200 },
  { match: "DV_EQ-Exploded-WebSection_EQ-PDP-3", out: "gallery-3", width: 1200 },
  { match: "JacuzziCollection-Gunmetal-PDP-2", out: "gallery-4", width: 1200 },
  { match: "DV_EQ-Exploded-WebSection_EQ-PDP-2", out: "gallery-5", width: 1200 },
  { match: "JacuzziCollection-Sapphire-PDP-3", out: "gallery-6", width: 1200 },
  { match: "DV_EQ-Exploded-WebSection_EQ-PDP-4", out: "closeup-wide", width: 1920 },
];

const HOMEPAGE_VIDEOS = `${ORIGIN}/cdn/shop/videos/c/vp`;
const VIDEOS = [
  // The listing's own product film (feature callouts). Resolved from the product JSON.
  // Poster at 2.2s: the first callout has finished typing in.
  { fromProduct: true, out: "film-product", vf: "scale=-2:720", crf: 27, posterAt: 2.2 },
  // Homepage hero clip: overhead macro of the quartz crucible.
  { url: `${HOMEPAGE_VIDEOS}/11d4b6adc7634270aa84ba5dc9a850c4/11d4b6adc7634270aa84ba5dc9a850c4.SD-480p-1.2Mbps-92053698.mp4?v=0`, out: "quartz-macro", vf: "scale=480:480", crf: 24 },
];

/** Downloads with curl: the store's bot check rejects Node's fetch but not curl. */
async function get(url) {
  const full = url.startsWith("//") ? `https:${url}` : url;
  const headers = Object.entries(HEADERS).flatMap(([k, v]) => ["-H", `${k}: ${v}`]);
  try {
    return execFileSync("curl", ["-sSfL", "--max-time", "180", ...headers, full], { maxBuffer: 256 * 1024 * 1024 });
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
const media = product.media ?? [];
const sources = media.filter((m) => m.media_type === "image").map((m) => m.src);
console.log(`${product.title} · $${(product.price_max / 100).toFixed(0)} · ${sources.length} photos\n`);

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

// Bonus prize photos from Miracle of the Desert (also a Shopify store; the
// listing lives on www.miracleofthedesert.com). White-background shots, so
// each is cropped to the jar: the labeled front for the card, the open jar
// seen from above for the round inset.
const BONUS_PRODUCT = "https://www.miracleofthedesert.com/products/gush-mintz-live-hash-rosin-copy.js";
try {
  const bonus = JSON.parse((await get(BONUS_PRODUCT)).toString("utf8"));
  const imgs = (bonus.images ?? []).map((u) => (u.startsWith("//") ? `https:${u}` : u));
  const pickImg = (re) => imgs.find((u) => re.test(u.split("?")[0])) ?? imgs[0];
  const shots = [
    { src: pickImg(/-f\.\w+$/), out: "bonus-rosin", crop: 0.62 },
    { src: pickImg(/-t-1\.\w+$/), out: "bonus-rosin-top", crop: 0.72 },
  ];
  for (const shot of shots) {
    if (!shot.src) throw new Error("no product image");
    const buf = await get(shot.src);
    const { width, height } = await sharp(buf).metadata();
    const side = Math.round(Math.min(width, height) * shot.crop);
    await sharp(buf)
      .extract({ left: Math.round((width - side) / 2), top: Math.round((height - side) / 2), width: side, height: side })
      .resize({ width: 900, height: 900 })
      .webp({ quality: 86 })
      .toFile(path.join(OUT, `${shot.out}.webp`));
    console.log(`✓ ${shot.out}.webp (${bonus.title})`);
  }
} catch (err) {
  console.warn(`✗ bonus photos: ${err.message.split("\n")[0]} (the page shows its stand-in graphic)`);
}

// Videos
if (!hasFfmpeg()) {
  console.warn("\n✗ ffmpeg not found; skipping videos. Install it and re-run.");
} else {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "eq-video-"));
  for (const v of VIDEOS) {
    let url = v.url;
    if (v.fromProduct) {
      const film = media.find((m) => m.media_type === "video");
      const mp4s = (film?.sources ?? []).filter((s) => s.format === "mp4");
      url = mp4s.sort((a, b) => (b.height ?? 0) - (a.height ?? 0))[0]?.url;
      if (!url) {
        console.warn(`✗ ${v.out}: the listing has no product video`);
        continue;
      }
    }
    const src = path.join(tmp, `${v.out}-src.mp4`);
    const dest = path.join(OUT, `${v.out}.mp4`);
    await fs.writeFile(src, await get(url));
    execFileSync("ffmpeg", [
      "-v", "error", "-y", "-i", src, "-an",
      "-vf", `${v.vf},format=yuv420p`,
      "-c:v", "libx264", "-preset", "slow", "-crf", String(v.crf), "-profile:v", "high",
      "-movflags", "+faststart", dest,
    ]);
    const poster = path.join(tmp, `${v.out}.png`);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(v.posterAt ?? 1.2), "-i", dest, "-frames:v", "1", poster]);
    await sharp(poster).webp({ quality: 80 }).toFile(path.join(OUT, `${v.out}.webp`));
    const { size } = await fs.stat(dest);
    console.log(`✓ ${v.out}.mp4 (${(size / 1e6).toFixed(1)} MB) + poster`);
  }
  await fs.rm(tmp, { recursive: true, force: true });
}

console.log(`\nSaved to ${path.relative(process.cwd(), OUT)}/`);
