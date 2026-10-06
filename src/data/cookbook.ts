/**
 * Every word, link and asset path on /cookbook lives here — edit this file,
 * not the components.
 *
 * Images: drop files into /public at the paths below. Anything missing
 * renders as a hand-painted Delft tile placeholder, so the page always looks
 * finished while assets are still being shot.
 *
 * Copy marked "placeholder" is a starting point to replace with the real
 * book's details.
 */

export type DelftMotif = "tulip" | "windmill" | "rosette" | "jug" | "wheat" | "fish" | "pear";

export const cookbook = {
  /** Working title — placeholder. */
  title: "The Blue & White Table",
  titleLead: "The Blue",
  titleTail: "& White Table",
  subtitle: "Recipes worth setting out the good plates for.",
  author: "Parker Beck",
  releaseLabel: "Releasing 2027",
  pitch:
    "A free digital cookbook of the dishes I cook on repeat — the weeknight saves, the Sunday projects and the bakes people ask me to bring back. Join the list and it lands in your inbox the moment it's done.",
  /** Optional finished cover art. Until it exists the cover is drawn in code. */
  coverImage: "/images/cookbook/cover.webp",
  stats: [
    { value: "40+", label: "recipes" },
    { value: "6", label: "chapters" },
    { value: "$0", label: "forever free" },
  ],
} as const;

export const substack = {
  /**
   * Your Substack publication URL, no trailing slash — e.g.
   * "https://parkercooks.substack.com". Placeholder until it's set.
   */
  url: "https://your-publication.substack.com",
  name: "The Blue & White Table",
  cadence: "One email a week. No spam, unsubscribe in one click.",
} as const;

export const socials = [
  { label: "Substack", href: substack.url },
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "TikTok", href: "https://tiktok.com/" },
  { label: "YouTube", href: "https://youtube.com/" },
] as const;

export const cookbookNav = [
  { href: "#the-book", label: "The Book" },
  { href: "#recipes", label: "Recipes" },
  { href: "#watch", label: "Watch" },
  { href: "#gallery", label: "Gallery" },
  { href: "#newsletter", label: "Newsletter" },
] as const;

/** Chapters — placeholder. */
export const chapters = [
  { title: "Slow Mornings", blurb: "Dutch babies, buns and the good eggs.", count: 7 },
  { title: "Small Plates", blurb: "Things to pick at while dinner happens.", count: 8 },
  { title: "Weeknight Saves", blurb: "Thirty minutes, one pan, real flavour.", count: 9 },
  { title: "The Sunday Table", blurb: "Braises and roasts that feed a crowd.", count: 6 },
  { title: "Bread & Bakes", blurb: "Loaves, tarts and the flaky stuff.", count: 6 },
  { title: "Sweet Endings", blurb: "Desserts that justify a second fork.", count: 6 },
] as const;

/** Featured recipes to hype the book — placeholder dishes. */
export const featuredRecipes: ReadonlyArray<{
  name: string;
  chapter: string;
  tease: string;
  time: string;
  serves: string;
  image: string;
  motif: DelftMotif;
}> = [
  {
    name: "Brown-Butter Dutch Baby",
    chapter: "Slow Mornings",
    tease: "Puffed, crackling edges and a pool of lemony brown butter in the middle.",
    time: "25 min",
    serves: "Serves 4",
    image: "/images/cookbook/recipe-dutch-baby.webp",
    motif: "windmill",
  },
  {
    name: "Sunday Braised Short Ribs",
    chapter: "The Sunday Table",
    tease: "Red wine, a whole head of garlic and three hours you don't have to watch.",
    time: "3 hr 30 min",
    serves: "Serves 6",
    image: "/images/cookbook/recipe-short-ribs.webp",
    motif: "jug",
  },
  {
    name: "Charred Leek & Gruyère Tart",
    chapter: "Bread & Bakes",
    tease: "All-butter pastry, sweet blackened leeks and an unreasonable amount of cheese.",
    time: "1 hr 15 min",
    serves: "Serves 6",
    image: "/images/cookbook/recipe-leek-tart.webp",
    motif: "wheat",
  },
  {
    name: "Cardamom Morning Buns",
    chapter: "Slow Mornings",
    tease: "Laminated, sticky, and worth setting an alarm for.",
    time: "4 hr",
    serves: "Makes 12",
    image: "/images/cookbook/recipe-morning-buns.webp",
    motif: "rosette",
  },
  {
    name: "Crispy Smashed Potatoes",
    chapter: "Small Plates",
    tease: "Shatter-crisp edges, green herb sauce, gone in four minutes.",
    time: "50 min",
    serves: "Serves 4",
    image: "/images/cookbook/recipe-smashed-potatoes.webp",
    motif: "tulip",
  },
  {
    name: "Stroopwafel Affogato",
    chapter: "Sweet Endings",
    tease: "A nod to Delft: caramel waffle, vanilla gelato, hot espresso poured on top.",
    time: "5 min",
    serves: "Serves 2",
    image: "/images/cookbook/recipe-affogato.webp",
    motif: "pear",
  },
];

