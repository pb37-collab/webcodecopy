import fs from "node:fs";
import path from "node:path";

/**
 * True when `/public<src>` exists at build time. Pages are statically
 * exported, so this runs once during `next build`; missing assets render as a
 * labelled placeholder instead of a broken image.
 */
export function hasPublicFile(src: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", src));
}
