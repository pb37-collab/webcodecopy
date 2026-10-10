# NanoGrow Max: draft theme, store data and live storefront audit

> **Redacted for the public repo:** live discount codes appear as `[CODE:…]` tokens, and tracking IDs and emails are removed. The real values are in Shopify admin (Discounts) and the theme settings.

Audit date: 2026-10-07. Everything was read only; no Shopify mutations were run.
Sources: Admin GraphQL (theme files, products, pages, menus, discounts, delivery profiles), public storefront HTML fetched with curl, and the creatives in `public/content/`.
Raw draft theme files are saved under the session scratchpad (`.../scratchpad/draft-theme/`). Live page HTML is in `.../scratchpad/storefront/`.

---

## 0. Store at a glance

| Item | Value |
|---|---|
| Shop | NanoGrow Max, `https://nanogrowmax.com`, USD |
| Live (MAIN) theme | `Copy of rename-odor-max-grow-max-8-24` (id 188058468655, CDN path `t/29`) |
| Draft audited | `NanoGrow Max — Atelier Redesign DRAFT 2026-09-15` (id 188305244463, `t/30`, UNPUBLISHED, theme_name "NanoGrow Atelier", author "Canna Connect") |
| Other themes | 12 more unpublished themes, mostly old copies and landing-page experiments |
| Products for sale | Grow Max bundle `nanogrow-max` ($99.99, compare-at $109.98), RootMAX `rootmax` ($54.99), GroMax `growmax` ($54.99), Nano Odor Max `nano-odor-max` (5 variants, see below) |
| Hidden gift products | `nano-odor-max-sca_clone_freegift` ($0, tag `bogos-gift`) and `shipping_discount-180408-sca_clone_freegift` ($0, BOGOS "100% OFF shipping fee") |
| Subscriptions | None. `sellingPlanGroups` is empty on every product |
| Shipping | US: flat **Free Shipping, $0**, no conditions, in two profiles ("General profile" and "Free Shipping Items"). International (27 countries: CA, GB, AU, EU, JP, KR, SG, HK, IL, AE, NZ...): carrier-calculated USPS + DHL Express |

---

## Part A: the draft theme (Atelier)

### A1. Architecture

- `layout/theme.liquid` is a minimal shell. It has a skip link, `header-group` → `mx-header`, `<main>`, `footer-group` → `mx-footer`, the `mx-cart` dialog section and the `mx-runtime` snippet. It sets `noindex` on BOGOS gift products, includes JSON-LD `product | structured_data`, uses OG tags and `theme-color #123a2b`.
- `layout/mx-lander.liquid` is an alternate `noindex` layout for paid-traffic landers. It has a minimal header (wordmark, shipping message, cart count) and a minimal policy footer, and it reuses the same cart and runtime.
- All CSS is in one `{% stylesheet %}` inside `snippets/mx-style.liquid` (35 KB). It holds **two stacked revisions**: v1 "Atelier" (paper and serif-free editorial) is followed by "/* Product and evidence direction, revision 2 */", which overrides tokens and adds the dark "power" sections. Much of v1 is now dead CSS or gets overridden.
- All JS is in `snippets/mx-runtime.liquid` (11 KB vanilla JS, `{% javascript %}`). There are no other theme JS libraries.
- Copy lives in `locales/en.default.json` as `mx.copy.c1`–`c168` and `mx.js.*`. Section block content (FAQs, how-to steps, use cases, editorial) lives in `config/settings_data.json`.
- **The templates use hashed duplicate sections** (`mx-home-hero-7679c`, `mx-faq-9be77`, `mx-product-1e92b`...). There are about 30 copies that are byte-identical in size to the non-hashed originals. This is tech debt. Each FAQ variant is a separate section file only so it can hold different blocks.
- The navigation is **hard-coded** in `mx-header` and `mx-footer`. Shopify menus are not used.
- App embeds enabled in `settings_data.json`: Klaviyo onsite, Meta "metashop-instagram-facebook", BOGOS free gift, UFE cross-sell/upsell/bundle, Judge.me core.

### A2. Design tokens

Effective values after the rev-2 override:

| Token | v1 value | **rev-2 (effective)** | Use |
|---|---|---|---|
| `--forest` | #123a2b | **#103b23** | dark buttons, table heads |
| (deep bg, literal) | #102b1d / #0d291f | **#071d13** | hero, system, lifestyle, footer, product image backgrounds |
| `--ink` | #16382c | **#102b1b** | body text |
| `--paper` | #f6f5ee | **#f5f6ef** | page background |
| `--muted` | #626d64 | **#425846** | secondary text |
| `--line` | #d8ddd2 | #d8ddd2 | hairlines |
| `--accent` | #c6ec81 | **#b9f34b** (settings_data accent = #b9f34b) | primary buttons, highlight words, stats, trust strip |
| Light sage surfaces | #e7ebdf, #e8eedc, #e6e7d9 | + #edf1e4, #e8efdf, #e9efdf, #e6f1d6 | section backgrounds and cards |
| Proof greens | — | #244e19, #365f17, #426b18, #4b721c, #85be2e (bar), #6d9d21 (rule) | numbers and accents on light |
| Error | #9a231d on #fff5f3 | — | form and cart errors |
| Focus ring | 3px #558327, offset 5px | — | a11y |

- **Typography: Arial/Helvetica only.** There is no webfont. Rev-2 sets h1–h3 to `font-weight: 850–900` and `letter-spacing: -.045em/-.055em`, and most headlines are UPPERCASE. Arial has no 850/900 weight, so these render as plain bold.
  - Scale: h1 `clamp(48px,6vw,86px)`, hero h1 `clamp(45px,4.7vw,74px)`, h2 `clamp(34px,4.5vw,64px)`/1.04, h3 22–36px.
  - Body 17px/1.6 (16px on mobile). Eyebrow 12px/800/.13em uppercase. Big stats 64–126px.
