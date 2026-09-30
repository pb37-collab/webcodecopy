/**
 * Content gallery manifest. Files live in /public/content (web-optimized by
 * scripts/optimize-content.mjs) — never hotlinked from Higgsfield or Drive.
 *
 * Client work (Frosty Hemp Co, Chunky Academy, bud.com) stays out until the
 * client signs off: add it with `clientApproved: true` only then.
 */
export type ContentCategory = "ads" | "social" | "video" | "ai-creators";

export type ContentItem = {
  id: string;
  src: string;
  poster?: string;
  kind: "image" | "video";
  aspect: string;
  categories: readonly ContentCategory[];
  brand: string;
  format: string;
  round?: string;
  /** Only a result on record for this exact piece. Never estimated. */
  result?: string;
  aiProduced: boolean;
  winner?: boolean;
  clientApproved?: boolean;
};

export const categoryLabels: Record<ContentCategory, string> = {
  ads: "Ads",
  social: "Social posts",
  video: "Video",
  "ai-creators": "AI creators",
};

const nomStill = (id: string, round: string, winner = false): ContentItem => ({
  id,
  src: `/content/nom/${id}.webp`,
  kind: "image",
  aspect: "4 / 5",
  categories: ["ads"],
  brand: "Nano Odor Max",
  format: "Meta static ad, 4:5",
  round,
  aiProduced: true,
  winner,
});

const ngmStill = (id: string, round: string, winner = false): ContentItem => ({
  ...nomStill(id, round, winner),
  src: `/content/ngm/${id}.webp`,
  brand: "NanoGrow Max",
});

const ugc = (id: string, creator: string, round: string, winner = false): ContentItem => ({
  id,
  src: `/content/video/${id}.mp4`,
  poster: `/content/video/${id}.webp`,
  kind: "video",
  aspect: "9 / 16",
  categories: ["ads", "video", "ai-creators"],
  brand: "Nano Odor Max",
  format: `UGC-style video, 9:16, AI creator “${creator}”`,
  round,
  aiProduced: true,
  winner,
});

const feedPost = (n: number): ContentItem => ({
  id: `weedporns-post-${n}`,
  src: `/images/feed/post-${String(n).padStart(2, "0")}.webp`,
  kind: "image",
  aspect: "1 / 1",
  categories: ["social"],
  brand: "@WeedPorns",
  format: "X post",
  aiProduced: false,
});

export const content: readonly ContentItem[] = [
  // Proven winners first.
  nomStill("NOM_S7_torturetest", "Round 1", true),
  nomStill("NOM_S6_couch", "Round 1", true),
  ugc("NO_UGC_SOFIA_smoke", "Sofia", "Round 1", true),
  ngmStill("NGM_S6_value", "Round 1", true),
  ugc("NO_UGC_RYAN_skeptic", "Ryan", "Round 1"),
  // Round 4 NanoGrow Max stills.
  ngmStill("NGM_S9_value", "Round 4"),
  ngmStill("NGM_S10_absorb", "Round 4"),
  ngmStill("NGM_S11_freegift", "Round 4"),
  ngmStill("NGM_S12_results", "Round 4"),
  // Round 1 launch set.
  nomStill("NOM_S1_hotel", "Round 1"),
  nomStill("NOM_S2_parents", "Round 1"),
  nomStill("NOM_S5_car", "Round 1"),
  ngmStill("NGM_S1_beforeafter", "Round 1"),
  ngmStill("NGM_S2_HOA", "Round 1"),
  ngmStill("NGM_S3_gardener", "Round 1"),
  ngmStill("NGM_S4_testimonial", "Round 1"),
  ngmStill("NGM_S5_burnnever", "Round 1"),
  ngmStill("NGM_S7_veghero", "Round 1"),
  // @WeedPorns top posts (from cannaconnect.agency/feed/).
  ...[1, 2, 3, 4, 5, 6].map(feedPost),
];

export function captionFor(item: ContentItem): string {
  const parts = [item.brand, item.format, item.round].filter(Boolean);
  return parts.join(" · ");
}
