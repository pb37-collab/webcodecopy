# Chunky Academy free-sample landers: setup guide

Two landing pages, same offer, different hero. Pick one or A/B test them.

| Page | URL path | Hero |
| --- | --- | --- |
| Version 1 | `/chunky/free-sample-v1/` | "Two strains. One is on us." Product cards side by side, form directly under them, sticky claim bar on phones. |
| Version 2 | `/chunky/free-sample-v2/` | "Pick a hand." Red hand (Runtz) or blue hand (Snowcaps). The email unlocks the hands; the tapped hand goes to the cart. |
| Index | `/chunky/` | Internal links to both, plus whether the store is connected. |

Both pages are `noindex` and share one config, so connecting the store once connects both.

## How a claim works

```
Visitor picks a sample + enters first name & email
        │
        ├─► Klaviyo: subscribe to list + "Claimed Free Sample" event   (optional)
        ├─► Webhook: JSON POST with the lead                          (optional)
        ├─► dataLayer: free_sample_claim  (+ Meta "Lead" if the pixel is on the page)
        │      (waits at most 2.5s on these, then moves on regardless)
        ▼
Redirect to a Shopify cart permalink:
https://STORE/cart/VARIANT_ID:1?discount=CODE&checkout[email]=…&attributes[Free sample]=…&storefront=true
```

Version 2 also sends the lead to Klaviyo/webhook the moment the email unlocks the hands (`stage: "email"`), so nobody who bails before choosing is lost.

