/**
 * DaVinci EQ Electric Quartz: Jacuzzi Collection giveaway — every number, date
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
  /** Transparent front view with the touchscreen (colorway showcase). */
  front: string;
  /** Full kit on white for this finish ("in the box"). */
  kit: string;
};

const MEDIA = "/giveaway/davinci-eq-jacuzzi";

const shots = (finish: ColorwayId) => ({
  cutout: `${MEDIA}/cutout-${finish}.webp`,
  front: `${MEDIA}/front-${finish}.webp`,
  kit: `${MEDIA}/kit-${finish}.webp`,
});

export const eqGiveaway = {
  slug: "davinci-eq-jacuzzi",
  brand: "DaVinci",
  sponsor: "DaVinci",
  product: "EQ Electric Quartz: Jacuzzi Collection",
  productShort: "EQ Jacuzzi Collection",
  productUrl: "https://davincivaporizer.com/products/eq-e-rig-electric-quartz-system",
  brandUrl: "https://davincivaporizer.com",
  /** Regular list price per kit (ARV), not a temporary sale price. */
  retailPrice: 549,
  winners: 5,
  /** ISO with offset. The countdown and form close at `endsAt`. */
  startsAt: "2026-10-12T09:00:00-04:00",
  endsAt: "2026-10-16T17:00:00-04:00",
  drawDate: "October 19, 2026",
  referralBonus: 3,
  minAge: 21,
  eligibility: "legal residents of the 50 United States and D.C.",

  colorways: [
    { id: "amethyst", name: "Amethyst", accent: "#a98bff", deep: "#1a1230", ...shots("amethyst") },
    { id: "sapphire", name: "Sapphire", accent: "#4fb3ff", deep: "#0b1a30", ...shots("sapphire") },
    { id: "gunmetal", name: "Gunmetal", accent: "#a7b1bf", deep: "#14171c", ...shots("gunmetal") },
    { id: "onyx", name: "Onyx", accent: "#e9e1cf", deep: "#121110", ...shots("onyx") },
  ] satisfies readonly Colorway[],

  /** Entry-capture settings (Klaviyo / webhook), editable on the host without a rebuild. */
  captureConfig: `${MEDIA}/config.json`,

  media: {
    /** Overhead macro of the quartz crucible (DaVinci homepage hero clip). */
    quartzMacro: { src: `${MEDIA}/quartz-macro.mp4`, poster: `${MEDIA}/quartz-macro.webp` },
    films: [
      { src: `${MEDIA}/film-product.mp4`, poster: `${MEDIA}/film-product.webp`, label: "The EQ Jacuzzi Collection" },
    ],
    closeup: `${MEDIA}/closeup-wide.webp`,
    /** `contain` for transparent cut-outs, `cover` for full-bleed photos. */
    gallery: [
      { src: `${MEDIA}/gallery-1.webp`, fit: "cover" },
      { src: `${MEDIA}/gallery-3.webp`, fit: "cover" },
      { src: `${MEDIA}/gallery-2.webp`, fit: "cover" },
      { src: `${MEDIA}/gallery-5.webp`, fit: "cover" },
      { src: `${MEDIA}/gallery-4.webp`, fit: "cover" },
      { src: `${MEDIA}/gallery-6.webp`, fit: "cover" },
    ] as const,
    /** PNG cut-out for the share card (the OG renderer can't read WebP). */
    ogProduct: `${MEDIA}/og-product.png`,
    /** Optional YouTube ID for an embedded video. Leave null to hide. */
    youtubeId: null as string | null,
  },

  /**
   * Bonus for every winner. Hemp-derived THCa can't ship to every state, so
   * the page and rules promise it only where the brand can legally deliver.
   */
  bonus: {
    size: "1g",
    name: "Gush Mintz Live Hash Rosin",
    brand: "Miracle of the Desert",
    url: "https://www.miracleofthedesert.com/collections/rosin/products/gush-mintz-live-hash-rosin-copy",
    /** 1g list price on the brand's store. */
    value: 39.99,
    /** Labeled jar (card) and the open jar from above (round inset). */
    image: `${MEDIA}/bonus-rosin.webp`,
    imageTop: `${MEDIA}/bonus-rosin-top.webp`,
    genetics: "Kush Mints × (F1 Durbs × Gushers)",
    flavor: "Sweet and sugary with ripe cherry, sour citrus and cool menthol, finishing on funky diesel.",
    tags: ["Solventless", "Hemp-derived THCa", "Indica-dominant 70/30", "1 gram"],
    restriction:
      "Ships only to states where Miracle of the Desert can legally deliver hemp-derived THCa. Winners elsewhere receive the EQ kit only.",
  },

  specs: [
    { value: "25s", label: "Heat-up time" },
    { value: "450–650°F", label: "Precision temperature" },
    { value: "60 ml", label: "Water in the Jacuzzi bubbler" },
    { value: "~50", label: "Sessions per charge, dual 3000 mAh" },
  ],

  features: [
    {
      title: "Touchscreen control",
      body: "Set an exact temperature or run one of four customizable Smart Paths from the screen on the base. No app, no pairing.",
    },
    {
      title: "Replaceable quartz",
      body: "A quartz crucible inside a quartz atomizer, with a zirconia mouthpiece and carb cap, so nothing gets between you and the flavor.",
    },
    {
      title: "Jacuzzi bubbler",
      body: "An expanded 60 ml water chamber gives vapor more time to cool before it reaches you, while keeping the flavor clear.",
    },
    {
      title: "The complete kit",
      body: "Brushed aluminum base, cleaning kit and a smell-resistant hardshell travel case, backed by a 2-year warranty.",
    },
  ],

  inTheBox: [
    "EQ electric quartz base with touchscreen",
    "Quartz atomizer",
    "Quartz crucible",
    "Glass Jacuzzi bubbler, 60 ml",
    "Zirconia carb cap",
    "Zirconia mouthpiece",
    "EQ tool with holder",
    "Cleaning swabs (9 pack) and 2 alcohol bottles",
    "USB-C to USB-C charging cable",
    "Smell-resistant travel case",
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
      a: "Five winners are drawn at random from all eligible entries after the giveaway closes and notified by email. Each winner gets one EQ Electric Quartz: Jacuzzi Collection kit.",
    },
    {
      q: "Does the colorway I pick matter?",
      a: "It tells us which finish to ship if you win. We'll match it while stock lasts.",
    },
    {
      q: "What's the bonus rosin?",
      a: "Every winner also gets 1g of Miracle of the Desert's Gush Mintz Live Hash Rosin, a solventless, hemp-derived THCa concentrate. It ships only to states where Miracle of the Desert can legally deliver; winners elsewhere receive the EQ kit only.",
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