- **Radii:** buttons 4px (v1 3px); inputs 3px; product images 4px; result and formula cards 10px; cert image 12px; chips 30px pills; cart badge 50%.
- **Spacing:** `.mx-section` padding 100px (60–65px mobile). The container is `min(1320px, 100% - 112px)` (64px gutters under 1100px, 40px under 750px). Grid gaps run 12/20/28/38/70/120/140px. Breakpoints are 749px, 1100px, 1450px and 1500px.
- **Buttons:** 58px min-height, 15×24 padding, 14px/850. Variants are `.mx-button` (lime), `.mx-button-dark` (forest, white text) and `.mx-button-outline`. Hover lifts by translateY(-2px). Every CTA ends with "↗".
- **Shadows:** almost none. One sticky-bar shadow `0 -2px 20px #1735261c` and the mobile menu shadow. The backdrop is blurred to 3px.
- **Motion:** only hover transitions (image scale 1.035, button lift) and smooth scroll. `prefers-reduced-motion` is honored. There are no entrance animations, no parallax, no video.

### A3. Section structure per page

**Home (`templates/index.liquid`)**
1. `mx-home-hero`, a "power hero" on #071d13 in two columns.
   - Left column:
     - Kicker "✓ USDA CERTIFIED BIOBASED PRODUCT"
     - Eyebrow "GROW MAX / THE TWO-BOTTLE GROWING SYSTEM"
     - H1 "GROW STRONGER. / HARVEST MORE." (second line in lime)
     - Lead paragraph
     - Stat row "+40.7% MORE YIELD — Reported cultivation comparison*"
     - CTAs "SHOP THE GROW MAX BUNDLE ↗" and "SEE THE RESULTS ↗"
     - Offer line "$99.99 · Free Odor Max gift · Free standard U.S. shipping"
     - Footnote "*27 lb control vs 38 lb treated, 18 plants per group..."
   - Right column: `mx-v2-bundle.jpg` with an edge fade mask, and the caption "ONE SYSTEM. TWO COMPLEMENTARY FORMULAS."
   - Below the hero, a lime trust strip: USDA CERTIFIED BIOBASED · DOCUMENTED GROWING RESULTS · 30-DAY MONEY-BACK GUARANTEE · Free standard U.S. shipping.
2. `mx-proof` ("THE NUMBERS BEHIND THE GROW / MORE THAN A PROMISE. RESULTS YOU CAN READ."). Three white stat cards with CSS bar charts:
   - +40.7% (27→38 lb, 18 plants)
   - +17.5% (47.5→55.8 lb, 28 plants)
   - +51% tomatoes, Philippines (35→53 t/ha)
   - A source note follows the cards.
3. `mx-featured` ("THE EVERYDAY UPGRADES / Good things start here."). Two cards, Grow Max bundle and Odor Max (2-Pack shown by default), each with a pill label, price and strike-through price, and "+ Free 8oz Odor Max with the system".
4. `mx-story` (system, dark). "TWO FORMULAS. ONE BIGGER AMBITION." with RootMAX and GroMAX formula cards (`mx-v2-root.jpg`, `mx-v2-gro.jpg`) and a "Better together" CTA bar.
5. `mx-use-cases`, four bordered sage cards: Herbs & vegetables / Lawns & landscapes / Indoor cultivation (cannabis where permitted) / Other crops.
6. `mx-certification`, USDA Certified Biobased. Shows the `mx-stock-gro.jpg` packshot, the copy, a link to biopreferred.gov and the disclaimer "not organic certification".
7. `mx-lifestyle` (Odor Max, dark). `mx-v2-odor.jpg` with "BIG ON FRESH. / TOUGH ON ODORS.", chips HOME/CAR/FABRICS/GYM BAGS, and the CTA "SHOP ODOR MAX".
8. `mx-faq` ("A LITTLE CLARITY / Good questions. Clear answers."). Four Q&As: which product, different crops, is shipping free, the guarantee.
9. `mx-newsletter`, a lime band. "A LITTLE GOOD IN YOUR INBOX / Stay in the grow." It is a Shopify `customer` form with tags `newsletter,atelier-theme` and a required consent checkbox.

**Product pages** (`product.liquid`, `product.nanogrow-max.liquid`, `product.rootmax.liquid` are identical; Odor Max uses `product.canna-bust.liquid`)
- Grow pages: `mx-product` → `mx-how` ("Two formulas. A considered routine.": Read & measure / Match the application / Observe & repeat) → `mx-use-cases` → `mx-reviews` (Judge.me) → `mx-faq` (5 Qs) → `mx-featured` → **then** `mx-proof` + `mx-certification` are appended after the cross-sell. This order is odd: the proof ends up below "related products".
- Odor Max: `mx-product` → `mx-how` ("Fresh starts with a simple routine.": Choose the source / Apply as directed / Let it dry) → `mx-lifestyle` → `mx-reviews` → `mx-faq` (bottle size, where to use, precautions, guarantee) → `mx-featured`.

**Case studies (`page.case-studies.json`)**: `mx-research` → `mx-certification` → `mx-featured`.
- `mx-research` opens with a dark hero ("THE PROOF. / BEHIND THE GROW.").
- `#ctg` holds the trials table:

  | Trial | Plants per group | Control | Treated | Change |
  |---|---|---|---|---|
  | 1 | 18 | 27 lb | 38 lb | +40.7% |
  | 2 | 28 | 47.5 lb | 55.8 lb | +17.5% |

- `#field-trials` covers 35→53 t/ha and the 21.1–125% range for soybeans and rice.
- The partner quotes come from Alluvial Trade (Nigeria) and Matt Cinquanta (head grower).
- Each original graphic (`cs-ctg-desktop.webp`, `cs-fieldresults-desktop.webp`, `cs-alluvial`, `cs-matt`) sits behind a `<details>` "OPEN THE ORIGINAL ... GRAPHIC".

**About (`page.about.liquid`)**: `mx-editorial` ("OUR APPROACH / A little science. A lot of possibility.", 3 blocks: Grow Max / Odor Max / Clarity comes first) followed by `mx-featured`.

**Other templates**
- Cart: `mx-cart-page`
- Collection: `mx-collection`, a two-column grid of `mx-card`
- Default page: `mx-page`, prose; also renders a contact form when the handle is `contact-us`
- Search: `mx-search`
- 404: `mx-not-found`

### A4. Product purchase section (`mx-product`)

- Layout: a two-column grid (1.1fr / 1fr, 70px gap). The gallery is sticky on desktop.
- Gallery:
  - The main image is the `mx-v2-*` AI scene on #071d13, aspect 1.15.
  - There are **only two thumbnails**: the scene and the `mx-stock-*` packshot. Shopify product media is ignored whenever art exists.
  - A pill sits on the image ("THE COMPLETE SYSTEM" / "PLANT NUTRITION" / "EVERYDAY ODOR CARE").
