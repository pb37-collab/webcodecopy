# Open items for Parker

## Needs a decision or sign-off
- [x] **Contact email.** Keep `parker@cannaconnect.agency` (confirmed).
- [x] **LinkedIn.** `linkedin.com/in/parker-beck-3bb939102` (confirmed).
- [ ] **Client names.** The three clients named in the brief are anonymized (hemp smokables DTC brand, cannabis lifestyle brand, cannabis software company). Send written OK before any of them is named.
- [x] **ZenCo** can be named (confirmed).
- [ ] **Frosty Hemp Co / Chunky Academy / bud.com creative.** Say which pieces can be shown. Until then only the program sizes are listed, with no images.
- [ ] **Custom domain** (optional, later). Update `site.url` in `src/lib/site.ts` when it's set.

## Files (done 2026-09-30)
- [x] v1 images pulled into `public/images/` (headshot, portal screen, OG image, 9 feed posts). The portal screen shows only the demo client, Highland Harvest Co.
- [x] Creative exported to `public/content/`: 17 stills (NOM S1, S2, S5, S6, S7; NGM S1–S7 and Round 4 S9–S12), the Canna Bust "parents downstairs" before image, and 2 UGC videos (about 4 MB each, with poster frames).
  - Round 4 stills are the four NGM ad units generated together in Higgsfield on 2026-09-01 (value, absorb, free gift, results).
  - The UGC videos have captions burned in, so they need no WebVTT track.
- [x] Screenshots in `public/images/work/`: `ccos-admin.webp` (Highland Harvest Co., Campaign 3, demo data only), four mobile landers, `midterms-map.webp`.
- [x] `public/resume/Parker_J_Beck_Resume_2026.pdf`: exported from a cleaned Drive copy of the resume (phone number removed, hemp smokables client anonymized).

## Needs a decision
- [ ] **Gamified landers.** `feed-and-bloom` is the BLOOMSHIP variant (tap-to-feed game). `deep-clean` is also gamified (a spray-down game), but its codes are DEEPCLEAN25/DCSHIP. Which lander is FLIPSHIP?
- [ ] **Production branch.** `parker-beck-portfolio.vercel.app` still serves `master` (the empty template). Set the production branch to this branch, or merge PR #1.

## Needs numbers (left off the site until they're on record)
- Checkout-leak specifics for Odor Max: what broke, and ATC → purchase rate before and after the fix.
- BLOOMSHIP / FLIPSHIP A/B results.
- Insights: top articles and any traffic figures.

## v1 content
The v1 `index.html` wasn't in this repo, so the home page was rebuilt from the design system and the 2026 resume. Commit v1 and any copy that should carry over can be merged in.
