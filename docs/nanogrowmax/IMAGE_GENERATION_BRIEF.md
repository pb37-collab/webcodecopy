# NanoGrow Max Holiday 2026 redesign: image and video generation brief

**Purpose:** the shot list for generating every new visual in Higgsfield when credits renew (2026-10-08). Work through it top to bottom and tick items off as they land.
**Companion docs:** `BUILD_PLAN.md` (where each asset goes), `DECISIONS.md`, `research/*`.

---

## 0. Before generating anything (status)

| # | Need | Status |
|---|---|---|
| B1 | Product label references | ✅ **Resolved.** Use the **real product stock images** from Higgsfield (real labels). IDs are in `DECISIONS.md` → "Canonical product images". Pass them as reference media in every product shot: GroMax `5ba17cf4…`/`cdcd7a10…`, RootMax `dceb5c30…`/`80cfd07c…`, duo element **NGM-Bottle-Duo** `<<<d0f45d5c-278a-4c7c-9540-8f1c51e9bdc6>>>`, Odor Max `b3d0453a…`/`290a6250…`/`661565d9…`. First step on generation day: create a Higgsfield element **NOM-Bottle** from `b3d0453a…` so Odor Max can be placed with `<<<id>>>` the same way as the duo. |
| B2 | Positioning | ✅ **Hybrid.** Garden imagery on the main site; cannabis imagery only on the cannabis growers page (section 7b). |
| B3 | Bottle size | ✅ GroMax 16 fl oz + RootMax 16 fl oz (32 fl oz bundle). Odor Max 8 oz. |
| B4 | Real people | Real customer photos come from X (the owner imports them). **Never AI-generate a real, named person or a fake "customer."** Higgsfield personas (NGM-Grower-Claire/Elena/Maya, NOM-Home-Diego/Nina) may appear in **illustrative** lifestyle shots only, never next to a review or quote. |

---|---|---|
| B1 | **Clean reference photos of the Meta-compliant labels**: GroMax bottle, RootMax bottle and Nano Odor Max bottle, front-on, plain background, as high-res as possible. The label artwork files (PDF/AI/PNG) are even better. | Every product image must show the same canonical label (see `DECISIONS.md`). Without a reference, the AI invents label text. The best existing references are in `public/content/ngm/NGM_S1_beforeafter.webp` (GroMax/RootMax: white bottle, dark green panel, gold lion crest) and `public/content/nom/NOM_S1_hotel.webp` (Odor Max: clear bottle, white label, gold lion). Both are cropped from ads, so they're low-res. |
| B2 | ~~Positioning~~ **Answered: Hybrid.** | Home, product pages and main how-to use **garden imagery** (sections 2–8). Cannabis-plant imagery appears **only** in the separate cannabis growers page (section 7b). |
| B3 | **Bottle size**: the labels say 1 pint (16 fl oz) per bottle, while the bundle SKU says 32 oz (2 × 16). | Scale shots and "what's in the box" need the right bottle size. |
| B4 | Real photo of **Matt Cinquanta** (case study), plus any real customer photos or videos. | **We will not AI-generate a real, named person**, or any "customer" presented as a real buyer (FTC fake-review rule). Without real photos, testimonial cards use initials avatars. |

---

## 1. Global art direction (paste the style line into every prompt)

**Brand palette** (from the draft, carried into the new theme):
- Deep forest `#071d13`
- Forest `#103b23`
- Paper `#f5f6ef`
- Sage `#e8efdf`
- Acid lime accent `#b9f34b`
- Gold, from the lion crest, `#c9a24a`

**Two looks, used deliberately:**
1. **"Lab-dark"**: product on deep forest or near-black, lime rim light, soft green haze, glossy wet leaves. This is the premium and science look. Use it for packshots, science, research and the cart.
2. **"Golden garden"**: warm late-afternoon sun, real backyard and raised-bed gardens, shallow depth of field, abundant healthy plants, natural skin and hands. This is the emotional, results look. Use it for heroes, how-to, use cases and before/after.

**Style line (append to prompts):**
> photorealistic commercial product photography, natural color grading, crisp detail, shallow depth of field, no text, no watermark, no logos other than the product label, clean composition with negative space

