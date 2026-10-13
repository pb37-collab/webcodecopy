#!/usr/bin/env node
/**
 * Downloads the Looper product renders used by the free-sample landers from
 * looperverse.com and saves small WebP copies in ./assets, which build.mjs
 * then embeds in each page. Safe to re-run.
 *
 *   NODE_USE_ENV_PROXY=1 node campaigns/looper-free-samples/fetch-assets.mjs
 *
 * (NODE_USE_ENV_PROXY is only needed behind an HTTPS proxy.)
 * The looperverse wordmark is not on the site as a file: source/looperverse-logo.webp
 * is the copy from the Looperverse Giveaway hand-off, resized here.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { products } from "./products.mjs";

const UPLOADS = "https://looperverse.com/wp-content/uploads/";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "assets");

/** Group renders are transparent PNGs; flavor shots are 1600px squares on a dark glow. */
const jobs = Object.values(products).flatMap((p) => [
  { from: p.groupImage, to: `${p.id}-group.webp`, width: 680, alpha: true },
  ...p.flavors.map((f) => ({ from: f.image, to: `${p.id}-${f.slug}.webp`, width: 440, crop: 0.05 })),
]);

async function save(img, to) {
  await img.toFile(path.join(OUT, to));
  const { size } = await fs.stat(path.join(OUT, to));
  console.log(`✓ ${to} (${Math.round(size / 1024)} KB)`);
}

await fs.mkdir(OUT, { recursive: true });
await save(
  sharp(path.join(HERE, "source/looperverse-logo.webp"))
    .resize({ width: 760 })
    .webp({ quality: 82, alphaQuality: 90 }),
  "looperverse-logo.webp",
);
for (const job of jobs) {
  const res = await fetch(UPLOADS + job.from);
  if (!res.ok) throw new Error(`${job.from}: HTTP ${res.status}`);
  let img = sharp(Buffer.from(await res.arrayBuffer()));
  // Group renders: cut the transparent margin so the products fill their box.
  if (job.alpha) img = sharp(await img.trim().toBuffer());
  if (job.crop) {
    // Trim the empty glow around the product so it reads at thumbnail size.
    const { width, height } = await img.metadata();
    const dx = Math.round(width * job.crop);
    const dy = Math.round(height * job.crop);
    img = img.extract({ left: dx, top: dy, width: width - 2 * dx, height: height - 2 * dy });
  }
  await save(
    img
      .resize({ width: job.width, withoutEnlargement: true })
      .webp(job.alpha ? { quality: 78, alphaQuality: 85 } : { quality: 74 }),
    job.to,
  );
}
