# Handoff: finish Parker Beck's portfolio (for Cowork)

You're finishing Parker Beck's portfolio on his own computer. The code is done. What's left needs Parker's logins and local network access, which the cloud build session didn't have: deploying to Vercel, pulling real images and video, and taking screenshots.

- **Repo:** `pb37-collab/webcodecopy`
- **Branch:** `claude/cool-brahmagupta-8ii08j`. Push here only, never to `main`.
- **PR:** https://github.com/pb37-collab/webcodecopy/pull/1. Every push to the branch updates it.
- **Stack:** Next.js 16 static export (`output: "export"`), Tailwind v4, Node 24.
- **Also read:** `docs/research/OPEN_ITEMS.md` (what's pending) and `docs/research/SOURCES.md` (where every number comes from).

The site already builds cleanly. Any image that isn't in `public/` yet shows a styled placeholder, so each file you add fills in its slot. You don't need to change code for that.

---

## Hard rules (don't break these)

1. **No invented numbers.** Don't add, round or estimate a metric. A new number goes on the site only if it's in Parker's own files or dashboards, and it also gets a row in `docs/research/SOURCES.md`.
2. **Keep three clients anonymous.** The hemp smokables DTC brand, the cannabis lifestyle brand and the cannabis software company must not be named anywhere, including code, docs, file names and commit messages. The repo is **public**. Their real names appear in Drive sheet titles, so don't copy those titles.
3. **No client creative without sign-off.** Frosty Hemp Co, Chunky Academy and bud.com images stay out until Parker confirms each one in writing. Only Nano Odor Max / NanoGrow Max (Parker's own brands) and @WeedPorns go in.
4. **No secrets or personal data.** Never commit API keys, `.env` values, Supabase URLs or keys, Meta pixel or ad-account IDs, customer lists, giveaway-winner names or addresses, or Parker's phone number. Several Drive files contain these, so copy only the files listed below.
5. **Portal screenshots use the demo client only:** Highland Harvest Co. If a real client name, logo or number is visible anywhere on screen, don't use the shot.
6. **Don't hotlink.** Nothing may point at Higgsfield, Drive or cannaconnect.agency. Every file must be local under `public/`.
7. **Don't edit Parker's other projects.** Read from the Shopify theme, cannaconnect-premium-site and Canna Connect OS, but write only inside this repo.

---

## Step 1: Set up locally

```bash
git clone https://github.com/pb37-collab/webcodecopy.git
cd webcodecopy
git checkout claude/cool-brahmagupta-8ii08j
npm install
npm run check        # lint + typecheck + build — should pass before you touch anything
```

You need `ffmpeg` on PATH for the video step (`brew install ffmpeg` on a Mac).

## Step 2: Pull the v1 images from cannaconnect.agency

```bash
node scripts/fetch-site-assets.mjs
```

This saves the headshot, the portal screen, the OG image and the feed posts into `public/images/`. Open `public/images/proof/portal-screen.webp` and **check it shows only the demo client** (rule 5). If it shows anything else, delete it and retake it in Step 5.

## Step 3: Export creative from Drive and Higgsfield

Create a staging folder, e.g. `~/portfolio-exports/`, and copy files in **renamed exactly as below**. The target names are the ids in `src/data/content.ts`.

**From Google Drive → `Meta Ads Launch/Generated/`:**

| Drive file | Save as |
|---|---|
| `NOM-S1_hotel.png` | `nom/NOM_S1_hotel.png` |
| `NOM-S2_parents.png` | `nom/NOM_S2_parents.png` |
| `NOM-S5_car.png` | `nom/NOM_S5_car.png` |
| `NOM-S6_couch.png` | `nom/NOM_S6_couch.png` |
| `NOM-S7_torturetest.png` | `nom/NOM_S7_torturetest.png` |
| `TEST_NGM-S1_beforeafter.png` | `ngm/NGM_S1_beforeafter.png` |
| `NGM-S2_HOA.png` | `ngm/NGM_S2_HOA.png` |
| `NGM-S3_gardener.png` | `ngm/NGM_S3_gardener.png` |
| `NGM-S4_testimonial.png` | `ngm/NGM_S4_testimonial.png` |
| `NGM-S5_burnnever.png` | `ngm/NGM_S5_burnnever.png` |
| `TEST_NGM-S6_value.png` | `ngm/NGM_S6_value.png` |
| `NGM-S7_veghero.png` | `ngm/NGM_S7_veghero.png` |
| `UGC_Sofia_smoke.mp4` | `video/NO_UGC_SOFIA_smoke.mp4` |
| `UGC_Ryan_skeptic_clean.mp4` | `video/NO_UGC_RYAN_skeptic.mp4` |

**From Google Drive → `Meta Ads Launch/Canna Bust Ad Content/`:**

| Drive file | Save as |
|---|---|
| `3.png` (the "parents downstairs" ad with the old Canna Bust label) | `before-after/before.png` |

Open it first. It should be the "parents are downstairs" concept, because it sits next to `NOM_S2_parents` as a before/after pair. If `3.png` is a different ad, find the Canna Bust version of that concept in the same folder.

**From Higgsfield (Parker's account; download the files, don't copy their URLs):**

| Generation | Save as |
|---|---|
| NGM_S9_value | `ngm/NGM_S9_value.png` |
| NGM_S10_absorb | `ngm/NGM_S10_absorb.png` |
| NGM_S11_freegift | `ngm/NGM_S11_freegift.png` |
| NGM_S12_results | `ngm/NGM_S12_results.png` |

If you can't find a Round 4 still, skip it and list it in your report. Don't substitute a different image.

Then run:

```bash
node scripts/optimize-content.mjs ~/portfolio-exports
```

This writes WebP images (max 1600px) and MP4s (target under 8 MB) with poster frames into `public/content/`. Check that each MP4 is under about 8 MB.

## Step 4: Deploy to Vercel

Parker's Vercel team is `twitterpb37-4062s-projects`.

1. Go to vercel.com → **Add New → Project** → import `pb37-collab/webcodecopy`.
2. Name the project `parker-beck-portfolio`. The framework preset is Next.js; leave the defaults (the static export is set in `next.config.ts`). Node 24.x.
3. Deploy the branch `claude/cool-brahmagupta-8ii08j`.
4. **Turn off Vercel Authentication for this project:** Settings → Deployment Protection. Parker's other projects have it on, and with it on employers would hit a login wall. This is a public portfolio.
5. Copy the deployment URL (e.g. `https://parker-beck-portfolio.vercel.app`) into `site.url` in `src/lib/site.ts`.

## Step 5: Screenshots

Save every screenshot as **WebP** in `public/images/work/`, unless another folder is given. Crop out browser chrome; the site draws its own frame.

| File | What | Size |
|---|---|---|
| `ccos-admin.webp` | Canna Connect OS admin, campaigns view, **filtered to Highland Harvest Co. (demo)** | 1600×1000 (16:10) |
| `../proof/portal-screen.webp` | Only if the v1 image failed the Step 2 check: client portal logged in as the demo client | 1600×1000 |
| `lander-nano-nutrient.webp` | nanogrowmax.com/pages/nano-nutrient, mobile | 390×845 (9:19.5) |
| `lander-nano-odor-max.webp` | nanogrowmax.com/pages/nano-odor-max, mobile | 390×845 |
| `lander-bloomship.webp` | BLOOMSHIP lander, mobile (ask Parker for the URL) | 390×845 |
| `lander-flipship.webp` | FLIPSHIP lander, mobile (ask Parker for the URL) | 390×845 |
| `midterms-map.webp` | midterms2026-cannabis-map.vercel.app, desktop | 1600×1000 |

Before saving the lander screenshots, dismiss any popups and cookie banners. Make sure no discount code shows that Parker wouldn't want public.

## Step 6: Resume PDF (ask Parker first)

Parker's Google Doc `Parker_J_Beck_Resume_2026` **includes his phone number** and **names the hemp smokables client**. The website version leaves both out. Ask Parker whether to:
- (a) export a copy with the phone number removed and that client anonymized as "a hemp smokables DTC brand", or
- (b) skip the PDF for now.

If (a), save it as `public/resume/Parker_J_Beck_Resume_2026.pdf`. The "Download PDF" button appears automatically.

## Step 7: Verify, commit, push

```bash
npm run check
# no secrets or anonymized names crept in (fill in the three real client names locally; don't write them into any file):
git diff --cached | grep -niE "<client-1>|<client-2>|<client-3>|pixel|supabase\.co|api[_-]?key|\(347\)"
```

Then:
1. Open the Vercel preview at 390px width (phone or DevTools) and click through every page: `/`, `/content/`, `/resume/` and all 7 `/work/*` pages. There should be no sideways scrolling, and no image slot on a page should still show a striped placeholder unless it's in the "blocked" list below.
2. Check the `/content/` lightbox: open an image and a video, and use Prev/Next and Esc.
3. Commit on the branch with a clear message and `git push`. This updates PR #1 and redeploys the preview.

## Step 8: Report back to Parker

Send one short message with:
- the **Vercel preview link**
- what was added (counts: images, videos, screenshots)
- anything you skipped and why
- the questions below that are still open

---

## Only Parker can answer these (ask; don't guess)

- **Contact:** keep `parker@cannaconnect.agency`, or switch to a personal email? Is the LinkedIn URL from the resume right?
- **Client sign-off:** written OK from the three anonymized clients before naming them. Is naming ZenCo OK?
- **Client creative:** which Frosty Hemp Co / Chunky Academy / bud.com pieces can be shown?
- **URLs** for the BLOOMSHIP and FLIPSHIP landers.
- **Numbers still missing** (the site stays general until these are on record): checkout-leak before/after (ATC → purchase rate), BLOOMSHIP vs FLIPSHIP A/B results, and Insights article traffic.
- **v1 `index.html`:** if Parker has it, commit it to `docs/design-references/` so any copy worth keeping can be merged in.
- **Custom domain** (optional, later).
