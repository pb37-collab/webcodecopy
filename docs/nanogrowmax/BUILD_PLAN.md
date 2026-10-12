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
- **Code location:** theme source in a **private** GitHub repo (`pb37-collab/nanogrowmax-theme`). This repo is public, so it only holds the docs.

---

## 2. Site map and page architecture

### 2.1 Global
- **Announcement bar** (rotating, editable): "Free shipping on every order" · "30-day money-back guarantee" · the holiday offer.
- **Header:** logo with lion crest · Grow Max · Odor Max · The Research · How to Use · Cart. Mobile uses a full-screen menu with product cards.
- **Cart drawer** (§4).
- **Popup** (§5).
- **Footer:** shop links, How to Use, Research, About, Contact, FAQ, all policies (privacy, terms, refund, shipping, cookie preferences / "Your privacy choices"), social links ([X](https://x.com/NanoGrowMaxInc), [Instagram](https://www.instagram.com/nanogrowmaxinc/), [TikTok](https://www.tiktok.com/@nanogrowmaxinc), also in Organization `sameAs` markup), payment icons, newsletter, USDA BioPreferred badge.
- **Legal pages carried over:** Privacy, Terms, Refund, Shipping, Contact and Your Privacy Choices. Shipping and Terms are also set as real Shopify policies, so they appear at checkout.

### 2.2 Home / landing page: "what we sell and why it's the best"
1. **Hero:** golden-garden image (H01) or video (V01). The headline is coded. Two CTAs: *Shop the Grow Max Bundle* / *Shop Odor Max*. Trust chips: Free shipping · 30-day money-back · USDA BioPreferred.
2. **Animated proof strip:** count-up numbers as you scroll, e.g. **+40.7%** yield (indoor trial), **+51%** tomato field trial, **60 sec** odor gone, **30-day** guarantee. Every number links to its study in the Research section.
3. **Meet the system:** two product cards, RootMax (roots below) and GroMax (leaves above), merging into the **Grow Max Bundle** card. A free Odor Max gift ribbon shows on the bundle.
4. **How it works in 3 steps:** Mix → Spray & drench → Harvest more. Links to the full how-to.
5. **Before/after slider** (BA1 tomato), drag-to-compare.
6. **Works on everything you grow:** a swipeable grid (H03–H08).
7. **Research teaser:** three animated stat cards linking to The Research.
8. **Odor Max feature band:** "Not just smoke. Every odor. 60 seconds." A mini spray-demo loop links to the Odor PDP.
9. **Reviews / UGC:** the real named testimonials (imported into Judge.me) plus real customer photos imported from X.
10. **Guarantee and free shipping band.**
11. **FAQ** (top 6 across both products).
12. **Final CTA** with the holiday gift scene (G10).

### 2.3 Grow Max Bundle PDP (`/products/nanogrow-max`): the flagship
1. **Purchase section** (above the fold on mobile):
   - Gallery: 8 slides with swipe, thumbnails, zoom, and video slots. Slide 1 is the **real stock product photo** (`ngm-stock-bundle-duo-black`).
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
   - A **7-step interactive timeline** from the X chart plus the owner's confirmations: Mix (2 mL per 1 L) → Prep soil with **both** (−9 / −5 days) → First **GroMax** leaf spray → Routine (**GroMax spray ↔ RootMax drench**, every 5–7 days, shown as an animated cycle) → How much (~8 oz per plant, with a **plant-count calculator**: enter plants, get total solution and mL of each product) → Flowering (RootMax drench only) → Finish (−2 weeks).
   - A one-line memory hook up top: **"GroMax = leaves. RootMax = roots. Both = soil prep."**
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
7. **What's in the box** (G06), plus "one bundle lasts…" (open question 2).
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
   - **Easter egg:** clearing every room triggers a special **"You found the secret!"** animation: a vault cracks open, the gold lion crest bursts out with lime sparks and confetti, and the phone vibrates. The visitor gets a **secret 25% off** code, auto-applied to the cart, with an optional "email me this code" capture. It's never mentioned anywhere else on the site, so it stays a genuine secret.
   - Touch-optimized, with a 2-tap fallback and reduced-motion support.
3. **The 60-second explainer:** an animated 0 → 60 s timeline plus the fabric cutaway (O02): "sprays & candles stop here / Odor Max reaches here".
4. **Every unwanted odor, gone.** A use-case grid: car · apartment · house · clothes · furniture · smoke (plus bedding and carpets). The key message: **"Penetrates deep below the surface, where candles and scented sprays can't reach."**
5. **How to use:** 2–3 sprays, wait 60 s, second pass for cars and heavy fabric; about 250 sprays per bottle (from the FAQ).
6. **Comparison:** Odor Max vs **Febreze** vs **Ozium** vs candles/generic sprays (names kept, owner-approved).
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

### 2.5b Cannabis growers page (hybrid positioning)
- `/pages/cannabis-growers`, linked from The Research and the footer, **not** from the main nav or the ads.
- Contents: cannabis-specific results (CTG indoor and outdoor, THC study, Matt Cinquanta), cannabis how-to imagery (CG01–CG06), and the same purchase CTA.
- Excluded from Meta ad destinations. It keeps the main product pages Meta-safe.

### 2.6 Other pages
About, Contact (form), FAQ hub, How to Use (standalone, SEO-targeted, reusing the PDP section), 404, search, collection (all products), cart page (fallback), password page.

The landing pages (`deep-clean`, `feed-bloom`, `flip-unlock`, `nano-odor-max`, `nano-nutrient`, the NGM LP) **keep working**: we copy their templates and layouts into the new theme untouched, so live ad links don't break. They get restyled later if wanted.

---

## 3. Offers, upsells and discounts carried over (all of them)

| Offer | How it works on the new site |
|---|---|
| Bundle $99.99 (compare $109.98) | Option tiles; "Save $9.99" badge |
| **Free 8 oz Odor Max with the Grow Max Bundle or the Odor Max 4-Pack** | Every buyer gets it. Bundle: the theme adds the $0 gift line automatically when the bundle is in the cart, and removes it when the bundle leaves. It's backed by **one** native automatic discount, so it also works with Buy Now and express checkout. BOGOS gets retired after testing. 4-Pack: the variant already ships 4 + 1 bonus bottle. Advertised on both PDPs, in the cart ("🎁 Free Odor Max added") and in the popup. |
| Odor Max ladder $12.99 / $19.99 / $29.99 / $39.99 (4+1) | Tier cards; the $12.99 single is offered again |
| **Post-purchase upsell: Odor Max 2-Pack at 40% off ($11.99)** | **After checkout**, on the Upsell.com (ex-ReConvert) one-click post-purchase page: Grow Max Bundle buyers can add 2 bottles of Odor Max at 40% off with no re-entering of payment. Post-purchase pages need an app by Shopify's rules, so this one app stays. The broken "$11.99" banner in the cart (which charged $19.99) is removed. |
| In-cart upsells (native) | GroMax-only or RootMax-only buyers: "Upgrade to the Grow Max Bundle: save $9.99 + get a FREE Odor Max" (one-tap swap). Odor Max-only buyers: "Add the Grow Max Bundle". Odor Max 1–3-pack buyers: "Upgrade to the 4-Pack + free bonus bottle". |
| Free shipping, every order (US rate is $0) | Cart: "✓ Free shipping unlocked" on every order. No threshold bar. |
| 30-day money-back guarantee | Trust row, PDP, cart and footer |
| Codes: the grow intro code, the odor intro code, the 20% grow code, the prize codes, the deep-clean codes and the win-back codes | All still valid at checkout. The cart gets a **discount code field**. Popup and landing-page codes are **auto-applied** and shown in the cart. |
| Apps | **Approved:** replace UFE, FastBundle and BOGOS with native theme features, and keep one session-recording tool. **Upsell.com stays** for the post-purchase offer only. |

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
- **App cleanup to cut load time:** remove one of the two session-recording tools (LogRocket or Contentsquare), and drop FastBundle, UFE and BOGOS once native upsells and the gift logic replace them (approved). Expect page weight to fall from roughly 1.5–2.5 MB to well under 1 MB on mobile.

---

## 5. Popup rebuild ("Pick Your Prize"): the same 3 games, built to convert

The owner's direction: keep the 3 games, use best judgement on prizes and odds, maximize conversion and contact capture.

- **Games:** Spin-A-Sale Wheel, Scratch To Reveal and Mystery Box. They're recoded as lightweight canvas/CSS (around 15 KB, loaded only when the popup opens), styled lab-dark with lime and gold, using the C01–C05 art.
- **Everyone wins. New prize table** (all real, working codes):

  | Prize | Weight | Why |
  |---|---|---|
  | 10% off your order | 34 | Entry prize, still a reason to buy today |
  | **15% off your order** | 30 | The most common "good" win; the sweet spot for conversion |
  | **FREE Nano Odor Max bottle** with any order ($12.99 value) | 20 | High perceived value, low cost; introduces the second product |
  | 20% off your order | 13 | A "big win" moment |
  | **25% off: JACKPOT** | 3 | Rare and exciting, makes the game feel real |

  - **Free shipping is removed as a prize** because every order already ships free. The expired free-bottle code is replaced.
  - The average discount is about 11%, with 20% of winners getting a free bottle instead.
  - All codes are **new, single-use per customer**, and **combine with the free-gift discount**, so bundle buyers still get their free bottle. The old codes stay valid for anyone who already has them.
- **Flow (built for mobile and for contact capture):**
  1. A small teaser tab, "🎁 Play for a prize". Never on arrival. The sheet slides up after **12 s or 50% scroll** on mobile, or on exit-intent on desktop. That's Google-safe (no intrusive interstitial on landing) and doesn't block ad traffic's first view.
  2. **Pick a game → enter email → play.** Email is captured before the reveal (the one required field) and subscribes immediately.
  3. **Reveal with an animation.** The code is **auto-applied to the cart** (`/cart/update.js` discount, merged with any existing codes) and saved, so closing the popup never loses it. A "🎁 15% OFF applied" chip stays visible site-wide and in the cart.
  4. **Optional SMS step on the reveal screen:** "Text me my code + get VIP early access to Black Friday", with the phone field and TCPA consent text. This adds SMS contacts without adding friction before the prize.
- **Klaviyo wiring (the current setup is broken):**
  - **Single opt-in** list "Pick Your Prize — Popup".
  - Profile properties `prize_name`, `prize_code`, `game`, `signup_source`, `product_interest` (the page they were on).
  - A "Won Prize" event. The response is checked and retried.
  - The welcome flow is **rewritten to include the actual code** from the profile and **switched on**, plus a 24 h and 72 h "your code is waiting" reminder.
- **Frequency rules actually enforced:** don't show again for 7 days after closing. Never show after a win or signup, on cart or checkout pages, or to known Klaviyo subscribers (`_kx`). Landing pages get their own offers instead.

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
- **Claims** (owner: all factual, all stay): each one is shown with its study context (trial size, days, crop), e.g. "+40.7% yield: 49-day indoor trial, 18 vs 18 plants". THC figures go on the cannabis growers page. "USDA BioPreferred (biobased)" is labelled exactly. Context keeps the claims credible and helps Google Merchant listings and Meta ad review.

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

## 9. Owner questions: status

All the first-round questions are answered (see `DECISIONS.md`). Still open:
1. **Per-gallon dosing:** can the site show "≈ 7.5 mL per gallon" next to 2 mL per liter?
2. **How long one bundle lasts** (e.g. "one bundle = X feedings for 5 plants"), for the value calculator.
3. **Klaviyo SMS:** is SMS enabled on the Klaviyo account (needed for the optional phone step)?
4. **Customer photos from X:** send the post links or the files. Credits are shown as @handle, with permission.
5. **Holiday/BFCM offer:** coming at the end of October. Slots are built.
