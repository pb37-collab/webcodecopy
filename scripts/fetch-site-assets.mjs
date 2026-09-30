#!/usr/bin/env node
/**
 * Downloads the images v1 hotlinked from cannaconnect.agency into /public so
 * the portfolio keeps working if that site changes. Converts to WebP
 * (max 1600px) where the source is a raster. Safe to re-run.
 *
 *   node scripts/fetch-site-assets.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ORIGIN = "https://www.cannaconnect.agency";
const PUBLIC = path.join(process.cwd(), "public");

const assets = [
  { from: "/team/parker-beck.webp", to: "images/team/parker-beck.webp" },
  { from: "/proof/portal-screen.webp", to: "images/proof/portal-screen.webp" },
  { from: "/og.png", to: "images/og.png", keepFormat: true },
  ...Array.from({ length: 9 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return { from: `/feed/post-${n}.webp`, to: `images/feed/post-${n}.webp`, optional: true };
  }),
];

let ok = 0;
for (const a of assets) {
  const res = await fetch(ORIGIN + a.from);
  if (!res.ok) {
    if (!a.optional) console.warn(`✗ ${a.from} → HTTP ${res.status}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const out = path.join(PUBLIC, a.to);
  await fs.mkdir(path.dirname(out), { recursive: true });
  if (a.keepFormat) {
    await fs.writeFile(out, buf);
  } else {
    await sharp(buf)
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);
  }
  ok++;
  console.log(`✓ ${a.to}`);
}
console.log(`\n${ok} files saved under public/.`);
