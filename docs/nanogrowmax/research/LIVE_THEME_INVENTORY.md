# NanoGrow Max: Live Theme Inventory

Audit date: 2026-10-07. Read-only. No mutations were run against the store.

| Item | Value |
|---|---|
| Theme | `Copy of rename-odor-max-grow-max-8-24`, role **MAIN**, `gid://shopify/OnlineStoreTheme/188058468655` |
| Theme asset CDN path | `//nanogrowmax.com/cdn/shop/t/29/assets/<file>` (confirmed from the live homepage HTML) |
| Shop files CDN | `https://cdn.shopify.com/s/files/1/0979/0269/0607/files/<file>` (alias: `//nanogrowmax.com/cdn/shop/files/<file>`) |
| Raw theme files (verbatim) | `/tmp/claude-0/-home-user-webcodecopy/71b03b33-2841-5394-823d-fe40e96a1da4/scratchpad/live-theme/` (`layout/`, `config/`, `templates/`, `sections/`, `snippets/`) |
| Architecture | A custom dark theme, not Dawn. `layout/theme.liquid` hard-codes the announcement bar, header, `cart-drawer` snippet, footer and `pick-your-prize` sections. Templates are mostly `.liquid` files that call static `{% section %}` tags, so section settings live in `config/settings_data.json` under `current.sections.<name>`. |

> **The most important rendering rule.** Most sections define blocks (bullets, stats, reviews, FAQs and so on) only in schema `presets`. The live `settings_data.json` stores **no blocks** for `hp-hero`, `hp-problem-solution`, `ngm-problem-solution`, `ngm-reviews`, `hp-reviews`, `ngm-cta`, `cb-cta` or `cb-faq`. On the live site:
> * Sections with a hard-coded `{% else %}` fallback show that **fallback** copy: hp-hero stats, ngm-reviews, hp-reviews and cb-faq.
> * Sections without a fallback render **empty lists**. The problem/solution bullet lists and stat cards are blank, and the ngm-cta and cb-cta feature and trust lists are blank.
>
> Preset copy is listed separately below and marked **NOT LIVE**.

---

## 1. What renders where (in order)

### 1.1 Global wrapper (`layout/theme.liquid`), every page except the LP layouts
1. `announcement-bar`
2. `header` (sticky)
3. `<main>{{ content_for_layout }}</main>`
4. `snippet cart-drawer`, plus an inline cart-progress script
5. `footer`
6. `pick-your-prize` (spin-to-win email popup, enabled site-wide)

Also in `<head>`: Google Fonts Inter 400–900, `theme.css`, `theme.js` (defer), `content_for_header` (app embeds), `snippet structured-data`, **LogRocket** (`https://cdn.logrocket.io/LogRocket.min.js`, synchronous, `init('ewpppb/ngm')`) and **Contentsquare** (`https://t.contentsquare.net/uxa/c8eee6e1d6d21.js`, defer).

### 1.2 Product → template assignment (from the Admin API)

| Product | Handle | templateSuffix | Effective template |
|---|---|---|---|
| Grow Max (bundle) | `nanogrow-max` | `nanogrow-max` | `product.nanogrow-max.liquid` |
| RootMAX | `rootmax` | `rootmax` | `product.rootmax.liquid` |
| GroMax | `growmax` | *(empty)* | `product.liquid` → **else branch**, because the handle contains neither "odor" nor "nanogrow" |
| Nano Odor Max | `nano-odor-max` | `canna-bust` | `product.canna-bust.liquid` |
| 100% OFF shipping fee (BOGOS) | `shipping_discount-180408-sca_clone_freegift` | `sca-fg-product` (**the template file does not exist**, so it falls back to `product.liquid`, which matches "else") | tagged `bogos-gift` |
| 🎁 Nano Odor Max (100% off) (BOGOS) | `nano-odor-max-sca_clone_freegift` | `sca-fg-product` (missing) → `product.liquid` → handle contains "odor" → CB stack | tagged `bogos-gift` |

**Grow Max bundle PDP** (`/products/nanogrow-max`, `product.nanogrow-max.liquid`):
1. `ngm-product-hero` (with a mobile sticky ATC)
2. `ngm-upsell` (hidden unless a GroMax or RootMax radio is selected)
3. `ngm-usda`
4. `growth-results-direct` (full-width image)
5. `ngm-problem-solution`
6. `ngm-comparison`
7. `works-anywhere-direct` (full-width image)
8. `ngm-reviews`
9. `judgeme-reviews`
10. `ngm-cta`

**RootMAX PDP** (`product.rootmax.liquid`): the same stack **without `ngm-usda`**. `ngm-upsell` starts visible here (`aria-hidden="false"` when `product.handle == 'rootmax'`), but its JS immediately re-hides it because the pre-checked radio is the bundle.

**GroMax PDP** (`product.liquid`, else branch): `ngm-product-hero` → `growth-results-direct` → `ngm-comparison` → `ngm-reviews` → `judgeme-reviews`. There is **no** upsell, USDA, problem/solution, works-anywhere or CTA.

**Nano Odor Max PDP** (`/products/nano-odor-max`, `product.canna-bust.liquid`):
1. `cb-product-hero` (with a mobile sticky ATC)
2. `cb-odor-removal-direct` (image)
3. `cb-ugc-video`
4. `cb-comparison`
5. `cb-reviews`
6. `judgeme-reviews`
7. `cb-faq`
8. `cb-cta`

Note that the product has metafield `seo.hidden = 1`. It is hidden from storefront search and sitemap, and `collection.liquid` skips it, so it **does not appear on /collections/all**.

**Homepage** (`templates/index.liquid`):
1. `hp-hero`
2. `growth-results-direct`
3. `hp-problem-solution`
4. `hp-how-it-works`
5. `works-anywhere-direct`
6. `hp-reviews`
7. `hp-cta`

`hp-benefits` and `hp-use-cases` exist but are **not rendered anywhere**. `ngm-benefits`, `ngm-use-cases` and `cb-before-after` are also **unused**.

**Cart** (`templates/cart.liquid`): a full-page fallback with a line list, qty ± (submits the form), Remove (`/cart/change?line=N&quantity=0`), Subtotal, `Free shipping. Taxes calculated at checkout.`, `Checkout · $X` and `Update cart`. When empty it shows `Your cart is empty.` and `Continue Shopping` → `/collections/all`. Most add-to-cart flows actually use the **drawer** (§4).

**Case Studies / "The Research"** (`/pages/case-studies`, `page.case-studies.json`): the single `case-studies` section.

**About** (`/pages/about`, `page.about.liquid`): `about-page`. This holds the richest study data; see §2.9.

**Nano Odor Max LP** (`/pages/nano-odor-max`, `page.nano-odor-max.json`, **layout `nom-lp`**, a separate light-themed layout with no header, footer or popup and `robots noindex,follow`):
1. `nom-lp-hero`
2. `nom-lp-sources`
3. `nom-lp-science`
4. `nom-lp-how`
5. `nom-lp-proof`
6. `nom-lp-reviews`
7. `nom-lp-offer` (also renders `nom-lp-drawer`)
8. `nom-lp-faq`
9. `nom-lp-footer`
10. `nom-lp-sticky`

**NanoGrow LP** (`/pages/nano-nutrient`, `page.nano-nutrient.liquid` → layout `theme.ngm-lp` → static `ngm-lp-main`). This is not in the requested list but was read because it holds the **only dosing copy** (§2.10) and the BOGOS gift explanation.

Other pages: `page.liquid` (generic, styled for the contact form), `collection.liquid` (skips products tagged `bogos-gift`, products with `seo.hidden`, and $0 products), plus `flip-unlock`, `feed-bloom` and `deep-clean` LPs (out of scope).

---

## 2. Marketing copy and claims (verbatim)

### 2.1 Global chrome
* **Announcement bar** (bg `#22c55e`, text `#060e06`, uppercase). Desktop shows `🚚 FREE SHIPPING on Every Order — Limited Time` | `Results Guaranteed or Your Money Back`. `message_2` is blank. The schema default `Use Code [CODE:grow-20] for 20% Off` is **not live**, although code [CODE:grow-20] is ACTIVE. Mobile shows only the first message.
* **Header**: logo image `NGM_Logo_TPBG.png`. No menu is set, so the hard-coded nav is used: `Home` `/`, `Grow Max` `/products/nanogrow-max`, `Odor Max` `/products/nano-odor-max` (highlighted green), `About` `/pages/about`, `Case Studies` `/pages/case-studies`. The cart button reads `Cart` and shows a count bubble.
* **Footer**: shop name, tagline `Feed the plant. Dominate the harvest.` and `Contact Us →` (`/pages/contact`, which **301-redirects**; the real page handle is `contact-us`). The "Legal" column lists shop policies, then `Refund Policy`, `Shipping Policy`, `Terms of Service` and `Contact Us`. The bottom line is `© {year} NanoGrow Max. All rights reserved.` followed by the policy links.
* **Trust badges snippet** variants:
  * `grow`: `Lab Tested & Verified` · `USDA BioPreferred Certified` · `30-Day Money Back Guarantee` · `Free Shipping on Every Order`
  * `bust`: `Secure Checkout` · `Free Shipping on Every Order` · `30-Day Returns` · `Pet Safe` · `Biodegradable Formula`
  * `shared`: `30-Day Money-Back Guarantee` · `Lab Tested. Grower Approved.` · `Premium Ingredients Only` · `Free Shipping on Every Order`