- Info column, in order:
  1. Eyebrow (`NanoGrow Max / BETTER GROWING`)
  2. H1 is the product title, except Odor Max, which is shown as "Odor Max"
  3. Subtitle: bundle "Two formulas. One powerful growing system."; rootmax "Start strong, below the soil."; gromax "Support the growth above."; odor "Life happens. Fresh starts here."
  4. Paragraph
  5. Bundle only: a proof callout "+40.7% reported yield · 27 → 38 lb · 18 plants per group · Results vary · EXPLORE THE EVIDENCE ↗"
  6. "✓ USDA CERTIFIED BIOBASED PRODUCT" link, on non-odor products
  7. Price with compare-at and the note "The two-bottle system" / "One-time purchase"
  8. **Native `<select>`** of variants with price > 0. Odor Max preselects the 2-Pack.
  9. Bundle with `show_gift`: a "+ A fresh extra, on us. Free 8oz Odor Max with your Grow Max system. Your gift is confirmed in the bag before checkout." box
  10. Quantity input plus a full-width dark "Add to bag ↗"
  11. Trust line (free US shipping, 30-day money-back) and the tax note
  12. Accordions "What arrives" and "Shipping & the guarantee" (1–3 business-day processing, 3–7 day delivery, refund within 30 days, no return needed)
- Mobile sticky ATC bar: product name, price and "Add to bag". It appears once the form scrolls out of view (IntersectionObserver).
- JS behavior:
  - Add-to-cart goes through AJAX `cart/add.js`, then the drawer re-renders through the Section Rendering API (`?section_id=mx-cart`).
  - For the bundle it **polls `cart.js` up to 8×700 ms** until BOGOS adds the $0 Odor Max. Otherwise it shows the gift error.
  - Klaviyo "Added to Cart" and "Viewed Product" events and the Meta `ViewContent` event (landers only) are consent-gated through `Shopify.customerPrivacy`.
  - UTM, fbclid and gclid parameters are kept in sessionStorage and appended to internal links and the checkout URL.

### A5. Cart

- **Drawer** (`mx-cart`): a native `<dialog>` slides from the right, max 520px wide, on a blurred backdrop.
  - Head: "Your bag (n)" with a close "×".
  - Body:
    - A sage "✓ Free standard U.S. shipping" row
    - Line items: 70×88 image, title, variant, qty input with 400 ms debounce through `cart/change.js`, Remove link, and line discounts
    - BOGOS $0 lines are relabelled "Odor Max — complimentary gift" and get no qty control
  - Footer: cart-level discounts, Subtotal, the tax note, a gift status line (`aria-live`), "Continue to checkout ↗" (re-checks the gift first), and the links "View full bag" and "30-day guarantee".
  - Empty state: "GOOD THINGS START HERE / Room for a little upgrade." plus a CTA.
- **Cart page** (`mx-cart-page`): "ALMOST YOURS / Your bag." with line rows, an Update bag button and "Continue to checkout".
- Missing from the cart:
  - No upsell or cross-sell (UFE is enabled as an app embed, but the draft has no app block slot)
  - No progress bar (gift or free shipping)
  - No discount-code field, no trust badges and no payment icons
  - No express checkout buttons (Shop Pay, Apple Pay) in the drawer

### A6. Images used by the draft (`assets/mx-*`)

| File | Px (CDN) | What it shows | Used where |
|---|---|---|---|
| `mx-v2-bundle.jpg` | 1536×1024 | Two real white 16 oz GroMAX/RootMAX bottles (original dark NANO GROW MAX lion label, USDA biobased mark) on soil. Ripe cherry tomatoes on the left, basil on the right, dark green studio background. AI-composited "hero scene". | Home hero, research hero, bundle PDP and card |
| `mx-v2-gro.jpg` | 1536×1024 | Single GroMAX bottle, centered, dark forest-green seamless background with green rim light | Story card, GroMax PDP and card |
| `mx-v2-root.jpg` | 1536×1024 | Single RootMAX bottle, same dark green studio treatment | Story card, RootMAX PDP and card |
| `mx-v2-odor.jpg` | 1536×1024 | Clear 8 oz Nano Odor Max spray bottle (real "CANNA-BUUST" lion label, "Odor eliminator · instantly removes smoke odors...") on a dark green table in a moody green living room with a velvet sofa, plant and folded cream towel | Odor Max lifestyle band, Odor PDP and card |
| `mx-stock-bundle.jpg` | 1536×1024 | Original packshot: both bottles on black | PDP thumbnail |
| `mx-stock-gro.jpg` | 1254×1254 | GroMAX packshot on white | Certification section, PDP thumbnail |
| `mx-stock-root.jpg` | 1254×1254 | RootMAX packshot on white | PDP thumbnail |
| `mx-stock-odor.jpg` | ~1100×1467 | Odor Max spray packshot on white (label legible, including the brand address) | PDP thumbnail |
| `mx-home.jpg` | 1536×1024 | Warm, sunlit luxury living room: linen sofa, olive cushion and throw, travertine coffee table, olive branches, fiddle-leaf fig. No product. | **Unused** (the `home_image` setting is declared but never rendered) |
| `mx-botanical.jpg` | 1536×1024 | Greenhouse "product stage": empty dark stone plinth on the left, basil pot and vine tomatoes on the right, misty green light, burlap cloth. Built as a background for product compositing. | **Unused** (the `hero_image` setting is declared but never rendered) |

The draft theme also holds older, unused creative assets worth reusing:
- `cs-*-desktop/mobile.webp` (original case-study graphics)
- `hp-hero-approved-desktop/mobile`, `growth-results-*`, `works-anywhere-*`
- `ngm-home-hero-*`, `ngm-problem-solution.webp`, `ngm-how-it-works-*`
- `ngm-gromax-dark.png` / `ngm-rootmax-dark.png`
- `dc-z1/z2-before/after.jpg` (Deep Clean odor before/after)
- `cb-hero-*`, `cb-odor-removal-*`, `usda-badge.svg`

### A7. Verdict on the draft

