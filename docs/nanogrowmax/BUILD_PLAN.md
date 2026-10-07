# NanoGrow Max Holiday 2026 redesign: build plan

**Goal:** a premium, mobile-first custom Shopify theme that teaches the products on first read, converts paid-social traffic, and keeps every current offer, upsell and discount. It must be live before Black Friday.

**Inputs:**
- `research/LIVE_THEME_INVENTORY.md`: live theme copy, offers and bugs
- `research/DRAFT_AND_STORE_AUDIT.md`: the Atelier draft, store data and apps
- `research/POPUP_GAMES_AND_EMAIL.md`: popup games, prizes and Klaviyo
- `research/PERFORMANCE_SEO_CRO_PLAYBOOK.md`: speed, SEO and CRO rules
- `research/HOW_TO_USE_SOURCE.md`: the X how-to chart
- `IMAGE_GENERATION_BRIEF.md`
- `DECISIONS.md`

---

## 1. Approach

- **A new custom Online Store 2.0 theme**, built as a fresh unpublished theme ("NanoGrow Max — Holiday 2026") next to the live one. **The live theme is never edited.** We preview, QA and test-order on the draft, then publish with one click; rollback is one click too.
- **Starting point:** the Atelier draft's good bones (palette, claim discipline, native `<dialog>` cart, consent-gated tracking, BOGOS gift check, Section Rendering API cart). On top of that come:
  - a real display typeface
  - motion
  - many more visuals
  - tier selectors
  - the How-to, Why-both, Research and spray-game sections
  - the rebuilt popup and cart upsells
- **Everything is a section with schema settings**, so you can edit copy, images, prices shown and FAQ in the theme editor without code. Product facts live in **metafields and metaobjects** (how-to steps, FAQs, case studies), so the same content feeds the PDP, the Research page and the SEO markup.
- **Text lives in HTML, never baked into images.** That's faster, sharper, indexable by Google and editable.
- **Performance budget (mobile, p75):**
  - LCP ≤ 2.0 s, INP ≤ 150 ms, CLS ≤ 0.05
  - Under 60 KB of theme JS on first load
  - System font fallback; one self-hosted display font, preloaded
- **Code location:** theme source in a **private** GitHub repo (see Q10). This repo is public, so it only holds the docs.

---

## 2. Site map and page architecture

### 2.1 Global
- **Announcement bar** (rotating, editable): "Free shipping on every order" · "30-day money-back guarantee" · the holiday offer.
- **Header:** logo with lion crest · Grow Max · Odor Max · The Research · How to Use · Cart. Mobile uses a full-screen menu with product cards.
- **Cart drawer** (§4).
- **Popup** (§5).
- **Footer:** shop links, How to Use, Research, About, Contact, FAQ, all policies (privacy, terms, refund, shipping, cookie preferences / "Your privacy choices"), social links (Q8), payment icons, newsletter, USDA BioPreferred badge.
- **Legal pages carried over:** Privacy, Terms, Refund, Shipping, Contact and Your Privacy Choices. Shipping and Terms are also set as real Shopify policies, so they appear at checkout.

### 2.2 Home / landing page: "what we sell and why it's the best"
1. **Hero:** golden-garden image (H01) or video (V01). The headline is coded. Two CTAs: *Shop the Grow Max Bundle* / *Shop Odor Max*. Trust chips: Free shipping · 30-day money-back · USDA BioPreferred.
2. **Animated proof strip:** count-up numbers as you scroll, e.g. **+40.7%** yield (indoor trial), **+51%** tomato field trial, **60 sec** odor gone, **30-day** guarantee. Every number is footnoted to the Research section (Q3 sets which claims stay).
3. **Meet the system:** two product cards, RootMax (roots below) and GroMax (leaves above), merging into the **Grow Max Bundle** card. A free Odor Max gift ribbon shows on the bundle.
4. **How it works in 3 steps:** Mix → Spray & drench → Harvest more. Links to the full how-to.
5. **Before/after slider** (BA1 tomato), drag-to-compare.
6. **Works on everything you grow:** a swipeable grid (H03–H08).
7. **Research teaser:** three animated stat cards linking to The Research.
8. **Odor Max feature band:** "Not just smoke. Every odor. 60 seconds." A mini spray-demo loop links to the Odor PDP.
9. **Reviews / UGC:** real reviews only, from Judge.me (Q4).
10. **Guarantee and free shipping band.**
11. **FAQ** (top 6 across both products).
12. **Final CTA** with the holiday gift scene (G10).

