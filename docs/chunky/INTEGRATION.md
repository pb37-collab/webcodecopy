# Chunky Academy free-sample landers: setup guide

Two landing pages, same offer, different hero. Pick one or A/B test them.

| Page | URL path | Hero |
| --- | --- | --- |
| Version 1 | `/chunky/free-sample-v1/` | "Free flower. Your choice." Product cards side by side, form directly under them, sticky claim bar on phones. |
| Version 2 | `/chunky/free-sample-v2/` | "Free flower. The choice is in your hands." Red hand (Runtz) or blue hand (Snowcaps). Tapping a hand picks it and dims the other; the claim form then appears, and submitting it goes to checkout. |
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

Both versions make all three calls when the claim form is submitted. In Version 2 that form only appears after a hand is picked.

If either call fails, the page shows a short error and lets them try again. It never leaves them stuck.

Those `/api/...` routes are same-site only: chunkyacademy.com doesn't allow cross-origin requests. So the pages go live **when they're served from chunkyacademy.com**. Anywhere else, like a Vercel preview, they run in **preview mode**: the whole flow works, but the final step shows the exact requests it would have sent instead of creating a cart.

## Go-live checklist

### 1. Set up the limited run in Shopify: 150 of each, free

This step makes the free price and the "300 left" counter real. **Create a dedicated sample variant for each product**:

| Sample variant | Price | Inventory |
| --- | --- | --- |
| Jolly Rancher Runtz, "Free Sample 7g" | $0, or eligible for the `free-sample` code | **150**, tracked, "continue selling when out of stock" **off** |
| Cotton Candy Toast Snow Cap, "Free Sample 3.5g" | $0, or eligible for the `free-sample` code | **150**, tracked, "continue selling when out of stock" **off** |

Then set `NEXT_PUBLIC_RUNTZ_VARIANT_ID` and `NEXT_PUBLIC_SNOWCAPS_VARIANT_ID` to the new variant IDs.

Shopify then enforces the cap. When a variant hits 0, cart creation fails and the page shows an error instead of a cart. The counter (step 3) reads the same inventory, so what people see is what's actually left.

Until that's done, the defaults point at the live retail variants, which have hundreds in stock and aren't free without the code:

| Sample | Variant | Retail |
| --- | --- | --- |
| Jolly Rancher Runtz, 7g | `42552332812362` | $25.99 |
| Cotton Candy Toast Snow Cap, 3.5g | `43660890832970` | $19.99 |

Don't run the limited run on the retail variants: the counter would show retail stock and the cap wouldn't hold. Keep the `free-sample` code's **once per customer** limit on. The page tells people duplicate sample orders get canceled, same as now.

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

Once they're on chunkyacademy.com, the only settings needed are the two sample variant IDs from step 1. Everything else defaults to the current API, list and discount code.

**Alternative:** keep them on this Vercel project and set `NEXT_PUBLIC_SAMPLE_CART_MODE=permalink` (see below), or set `NEXT_PUBLIC_CHUNKY_API_BASE=https://www.chunkyacademy.com` and allow this domain in the store's CORS headers for those two routes.

### 3. Turn on the live "samples left" counter

Both pages show a **Limited run** meter ("209 / 300 left", with a bar per strain) above the products, a count on each product ("117 / 150 left", red "Only 12 left" at 25 or fewer), a **Sold out** stamp on a strain that hits zero, and an **All 300 claimed** panel with shop links once both are gone. On load the numbers count down from 150 to the real figure.

The numbers come from, in order:

