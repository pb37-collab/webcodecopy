# Chunky Academy free-sample landers: setup guide

Two landing pages, same offer, different hero. Pick one or A/B test them.

| Page | URL path | Hero |
| --- | --- | --- |
| Version 1 | `/chunky/free-sample-v1/` | "Free flower. Your choice." Product cards side by side, form directly under them, sticky claim bar on phones. |
| Version 2 | `/chunky/free-sample-v2/` | "Free flower. The choice is in your hands." Red hand (Runtz) or blue hand (Snowcaps). The email unlocks the hands; the tapped hand goes to checkout. |
| Index | `/chunky/` | Internal links to both. |

Both pages are `noindex`, use Chunky's own logo, fonts (Outfit + DM Sans), colors, trust badges, stats and footer disclaimer, and share one config.

## How a claim works

The default **`chunky-api`** mode makes exactly the calls the current `chunkyacademy.com/free-sample` page makes:

```
Visitor picks a sample + enters first name & email
  1. POST /api/klaviyo/subscribe         { email, name, listId: "V2Si39", redirectUrl: null }
  2. POST /api/cart/create-with-product  { variantId: "gid://shopify/ProductVariant/…", quantity: 1,
                                           discountCode: "free-sample" }
  3. Redirect to the checkoutUrl it returns
```

Version 2 makes call 1 when the email unlocks the hands, so the lead is saved even if they leave before choosing, then calls 2 and 3 when they tap a hand.

If either call fails, the page shows a short error and lets them try again. It never leaves them stuck.

Those `/api/...` routes are same-site only: chunkyacademy.com doesn't allow cross-origin requests. So the pages go live **when they're served from chunkyacademy.com**. Anywhere else, like a Vercel preview, they run in **preview mode**: the whole flow works, but the final step shows the exact requests it would have sent instead of creating a cart.

## Go-live checklist

### 1. Make sure the two samples come out free

The defaults point at the live retail variants:

| Sample | Variant | Retail |
| --- | --- | --- |
| Jolly Rancher Runtz, 7g | `42552332812362` | $25.99 |
| Cotton Candy Toast Snow Cap, 3.5g | `43660890832970` | $19.99 |

The current free-sample page uses dedicated sample variants with the `free-sample` code. Pick one:

