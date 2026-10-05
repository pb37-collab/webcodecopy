#!/usr/bin/env node
/**
 * Cuts Chunky Academy product photos (shot on white) into transparent WebPs
 * for the free-sample landers.
 *
 *   node scripts/chunky-cutouts.mjs
 *
 * Downloads the source photos from Chunky's Shopify CDN, removes the white
 * background by flood-filling from the image border (so white trichomes and
 * snowcap crystal inside the bud are kept), feathers the edge, trims, and
 * writes public/images/chunky/*.webp.
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/images/chunky");
mkdirSync(outDir, { recursive: true });

const CDN = "https://cdn.shopify.com/s/files/1/0597/2636/4746/files";

const jobs = [
  // Jolly Rancher Runtz product photo.
  { src: `${CDN}/B346-1.jpg`, out: "jolly-rancher-runtz.webp", tolerance: 18 },
  // Cotton Candy Toast Snow Cap product photo. Snowcaps are white, so the
  // background threshold is tighter.
  {
    src: `${CDN}/ChatGPT_Image_Jun_3_2026_04_15_13_PM_1.png`,
    out: "cotton-candy-toast-snowcaps.webp",
    tolerance: 13,
    // The pile sits on a soft grey contact shadow; clear it from the lower part.
    shadow: { fromRow: 0.62, tolerance: 42 },
  },
];

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function cutout({ src, out, tolerance, shadow }) {
  const { data, info } = await sharp(await fetchBuffer(src))
    .resize(1200, 1200, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const px = (i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]];
  const isBg = (i) => {
    const [r, g, b] = px(i);
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    return 255 - min <= tolerance * 1.6 && max - min <= tolerance;
  };

  // Flood fill from every border pixel that looks like background.
  const bg = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const i = stack.pop();
    if (bg[i] || !isBg(i)) continue;
    bg[i] = 1;
    const x = i % w;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (i >= w) stack.push(i - w);
    if (i < w * (h - 1)) stack.push(i + w);
  }

  if (shadow) {
    // Second fill from the background already found, accepting light, grey
    // shadow pixels in the lower part of the frame only.
    const isShadow = (i) => {
      const [r, g, b] = px(i);
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      return i / w >= h * shadow.fromRow && 255 - min <= shadow.tolerance && max - min <= 12;
    };
    const queue = [];
    for (let i = 0; i < w * h; i++) if (bg[i]) queue.push(i);
    while (queue.length) {
      const i = queue.pop();
      const x = i % w;
      for (const n of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
        if (n < 0 || n >= w * h || bg[n] || !isShadow(n)) continue;
        bg[n] = 1;
        queue.push(n);
      }
    }
  }

  // Mask: 255 = keep. Blur slightly for a soft edge.
  const mask = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) mask[i] = bg[i] ? 0 : 255;
  const soft = await sharp(mask, { raw: { width: w, height: h, channels: 1 } })
    .blur(1.2)
    .extractChannel(0)
    .raw()
    .toBuffer();
  for (let i = 0; i < w * h; i++) data[i * 4 + 3] = soft[i];

  const clear = { r: 0, g: 0, b: 0, alpha: 0 };
  const trimmed = await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toBuffer()
    .then((png) => sharp(png).trim({ threshold: 1 }).png().toBuffer());
  // sharp applies one resize per pipeline, so fit and pad in separate passes.
  const fitted = await sharp(trimmed).resize(740, 740, { fit: "contain", background: clear }).png().toBuffer();
  await sharp(fitted)
    .extend({ top: 30, bottom: 30, left: 30, right: 30, background: clear })
    .webp({ quality: 84, alphaQuality: 90 })
    .toFile(join(outDir, out));
  console.log("wrote", join("public/images/chunky", out));
}

for (const job of jobs) await cutout(job);