/**
 * Videos. Use `youtubeId` for YouTube (click-to-load, no tracking until
 * played) or `src` + `poster` for a file in /public/videos.
 */
export const videos: ReadonlyArray<{
  title: string;
  description: string;
  duration: string;
  youtubeId?: string;
  src?: string;
  poster?: string;
}> = [
  {
    title: "Making the Dutch baby, start to finish",
    description: "The one-bowl batter, the screaming-hot pan, and the moment it puffs.",
    duration: "8:42",
  },
  {
    title: "Short ribs: the low & slow method",
    description: "How to get a deep sear and a sauce you'll want to drink.",
    duration: "12:10",
  },
  {
    title: "Laminating dough without fear",
    description: "Butter blocks, folds and the trick that makes it forgiving.",
    duration: "6:05",
  },
];

/** Best shots for the gallery. `span` makes a frame tall or wide on desktop. */
export const gallery: ReadonlyArray<{
  src: string;
  alt: string;
  motif: DelftMotif;
  span?: "tall" | "wide";
}> = [
  { src: "/images/cookbook/gallery-01.webp", alt: "Dutch baby fresh from the oven", motif: "windmill", span: "tall" },
  { src: "/images/cookbook/gallery-02.webp", alt: "Herb-flecked smashed potatoes", motif: "tulip" },
  { src: "/images/cookbook/gallery-03.webp", alt: "A table set for Sunday dinner", motif: "jug", span: "wide" },
  { src: "/images/cookbook/gallery-04.webp", alt: "Cardamom buns, glazed", motif: "rosette" },
  { src: "/images/cookbook/gallery-05.webp", alt: "Leek tart, sliced", motif: "tulip", span: "tall" },
  { src: "/images/cookbook/gallery-06.webp", alt: "Market haul on the counter", motif: "pear" },
  { src: "/images/cookbook/gallery-08.webp", alt: "Fresh bread, torn at the table", motif: "wheat", span: "wide" },
  { src: "/images/cookbook/gallery-07.webp", alt: "Pan-roasted fish with lemon", motif: "fish" },
];

/** What the Substack delivers — placeholder. */
export const newsletterFeatures: ReadonlyArray<{
  title: string;
  body: string;
  motif: DelftMotif;
}> = [
  {
    title: "A new recipe every week",
    body: "Tested, photographed and written so it works the first time — straight to your inbox.",
    motif: "jug",
  },
  {
    title: "Chapters before anyone else",
    body: "Subscribers read the book as it's written, and get the finished copy first.",
    motif: "tulip",
  },
  {
    title: "Behind the stove",
    body: "The failed attempts, the shopping lists and the short videos that didn't fit anywhere else.",
    motif: "windmill",
  },
  {
    title: "Ask the kitchen",
    body: "Reply with what you're cooking. The best questions get answered in the next issue.",
    motif: "rosette",
  },
];

export const authorNote = {
  heading: "Why I'm giving it away",
  portrait: "/images/cookbook/author.webp",
  paragraphs: [
    "Every recipe in this book has been cooked for friends more times than I can count. Most of them started as texts — \"how do you make that?\" — and eventually the answers got too long for a text.",
    "So I'm writing them down properly, and I'd rather you cook from it than pay for it. Join the Substack and the book is yours, plus a new recipe every week while I finish it.",
  ],
  signoff: "See you at the table,",
} as const;

export const faqs = [
  {
    q: "Is the cookbook really free?",
    a: "Yes. Enter your email, confirm your Substack subscription, and the full digital cookbook is yours — no card, no trial, no catch.",
  },
  {
    q: "When do I get it?",
    a: "The book is still being written and photographed. Everyone on the list gets the download link by email the day it's released, and sample chapters before then.",
  },
  {
    q: "What format is it in?",
    a: "A beautifully designed PDF that works on your phone, tablet or printed out and propped against the flour jar.",
  },
  {
    q: "What happens after I sign up?",
    a: "Substack sends a short email to confirm your address. After that you'll get one email a week — and you can unsubscribe in a single click.",
  },
] as const;
