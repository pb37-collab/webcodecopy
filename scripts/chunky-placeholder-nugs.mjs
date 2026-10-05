#!/usr/bin/env node
/**
 * Generates stand-in product art for the Chunky Academy free-sample landers.
 *
 *   node scripts/chunky-placeholder-nugs.mjs
 *
 * Writes transparent 800x800 WebPs to public/images/chunky/. Replace them
 * with real product cutouts (same file names, transparent background) and
 * the pages pick them up with no code change. See docs/chunky/INTEGRATION.md.
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/images/chunky");
mkdirSync(outDir, { recursive: true });

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * A bud is a teardrop of overlapping calyx ellipses, with pistils and
 * trichome specks layered on top. `frost` (0-1) controls how much white
 * crystal coats it (snowcaps are rolled in THCa isolate).
 */
function nugSvg({ seed, calyx, pistil, frost, glow }) {
  const r = rng(seed);
  const cx = 500;
  const top = 150;
  const bottom = 860;
  const calyxes = [];
  const count = 420;
  for (let i = 0; i < count; i++) {
    const t = Math.pow(r(), 0.85);
    const y = top + t * (bottom - top);
    // Teardrop silhouette: narrow tip, full belly, rounded base.
    const belly = Math.sin(Math.min(1, t * 1.15) * Math.PI * 0.92);
    const halfW = 40 + belly * 235;
    const x = cx + (r() * 2 - 1) * halfW * 0.92;
    const rx = 20 + r() * 26;
    const ry = rx * (1.1 + r() * 0.5);
    const rot = (x - cx) * 0.12 + (r() * 2 - 1) * 35;
    const shade = Math.floor(r() * calyx.length);
    calyxes.push({ x, y, rx, ry, rot, shade, depth: y + r() * 40 });
  }
  calyxes.sort((a, b) => a.depth - b.depth);

  const pistils = [];
  for (let i = 0; i < 70; i++) {
    const c = calyxes[Math.floor(r() * calyxes.length)];
    const len = 18 + r() * 34;
    const a = (r() * 2 - 1) * Math.PI * 0.9 - Math.PI / 2;
    const x2 = c.x + Math.cos(a) * len;
    const y2 = c.y + Math.sin(a) * len;
    const qx = (c.x + x2) / 2 + (r() * 2 - 1) * 26;
    const qy = (c.y + y2) / 2 + (r() * 2 - 1) * 26;
    pistils.push(
      `<path d="M${c.x.toFixed(1)} ${c.y.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${pistil[i % pistil.length]}" stroke-width="${(1.6 + r() * 1.6).toFixed(1)}" stroke-linecap="round" fill="none" opacity="${(0.75 + r() * 0.25).toFixed(2)}"/>`,
    );
  }

  const specks = [];
  const speckCount = Math.round(1400 + frost * 5200);
  for (let i = 0; i < speckCount; i++) {
    const c = calyxes[Math.floor(r() * calyxes.length)];
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r());
    const x = c.x + Math.cos(a) * c.rx * d;
    const y = c.y + Math.sin(a) * c.ry * d;
    const size = 0.8 + r() * (1.2 + frost * 2.2);
    specks.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(1)}" fill="#fff" opacity="${(0.35 + r() * 0.6).toFixed(2)}"/>`,
    );
  }

  const gradients = calyx
    .map(
      ([hi, mid, lo], i) => `
    <radialGradient id="c${i}" cx="35%" cy="30%" r="75%">
      <stop offset="0" stop-color="${hi}"/>
      <stop offset="0.55" stop-color="${mid}"/>
      <stop offset="1" stop-color="${lo}"/>
    </radialGradient>`,
    )
    .join("");

  const body = calyxes
    .map(
      (c) =>
        `<ellipse cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" rx="${c.rx.toFixed(1)}" ry="${c.ry.toFixed(1)}" transform="rotate(${c.rot.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)})" fill="url(#c${c.shade})"/>`,
    )
    .join("");

  const calyxSil = calyxes
    .map(
      (c) =>
        `<ellipse cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" rx="${c.rx.toFixed(1)}" ry="${c.ry.toFixed(1)}" transform="rotate(${c.rot.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)})"/>`,
    )
    .join("");

  const frostCoat =
    frost > 0
      ? calyxes
          .filter((_, i) => i % 2 === 0)
          .map(
            (c) =>
              `<ellipse cx="${(c.x - c.rx * 0.15).toFixed(1)}" cy="${(c.y - c.ry * 0.2).toFixed(1)}" rx="${(c.rx * 0.85).toFixed(1)}" ry="${(c.ry * 0.7).toFixed(1)}" fill="url(#frost)" opacity="${(frost * 0.9).toFixed(2)}"/>`,
          )
          .join("")
      : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
  <defs>
    ${gradients}
    <radialGradient id="frost" cx="40%" cy="35%" r="70%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="1"/>
      <stop offset="0.6" stop-color="#f4f1ff" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#e6ecff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#000" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="rim" cx="50%" cy="50%" r="50%">
      <stop offset="0.6" stop-color="${glow}" stop-opacity="0"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0.35"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="0.5"/></filter>
    <linearGradient id="shade" x1="0.2" y1="0.1" x2="0.85" y2="0.95">
      <stop offset="0" stop-color="#fff" stop-opacity="0.10"/>
      <stop offset="0.5" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.55"/>
    </linearGradient>
    <clipPath id="sil">${calyxSil}</clipPath>
  </defs>
  <ellipse cx="500" cy="900" rx="300" ry="42" fill="url(#shadow)"/>
  <g filter="url(#soft)">${body}${frostCoat}${pistils.join("")}${specks.join("")}</g>
  <rect width="1000" height="1000" fill="url(#shade)" clip-path="url(#sil)"/>
</svg>`;
}

const nugs = [
  {
    file: "jolly-rancher-runtz.webp",
    seed: 7,
    frost: 0.12,
    glow: "#ff3d5a",
    calyx: [
      ["#9bb86c", "#4d6b2f", "#1b2a10"],
      ["#9a6bb0", "#56306e", "#1f0f2b"],
      ["#86a95e", "#3e5a26", "#15210c"],
      ["#b0607f", "#6a2440", "#2a0a18"],
      ["#7d9a52", "#33491d", "#111a08"],
    ],
    pistil: ["#e8763a", "#c9502a", "#f0a060"],
  },
  {
    file: "cotton-candy-toast-snowcaps.webp",
    seed: 35,
    frost: 1,
    glow: "#9fd4ff",
    calyx: [
      ["#a9c48e", "#59784a", "#22331a"],
      ["#cdb6d9", "#7f6a8c", "#33283b"],
      ["#98b67e", "#4f6d3d", "#1d2c15"],
    ],
    pistil: ["#f2a46b", "#e9c39b"],
  },
];

for (const n of nugs) {
  const svg = nugSvg(n);
  await sharp(Buffer.from(svg)).resize(800, 800).webp({ quality: 82, alphaQuality: 90 }).toFile(join(outDir, n.file));
  console.log("wrote", join("public/images/chunky", n.file));
}