**What is good**
- The information architecture and conversion logic are clean: a hero offer, proof, products, the system story, use cases, the certification, Odor Max, FAQ and email capture.
- The claim discipline is strong. Every stat is footnoted with sample sizes, there is a "Results vary" note, the USDA mark is explained as biobased rather than organic, and copy is label-first. This is far safer than the live site (see C3).
- The evidence page is genuinely good: a real table, CSS bar charts, and the source graphics behind toggles.
- The tech is lean and accessible: about 11 KB of JS, native `<dialog>`, focus management, skip links, `aria-live`, reduced motion, consent-gated analytics, UTM persistence and Section Rendering API cart updates.
- The palette is coherent and ownable: deep forest #071d13 with acid lime #b9f34b on paper #f5f6ef.
- The BOGOS gift confirmation loop prevents checkout without the promised gift.

**What is weak (the "lacking visuals" problem)**
1. **Only 4 images carry the whole site.** The four `mx-v2` renders appear on home, PDPs and case studies. The same bundle shot is the hero, the research hero and the PDP main image. There are no people, gardens, harvests, before/after, grow rooms, macro textures, UGC or video. `mx-home.jpg` and `mx-botanical.jpg` were produced but never wired in.
2. **The PDP gallery is thin.** It has 2 thumbnails, no how-to imagery, no label close-ups, no scale or in-hand shots and no comparison graphic. Shopify product media is bypassed.
3. **The typography is generic.** Arial set at weight 900 reads as a default. There is no display face, no serif or mono contrast and no type-driven moments. The live site at least loads Cinzel, Cormorant Garamond and Inter.
4. **There is no motion or depth.** No scroll reveals, no counters on the +40.7% stat, no animated bar charts, no hover states beyond a scale and no sticky storytelling. The flat dark and sage bands repeat in sequence.
5. **The purchase UX is a plain `<select>`.** There are no tier cards for the Odor Max 1/2/3/4+1 ladder (no per-bottle price or "save X%"), no bundle-vs-single comparison for Grow Max and no subscribe option.
6. **There is no social proof.** Grow Max has **0 Judge.me reviews**, so the reviews section hides itself. Odor Max has 1. There are no testimonials, UGC strip, press, "as seen on" or grower count.
7. **The how-to is vague.** "Follow the label" ×3. The X-account chart already gives concrete steps (2 mL per 1 L, soil prep at −9 and −5 days, foliar routine; see `HOW_TO_USE_SOURCE.md`).
8. **The draft drops discount and capture mechanics.** The live "Pick Your Prize" game popup (codes [CODE:prize-10/15/20]/[CODE:prize-freeship]) is gone. There is no announcement-bar promo, no cart upsell (UFE has no slot), no exit or abandon capture and no code field.
9. **Template hygiene needs work.** There are 30+ hashed duplicate sections, two stacked CSS revisions, hard-coded nav and prices in hero copy (`all_products['nanogrow-max']`), and `asset_url` images without `srcset` (1536 px served to mobile).
10. **PDP section order is off.** Proof and certification render after "related products". The bundle's main selling point sits below the fold of the cross-sell.
11. **Branding is inconsistent.** The brand appears as "NanoGrow Max", "Grow Max", "GroMax", "GroMAX", "RootMAX" and "Odor Max" vs product title "Nano Odor Max". The wordmark is text only, with no logo or lion crest, even though the label crest is the brand's most recognizable asset.

---

## Part B: store content and configuration

### B1. Products (Admin data)

**Grow Max**: `nanogrow-max`, id 14234610762031, template `nanogrow-max`

| Field | Value |
|---|---|
| Variant | Single, SKU NGM-GRB-32OZ-2PK, **$99.99**, compare-at **$109.98**, inventory 995 |
| `descriptionHtml` | **empty** |
| SEO title | (none) |
| SEO description | "Nano-encapsulated cannabis nutrients with 100x absorption. USDA BioPreferred certified. Documented +40.7% yield increase. Ships free." |
| Metafields | `global.description_tag` (same text) |
| Media | `GroMaxBlackBGBottle_874ca088...png` (1254²), `RootMaxBlackBGBottle_fd98f9ed...png` (1254²), `NanoGrowMaxBundleBottles.png` (1536×1024). All have **empty alt**. |

**RootMAX**: `rootmax`, id 14571744985391, template `rootmax`

| Field | Value |
|---|---|
| Variant | SKU NANORT-01-000001Q, **$54.99**, no compare-at, inventory 147 |
| `descriptionHtml` | **empty** |
| SEO title | "RootMAX by NanoGrow Max \| Nano Cannabis Root Development Formula" |
| SEO description | "RootMAX uses nano-encapsulation to maximize cannabis root zone development and nutrient uptake. USDA BioPreferred certified. $54.99 — pairs with GroMAX for the complete system." |
| Metafields | `global.title_tag`, `global.description_tag` |
| Media | `RootMaxBlackBGBottle.png` (1254²), empty alt |

**GroMax**: `growmax`, id 14892235620655, default template

| Field | Value |
|---|---|
| Variant | SKU NANOGR-01-000001Q, **$54.99**, inventory 144 |
| `descriptionHtml` | **empty** |
| SEO description | "GroMAX delivers nano-encapsulated nutrients directly to cannabis cells during vegetative and flowering stages. 100x absorption. USDA BioPreferred. $54.99 — free shipping available." |
| Media | `GroMaxBlackBGBottle.png` (1254²), empty alt |

**Nano Odor Max**: `nano-odor-max`, id 16021226357039, template `canna-bust`, inventory 1439

| Variant | SKU | Price | Compare-at |
|---|---|---|---|
| 1 8oz Bottle | CANNAB001 | $12.99 | $18.99 |
| 2-Pack 8oz Bottles | CANNAB002 | $19.99 | $29.99 |
| 3-Pack 8oz Bottles | CANNAB003 | $29.99 | $44.99 |
| 4-Pack + Free Bonus Bottle | CANNAB004 | $39.99 | $59.99 |
| Free Gift (8oz Bottle) | CANNAB001 | $0.00 | — |

