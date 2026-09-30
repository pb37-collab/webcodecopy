# Open items for Parker

## Needs a decision or sign-off
- [ ] **Contact email.** Currently `parker@cannaconnect.agency` (`src/lib/site.ts`). Confirm it, or swap in a personal address.
- [ ] **LinkedIn.** Currently set to the URL on the 2026 resume (`linkedin.com/in/parker-beck-3bb939102`). Confirm it's right.
- [ ] **Client names.** The three clients named in the brief are anonymized (hemp smokables DTC brand, cannabis lifestyle brand, cannabis software company). Send written OK before any of them is named.
- [ ] **ZenCo** is named (it's on the resume). Confirm that's fine.
- [ ] **Frosty Hemp Co / Chunky Academy / bud.com creative.** Say which pieces can be shown. Until then only the program sizes are listed, with no images.
- [ ] **Custom domain** (optional, later). Update `site.url` in `src/lib/site.ts` when it's set.

## Needs files (the build container couldn't reach cannaconnect.agency, Drive downloads or Higgsfield)
1. `node scripts/fetch-site-assets.mjs` downloads the v1 images (headshot, portal screen, OG image, feed posts) into `public/images/`.
2. Export these from Drive or Higgsfield into a folder laid out like below, then run `node scripts/optimize-content.mjs <folder>`:
   - `nom/`: NOM_S1_hotel, NOM_S2_parents, NOM_S5_car, NOM_S6_couch, NOM_S7_torturetest
   - `ngm/`: NGM_S1_beforeafter, NGM_S2_HOA, NGM_S3_gardener, NGM_S4_testimonial, NGM_S5_burnnever, NGM_S6_value, NGM_S7_veghero, NGM_S9_value, NGM_S10_absorb, NGM_S11_freegift, NGM_S12_results
   - `video/`: NO_UGC_SOFIA_smoke.mp4, NO_UGC_RYAN_skeptic.mp4 (Drive files `UGC_Sofia_smoke.mp4`, `UGC_Ryan_skeptic_clean.mp4`)
   - `before-after/before.png`: one original "Canna Bust" label static, to show the compliance rework
3. Screenshots, saved as WebP in `public/images/work/`:
   - `ccos-admin.webp`: admin view with **demo client Highland Harvest Co. only**. Check the portal screen from v1 shows demo data too.
   - `lander-nano-nutrient.webp`, `lander-nano-odor-max.webp`, `lander-bloomship.webp`, `lander-flipship.webp` (mobile, 9:19.5)
   - `midterms-map.webp` (16:10)
4. `public/resume/Parker_J_Beck_Resume_2026.pdf`. The "Download PDF" button appears automatically once the file is there.
5. Optional: WebVTT subtitle files for the UGC videos (no captions were burned in).

## Needs numbers (left off the site until they're on record)
- Checkout-leak specifics for Odor Max: what broke, and ATC → purchase rate before and after the fix.
- BLOOMSHIP / FLIPSHIP A/B results.
- Insights: top articles and any traffic figures.

## v1 content
The v1 `index.html` wasn't in this repo, so the home page was rebuilt from the design system and the 2026 resume. Commit v1 and any copy that should carry over can be merged in.
