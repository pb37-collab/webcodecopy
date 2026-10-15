# Looper Free Samples: Landing Page Hand-off

Two free-sample landing pages for Looper, built in the same style as the Looperverse Giveaway page
(`looperverse.com/giveaway`). The visitor picks a flavor, enters their email and state, and goes straight
to checkout. **The product is free; the customer just covers shipping.**

**No shipping price appears anywhere on the pages.** They say "free, you just cover shipping" and the
order summary shows "Shipping: At checkout", so the customer sees the shipping cost for the first time
at checkout. Shipping can be a flat rate or vary by state without touching the pages.

| Page | Product | Flavors | Samples |
|---|---|---|---|
| `free-duos/index.html` | Looper Duos Gummies (10 × 25mg THC + 5mg CBD) | 5 flavor pairs | 50 jars (10 per flavor) |
| `free-fusion/index.html` | Looper Fusion 3G disposable (THCA + Delta-8 + THCP) | 6 flavors | 60 vapes (10 per flavor) |

As with the giveaway, **each page is one self-contained HTML file**: markup, CSS, JS and product images are
all inside `index.html`. There's no build step for Looper and nothing else to upload.

Product copy, flavor names, flavor notes, retail prices and images come from the live product pages
(`/product/duos-gummies/`, `/product/fusion-3g/`). Sample counts come from the Looper × Canna Connect
onboarding doc.

## What's on each page (mobile first)

1. **Hero:** product name with the giveaway's cyan/magenta glitch, the product group render,
   "$0 / what you get / flavors" stats and the **live count** ("38 of 50 free jars left", with a meter).
2. **Claim card:** flavor picker (photo tiles, each with its live "7 left"), email, ship-to state, one 21+ / email-consent checkbox,
   a **live count** box ("● Live count · 38 of 50 left"), an order summary (~~$12.99~~ **Free**,
   Shipping: *At checkout*) and the claim button.
3. **Sticky claim bar** on phones, showing the count ("38 of 50 left"). It stays at the bottom of the
   screen until the claim card is on screen.
4. As Featured On strip, What You Get, flavor cards (each with a "Claim" button that selects that flavor),
   How It Works, FAQ, Offer Details and the same footer and disclaimers as the giveaway.

Claim flow: pick flavor → email + state → **Claim** → Klaviyo signup → "Locked in" screen → redirect to
that flavor's checkout link (about 1 second).

## 1. Deploy

Same as the giveaway: create a folder in the WordPress web root and upload the file.

- `free-duos/index.html` → `https://looperverse.com/free-duos/`
- `free-fusion/index.html` → `https://looperverse.com/free-fusion/`

Serve them from looperverse.com: the brand fonts (Akira Expanded, Alternate Gothic) load from the
`looperverse-v2` theme and only work on that domain. Anywhere else the page falls back to similar
Google Fonts. Both pages are `noindex`.

**Ad links:** `?flavor=<slug>` pre-selects a flavor, e.g. `looperverse.com/free-duos/?flavor=watermelon-punch`.
`utm_*`, `fbclid`, `gclid` and `ttclid` are saved to the Klaviyo profile and passed on to the checkout link.

## 2. Configure before sending traffic

Everything lives in the `CONFIG` block near the bottom of each `index.html` (search for `const CONFIG`).

| Key | Status | Notes |
|---|---|---|
| `CHECKOUT` | ⚠️ **placeholders** | One link per flavor. While a link contains `PLACEHOLDER`, the page shows a "preview mode" screen instead of redirecting. |
| `KLAVIYO_LIST_ID` | ⚠️ **blank** | The free-sample list. While blank, the page is in preview mode and **sends nothing** to Klaviyo. |
| `KLAVIYO_COMPANY_ID` | ✅ `RwbMFF` | Looper's public Klaviyo key (same as the giveaway) |
| `KLAVIYO_EVENT` | ✅ `Claimed Free Sample` | Event logged on every claim; use it to trigger flows |
| `STOCK.PRODUCT_IDS` | ⚠️ **blank** | The free-sample product's WooCommerce ID, which turns on the live counts (per flavor and "X of 50 left"). See **Live inventory** below. |
| `SUPPLY` | ✅ `50` Duos / `60` Fusion | Total samples on this page (10 per flavor): the "of 50" |
| `RETAIL` | ✅ set | The struck-through retail price |
| `LEFT` | optional | Manual fallback when there's no live count: e.g. `18` shows "Only 18 free jars left". Update it by hand. |
| `SOLD_OUT_FLAVORS` | optional | e.g. `['blue-razz-grape']` greys out that flavor and marks it "Gone" |
| `SOLD_OUT` | optional | `true` closes the offer and points every button to the product page |
| `END` | optional | e.g. `'2026-11-01T23:59:00-04:00'` shows an "Offer ends in" countdown and closes the offer at that time |