### 2.3 Grow Max Bundle PDP (`/products/nanogrow-max`): the flagship
1. **Purchase section** (above the fold on mobile):
   - Gallery: 8 slides with swipe, thumbnails, zoom, and video slots
   - Title, real Judge.me stars
   - Price $99.99 with compare-at ~~$109.98~~ and a "Save $9.99" badge
   - **Option tiles:**
     - **Grow Max Bundle (RootMax + GroMax)**: "Most popular · Best results", selected by default
     - GroMax only $54.99
     - RootMax only $54.99
     - Picking a single shows a nudge: "Get both for $99.99 + a FREE Odor Max".
   - **Free gift banner:** "FREE 8 oz Nano Odor Max with the bundle ($12.99 value), added automatically".
   - Quantity, **Add to cart** and Shop Pay / express buttons. Installment messaging (Shopify Payment Terms).
   - Trust row: Free shipping on every order · 30-day money-back guarantee · USDA BioPreferred · secure checkout.
   - **Sticky add-to-cart bar on mobile** once the main button scrolls off-screen.
2. **Why you need both:** the interactive plant cutaway (P01) with tappable hotspots.
   - **RootMax** builds the root zone: drench, below the soil.
   - **GroMax** feeds the leaves: foliar spray, above the soil.
   - A short "together vs alone" explainer, plus BA2 (roots) and BA3 (leaves) before/after sliders.
3. **How to use Grow Max:** this is the new dedicated section.
   - A **7-step interactive timeline** from the X chart: Mix → Prep soil (−9 / −5 days) → First spray → Routine (alternate every 5–7 days, shown as an animated cycle) → How much (~8 oz per plant, with a **plant-count calculator**: enter plants, get total solution and mL of each product) → Flowering → Finish (−2 weeks).
   - The **How-to video** (V02) with chapters.
   - The "Quick rules" card.
   - A downloadable / printable one-page guide.
4. **The Research:** case-study cards with animated counters and bars.
   - CTG indoor 27 → 38 lbs (+40.7%) and outdoor 47.5 → 55.8 lbs (+17.5%)
   - Tomato field trial 35 → 53 t/ha (+51%)
   - Global field trials 21.1%–125%
   - Matt Cinquanta and Alluvial Trade quotes
   - Each card has study details (plants, days) and links to the full Research page.
5. **Before/after gallery:** BA1, BA4, BA5 and BA6 sliders.
6. **Comparison table:** NanoGrow vs salt-based nutrients / organic teas / cal-mag (carried over and cleaned up).
7. **What's in the box** (G06), plus "one bundle lasts…" (Q2b).
8. **Reviews** (Judge.me).
9. **FAQ:** grow-specific, including the old FAQ plus dosing, safety, storage, "can I use it with my current nutrients?", hydro/coco and shipping.
10. **Cross-sell:** "Complete the routine": Odor Max.

**RootMax PDP and GroMax PDP** use the same template with the matching single pre-selected. Each adds a prominent "**Better together**" upgrade card (bundle + free Odor Max), and its "Why both" block opens on that product.

### 2.4 Nano Odor Max PDP (`/products/nano-odor-max`)
1. **Purchase section:**
   - Gallery (8 slides)
   - Real stars
   - **Tier ladder cards:**
     - 1 bottle $12.99
     - 2-Pack $19.99 ("$10/bottle")
     - 3-Pack $29.99
     - **4-Pack + 1 FREE $39.99, "Best value · $8.00/bottle"**
     - Each card shows its compare-at price and per-bottle savings.
   - Add to cart, express buttons and the trust row.
   - Sticky add-to-cart bar on mobile.
