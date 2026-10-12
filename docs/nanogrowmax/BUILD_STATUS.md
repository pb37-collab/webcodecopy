# Build status

## Themes in the Shopify store
| Theme | ID | Purpose |
|---|---|---|
| Copy of rename-odor-max-grow-max-8-24 | 188058468655 | Previous live theme (rollback). Never edited. |
| NanoGrow Max — Holiday 2026 (mobile fixes) | 189006348591 | Work copy = live + Klaviyo Viewed Product/Added to Cart tracking on the landing pages + injected social bar hidden (commit 4e7de95). **Owner publishes.** Further edits go to a fresh copy, because the API can't write to the live theme. |
| NanoGrow Max — Holiday 2026 (landing pages) | 188877701423 | **LIVE** (published 2026-10-12). Includes the mobile fixes and the refreshed Meta ad landing pages. The new theme. Duplicated from live (keeps landing pages, app embeds and settings), with the new design system deployed on top. Preview: `https://nanogrowmax.com/?preview_theme_id=188877701423` |
| zz-sandbox PDP / Odor / Site / Popup | 188877930799 / 188877963567 / 188877996335 / 188878029103 | Per-agent build sandboxes. **Delete after launch** (Online Store → Themes; the API can't delete themes). |

## Code
- Theme source: private repo **`pb37-collab/nanogrowmax-theme`** (`main` = integrated build; `feature/*` = agent branches). Conventions are in the theme repo's `docs/CONVENTIONS.md`.
- Deploy method: Admin API `themeFilesUpsert` (TEXT bodies, or staged-upload URLs for binaries). Once the repo is attached, connecting it through Shopify's GitHub integration makes deploys automatic.

## Done
- [x] Foundation: design tokens, Archivo variable font (self-hosted), base and component CSS, global runtime (Ajax cart with the Section Rendering API, free-gift auto-sync, discount auto-apply, count-ups, reveals, sticky ATC), layout, SEO meta and Organization/WebSite JSON-LD, announcement bar, header and mobile menu, footer (socials, policies, payment icons), cart drawer (free-shipping status, gift status, native upsells, discount field, express checkout).
- [x] Real product stock images imported to Shopify Files with alt text.

## Built, merged into `main`, deployed to the in-progress theme (2026-10-07)
- [x] Product page core: purchase section (grow trio picker and Odor tier ladder), gallery, sticky ATC, Product JSON-LD, Why-both hotspots, How-to-use (7-step timeline, cycle animation, dose calculator), Research section
- [x] Odor Max: spray-the-room game (4 rooms, 60-second timer) with the SECRETLION25 easter egg, 60-second explainer with deep-penetration cutaway, use cases, how-to, comparison (Febreze/Ozium), FAQ
- [x] Site: home page, The Research page, cannabis growers page, How-to page, generic sections (before/after, FAQ, testimonials, stats, comparison, CTA, video, product cards), utility pages, policy styling
- [x] Popup: 3 games, new prize table, Klaviyo client subscriptions, auto-applied codes, SMS step
- [x] Integration QA: 91 files checksum-verified, 0 Liquid errors on 15 URLs, CSS leak and overflow fixes

## Images and video (2026-10-10)
- [x] 74 generated stills approved, imported to Shopify Files and wired into every template (`generated/IMAGE_MAP.md`).
- [x] 10 of 13 Kling clips approved plus a captioned 7-step routine reel (`generated/VIDEO_MAP.md`). They are wired as muted loops over their first-frame stills: the home hero (desktop and mobile), how-to steps 1/4/5/6/7, the PDP galleries (GroMax mist, RootMax drench, Odor Max mist) and the how-to reel. Each loop fades in only once it is actually playing.
- V02-2, V02-3 and V06 were rejected twice (foam, hand morph, objects vanishing), so those slots keep their stills.
- [x] Mobile home hero: the headline and buttons come first, then the bottle photo in its own band (bottles no longer sit behind the buttons).
- [x] Odor Max PDP has its own closing CTA. The UGC "Real growers on X" placeholders are hidden until real customer photos exist.

## Preview links (in-progress theme, real templates — the legacy templates are deleted)
- Home: https://nanogrowmax.com/?preview_theme_id=188877701423
- Grow Max Bundle: https://nanogrowmax.com/products/nanogrow-max?preview_theme_id=188877701423
- RootMax: https://nanogrowmax.com/products/rootmax?preview_theme_id=188877701423
- GroMax: https://nanogrowmax.com/products/growmax?preview_theme_id=188877701423
- Nano Odor Max: https://nanogrowmax.com/products/nano-odor-max?preview_theme_id=188877701423
- The Research: https://nanogrowmax.com/pages/case-studies?preview_theme_id=188877701423
- About: https://nanogrowmax.com/pages/about?preview_theme_id=188877701423
- How to Use (until the page exists): https://nanogrowmax.com/pages/about?preview_theme_id=188877701423&view=how-to-use
- Cannabis growers (until the page exists): https://nanogrowmax.com/pages/about?preview_theme_id=188877701423&view=cannabis-growers
- Popup (forced open): add `&ngm_popup=1` to any link

## 2026-10-12 mobile pass (in the mobile-fixes copy)
- Product galleries: square frame on mobile, photos fill it, no dots over the product.
- Home hero: the photo/video band is clipped to its own space, and the trust chips are a tidy 3-up row.
- "60s / odor gone" badge sized to fit. Stat tags and before/after labels no longer wrap or collide.
- Mobile menu cards: Grow Max Bundle $99.99, Nano Odor Max "From $12.99" (they skip the hidden $0 gift variant). The social-share price does the same.
- Footer "Explore" uses the main menu.
- Popup: Klaviyo company and list now default in theme settings. The SMS step is hidden until "SMS is set up in Klaviyo" is ticked.
- Live store: the popup prize codes and the easter-egg code were created (one use per customer, combine with the free-bottle offer). The free-bottle automatic discount now combines with order and product discounts. The single opt-in popup list was created in Klaviyo.

## 2026-10-12 Meta ad landing pages (in the landing-pages copy)
- `/pages/nano-nutrient` (Grow Max) and `/pages/nano-odor-max` take almost all the ad traffic.
- Fixed:
  - The Grow Max landing page sent the bundle to checkout without the promised free Odor Max, because the page never loaded the gift script. The page now adds the gift and removes legacy $0 gift lines.
  - Wrong dosing math (5 mL/gal) was replaced with 2 mL per 1 L.
- Both pages were rebuilt with the generated images: research, before/after, how-to, use cases and FAQ.
- Express checkout (Apple Pay / Shop Pay / Google Pay) is in both buy boxes.
  - Express checkout of the **bundle** skips the cart, so the free bottle isn't included. The page notes this.
  - The 4-pack bonus bottle is part of that variant, so it's included.
  - Recommended fix: make the bundle a Shopify Bundle that includes the 8 oz Odor Max (or a Flow that adds it on order created).
- Klaviyo welcome emails: templates exist (source in the theme repo, docs/klaviyo/). The flow is built by the owner in the Klaviyo UI.

## 2026-10-12 store clean-up
- Created pages /pages/how-to-use and /pages/cannabis-growers (they were 404s), with SEO titles and descriptions. Main menu: added How to Use; "Case Studies" renamed "The Research". Footer menu: added For Cannabis Growers.
- Archived the BOGOS gift products. Shopify Flow "Bundle gift: add free 8 oz Odor Max" (built via Cowork) adds the free bottle to express-checkout bundle orders.
- Still open: uninstall BOGOS (owner); build the Klaviyo welcome flow (Cowork); the social-icons.js script tag points at the old theme "nanogrow-cannabust-theme-2" asset (hidden by CSS; delete that old theme or the app).

## Owner to-dos in the theme editor
- Turn off the "Metashop (Instagram/Facebook)" app embed. It adds a second social-icons bar under the footer.

## Integration to-dos (live-store writes, done at launch prep)
- Create the prize discount codes (WIN10 / WIN15 / WINBOTTLE / WIN20 / WIN25) and the easter-egg code (SECRETLION25), each one use per customer and combining with product discounts. Exact specs are in the theme repo's `docs/popup-integration.md`.
- Klaviyo SMS isn't set up (no sending number). Either set it up or turn off the popup's SMS step.
- Update the free-gift BXGY discount to combine with order discounts, so prize codes don't remove the free bottle.
- Klaviyo: single opt-in popup list; switch on the rewritten welcome flow with `prize_code`.
- Upsell.com post-purchase offer: Grow Max Bundle → Odor Max 2-Pack 40% off.
- Remove `seo.hidden` from Nano Odor Max; add product descriptions, SEO fields and alt text; set Shipping and Terms as policies.
- Create pages: `/pages/how-to-use`, `/pages/cannabis-growers` (templates ready).
- BOGOS and UFE embeds are now disabled in the in-progress theme. Still to do: FastBundle, and removing one session-recording tool.
