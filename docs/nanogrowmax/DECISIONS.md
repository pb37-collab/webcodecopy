# NanoGrow Max redesign: owner decisions log

The owner's answers, with dates. Where this log conflicts with a research doc, this log wins.

| Date | Topic | Decision |
|---|---|---|
| 2026-10-07 | Brand architecture | **Grow Max Bundle** = **RootMax** + **GroMax**. Keep this naming everywhere. |
| 2026-10-07 | Shipping & guarantee | Free shipping on **all** orders, with no threshold. 30-day money-back guarantee stands. |
| 2026-10-07 | Upsells / discounts | Keep every current upsell, discount and add-on, and integrate them into the cart. |
| 2026-10-07 | Popup | Redesign it on-brand. Keep the same 3 games, and the prizes and odds unchanged. Recode it and wire it properly to email marketing (Klaviyo). |
| 2026-10-07 | Mixing dose | **Mix both together: 2 mL GroMax + 2 mL RootMax per 1 L** of non-chlorinated water, fresh each time. |
| 2026-10-07 | Product label | ~~Meta-ad label canonical~~ **Superseded the same day:** use the **actual product stock images** (real labels) from Higgsfield. See "Canonical product images" below. Ads may keep the Meta-adjusted label; the site shows the real bottles customers receive. |
| 2026-10-07 | Images | Higgsfield credits renew 2026-10-08. Generate the images then, from `IMAGE_GENERATION_BRIEF.md`. |
| 2026-10-07 | Priority | Mobile first. Fast add-to-cart, cart and checkout. Strong product SEO. |
| 2026-10-07 | Leaf spray vs soil drench | **Settled.** **Pre-planting soil prep (Step 2, −9 and −5 days): drench with BOTH**, 2 mL GroMax + 2 mL RootMax per 1 L. **From then on, leaf spray = GroMax only** (2 mL per 1 L) and **soil drench = RootMax only** (2 mL per 1 L), alternating every 5–7 days. Flowering and finish follow the X chart: stop leaf sprays, RootMax drenches only, stop all use about 2 weeks before harvest. Owner quotes: "Mix both together, 2 mL each per liter"; "you just use GroMax to spray the leaves"; "when you are first treating the soil before planting, you use both". |
| 2026-10-07 | Positioning | **Hybrid.** Garden imagery and copy on the home page, the product pages and the main how-to (tomatoes, herbs, houseplants, which are Meta-safe). A **separate cannabis growers section or page** carries cannabis-specific results (THC study, cannabis case studies) and cannabis-plant imagery. |
| 2026-10-07 | Code home and deploy | Approved: create a **private GitHub repo `nanogrowmax-theme`** and a **new unpublished Shopify theme "NanoGrow Max — Holiday 2026"**. The live theme is never edited; the owner publishes. |
| 2026-10-07 | Odor Max 2-Pack upsell | **Make it really $11.99.** Create an automatic discount: Odor Max 2-Pack 40% off ($19.99 → $11.99) when GroMax, RootMax or the Grow Max Bundle is in the cart. Show the upsell to bundle buyers too. Timing (now vs at launch) still to confirm. |
| 2026-10-07 | Bottle size | **GroMax 16 fl oz + RootMax 16 fl oz = 32 fl oz bundle.** Nano Odor Max is 8 oz. |
| 2026-10-07 | Customer photos | The owner will import real customer pictures from X. Use them in the reviews/UGC sections, credited with handle and permission. |
| 2026-10-07 | Odor Max positioning | Removes **any unwanted odor**: car, apartment, house, fabrics (clothes, furniture), smoke odor. **Deep penetration below the surface, unlike candles and scented sprays.** |
| 2026-10-07 | Post-purchase upsell | **After checkout:** Grow Max Bundle buyers get a one-click offer to add **2 bottles of Odor Max (2-Pack) at 40% off ($19.99 → $11.99)**. This replaces the "$11.99 in-cart" idea, which charged $19.99. The cart offers "Upgrade to the bundle" to single-product buyers and Odor Max at regular price to others. |
| 2026-10-07 | Free gift | **Every** buyer of the Grow Max Bundle **or** the Odor Max 4-Pack gets a free 8 oz Odor Max bottle. (The 4-Pack variant is already "4-Pack + Free Bonus Bottle".) |
| 2026-10-07 | Claims | All claims are factual, per the owner. **All stay**, worded sensibly with study context and footnotes (+40.7% yield, +24.2% THC on the cannabis page, 100x absorption, 60 seconds, pet and child safe, USDA BioPreferred, case study numbers). |
| 2026-10-07 | Testimonials | The existing named testimonials are **true**. Keep them (and import them into Judge.me so they count as reviews). |
| 2026-10-07 | Popup prizes and odds | **Claude's judgement, optimizing for conversion and contact capture** (see BUILD_PLAN §5). |
| 2026-10-07 | Apps | Approved to replace third-party apps with native theme features. Exception: post-purchase upsells need an app by Shopify's rules, so Upsell.com (ex-ReConvert) stays for that. |
| 2026-10-07 | Spray game easter egg | Anyone who **completes** the Odor Max spray game unlocks a **secret 25% off** code, with a special "you found the easter egg" animation. |
| 2026-10-07 | Competitor names | Keep Febreze and Ozium **by name** in the comparison table. |
| 2026-10-07 | Holiday offers | **On hold.** The owner sends BFCM offers at the end of October. Build the slots (announcement bar, hero variant, gift scene) but no offer yet. |
| 2026-10-07 | Social links | X https://x.com/NanoGrowMaxInc · Instagram https://www.instagram.com/nanogrowmaxinc/ · TikTok https://www.tiktok.com/@nanogrowmaxinc |
| 2026-10-07 | Code repo | Owner created private repo `pb37-collab/nanogrowmax-theme`. The Claude GitHub App needs access granted to it before the session can attach it. |