- `descriptionHtml`: "Nano-technology odor eliminator in 8oz spray bottles. Destroys odor molecules instead of masking them — smoke, cooking, pets, gym, car. Fabric-safe and fast. 30-day money-back guarantee."
- SEO title and description: none.
- **Metafield `seo.hidden = 1`, so this main product is hidden from search engines and sitemap.** This is probably a mistake; it should be removed.
- Other metafields: `judgeme.badge`, `judgeme.widget`, `judgeme.review_widget_data`, `judgeme.review_widget_ssr_html`, `judgeme.review_widget_json_ld`, `reviews.rating` = 5.0, `reviews.rating_count` = 1.
- Media: `nom-hero-bottle_007e4e7a...jpg` (1100×1473), alt "Nano Odor Max odor eliminator spray bottle".
- Image base URL for all products: `https://cdn.shopify.com/s/files/1/0979/0269/0607/files/`.

**Gift clones** (BOGOS): `nano-odor-max-sca_clone_freegift` ($0, `seo.hidden`, `secomapp.freegifts.product_url`) and `shipping_discount-180408-sca_clone_freegift`.

**Collections**: `frontpage` ("Home page", 2 products) and `nanogrow-max` (2 products). There is no Odor Max collection, and `/collections/all` on the live site lists only GroMax, Grow Max and RootMAX.

### B2. Pages

| Handle | Title | Template | Notes |
|---|---|---|---|
| contact-us | Contact Us | (Default page) | Form + "Prefer email?" |
| about | About | about | |
| case-studies | Case Studies | case-studies | "Real Results From Real Growers..." |
| refund-policy | Refund Policy | default | "30-Day Money-Back Guarantee — Every NanoGrow Max order is covered..." |
| shipping-policy | Shipping Policy | default | "Free Shipping — Every Order. Right now, shipping is FREE on every order — no minimum..." |
| terms-of-service | Terms of Service | default | |
| data-sharing-opt-out | Your Privacy Choices | default | CCPA opt-out |
| canna-bust | Odor Max | default | empty, legacy |
| nano-grow-max | Grow Max | default | empty, legacy |
| nano-nutrient | NanoGrow Max | nano-nutrient | LP |
| nano-odor-max | Nano Odor Max | nano-odor-max | LP |
| bundles | Bundles | default | empty |
| collection-bundle | Mix and Match | default | FastBundle leftover |
| flip-unlock | Flip to Unlock | flip-unlock | gamified LP |
| feed-and-bloom | NanoGrow Max — Feed & Bloom | feed-bloom | LP |
| deep-clean | The Deep Clean | deep-clean | Odor Max game LP |

### B3. Policies

The Shopify legal policies set are:
- **Privacy policy** → `/policies/privacy-policy`
- **Refund policy** → `/policies/refund-policy`

**Shipping policy, Terms of service and Contact information are not set as Shopify policies.** Shipping and terms exist only as pages (`/pages/shipping-policy`, `/pages/terms-of-service`). In the redesign, either keep linking the pages or migrate them into Shopify policies, which checkout surfaces automatically.

Support contact is inconsistent across the store:
- The store contact email is a Gmail address.
- The draft uses `parker@nanogrowmax.com`.
- The live Odor Max FAQ says `support@nanogrowmax.com`.

Pick one.

### B4. Navigation menus

- `main-menu`: Home `/` · Grow Max `/products/nanogrow-max` · Odor Max `/products/nano-odor-max` · Case Studies `/pages/case-studies` · Catalog `/collections/all` · Contact `/pages/contact-us`
- `footer`: Search `/search` · Your Privacy Choices `/pages/data-sharing-opt-out`
- `customer-account-main-menu`: Orders, Profile (new customer accounts)
- The live theme does not render `main-menu` exactly. Its header shows Home, Grow Max, Odor Max, About, Case Studies.

### B5. Discounts (all 25; 13 active)

**Active, to integrate**

| Title | Type | Code | Value / rule | Combines with |
|---|---|---|---|---|
| Free 8oz Odor Max with the GroMax + RootMax bundle | **Automatic BXGY** | — | "Spend $99.99, get 1 item free" (from 2026-08-26) | — |
| Upsell.com | **Automatic app discount** (Upsell.com ex ReConvert) | — | Post-purchase / upsell offers (2026-04-30 → 2076) | — |
| BOGOS Free Shipping | Code app discount (BOGOS.io "BOGOS Gift") | `BOGOS-GFSis504` (app-managed) | Free shipping gift, 2 uses | — |
| [CODE:grow-20] | Code, basic | `[CODE:grow-20]` | 20% off entire order, one use per customer | none |
| Pick Your Prize – 10% Off | Code, basic | `[CODE:prize-10]` | 10% off order | none |
| Pick Your Prize – 15% Off | Code, basic | `[CODE:prize-15]` | 15% off order | none |
| Pick Your Prize – 20% Off | Code, basic | `[CODE:prize-20]` | 20% off order | none |
| Pick Your Prize – Free Shipping | Code, free shipping | `[CODE:prize-freeship]` | Free shipping, all countries | — |
| NanoGrow Max — 10% Intro | Code, basic | `[CODE:grow-intro-10]` | 10% off order | order + product + shipping |
| Nano Odor Max — 10% Intro | Code, basic | `[CODE:odor-intro-10]` | 10% off order (1 use) | order + product + shipping |
| Abandoned Cart Win-Back — 15% Off | Code, basic | `[CODE:winback-15a]` | 15% off order | none |
| Win-Back 15% (Abandoned Checkout) | Code, basic | `[CODE:winback-15b]` | 15% off order | shipping |
| [CODE:deepclean-ship] | Code, free shipping | `[CODE:deepclean-ship]` | Free shipping, all countries (from 2026-09-01) | — |
| [CODE:deepclean-25] | Code, basic | `[CODE:deepclean-25]` | 25% off order | product + shipping |

**Expired (historical reference only)**

| Title | Code | Value |
|---|---|---|
| 10OFF | `10OFF` | 10% |
| Zero Discount-FastBundle | (blank) | $0, FastBundle leftover |
| BULK50 | `BULK50` | BXGY, buy 1 get 1 50% off |
| BOGOS 40% Off Canna Buust | (app code) | thank-you-page upsell |
| Pick Your Prize – Free Odor Max w/ Purchase | `[CODE:fre-x]` | 100% off Odor Max, min $1 |
| FREE | `FREE` | 100% off |
| FREE1 | `FREE1` | 100% off, 7 uses |
| FREE2 | `FREE2` | free shipping |
| Free Shipping — July 2026 | — | automatic, 27 uses |
| [CODE:bloom-ship] | `[CODE:bloom-ship]` | free shipping |
| Deep Clean Game — 25% Off Nano Odor Max | — | automatic, 11 uses |