1. **Live inventory**, refreshed every 45 seconds while the page is open. On chunkyacademy.com the page asks `GET /api/free-sample/inventory` for `{"runtz": 117, "snowcaps": 92}`. Add this route to the storefront (the site's Storefront API token can already read `quantityAvailable`; the product pages use it):

   ```ts
   // app/api/free-sample/inventory/route.ts
   import { NextResponse } from "next/server";

   // The two free-sample variants from step 1.
   const VARIANTS = {
     runtz: "gid://shopify/ProductVariant/RUNTZ_SAMPLE_VARIANT_ID",
     snowcaps: "gid://shopify/ProductVariant/SNOWCAPS_SAMPLE_VARIANT_ID",
   };

   export async function GET() {
     // Use the same domain and Storefront token the cart route already uses.
     const res = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2025-07/graphql.json`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "",
       },
       body: JSON.stringify({
         query: `query ($ids: [ID!]!) { nodes(ids: $ids) { ... on ProductVariant { id quantityAvailable } } }`,
         variables: { ids: Object.values(VARIANTS) },
       }),
       next: { revalidate: 30 },
     });
     const json = await res.json().catch(() => null);
     const nodes: { id: string; quantityAvailable: number | null }[] = json?.data?.nodes?.filter(Boolean) ?? [];
     const qty = (gid: string) => nodes.find((n) => n.id === gid)?.quantityAvailable;
     const runtz = qty(VARIANTS.runtz);
     const snowcaps = qty(VARIANTS.snowcaps);
     // On any failure, answer with an error so the page keeps its fallback numbers
     // rather than showing "sold out".
     if (!res.ok || typeof runtz !== "number" || typeof snowcaps !== "number") {
       return NextResponse.json({ error: "inventory unavailable" }, { status: 502 });
     }
     return NextResponse.json(
       { runtz: Math.max(0, runtz), snowcaps: Math.max(0, snowcaps) },
       { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } },
     );
   }
   ```

   Hosting elsewhere? Point `NEXT_PUBLIC_SAMPLE_INVENTORY_URL` at any URL that returns that JSON with CORS allowed.

2. **Fallback numbers**: `NEXT_PUBLIC_RUNTZ_STOCK_LEFT` / `NEXT_PUBLIC_SNOWCAPS_STOCK_LEFT` (default 150 each). The page shows these until live numbers arrive, or always if there's no endpoint. Without the route, update them by hand and redeploy as samples go out.

The run size is `NEXT_PUBLIC_RUNTZ_STOCK_TOTAL` / `NEXT_PUBLIC_SNOWCAPS_STOCK_TOTAL` (150 each). The red bars, the "Limited run: only 300 free samples" copy and the FAQ all follow it.

The page never makes numbers up: it only shows the live count or the fallback you set. Keep it that way. A fake countdown is an FTC problem, and people notice.

### 4. Settings (all optional)

Every option is listed with comments in [`.env.example`](../../.env.example). `NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them.

| Setting | Default | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_SAMPLE_CART_MODE` | `chunky-api` | `permalink` builds a Shopify cart link instead (works from any domain). |
| `NEXT_PUBLIC_RUNTZ_VARIANT_ID` / `NEXT_PUBLIC_SNOWCAPS_VARIANT_ID` | retail 7g / 3.5g | The variants added to the cart. |
| `NEXT_PUBLIC_SAMPLE_DISCOUNT_CODE` | `free-sample` | Discount applied to the cart. |
| `NEXT_PUBLIC_KLAVIYO_LIST_ID` | `V2Si39` | List claimers join. |
| `NEXT_PUBLIC_RUNTZ_STOCK_TOTAL` / `NEXT_PUBLIC_SNOWCAPS_STOCK_TOTAL` | 150 / 150 | Size of the limited run. |
| `NEXT_PUBLIC_RUNTZ_STOCK_LEFT` / `NEXT_PUBLIC_SNOWCAPS_STOCK_LEFT` | 150 / 150 | Fallback "left" counts until live inventory answers. |
| `NEXT_PUBLIC_SAMPLE_INVENTORY_URL` | the site's `/api/free-sample/inventory` | Live counts; `off` disables. |
| `NEXT_PUBLIC_SAMPLE_OFFER_NOTE` | "Just cover shipping." | The offer line on both pages. |

**Permalink mode** links to `https://chunkyacademy.myshopify.com/cart/VARIANT:1?discount=free-sample&checkout[email]=…` with the sample name, page and UTMs written onto the order as attributes. It needs the myshopify Online Store to accept cart links. Test one in a browser first.

### 5. Optional extras

- **Klaviyo event with the sample choice.** The site's subscribe route doesn't record which sample they picked. Set `NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY` (the 6-character Site ID) and each claim also fires a **Claimed Free Sample** event with `Sample`, `Weight`, `Page` and any `utm_*`. Use it to trigger a follow-up flow, or to recover people who claimed but didn't check out.
- **Webhook.** `NEXT_PUBLIC_LEAD_WEBHOOK_URL` gets every lead as JSON (`stage`, `firstName`, `email`, `sample`, `sampleId`, `weight`, `page`, UTMs, `pageUrl`, `at`). `stage` is `"claimed"`.
- **Analytics.** Both pages push `free_sample_claim` (with `sample`, `sample_id`, `page`) to `window.dataLayer`. If a Meta or TikTok pixel is on the page, claims also fire `Lead` / `SubmitForm`.
- **Preselect from an ad.** `?sample=runtz` or `?sample=snowcaps` on Version 1 starts with that card selected.
- **Returning visitors** who already claimed in that browser see a "Finish checkout →" strip.

### 6. Test before sending traffic

- [ ] Claim each sample on a phone. Checkout opens with only that product, and it's free.
- [ ] The counter matches Shopify's inventory for the two sample variants, and drops after a test order.
- [ ] Setting one sample variant's inventory to 0 shows "Sold out" on that strain within a minute.
- [ ] The email shows up on the `V2Si39` list (and the Klaviyo event, if enabled).
- [ ] A second claim with the same email is blocked or canceled.
- [ ] Version 2: tapping one hand then the other switches the pick, and the claim form names the right sample.

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
