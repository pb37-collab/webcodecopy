# Looper Free Samples: Landing Page Hand-off

Two free-sample landing pages for Looper, built in the same style as the Looperverse Giveaway page
(`looperverse.com/giveaway`). The visitor picks a flavor, enters their email and state, and goes straight
to checkout. **The product is free; the customer just covers shipping.**

**No shipping price appears anywhere on the pages.** They say "free, you just cover shipping" and the
order summary shows "Shipping: At checkout", so the customer sees the shipping cost for the first time
at checkout. Shipping can be a flat rate or vary by state without touching the pages.

| Page | Product | Flavors | Samples |
|---|---|---|---|
| `free-duos/index.html` | Looper Duos Gummies (10 × 25mg THC + 5mg CBD) | 5 flavor pairs | 50 jars |
| `free-fusion/index.html` | Looper Fusion 3G disposable (THCA + Delta-8 + THCP) | 6 flavors | 60 vapes |

As with the giveaway, **each page is one self-contained HTML file**: markup, CSS, JS and product images are
all inside `index.html`. There's no build step for Looper and nothing else to upload.

Product copy, flavor names, flavor notes, retail prices and images come from the live product pages
(`/product/duos-gummies/`, `/product/fusion-3g/`). Sample counts come from the Looper × Canna Connect
onboarding doc.

## What's on each page (mobile first)

1. **Hero:** product name with the giveaway's cyan/magenta glitch, the product group render,
   "$0 / what you get / flavors" stats and the sample count ("Only 50 free jars in this drop").
2. **Claim card:** flavor picker (photo tiles), email, ship-to state, one 21+ / email-consent checkbox,
   an order summary (~~$12.99~~ **Free**, Shipping: *At checkout*) and the claim button.
3. **Sticky claim bar** on phones. It stays at the bottom of the screen until the claim card is on screen.
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
| `RETAIL` / `SUPPLY` | ✅ set | The struck-through retail price and the sample count update from these |
| `LEFT` | optional | Set a number (e.g. `18`) to show "Only 18 of 50 free jars left" with a meter. Update it by hand. |
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

## 3. What Klaviyo receives

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

## 4. Eligibility and limits

- The state dropdown lists the same 20 shipping states as the giveaway, plus "My state isn't listed",
  which shows a message and blocks the claim. Edit `SHIP_STATES` in the script to change it; the FAQ and
  Offer Details update automatically.
- One checkbox covers the 21+ confirmation and email consent; the claim needs it.
- The page remembers a claim in the visitor's browser and shows "You already locked in X. Finish checkout"
  on their next visit. **Enforce one per person/household at checkout**: the page can't stop someone
  using a second email.
- The Offer Details text is a draft: one per person/household/address, while supplies last, 21+, the 20
  states, and the email signup. **Have Looper approve it before launch.**

## 5. Tracking (optional)

On each claim the page fires these, if they exist on the page:
- Meta Pixel: `fbq('track', 'Lead', …)`
- GA4: `gtag('event', 'generate_lead', …)`
- GTM: `dataLayer.push({event: 'free_sample_claim', sample, flavor})`

Neither pixel is included in the file. Add your snippets to `<head>`.

## 6. Pre-launch QA checklist

1. Set `KLAVIYO_LIST_ID` and all `CHECKOUT` links on both pages (search each file for `PLACEHOLDER`: none should be left).
2. Load both pages on a phone from looperverse.com and confirm the Akira fonts render.
3. Claim with a test email for one flavor on each page: you should land on checkout with that flavor at
   $0 and the right shipping. Confirm the profile and the *Claimed Free Sample* event in Klaviyo.
4. Try `?flavor=<slug>` links for the ads you're running.
5. Delete the test profiles from Klaviyo.

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