### 2.2 Homepage
**hp-hero** (live settings)
* Eyebrow (leaf icon): `USDA BioPreferred Certified`
* H1: `Feed the Plant.` / `Dominate the Harvest.` (the second line is green)
* Sub: `Grow Max delivers nutrients at <strong>100x</strong> the absorption rate of conventional fertilizers. Documented <strong>+40.7%</strong> yield increase.`
* Stats (fallback, live): `+40.7%` More Yield · `+24.2%` More THC · `100x` Faster Absorption
* CTAs: `Shop Grow Max →` (`/products/nanogrow-max`, the default because the URL is blank) and `Shop Odor Max →` (`/products/nano-odor-max`)
* Trust strip: `shared` variant
* Proof bar **hidden** (`show_proof_bar: false`). Its stored values, NOT LIVE: `+40.7%` Average Yield Increase · `+24.2% THC` Tested Potency Increase · `1,000+` Active Growers · `99%` Odor Neutralization Rate · `4.9 ★` Customer Rating. The schema defaults differ: `+43%`, `+24% THC`.
* Background: `ngm-home-hero-desktop.jpg` and `-mobile.jpg`. These are product photos with **no baked-in copy**, showing 2 white 16 oz bottles and the Odor Max spray.

**growth-results-direct** (image only; alt `Grow Max Growth Results`). It actually shows `ngm-works-anywhere-desktop.jpg`, a **text-baked "Works anywhere" graphic**:
* `BUILT FOR EVERY GROWER`
* `Works anywhere you grow.`
* `NanoGrow Max is safe and effective in any grow environment.`
* Cards:
  * `GROW TENTS — NanoGrow Max helps plants thrive in any tent setup—big or small.`
  * `INDOOR GROWS — NanoGrow Max works seamlessly in soil, coco, and hydroponic systems.`
  * `GREENHOUSES — NanoGrow Max supports strong, healthy growth in high humidity and changing conditions.`
  * `OUTDOOR GROWS — NanoGrow Max helps plants thrive outdoors—resilient, vigorous, and full of life.`
* Strip: `BOOSTS GROWTH NATURALLY` · `STRONGER ROOTS HEALTHIER PLANTS` · `BIGGER YIELDS MORE FLOWERS` · `IMPROVES PLANT RESILIENCE` · `CLEAN, SAFE & EFFECTIVE FORMULA`

**hp-problem-solution**
* Eyebrow `The Problem. Our Solution.`
* H2 `Most Growers Struggle.` / `We Built the Solution.`
* Sub `Outdated nutrients and guesswork lead to inconsistent results. Grow Max delivers proven performance you can see.`
* Problem panel: badge `The Problem`, title `Why Most Growers Don't Get the Results They Want`, image `ngm-problem-solution.jpg` (a B&W cannabis cola with no text). **Bullet list empty (live).**
* Solution panel: badge `The Solution`, title `Grow Max Changes Everything`, body `Our nano-encapsulated formula delivers nutrients directly where plants need them - faster, deeper, and more efficiently.`, image `ngm-bundle-bottles.jpg`. **Bullet list and stat cards empty (live).**
* Preset copy, NOT LIVE:
  * Problems: `Nutrients can't penetrate plant cells effectively.` / `Slow absorption leads to waste and nutrient lockout.` / `Harsh chemicals and synthetic salts damage soil and roots.` / `Inconsistent results, week after week.`
  * Solutions: `100x faster absorption` / `Increase yield up to +40.7%` / `Boost potency & terpene production` / `No synthetic salts or harmful buildup` / `Lab-tested. Grower-approved.`
  * Stats: `+40.7%` Average Yield Increase / `+40.7%` Documented Yield Increase / `Lab Tested` Third-party verified for purity and performance / `USDA Certified` BioPreferred Formula

**hp-how-it-works**: pill `HOW IT WORKS`, then a **text-baked image** with hard-coded `<picture>` URLs:
* `https://cdn.shopify.com/s/files/1/0979/0269/0607/files/How_it_works_desktop.png?v=1777647434` (1672×941, 1.71 MB)
* `.../How_it_works_mobile.png?v=1777647434` (941×1672, 1.58 MB)

Text in the image:
* `HOW IT WORKS`
* **`Advanced plant science. Simple steps.`**
* `Maximize growth, root strength, and yield with a simple alternating system.`
* Six steps:
  1. **Prep**: `Condition soil and activate the root zone.`
  2. **Activate**: `Foliar spray jumpstarts nutrient absorption.`
  3. **Alternate**: `Cycle root feeding and foliar spray every 5–7 days.`
  4. **Grow**: `Stronger roots. Faster growth. Healthier plants.`
  5. **Flower**: `Focus on root feeding to maximize bud development.`
  6. **Finish**: `Stop early for a clean, optimized harvest.`

**works-anywhere-direct** (alt `Grow Max Works Anywhere`). It actually shows `ngm-how-it-works-desktop.jpg`, a **text-baked "Engineered for Growth" graphic**:
* `WHY GROWERS CHOOSE US`
* `Engineered for Growth. Built for Results.`
* `NanoGrow Max delivers science-backed performance that growers can see and trust.`
* Cards:
  * `Increase Flower Yield — Nano-technology drives nutrients directly into plant cells — delivering bigger, denser harvests.`
  * `100x Faster Absorption — Advanced nano-particles penetrate faster and deeper for maximum uptake and efficiency.`
  * `Boost Potency & Quality — Enhances terpene production and potency for a superior end product every time.`

> The image names and alt texts are swapped: the "growth results" slot shows "works anywhere" and vice versa. An orphan asset, `growth-results-desktop.webp`, is the same graphic plus a strip reading `FREE SHIPPING ON $50+`. That strip is stale, because the current promo is free shipping on every order and the code threshold was $60.

**hp-reviews** (fallback cards, live; `overall_score` and `review_count` blank, so there is no aggregate)
* Eyebrow `Trusted by Growers Nationwide`
* H2 `Real Growers. Real Results.` / `Trusted Across the Country.`
* Sub `Growers are seeing stronger plants, bigger yields, and higher potency with Grow Max.`
* KPIs: `+40.7%` Documented Yield Increase · `100x` Nutrient Absorption · `30-Day` Money-Back Guarantee
* Cards (5★, each labelled "Verified Purchase"):
  1. `"Running the same Blue Dream cut I've had for 4 years. Every variable identical except adding NanoGrow Max. Final weight came in 47% higher."` (Marcus T., Colorado, Grow Max customer)
  2. `"Used it in my car after a session. Rolled the windows up, sprayed twice, waited two minutes. My buddy got in and had no idea."` (Trevor K., California, Odor Max customer)
  3. `"The difference was obvious in the first week. Healthier plants, faster growth, and way more flower. Worth every penny."` (Jessica T., Oregon, Grow Max customer)
  4. `"Post-harvest I spray down the whole room. Works on the air and the fabrics. Zero smell the next morning."` (J. Williams, Michigan, Odor Max customer)
* Media logos are off. Their alt text, unused: Maximum Yield, High Times, Leafly, Growing, Cannabis Business Times.

**hp-cta**
* Eyebrow `Get Started Today`
* H2 `Feed the Plant.` / `Dominate the Harvest.`
* Sub `Join over 1,000 growers seeing real results with Grow Max.`
* Buttons `Shop Grow Max →` (`/products/nanogrow-max`) and `Shop Odor Max →` (`/products/nano-odor-max`)
* Guarantee (shield icon) `30-Day Money Back Guarantee — No questions asked.`
* Side image `ngm-home-side-mobile.jpg` (two bottles labelled **"Net Content: 1 pint (16 fl oz)"**)
* Trust icons empty (no blocks)

### 2.3 Grow Max PDPs (NGM stack)
**ngm-product-hero** (live settings)
* Image: `ngm-home-side-mobile.jpg` on both desktop and mobile
* Eyebrow: `Premium Cannabis Growth Formula`
* H1: `{{ product.title }}` (`Grow Max`, `RootMAX` or `GroMax`)
* Judge.me preview badge: renders nothing, because the NGM products have no Judge.me metafields (0 reviews)
* Subtitle: `Science-backed nutrients engineered for maximum yield and potency.`
* Picker: see §3.1
* ATC label: `Add to Cart` (the schema default is `ADD TO CART →`). Secondary button: `BUY NOW · CHECKOUT INSTANTLY`
* Trust line: `✓ Free shipping on every order  ·  ✓ 30-day money-back guarantee`
* Bullets (✓):
  * `Boosts yields up to 40% in clinical trials`
  * `Works with soil, coco, and hydro grows`
  * `USDA-compliant, no banned substances`
  * `One formula — veg through late flower`

**ngm-upsell**: see §4.

**ngm-usda** (bundle PDP only)
* Badge image `usda-badge.svg` (alt `USDA Certified Biobased Product 76%`)
* Eyebrow `Trust and quality`
* H2 `USDA BioPreferred Certified`
* Body: `Verified organic-derived. Environmentally responsible. Meeting <strong>federal standards for biobased content.</strong> This certification requires independent testing and federal review. It is not self-reported. It is not a label you buy. We earned it.`

**ngm-problem-solution**: the same copy as hp-problem-solution. The solution image is `ngm-home-side-mobile.jpg`. **Lists and stats are empty (live).**

**ngm-comparison**
* Eyebrow `How we compare`
* H2 `Grow Max vs conventional nutrients.`
* Sub `Every nutrient brand claims better yields. Most are selling the same salt-based chemistry that has been around for decades. This is different.`