**Hard rules for every image:**
- **No text baked into images.** All headlines, numbers, badges and labels are coded in HTML. That keeps them SEO-indexable, translatable, sharp on every screen and editable later. (The live site's text-baked PNGs are 1–1.7 MB each and can't be read by Google.)
- **Label must match the real product reference** (B1). Prefer **compositing the real stock bottle** into a generated scene (generate the scene with the reference media attached, or generate an empty scene and place the cut-out bottle) over letting the model redraw the label. If a label comes out garbled, regenerate or fix it with an inpaint or edit pass. Never ship a garbled label.
- **No cannabis leaves, buds, smoking devices, joints or bongs** in any image under the garden-first assumption. Smoke for Odor Max is shown as neutral haze or a stale-air tint, never as a person smoking.
- **No competitor brand logos** (Febreze, Ozium and so on). Comparison shots use generic unbranded products.
- **No real named people and no fake "customers."** Hands, over-the-shoulder and faceless lifestyle shots are fine.
- **Mobile-first framing:** keep the subject inside the centre 70% so the same image crops cleanly from 4:5 (mobile) to 16:9 (desktop). Where noted, leave clear negative space at the top for the coded headline.

**Output specs:**
- Generate at the model's maximum resolution, at least 2048 px on the long edge. PNG or high-quality JPG.
- We upload originals to **Shopify Files**. Shopify then serves WebP/AVIF at the right width automatically through `image_url`, so don't compress before upload.
- Aspect ratios are listed per item. "4:5 + 16:9" means generate **both** framings. Generate the 4:5 first, then outpaint or reframe to 16:9, so the two match.
- Packshots that will be cut out (marked ✂): generate on a plain seamless background, then run background removal to get a transparent PNG.

**File naming:** `ngm-<area>-<slug>-<ratio>.png`, for example `ngm-home-hero-4x5.png` or `ngm-howto-step1-1x1.png`.

**Priority:**
- **P0** blocks launch (52 entries).
- **P1** is strongly wanted.
- **P2** is nice to have, or holiday-only.

Generate in that order so a credit shortfall never blocks launch.

---

## 2. Product packshots (G): used everywhere, generate FIRST (they become references for later shots)

| ID | P | Ratio | Shot | Prompt (add style line + label reference) | Used in |
|---|---|---|---|---|---|
| G01 | P1 (stock duo exists) | 1:1, 4:5 | **Grow Max Bundle hero packshot**, a premium plinth version of `ngm-stock-bundle-duo-black` | Two white 16 oz bottles, GroMax (left) and RootMax (right), labels facing camera, standing on a dark polished stone plinth. Deep forest-green background fading to black, thin acid-lime rim light on the bottle edges, soft green haze behind, subtle reflection on the plinth. A few glossy basil leaves and two vine tomatoes at the plinth base. | Bundle PDP gallery #1, product cards, cart, OG image |
| G02 | ✅ exists | 1:1 ✂ | GroMax single, front (`ngm-stock-gromax-white/black`). Only needs background removal. | Single GroMax bottle, label straight-on, plain light seamless background, soft even studio light, gentle ground shadow | Product card, "why both" diagram, cart thumbnail, upsell tile |
| G03 | ✅ exists | 1:1 ✂ | RootMax single, front (`ngm-stock-rootmax-white/black`). Only needs background removal. | Same as G02 with RootMax | Same as G02 |
| G04 | ✅ exists | 1:1 ✂ | Nano Odor Max single, front (`ngm-stock-odormax-white`). Only needs background removal. | Clear 8 oz fine-mist spray bottle, white Nano Odor Max label with gold lion crest, label straight-on, plain light seamless background, soft studio light | Odor PDP, tier cards (the coded tier cards repeat this cutout ×2/×3/×5), cart, upsell |
| G05 | P0 | 1:1, 4:5 | Odor Max hero, lab-dark | Nano Odor Max bottle on a dark stone plinth, deep forest background, a fine mist cloud just leaving the nozzle and backlit in lime-tinted light, droplets frozen mid-air | Odor PDP gallery #1, home Odor band |
| G06 | P0 | 4:5, 16:9 | **"Everything in the box"** | Overhead flat lay on a warm paper-textured surface: GroMax and RootMax bottles, one Nano Odor Max bottle tied with a thin lime ribbon and a small blank kraft gift tag, a 10 mL measuring syringe, a small glass measuring jug, a few basil leaves. Clean, airy, organized. | Bundle PDP gallery (shows the free Odor Max gift), home offer band |
| G07 | P1 | 1:1 | GroMax in hand (scale) | A gardener's hand (sleeve rolled, light soil on the fingers) holding the GroMax bottle in a sunny garden, bottle sharp, garden bokeh behind | PDP gallery (size and scale) |
| G08 | P1 | 1:1 | Odor Max in hand (scale) | A hand holding the Nano Odor Max bottle in a bright modern living room, bottle sharp, room softly blurred | Odor PDP gallery |
| G09 | P2 | 1:1 | Lion crest macro | Extreme macro of the gold lion crest on the label, shallow focus, premium texture | Brand moments, popup, footer |
| G10 | P1 | 4:5, 16:9 | **Holiday gift scene** | GroMax, RootMax and Nano Odor Max nestled in an open kraft gift box with forest-green tissue paper, sprigs of pine and rosemary, a lime satin ribbon, warm string-light bokeh, cozy evening light | Holiday hero variant, announcement promos, email |
| G11 | P2 | 1:1 | Odor Max 4+1 group | Five Nano Odor Max bottles in a neat V formation on a light seamless background, the front bottle wearing a small lime "bonus" ribbon (no text) | Odor PDP gallery "best value" image |

