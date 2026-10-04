/**
 * DaVinci EQ Skyrise (Limited Edition: Quartz) giveaway — every number, date
 * and line of legal copy the page renders lives here.
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
  /** Product shot for this finish, inside /public. */
  image: string;
};

const MEDIA = "/giveaway/davinci-eq-skyrise";

export const eqGiveaway = {
  slug: "davinci-eq-skyrise",
  brand: "DaVinci",
  sponsor: "DaVinci",
  product: "EQ Skyrise Limited Edition: Quartz",
  productShort: "EQ Skyrise",
  productUrl: "https://davincivaporizer.com/products/eq-skyrise-limited-edition-quartz",
  brandUrl: "https://davincivaporizer.com",
  retailPrice: 399,
  winners: 5,
  /** ISO with offset. The countdown and form close at `endsAt`. */
  startsAt: "2026-10-05T09:00:00-04:00",
  endsAt: "2026-10-25T23:59:00-04:00",
  drawDate: "October 28, 2026",
  referralBonus: 3,
  minAge: 21,
  eligibility: "legal residents of the 50 United States and D.C.",

  colorways: [
    { id: "amethyst", name: "Amethyst", accent: "#a98bff", deep: "#1a1230", image: `${MEDIA}/colorway-amethyst.webp` },
    { id: "sapphire", name: "Sapphire", accent: "#5b8cff", deep: "#0d1733", image: `${MEDIA}/colorway-sapphire.webp` },
    { id: "gunmetal", name: "Gunmetal", accent: "#a7b1bf", deep: "#14171c", image: `${MEDIA}/colorway-gunmetal.webp` },
    { id: "onyx", name: "Onyx", accent: "#e9e1cf", deep: "#121110", image: `${MEDIA}/colorway-onyx.webp` },
  ] satisfies readonly Colorway[],

  media: {
    heroVideo: `${MEDIA}/hero.mp4`,
    heroPoster: `${MEDIA}/hero-poster.webp`,
    gallery: [1, 2, 3, 4, 5, 6].map((n) => `${MEDIA}/gallery-${n}.webp`),
    /** Optional YouTube ID for the "see it run" embed. Leave null to hide. */
    youtubeId: null as string | null,
  },

  specs: [
    { value: "25s", label: "Heat-up time" },
    { value: "450–650°F", label: "Precision temp range" },
    { value: "30 ml", label: "Water in the Skyrise bubbler" },
    { value: "2×", label: "High-capacity batteries" },
  ],

  features: [
    {
      title: "Touchscreen control",
      body: "Set temperature and run the whole session from the screen on the base. No app, no guesswork.",
    },
    {
      title: "Replaceable quartz",
      body: "A quartz crucible inside a quartz atomizer, so nothing but quartz touches your concentrate.",
    },
    {
      title: "Skyrise glass",
      body: "A tall glass bubbler holds 30 ml of water to cool every pull before it reaches you.",
    },
    {
      title: "Limited edition",
      body: "A finite release of the EQ electric quartz system. When this run is gone, it's gone.",
    },
  ],

  inTheBox: [
    "EQ base",
    "Quartz atomizer",
    "Quartz crucible",
    "Skyrise glass bubbler",
    "Silicone mouthpiece",
    "Silicone carb cap",
  ],

  /** Descriptive temperature zones for the interactive dial. */
  tempZones: [
    {
      min: 450,
      max: 519,
      name: "Flavor-forward",
      body: "The low end keeps terpenes front and center. Smooth, tasty pulls.",
    },
    {
      min: 520,
      max: 589,
      name: "Balanced",
      body: "Fuller vapor without giving up the flavor. The everyday setting.",
    },
    {
      min: 590,
      max: 650,
      name: "Cloud-chaser",
      body: "Top of the range for the densest, biggest pulls the EQ makes.",
    },
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
