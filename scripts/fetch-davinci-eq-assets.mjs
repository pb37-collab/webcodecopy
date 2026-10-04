#!/usr/bin/env node
/**
 * Pulls the EQ Skyrise (Limited Edition: Quartz) product media from DaVinci's
 * Shopify store into /public so the giveaway page never hotlinks:
 *
 *   colorway-<finish>.webp  variant photo per finish (amethyst also as .png for the OG card)
 *   hero.mp4 + hero-poster.webp  first product video, if the listing has one
 *   gallery-1..6.webp       remaining product photos
 *
 * Safe to re-run. Needs network access to davincivaporizer.com and cdn.shopify.com.
 *
 *   node scripts/fetch-davinci-eq-assets.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ORIGIN = "https://davincivaporizer.com";
const HANDLE = "eq-skyrise-limited-edition-quartz";
const OUT = path.join(process.cwd(), "public", "giveaway", "davinci-eq-skyrise");
const FINISHES = ["amethyst", "sapphire", "gunmetal", "onyx"];
const UA = { "user-agent": "Mozilla/5.0 (asset fetch for giveaway page)" };

const abs = (u) => (u.startsWith("//") ? `https:${u}` : u);
const stripQuery = (u) => abs(u).split("?")[0];

async function get(url) {
  const res = await fetch(abs(url), { headers: UA });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function saveImage(url, name, { width = 1600, png = false } = {}) {
  const buf = await get(url);
  const img = sharp(buf).resize({ width, height: width, fit: "inside", withoutEnlargement: true });
  await img.clone().webp({ quality: 84 }).toFile(path.join(OUT, `${name}.webp`));
  if (png) await img.clone().png().toFile(path.join(OUT, `${name}.png`));
  console.log(`✓ ${name}.webp${png ? " (+ .png)" : ""}`);
}

await fs.mkdir(OUT, { recursive: true });
const product = JSON.parse((await get(`${ORIGIN}/products/${HANDLE}.js`)).toString("utf8"));
console.log(`${product.title}: ${product.variants.length} variants, ${product.media?.length ?? 0} media\n`);

// 1. One photo per finish, matched by variant name, then by image alt text.
const used = new Set();
for (const finish of FINISHES) {
  const variant = product.variants.find((v) =>
    [v.title, v.option1, v.option2, v.option3].some((o) => o && o.toLowerCase().includes(finish)),
  );
  let src = variant?.featured_image?.src ?? variant?.featured_media?.preview_image?.src;
  if (!src) {
    const byAlt = (product.media ?? []).find(
      (m) => m.media_type === "image" && (m.alt ?? "").toLowerCase().includes(finish),
    );
    src = byAlt?.src;
  }
  if (!src) {
    console.warn(`✗ no photo found for ${finish}; the page falls back to its motion graphic`);
    continue;
  }
  used.add(stripQuery(src));
  await saveImage(src, `colorway-${finish}`, { png: finish === FINISHES[0] });
}

// 2. Product video → hero.
const media = product.media ?? [];
const video = media.find((m) => m.media_type === "video");
if (video) {
  const mp4s = (video.sources ?? []).filter((s) => s.mime_type === "video/mp4" || s.format === "mp4");
  const pick = mp4s.filter((s) => (s.height ?? 0) <= 1080).sort((a, b) => (b.height ?? 0) - (a.height ?? 0))[0] ?? mp4s[0];
  if (pick) {
    await fs.writeFile(path.join(OUT, "hero.mp4"), await get(pick.url));
    console.log(`✓ hero.mp4 (${pick.width}×${pick.height})`);
  }
  if (video.preview_image?.src) await saveImage(video.preview_image.src, "hero-poster");
} else {
  console.log("· no native product video on the listing");
}
for (const ext of media.filter((m) => m.media_type === "external_video")) {
  console.log(`· external video: ${ext.host} ${ext.external_id} → set media.youtubeId in src/data/giveaways/davinci-eq-skyrise.ts`);
}

// 3. Everything else → gallery.
const rest = media
  .filter((m) => m.media_type === "image" && !used.has(stripQuery(m.src)))
  .slice(0, 6);
for (const [i, m] of rest.entries()) await saveImage(m.src, `gallery-${i + 1}`, { width: 1200 });

console.log(`\nSaved to ${path.relative(process.cwd(), OUT)}/. Check each colorway file shows the right finish.`);
