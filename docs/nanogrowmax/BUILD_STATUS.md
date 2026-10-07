# Build status

## Themes in the Shopify store
| Theme | ID | Purpose |
|---|---|---|
| Copy of rename-odor-max-grow-max-8-24 | 188058468655 | **LIVE.** Never edited. |
| NanoGrow Max — Holiday 2026 (in progress) | 188877701423 | The new theme. Duplicated from live (keeps landing pages, app embeds and settings), with the new design system deployed on top. Preview: `https://nanogrowmax.com/?preview_theme_id=188877701423` |
| zz-sandbox PDP / Odor / Site / Popup | 188877930799 / 188877963567 / 188877996335 / 188878029103 | Per-agent build sandboxes. **Delete after launch** (Online Store → Themes; the API can't delete themes). |

## Code
- Theme source: local git repo, to be pushed to the private `pb37-collab/nanogrowmax-theme` once the Claude GitHub App has access to it. Conventions are in the theme repo's `docs/CONVENTIONS.md`.
- Deploy method: Admin API `themeFilesUpsert` (TEXT bodies, or staged-upload URLs for binaries). Once the repo is attached, connecting it through Shopify's GitHub integration makes deploys automatic.

## Done
- [x] Foundation: design tokens, Archivo variable font (self-hosted), base and component CSS, global runtime (Ajax cart with the Section Rendering API, free-gift auto-sync, discount auto-apply, count-ups, reveals, sticky ATC), layout, SEO meta and Organization/WebSite JSON-LD, announcement bar, header and mobile menu, footer (socials, policies, payment icons), cart drawer (free-shipping status, gift status, native upsells, discount field, express checkout).
- [x] Real product stock images imported to Shopify Files with alt text.

## In progress (parallel build agents)
- [ ] Product page core: purchase section (grow trio picker and Odor tier ladder), gallery, sticky ATC, Product JSON-LD, Why-both, How-to-use (7-step timeline, dose calculator), Research section
- [ ] Odor Max: spray-the-room game with the 25% easter egg, 60-second explainer, use cases, how-to, comparison, FAQ
- [ ] Site: home page, The Research page, cannabis growers page, How-to page, generic sections, utility pages, policy styling
- [ ] Popup: 3 games, new prize table, Klaviyo client subscriptions, auto-applied codes, SMS step

## Integration to-dos (live-store writes, done at launch prep)
- Create the prize discount codes (WIN10 / WIN15 / WINBOTTLE / WIN20 / WIN25) and the easter-egg code (SECRETLION25), each one use per customer and combining with product discounts.
- Update the free-gift BXGY discount to combine with order discounts, so prize codes don't remove the free bottle.
- Klaviyo: single opt-in popup list; switch on the rewritten welcome flow with `prize_code`.
- Upsell.com post-purchase offer: Grow Max Bundle → Odor Max 2-Pack 40% off.
- Remove `seo.hidden` from Nano Odor Max; add product descriptions, SEO fields and alt text; set Shipping and Terms as policies.
- Create pages: `/pages/how-to-use`, `/pages/cannabis-growers` (templates ready).
- Disable the BOGOS, UFE and FastBundle app embeds after QA; remove one session-recording tool.