2. **How It Works: the spray game**, rebuilt.
   - Pick a room (living room, kitchen, car, pet corner), then spray away the haze.
   - Each cleared room reveals the science line and use case.
   - A timer shows "cleared in X seconds" against the **60-second** promise.
   - Completing the game reveals the existing deep-clean reward (Q5). Touch-optimized, with a 2-tap fallback and reduced-motion support.
3. **The 60-second explainer:** an animated 0 → 60 s timeline plus the fabric cutaway (O02): "sprays & candles stop here / Odor Max reaches here".
4. **Not just smoke: every odor.** A 12-tile use-case grid (UC01–UC12).
5. **How to use:** 2–3 sprays, wait 60 s, second pass for cars and heavy fabric; about 250 sprays per bottle (from the FAQ).
6. **Comparison:** Odor Max vs masking sprays, aerosol sanitizers and candles. Generic names only, with no competitor brands, unless you approve keeping the current Febreze/Ozium table (Q9).
7. **Video:** "See it in action" (real video), plus dramatization clips if used.
8. **Reviews and FAQ:** the existing 10-question FAQ, cleaned up.
9. **Cross-sell:** the Grow Max Bundle comes with a free Odor Max.

### 2.5 The Research (`/pages/case-studies`, linked as "The Research")
- **Hero:** R01 plus the headline result.
- **Results dashboard:** animated counters, bar charts and a control-vs-treated visual for each study.
- **Study detail cards** (method · plants · days · result · source), each with an image (R02–R05) or a real photo.
- **Before/after sliders.**
- **Methodology and disclaimer:** "results vary".
- **CTA** to the bundle.

### 2.6 Other pages
About, Contact (form), FAQ hub, How to Use (standalone, SEO-targeted, reusing the PDP section), 404, search, collection (all products), cart page (fallback), password page.

The landing pages (`deep-clean`, `feed-bloom`, `flip-unlock`, `nano-odor-max`, `nano-nutrient`, the NGM LP) **keep working**: we copy their templates and layouts into the new theme untouched, so live ad links don't break. They get restyled later if wanted.

---

## 3. Offers, upsells and discounts carried over (all of them)