**Implications for the redesign**
- The bundle gift has **two mechanisms**: the native automatic BXGY ("spend $99.99 get 1 free") and BOGOS (app embed plus the $0 clone product that the draft JS waits for). Confirm which one is authoritative so the cart does not double-add or show a $0 line twice.
- The live PDP shows "Odor Max 2-Pack, 40% OFF, $11.99 (was $19.99)". That is an in-page upsell from UFE (Helixo) or Upsell.com, not a discount code.
- The "Pick Your Prize" game ([CODE:prize-10/15/20]/[CODE:prize-freeship]) is live on every page. The draft drops it.
- Most code discounts do not combine. With the automatic BXGY gift active, a customer entering `[CODE:prize-20]` or `[CODE:grow-20]` may lose the gift or be blocked. Test the combinations before launch.
- US shipping is already $0 at the rate level, so the [CODE:prize-freeship], [CODE:deepclean-ship] and BOGOS shipping codes only matter for international orders.

### B6. Apps

`appInstallations` returned "access denied". Apps were inferred from the theme app embeds and the storefront instead:

| App | What it does |
|---|---|
| Klaviyo | Onsite forms plus web pixel, account `[KLAVIYO-PUBLIC-ID]` |
| Judge.me | Reviews |
| BOGOS.io Free Gift | secomapp; gift clones, gift and shipping codes |
| UFE Cross-sell / Upsell / Bundle (Helixo) | Upsells and bundles |
| Upsell.com ex ReConvert | Automatic app discount |
| Meta "Facebook & Instagram" / metashop shoppable comments | Pixel ID `[META-PIXEL-ID]` |
| FastBundle | Legacy; leftover discount and Mix-and-Match page |
| LogRocket | Session replay |
| Contentsquare UXA | Analytics |
| Google Analytics 4 | Custom pixel |

---

## Part C: live storefront (`nanogrowmax.com`, MAIN theme t/29)

### C1. Navigation and layout

- Announcement bar: "🚚 FREE SHIPPING on Every Order — Limited Time | Results Guaranteed or Your Money Back".
- Header: Home · Grow Max · Odor Max · About · Case Studies · Cart (0). There is no Catalog or Contact in the header.
- Footer:
  - Tagline "Feed the plant. Dominate the harvest."
  - Contact Us
  - Legal: Privacy policy, Refund policy, Cookie preferences, Refund Policy (page), Shipping Policy, Terms of Service
  - "© 2026 NanoGrow Max . All rights reserved."
- **The footer has no social icons.**
- Site-wide "Pick Your Prize" modal: email + consent, then choose a game to reveal a code.
- Fonts: Google Fonts **Cinzel** (500–800), **Cormorant Garamond**, **Inter** (400–900).

### C2. Page content

- **Home**
  - Hero "Feed the Plant. Dominate the Harvest." Stats "+40.7% More Yield · **+24.2% More THC** · 100x Faster Absorption". Buttons Shop Grow Max / Shop Odor Max.
  - Trust row: 30-Day Money-Back, "Lab Tested. Grower Approved.", "Premium Ingredients Only", Free Shipping.
  - Problem/Solution, then How It Works.
  - "Real Growers. Real Results." with stats and four testimonials (Marcus T. CO, Trevor K. CA, Jessica T. OR, J. Williams MI), all labelled "Verified Purchase".
  - Final CTA "Join over 1,000 growers".
- **Grow Max, RootMAX and GroMax PDPs** share one layout:
  - "Premium Cannabis Growth Formula" with a 3-option tile picker: GROMAX ONLY $54.99 / ROOTMAX ONLY $54.99 / FULL BUNDLE "BEST VALUE · Save $9.99" $99.99.
  - Qty, Add to Cart and "BUY NOW · CHECKOUT INSTANTLY".
  - Bullets:
    - "Boosts yields up to 40% in clinical trials"
    - "Works with soil, coco, and hydro"
    - "USDA-compliant, no banned substances"
    - "One formula — veg through late flower"
  - Odor Max 2-Pack upsell at 40% off ($11.99).
  - USDA BioPreferred block ("Verified organic-derived...").
  - Comparison table vs Salt-Based Nutes / Organic Teas / Cal-Mag.
  - Three dated testimonials (Marcus T., Kai R., Diego M., 2025), then the Judge.me "Customer Reviews" widget, which is empty for Grow Max.
- **Odor Max PDP**
  - "Premium Cannabis Odor Eliminator", ★ 1 review.
  - Tiles: 2-Pack $19.99 / 3-Pack $29.99 / 4-Pack + 1 FREE "BEST VALUE" $39.99. The 1-bottle option is not offered as a tile.
  - "See It In Action" (video), then a comparison vs Febreze / Ozium / Generic Sprays.
  - One quote, then a 10-question FAQ: pet-safe; ~250 sprays per bottle; 60 seconds; wholesale via support@.
  - Trust row: Secure Checkout, Free Shipping, 30-Day Returns, Pet Safe, Biodegradable.
- **Case Studies**
  - Matt Cinquanta: "up to 2× higher yields", "~5% higher THC", powdery-mildew resistance.
  - Alluvial Trade (Nigeria).
  - CTG: 41% and 17.5%, "200%–600% ROI".
  - Field results: 21.1%–125%.
- **About**: The co-launch with **CannaConnect** agency and "2M+ Network Reach · This launch runs through **@WeedPorns** and the full CannaConnect network. The largest cannabis community on X." It also mentions the Alluvial Trade multi-crop trials in Africa.

### C3. Claims and compliance flags (live site, for the redesign to fix)

- "+24.2% More THC", "100x absorption", "clinical trials", "USDA-compliant", "Verified organic-derived" (the USDA mark is *biobased*, not organic), "Pet and child safe", "200–600% ROI".
- Testimonials are labelled "Verified Purchase" while Judge.me holds **0 Grow Max reviews** and only 1 Odor Max review. This is a risk under the FTC fake-review rule.
- Product SEO descriptions lean on "cannabis". Meta and Google ad policy should be considered if those PDPs are ad landing pages.
- The draft's restrained, footnoted copy is the right direction.

### C4. Third-party scripts on `/products/nanogrow-max`

