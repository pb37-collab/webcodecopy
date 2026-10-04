/**
 * DaVinci EQ Skyrise (Limited Edition: Quartz) giveaway — every number, date
 * and line of legal copy the page renders lives here. Specs, price and Smart
 * Path ranges are from DaVinci's product listing.
 *
 * Media files are fetched into /public by `node scripts/fetch-davinci-eq-assets.mjs`.
 * Anything missing at build time falls back to the page's own motion graphics.
 */

export type ColorwayId = "amethyst" | "gunmetal" | "onyx" | "sapphire";

export type Colorway = {
  id: ColorwayId;
  name: string;
  /** Accent used for glows, rings and the CTA. */
  accent: string;
  /** Deep background tint behind the product. */
  deep: string;
  /** Transparent cut-out of this finish (hero stage), inside /public. */
  cutout: string;
  /** Studio shot of this finish (colorway showcase), inside /public. */
  studio: string;
};

const MEDIA = "/giveaway/davinci-eq-skyrise";

const shots = (finish: ColorwayId) => ({
  cutout: `${MEDIA}/cutout-${finish}.webp`,
  studio: `${MEDIA}/studio-${finish}.webp`,
});

export const eqGiveaway = {
  slug: "davinci-eq-skyrise",
  brand: "DaVinci",
  sponsor: "DaVinci",
  product: "EQ Skyrise Limited Edition: Quartz",
  productShort: "EQ Skyrise",
  productUrl: "https://davincivaporizer.com/products/eq-skyrise-limited-edition-quartz",
  brandUrl: "https://davincivaporizer.com",
  retailPrice: 349,
  winners: 5,
  /** ISO with offset. The countdown and form close at `endsAt`. */
  startsAt: "2026-10-05T09:00:00-04:00",
  endsAt: "2026-10-25T23:59:00-04:00",
  drawDate: "October 28, 2026",
  referralBonus: 3,
  /** The live entry count and odds stay hidden until this many people have entered. */
  showCountFrom: 100,
  minAge: 21,
  eligibility: "legal residents of the 50 United States and D.C.",

  colorways: [
    { id: "amethyst", name: "Amethyst", accent: "#a98bff", deep: "#1a1230", ...shots("amethyst") },
    { id: "sapphire", name: "Sapphire", accent: "#4fb3ff", deep: "#0b1a30", ...shots("sapphire") },
    { id: "gunmetal", name: "Gunmetal", accent: "#a7b1bf", deep: "#14171c", ...shots("gunmetal") },
    { id: "onyx", name: "Onyx", accent: "#e9e1cf", deep: "#121110", ...shots("onyx") },
  ] satisfies readonly Colorway[],

  media: {
    /** Overhead macro of the quartz crucible (DaVinci homepage hero clip). */
    quartzMacro: { src: `${MEDIA}/quartz-macro.mp4`, poster: `${MEDIA}/quartz-macro.webp` },
    films: [
      { src: `${MEDIA}/film-ecosystem.mp4`, poster: `${MEDIA}/film-ecosystem.webp`, label: "The EQ ecosystem" },
      { src: `${MEDIA}/film-build.mp4`, poster: `${MEDIA}/film-build.webp`, label: "Borosilicate glass, up close" },
    ],
    closeup: `${MEDIA}/closeup-wide.webp`,
    /** `contain` for transparent cut-outs, `cover` for full-bleed photos. */
    gallery: [
      { src: `${MEDIA}/gallery-1.webp`, fit: "cover" },
      { src: `${MEDIA}/gallery-3.webp`, fit: "contain" },
      { src: `${MEDIA}/gallery-2.webp`, fit: "cover" },
      { src: `${MEDIA}/gallery-5.webp`, fit: "contain" },
      { src: `${MEDIA}/gallery-4.webp`, fit: "cover" },
      { src: `${MEDIA}/gallery-6.webp`, fit: "contain" },
    ] as const,
    /** PNG cut-out for the share card (the OG renderer can't read WebP). */
    ogProduct: `${MEDIA}/og-product.png`,
    /** Optional YouTube ID for an embedded video. Leave null to hide. */
    youtubeId: null as string | null,
  },

  specs: [
    { value: "25s", label: "Heat-up time" },
    { value: "450–650°F", label: "Precision temperature" },
    { value: "30 ml", label: "Water in the Skyrise bubbler" },
    { value: "~50", label: "Sessions per charge, dual 3000 mAh" },
  ],

  features: [
    {
      title: "Touchscreen control",
      body: "Set an exact temperature or run one of four customizable Smart Paths from the screen on the base. No app, no pairing.",
    },
    {
      title: "Replaceable quartz",
      body: "A quartz crucible inside a quartz atomizer, so nothing but quartz touches your concentrate.",
    },
    {
      title: "Skyrise glass",
      body: "A dual-tower borosilicate bubbler cools every draw through 30 ml of water while keeping the flavor clear.",
    },
    {
      title: "Limited edition",
      body: "A finite release of the EQ electric quartz system, with an aluminum body and a 2-year warranty.",
    },
  ],

  inTheBox: [
    "EQ electric quartz base with touchscreen",
    "Quartz atomizer",
    "Quartz crucible",
    "Skyrise glass bubbler, 30 ml borosilicate",
    "Silicone mouthpiece",
    "Silicone carb cap",
  ],

  /** The EQ's four Smart Path presets (ranges from DaVinci's listing). */
  smartPaths: [
    { name: "Terpene", min: 480, max: 500, body: "The low end keeps terpenes front and center. Smooth, flavor-first pulls." },
    { name: "Flavor", min: 520, max: 540, body: "A touch warmer for fuller vapor without giving up taste. The everyday path." },
    { name: "Clouds", min: 560, max: 580, body: "More heat, denser vapor. For when you want to see it." },
    { name: "Atomic", min: 600, max: 620, body: "Near the top of the range for the biggest pulls the EQ makes." },
  ],

  faq: [
    {
      q: "Do I have to buy anything?",
      a: "No. No purchase necessary to enter or win, and buying something won't improve your odds.",
    },
    {
      q: "How are the winners picked?",
      a: "Five winners are drawn at random from all eligible entries after the giveaway closes and notified by email. Each winner gets one EQ Skyrise Limited Edition: Quartz.",
    },
    {
      q: "Does the colorway I pick matter?",
      a: "It tells us which finish to ship if you win. We'll match it while limited-edition stock lasts.",
    },
    {
      q: "How do bonus entries work?",
      a: "After you enter you get a personal link. Every friend who enters through it adds bonus entries to yours.",
    },
    {
      q: "Who can enter?",
      a: "You must be 21 or older and a legal resident of the 50 United States or D.C. One entry per person; duplicate emails are removed.",
    },
  ],
} as const;

export type EqGiveaway = typeof eqGiveaway;