| Feature | Grow Max | Salt-Based Nutes | Organic Teas | Cal-Mag Supplements |
|---|---|---|---|---|
| Nano-encapsulated delivery | ✓ | ✗ | ✗ | ✗ |
| USDA BioPreferred Certified | ✓ | ✗ | Varies | ✗ |
| Documented yield increase | ✓ | ✗ | ✗ | ✗ |
| Works in all growing mediums | ✓ | ✓ | Soil only | ✓ |
| Non-toxic and biodegradable | ✓ | ✗ | ✓ | Varies |
| 100x absorption vs conventional | ✓ | ✗ | ✗ | ✗ |

On mobile the table becomes cards with Yes/No text.

**ngm-reviews** (fallback cards, live)
* Header copy is the same as hp-reviews
* KPIs: `+40.7%` **Reported Yield Lift** · `100x` **Faster Absorption** · `30-Day` Money-Back Guarantee
* Cards (5★, "Verified Purchase"):
  1. **`Best fertilizer I've ever used - period.`**: `"Running the same Blue Dream cut I've had for 4 years. Every variable identical except adding NanoGrow Max. Final weight came in 47% higher. I'm not a scientist but that speaks for itself."` (Marcus T., March 12, 2025)
  2. **`Terpenes through the roof`**: `"My last harvest with NanoGrow Max was the most aromatic I've ever produced. The dispensary I tested it through actually commented on the terpene profile."` (Kai R., February 28, 2025)
  3. **`Took a few applications to see results`**: `"Was a little impatient at first - didn't see changes until about week 2 of applying. After that though, the difference in bud site formation was undeniable."` (Diego M., January 15, 2025)

**judgeme-reviews**: heading `Customer Reviews` (the schema default; no stored settings), then `#judgeme_product_reviews`, hydrated by the Judge.me app embed. The NGM products have 0 reviews.

**ngm-cta**
* bg `#060f06`
* Eyebrow pill `Grow Max`
* H2 `Ready to` / `Dominate Your Harvest?` (green)
* Desc `Join thousands of growers who have already upgraded their yields with science-backed nano-nutrients. One formula. Maximum results.`
* Button `Get Grow Max →` → `#ngm-product-hero`
* Guarantee `30-Day Money-Back Guarantee  ·  Free Shipping on Every Order`
* **No product image** (unset) and **no feature or trust lists** (no blocks)
* Preset, NOT LIVE:
  * Features: `100x nano-absorption technology` / `USDA-compliant — no banned substances` / `Works veg through late flower` / `Boosts yields up to 40% in trials`
  * Trust: `Free Shipping` / `30-Day Returns` / `USDA Certified` / `Soil, Coco & Hydro`

Unused NGM sections. Their presets were never placed:
* `ngm-benefits`: `Why Growers Choose Us` / `Engineered for Growth.` / `Built for Results.`; cards `+40.7%` Avg. yield increase, `100x` Faster than conventional, `+24.2%` More THC potential.
* `ngm-use-cases`: `Works anywhere you grow.`; trust strip includes `Works in 60 Seconds` and `Destroys Odors at Molecular Level`, which is odor copy mistakenly placed on a nutrient section.

### 2.4 Nano Odor Max PDP (CB stack)
**cb-product-hero**
* Image: no `hero_image` is set, so it uses the product featured image `nom-hero-bottle_007e4e7a-….jpg`
* Eyebrow `Premium Cannabis Odor Eliminator`
* H1 `Nano Odor Max`
* Judge.me badge: 5.00, 1 review
* Subtitle `Molecular elimination technology that destroys odors on contact.`
* Trust `✓ Free shipping on every order  ·  ✓ 30-day money-back guarantee`
* Bullets:
  * `Instantly eliminates smoke, fabric & room odors`
  * `Safe for fabrics, clothing, bedding & laundry`
  * `No masking — true molecular elimination`
  * `Results guaranteed or your money back`

**cb-odor-removal-direct**: a **text-baked image**. There is no image setting, so it falls back to theme assets `cb-odor-removal-desktop.png` (915 KB) and `cb-odor-removal-mobile.png` (1.52 MB). Alt `Bad odor doesn't stand a chance. Neither does Odor Max.`

**⚠ The image still says the old brand name.** Its text:
* `INSTANT ODOR REMOVAL`
* `Bad odor doesn't stand a chance. Neither does Canna Bust.`
* `Canna Bust destroys odor molecules at the source—not just masks them. The result? Clean air in 60 seconds. Guaranteed.`
* Icons: `DESTROYS ODOR AT MOLECULAR LEVEL` · `PLANT-BASED FORMULA` · `WORKS IN 60 SECONDS`
* `BEFORE / STRONG ODORS LINGER` · `AFTER / CLEAN. FRESH. GONE.`
* `SAFE FOR PEOPLE, PETS & PLANTS`

**cb-ugc-video**: H2 `See It In Action`. Video `https://cdn.shopify.com/videos/c/o/v/0f46f63b304044b3a63c1722c64cfb38.mp4`, embedded through an **`<iframe src=*.mp4>`** with a 3:4 frame and max 520px. There is no poster or controls markup, and the browser's native player renders inside the iframe.

**cb-comparison**
* Eyebrow `How we compare`
* H2 `Odor Max vs. everything else.`
* Sub `The products you have already tried work by hiding the smell. That is not the same as removing it.`

| Feature | Odor Max | Febreze | Ozium | Generic Sprays |
|---|---|---|---|---|
| Destroys odor molecules | ✓ | ✗ | ✗ | ✗ |
| Safe in occupied spaces | ✓ | ✓ | ✗ | Varies |
| Pet and child safe | ✓ | ✓ | ✗ | Varies |
| Fragrance free result | ✓ | ✗ | ✗ | ✗ |
| Biodegradable formula | ✓ | ✗ | ✗ | ✗ |
| Works on cannabis odor | ✓ | Partially | ✓ | Partially |

**cb-reviews**
* Eyebrow `TRUSTED BY THOUSANDS`
* H2 `Real People. Real Results.`
* Sub `See what Odor Max users are saying.`
* One block: ★★★★★ `"Honestly works way better than I expected. It doesn’t smell like you sprayed anything, it just makes the room smell clean. No weird cover up scent, just gone"` (Verified Customer, ✓ Verified Purchase)

**judgeme-reviews**: 1 real review, 5★, by Timothy Alvarez (2026-08-26, verified buyer): `It's works. I'd say it's pretty instant too. Worth it.`

**cb-faq** (fallback; all 10 render, the first one open)
* Pill `Questions`, H2 `FAQ`
* Sub `Everything growers, drivers, property managers, and home users need to know before they spray.`

1. **How is Odor Max different from regular air fresheners?** Regular air fresheners work by layering a fragrance on top of the odor. The smell comes back as soon as the fragrance fades because the odor molecule is still there. Odor Max bonds to odor compounds at the molecular level and destroys them. There is nothing left to come back.
2. **Is Odor Max safe to use around pets and children?** Yes. The formula is non-toxic and biodegradable. Once the treated surface is dry, which takes about 30 to 60 seconds, it is safe for pets and children.
3. **Can I use it on fabric and upholstery?** Yes. It is built for multi-surface use: fabric, upholstery, carpet, car interiors, curtains, and open air. Streak-free and will not stain, bleach, or leave residue on any surface we have tested it on.
4. **How many sprays do I need per application?** Two to three sprays handles most situations. For a larger room or a vehicle interior, do a second pass after 60 seconds. One 8oz bottle contains approximately 250 sprays.
5. **Does it leave any scent behind?** No. Odor Max does not replace the odor with a fragrance. Once it works, the air is neutral. Clean. Nothing. That is the point.
6. **How fast does it actually work?** In most cases the odor is gone within 60 seconds. Heavily saturated fabrics or enclosed spaces may need a second application and a few extra minutes, but there is no waiting around.
7. **What odors does it eliminate?** It was built for cannabis smoke, tobacco, and vaping. It also handles pet smells, food odors, and anything organic that has soaked into fabric or upholstery.
8. **How is it different from Ozium or Febreze?** Ozium uses glycolized air sanitizers and is not safe around people or pets during application. Febreze masks odors with fragrance and cyclodextrin. Odor Max uses molecular neutralization with a non-toxic, biodegradable formula that is safe to use in occupied spaces.
9. **Can I use it in a car or enclosed space?** Yes. Enclosed spaces are actually where it performs best because the formula concentrates rather than dispersing into open air. Spray the vents, headliner, and seats and let it sit for two minutes.
10. **Can I buy it in bulk for commercial use?** Yes. Odor Max was designed with property managers, hotel housekeeping, automotive detailers, and healthcare facilities in mind. For volume pricing or wholesale arrangements, reach out directly to **support@nanogrowmax.com**.

The FAQ is followed by the `bust` trust strip. Note that every other surface uses **[OWNER-EMAIL]**.

**cb-cta**
* Badge `Odor Max`
* H2 `Breathe easy.` / `Stress free.` / `Stay undetected.` (green). The schema default line 2 was `Grow stronger.`
* Desc `Odor Max eliminates odors at the molecular level — fast. Safe for people, pets, and plants. Works in 60 seconds.`
* Button `Get Odor Max Now →` → `/products/nano-odor-max`, which is the same page
* Guarantee (refresh icon) `30-Day Guarantee`
* Image `cb-bottle-render.jpg` (alt `Odor Max spray bottle`). The label reads `Nano Odor Max`, `184 Wire Dr. Andrews, SC 29510`, `ODOR ELIMINATOR • INSTANTLY REMOVES SMOKE ODORS • WORKS ON FABRICS, CLOTHING, BEDDING & LAUNDRY`, `CAUTION: Avoid contact with eyes. In case of eye contact flush thoroughly with water.`, `KEEP OUT OF THE REACH OF CHILDREN` and `CONTENTS: 8 oz.`. The seal still reads `CANNA-BUUST`.
* **Feature and trust lists empty (live).** Preset, NOT LIVE: `Destroys Odors at Molecular Level` / `Plant-Based Formula` / `Works in 60 Seconds` / `Safe for People, Pets & Plants`; trust `Free Shipping on Every Order` / `30-Day Returns` / `Pet Safe` / `Biodegradable Formula`.