- **60 `<script>` tags**: 16 external `src` and about **123 KB of inline JS**.
- HTML is about 242 KB uncompressed (home 216 KB, Odor PDP 251 KB).
- 8 stylesheets. 11 `<img>` tags.
- Measured external JS+CSS was about 313 KB uncompressed. That figure excludes Klaviyo, LogRocket, Contentsquare and the BOGOS data file, which the proxy blocked. **Realistic total page weight is about 1.5–2.5 MB** with images and lazy-loaded app bundles.

External sources:
- Shopify core: `origin_trials`, `load_feature`, `perf-kit`, `portable-wallets` (accelerated checkout), `shop-js` cart-sync, `standard-actions`, `checkouts/internal/preloads.js`.
- Theme `t/29`: `theme.js`, `theme.css`, `pick-your-prize.js`/`.css`.
- **Klaviyo** `static.klaviyo.com/onsite/js/[KLAVIYO-PUBLIC-ID]/klaviyo.js`.
- **Judge.me** `judgeme-773/loader.js` + `shopify_v2.css`, with assets from judge.me, cdn/cdn1/cdn2.judge.me and api.judge.me.
- **BOGOS** `freegifts-233` (glider, lz-string, freegifts-main.css) + `cdn.bogos.io/.../freegifts_data_*.min.js` + `collect.bogos.io`.
- **UFE (Helixo)** `ufe-extensions-48/ufeWidgetLoader.js`.
- **Meta shoppable comments** `ig-fb-shoppable-comments-67/clicktracking.js`.
- **LogRocket** `cdn.logrocket.io/LogRocket.min.js` (session replay).
- **Contentsquare** `t.contentsquare.net/uxa/c8eee6e1d6d21.js` (session analytics).

Web pixels (Customer Events):
- Klaviyo
- Judge.me
- BOGOS
- **Meta Pixel [META-PIXEL-ID]**
- One app pixel tied to the shop (likely UFE or Upsell)
- A **custom "Google Analytics 4"** pixel

There is no TikTok or Pinterest pixel and no GTM.

### C5. Reviews and social

- Judge.me: Grow Max, RootMAX and GroMax have **0 reviews**. Nano Odor Max has **1 review, 5.0★** (verified, 2026-08-26).
- Social links:
  - **No Instagram, TikTok, Facebook or YouTube links anywhere** in header, footer or pages.
  - The only social link is **X: `https://x.com/WeedPorns`** in the About page body. That is the CannaConnect partner and community account, not a brand-owned handle.
  - `HOW_TO_USE_SOURCE.md` refers to "the brand's X account", but its handle is not on the site. Ask the owner for the brand's own X, Instagram and TikTok handles.
- `/cart.js` is reachable (empty cart JSON; currency USD; `cart_level_discount_applications` and `discount_codes` arrays present). The AJAX cart API is usable for a headless or Next.js cart.

---

## Part D: existing ad creatives in the repo (`public/content/`)

> **Label caution:** many `ngm/` ads show a *redesigned* label: green panel, gold lion crest, "GRO MAX / ROOT MAX · Growth/Root formula". The real bottles (and all store and draft photos) carry the original black-and-green "NANO GROW MAX · Bigger, Heavier Yields" label with the red and gold lion roundel. Likewise the `nom/` ads show a clean "NANO ODOR MAX · ODOR ELIMINATOR" gold-lion label, while the real bottle says "CANNA-BUUST". Decide which label is canonical before using either on the site.