### Checkout links

Each flavor needs a link that lands the customer on checkout with that flavor at **$0**. Shipping is
charged and shown at checkout (flat or by state, set in WooCommerce). The links accept tokens:
`{email}`, `{flavor}` and `{state}`.

The retail WooCommerce variations, for reference when you build the $0 sample links:

| Duos flavor | slug | retail variation | | Fusion flavor | slug | retail variation |
|---|---|---|---|---|---|---|
| Blue Razz + Grape | `blue-razz-grape` | 23662 | | Hard Strawberry | `hard-strawberry` | 23682 |
| Green Apple + Strawberry | `green-apple-strawberry` | 23668 | | Watermelon Burst | `watermelon-burst` | 23686 |
| Lemon + Tropical Blast | `lemon-tropical-blast` | 23672 | | Berry Blast | `berry-blast` | 23690 |
| Pineapple + Lemonade | `pineapple-lemonade` | 23676 | | Apple Jelly | `apple-jelly` | 23680 |
| Watermelon + Punch | `watermelon-punch` | 23664 | | Twisted Lime | `twisted-lime` | 23684 |
| | | | | Tropical Gummy | `tropical-gummy` | 23688 |

A WooCommerce link has this shape: `https://looperverse.com/checkout/?add-to-cart=<variation id>`.
It needs a **$0 sample variation** (or a coupon applied automatically) plus a shipping rule for the sample.
Using the retail variations as they are would charge full price.

## 3. Live inventory ("38 of 50 left", "7 left" per flavor)

**Stock: 110 free samples in total, 10 of each flavor.** That's 50 on the Duos page (5 flavors) and 60 on the
Fusion page (6 flavors).

