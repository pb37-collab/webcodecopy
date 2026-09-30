import type { Stat } from "@/components/primitives";

/**
 * Case-study index. Every `stats` value traces to a file listed in
 * docs/research/SOURCES.md — add a number here only with a source string.
 */
export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  tags: readonly string[];
  roles: readonly string[];
  stats: readonly Stat[];
  image: { src: string; alt: string; aspect: string };
};

const RESUME = "Parker_J_Beck_Resume_2026";

export const projects: readonly Project[] = [
  {
    slug: "weedporns",
    title: "@WeedPorns",
    eyebrow: "Owned media · X",
    summary:
      "The largest cannabis account on X, grown and run by Parker. Organic reach built in a category that can't buy ads, now sold as sponsored campaigns to cannabis brands.",
    tags: ["Organic growth", "Meme marketing", "Sponsored campaigns"],
    roles: ["social", "growth"],
    stats: [
      { value: "2.1B", label: "impressions in 2024", source: RESUME },
      { value: "783K", label: "new followers in 2024", source: RESUME },
      { value: "802M", label: "media views in 2024", source: RESUME },
      { value: "5%", label: "engagement rate, 2024", source: RESUME },
    ],
    image: { src: "/images/feed/post-01.webp", alt: "@WeedPorns top post", aspect: "1 / 1" },
  },
  {
    slug: "canna-connect",
    title: "Canna Connect Agency",
    eyebrow: "Co-founder · agency",
    summary:
      "A full-service social agency for cannabis and consumer brands. Organic-first playbooks, creator networks and giveaway mechanics in place of the paid media the category is locked out of.",
    tags: ["Influencer marketing", "Giveaways", "Client strategy"],
    roles: ["social", "growth", "head"],
    stats: [
      { value: "30+", label: "clients served", source: RESUME },
      { value: "$100K+", label: "client sales from organic posting in 3 months, hemp smokables DTC brand", source: RESUME },
      { value: "25M+", label: "impressions from one iPhone-shot X campaign", source: RESUME },
      { value: "50K+", label: "link clicks from that campaign", source: RESUME },
    ],
    image: { src: "/images/team/parker-beck.webp", alt: "Parker Beck", aspect: "4 / 5" },
  },
  {
    slug: "canna-connect-os",
    title: "Canna Connect OS",
    eyebrow: "Marketing engineering",
    summary:
      "The agency's client portal and admin platform (Next.js, Supabase, Vercel). Campaign tracking, CSV imports and KPI dashboards replaced hand-built reports, with row-level security keeping each client's data to that client.",
    tags: ["Next.js", "Supabase + RLS", "Automated reporting"],
    roles: ["engineering", "head"],
    stats: [],
    image: { src: "/images/proof/portal-screen.webp", alt: "Client portal, demo client", aspect: "16 / 10" },
  },
  {
    slug: "odor-max-growth",
    title: "Nano Odor Max / NanoGrow Max",
    eyebrow: "Paid traffic · testing",
    summary:
      "Parker's own DTC brands. AI-produced Meta creative bought cheap add-to-carts; the funnel data then showed where checkout was leaking, and that got fixed. A testing-and-diagnosis story, not a sales win.",
    tags: ["Meta Ads", "Landing pages", "Funnel diagnosis", "AI creative"],
    roles: ["growth", "engineering"],
    stats: [
      { value: "$0.87–$1.09", label: "cost per add-to-cart, Round 1", source: "Parker, Meta Ads Manager (per handoff brief)" },
      { value: "326", label: "add-to-carts in August", source: "Parker, Meta Ads Manager (per handoff brief)" },
      { value: "$1.53", label: "cost per add-to-cart in August", source: "Parker, Meta Ads Manager (per handoff brief)" },
      { value: "45", label: "statics scored before launch", source: "Ad_Content_Analysis_and_Rankings.md" },
    ],
    image: { src: "/content/nom/NOM_S7_torturetest.webp", alt: "Nano Odor Max 'torture test' ad", aspect: "4 / 5" },
  },
  {
    slug: "content-production",
    title: "AI content production",
    eyebrow: "Creative ops",
    summary:
      "A repeatable system for brand-safe AI stills, UGC-style video and virtual creators with consistent characters, built on Claude, Midjourney and Higgsfield.",
    tags: ["Higgsfield", "Midjourney", "Prompt systems", "AI creators"],
    roles: ["social", "head"],
    stats: [
      { value: "~60%", label: "less production time", source: RESUME },
      { value: "20", label: "stills in the NOM/NGM Round 2 slate", source: "Handoff brief" },
      { value: "8", label: "UGC videos across five AI creators, Round 2", source: "Handoff brief" },
    ],
    image: { src: "/content/nom/NOM_S6_couch.webp", alt: "Nano Odor Max 'couch' ad", aspect: "4 / 5" },
  },
  {
    slug: "midterms-map",
    title: "Midterms 2026, Cannabis Edition",
    eyebrow: "Data viz · thought leadership",
    summary:
      "An interactive D3.js map of federal candidates' cannabis-policy positions, with FEC data, ballot measures and DOJ rescheduling news. An original asset for the agency.",
    tags: ["D3.js", "FEC data", "Vercel"],
    roles: ["engineering", "head"],
    stats: [],
    image: { src: "/images/work/midterms-map.webp", alt: "Midterms 2026 cannabis map", aspect: "16 / 10" },
  },
  {
    slug: "cannaconnect-site",
    title: "cannaconnect.agency",
    eyebrow: "Web · publishing",
    summary:
      "The agency's website and its Insights publication, which gives the agency its point of view on cannabis marketing. It was part of what led to the High Times feature.",
    tags: ["Site build", "Editorial", "SEO"],
    roles: ["engineering", "head"],
    stats: [],
    image: { src: "/images/og.png", alt: "cannaconnect.agency", aspect: "1200 / 630" },
  },
];

export function getProject(slug: string): Project {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Unknown project: ${slug}`);
  return project;
}

export const roleFilters = [
  { key: "social", label: "Social & influencer" },
  { key: "growth", label: "Growth & performance" },
  { key: "engineering", label: "Marketing engineering" },
  { key: "head", label: "Head of marketing / creative ops" },
] as const;
