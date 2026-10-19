/**
 * Product data for the two Looper free-sample landers.
 *
 * Copy, flavor names, flavor notes and retail prices come from the live
 * product pages and WooCommerce store API on looperverse.com (Oct 2026):
 *   /product/duos-gummies/  (product 23659)
 *   /product/fusion-3g/     (product 23678)
 * Stock (Oct 2026): 110 free samples in total, 10 of each flavor, so 50 Duos
 * (5 flavors) and 60 Fusion (6 flavors). The pages never show a shipping price:
 * the customer sees the shipping cost for the first time at checkout.
 * Fusion strain types are printed on each flavor's box.
 *
 * `variationId` is the retail WooCommerce variation for that flavor, listed
 * for reference when the real free-sample checkout links are set up.
 */

/** States Looper ships to (same list as the Looperverse Giveaway, Sept 2026). */
export const SHIP_STATES = [
  "California", "Florida", "Georgia", "Illinois", "Indiana", "Kentucky", "Maine", "Maryland",
  "Massachusetts", "Missouri", "Nebraska", "New Jersey", "New Mexico", "North Carolina", "Ohio",
  "Pennsylvania", "Tennessee", "Texas", "Wisconsin", "Wyoming",
];

export const products = {
  duos: {
    id: "duos",
    slug: "free-duos",
    pageUrl: "https://looperverse.com/free-duos",
    productUrl: "https://looperverse.com/product/duos-gummies/",
    title: "Free Looper Duos Gummies | You Just Cover Shipping",
    description:
      "Claim a free 10-count jar of Looper Duos THC Gummies. Pick your flavor pair, drop your email and just cover shipping. 21+.",
    ogImage: "https://looperverse.com/wp-content/uploads/2026/09/DUOSRENDER-SET1-800px.png",
    groupImage: "2026/09/DUOSRENDER-SET1-800px.png",
    groupAlt: "Looper Duos Gummies jars in all five flavors",
    name: "Duos",
    nameSize: "duos",
    fullName: "Looper Duos Gummies",
    shortName: "Duos",
    unit: "jar",
    claimUnit: "Free Jar",
    stickyTitle: "Free Duos Jar",
    retail: 12.99,
    supply: 50,
    perFlavor: 10,
    eventName: "Claimed Free Sample",
    klaviyoListId: "Xx2i6v", // free-sample list for the edibles, from Looper (Oct 2026)
    sampleKey: "duos_gummies",
    welcome: "Your first jar's on us",
    marquee: ["Free Duos Jar", "You Just Cover Shipping", "25mg THC + 5mg CBD", "5 Flavor Pairs", "Only {supply} Jars", "21+ Only"],
    lede: [
      ["b", "A full 10-gummy jar, free."],
      ["t", " Pick your flavor pair, drop your email and "],
      ["m", "just cover the shipping."],
    ],
    stats: [
      ["$0", "Jar"],
      ["10", "Gummies"],
      ["5", "Flavor Pairs"],
    ],
    pickTitle: "Pick your pair",
    pickHint: "Two flavors in every gummy. Tap one to lock it in.",
    tagline: "Two flavors. One bite.",
    times: "×10",
    about:
      "Looper Duos puts two fruit flavors in every gummy. Each two-layer, sugar-coated gummy has 25mg THC and 5mg CBD, and every jar holds 10 gummies.",
    specs: [
      ["25mg THC + 5mg CBD", "in every gummy"],
      ["10 gummies", "per jar: 250mg THC + 50mg CBD"],
      ["Two flavor layers", "in every bite"],
      ["Lab tested", "QR code on every jar links to the batch results"],
    ],
    flavorsTitle: "Pick Your Pair//",
    flavorsSub: "5 flavor pairs",
    flavors: [
      { slug: "blue-razz-grape", name: "Blue Razz + Grape", note: "Tart blue raspberry paired with deep, rich grape.", glow: "#6b5cff", variationId: 23662, image: "2026/09/looper-duos-thc-gummies-blue-razz-grape-01-hero.jpg" },
      { slug: "green-apple-strawberry", name: "Green Apple + Strawberry", note: "Crisp green apple meets ripe, juicy strawberry.", glow: "#3ddc6a", variationId: 23668, image: "2026/09/looper-duos-thc-gummies-green-apple-strawberry-01-hero.jpg" },
      { slug: "lemon-tropical-blast", name: "Lemon + Tropical Blast", note: "Zesty lemon with mango and coconut notes.", glow: "#ffd23f", variationId: 23672, image: "2026/09/looper-duos-thc-gummies-lemon-tropical-blast-01-hero.jpg" },
      { slug: "pineapple-lemonade", name: "Pineapple + Lemonade", note: "Golden pineapple with fresh-squeezed lemonade.", glow: "#c6e83a", variationId: 23676, image: "2026/09/looper-duos-thc-gummies-pineapple-lemonade-01-hero.jpg" },
      { slug: "watermelon-punch", name: "Watermelon + Punch", note: "Juicy summer watermelon layered with bright, tangy fruit punch.", glow: "#ff4f9a", variationId: 23664, image: "2026/09/looper-duos-thc-gummies-watermelon-punch-01-hero.jpg" },
    ],
    steps: [
      ["Pick Your Pair", "Choose one of the five Duos flavor pairs. Every gummy has two flavor layers.", "= 1 Free Jar"],
      ["Drop Your Email", "Tell us where you are and where to send Looper news. Takes about 30 seconds.", "= 30 Seconds"],
      ["Check Out", "Your jar is $0 at checkout. You just cover shipping, and it's on the way.", "= $0 + Shipping"],
    ],
    faq: [
      ["Is it really free?", "Yes. The jar of Duos is $0. The only thing you pay is shipping, and you'll see the exact shipping cost at checkout before you pay anything."],
      ["What's in each gummy?", "25mg THC and 5mg CBD, with two flavor layers in every gummy. A jar holds 10 gummies, for 250mg THC and 50mg CBD in total. New to edibles? Start with part of a gummy and give it time."],
      ["How many can I claim?", "One free sample per person and household, and there are only {supply} jars in this drop ({perFlavor} of each flavor pair). Want more flavors after you try it? They're in the shop."],
      ["Where do you ship?", "We can ship to {stateCount} states: {states}. If yours isn't listed, we can't send a sample there yet."],
      ["Is it lab tested?", "Yes. Every jar has a QR code that links to its batch results, and you can see Looper's lab reports any time."],
    ],
    rulesItem:
      "One (1) free jar of Looper Duos Gummies (10 gummies, 25mg THC + 5mg CBD each) in the flavor pair you choose.",
  },

  fusion: {
    id: "fusion",
    slug: "free-fusion",
    pageUrl: "https://looperverse.com/free-fusion",
    productUrl: "https://looperverse.com/product/fusion-3g/",
    title: "Free Looper Fusion 3G Vape | You Just Cover Shipping",
    description:
      "Claim a free Looper Fusion 3G disposable. Pick from six fruit-forward flavors, drop your email and just cover shipping. 21+.",
    ogImage: "https://looperverse.com/wp-content/uploads/2026/09/FUSIONRENDER-GROUP1-1000px.png",
    groupImage: "2026/09/FUSIONRENDER-GROUP1-1000px.png",
    groupAlt: "Looper Fusion 3G disposable with boxes in all six flavors",
    name: "Fusion",
    nameSize: "fusion",
    fullName: "Looper Fusion 3G Disposable",
    shortName: "Fusion",
    unit: "vape",
    claimUnit: "Free Vape",
    stickyTitle: "Free Fusion 3G",
    retail: 25.99,
    supply: 60,
    perFlavor: 10,
    eventName: "Claimed Free Sample",
    klaviyoListId: "XPjk6T", // free-sample list for the vapes, from Looper (Oct 2026)
    sampleKey: "fusion_3g",
    welcome: "Your first 3G's on us",
    marquee: ["Free Fusion 3G", "You Just Cover Shipping", "THCA + Delta-8 + THCP", "6 Flavors", "Only {supply} Vapes", "21+ Only"],
    lede: [
      ["b", "A full 3-gram Fusion disposable, free."],
      ["t", " Pick your flavor, drop your email and "],
      ["m", "just cover the shipping."],
    ],
    stats: [
      ["$0", "Vape"],
      ["3G", "Disposable"],
      ["6", "Flavors"],
    ],
    pickTitle: "Pick your flavor",
    pickHint: "Six fruit-forward flavors. Tap one to lock it in.",
    tagline: "Six bold flavors. One Fusion blend.",
    times: "3G",
    about:
      "Looper Fusion brings THCA, Delta-8 and THCP together in one 3-gram disposable. Every Fusion is built around bright, fruit-forward flavor, and each one comes from the Looper lab with a Certificate of Analysis (COA).",
    specs: [
      ["3 grams", "in every device"],
      ["THCA + Delta-8 + THCP", "a rare cannabinoid blend in one device"],
      ["Ready out of the box", "pre-filled, pre-charged and draw-activated"],
      ["Lab tested", "third-party tested, with a COA for every batch"],
    ],
    flavorsTitle: "Pick Your Flavor//",
    flavorsSub: "6 fruit-forward flavors",
    flavors: [
      { slug: "hard-strawberry", name: "Hard Strawberry", strain: "Hybrid", note: "Ripe, jammy strawberry with a bold, juicy finish.", glow: "#ff3b6b", variationId: 23682, image: "2026/09/looper-fusion-3g-hard-strawberry-01-hero.jpg" },
      { slug: "watermelon-burst", name: "Watermelon Burst", strain: "Sativa", note: "Crisp summer watermelon, sweet and refreshing.", glow: "#3ddc6a", variationId: 23686, image: "2026/09/looper-fusion-3g-watermelon-burst-01-hero.jpg" },
      { slug: "berry-blast", name: "Berry Blast", strain: "Sativa", note: "A deep mix of dark berries with a tart edge.", glow: "#5b8cff", variationId: 23690, image: "2026/09/looper-fusion-3g-berry-blast-01-hero.jpg" },
      { slug: "apple-jelly", name: "Apple Jelly", strain: "Hybrid", note: "Sweet green apple with a smooth, candied finish.", glow: "#ff7a2f", variationId: 23680, image: "2026/09/looper-fusion-3g-apple-jelly-01-hero.jpg" },
      { slug: "twisted-lime", name: "Twisted Lime", strain: "Indica", note: "Zesty lime with a sharp citrus twist.", glow: "#2fd5c8", variationId: 23684, image: "2026/09/looper-fusion-3g-twisted-lime-01-hero.jpg" },
      { slug: "tropical-gummy", name: "Tropical Gummy", strain: "Hybrid", note: "Mango, pineapple and passion fruit in a sweet tropical mix.", glow: "#ffb02e", variationId: 23688, image: "2026/09/looper-fusion-3g-tropical-gummy-01-hero.jpg" },
    ],
    steps: [
      ["Pick Your Flavor", "Choose one of six Fusion flavors, from Hard Strawberry to Twisted Lime.", "= 1 Free Vape"],
      ["Drop Your Email", "Tell us where you are and where to send Looper news. Takes about 30 seconds.", "= 30 Seconds"],
      ["Check Out", "Your Fusion is $0 at checkout. You just cover shipping, and it's on the way.", "= $0 + Shipping"],
    ],
    faq: [
      ["Is it really free?", "Yes. The Fusion 3G is $0. The only thing you pay is shipping, and you'll see the exact shipping cost at checkout before you pay anything."],
      ["What's in a Fusion?", "3 grams of a THCA, Delta-8 and THCP blend in a pre-filled, pre-charged, draw-activated disposable. Each flavor is marked Sativa, Indica or Hybrid on the box. New to it? Start with one small pull and give it time."],
      ["How many can I claim?", "One free sample per person and household, and there are only {supply} vapes in this drop ({perFlavor} of each flavor). Want another flavor after you try it? They're in the shop."],
      ["Where do you ship?", "We can ship to {stateCount} states: {states}. If yours isn't listed, we can't send a sample there yet."],
      ["Is it lab tested?", "Yes. Fusion is third-party tested with a Certificate of Analysis for every batch, and you can see Looper's lab reports any time."],
    ],
    rulesItem:
      "One (1) free Looper Fusion 3G disposable vape in the flavor you choose.",
  },
};