---

## 3. Home / landing page (H)

| ID | P | Ratio | Shot | Prompt | Notes |
|---|---|---|---|---|---|
| H01 | P0 | **9:16 + 4:5 + 16:9** | **Hero** | A thriving raised-bed backyard garden at golden hour: heavy trusses of ripe red tomatoes, glossy peppers, dense basil. GroMax and RootMax bottles standing on the wooden edge of the bed in the foreground right, slightly out of focus vs the bottles. Warm sun flare from the back left. **Upper 35% of the frame is soft foliage and sky bokeh (headline space).** | Above-the-fold LCP image. It must look incredible on a phone at 390 px wide. |
| H02 | P1 | 9:16 + 16:9 | Hero **video** loop (see V01) | — | Optional, behind the H01 still |
| H03 | P0 | 4:5 | Use case: **raised-bed vegetables** | Overflowing raised bed of tomatoes, zucchini and lettuce, morning light | "Works on everything you grow" grid |
| H04 | P0 | 4:5 | Use case: **indoor herbs** | Sunny kitchen windowsill with lush basil, mint and parsley in terracotta pots | Same grid |
| H05 | P0 | 4:5 | Use case: **houseplants** | Large, glossy monstera and fiddle-leaf fig in a bright minimalist living room | Same grid |
| H06 | P0 | 4:5 | Use case: **container patio** | Pepper plants and cherry tomatoes in fabric grow bags on a sunny apartment balcony | Same grid |
| H07 | P1 | 4:5 | Use case: **flowers** | Abundant rose and dahlia bed in full bloom, cottage garden | Same grid |
| H08 | P1 | 4:5 | Use case: **greenhouse / hydro** | Clean small hobby greenhouse with rows of healthy seedlings and a hydroponic herb tower | Same grid |
| H09 | P0 | 4:5 + 16:9 | **Harvest payoff** | Two hands holding a woven basket overflowing with just-picked tomatoes, peppers and cucumbers, garden behind, warm light, faceless | Emotional results band, "join growers" CTA |
| H10 | P1 | 16:9 + 4:5 | **Odor Max lifestyle band** | Bright, airy modern living room with linen sofa and plants; a hand mid-spray with the Nano Odor Max bottle, fine mist catching window light; the room feels fresh and clean | Home Odor Max feature section |
| H11 | P2 | 4:5 | Doorstep delivery | A kraft shipping box on a sunny front porch beside a potted plant, box slightly open showing the bottles | Free-shipping and guarantee band |

---

## 4. Before / after pairs (BA): for the coded drag-to-compare sliders

**The technique matters:** each pair must have an **identical camera angle and composition** so the slider looks real.
1. Generate the **AFTER** (healthy) image first.
2. Run an image-edit pass on that same image to make the **BEFORE** (same plant and scene, but stunted, pale or yellowing, fewer fruit).
3. Never generate the two separately.

Each pair also gets a coded caption. Keep the captions honest: "Illustration of typical results", with the real trial numbers in the Research section.

