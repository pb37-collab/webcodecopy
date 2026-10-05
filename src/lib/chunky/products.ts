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
  /** Retail price of this size on chunkyacademy.com, shown struck through next to FREE. */
  retail: string;
  /** One-line decision hook: what you get more of by picking this one. */
  hook: string;
  tagline: string;
  description: string;
  notes: [string, string, string];
  /** "Pick it if…" line for the comparison. */
  pickIf: string;
  finish: string;
  /** Product page on chunkyacademy.com. */
  url: string;
  /** Transparent cutout of the real product photo. Regenerate with scripts/chunky-cutouts.mjs. */
  image: string;
  imageAlt: string;
}

// Facts, tasting notes and prices from the live product pages (October 2026).
export const samples: Record<SampleId, SampleProduct> = {
  runtz: {
    id: "runtz",
    name: "Jolly Rancher Runtz",
    nameLines: ["Jolly Rancher", "Runtz"],
    shortName: "Runtz",
    weight: "7g",
    weightLong: "7 grams",
    type: "Sativa Hybrid",
    retail: "$25.99",
    hook: "More flower",
    tagline: "Frosty, colorful buds. Double the weight.",
    description:
      "Frosty, colorful buds coated in sparkling sugar crystals, with a sweet, candy-like nose. A lively daytime hybrid, and the bigger of the two samples: a full 7 grams.",
    notes: ["Sweet candy", "Tropical fruit", "Berries"],
    pickIf: "You want the most flower.",
    finish: "Top-shelf indoor flower",
    url: "https://www.chunkyacademy.com/products/jolly-rancher-runtz-strain-thca",
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
    retail: "$19.99",
    hook: "More frost",
    tagline: "Rolled in THCa crystal. Dessert on the nose.",
    description:
      "Dense Cotton Candy Toast buds rolled in THCa crystal until they look snowed on. Spun sugar and berry candy up front, creamy vanilla underneath, and a smooth toasted finish.",
    notes: ["Spun sugar", "Creamy vanilla", "Toasted finish"],
    pickIf: "You want the frostiest thing on the menu.",
    finish: "Snow Cap: coated in THCa crystal",
    url: "https://www.chunkyacademy.com/products/cotton-candy-toast-strain-snow-cap",
    image: "/images/chunky/cotton-candy-toast-snowcaps.webp",
    imageAlt: "Cotton Candy Toast Snow Caps coated in THCa crystal",
  },
};

export const sampleOrder: SampleId[] = ["runtz", "snowcaps"];

/** The marquee from the current free-sample page, with Chunky's own icons. */
export const trustPoints = [
  { label: "Grown in Cali", icon: "grown-in-cali" },
  { label: "Lab tested", icon: "lab-tested" },
  { label: "Farm Bill compliant", icon: "federally-legal" },
  { label: "Fast shipping", icon: "fast-shipping" },
] as const;

/** Numbers as published on chunkyacademy.com. */
export const stats = [
  { value: "4.9/5", label: "Average rating" },
  { value: "10,000+", label: "Happy customers" },
  { value: "98%", label: "Would recommend" },
  { value: "2,500+", label: "5-star reviews" },
] as const;

export const brand = {
  site: "https://www.chunkyacademy.com",
  logo: "/images/chunky/chunky-academy-logo.png",
  support: "support@chunkyacademy.com",
  company: "Chunky Academy Inc.",
  location: "Mooresville, NC",
  socials: [
    {
      label: "Instagram",
      handle: "@chunkyacademy.backup",
      href: "https://www.instagram.com/chunkyacademy.backup",
    },
    {
      label: "TikTok",
      handle: "@chunkyacademyofficial",
      href: "https://www.tiktok.com/@chunkyacademyofficial",
    },
    { label: "X", handle: "@chunkyacademy", href: "https://x.com/chunkyacademy" },
  ],
  noShipStates:
    "Arkansas, Hawaii, Idaho, Kansas, Louisiana, Minnesota, Oklahoma, Oregon, Rhode Island, Utah, Vermont",
} as const;