Unused `cb-before-after` presets: `Instant Odor Removal` / `Bad odor doesn't` / `stand a chance.` / `Neither does Odor Max.`; `Odor Max destroys odor molecules at the source - not just masks them. The result? Clean air in 60 seconds. Guaranteed.`; `Strong Odors Linger` / `Clean. Fresh. Gone.`; `Safe for People, Pets & Plants`.

### 2.5 Nano Odor Max LP (`/pages/nano-odor-max`, nom-lp layout, noindex)
* **Hero**: wedge `Destroys, doesn't mask.`; H1 `Any Odor. Gone in Seconds.`; sub `Smoke, pets, gym bags, cooking, car — gone in seconds. Fabric-safe, and it destroys odor molecules instead of masking them.`; CTA `Get Nano Odor Max`; image `nom-hero-bottle.jpg`.
* **Sources**: `Wherever Life Gets Smelly` / `One spray for every room, fabric, and ride.`
* **Science**: `Destroys, Doesn't Mask.` / `Why the smell never comes back.`
  * `Air fresheners mask`: `Fresheners coat odors in perfume. The molecules are still there — so the smell comes back.`
  * `Nano Odor Max destroys`: `Nano-technology breaks odor molecules down on contact. Nothing left to smell.`
* **How It Works**: `Three steps. No scrubbing, no perfume.`
  1. **Spray the source**: `Couch, carpet, car seat, gym bag — or just the air. A few sprays is all it takes.`
  2. **Molecules break down**: `Nano-technology breaks odor molecules apart on contact instead of coating them in fragrance.`
  3. **Nothing to re-smell**: `It dries clear with no residue and no perfume. The odor isn't hidden — it's gone.`
  * `What's in it — and what's not`: `Plant-based active ingredients` / `No bleach, no masking fragrance` / `Fabric-safe — dries clear` / `Safe around pets and kids once dry`
  * Note: `No harsh chemicals — the full ingredient list is printed on every label.`
* **Proof**: `Put to the Test` / `Real rooms, real smells — one spray each.`
* **Reviews**: `Real Rooms. Real Fast.`, label `Early customer notes`, Judge.me off.
  1. `My car smelled like a locker room after every workout. Two sprays and it was gone before I pulled out of the parking lot.` (Andre L., Car after the gym)
  2. `Pan-fried salmon and the whole apartment knew it. One pass around the kitchen and the air was fresh by the time the dishes were done.` (Dana R., Kitchen after cooking fish)
  3. `Our couch always smelled like our retriever. Sprayed the cushions once — fresh in about ten seconds, and it stayed that way.` (Priya K., Pet on the couch)
* **Offer**: `Pick Your Pack` / `Free shipping & a 30-day guarantee on every size.`; guarantee `30-Day Money-Back Guarantee · FREE Shipping on Every Order`; drawer line `30-Day Money-Back Guarantee — if it doesn't work for you, email us.`; cross-bump `Got plants too? Add GroMax →` (`/pages/nano-nutrient`). Mechanics are in §3.3.
* **FAQ** (`Quick Questions`):
  1. **Is it safe around pets and kids?** Yes — the formula is plant-based and safe for people, pets, and plants. As with any household spray, let surfaces dry before heavy contact.
  2. **Does it leave a scent or residue?** No. Nano Odor Max destroys odor molecules instead of covering them with perfume. It dries clear with no residue and no fragrance left behind.
  3. **Will it stain my couch or car seats?** It's fabric-safe and dries clear on couches, carpets, curtains, and car interiors. As with any spray, spot-test delicate or specialty fabrics in a hidden spot first.
  4. **What surfaces and fabrics can I use it on?** It's fabric-safe: couches, carpets, curtains, car interiors, gym gear, shoes — plus the air itself. Spot-test delicate fabrics first.
  5. **How long does a bottle last?** Each bottle is a full 8 oz, and a few sprays handle most everyday odors — so one bottle goes a long way.
  6. **What about shipping and returns?** Shipping is FREE on every order — no minimum. Every order is also covered by a 30-day money-back guarantee: if it doesn't work for you, email us and we'll make it right.
  7. **Is this the same company as NanoGrow Max?** Yes — Nano Odor Max is made by NanoGrow Max, Inc., a U.S. plant-care company. NanoGrow Max is the name you'll see at checkout and on your order confirmation.
  8. **How do I contact you?** Email [OWNER-EMAIL] — a real person replies, typically within one business day.
* **Final**: `Ready to Clear the Air?` / `One spray. Seconds later, it's like the odor never happened.`; `30-Day Money-Back Guarantee · Fabric-Safe`; `Nano Odor Max is made by NanoGrow Max, Inc., a U.S. plant-care company.`; support [OWNER-EMAIL]
* **Sticky bar**: `Nano Odor Max` · `Get Nano Odor Max` · `Free shipping · 30-day guarantee`.
* **Drawer facts**: `FREE shipping · arrives in about 5 business days`; the guarantee line; `Secure checkout, powered by Shopify`.

### 2.6 Guarantee and shipping wording (all variants found)
* `30-Day Money-Back Guarantee` / `30-day money-back guarantee` / `30-Day Money Back Guarantee — No questions asked.` / `30-Day Guarantee` / `30-Day Returns` / `Results Guaranteed or Your Money Back` / `Results guaranteed or your money back`
* NGM LP: `Try it for 30 days, risk-free.` and `Run NanoGrow Max in your garden for a full month. If you don’t see the difference, email us and we’ll refund every penny — no forms, no hassle, no returns required. You take zero risk. Your plants take all the upside.` Its FAQ adds `Use it for up to 30 days. Not convinced? Email us for a full refund — no return shipment needed.`
* Shipping: `🚚 FREE SHIPPING on Every Order — Limited Time`, `Free shipping on every order`, `Free Shipping on Every Order`, `🎉 Free shipping on every order!` (cart bar), `Free shipping. Taxes calculated at checkout.` (Liquid-rendered drawer and cart page), `Shipping & taxes calculated at checkout` (JS-rendered drawer, which **contradicts** the Liquid version), `Orders ship from the U.S., and right now shipping is free on every order — no minimum.`, `arrives in about 5 business days`.
* Verified store config: the delivery profile "General profile" has a Domestic `Free Shipping` rate of $0.00 with no conditions. International uses usps and dhl_express carrier rates. The old threshold was `$60` (`FREE_SHIP_CENTS` was 6000).

### 2.7 USDA / certification claims
* `USDA BioPreferred Certified` (hero eyebrow, trust strips, comparison row, `ngm-usda`, about page)
* Badge alt: `USDA Certified Biobased Product 76%`, i.e. **76% biobased content**, an asset-level claim in `usda-badge.svg`
* `NanoGrow Max is the only USDA BioPreferred Certified plant catalyst built on nanotechnology.` (about)
* `NanoGrow Max holds USDA BioPreferred Certification. That is one of the most rigorous biobased product standards in the United States. Organic-derived ingredients, independently tested, reviewed by federal standards. It is not a marketing badge. It is a federal certification. Not every brand can get it.` (about)
* `USDA-compliant, no banned substances` (PDP bullet)
* Meta and SEO descriptions also claim "USDA BioPreferred certified".

### 2.8 Every number and stat (cross-reference)

| Claim | Where |
|---|---|
| **+40.7%** yield (avg / documented / "Reported Yield Lift" / "More Yield") | home meta description, hp-hero, hp-reviews, ngm-reviews, product SEO description, about, NGM LP |
| **Up to 40%** "in clinical trials" / "in trials" | PDP bullet; ngm-cta preset |
| **+43%** | hp-hero schema default only (not live) |
| **100x** absorption / faster absorption | everywhere |
| **+30% nutrient uptake** | baked into the `cs-fieldresults` image (contradicts 100x) |
| **+24.2%** THC / "More THC" / "Tested Potency Increase"; **17.2% → 21.37%** (about also says 17.20%) | hp-hero, about |
| **~5% higher THC potency** | Matt Cinquanta case study |
| **Up to 2×** higher yields | Matt case study |
| **41% and 17.5%** yield; **200%–600% ROI** | CTG case study |
| **21.1%–125%** yield; **35 → 53 tons/hectare, +18 tons (+51%)**; **up to 2 → up to 4.5 tons/hectare** | field results case study |
| **15% to 55%** yield gains across all crop tests | about (THC study card) |
| **27 lbs → 38 lbs** (18 + 18 plants, 49 days); **47.5 → 55.8 lbs** (28 + 28 plants, 115 days); **$22,000 / 11 lbs** and **$16,600 / 8.3 lbs** gains | about, CTG image |
| **47% higher** final weight | review (Marcus T.) |
| **1,000+** / "over 1,000" growers; "thousands of growers"; "TRUSTED BY THOUSANDS" | hp-cta, ngm-cta, cb-reviews |
| **2M+ Network Reach** | about |
| **99%** Odor Neutralization Rate; **4.9 ★** rating | hidden proof bar only |
| **60 seconds** ("Works in 60 Seconds", "Clean air in 60 seconds. Guaranteed.", "gone within 60 seconds", "second pass after 60 seconds") | cb-cta, cb-faq, cb-odor image, presets |
| **30 to 60 seconds** dry time; **~250 sprays** per 8 oz bottle; **2–3 sprays**; **two minutes** in a car | cb-faq |
| **8 oz** bottle (Odor Max); bottle label shows **8 oz** | everywhere |
| **1 pint (16 fl oz)** on the GroMax/RootMax labels vs **32OZ** in the bundle SKU `NGM-GRB-32OZ-2PK` and in the NGM LP `bottle_oz` default | images vs data. **Unresolved.** |
| Reviews: Judge.me **Nano Odor Max 1 review, 5.00**; NGM products **0** | metafields |