| ID | P | Ratio | Pair | AFTER prompt → BEFORE edit |
|---|---|---|---|---|
| BA1 | P0 | 4:5 | **Tomato plant** | Lush, dark-green tomato plant heavy with ripe red trusses in a garden bed → same plant pale, yellowing lower leaves, a few small green fruit |
| BA2 | P0 | 4:5 | **Root ball** | Plant lifted from a pot showing a dense, bright white, fibrous root ball → same with thin, sparse, brownish roots (this is the RootMax visual) |
| BA3 | P0 | 4:5 | **Leaf canopy** | Close-up of deep-green, glossy, thick leaves with dew → same leaves pale, thin, slightly curled, with patchy yellowing (this is the GroMax visual) |
| BA4 | P1 | 4:5 | **Basil pot** | Bushy, dense basil in a terracotta pot on a windowsill → same pot leggy and sparse |
| BA5 | P1 | 4:5 | **Harvest on scale** | Large pile of tomatoes on a kitchen scale (display blank, coded later) → same scale with a much smaller pile |
| BA6 | P2 | 4:5 | **Pepper plant** | Pepper plant loaded with glossy peppers → same plant with two small peppers |

---

## 5. Grow Max Bundle PDP (P): gallery and sections

**Gallery order (mobile swipe, 1:1 or 4:5; 8 slots):**
1. G01 bundle packshot
2. G06 everything in the box (with the free Odor Max)
3. P01 "why both" diagram base
4. BA1 before/after (static split version)
5. P02 foliar spray action
6. P03 soil drench action
7. G07 in-hand scale
8. P04 dosing macro

| ID | P | Ratio | Shot | Prompt | Used in |
|---|---|---|---|---|---|
| P01 | P0 | 4:5 + 16:9 | **"Why both" plant cutaway** | A healthy young tomato plant growing in a clear glass-sided planter so both the leafy canopy above and the dense white root system in dark soil below are visible. Plain light background, studio light, centred, with room left and right for coded callouts. | **Hero of the "Why you need both" section.** Coded hotspots: GroMax → leaves above, RootMax → roots below. Also gallery #3. |
| P02 | P0 | 1:1 + 4:5 | **GroMax foliar spray** | Close-up of a hand misting the leaves of a young vegetable plant with a clear pump sprayer in soft morning light; fine mist droplets beading on the leaves; the GroMax bottle blurred in the background | Gallery, How-to step 3 |
| P03 | P0 | 1:1 + 4:5 | **RootMax soil drench** | A green watering can pouring a gentle stream onto dark rich soil at the base of a plant in a fabric pot, water soaking in; RootMax bottle blurred in the background | Gallery, How-to steps 2 and 5 |
| P04 | P0 | 1:1 | **Dosing macro** | A clear 1 liter measuring jug of water on a garden potting bench; a small syringe dispensing a few mL of liquid into it; GroMax and RootMax bottles beside it | Gallery, How-to step 1 |
| P05 | P1 | 4:5 | **Nano absorption visual** | Macro of a single water droplet on a green leaf surface, tiny glowing lime particles diffusing from the droplet into the leaf's surface, dark background, scientific but beautiful | "The science" section |
| P06 | P1 | 16:9 + 4:5 | **Root zone macro** | Macro cross-section of soil showing fine white root hairs threading through dark soil, a few glowing nano-particles near the roots, lab-dark grade | RootMax explainer card |
| P07 | P1 | 16:9 + 4:5 | **Leaf canopy macro** | Backlit canopy of glossy deep-green leaves, light shining through veins, a few dew drops | GroMax explainer card |
| P08 | P2 | 4:5 | Comparison props | A neat lineup of generic unbranded fertilizer containers (a granule bag, a blue crystal tub, a brown liquid jug) beside the clean white GroMax and RootMax bottles, the NanoGrow bottles lit as heroes | Comparison table header |

---

## 6. "How to use Grow Max" section (U): one image per step plus video

These pair with coded step cards built from `research/HOW_TO_USE_SOURCE.md`. Doses, days and icons are all coded, so **no text in the images**.
- Use one consistent setting so the sequence feels like one story: the same potting bench, the same green watering can and the same garden.
- Ratio **1:1** (mobile cards) plus a **16:9** desktop crop.