## Canonical product images (real labels)

From the owner's Higgsfield library, imported to **Shopify Files** with alt text:

| Shopify file | Higgsfield media id | Shows |
|---|---|---|
| `ngm-stock-gromax-black.png` (1254²) | `5ba17cf4-2f4b-4780-8062-7ec669bc1e75` | GroMax, black background |
| `ngm-stock-gromax-white.png` (1254²) | `cdcd7a10-bd5a-4ca1-a009-64569c2ca555` | GroMax, white background |
| `ngm-stock-rootmax-black.png` (1254²) | `dceb5c30-8f6b-4129-a17f-31a5507e8908` | RootMax, black background |
| `ngm-stock-rootmax-white.png` (1254²) | `80cfd07c-1eb2-43ff-bca6-9e4eb7766722` | RootMax, white background |
| `ngm-stock-bundle-duo-black.png` (1536×1024) | `1478f615-ebdd-4629-b10b-4d574463cde4` | GroMax + RootMax duo. Also Higgsfield element **NGM-Bottle-Duo** `d0f45d5c-278a-4c7c-9540-8f1c51e9bdc6` |
| `ngm-stock-odormax-dark-smoke.png` (1086×1448) | `290a6250-b0b7-40fd-835d-e68304c21623` | Odor Max, dark green smoke |
| `ngm-stock-odormax-white.png` (1086×1448) | `b3d0453a-b65e-40de-8b58-c9aaed4bba95` | Odor Max, white background |
| `ngm-stock-odormax-spraying.png` (1100×1473) | `661565d9-def6-4a82-8a64-c455b113cc1f` | Odor Max spraying mist, light |
| `ngm-logo-lion-crest.png` (1080²) | `d869bf54-914b-4b00-a282-102b393f47c1` | Lion crest logo |

Higgsfield lifestyle personas already exist for **illustrative, non-testimonial** content: NGM-Grower-Claire / Elena / Maya and NOM-Home-Diego / Nina.