### 2.9 About page (`/pages/about`), verbatim highlights
* Pill `The science they didn't tell you about`
* H1 `We didn't ~~reinvent~~ plant food. We made it obsolete.`
* Intro: `NanoGrow Max is the only USDA BioPreferred Certified plant catalyst built on nanotechnology. It delivers nutrients at 100x the absorption rate of conventional fertilizers. We have the studies. We published them.`
* Receipts (`The receipts. Documented case studies. Real grows.`):
  * `+40.7%` Yield Increase Indoor Grow, `49-day study - 36 plants - controlled environment`
  * `+24.2%` THC Potency Improvement, `54 plants - avg moved from 17.2% to 21.37% THC`
  * `100x` Better Absorption vs. Conventional, `Nano-particle delivery at the cellular level`
* Story `How this started` / `One question nobody had answered yet.`:
  1. Our founding team asked a question that sounds simple until you try to answer it: "What if we could multiply the weight of a plant significantly, using something that doesn't exist yet?" That took years to figure out.
  2. Here is what they learned first: most of what you feed your plants never actually reaches them. Standard fertilizer molecules are too large to pass through the stomata. Those are the microscopic pores that control every nutrient exchange inside the plant. You are growing on the outside of a locked door.
  3. So they stopped trying to push through the door and built a key instead. By reducing organic plant extracts to nano-particle size, the formula passes through the stomata directly. It reaches the leaf, stalk, and root at the same time. Faster delivery. No waste. Actual cellular absorption.
  4. Then they ran the studies. Real grows. Matched control groups. Published the numbers. Because if the science is real, the data will speak for itself. It did.
* `Documented results` / `We don't ask you to trust marketing. We published the results.` / `Every study ran with matched control groups in controlled environments. Same strain. Same inputs. One variable. We do not hide behind averages and we do not cherry-pick numbers.`
  * **Indoor Cannabis Study - 49 Days, +40.7% Yield**: `Control group came in at 27 lbs. NanoGrow Max group came in at 38 lbs. Same strain, same room, same everything except one variable.` Plants: 36 total (18 control, 18 treated). Duration: 49 days. Setting: Controlled indoor.
  * **Outdoor Cannabis Study - 115 Days, +17.5% Yield**: `$16,600 in additional revenue from treated plants`. `47.5 lbs from the control group. 55.8 lbs from the NanoGrow Max group. Full outdoor season. Real conditions.` Plants: 56 total (28 control, 28 treated). Duration: 115 days. Setting: Outdoor full season.
  * **THC Potency Study, +24.2% Potency**: `Non-treated plants averaged 17.20% THC. NanoGrow Max plants averaged 21.37% THC. More potency per pound is more value per pound. Full stop.` Plants: 54 total. Metric: THC percentage by weight. Range: Yield gains across all crop tests: 15% to 55%.
* `Why it works` / `The problem with every fertilizer you have ever used.`:
  * ~~Too large to enter the plant~~ (Conventional Fertilizers): `Standard fertilizer molecules cannot pass through the stomata. The molecular size is too large. Most of what you apply sits in the root zone or gets washed away. You are paying for nutrients that never reach their target. Every grow. Every application.`
  * **Built to work at the cellular level** (NanoGrow Max Technology): `Nano-particle sized organic extracts pass through the stomata directly. Leaf, stalk, and root absorb at the same time. No waste. No waiting. 100x better absorption means every drop of what you apply is actually doing something inside the plant.`
  * USDA note: see §2.7.
