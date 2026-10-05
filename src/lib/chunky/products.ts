import type { SampleId } from "./config";

export interface SampleProduct {
  id: SampleId;
  /** Full product name, as it should read in Shopify and on the page. */
  name: string;
  /** Two-line split for tight layouts. */
  nameLines: [string, string];
  shortName: string;
  weight: string;
  weightLong: string;
  type: string;
  /** One-word decision hook: what you get more of by picking this one. */
  hook: string;
  tagline: string;
  description: string;
  notes: [string, string, string];
  /** "Pick it if…" line for the comparison. */
  pickIf: string;
  finish: string;
  /** Transparent cutout, ~800px square. Swap the file to swap the art. */
  image: string;
  imageAlt: string;
}

export const samples: Record<SampleId, SampleProduct> = {
  runtz: {
    id: "runtz",
    name: "Jolly Rancher Runtz",
    nameLines: ["Jolly Rancher", "Runtz"],
    shortName: "Runtz",
    weight: "7g",
    weightLong: "7 grams",
    type: "Indica",
    hook: "More flower",
    tagline: "Jewel-cut, fruit-forward, double the weight.",
    description:
      "Dense, glossy buds with a nose that snaps like hard candy: bright and tart up front, then a deep, sweet finish. It's the bigger of the two samples, a full quarter of exotic indoor flower.",
    notes: ["Dark cherry", "Tart citrus", "Sweet finish"],
    pickIf: "You want the most flower.",
    finish: "Classic cured flower",
    image: "/images/chunky/jolly-rancher-runtz.webp",
    imageAlt: "Jolly Rancher Runtz THCa flower bud",
  },
  snowcaps: {
    id: "snowcaps",
    name: "Cotton Candy Toast Snowcaps",
    nameLines: ["Cotton Candy Toast", "Snowcaps"],
    shortName: "Snowcaps",
    weight: "3.5g",
    weightLong: "3.5 grams",
    type: "Hybrid",
    hook: "More frost",
    tagline: "Crystal-coated, airy sweet, finished toasty.",
    description:
      "Cotton Candy Toast flower rolled in THCa crystal until it looks freshly snowed on. Airy, spun-sugar sweetness up front with a warm, toasted finish. Less weight, a lot more shine: the frostiest thing on the menu.",
    notes: ["Spun sugar", "Vanilla cream", "Toasted finish"],
    pickIf: "You want the frostiest thing we make.",
    finish: "Rolled in THCa crystal",
    image: "/images/chunky/cotton-candy-toast-snowcaps.webp",
    imageAlt: "Cotton Candy Toast Snowcaps THCa flower coated in crystal",
  },
};

export const sampleOrder: SampleId[] = ["runtz", "snowcaps"];

export const trustPoints = [
  "Trusted since 2020",
  "10,000+ customers",
  "Lab tested, COA on every batch",
  "Grown indoors in California",
  "2018 Farm Bill compliant",
  "Discreet shipping",
] as const;