Each page shows how many are left and updates on its own after every purchase. It reads the free-sample
product's stock from WooCommerce's public Store API (the same API the store's own pages use) when the page
loads, every 30 seconds while it's open, and whenever the visitor comes back to the tab. One request
returns every flavor's stock.

- WooCommerce lowers stock when an order is placed (and can hold a unit while someone is paying), so
  the count drops right after each purchase. Form claims that never check out don't lower it.
- **Per flavor:** each flavor tile and flavor card shows "7 left", which turns pink at 3 or fewer
  ("Only 2 left"). The picked flavor's count also shows under the tiles. At 0 the flavor greys out as
  **Gone** and can't be picked. If someone's picked flavor sells out while they're on the page, it's
  unselected and they're asked to pick another.
- **Page total** (sum of the flavors): in the hero line, a "Live count" box in the claim card and the
  sticky bar on phones, e.g. "38 of 50 left". At 10 or fewer it switches to "Only 8 left!" in pink.
  Numbers pulse when they drop while someone is watching.
- At **0 overall** the page closes itself: "All 50 free jars are claimed", and every button points to the
  product page.
- If the count can't be read (no product ID yet, or the API is down), the page shows
  "Only 50 free jars in this drop" and no per-flavor counts. It never shows an invented number.

**Setup in WooCommerce:**

1. Create a variable product, e.g. *Free Sample: Duos*, hidden from the catalog, with a **$0 variation for
   each flavor**, using the same *Flavor* attribute and flavor names as the retail product. The checkout
   links can add these variations to the cart.
2. On **each variation**: tick **Manage stock**, set **Stock quantity = 10**, and set
   **Allow backorders = Do not allow**.
3. If you tick **Sold individually** (one per order), also set each variation's **Low stock threshold = 10**.
   For sold-individually products the Store API only reports the exact count once stock is at or below that
   threshold. WooCommerce may then email low-stock alerts; you can turn those off under
   *WooCommerce → Settings → Products → Inventory*.
4. Put the **parent product ID** in `CONFIG.STOCK.PRODUCT_IDS`, e.g. `PRODUCT_IDS: [24051]`. The page finds
   the flavor variations itself, matching them by flavor name.
5. Check it: open `https://looperverse.com/wp-json/wc/store/v1/products?type=variation&parent=<id>` in a
   browser. Each variation's `add_to_cart.maximum` (or `low_stock_remaining`) should be 10.

**One product for both lines works too:** if Looper puts all 11 flavors in a single sample product, use its ID
on both pages. Each page counts only its own flavors (Duos 50, Fusion 60).

**Server load:** each open page makes one small request every 30 seconds, and only while its tab is visible.
If the site slows down under heavy ad traffic, raise `STOCK.REFRESH_SECONDS`.

**Other sources:** `STOCK.URL` accepts any JSON endpoint in place of `PRODUCT_IDS`, returning
`{"remaining": 38}` or per flavor `{"flavors": {"blue-razz-grape": 7, "green-apple-strawberry": 10}}`.

## 4. What Klaviyo receives

Each claim calls Klaviyo's client APIs (public key only, no server or secret needed):

1. `POST a.klaviyo.com/client/subscriptions`: subscribes the email to `KLAVIYO_LIST_ID`.
   Source: "Looper Free Sample LP: Duos" or "…: Fusion".
2. `POST a.klaviyo.com/client/events`: logs **Claimed Free Sample** with sample, flavor, state,
   retail value, checkout link and UTMs.

Profile fields set:

| Field | Example |
|---|---|
| `location.region` | `Texas` (always one of the 20 ship states) |
| `free_sample` | `Looper Duos Gummies` / `Looper Fusion 3G Disposable` |
| `free_sample_key` | `duos_gummies` / `fusion_3g` |
| `free_sample_flavor` | `Watermelon + Punch` |
| `free_sample_claimed_at` | ISO timestamp |
| `age_confirmed_21` | `true` |
| `free_sample_utm_source` etc. | from the ad link, when present |

**Suggested flow:** trigger on *Claimed Free Sample* → wait 1 hour → if no *Placed Order* since starting
the flow, send "Your free jar is waiting" with the `checkout_url` event property.

The page waits at most 2.5 seconds for Klaviyo and then goes to checkout anyway, so a slow or failed
signup never blocks a claim.

## 5. Eligibility and limits

- The state dropdown lists the same 20 shipping states as the giveaway, plus "My state isn't listed",
  which shows a message and blocks the claim. Edit `SHIP_STATES` in the script to change it; the FAQ and
  Offer Details update automatically.
- One checkbox covers the 21+ confirmation and email consent; the claim needs it.
- The page remembers a claim in the visitor's browser and shows "You already locked in X. Finish checkout"
  on their next visit. **Enforce one per person/household at checkout**: the page can't stop someone
  using a second email.
- The Offer Details text is a draft: one per person/household/address, while supplies last, 21+, the 20
  states, and the email signup. **Have Looper approve it before launch.**

## 6. Tracking (optional)

On each claim the page fires these, if they exist on the page:
- Meta Pixel: `fbq('track', 'Lead', …)`
- GA4: `gtag('event', 'generate_lead', …)`
- GTM: `dataLayer.push({event: 'free_sample_claim', sample, flavor})`

Neither pixel is included in the file. Add your snippets to `<head>`.

## 7. Pre-launch QA checklist

1. Set `KLAVIYO_LIST_ID`, `STOCK.PRODUCT_IDS` and all `CHECKOUT` links on both pages (search each file for `PLACEHOLDER`: none should be left).
2. Load both pages on a phone from looperverse.com and confirm the Akira fonts render.
3. Claim with a test email for one flavor on each page: you should land on checkout with that flavor at
   $0 and the right shipping. Confirm the profile and the *Claimed Free Sample* event in Klaviyo.
4. Confirm the live count matches the product's stock, and drops by one after your test order.
5. Try `?flavor=<slug>` links for the ads you're running.
6. Delete the test profiles from Klaviyo, and restore the stock your test orders used.

## Editing the source (for developers)

The two HTML files are generated from this folder:

```
campaigns/looper-free-samples/
  products.mjs        product copy, flavors, prices, sample counts, ship states
  src/styles.css      styles (giveaway design system + free-sample components)
  src/client.js       page behaviour (picker, Klaviyo, checkout redirect, sticky bar)
  build.mjs           renders public/looper/free-duos/ and public/looper/free-fusion/
  fetch-assets.mjs    pulls product renders from looperverse.com into assets/ as WebP
  assets/             embedded images
  source/             looperverse wordmark from the giveaway hand-off
```

```bash
NODE_USE_ENV_PROXY=1 node campaigns/looper-free-samples/fetch-assets.mjs   # only if product images change
node campaigns/looper-free-samples/build.mjs
```

Once the real checkout links and list ID are known, you can either edit the `CONFIG` block in the
uploaded files or change the defaults in `build.mjs` and rebuild.