The cart permalink **replaces** whatever is in the cart with the one sample, pre-fills the checkout email and first name (reliably in `checkout` mode; Shopify may drop the pre-fill when the link stops at the cart page), applies the discount code if one is set, and writes the sample name, page and UTM tags onto the order (Order → Notes / Additional details). Reference: [Shopify cart permalinks](https://shopify.dev/docs/apps/build/checkout/create-cart-permalinks).

## Go-live checklist (about 15 minutes)

### 1. Shopify: make the samples free

Pick one approach:

- **A. $0 sample variants (simplest).** On each product, add a variant such as "Free Sample" priced at $0.00 (7g on Jolly Rancher Runtz, 3.5g on Cotton Candy Toast Snowcaps). Set inventory to however many samples you're giving away; when it hits 0 the offer stops itself.
- **B. Regular variants + discount code.** Use the normal 7g and 3.5g variants and create a 100%-off code (e.g. `FREESAMPLE`) that applies only to those two variants, is **limited to one use per customer**, and has a total usage cap. Put the code in `NEXT_PUBLIC_SAMPLE_DISCOUNT_CODE`.

B enforces "one per customer" at checkout; A relies on inventory and your fulfillment review. You can also combine them: $0 variants plus a code that's required to check out.

Shipping is whatever your normal shipping rates charge. If you want a flat sample-shipping price, create a shipping rate with a condition on the $0 order price.

### 2. Get the variant IDs

Shopify Admin → Products → open the product → click the variant. The number at the end of the URL is the variant ID:

```
admin.shopify.com/store/…/products/8123456789/variants/45678901234567
                                                      └──── variant ID
```

### 3. Check which domain to use

Open `https://www.chunkyacademy.com/cart/VARIANT_ID:1` in a browser.

- If it lands on the cart or checkout with the product in it, use `www.chunkyacademy.com`.
- If it 404s (the storefront is custom or headless), use the `your-store.myshopify.com` domain instead, and set `NEXT_PUBLIC_SAMPLE_DESTINATION=checkout` if that domain's Online Store cart page isn't set up.

### 4. Add the environment variables

In Vercel → Project → Settings → Environment Variables (or `.env.local` for local testing), set at least:

```
NEXT_PUBLIC_SHOPIFY_DOMAIN=www.chunkyacademy.com
NEXT_PUBLIC_RUNTZ_VARIANT_ID=45678901234567
NEXT_PUBLIC_SNOWCAPS_VARIANT_ID=45678901234568
```

Every option is listed with comments in [`.env.example`](../../.env.example). Redeploy after changing them: `NEXT_PUBLIC_*` values are baked in at build time.

Until the domain and both IDs are set, the pages run in **preview mode**: the whole flow works, but the final step shows the cart link it would have opened instead of redirecting. The `/chunky/` index shows which mode you're in.

### 5. Connect email capture (recommended)

**Klaviyo**

1. Settings → API keys → copy the **public API key / Site ID** (6 characters). It's designed to be used in the browser.
2. Lists & Segments → create a list such as "Free Sample 2026" → copy its ID from the URL.
3. Set `NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY` and `NEXT_PUBLIC_KLAVIYO_LIST_ID`.
4. Build a flow triggered by the metric **Claimed Free Sample** (rename it with `NEXT_PUBLIC_KLAVIYO_EVENT_NAME`). Event properties: `Sample`, `Weight`, `Page`, plus any `utm_*`. Profiles also get `Free sample choice` and `Free sample page`.

Use the flow to recover people who claimed but didn't finish checkout: compare the Klaviyo event with Shopify "Placed Order".

Subscriptions go through Klaviyo's client subscription API, so the list's double opt-in setting applies. The form shows consent text ("agree to get emails… unsubscribe anytime").

**Webhook (Zapier, Make, Shopify Flow, Google Sheets, your own API)**

Set `NEXT_PUBLIC_LEAD_WEBHOOK_URL`. Each lead is POSTed as JSON:

```json
{
  "stage": "claimed",
  "firstName": "Jamie",
  "email": "jamie@example.com",
  "sample": "Cotton Candy Toast Snowcaps",
  "sampleId": "snowcaps",
  "weight": "3.5g",
  "page": "free-sample-v2",
  "utm_source": "ig",
  "utm_campaign": "fall",
  "pageUrl": "https://…/chunky/free-sample-v2/?utm_source=ig&utm_campaign=fall",
  "at": "2026-10-05T15:04:05.000Z"
}
```

`stage` is `"email"` for Version 2's unlock step (sample fields are `null`) and `"claimed"` once a sample is picked. The receiving endpoint must allow cross-origin POSTs (Zapier and Make catch hooks do).

### 6. Swap in the real product photos

The bud art on the pages is a generated stand-in. Replace these two files, keeping the names:

```
public/images/chunky/jolly-rancher-runtz.webp
public/images/chunky/cotton-candy-toast-snowcaps.webp
```

- **Transparent background** cutouts. Both pages float the bud over colored light, and Version 2 sets it in the palm of the hand.
- Square, about 800×800, bud centered with a little padding. WebP keeps it under ~80 KB.
- Different names or formats: change `image` in `src/lib/chunky/products.ts`.

To regenerate the stand-ins: `node scripts/chunky-placeholder-nugs.mjs`.

### 7. Test before sending traffic

- [ ] `/chunky/` shows **live**.
- [ ] Claim each sample on a phone. The cart opens with only that product, at $0 (or with the code applied).
- [ ] Checkout shows the email you typed.
- [ ] Place a test order: the order shows `Free sample`, `Sample page` and UTM attributes.
- [ ] The Klaviyo profile and event (or webhook row) appear.
- [ ] A second claim with the same email is blocked at checkout (if you're using a once-per-customer code).

## Useful extras

- **Preselect a product from an ad:** append `?sample=runtz` or `?sample=snowcaps` to the Version 1 URL. The matching card starts selected.
- **UTMs** are read from the page URL and passed to the order, Klaviyo and the webhook automatically.
- **Analytics:** both pages push `free_sample_claim` (with `sample`, `sample_id`, `page`) to `window.dataLayer`; Version 2 also pushes `free_sample_email` at the unlock step. If a Meta or TikTok pixel is on the page, claims also fire `Lead` / `SubmitForm`. Add your GTM/pixel snippet in `src/app/(chunky)/layout.tsx`.
- **Returning visitors** who already claimed in that browser see a "Finish checkout →" strip linking back to their cart. This is a convenience, not enforcement: enforce one per customer in Shopify (step 1B).
- **Copy changes:** product names, tasting notes and descriptions live in `src/lib/chunky/products.ts`; the FAQ and legal footer are in `src/components/chunky/shared.tsx`; the offer line ("Just cover shipping.") is `NEXT_PUBLIC_SAMPLE_OFFER_NOTE`.
- **Not using cart permalinks?** `NEXT_PUBLIC_SAMPLE_CART_URL_TEMPLATE` replaces the link entirely. For example, to add the sample to an existing Online Store cart instead of replacing it:
  `https://www.chunkyacademy.com/cart/add?id={variantId}&quantity=1&return_to=/cart`

## Hosting

- **As-is:** the pages ship with this Vercel project at `/chunky/free-sample-v1/` and `/chunky/free-sample-v2/`.
- **On chunkyacademy.com:** point `chunkyacademy.com/free-sample` at the chosen page with a redirect or reverse-proxy rewrite.
- **Anywhere else:** `npm run build` writes a static export to `out/`. Upload `out/chunky/free-sample-v1/` (or `-v2/`) together with `out/_next/` and `out/images/chunky/`.

## Brand and compliance notes

- The themes stay adult on purpose: jewel tones, frost and editorial type rather than cartoon candy, bright primaries or characters. "21+" sits in the header, the consent line and the footer.
- **"Jolly Rancher" is a Hershey trademark.** The pages use the strain name as given. Confirm you're comfortable using it in paid traffic and marketing email before launch.
- The legal footer covers the Farm Bill (<0.3% Δ9-THC dry weight), THCa converting when heated, drug testing, keep out of reach of children, and the FDA statement. Have your compliance contact review it alongside the shipping states you serve.
- Strain facts on the pages (Indica for Runtz, Hybrid for Snowcaps, tasting notes) came from public listings. Check them against the current COAs.