| Offer | How it works on the new site |
|---|---|
| Bundle $99.99 (compare $109.98) | Option tiles; "Save $9.99" badge |
| **Free 8 oz Odor Max with the bundle** | Keep **one** mechanism (Q11): BOGOS or the native "Spend $99.99, get 1 free" automatic discount, **not both**. Advertised on the PDP, in the cart ("🎁 Free Odor Max added") and in the popup. |
| Odor Max ladder $12.99 / $19.99 / $29.99 / $39.99 (4+1) | Tier cards; the $12.99 single is offered again |
| **Odor Max 2-Pack "$11.99, 40% off" upsell** | ⚠ **Currently displays $11.99 but charges $19.99.** No discount makes it $11.99. Fix: create a real automatic discount (2-Pack at 40% off when GroMax, RootMax or the bundle is in the cart), or show the true price (Q12). Shown on the PDP and in the cart drawer, **including for bundle buyers** (today it's hidden from them). |
| Free shipping, every order (US rate is $0) | Cart: "✓ Free shipping unlocked" on every order. No threshold bar. |
| 30-day money-back guarantee | Trust row, PDP, cart and footer |
| Codes: the grow intro code, the odor intro code, the 20% grow code, the prize codes, the deep-clean codes and the win-back codes | All still valid at checkout. The cart gets a **discount code field**. Popup and landing-page codes are **auto-applied** and shown in the cart. |
| UFE / Upsell.com / FastBundle apps | Replaced by native theme upsells where possible, which is faster. App embeds are removed only with your OK (Q13). |

---

## 4. Cart and checkout speed

- **Ajax add to cart** (`/cart/add.js` with `sections=`): one request returns the updated drawer HTML. The drawer opens instantly with an optimistic line item, then confirms.
- **Drawer contents:**
  - Free-shipping-unlocked line and free gift status
  - Line items, with the free gift shown as ~~$12.99~~ FREE
  - **Smart upsell row:**
    - Odor Max 2-Pack 40% off when grow items are in the cart
    - "Upgrade to the bundle" when only one single is in the cart; one tap swaps it
    - Grow Max Bundle when only Odor Max is in the cart
  - Discount code field, with the auto-applied prize code shown
  - Subtotal, guarantee line, **Checkout** button and **Shop Pay / Apple Pay / Google Pay** express buttons
- **Speed details:**
  - The drawer is rendered server-side once, with no page reloads (the live theme currently reloads the page after the upsell).
  - Checkout link prefetch and preconnect.
  - Shopify storefront events, so apps (BOGOS) update the drawer.
  - No jQuery.
- **App cleanup to cut load time:** remove one of the two session-recording tools (LogRocket or Contentsquare), and drop the unused FastBundle and UFE once native upsells replace them (Q13). Expect page weight to fall from roughly 1.5–2.5 MB to well under 1 MB on mobile.

---

## 5. Popup rebuild ("Pick Your Prize"): same 3 games, same prizes, same odds

- **Games:** Spin-A-Sale Wheel, Scratch To Reveal and Mystery Box. They're recoded as lightweight canvas/CSS (around 15 KB), styled lab-dark with lime and gold, and use the C01–C05 art.
- **Prizes and odds unchanged** (weights 48 / 20 / 14 / 10 / 8). Two prize codes need your call (Q14):
  - The free-Odor-Max prize code **expired Sept 11**, so 10% of winners currently get a dead code.
  - The free-shipping prize is worth nothing in the US, because shipping is already free.
- **Flow:**
  1. Small teaser tab ("🎁 Play for a prize").
  2. The sheet opens after about 12 s or 50% scroll on mobile. That avoids Google's intrusive-interstitial penalty and doesn't block the first view of ad traffic.
  3. Pick a game, enter email (plus optional phone with TCPA consent text, Q15), play, reveal the prize.
  4. **The code is auto-applied to the cart** and persists across sessions.
  5. A "your code" chip stays visible in the cart.
- **Klaviyo wiring (the current setup is broken):**
  - Subscribe via the Klaviyo client Subscriptions API to a **single opt-in list**. The current list is double opt-in, and only 5 profiles joined since April.
  - Include profile properties: `prize_name`, `prize_code`, `game`, `signup_source`, `product_interest`.
  - Fire a "Won Prize" event. Check the response and retry.
  - **Turn on the welcome flow** (it's set to manual) and change it to **include the actual code** from the profile property (Q16). I'll draft the flow emails.
- **Frequency rules actually enforced:** don't show again for 7 days after close; never show after a win, a signup, or on checkout-intent pages; don't show to Klaviyo-identified subscribers.

---

## 6. SEO

- **Product JSON-LD:**
  - Product, Offer and price
  - AggregateRating, only from real Judge.me data
  - MerchantReturnPolicy (30 days) and OfferShippingDetails (free)
  - Brand, SKU and GTIN if available
- Plus Organization, WebSite and BreadcrumbList. VideoObject for the how-to video.
- **Remove the `seo.hidden` flag on Nano Odor Max**, which currently hides the main product from Google and the sitemap.
- Write real product descriptions (the 3 grow products have none), SEO titles and descriptions, and image alt text for every image.
- **Standalone "How to Use" page** and Research page targeting searches like "how to use nano fertilizer", "foliar spray schedule" and "best odor eliminator for smoke".
- Open Graph and Twitter cards on every page (the live theme has none). Canonical `/products/` URLs.
- Headings and copy in HTML, never in images.
- **Claims cleanup** (Q3): no "clinical trials", "Verified Purchase" only on real reviews, "USDA BioPreferred (biobased)" rather than "organic", and footnoted numbers. This protects Google Merchant listings, Meta ad approval and FTC compliance.

---

## 7. Premium interactive elements (all lightweight, all respect reduced-motion)
- Scroll-triggered **count-up numbers** and **animated bar charts** for research stats
- **Drag-to-compare before/after sliders**
- **Interactive plant cutaway** with hotspots (Why both)
- **7-step how-to timeline** with an animated 5–7-day cycle, plus a **dose calculator**
- **Spray-the-room game** (Odor PDP)
- **0 → 60 s odor timeline**
- Tier cards with live per-bottle math, and a sticky mobile add-to-cart bar
- Subtle scroll reveals, a parallax hero, and lime glow hovers

---

## 8. Timeline (BFCM is Nov 27–30; code freeze Fri Nov 13)

| Dates | Phase | Output |
|---|---|---|
| Oct 7–8 | Research ✓ · decisions · image brief ✓ | Answers to the questions below |
| **Oct 8–10** | **Image generation** (P0 first) | Approved P0 images |
| Oct 9–16 | Theme foundation: design system, header/footer, cart drawer, product templates, Grow Max PDP | Preview link #1 |
| Oct 16–23 | Odor PDP + spray game, Why-both, How-to, Research, SEO data | Preview link #2 |
| Oct 23–30 | Home, popup + Klaviyo, landing-page carry-over, policies | Preview link #3 (feature complete) |
| Oct 30–Nov 10 | QA on real phones, speed tuning, test orders (every discount and gift combination), app cleanup | Launch-ready |
| ~Nov 10 | **Publish**, keeping the old theme for one-click rollback | Live |
| Nov 13 | Code freeze through Cyber Monday | — |

---

## 9. Questions for the owner

Answers go in `DECISIONS.md`.

1. **Q1 Positioning.** Garden-first imagery (tomatoes, herbs, houseplants; Meta-safe, matching the new label) or cannabis-explicit like the live site ("Premium Cannabis Growth Formula", THC numbers)? Recommendation: **garden-first visuals and copy**, with cannabis results kept as text inside the Research section.
2. **Q2 How-to details.**
   - (a) Leaf spray: GroMax alone, or the 2 + 2 mL mix? Which mix goes in the watering can? Does leaf spraying stop in flowering, as the chart says?
   - (b) Bottle size (16 oz each?) and how long one bundle lasts.
   - (c) Can we show per-gallon doses?
3. **Q3 Claims.** Which numbers stay? The draft footnotes everything. The live site also uses "+24.2% THC", "100x absorption", "clinical trials" and "Pet and child safe".
4. **Q4 Reviews.** Are the hard-coded "Verified Purchase" testimonials (Marcus T., Trevor K. and others) real customers? If yes, import them into Judge.me so they count. If not, they come down.
5. **Q5 Spray game reward** on the Odor PDP: keep the deep-clean free-shipping + 25% codes, or make it informational only?
6. **Q6 Odor use cases.** Confirm or extend the 12 in the image brief.
7. **Q7 Real footage.** Is the "See It In Action" Odor video real? Any real customer or grower photos or videos?
8. **Q8 Social handles** for the footer: brand X, Instagram, TikTok?
9. **Q9 Competitor names.** Keep Febreze and Ozium in the comparison table, or switch to generic names?
10. **Q10 Code home and deploy access.** OK to create a private repo `nanogrowmax-theme`? OK for me to create a **new unpublished theme** in Shopify and push files to it? (I never touch the live theme.)
11. **Q11 Free gift.** BOGOS or the native automatic discount: which one stays?
12. **Q12 The $11.99 2-Pack upsell.** Create a real 40%-off discount so it's actually $11.99?
13. **Q13 Apps.** OK to replace UFE, FastBundle and one of LogRocket/Contentsquare with native features?
14. **Q14 Popup prizes.** The free-Odor-Max prize code is expired. Renew it, or replace it with another code at the same 10% odds? The free-shipping prize (14%) does nothing in the US: keep it or swap it?
15. **Q15 SMS.** Add an optional phone field (Klaviyo SMS) to the popup?
16. **Q16 Klaviyo.** OK to switch the popup list to single opt-in and turn on a rewritten welcome flow that includes the prize code?
17. **Q17 Holiday offer.** Is there a specific BFCM deal to build in (for example a gift-box bundle or tiered sitewide discount)?