| ID | P | Step | Prompt |
|---|---|---|---|
| U01 | P0 | 1 · Mix your solution | Potting bench: a clear pump sprayer and a green watering can side by side, each beside a 1 liter measuring jug of water; a dosing syringe dispensing a few mL; GroMax standing by the sprayer and RootMax by the watering can; morning light. Shows GroMax → spray and RootMax → drench. |
| U02 | P0 | 2 · Prep the soil (−9 and −5 days, **both products**) | A freshly prepared, empty raised bed of dark, moist soil being drenched from a green watering can, with seedling trays waiting at the edge and **both** bottles on the bed's edge |
| U03 | P0 | 3 · First spray (early growth) | A young seedling with its first few true leaves being lightly misted with a pump sprayer at sunrise. *(Can share a session with P02.)* |
| U04 | P0 | 4 · Ongoing routine (veg) | A vigorous, leafy young plant in a garden bed mid-season, half the frame showing a mist sprayer and the other half a watering can at the base (visualizes "alternate every 5–7 days") |
| U05 | P0 | 5 · How much (~8 oz per plant) | A measuring cup pouring about one cup of solution around the base of a plant in a fabric pot, with a row of five identical fabric pots behind it (matches the "5 plants ≈ 40 oz" line) |
| U06 | P0 | 6 · Flowering / fruiting stage | A plant covered in flowers and first small fruit, a watering can at the soil only, the spray bottle set aside on the bench (drench-only stage) |
| U07 | P0 | 7 · Finish (~2 weeks before harvest) | A ripe, ready-to-harvest plant with full fruit, garden shears and a harvest basket waiting, golden hour |

> Confirmed in `DECISIONS.md`: GroMax = leaf spray, RootMax = soil drench, both together for pre-plant soil prep. Flowering is RootMax drench only.

---

## 7. The Research (R)

Real numbers are coded as animated counters and bars. Images give each study a sense of place. **Don't depict named people, and don't imply that an image is the actual trial.** Each research image carries a small coded "Illustrative image" note.

| ID | P | Ratio | Shot | Prompt | Pairs with |
|---|---|---|---|---|---|
| R01 | P0 | 16:9 + 4:5 | **Research hero** | Wide view of tidy trial plots in a field at sunrise, labeled stakes with blank tags marking rows, mist over the crops, a clipboard on a fence post | Research page / tab hero |
| R02 | P0 | 4:5 | **Indoor trial (49-day)** | A clean controlled indoor grow room with two blocks of identical potted plants under grow lights, the right block visibly larger and denser, tidy and scientific (garden-first: tomato or pepper plants) | CTG indoor: 18 vs 18 plants, 27 → 38 lbs, +40.7% |
| R03 | P0 | 4:5 | **Outdoor trial (115-day)** | Two long outdoor rows of plants in a field, the right row taller and fuller, blue sky | CTG outdoor: 28 vs 28, 47.5 → 55.8 lbs, +17.5% |
| R04 | P0 | 4:5 | **Tomato field trial (Philippines)** | Tropical tomato field rows with harvest crates overflowing with ripe tomatoes at the row end, lush green hills behind | 35 → 53 t/ha, +18 t (+51%) |
| R05 | P0 | 4:5 | **Soybean & rice field trials** | Vibrant green rice paddies beside soybean rows under a big sky, tropical landscape, no people | Global trials 21.1%–125%; Alluvial Trade (Nigeria) |
| R06 | P1 | 4:5 | **Weigh-in** | Freshly harvested produce in crates on a large platform scale, display blank, clipboard beside it | Methodology / "how we measure" |
| R07 | P1 | 1:1 | **Lab detail** | Lab glassware with a pale green liquid sample, a pipette, and a leaf sample under soft clean light | "Why nano" science card |

> Each case study card gets a real photo where one exists (Matt Cinquanta, Alluvial Trade field photos) from item B4. Otherwise it uses R-series images or initials.

### 7b. Cannabis growers page (CG): hybrid positioning

This is a separate page (e.g. `/pages/cannabis-growers`), linked from The Research and the footer. **It is never used as a Meta ad destination.** It may show cannabis plants. Still no smoking imagery and no people consuming.

