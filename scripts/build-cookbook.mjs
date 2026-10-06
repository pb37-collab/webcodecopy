#!/usr/bin/env node
/**
 * Turns the cookbook manuscript into what /cookbook/read needs:
 *
 *   node scripts/build-cookbook.mjs path/to/cookbook.docx   (or .pdf)
 *
 * 1. .docx → .pdf via LibreOffice (`soffice`), skipped for a .pdf input
 * 2. copies the PDF to public/cookbook/ as the download
 * 3. renders every page to public/cookbook/pages/page-NN.webp (pdftoppm + sharp)
 * 4. reads the manuscript's own "Contents" pages (title … page number) so
 *    the reader can jump straight to a recipe
 * 5. writes src/data/cookbook-book.json, which the reader imports
 *
 * Needs `soffice` (docx only), `pdftoppm` and `pdftotext` (poppler-utils) on PATH.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PDF_NAME = "parker-beck-cookbook.pdf";
const OUT_DIR = path.join(ROOT, "public/cookbook");
const PAGES_DIR = path.join(OUT_DIR, "pages");
const MANIFEST = path.join(ROOT, "src/data/cookbook-book.json");
const DPI = 200;

const input = process.argv[2];
if (!input || !fs.existsSync(input)) {
  console.error("Usage: node scripts/build-cookbook.mjs <cookbook.docx|cookbook.pdf>");
  process.exit(1);
}

const work = fs.mkdtempSync(path.join(os.tmpdir(), "cookbook-"));
let pdf = path.resolve(input);

if (path.extname(input).toLowerCase() === ".docx") {
  execFileSync("soffice", ["--headless", "--convert-to", "pdf", "--outdir", work, pdf], { stdio: "inherit" });
  pdf = path.join(work, `${path.basename(input, path.extname(input))}.pdf`);
}

fs.mkdirSync(PAGES_DIR, { recursive: true });
for (const f of fs.readdirSync(PAGES_DIR)) fs.rmSync(path.join(PAGES_DIR, f));
for (const f of fs.readdirSync(OUT_DIR)) if (f.endsWith(".pdf")) fs.rmSync(path.join(OUT_DIR, f));
fs.copyFileSync(pdf, path.join(OUT_DIR, PDF_NAME));

execFileSync("pdftoppm", ["-r", String(DPI), "-png", pdf, path.join(work, "p")], { stdio: "inherit" });
const pngs = fs
  .readdirSync(work)
  .filter((f) => /^p-\d+\.png$/.test(f))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

const pages = [];
for (const [i, png] of pngs.entries()) {
  const name = `page-${String(i + 1).padStart(2, "0")}.webp`;
  const info = await sharp(path.join(work, png)).webp({ quality: 86 }).toFile(path.join(PAGES_DIR, name));
  pages.push({ src: `/cookbook/pages/${name}`, width: info.width, height: info.height });
}

// Contents: any of the first pages headed "Contents" whose lines end in a
// page number, e.g. "Steak au poivre ........ 23".
const contents = [];
for (let n = 1; n <= Math.min(8, pages.length); n++) {
  const text = execFileSync("pdftotext", ["-layout", "-f", String(n), "-l", String(n), pdf, "-"], { encoding: "utf8" });
  if (!/^\s*contents\b/im.test(text)) continue;
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*(\S.*?\S)\s{2,}\.*\s*(\d{1,4})\s*$/);
    if (m && Number(m[2]) >= 1 && Number(m[2]) <= pages.length) contents.push({ title: m[1], page: Number(m[2]) });
  }
}

fs.writeFileSync(MANIFEST, `${JSON.stringify({ pdf: `/cookbook/${PDF_NAME}`, contents, pages }, null, 2)}\n`);
fs.rmSync(work, { recursive: true, force: true });
console.log(`Built ${pages.length} pages, ${contents.length} contents entries → ${path.relative(ROOT, MANIFEST)}`);
