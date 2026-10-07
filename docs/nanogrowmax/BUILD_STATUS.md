# Build status

## Themes in the Shopify store
| Theme | ID | Purpose |
|---|---|---|
| Copy of rename-odor-max-grow-max-8-24 | 188058468655 | **LIVE.** Never edited. |
| NanoGrow Max — Holiday 2026 (in progress) | 188877701423 | The new theme. Duplicated from live (keeps landing pages, app embeds and settings), with the new design system deployed on top. Preview: `https://nanogrowmax.com/?preview_theme_id=188877701423` |
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

## Preview links (in-progress theme; `view=` aliases until the legacy templates are deleted)
- Home: https://nanogrowmax.com/?preview_theme_id=188877701423&view=preview
- Grow Max Bundle: https://nanogrowmax.com/products/nanogrow-max?preview_theme_id=188877701423&view=preview-bundle
- RootMax: https://nanogrowmax.com/products/rootmax?preview_theme_id=188877701423&view=preview-rootmax
- GroMax: https://nanogrowmax.com/products/growmax?preview_theme_id=188877701423&view=preview-default
- Nano Odor Max: https://nanogrowmax.com/products/nano-odor-max?preview_theme_id=188877701423&view=preview-odor
- The Research: https://nanogrowmax.com/pages/case-studies?preview_theme_id=188877701423
- How to Use: https://nanogrowmax.com/pages/about?preview_theme_id=188877701423&view=how-to-use
- Cannabis growers: https://nanogrowmax.com/pages/about?preview_theme_id=188877701423&view=cannabis-growers
- Popup (forced open): add `&ngm_popup=1` to any link

## Blocked on the owner
- Delete the 9 legacy `.liquid` templates in the in-progress theme (Cowork prompt sent), so the real `.json` templates can be uploaded.

## Integration to-dos (live-store writes, done at launch prep)
- Create the prize discount codes (WIN10 / WIN15 / WINBOTTLE / WIN20 / WIN25) and the easter-egg code (SECRETLION25), each one use per customer and combining with product discounts. Exact specs are in the theme repo's `docs/popup-integration.md`.
- Klaviyo SMS isn't set up (no sending number). Either set it up or turn off the popup's SMS step.
- Update the free-gift BXGY discount to combine with order discounts, so prize codes don't remove the free bottle.
- Klaviyo: single opt-in popup list; switch on the rewritten welcome flow with `prize_code`.
- Upsell.com post-purchase offer: Grow Max Bundle → Odor Max 2-Pack 40% off.
- Remove `seo.hidden` from Nano Odor Max; add product descriptions, SEO fields and alt text; set Shipping and Terms as policies.
- Create pages: `/pages/how-to-use`, `/pages/cannabis-growers` (templates ready).
- Disable the BOGOS, UFE and FastBundle app embeds after QA; remove one session-recording tool.