| ID | P | Ratio | Shot | Prompt |
|---|---|---|---|---|
| CG01 | P1 | 16:9 + 4:5 | Hero | Clean, professional indoor cannabis grow room, dense healthy canopy under full-spectrum LEDs, GroMax and RootMax bottles on a stainless bench in the foreground |
| CG02 | P1 | 4:5 | Indoor trial | Two blocks of cannabis plants in fabric pots under lights, the right block visibly fuller (pairs with 27 → 38 lbs, +40.7%) |
| CG03 | P1 | 4:5 | Outdoor trial | Two outdoor rows of cannabis plants, the right row taller (pairs with 47.5 → 55.8 lbs, +17.5%) |
| CG04 | P1 | 1:1 | How-to (cannabis) | Young cannabis plant with a few fan leaves being lightly misted at sunrise (cannabis version of U03) |
| CG05 | P2 | 1:1 | Flowering drench | Flowering cannabis plant in a fabric pot, watering can at the soil only |
| CG06 | P2 | 4:5 | Root ball | Dense white root ball from a cannabis plant pulled from a fabric pot |

---

## 8. Nano Odor Max PDP (O)

**Gallery order (8 slots):**
1. G05 hero
2. G04 packshot
3. O01 mist in action
4. O02 fabric science
5. O03 car
6. G08 in-hand
7. G11 4+1 group
8. O04 vs. old way

| ID | P | Ratio | Shot | Prompt |
|---|---|---|---|---|
| O01 | P0 | 1:1 + 4:5 | **Mist in action** | Slow-motion freeze of a fine mist cloud from the Nano Odor Max bottle in front of a sunny window, droplets glowing, clean bright room behind |
| O02 | P0 | 4:5 + 16:9 | **Deep-fabric science (text-free remake of NOM_S6)** | Photoreal 3D cutaway of couch fabric fibers: amber odor particles trapped deep in the weave; a fine mist with tiny glowing lime particles penetrating down to reach and dissolve them; dark clean background. **Leave room for coded arrows:** "sprays & candles stop here" / "Nano Odor Max reaches here". |
| O03 | P0 | 4:5 | **Car interior** | Clean, sunlit car interior with fabric seats, the Nano Odor Max bottle in the cup holder, fresh and spotless |
| O04 | P1 | 4:5 | **Vs. the old way** | Split scene: left, a cluttered shelf of generic unbranded air-freshener aerosols, plug-ins and candles under dull light; right, a single clean Nano Odor Max bottle in bright light |
| O05 | P1 | 16:9 + 4:5 | **60-second band** | A large analog wall clock in a bright, airy room, with a soft mist dissipating in the light (pairs with the coded "0–60s" animated timeline) |

### 8a. "How It Works" spray game: room before/after pairs (SG)

The game puts the **BEFORE** image on a canvas over the **AFTER** image, and the player "sprays" the before image away. The current game uses 2 rooms (`dc-z1/z2`). The rebuild uses **4 rooms** so it doubles as a use-case showcase. **Same technique as section 4:** generate the AFTER first, then edit it into the BEFORE with identical framing.
- **BEFORE** look: dim, slightly desaturated, a visible stylized murky yellow-green or grey odor haze hanging in the air, plus clutter cues (e.g. takeout boxes, pet bed, gym bag).
- **AFTER** look: bright, crisp, airy, clean, same room.
- Ratio **4:5 at 1080×1350 minimum** (the mobile game canvas), plus a 16:9 version for desktop.

| ID | P | Room / odor | AFTER prompt (then edit into BEFORE) |
|---|---|---|---|
| SG1 | P0 | **Living room: smoke and stale air** | Cozy modern living room, linen sofa, plants, afternoon sun → BEFORE: same room dim, with a hazy grey stale-smoke cast hanging in the air, curtains drawn, an empty takeout box and a crumpled throw on the coffee table |
| SG2 | P0 | **Bedroom closet: clothes** | Bright bedroom with an open closet of fresh hung clothes → BEFORE: same room dim and hazy, a pile of worn clothes and a hoodie on the bed |
| SG3 | P0 | **Car: food and gym bag** | Clean car interior from the back seat → BEFORE: same car, hazy and dim, fast-food bag and sweaty gym bag on the seat |
| SG4 | P0 | **Apartment kitchen and couch (whole apartment)** | Open-plan apartment, kitchen and sofa, bright and clean → BEFORE: same space hazy, takeout boxes, stale-air cast |
| SG5 | P1 | Pet corner (optional 5th room) | Bright mudroom corner with a tidy dog bed → BEFORE: same corner, hazy, rumpled dog bed |