| File | What it shows · claims and numbers printed |
|---|---|
| `ngm/NGM_S1_beforeafter.webp` | Split tomato plant: wilted "UNFED" on the left vs lush, fruit-laden "FED WITH NANOGROW MAX" on the right. Headline "ONE FED. ONE DIDN'T." · "+40% bigger harvest — verified field trial" · yellow "+40%" burst · CTA "SEE THE 2-STEP FEED" · 30-day guarantee seal (new-label bottles) |
| `ngm/NGM_S2_HOA.webp` | Giant tomato, zucchini and peppers in a sunny backyard bed. "YOUR HOA IS NERVOUS. Plants this big don't happen by accident." · "More nutrient per drop — absorbed deeper, not washed away" · "+40% — verified field trial" · CTA "GROW WITHOUT LIMITS" · 30-day seal |
| `ngm/NGM_S3_gardener.webp` | Shocked neighbor in a sun hat over a white picket fence, looking at an abundant flower and vegetable garden. "PEOPLE THINK YOU HIRED A GARDENER. You just feed smarter." · "+40% bigger harvests — verified trial" · CTA "GROW LIKE A PRO" · 30-day seal |
| `ngm/NGM_S4_testimonial.webp` | Dark card with a soybean and rice field photo. Quote "The remarkable test results demonstrate their efficacy — we wholeheartedly recommend and endorse Nano Grow Max." attributed to Dimieari Von Kemedi, CEO, Alluvial Trade (independent soybean & rice field trials) · CTA "TRY IT RISK-FREE" · 30-day money-back badge |
| `ngm/NGM_S5_burnnever.webp` | Glowing nano-droplet feeding into roots over a bokeh foliage background. "FEED MORE. BURN NEVER. Nano-sized nutrients absorb into the root — so you can't over-feed and scorch your plants." · "Won't burn · No fishy smell · Feeds longer" · "+40% — verified field trial" · CTA "FEED SMARTER" (note: "can't over-feed" conflicts with the draft's label-first caution) |
| `ngm/NGM_S6_value.webp` | Cream and gold background, two new-label bottles. "A WHOLE HARVEST. ABOUT $6." · "One 16 oz bottle dilutes down to gallons — a few mL feeds an entire crop." · "≈$6 per harvest" · "+40% bigger harvest — verified field trial" · CTA "DO THE MATH" |
| `ngm/NGM_S7_veghero.webp` | Raised wooden bed with tomatoes and lettuce. "BIGGER HARVESTS, FEWER DROPS." · icons Bigger Harvests / Healthier Plants / Stronger Roots · "+40% — verified field trial" · CTA "UPGRADE YOUR GROW" · 30-day seal |
| `ngm/NGM_S9_value.webp` | Real-label bottles on a black plinth between tomato vines, lime accent. "Feed Your Whole Garden For Under $6 A Plant." · ~~$109.98~~ **$99.99** · "GroMax feeds growth above the soil · RootMax builds the roots below · 5ml per gallon — one season per bundle" · CTA "SHOP THE BUNDLE →" · "Free shipping · 30-day money-back guarantee" (closest match to the draft palette) |
| `ngm/NGM_S10_absorb.webp` | Real-label bottles beside a macro of a water-beaded leaf. "Regular Fertilizer Washes Away. This Gets Absorbed In Minutes." · "UP TO 100X ABSORPTION" · "Nano-sized nutrients absorb through leaves & roots · Nothing washes away with the next watering · Works with your existing feed schedule" · CTA "GET NANOGROW MAX →" · "GroMax + RootMax bundle · $99.99 · Free shipping" |
| `ngm/NGM_S11_freegift.webp` | Two real-label bottles plus the Odor Max spray in green smoke. "Buy The Bundle, Get Odor Max FREE." · "FREE $12.99 VALUE" starburst · "Full two-bottle feeding system — $99.99 · FREE 8 oz Odor Max spray in every box · Added automatically at checkout — no code" · CTA "CLAIM THE FREE BOTTLE →" |
| `ngm/NGM_S12_results.webp` | Real-label bottles with tomatoes and basil, "USDA BIOPREFERRED CERTIFIED" stamp. "+40.7% Bigger Harvests In Independent Trials." · "36-plant indoor trial: 27 lbs grew to 38 lbs · Safe for vegetables, herbs & houseplants · Try it for 30 days — full refund, no returns" · CTA "SEE THE RESULTS →" · "GroMax + RootMax · $99.99 · Free Odor Max bottle included" |
| `nom/NOM_S1_hotel.webp` | Bright luxury hotel suite, new-label spray on a marble nightstand. "HOTELS USE IT FOR A REASON." · "Nano molecules reach deep-set smoke and stale odors — fresh in 60 seconds." · gold CTA "MAKE ANY ROOM SMELL NEW" · 30-day money-back seal (unsubstantiated "hotels use it") |
| `nom/NOM_S2_parents.webp` | Sunset apartment, hand holding a phone with "Mom — incoming", smoke wisps. "YOUR PARENTS ARE DOWNSTAIRS." · "Kills stubborn smoke & vape smell in 60 seconds — before anyone notices." · "Works in 60s · Safe around guests · No perfume cover-up" · CTA "CLEAR THE AIR FAST" |
| `nom/NOM_S5_car.webp` | Sunlit beige car interior, spray on the console. "YOUR CAR DIDN'T HAVE TO SMELL LIKE THAT." · "Smoke, food & gym-bag odor — gone in 60 seconds, on fabric & upholstery." · CTA "RESET YOUR RIDE" · 30-day money-back seal |
| `nom/NOM_S6_couch.webp` | 3D cutaway of fabric fibers with trapped orange odor particles. Arrows: "sprays & candles stop here" vs "Nano Odor Max reaches here". "IT'S NOT YOU. IT'S THE COUCH. Odor settles deep into fabric, carpet & walls..." · CTA "ELIMINATE IT AT THE SOURCE" · 30-day seal (good explainer visual) |
| `nom/NOM_S7_torturetest.webp` | Before/after of the same driver: grimacing in a smoky car vs smiling in a clear car. "WE SPRAYED IT ON THE WORST SMELL WE COULD FIND." · "Stale smoke, gone in 60 seconds. No cover-up — eliminated." · CTA "SEE IT WORK" |
| `before-after/before.webp` | Moody night penthouse, real "CANNA-BUUST" label spray on a black marble table, phone, candle, takeout. Gold "YOUR PARENTS ARE DOWNSTAIRS" · "Neutralizes stubborn smoke, vape, food, and apartment odors in as little as 60 seconds." · "FIX THE SMELL BEFORE THEY WALK IN" (despite the folder name, this is not a before/after pair) |
| `video/NO_UGC_RYAN_skeptic.mp4` (+ `.webp` poster) | 15 s, 720×1280 vertical UGC-style (AI talent) video. Young man in an apartment: "I bought this fully expected to return it." Skeptic-to-convert Odor Max testimonial. |
| `video/NO_UGC_SOFIA_smoke.mp4` (+ `.webp` poster) | 15 s, 720×1280 vertical UGC-style video. Woman in an apartment: "POV: friends are 5 min out and your place STILL smells like smoke." Odor Max problem hook. |

**Most usable for the redesign**
- Product-true labels: S9, S10, S11, S12 and `before.webp`. Their lime-on-black look already matches the draft's #b9f34b / #071d13.
- S1 for the before/after "one fed, one didn't" visual (new-label bottles).
- NOM_S6 for the fabric-cutaway explainer.
- NOM_S7 for before/after.
- The two 15 s vertical UGC videos for a PDP or hero video strip.

Claims to soften or footnote before reuse:
- "+40% verified field trial" (the source is the 18-plant CTG comparison)
- "100X absorption"
- "can't over-feed"
- "Hotels use it"
- "Safe around guests"
- "36-plant indoor trial" (it is 18 per group)

---

## Quick reference for the build

- **Tokens to keep:** #071d13 / #103b23 / #102b1b / #f5f6ef / #b9f34b / #425846 / #d8ddd2 / sage #e8efdf, with 4px buttons and 10px cards.
- **Tokens to add:**
  - A display typeface; the live site has Cinzel + Inter, so consider a modern grotesk display plus a mono for data.
  - Motion: counters, bar fills, reveals.
  - Imagery: lifestyle garden and harvest, before/after, UGC video, the lion crest.
- **Offer stack to surface:**
  - Bundle $99.99 (compare $109.98, "Save $9.99") + free 8 oz Odor Max (automatic BXGY / BOGOS)
  - Odor Max ladder $12.99 / $19.99 / $29.99 / $39.99 (4+1)
  - Free US shipping
  - 30-day money-back with no return needed
  - Codes [CODE:grow-intro-10], [CODE:odor-intro-10], [CODE:grow-20], [CODE:prize-10/15/20], [CODE:prize-freeship], [CODE:deepclean-ship], [CODE:deepclean-25], plus win-back [CODE:winback-15a] and [CODE:winback-15b] (email only)
- **Data fixes to request (no changes were made):**
  - Remove `seo.hidden` from `nano-odor-max`
  - Add `descriptionHtml` and image alt text to the 3 grow products
  - Set Shipping and Terms as Shopify policies
  - Unify the support email
  - Add Odor Max to a collection
  - Confirm BOGOS vs native BXGY for the gift