- **A. Dedicated sample variants (matches today's setup).** Create a $0 (or `free-sample`-eligible) sample variant for each product, and set `NEXT_PUBLIC_RUNTZ_VARIANT_ID` / `NEXT_PUBLIC_SNOWCAPS_VARIANT_ID` to the new IDs.
- **B. Use the retail variants.** Add those two variants to the `free-sample` discount's eligible products.

Either way, keep the code's **once per customer** limit on. The page tells people duplicate sample orders get canceled, same as now.

### 2. Put the page on chunkyacademy.com

The storefront is a Next.js + Tailwind app, the same stack as these pages, so the cleanest route is to copy the files in:

```
src/app/(chunky)/chunky/free-sample-v1/page.tsx   → app/free-sample/page.tsx (or app/free-sample-2/…)
src/app/(chunky)/chunky/free-sample-v2/page.tsx
src/components/chunky/*                            → components/chunky/*
src/lib/chunky/*                                   → lib/chunky/*
src/app/(chunky)/chunky.css                        → import it in that route's layout (theme tokens + keyframes)
public/images/chunky/*                             → public/images/chunky/*
```

Dependencies: `lucide-react`, `clsx` + `tailwind-merge` (the `cn()` helper in `src/lib/utils.ts`), Tailwind v4, and the four Google fonts loaded in `src/app/(chunky)/layout.tsx` (Outfit, DM Sans, Permanent Marker, JetBrains Mono).

The pages have their own header and footer, so render them without the store's site chrome, as the current `/free-sample` page already is.

Once they're on chunkyacademy.com, no settings are needed: the defaults are the current API, list and discount code.

**Alternative:** keep them on this Vercel project and set `NEXT_PUBLIC_SAMPLE_CART_MODE=permalink` (see below), or set `NEXT_PUBLIC_CHUNKY_API_BASE=https://www.chunkyacademy.com` and allow this domain in the store's CORS headers for those two routes.

### 3. Settings (all optional)

Every option is listed with comments in [`.env.example`](../../.env.example). `NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them.

| Setting | Default | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_SAMPLE_CART_MODE` | `chunky-api` | `permalink` builds a Shopify cart link instead (works from any domain). |
| `NEXT_PUBLIC_RUNTZ_VARIANT_ID` / `NEXT_PUBLIC_SNOWCAPS_VARIANT_ID` | retail 7g / 3.5g | The variants added to the cart. |
| `NEXT_PUBLIC_SAMPLE_DISCOUNT_CODE` | `free-sample` | Discount applied to the cart. |
| `NEXT_PUBLIC_KLAVIYO_LIST_ID` | `V2Si39` | List claimers join. |
| `NEXT_PUBLIC_SAMPLE_SPOTS_TOTAL` / `_LEFT` | empty | Shows "Available for the next ~~1000~~ 450 people" like the current page. |
| `NEXT_PUBLIC_SAMPLE_OFFER_NOTE` | "Just cover shipping." | The offer line on both pages. |

**Permalink mode** links to `https://chunkyacademy.myshopify.com/cart/VARIANT:1?discount=free-sample&checkout[email]=…` with the sample name, page and UTMs written onto the order as attributes. It needs the myshopify Online Store to accept cart links. Test one in a browser first.

### 4. Optional extras

- **Klaviyo event with the sample choice.** The site's subscribe route doesn't record which sample they picked. Set `NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY` (the 6-character Site ID) and each claim also fires a **Claimed Free Sample** event with `Sample`, `Weight`, `Page` and any `utm_*`. Use it to trigger a follow-up flow, or to recover people who claimed but didn't check out.
- **Webhook.** `NEXT_PUBLIC_LEAD_WEBHOOK_URL` gets every lead as JSON (`stage`, `firstName`, `email`, `sample`, `sampleId`, `weight`, `page`, UTMs, `pageUrl`, `at`). `stage` is `"email"` at Version 2's unlock step and `"claimed"` once a sample is picked.
- **Analytics.** Both pages push `free_sample_claim` (with `sample`, `sample_id`, `page`) to `window.dataLayer`. Version 2 also pushes `free_sample_email`. If a Meta or TikTok pixel is on the page, claims also fire `Lead` / `SubmitForm`.
- **Preselect from an ad.** `?sample=runtz` or `?sample=snowcaps` on Version 1 starts with that card selected.
- **Returning visitors** who already claimed in that browser see a "Finish checkout →" strip.

### 5. Test before sending traffic

- [ ] Claim each sample on a phone. Checkout opens with only that product, and it's free.
- [ ] The email shows up on the `V2Si39` list (and the Klaviyo event, if enabled).
- [ ] A second claim with the same email is blocked or canceled.
- [ ] Version 2: entering the email, closing the tab, and coming back still leaves the email on the list.

## Images

The product art is Chunky's own product photography, cut out of the white backgrounds:

```
public/images/chunky/jolly-rancher-runtz.webp          ← cdn.shopify.com/…/files/B346-1.jpg
public/images/chunky/cotton-candy-toast-snowcaps.webp  ← cdn.shopify.com/…/files/ChatGPT_Image_Jun_3_2026_04_15_13_PM_1.png
public/images/chunky/chunky-academy-logo.png           ← chunkyacademy.com/assets/CHUNKY_ACADEMY.png
public/images/chunky/icon-*.svg                        ← chunkyacademy.com/assets/free-sample/*.svg
```

To redo the cutouts (for example after swapping a photo URL in the script): `node scripts/chunky-cutouts.mjs`. Better photos make better cutouts. A transparent PNG straight from the photographer can be dropped in under the same file name.

## Copy and facts

- Product names, types, prices, tasting notes and descriptions are in `src/lib/chunky/products.ts`. They come from the live product pages (October 2026). Jolly Rancher Runtz is listed there as a **Sativa Hybrid**; Cotton Candy Toast Snow Cap as a **Hybrid**.
- The FAQ, trust tiles, stats band and footer are in `src/components/chunky/shared.tsx`. The stats (4.9/5, 10,000+, 98%, 2,500+) and the footer disclaimer and no-ship states are copied from the homepage. Update both places if those change.
- The Jolly Rancher Runtz product photo on the store (`B346-1.jpg`) carries the alt text "Cherry Bombay", so it may be a shared photo. Swap in a Runtz-specific shot if there is one.

## Brand and compliance notes

- The themes stay adult: Chunky's street look (bold uppercase type, neon green, stickers, halftone) with no cartoon candy or characters. "21+ ONLY" sits in the header, the consent line and the footer.
- **"Jolly Rancher" is a Hershey trademark.** The pages use the strain name as the store lists it. Confirm you're comfortable using it in paid traffic and marketing email.
- The footer carries the store's disclaimer verbatim plus the free-sample terms. Have your compliance contact review it alongside your ad platforms' rules.