### 8b. "Every unwanted odor" use-case grid (UC)

Per the owner, Odor Max **removes any unwanted odor: car, apartment, house, fabrics (clothes, furniture) and smoke.** It **penetrates deep below the surface, unlike candles and scented sprays.**
- Ratio 1:1, one consistent bright-clean style, with the real bottle (via reference) in about half the tiles.

| ID | P | Use case | Prompt seed |
|---|---|---|---|
| UC01 | P0 | **Car** | Sunlit fabric car interior, bottle on the console, fine mist over the seats |
| UC02 | P0 | **Apartment** | Compact modern apartment living space, open window light, mist in the air |
| UC03 | P0 | **House** | Bright family home living room and entryway, clean and airy |
| UC04 | P0 | **Clothes** | Hoodie and jacket on a hanger being misted, closet behind |
| UC05 | P0 | **Furniture** | Linen sofa and cushions being misted, deep-fabric feel |
| UC06 | P0 | **Smoke odor** | Sheer curtains and a lounge chair in soft light, faint grey haze clearing |
| UC07 | P1 | Bedding and mattress | Fresh made bed, mist over the duvet |
| UC08 | P1 | Carpets and rugs | Thick rug in a sunny room, mist settling into the fibers |
| UC09 | P2 | Pets (couch and pet bed) | Dog bed beside a sofa, clean and bright |
| UC10 | P2 | Gym bag and shoes | Gym bag and sneakers, bottle beside them |

---|---|---|---|
| UC01 | P0 | Smoke and vape (rooms, curtains) | Sheer curtains in a bright room catching a light mist |
| UC02 | P0 | Pets (dog beds, couches) | Golden retriever on a sofa, mist in the foreground |
| UC03 | P0 | Litter box area | Tidy laundry-room cat litter corner, clean |
| UC04 | P0 | Gym bag and sneakers | Open gym bag with sneakers, bottle beside it |
| UC05 | P0 | Car interiors | Car seat and headliner, bottle on the console |
| UC06 | P0 | Kitchen and cooking (fish, garlic, burnt food) | Stovetop with a pan, window open |
| UC07 | P1 | Laundry and hampers | Woven hamper with folded towels |
| UC08 | P1 | Closets and shoes | Shoe rack in a closet |
| UC09 | P1 | Airbnb, hotel and rental turnovers | Neatly made rental bedroom, cleaning caddy with bottle |
| UC10 | P1 | Bathroom | Spa-like bathroom, bottle on the counter |
| UC11 | P1 | Trash cans and diaper pails | Clean modern kitchen trash can |
| UC12 | P2 | Basements, musty storage, RVs and boats | Cozy RV interior, bottle on the table |

---

## 9. Popup and cart (C): the redesigned "Pick Your Prize" game

The wheel, prize text and odds are **coded**. Only the decorative art is generated.

| ID | P | Ratio | Asset | Prompt |
|---|---|---|---|---|
| C01 | P0 | 1:1 ✂ | **Mystery box: closed** | Premium matte forest-green gift box with a gold foil lion crest seal and a lime satin ribbon bow, plain background (cut out) |
| C02 | P0 | 1:1 ✂ | **Mystery box: open** | Same box, lid lifted and tilted, a soft lime glow and a few gold sparkles rising from inside (cut out) |
| C03 | P0 | 4:5 | **Scratch-card foil texture** | Flat top-down gold metallic foil texture with fine brushed grain and a subtle embossed lion crest pattern, evenly lit, seamless |
| C04 | P1 | 16:9 | **Popup header art** | Forest-green velvet backdrop with scattered lime confetti, a few gold sparkles, the three products softly lit at the bottom edge |
| C05 | P2 | 1:1 ✂ | Wheel hub emblem | Gold lion crest medallion, front-on (cut out); used as the spin wheel centre |

| C06 | P0 | 1:1 ✂ | **Easter egg reveal** (spray game) | A gold lion-crest medallion bursting out of a cracked forest-green vault door, gold light rays and lime sparks, plain dark background (cut out). Used in the "You found the secret 25% off" animation. |
| C07 | P1 | 1:1 ✂ | Easter egg key | An ornate gold key with the lion crest on its bow, floating, soft glow (cut out) |

The cart drawer uses the G02, G03 and G04 stock cutouts for upsell tiles. No new art is needed.