* USDA block: the same as `ngm-usda`.
* Network: `Backed by science. Distributed through the culture.`
  * `NanoGrow Max co-launched with CannaConnect, a cannabis marketing and distribution agency that connects cultivators, brands, and the supply chain. If you found us on X, you came through a network that already knows what it is talking about.`
  * Cards: **CannaConnect Agency**: `Cannabis-focused strategy, content, and distribution with a network built inside the culture. The bridge between the lab and the grower. Not a middleman. A connector.` **Built for More Than Cannabis**: `NanoGrow Max technology is being tested on rice, soybean, and maize through our partnership with Alluvial Trade across Africa. The same science that lifts your yields is being used to address food security at scale.`
  * `2M+ Network Reach`: `This launch runs through @WeedPorns and the full CannaConnect network. The largest cannabis community on X. If you got here through X, you are already inside the right network.` (links to https://x.com/WeedPorns)
* CTA: `Built for the grower who doesn't accept average.` / `We built NanoGrow Max for the cultivator who reads the science, tracks every gram, and refuses to leave yield on the table. If you found us on X, you are already the kind of grower this was made for. Welcome.`
  * **Product roles**: **GroMAX**: `Foliar spray catalyst. Explosive canopy development. Built for veg and flower.` **RootMAX**: `Root zone catalyst. Stronger root architecture. Faster establishment. Peak uptake.` **Odor Max**: `Post-harvest odor eliminator. Destroys at the molecular level. Does not mask.`
  * `One ecosystem. Every stage. Zero compromise.`
  * Buttons `Shop NanoGrow Max` / `Shop Odor Max`

### 2.10 How-to-use / dosing / mixing: what exists
* **The product descriptions are empty** (`descriptionHtml: ""`) for Grow Max, RootMAX and GroMax. There is no metafield with usage data. Nano Odor Max has one sentence: `Nano-technology odor eliminator in 8oz spray bottles. Destroys odor molecules instead of masking them — smoke, cooking, pets, gym, car. Fabric-safe and fast. 30-day money-back guarantee.`
* **The PDPs have no how-to-use, dosing, mixing, frequency or stage-of-growth section.** The only text-level usage hints are `One formula — veg through late flower`, the PDP picker descriptions (`Veg & flower nutrient formula`, `Root & soil nutrient formula`) and the about-page roles (GroMAX = foliar spray, veg + flower; RootMAX = root zone).
* **The only schedule is baked into the homepage image** `How_it_works_*.png`: Prep (condition soil / activate root zone) → Activate (foliar spray) → **Alternate: "Cycle root feeding and foliar spray every 5–7 days."** → Grow → Flower: **"Focus on root feeding to maximize bud development."** → Finish: **"Stop early for a clean, optimized harvest."** (no week count).
* **The only ml-per-gallon figure** is on `/pages/nano-nutrient` (ngm-lp-main):
  * Under "How To Use", `Three steps. That’s it.`: `1. Mix — Add to your watering can per the label directions.` / `2. Apply — Water in at the base or spray the leaves — both work.` / `3. Repeat — Feed on your normal schedule and watch the results build.`
  * "The Math" block renders from **schema defaults**, because no stored settings exist for this static section: **`5 mL` per gallon of water — the label dose**; one **32 oz** bottle mixes **189 gallons** (Liquid integer math: 32×2957/100 = 946 mL ÷ 5); **18 plants** fed for a full season on one bundle; **$5.55 per plant** ($99.99 ÷ 18).
  * The schema itself flags this as unverified: `dose_confirmed` defaults to false, with the comment *"Copy says 16 oz, the bundle SKU says 32 oz; that is the open question."* **Treat 5 mL/gal and 32 oz as unconfirmed.**
* **Odor Max usage**: 2–3 sprays; a second pass after 60 s for a large room or car; a car means spraying vents, headliner and seats and letting it sit 2 minutes; dry time 30–60 s; about 250 sprays per 8 oz; spot-test delicate fabrics.
* **Missing for the rebuild**: label-verified dilution (mL/gal) for GroMax and RootMax separately, foliar vs drench rates, frequency per stage (seedling / veg / flower / flush), compatibility with other nutrients, pH guidance, storage and shelf life, the ingredient list and safety (SDS).

---

## 3. Purchase mechanics

### 3.1 Grow Max picker (`ngm-product-hero`, identical on all three NGM PDPs)
* Three radio cards pull **live** variants by handle via `all_products[...]`:
  1. `GROMAX ONLY`: `Veg & flower nutrient formula`, **$54.99**, variant `56733998186799` (SKU NANOGR-01-000001Q)
  2. `ROOTMAX ONLY`: `Root & soil nutrient formula`, **$54.99**, variant `56401254449455` (SKU NANORT-01-000001Q)
  3. `FULL BUNDLE` + `BEST VALUE` pill: `Save $9.99` (compare-at $109.98 − $99.99), **$99.99**, variant `56039175618863` (SKU NGM-GRB-32OZ-2PK), **checked by default on every NGM PDP**, including the GroMax and RootMAX pages.
* Thumbnails come from each product's featured image (`GroMaxBlackBGBottle.png`, `RootMaxBlackBGBottle.png`, `GroMaxBlackBGBottle_874ca088….png`). The compare-at price is **not** shown struck through; only "Save $X" appears.
* Qty stepper (min 1) → `Add to Cart` (submit). `theme.js` intercepts the `/cart/add` submit, AJAX-adds the item, then opens the **drawer**.
* `BUY NOW · CHECKOUT INSTANTLY` adds via `/cart/add.js`, then goes to `/checkout`.
* ATC is disabled when the selected variant is unavailable.
* **Mobile sticky ATC** (<990px): appears once the real ATC scrolls off-screen. It shows the H1 text and an `Add to Cart` pill that proxies the click.
* There are no subscriptions, selling plans or quantity breaks on NGM.

### 3.2 Odor Max picker (`cb-product-hero`)
* Variants are matched by title substring, and anything containing "Gift" is skipped. **The single bottle ($12.99, variant 58065260347695) is never offered on the PDP.**
  1. `2-Pack`: `2 × 8oz bottles`, **$19.99**, variant `58065260380463`, **checked by default**
  2. `3-Pack`: `3 × 8oz bottles`, **$29.99**, variant `58065260413231`
  3. `4-Pack + 1 FREE` + `BEST VALUE`: `4 × 8oz + 1 free bonus bottle`, `✓ Free shipping included`, **$39.99**, variant `58065260445999`
* Compare-at prices exist ($29.99 / $44.99 / $59.99, and $18.99 on the single) but are **never displayed**. `cb_savings` is computed and never output.
* ATC is a `type="button"`. Three overlapping handlers exist; the capture-phase "delegated v9" listener wins. It adds **only the selected variant** via `/cart/add.js`, then does a **full redirect to `/cart`** (not the drawer).
* The legacy bundle code would also add free-gift variant `58065260478767` with properties `_bundle_addon: 4pack` and `_Free Bottle: ✓ Included with 4-Pack + 1 FREE`. However, an inline **`window.fetch` monkey-patch** ("Block BOGOS FBT") strips any `/cart/add` payload that contains `58065260478767`. The net effect is that the theme never adds the free bottle. The 4-Pack variant's price simply covers 4 + 1 at fulfilment.
* `BUY NOW · CHECKOUT INSTANTLY` → `/checkout`. The mobile sticky ATC works the same as on NGM.

### 3.3 Nano Odor Max LP offer (`nom-lp-offer`)
* Order: **3-Pack** (pre-selected, `Most Popular`) → 2-Pack → 4-Pack + Free Bottle (`Best Value`) → Single. $0 and unavailable variants are skipped.
* Per-tier notes (Liquid integer math):
  * 3-Pack: `Three 8 oz bottles — kitchen, car & gym bag · $9.99 per bottle · Save $8.98 vs singles`
  * 2-Pack: `Two 8 oz bottles — one for home, one for the car · $9.99 per bottle · Save $5.99 vs singles`
  * 4-Pack: `Five 8 oz bottles total · $7.99 per bottle · Save $24.96 vs singles`
  * Single: `Just trying it out · one 8 oz bottle`
* CTA `Get Nano Odor Max · $29.99` opens the **review drawer**, which has Shopify **accelerated checkout** (Apple Pay / Google Pay via `{{ form | payment_button }}`, with the hidden variant synced to the selected tier), then `Continue to secure checkout` and `Keep shopping`.
* **Payment chips** (text badges, `nom-lp-paychips`): `Visa` `Mastercard` `Amex` `Discover` `Apple Pay` `Google Pay` (PayPal is hidden, `show_paypal: false`). **The main theme PDPs have no payment chips.**

### 3.4 NGM LP offer (`ngm-lp-main`)
* Cards GroMax / **Full Bundle (checked)** / RootMax.
* The bundle flag reads `Best Value — Save $9.99`, with `$109.98 separately` as the strike line.
* Bundle bullet: `FREE 8 oz Nano Odor Max — $12.99 value Added automatically to your cart. No code required.`
* Order bump checkbox: `Add a second Odor Max 2-Pack for the house — two more 8 oz bottles on top of the free one · $19.99`.
* Button `Add to Cart — $99.99`; risk line `30-day money-back guarantee · Free shipping on every order`; a sticky bar.

---

## 4. Upsells, cross-sells, discounts and apps

### 4.1 `ngm-upsell` (PDP bar under the hero)
* Copy: badge `40% OFF` · `Upgrade your stack. Add Odor Max 2-Pack —` **`$11.99`** ~~`$19.99`~~ · `+ Add to Cart` → `✓ Added!`
* Shown only while the **GroMax-only or RootMax-only** radio is selected. It is hidden for the bundle, which is the default.
* It adds variant `58065260380463` (**2-Pack, $19.99**) via `/cart/add.js` with the cart attribute `upsell_source: ngm-single-variant-40off`, then fires `cart:refresh`.
* **⚠ The theme contains no price logic.** The item is charged $19.99 unless a discount applies. **No discount in the store targets the 2-Pack at $11.99.** The only possible candidate is the active automatic app discount **"Upsell.com" (Upsell.com ex ReConvert)**, whose configuration is not visible via the API. This could be a displayed-vs-charged price mismatch; verify it with a test cart.

### 4.2 Cart drawer (`snippets/cart-drawer.liquid` + `theme.js`)
* Header `Your Cart` with a count and a close button.
* **Free-shipping progress bar.** Promo mode is on (`FREE_SHIP_CENTS = 0`; the Liquid uses `_sub >= 0`): `🎉 Free shipping on every order!` with a 100% bar. The dormant non-promo copy is `Add $X more for free shipping 🚚`, with `$0` / `Free shipping at $60` labels and a **$60 (6000¢)** threshold. The comment reads *"Set back to 6000 when the promo ends."*
* Line items: image, title, variant (unless default), price, qty ±/input and Remove. Lines with property `_free_gift == 'yes'` show the original price struck through plus **`FREE`**. This happens only in the Liquid render; the JS re-render drops it.
* Footer: Subtotal, note (`Free shipping. Taxes calculated at checkout.` in Liquid vs `Shipping & taxes calculated at checkout` after the JS re-render), `Checkout · $X` → `/checkout`, and `View full cart`.
* **Drawer upsell banner** (injected at the top of the footer by JS whenever the drawer opens):
  * Copy: `40% OFF` · `Upgrade your stack. Add Odor Max 2-Pack —` **`$11.99`** ~~`$19.99`~~ · `+ Add` (`Adding…`)
  * Trigger: the cart contains handle `growmax` **or** `rootmax` and **no** `nano-odor-max` variant whose title contains `2-Pack`. **It does NOT trigger for the `nanogrow-max` bundle.**
  * Action: add variant `58065260380463` × 1, then **reload the page**. The same price caveat as §4.1 applies.
* There is no cross-sell carousel, gift-wrap, note field or discount-code field in the drawer.

### 4.3 BOGOS.io free gift
* The app embed `bogos-io-free-gift` is enabled. It loads `https://cdn.bogos.io/.../freegifts_data_1782574450.min.js` plus extension JS (`glider.min.js`, `lz-string.min.js`).
* Gift products, tagged `bogos-gift` and excluded from collections:
  * `🎁 Nano Odor Max (100% off)` (`nano-odor-max-sca_clone_freegift`, variant `58110334665007`, "Free Gift (8oz Bottle)", $0, SKU CANNAB001)
  * `100% OFF shipping fee` (`shipping_discount-180408-sca_clone_freegift`, variant `57822296604975`, $0)
* The main product also carries a `$0` variant `Free Gift (8oz Bottle)` (`58065260478767`, SKU CANNAB001). The theme actively blocks adding it (§3.2).
* **Offer logic**, from the theme comment in ngm-lp-main: *"The bottle itself is put into the cart by the BOGOS free-gift app when the Full Bundle is added, and taken back out by BOGOS when the bundle is removed. This page must not add it a second time -- doing so shipped two free bottles on every bundle order."*
* A native discount backs this: **`Free 8oz Odor Max with the GroMax + RootMax bundle` (DiscountAutomaticBxgy, ACTIVE): "Spend $99.99, get 1 item free"**.
* The BOGOS app discounts `BOGOS Free Shipping` (`BOGOS-GFSis504`) are ACTIVE. `BOGOS 40% Off Canna Buust` (thank-you-page upsell, `BOGOS-TYiaZ34`) is EXPIRED.
* **The main PDP does not advertise the free gift.** Only `/pages/nano-nutrient` does, with `FREE 8 oz Nano Odor Max — $12.99 value … No code required.`

### 4.4 Pick Your Prize popup (`sections/pick-your-prize`, site-wide)
* Settings:
  * `Pick Your Prize` / `Enter your email, pick your game, and reveal your reward.`; teaser `Unlock Your Prize`
  * Trigger: 5 s delay, all pages, all visitors; mobile uses a teaser tab
  * Frequency: once per session, every 7 days; hidden after claim; one win per device
  * Games: wheel / scratch / mystery box (default wheel)
  * Colors: brand `#050705`, accent `#d4a850` (gold)
  * Loads Google Fonts **Cinzel + Cormorant Garamond + Inter** (Inter again)
  * Consent copy: `I agree to receive email marketing and understand I can unsubscribe at any time.`
* Email capture posts to Klaviyo: `https://a.klaviyo.com/client/subscriptions/?company_id=[KLAVIYO-PUBLIC-ID]&list_id=W5ffbq`. After a claim it redirects to `/collections/all`.

| Prize | Code | Odds | Store status |
|---|---|---|---|
| 10% Off | `[CODE:prize-10]` | 48 | ACTIVE (10% entire order) |
| 15% Off | `[CODE:prize-15]` | 20 | ACTIVE |
| Free Shipping | `[CODE:prize-freeship]` | 14 | ACTIVE |
| Free Odor Max w/ Purchase | `[CODE:fre-x]` | 10 | **EXPIRED 2026-09-11, so 10% of winners get a dead code** |
| 20% Off | `[CODE:prize-20]` | 8 | ACTIVE |

* **⚠ All codes and odds sit in plain-text `data-config` JSON in the page HTML**, so anyone can read [CODE:prize-20].

### 4.5 Other discount codes in the store (ACTIVE)
* `[CODE:grow-20]`: 20% off, one per customer (was the default announcement-bar message)
* `[CODE:grow-intro-10]` (NanoGrow Max intro), `[CODE:odor-intro-10]` (Nano Odor Max intro): 10%
* `[CODE:winback-15a]`, `[CODE:winback-15b]` (win-back): 15%
* `[CODE:deepclean-25]`: 25%
* `[CODE:deepclean-ship]`: free shipping

Expired: `10OFF`, `BULK50`, `FREE`, `FREE1`, `FREE2`, `[CODE:bloom-ship]`, `Free Shipping — July 2026` (automatic), `Deep Clean Game 25%` (automatic).

### 4.6 App embeds and third-party scripts (live homepage)
| App | How it loads |
|---|---|
| Klaviyo onsite | app embed, `static.klaviyo.com/onsite/js/[KLAVIYO-PUBLIC-ID]/klaviyo.js` |
| Judge.me | app embed `judgeme_core` → `cdn.shopify.com/extensions/.../judgeme-773/assets/loader.js` plus several judge.me CDNs. The widget is placed manually (`sections/judgeme-reviews`) and a badge sits in each hero. |
| BOGOS.io | app embed + `cdn.bogos.io` data file + `collect.bogos.io` / `api.bogos.io` |
| UFE Cross-Sell & Upsell Bundle (helixo) | app embed `ufeWidgetLoader.js`. **No visible placement in the theme**; it loads anyway. |
| Metashop (IG/FB shoppable comments) | app embed `clicktracking.js` |
| Upsell.com (ReConvert) | automatic app discount (post-purchase/checkout); no theme code |
| LogRocket | synchronous `<script>` in `<head>` (main and nom-lp layouts) |
| Contentsquare | deferred `<script>` in `<head>` |
| Shopify shop-js cart sync, storefront standard-actions, preloads | platform |

---

## 5. Images and videos per section

(The base for theme assets is `//nanogrowmax.com/cdn/shop/t/29/assets/`. The base for shop files is `https://cdn.shopify.com/s/files/1/0979/0269/0607/files/`.) **TEXT-BAKED** marks images whose copy lives inside the image.

| Section | Live asset | Notes |
|---|---|---|
| header | files `NGM_Logo_TPBG.png?v=1777436751` (1080², **1.16 MB** original; requested at width=200) | logo |
| hp-hero bg | files `ngm-home-hero-desktop.jpg?v=1783688334` (1672×941, 104 KB) / `ngm-home-hero-mobile.jpg?v=1783688334` (941×1672, 58 KB) | product scene; loaded at width=2400 / 1200, eager, fetchpriority high |
| growth-results-direct | files `ngm-works-anywhere-desktop.jpg?v=1783688239` (1537×908, 218 KB) / `ngm-works-anywhere-mobile.jpg?v=1783688334` (864×1646, 198 KB) | **TEXT-BAKED** "Works anywhere"; width=2400 |
| hp-problem-solution / ngm-problem-solution | files `ngm-problem-solution.jpg?v=1783688238` (1024×1536) | B&W cola, no text |
| hp-problem-solution solution | files `ngm-bundle-bottles.jpg?v=1783688239` (1536×1024) | bottles |
| ngm-problem-solution solution, ngm-product-hero, hp-cta side | files `ngm-home-side-mobile.jpg?v=1783688334` (1642×1920, 234 KB) | 2 bottles, label text visible ("1 pint (16 fl oz)") |
| hp-how-it-works | files `How_it_works_desktop.png?v=1777647434` (**1.71 MB**) / `How_it_works_mobile.png?v=1777647434` (**1.58 MB**) | **TEXT-BAKED** 6-step schedule; **raw PNG URL with no width parameter** |
| works-anywhere-direct | files `ngm-how-it-works-desktop.jpg?v=1783688239` (1536×795, 86 KB) / `ngm-how-it-works-mobile.jpg?v=1783688239` (836×1782) | **TEXT-BAKED** "Engineered for Growth" |
| ngm-usda, about | asset `usda-badge.svg` (2.2 KB) | badge |
| NGM picker thumbs | product media `GroMaxBlackBGBottle.png?v=1776827792`, `RootMaxBlackBGBottle.png?v=1776827772`, `GroMaxBlackBGBottle_874ca088-d41f-41ff-bc66-9d7a8dae9647.png?v=1776828570` (all 1254² PNG); the bundle also has `NanoGrowMaxBundleBottles.png?v=1776827749` (1536×1024) | |
| cb-product-hero | product image `nom-hero-bottle_007e4e7a-fe21-42c4-ae29-dfd9a296764b.jpg?v=1781182217` (1100×1473, 104 KB) | |
| cb-odor-removal-direct | assets `cb-odor-removal-desktop.png` (**915 KB**) / `cb-odor-removal-mobile.png` (**1.52 MB**) | **TEXT-BAKED; still says "Canna Bust"** |
| cb-ugc-video | `https://cdn.shopify.com/videos/c/o/v/0f46f63b304044b3a63c1722c64cfb38.mp4` | in an iframe |
| cb-cta | files `cb-bottle-render.jpg?v=1783688239` (1086×1448, 182 KB; file alt still "Canna Buust spray bottle") | label shows the CANNA-BUUST seal and the SC address |
| case-studies | assets `cs-matt-desktop.webp` (143 KB) / `-mobile.webp`, `cs-alluvial-*.webp`, `cs-ctg-*.webp`, `cs-fieldresults-*.webp` (102–150 KB each) | **all TEXT-BAKED** (see §6) |
| nom LP hero | files `nom-hero-bottle.jpg?v=1781101673` | |
| ngm LP hero | files `ngm-hero-duo.jpg?v=1781139804` (1060×848) | |

**Orphan or unused theme assets**:
* Large PNG twins of every webp: `cs-*-desktop.png` / `-mobile.png` at 1.4–1.7 MB each, `hp-hero-approved-desktop.png` (1.82 MB) / `-mobile.png` (1.62 MB), `works-anywhere-*.png`, `growth-results-*.png`, `ngm-bundle.png` (1.56 MB), `ngm-gromax-dark.png` (1.12 MB), `ngm-rootmax-dark.png` (955 KB), `cb-hero-desktop.png` (1.09 MB), `cb-hero-mobile.png` (1.12 MB), `cb-bottle.png` (627 KB)
* The `hp-cta` fallback is `hp-hero-approved-desktop.png`, and the `cb-cta` mobile fallback is `cb-hero-mobile.png`. Neither is used today because settings override them.
* `growth-results-direct` falls back to `ngm-growth-results-desktop.webp`, which **does not exist**. Its sibling `works-anywhere-direct` falls back to `ngm-works-anywhere-desktop.webp`, which does exist.

---

## 6. Case studies ("The Research", `/pages/case-studies`)
* Label pill `Real Results`; H2 `Case Studies`; sub `See how growers around the world are achieving measurable results with NanoGrow Max.`
* The first block renders as a full-width hero and the rest as a 3-column grid. **Every `pdf_url` is blank, so no "Read Full Case Study" buttons appear.** No images are uploaded; all come from the `asset_key` fallback webps.

1. **Matt Cinquanta — Head Grower, Verified Cultivation Partner** (hero; `cs-matt-desktop.webp` / `-mobile.webp`)
   * Text: `"I fully support NanoGrow Max and believe in the very promising future it holds for our company—and for the future of agriculture."` / `Results observed after a single growing cycle: up to 2× higher yields under identical conditions, stronger root systems with increased plant mass, increased resistance to powdery mildew, and ~5% higher THC potency.`
   * The image (text-baked) shows the same quote and the bullets `Up to 2x higher yields under identical conditions` · `Stronger root systems + increased plant mass` · `Increased resistance to powdery mildew` · `~5% higher THC potency observed`, signed `Matt Cinquanta / Head Grower / ✓ Verified Cultivation Partner`.
2. **Alluvial Trade — Agricultural Field Trials, Nigeria** (`cs-alluvial-*`)
   * Text: `"We wholeheartedly recommend NanoGrow Max—the remarkable results from our field trials clearly demonstrate its efficacy."` / `Field trials conducted across multiple agricultural zones in Nigeria showed consistent yield improvements and improved crop resilience under challenging climate conditions.`
   * The image shows the quote only, with the attribution "Alluvial Trade / Agricultural Field Trials — Nigeria". It contains **no numbers**.
3. **CTG — Independent Yield Comparison** (`cs-ctg-*`)
   * Text: `Head-to-head controlled tests delivering a 41% and 17.5% increase in yield respectively. Financial returns estimated between 200%–600% ROI for cannabis producers. Results replicated across maize, soybean, and rice crops.`
   * Image (`The Results`): `These tests show that our products deliver a 41% and 17.5% increase in yield, respectively.`
     * Row 1: CONTROL 18 plants, 27 lbs / TEST 18 Plants, 38 lbs / GAIN $22,000, 11 lbs
     * Row 2: CONTROL 28 plants, 47.5 lbs / TEST 28 Plants, 55.8 lbs / GAIN $16,600, 8.3 lbs
     * `These results translated into financial returns for cannabis producers; there is potential to deliver between 200% and 600% Return on Investment (ROI). And it's not just Cannabis production where we provide these returns. We have carried out these tests across many other crops, including maize, soybean, and rice using other applications.`
     * NANO GROW MAX lion seal: "BIGGER, HEAVIER, MORE POTENT PLANTS"
   * Note that 38/27 = +40.7%, which is labelled "41%" here and "+40.7%" elsewhere.
4. **Proven Field Results — Multi-Crop, Multi-Region** (`cs-fieldresults-*`)
   * Text: `Independent trials across multiple crops and regions show yield increases of 21.1%–125%. Global field trials (soybeans & rice) and tomato field trials (Philippines) confirm consistent performance improvements across diverse growing conditions.`
   * Image: `Proven Field Results` / `Independent trials across multiple crops and regions show significant yield increases and improved plant performance.`
     * **GLOBAL FIELD TRIALS (Soybeans & Rice)**: Yield Increase `21.1% – 125%`; Treated Yield `Up to 4.5 tons/hectare`; Control Yield `Up to 2 tons/hectare`
     * **TOMATO FIELD TRIAL (Philippines)**: Control `35 tons/hectare`; Treated `53 tons/hectare`; Gain `+18 tons (+51%)`
     * **CORE PERFORMANCE BENEFITS**: `+30% nutrient uptake` · `Stronger root systems` · `Increased drought resistance` · `Extended harvest window`
     * The bottle labels in the image show "Net Content: 1 pint (16 fl oz)".

Additional study data (about page, §2.9): 49-day indoor study (36 plants, 27 → 38 lbs); 115-day outdoor study (56 plants, 47.5 → 55.8 lbs, $16,600); THC study (54 plants, 17.20% → 21.37%); "15% to 55%" range.

---

## 7. SEO
* **Title**: `{{ page_title }}` (+ tags, + "Page N", + ` - NanoGrow Max` unless it already contains the shop name). The live homepage title is just **`NanoGrow Max`**.
* **Meta description**: `page_description` is used when present. The homepage has a hard-coded fallback: `NanoGrow Max nano-encapsulated plant nutrients deliver 100x absorption and a documented +40.7% yield increase. USDA BioPreferred certified, 30-day money-back guarantee, free shipping.`
* Product SEO (`global.title_tag` / `description_tag`):
  * Grow Max: description `Nano-encapsulated cannabis nutrients with 100x absorption. USDA BioPreferred certified. Documented +40.7% yield increase. Ships free.` (no custom title)
  * RootMAX: title `RootMAX by NanoGrow Max | Nano Cannabis Root Development Formula`; description `RootMAX uses nano-encapsulation to maximize cannabis root zone development and nutrient uptake. USDA BioPreferred certified. $54.99 — pairs with GroMAX for the complete system.`
  * GroMax: description `GroMAX delivers nano-encapsulated nutrients directly to cannabis cells during vegetative and flowering stages. 100x absorption. USDA BioPreferred. $54.99 — free shipping available.`
  * Nano Odor Max: no SEO fields, and `seo.hidden = 1`.
* **No Open Graph or Twitter tags in the main `theme.liquid`.** The live homepage has 0 `og:` tags. Only the `nom-lp` layout has og and twitter tags (`og:image` comes only from a page metafield).
* **Canonical**: `{{ canonical_url }}`. `theme-color` is `#050706`. The favicon setting is not set, so `settings_schema.json` is effectively empty (`[]`).
* **Structured data** (`snippets/structured-data`):
  * Product pages get `Product` JSON-LD with name, url, image (1200w), description (stripped, ≤300 chars; this falls back to the title because the NGM descriptions are empty), brand "NanoGrow Max", and an `AggregateOffer` (lowPrice/highPrice/offerCount/availability). Its comment says *"no aggregateRating until real review data exists"*.
  * Odor Max's offer will span **$0.00–$39.99** with **5 offers**, because the $0 gift variant is included.
  * The homepage gets `Organization` with a customer-support email of [OWNER-EMAIL]
  * Judge.me also stores a `review_widget_json_ld` with an AggregateRating (5.00, 1) for Odor Max, injected by the app.
* `/pages/nano-odor-max` has `robots noindex,follow` and a fixed title `Nano Odor Max — Instantly Eliminate Any Odor | Destroys, Doesn't Mask`.

---

## 8. Performance red flags
1. **Huge raw PNGs.** `How_it_works_desktop.png` (1.71 MB) and `_mobile.png` (1.58 MB) are hard-coded CDN URLs **without a `width` parameter**, so the original PNG is served on every homepage view. `cb-odor-removal-*.png` (0.9–1.5 MB) are served via `asset_url`, which cannot be resized. The logo original is 1.16 MB (resized to 200w, so this is fine).
2. **Text-baked images** make up most of the persuasive content: works-anywhere, how-it-works, engineered-for-growth, odor-removal and all 4 case studies. They are not indexable or accessible, they are heavy, and one shows the wrong brand ("Canna Bust").
3. **Render-blocking third parties.** LogRocket loads as a synchronous `<script>` in `<head>`. It also loads Contentsquare, so there are **two session-replay tools**. Klaviyo, Judge.me (many CDNs), BOGOS (data file + glider + lz-string), UFE (loaded but unused), Metashop and shop-js all load on every page.
4. **Duplicate fonts.** Inter loads in `theme.liquid`, and **again** in pick-your-prize together with Cinzel and Cormorant Garamond (4 families on every page). pick-your-prize also adds 33 KB of CSS and 43 KB of JS site-wide.
5. **Oversized hero requests**: `width=2400` desktop background (eager plus fetchpriority) and 2400w for the full-width image sections.
6. **Inline `<style>` and `<script>` in every section** (no `{% stylesheet %}` except case-studies). The CB hero holds 3 overlapping click handlers, a `MutationObserver` on the whole `document.body` (subtree), and a **global `window.fetch` monkey-patch**.
7. **Redundant `/cart.js` fetches on load**: theme.js count sync, the cart-progress script, the drawer upsell `updateUpsell()`, and BOGOS. The drawer upsell does `window.location.reload()` after adding.
8. Section images use plain `<img>` without `srcset` (except use-cases), and many lack `width`/`height`, which causes CLS.
9. The `cb-ugc-video` mp4 sits inside an `<iframe>` (no poster, lazy iframe).
10. Homepage HTML is about 216 KB.

---

## 9. Bugs and inconsistencies to fix in the rebuild
* **Price display vs charge**: the "$11.99 (40% OFF)" Odor Max 2-Pack upsell (PDP bar + drawer) adds the $19.99 variant, and no matching discount exists. Unless Upsell.com applies it, **customers are charged $19.99**.
* The drawer upsell triggers on `growmax`/`rootmax` only, never on the $99.99 bundle, which is the default and best seller.
* The **[CODE:fre-x]** prize code is expired but still has 10% odds in the wheel.
* **The free gift is not communicated** on the main bundle PDP or in the cart (the automatic BXGY gives it).
* The Odor Max single bottle ($12.99) cannot be bought on the main PDP. Compare-at prices are never shown on CB.
* **Old brand "Canna Bust"/"CANNA-BUUST"** remains in the odor-removal image, the bottle seals and file alts. The template is still named `product.canna-bust`.
* **Bottle size conflict**: the label says 1 pint (16 fl oz), while the SKU and LP default say 32 oz. The 5 mL/gal dose is unconfirmed.
* Image slots are swapped (growth-results ↔ works-anywhere), and a fallback asset is missing (`ngm-growth-results-desktop.webp`).
* The GroMax PDP uses a reduced stack (no CTA, no upsell), and every NGM PDP defaults to the bundle radio, even on the GroMax and RootMAX pages.
* Empty block lists (problem/solution bullets and stats, CTA features and trust) render as blank space.
* Hard-coded "Verified Purchase" testimonials (Marcus T., Kai R., Diego M., Trevor K., etc.) are not backed by Judge.me data, and "TRUSTED BY THOUSANDS" sits over 1 review. This is a compliance risk for the rebuild.
* Contact emails disagree (support@ vs [OWNER-EMAIL]). The footer links to `/pages/contact`, which 301s; the real handle is `contact-us`.
* The JS drawer re-render drops the "FREE" gift tag and switches the shipping note to "Shipping & taxes calculated at checkout".
* The Nano Odor Max product is hidden from search and collections (`seo.hidden=1`) while it is the homepage's second CTA.

---

## Appendix: product and variant reference

| Product | Variant | ID | SKU | Price | Compare-at |
|---|---|---|---|---|---|
| Grow Max (`nanogrow-max`) | Default | 56039175618863 | NGM-GRB-32OZ-2PK | 99.99 | 109.98 |
| RootMAX (`rootmax`) | Default | 56401254449455 | NANORT-01-000001Q | 54.99 | — |
| GroMax (`growmax`) | Default | 56733998186799 | NANOGR-01-000001Q | 54.99 | — |
| Nano Odor Max | 1 8oz Bottle | 58065260347695 | CANNAB001 | 12.99 | 18.99 |
| | 2-Pack 8oz Bottles | 58065260380463 | CANNAB002 | 19.99 | 29.99 |
| | 3-Pack 8oz Bottles | 58065260413231 | CANNAB003 | 29.99 | 44.99 |
| | 4-Pack + Free Bonus Bottle | 58065260445999 | CANNAB004 | 39.99 | 59.99 |
| | Free Gift (8oz Bottle) | 58065260478767 | CANNAB001 | 0.00 | — |
| 🎁 Nano Odor Max (100% off) | Free Gift (8oz Bottle) | 58110334665007 | CANNAB001 | 0.00 | — |
| 100% OFF shipping fee | Default | 57822296604975 | — | 0.00 | — |

Fidelity note on the raw files: all saved files match the byte sizes the API reports, except the two `.json` files (`config/settings_data.json`, `templates/page.nano-odor-max.json`). For those, the API returns the content in a formatted form, and that formatted content is what was saved.