---

## 10. Video (V): Higgsfield image-to-video, from the stills above

Specs:
- Muted, autoplay-safe loops, ≤ 8 s unless noted.
- Generate **9:16** (mobile) and **16:9**.
- Must stay under about 2.5 MB after export at 720p. Shopify serves videos uploaded to Files from its CDN, and video is never the LCP element: the poster is a still from the list above.

| ID | P | Source still | Clip |
|---|---|---|---|
| V01 | P1 | H01 | Home hero: slow push-in through the garden toward the bottles, leaves swaying, sun flare drifting (6–8 s loop) |
| V02 | P0 | U01–U07 | **"How to use Grow Max" video, 45–60 s total**: seven clips of 5–7 s, one animated from each U still (pour and dose, drench, mist, alternate, measure, drench-only, harvest). Editing, captions, voice-over and the dose overlays are added in an editor (CapCut or Higgsfield's editor) **from the coded step text**, so numbers match exactly. |
| V03 | P1 | P02 | GroMax mist landing on leaves in slow motion, droplets beading (4–6 s) |
| V04 | P1 | P03 | RootMax drench soaking into soil (4–6 s) |
| V05 | P0 | O01 / G05 | Odor Max mist burst, backlit, slow motion (4–6 s loop) |
| V06 | P1 | SG1 | Room transformation: haze clearing as the light brightens (6–8 s), pairs with "60 seconds" |
| V07 | P2 | P05 | Nano particle absorption into a leaf (6 s) |
| V08 | — | existing | **Reuse** `public/content/video/NO_UGC_RYAN_skeptic.mp4` and `NO_UGC_SOFIA_smoke.mp4`. ⚠ These use AI talent, so on the site they **cannot be presented as real customer testimonials**. Label them "dramatization" or use them only as problem hooks. |

---

## 11. Existing assets to reuse (no credits needed)

| Asset | Reuse as |
|---|---|
| `public/content/ngm/NGM_S11_freegift.webp`, `NGM_S9_value.webp`, `NGM_S12_results.webp`, `NGM_S10_absorb.webp` | **Not on the site as-is** (they have baked text and the old label). They are style references for the lab-dark look. |
| `public/content/ngm/NGM_S1_beforeafter.webp`, `NGM_S2_HOA.webp`, `NGM_S3_gardener.webp`, `NGM_S7_veghero.webp` | Style references for the golden-garden look, and **label references** (B1). |
| `public/content/nom/NOM_S6_couch.webp` | Concept reference for O02 |
| `public/content/nom/NOM_S1_hotel.webp`, `NOM_S5_car.webp` | Odor label reference; style references for UC09 and O03 |
| Theme assets `dc-z1/z2-before/after.jpg` | Fallback rooms for the spray game until SG1–SG4 exist |
| Theme `usda-badge.svg` | USDA BioPreferred badge (coded) |
| Theme `cs-*.webp` (case-study graphics) | Retired. Their numbers move into coded research cards. |
| Shopify CDN video `0f46f63b...mp4` (Odor "See It In Action") | Keep on the Odor PDP if it's real footage (question Q7) |

---

## 12. Generation-day checklist

1. The real stock images are already in Higgsfield (IDs in `DECISIONS.md`). Create elements **NOM-Bottle** (Odor Max), **GroMax-Bottle** and **RootMax-Bottle** from them. **NGM-Bottle-Duo** already exists.
2. Run background removal on the stock singles (G02–G04 cutouts). Generate G05 and G06 and approve the labels. **Stop and fix the labels before anything else.**
3. Generate H01 (hero), P01 (why both), BA1–BA3 (before/after pairs) and SG1–SG4 (spray game rooms). These are the hardest and most important.
4. Generate U01–U07, R01–R05, O01–O03, UC01–UC06, C01–C03 and H03–H06, H09.
5. P1 items, then P2 items, as credits allow.
6. Videos last: V02 and V05 first.
7. Export at full resolution and name per section 1. Drop them in `docs/nanogrowmax/generated/` (or share a Drive/Dropbox folder). They then get uploaded to Shopify Files and wired into the theme.

**Total: about 100 shot entries** (P0 52 · P1 36 · P2 12), including 7 videos. Three packshots already exist as real stock images. If credits are tight, the P0 set alone carries the launch.
