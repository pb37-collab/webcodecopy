# NanoGrow Max — Popup Games, Gamified Landers & Klaviyo Email Wiring

> **Redacted for the public repo:** live discount codes appear as `[CODE:…]` tokens. `[CODE:fre-x]` is the expired free-Odor-Max prize code. The real values are in Shopify admin and in the theme's `settings_data.json`.

Audit date: 2026-10-07. Source: live MAIN theme `gid://shopify/OnlineStoreTheme/188058468655` ("Copy of rename-odor-max-grow-max-8-24"), Shopify Admin (read-only), Klaviyo account `[KLAVIYO-PUBLIC-ID]` (read-only).

Raw theme files saved verbatim (byte sizes verified against the theme API) in:
`/tmp/claude-0/-home-user-webcodecopy/71b03b33-2841-5394-823d-fe40e96a1da4/scratchpad/live-theme/`

| File | Bytes | Role |
|---|---|---|
| `sections/pick-your-prize.liquid` | 17964 | Popup markup + schema |
| `assets/pick-your-prize.js` | 42702 | Popup logic (games, odds, Klaviyo submit) |
| `assets/pick-your-prize.css` | 32932 | Popup styles |
| `config/settings_data.json` | — | **Live** prize blocks + popup settings (the real config) |
| `layout/theme.liquid` | 4829 | Includes the popup site-wide |
| `sections/deep-clean-lp.liquid` | 38409 | "Spray the rooms" game LP (CRLF line endings preserved) |
| `layout/theme.deep-clean.liquid`, `templates/page.deep-clean.json` | 358 / — | Deep Clean layout + template |
| `sections/feed-bloom-lp.liquid`, `layout/theme.feed-bloom.liquid`, `templates/page.feed-bloom.json` | 24504 / 18966 | Feed & Bloom tap game LP |
| `templates/page.flip-unlock.liquid`, `layout/theme.flip-lp.liquid` | 22502 / 19509 | Flip-to-Unlock card game LP |
| `sections/nom-lp-*.liquid`, `assets/nom-lp.js`, `layout/nom-lp.liquid`, `snippets/nom-lp-drawer.liquid` | — | Nano Odor Max LP (no game, no email capture) |

---

## 1. "Pick Your Prize" popup

### 1.1 Where it is included

`layout/theme.liquid`, last line before `</body>`:

```liquid
    {% section 'footer' %}
    {% section 'pick-your-prize' %}
      </body>
```

So it renders on **every page that uses `theme.liquid`** (home, product, collection, cart, standard pages). It does **not** render on the landing pages that use their own layouts: `theme.deep-clean`, `theme.feed-bloom`, `theme.flip-lp`, `nom-lp`, `theme.ngm-lp` (all checked; none include the section).

Because it is a statically-included section, its live settings are in `config/settings_data.json → current.sections["pick-your-prize"]` (not in a template JSON).

### 1.2 Live settings (from `config/settings_data.json`)

```json
"settings": {
  "enabled": true,
  "campaign_name": "Pick Your Prize",
  "headline": "Pick Your Prize",
  "subheadline": "Enter your email, pick your game, and reveal your reward.",
  "teaser_text": "Unlock Your Prize",
  "social_proof_text": "",
  "brand_color": "#050705",
  "accent_color": "#d4a850",
  "modal_style": "dark",
  "claim_endpoint": "https://a.klaviyo.com/client/subscriptions/?company_id=[KLAVIYO-PUBLIC-ID]&list_id=W5ffbq",
  "redirect_path": "/collections/all",
  "disposable_domains": "mailinator.com,10minutemail.com,guerrillamail.com",
  "trigger_type": "delay",
  "delay_seconds": 5,
  "scroll_percent": 35,
  "cart_threshold": 50,
  "page_rule": "all",
  "specific_url_rules": "",
  "visitor_rule": "all",
  "mobile_teaser": true,
  "show_once_session": true,
  "frequency_days": 7,
  "hide_after_conversion": true,
  "hide_existing_subscribers": false,
  "one_win_per_device": true,
  "game_order": "wheel,scratch,mystery_box",
  "default_game": "wheel"
}
```

No logo, background image or custom game icons are set (so the built-in SVG icons and the "PICK / YOUR / PRIZE" text hub are used).

### 1.3 Trigger rules (what actually runs)

Effective behaviour = **opens 5 seconds after page load, on every page, once per browser session (tab session)**.

```js
// pick-your-prize.js — scheduleTrigger()
if (!isEligible(config)) return;
// Mobile teaser intentionally disabled — popup opens directly on mobile too.
if (config.triggerType === 'manual') return showTeaser(root);
...
window.setTimeout(function () { openPopup(root, state, 'delay'); }, Math.max(0, Number(config.delaySeconds) || 0) * 1000);
```

```js
function isEligible(config) {
  // Suppress once per browser session — after the user closes/dismisses the popup,
  // they won't see it again on subsequent page loads in the same tab session.
  var key = slug(config.campaignName);
  if (sessionStorage.getItem('pyp_session_' + key)) return false;
  // All other persistent gating (frequency days, conversion, device-win) intentionally disabled.
  return matchesPage(config);
}
```

`openPopup()` → `markSeen()` sets `sessionStorage['pyp_session_pick-your-prize']='1'` plus `localStorage['pyp_seen_pick-your-prize']` and `localStorage['pyp_seen_any']` (timestamps that are never read).

Other supported trigger types (code paths exist, not configured): `scroll` (≥ `scrollPercent`), `exit` (desktop `mouseout` with `clientY <= 0`; mobile falls back to a 1.5 s delay), `add_to_cart` (click on `.atc-btn` or `form[action*="/cart/add"] button[type="submit"]`, opens after 650 ms), `cart_value` (fetches `/cart.js`, opens if `total_price >= cart_threshold*100`, else shows teaser), `manual` (teaser tab only).

**Settings that the theme editor exposes but the JS ignores:** `frequency_days` (7), `hide_after_conversion`, `one_win_per_device`, `visitor_rule`, `hide_existing_subscribers`, `mobile_teaser`. Per-prize `quantity_limit`, `expiration_date`, `minimum_cart_value`, `applies_to`, `eligible_wheel/scratch/mystery_box` are not even passed into `data-config`.

Close: X button, overlay click, or Esc (`closePopup`). Focus is trapped while open; `body.style.overflow='hidden'`.

### 1.4 Screens / steps

The modal has four views (`data-pyp-view`): `picker` → `game` (loading, then the game) → `revealed` (or `error`).

1. **Picker** (one screen: form + game cards)
   - Header: logo row with laurels (no logo set), `<h2>Pick Your Prize</h2>`, subheadline "Enter your email, pick your game, and reveal your reward." Kicker is hidden because it equals the headline.
   - Fields: "First Name *optional*" (`firstName`), "Email Address" (`email`, required), consent checkbox, hidden honeypot `company`.
   - Consent text (exact): **"I agree to receive email marketing and understand I can unsubscribe at any time."**
   - Hint before consent: "Check the box above to choose your game ↓". Game cards render **locked** (`disabled`, `.is-locked`, opacity .35) until the consent box is checked; then heading "Choose How You Want To Win" appears.
   - Three game cards (order `wheel, scratch, mystery_box`; wheel `.is-highlighted`), each with an inline SVG icon, title, subtitle and "Choose This" CTA (CTA hidden ≥640px).
   - Clicking a card validates: `isEmail` regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, disposable-domain blacklist, consent, honeypot, rate limit (>25 attempts in 5 min). Error copy: "Enter a valid email to unlock your game.", "Please use a permanent email address.", "Consent is required to unlock your game.", "We could not unlock the game. Please try again.", "Too many attempts. Please try again in a few minutes."
2. **Game loading**: spinner, "Preparing {Game Title}", "Securing your one-time reward..." — during this, the Klaviyo subscribe call is awaited and the prize is drawn.
3. **Game** (see 1.5).
4. **Revealed**: medallion (short label + prize name), ribbon "You unlocked {prize name}" (or "Grand Prize Unlocked"), card "Your reward is locked in — it applies automatically at checkout." + countdown "Your reward expires in 09:59" (10-minute cosmetic timer), code box ("Discount Code" / CODE / tag "Auto-applied at checkout"), button **"Shop Now — Discount Applied"** linking to `/discount/CODE?redirect=/`. Confetti burst (26 pieces, 96 for grand).
5. **Error**: "Something went wrong" + message + "Try Again" (back to picker). In practice unreachable because `claimPrize()` always succeeds.

### 1.5 The three games (exact)

```js
var GAME_META = {
  wheel: {
    title: 'Spin-A-Sale Wheel',
    subtitle: 'Spin the wheel for instant savings',
    stageLabel: 'The wheel is revealing your reward.'
  },
  scratch: {
    title: 'Scratch To Reveal',
    subtitle: 'Scratch to uncover your prize',
    stageLabel: 'Scratch away 65% of the gold foil.'
  },
  mystery_box: {
    title: 'Mystery Box',
    subtitle: 'Open the box for a surprise',
    stageLabel: 'The box is opening your reward.'
  }
};
```

**Important:** the prize is drawn **before** the game is played and is the same weighted draw for all three games. The game is a pure reveal animation; the player's actions do not affect the outcome.

**a) Spin-A-Sale Wheel** (`runWheel`) — auto-spins, no user input.
- Slices = active prizes, padded with filler `{ name: 'Reward', shortLabel: 'WIN' }` until there are at least 6 (`visualPrizes`). With the live 5 prizes the wheel shows: `10% | 15% | SHIP | GIFT | 20% | WIN` (the WIN slice can never be the result). Alternating oxblood `#7a1a1f` / dark green `#132016` slices, gold pointer at top, gold conic hub (text "PICK YOUR PRIZE" when no logo).
- Rotation: `target = 360 * (big ? 8 : 6) + (360 - (index * segmentAngle + segmentAngle / 2))`; duration 4700 ms (6200 ms grand; 400 ms reduced-motion), easing `cubic-bezier(.17,.67,.16,.99)`. Disabled button "Spinning...". Reveal after duration + 140 ms.

**b) Scratch To Reveal** (`runScratch`) — user scratches a canvas.
- Card 384:264 framed; underneath is the prize medallion. Canvas cover = gold linear gradient `#fff4d2 → #d4a850 → #8b6520 → #e8c878 → #fff4d2`, text "SCRATCH" (700 34px Cinzel) and "TO REVEAL" (600 13px Cinzel) in `rgba(80,55,15,0.42)`.
- Brush: `destination-out`, `lineWidth = Math.max(34, width * 0.14)`, round caps. Desktop shows a gold coin cursor (34px).
- Progress: samples alpha every 18px; `threshold = 65` (%). Hint text: "Hold your mouse down and scratch back and forth." / "Hold your finger down and scratch back and forth.", then "{n}% more gold foil to reveal your prize.", then "Prize revealed". At ≥65% the canvas fades out; reveal after 900 ms (1500 ms grand).

**c) Mystery Box** (`runBox`) — auto-plays.
- Oxblood box (`#a02530 → #7a1a1f → #3a0608`) with gold foil ribbon and lid; shakes (`pypShake` 0.34s × 4), lid flies off at 1300 ms (1900 ms grand), light beam + prize medallion rises. Disabled button "Opening...". Reveal at 3000 ms (4300 ms grand).

### 1.6 Prize list and odds — MUST BE PRESERVED EXACTLY

**Live prize blocks** (`config/settings_data.json`, block order = draw order):

```json
"prize_10pct": { "prize_name": "10% Off",                   "short_label": "10%",  "prize_type": "percentage",    "discount_code": "[CODE:prize-10]",    "odds": 48, "grand_prize": false, "active": true },
"prize_15pct": { "prize_name": "15% Off",                   "short_label": "15%",  "prize_type": "percentage",    "discount_code": "[CODE:prize-15]",    "odds": 20, "grand_prize": false, "active": true },
"prize_ship":  { "prize_name": "Free Shipping",             "short_label": "SHIP", "prize_type": "free_shipping", "discount_code": "[CODE:prize-freeship]",  "odds": 14, "grand_prize": false, "active": true },
"prize_gift":  { "prize_name": "Free Odor Max w/ Purchase", "short_label": "GIFT", "prize_type": "free_gift",     "discount_code": "[CODE:fre-x]", "odds": 10, "grand_prize": false, "active": true },
"prize_20pct": { "prize_name": "20% Off",                   "short_label": "20%",  "prize_type": "percentage",    "discount_code": "[CODE:prize-20]",    "odds": 8,  "grand_prize": false, "active": true }
"block_order": ["prize_10pct", "prize_15pct", "prize_ship", "prize_gift", "prize_20pct"]
```

Total = 48 + 20 + 14 + 10 + 8 = **100** (so the Liquid "Prize odds total …" warning is not shown). Identical hard-coded fallback in the JS (used if the section has no active prizes):

```js
var DEFAULT_PRIZES = [
  { id: 'p10',   name: '10% Off',                      shortLabel: '10%',  type: 'percentage',    discount_code: '[CODE:prize-10]',    odds: 48, grand: false, active: true },
  { id: 'p15',   name: '15% Off',                      shortLabel: '15%',  type: 'percentage',    discount_code: '[CODE:prize-15]',    odds: 20, grand: false, active: true },
  { id: 'pship', name: 'Free Shipping',                shortLabel: 'SHIP', type: 'free_shipping', discount_code: '[CODE:prize-freeship]',  odds: 14, grand: false, active: true },
  { id: 'pgift', name: 'Free Odor Max w/ Purchase', shortLabel: 'GIFT', type: 'free_gift',     discount_code: '[CODE:fre-x]', odds: 10, grand: false, active: true },
  { id: 'p20',   name: '20% Off',                      shortLabel: '20%',  type: 'percentage',    discount_code: '[CODE:prize-20]',    odds: 8,  grand: false, active: true }
];
```

Weighted draw (identical for all 3 games):

```js
function pickWeightedPrize(config) {
  var prizes = (config.prizes || []).filter(function (p) { return p && p.active !== false; });
  if (!prizes.length) prizes = DEFAULT_PRIZES.map(normalizePrize);
  var totalOdds = prizes.reduce(function (sum, p) { return sum + (parseFloat(p.odds) || 0); }, 0);
  if (!totalOdds) {
    return prizes[Math.floor(Math.random() * prizes.length)];
  }
  var rand = Math.random() * totalOdds;
  var cumulative = 0;
  for (var i = 0; i < prizes.length; i++) {
    cumulative += (parseFloat(prizes[i].odds) || 0);
    if (rand < cumulative) return prizes[i];
  }
  return prizes[prizes.length - 1];
}
```

Note: the schema **preset** (used only when the section is freshly added in the editor) is different and NOT live: 10% Off 45, 15% Off 25, Free Shipping 15, "Free Mini Odor Max With Order" 10, "25% Off Bundle" 4, "Grand Prize: Free Odor Max Bottle" 1 (grand). No grand prize is currently active, so grand-prize visuals never appear.

### 1.7 Discount codes (static strings, not generated)

Codes are fixed strings from the prize blocks; every winner of a tier gets the same shared code. No server-side or unique code generation (`claim_endpoint` "Use /apps/pick-your-prize/claim through a Shopify app proxy" was never built; it points straight at Klaviyo).

Shopify state of each code (`codeDiscountNodeByCode`, read-only):

| Code | Shopify title | Type / effect | Status | Uses | Combines with (order / product / shipping) |
|---|---|---|---|---|---|
| `[CODE:prize-10]` | Pick Your Prize – 10% Off | 10% off entire order | ACTIVE since 2026-05-05 | **0** | no / no / no |
| `[CODE:prize-15]` | Pick Your Prize – 15% Off | 15% off entire order | ACTIVE | **0** | no / no / no |
| `[CODE:prize-freeship]` | Pick Your Prize – Free Shipping | Free shipping, all countries | ACTIVE | **0** | no / no / no |
| `[CODE:fre-x]` | Pick Your Prize – Free Odor Max w/ Purchase | 100% off Nano Odor Max (5 variants), min $1.00, once per customer | **EXPIRED 2026-09-11T17:08:02Z** | 0 | no / no / no |
| `[CODE:prize-20]` | Pick Your Prize – 20% Off | 20% off entire order | ACTIVE | **0** | no / no / no |

### 1.8 How the winning code is "applied"

Only via the reveal button link:

```js
function shopUrl(prize, config) {
  var code = prize.discountCode || prize.discount_code || '';
  var redirect = config.redirectPath || '/';
  if (!redirect || redirect === '/collections/all') redirect = '/';
  if (!code) return redirect;
  return '/discount/' + encodeURIComponent(code) + '?redirect=' + encodeURIComponent(redirect);
}
```

→ `/discount/[CODE:prize-10]?redirect=%2F`. Shopify's `/discount/` route stores the code in the checkout session, so it applies **only if the visitor clicks "Shop Now — Discount Applied"**. No cart attribute, no background `/discount/` fetch, no `cart/update.js`, no persistence of the code. `markClaimed()` stores `{email, game, prizeName, claimedAt}` (not the code) in `localStorage['pyp_device_win_pick-your-prize']`, and nothing ever reads it back. A copy-code handler (`[data-pyp-copy]`) exists but no copy button is rendered.

### 1.9 Data collected & Klaviyo submission

Collected: email (lower-cased), optional first name, consent checkbox (+ in-memory `consentText`, `consentTimestamp`). **No phone / SMS field.**

Submitted (because `claimEndpoint` contains `a.klaviyo.com/client/subscriptions`):

```js
function subscribeKlaviyo(config, state) {
  var url = new URL(config.claimEndpoint);
  var listId = url.searchParams.get('list_id');
  var companyId = url.searchParams.get('company_id');

  var body = {
    data: {
      type: 'subscription',
      attributes: {
        profile: {
          data: {
            type: 'profile',
            attributes: {
              email: state.lead.email,
              first_name: state.lead.firstName || ''
            }
          }
        }
      }
    }
  };
  if (listId) {
    body.data.relationships = { list: { data: { type: 'list', id: listId } } };
  }

  return fetch('https://a.klaviyo.com/client/subscriptions/?company_id=' + companyId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Revision': '2023-12-15'
    },
    body: JSON.stringify(body)
  });
}
```

- Company (public) id `[KLAVIYO-PUBLIC-ID]`, list `W5ffbq` ("Email List").
- No `subscriptions.email.marketing.consent`, no `custom_source`, no profile `properties` (no game, prize name, prize code, source URL).
- It is called **before** the prize is drawn, so it could not include the prize even in principle:

```js
async function claimPrize(state) {
  ...
      if (config.claimEndpoint.indexOf('a.klaviyo.com/client/subscriptions') !== -1) {
        await subscribeKlaviyo(config, state);
  ...
      } catch (err) {
        console.warn('[Pick Your Prize] Email capture failed (non-blocking):', err);
      }
  ...
  // Always award a weighted-random prize.
  return { success: true, prize: pickWeightedPrize(config) };
}
```

- The `fetch` response status is never checked (a 4xx resolves normally), so failures are silent.
- Analytics events (`pyp_impression`, `pyp_open`, `pyp_picker_viewed`, `pyp_email_submitted`, `pyp_game_selection`, `pyp_game_started`, `pyp_game_completed`, `pyp_prize_won`, `pyp_shop_now_clicked`, `pyp_exit`, `pyp_claim_error`, `pyp_code_copied`) are only dispatched as `window` CustomEvents and pushed to `window.dataLayer`. Nothing is sent to Klaviyo (`klaviyo.track` / client events are not used). Klaviyo has no Pick-Your-Prize metric (confirmed in `get_metrics`).

### 1.10 Why it does not "flow seamlessly" (bugs, ranked)

1. **Double opt-in list.** `W5ffbq` "Email List" has `opt_in_process: "double_opt_in"`. A client-subscription to it only sends a confirmation email; the profile joins the list (and triggers the welcome flow) only after confirming. List has **5 profiles total**; "Subscribed to List" for Email List since April 2026 = 5 unique profiles (monthly 1, 1, 0, 2, 0, 1).
2. **Welcome flow is not live.** "Email Welcome Series" (`VTqXAN`, trigger: added to `W5ffbq`) has status **`manual`** (all 5 emails `manual`), so it sends nothing.
3. **The prize/code never reaches the customer by email.** The welcome email (template `TfS2yA`, "Welcome email (no coupon)") says: *"Your discount code from Pick Your Prize is already on its way to you."* — but no flow or message sends it and the profile has no prize property to merge. Its CTA links to `https://rgijby-za.myshopify.com/products/nanogrow-max` (myshopify domain, Grow Max only) although the popup runs on Odor Max pages too.
4. **Code not auto-applied unless the button is clicked.** Copy says "applies automatically at checkout" / "Auto-applied at checkout", but closing the modal (X, overlay, Esc) loses the code; it is not saved to cart, cookie or Klaviyo. Zero redemptions of any PYP code (`asyncUsageCount: 0` on all five).
5. **10% of winners get a dead code.** `[CODE:fre-x]` expired 2026-09-11.
6. **14% of winners get a worthless prize.** Free shipping is already store-wide (`FREE_SHIP_CENTS = 0` in theme.liquid "promo: free shipping on every order"; flip LP notes a permanent $0.00 Domestic rate; "BOGOS Free Shipping" app code exists). `[CODE:prize-freeship]` adds nothing.
7. **Non-combinable codes.** All PYP codes have `combinesWith` all false; they collide with the active automatic discount "Free 8oz Odor Max with the GroMax + RootMax bundle" (BXGY, combines only with shipping) — Shopify will keep only one.
8. **Frequency controls ignored.** Re-shows every new session, even after a win (replayable for a new prize); `frequency_days`, `hide_after_conversion`, `one_win_per_device`, `mobile_teaser`, `visitor_rule`, `hide_existing_subscribers` are all no-ops.
9. **Silent Klaviyo failures** (no status check), no consent object, old revision header.
10. Cosmetic: wheel filler "WIN" slice; `redirect_path` "/collections/all" forced to "/"; 10-minute "expires" countdown has no real expiry; rate-limiter counts successful attempts too.

---

## 2. Gamified landing pages

### 2.1 Deep Clean — "Spray the rooms to clear the smell" (→ future Odor Max "How It Works")

Template `templates/page.deep-clean.json` → layout `theme.deep-clean` (bare HTML: `<meta name="robots" content="noindex, follow">`, `content_for_header`, `content_for_layout`) → section `deep-clean-lp` (single self-contained file; header comment: "generated from Deep Clean/index.html by build_theme.py").

**Assets** (theme `assets/`, all present):

| Asset | Size | Use |
|---|---|---|
| `dc-bottle.png` | 60390 B | Hero bottle (150px tall, 180px ≥700px) and the spray-bottle cursor (96px, rotated −20°) |
| `dc-z1-before.jpg` | 59056 B | Zone 1 Kitchen — smelly "before" (painted into the grime canvas) |
| `dc-z1-after.jpg` | 71429 B | Zone 1 Kitchen — fresh "after" (bottom layer `<img>`) |
| `dc-z2-before.jpg` | 55859 B | Zone 2 Living Room — before |
| `dc-z2-after.jpg` | 84717 B | Zone 2 Living Room — after |

(`fb-lp-gift.png` on the Feed & Bloom page is byte-identical to `dc-bottle.png`, same MD5.) Inline SVG fallbacks `<template id="scene-kitchen">` / `<template id="scene-living">` (400×300 cartoon kitchen/living room) are used if an "after" image fails.

**Zones (exact config):**

```js
var ZONES = [
  {before:'{{ 'dc-z1-before.jpg' | asset_url }}', after:'{{ 'dc-z1-after.jpg' | asset_url }}', tpl:'scene-kitchen', name:'The Kitchen',
   blurb:"Last night's takeout is still here.", wisps:[[24,44],[50,38],[66,34]]},
  {before:'{{ 'dc-z2-before.jpg' | asset_url }}', after:'{{ 'dc-z2-after.jpg' | asset_url }}', tpl:'scene-living', name:'The Living Room',
   blurb:'Even the plant gave up.', wisps:[[30,42],[56,40],[72,56]]}
];
```

Header zone bar: `<div class="zdot">🍳</div><div class="zdot">🛋️</div>` (grey → `.now` mint outline → `.done` dark-mint fill). Header perks pills: "🚚 Free shipping", "🏷️ 25% off" (turn mint with " ✓" when earned). Brand text "NANO <em>ODOR</em> MAX".

**Copy**
- Intro H1: "Your place is holding <span>smells</span> you can't smell anymore."
- Sub: "You go nose-blind in about 20 minutes. Guests notice in 2 seconds. Spray out the 2 worst zones of this apartment — your order picks up **free shipping** and **25% off** on the way."
- Button "Start the spray-down"; link "Skip — just show me the offer"; note "Takes about 10 seconds · works with one thumb".
- Game: kicker "Zone 1 of 2" (static HTML says "Zone 1 of 5" until JS overwrites it), zone name + blurb, meter "0% clean" / "Free shipping after this zone" → "25% off after this zone" → "Everything included ✓", hint "**Hold + scrub** — blast the smell out.", link "Skip ahead to the offer". Stage chip "Zone fresh ✓".
- Toasts: "🚚 Free shipping — added to your order", "🏷️ 25% off — added to your order". After both: hint becomes "**Both zones fresh ✓** — nice work."
- Value strip (always visible): "**Destroys odor molecules** at the source — doesn't mask them with perfume" / "Fabric-safe on couches, carpet, curtains + car seats" / "Works on cooking, pet, gym and smoke smells" / "**30-day money-back guarantee**".

**Mechanics (exact constants)**
- Stage: `aspect-ratio:4/3`, `touch-action:none`, `cursor:crosshair`. Layers: `.scene-art` (after image) → `canvas.grime` (before image drawn with cover-fit + `rgba(74,84,30,.1)` murk + 55 random dark specks `rgba(28,28,12,.22)`) → `.wisps` (3 animated green stink-wisp SVGs per zone, stroke `#a9bf62`, `rise 2.6s`) → `.hit` input layer → `#bottleCur` → `.fresh-chip`.
- Brush: `brushR = Math.max(36, cw*0.125)`; erase = radial gradient `destination-out` from `brushR*0.25` to `brushR`.
- Coverage: grid `GRID_C = 26, GRID_R = 19` (494 cells); a cell counts when its centre is inside 80% of the brush radius. `DONE_AT = 0.7` ("zone snaps clear at 70% coverage — fast pacing"). Meter shows `min(1, gridClean/gridTotal/DONE_AT)`.
- Input: `pointerdown` on `.hit` (pointer capture) starts spraying, shows bottle cursor at (x+8, y+2), spawns mist puffs (10–24px, fade .5s). `pointermove` interpolates erases every `brushR*0.5`. **Holding still keeps spraying** (`holdLoop` rAF: random jitter ±0.5·brushR, 35% mist chance). Ends on `pointerup/cancel/leave`.
- Zone complete → `.fresh` (grime and wisps fade out .5s), 10 "✦" sparks, meter 100%; zone 1 → free-shipping perk + toast, auto-advance after 1200 ms; zone 2 → 25% perk + toast, offer reveal after 900 ms. Resize repaints and re-erases cleaned cells. `prefers-reduced-motion` disables mist/sparks/animations.
- Tracking (Meta `fbq` + `gtag` if present): `ViewContent` (std, on load), `GameOpen`, `GameStart`, `ZoneFresh {zone}`, `ShipIncluded`, `DiscountIncluded`, `SkipToOffer`, `OfferReveal {skipped}`, `AddToCart` (std).

**Win state / offer**
- H2 "Every zone, <span>actually fresh.</span>"; sub "Nano Odor Max is a nano-tech spray that breaks odor molecules down instead of covering them up. One 8oz bottle per zone keeps the whole place neutral."
- Box: "Included with today's order: **🚚 free shipping** + **🏷️ 25% off** / Both apply automatically at checkout — no code needed."
- Packs (radio cards, default index 3 = "BEST VALUE"):

```js
var PACKS = [
  {v:'58065260347695', name:'1 Bottle',              sub:'Try it on your worst room',   price:12.99},
  {v:'58065260380463', name:'2-Pack',                sub:'One for each zone',           price:19.99},
  {v:'58065260413231', name:'3-Pack',                sub:'Kitchen, couch + the car',    price:29.99},
  {v:'58065260445999', name:'4-Pack + Bonus Bottle', sub:'Cover the whole place',       price:39.99, best:true}
];
```

  Discounted price mirrors Shopify rounding: `Math.round((n - Math.floor(n*25)/100)*100)/100` (e.g. $39.99 → $30.00). CTA "Get my {pack} — ${disc} at checkout"; guarantee "Try it on your worst zone first. If it doesn't kill the smell, **every penny back within 30 days.**"
- Checkout: cart permalink `https://nanogrowmax.com/cart/{variant}:1?discount=…&utm_*/fbclid`:

```js
var DC_SHIP_STARTS_MS = Date.UTC(2026, 8, 1, 4, 0, 0); /* Sep 1, 2026 04:00 UTC */
function discountParam(){
  return Date.now() >= DC_SHIP_STARTS_MS ? '[CODE:deepclean-25],[CODE:deepclean-ship]' : '[CODE:deepclean-25]';
}
```

  Shopify: `[CODE:deepclean-25]` = 25% off entire order, ACTIVE since 2026-07-17, combines with product+shipping, 0 uses; `[CODE:deepclean-ship]` = free shipping, ACTIVE since 2026-09-01 04:00 UTC, combines with order+product, 0 uses. Today both are sent.
- **No email capture on this page.** A Klaviyo list "Deep Clean Game — Email Unlock (single opt-in)" (`T3cj6y`, 0 profiles, no flow) exists but nothing posts to it. Klaviyo flow "Abandoned Checkout → Deep Clean Game (Nano Odor Max)" (`W7j6Hu`, status `manual`; Checkout Started containing "Nano Odor Max", no orders; 1 h → "Your rooms aren't done yet 🧽", 23 h → "Your rooms are still dirty 🫣", 2 d → "Last call on your 25% 👋") drives traffic to this game but is paused.

**Rebuild notes for Odor Max "How It Works"**: keep the two-layer before/after canvas reveal, 26×19 coverage grid, 70% threshold, hold-to-spray loop, bottle cursor, mist/sparks, wisps, zone dots, meter and milestone toasts. Inline (no discount gating) the copy can map zone 1 → "Spray the source", zone 2 → "Molecules break down / nothing to re-smell" (NOM LP how-it-works copy: "Spray the source" / "Molecules break down" / "Nothing to re-smell").

### 2.2 Feed & Bloom — tap-to-feed (Grow Max)

`templates/page.feed-bloom.json` → layout `theme.feed-bloom` (noindex, own CSS, no theme header/footer; title "NanoGrow Max — +40% Yield Nano Nutrient | Free Shipping + Free Gift") → section `feed-bloom-lp`.

- Assets: `fb-lp-bottle.png` (NanoGrow Max bottle cutout, 300×770), `fb-lp-gift.png` (Nano Odor Max shot). Inline-SVG data-URI fallbacks for both.
- Full-screen SVG plant (viewBox 400×800): 7 "vine" branches drawn on via `stroke-dashoffset` (1 → .66 → .34 → 0), 17 leaves tagged s1/s2/s3, 5 green buds (s2), 12 flowers (s3; coral `#ff8160`/`#f0562f` or gold `#ffd35c`). `#root[data-stage]` 0→3 drives growth; floating pollen motes; bloom glow at stage 3.
- `MAX_FEEDS = 3`. Tap the bottle (pour animation, `vibrate(15)`):
  - Feed 1 → chip "🚚 Free Shipping ✓", toast "Bonus added / Free Shipping"; sub "Free shipping is included with your NanoGrow Max order. Keep feeding to add your free gift."
  - Feed 2 → chip "🎁 Free Nano Odor Max ✓", toast "Free Nano Odor Max (8 oz)"; sub "Free shipping + a free Nano Odor Max, both included. One more feed to see your order."
  - Feed 3 → `fullBloom()`: toast "🌼 All set / Both bonuses included", headline "Your order's <span>ready.</span>", reward cards ("Included · Bonus 1 Free Shipping — On your NanoGrow Max order."; "Included · Bonus 2 Free Nano Odor Max — 8 oz bottle ($12.99 value) — free with your NanoGrow Max order."), testimonial (Dimieari Von Kemedi, Alluvial Trade Ltd.), order summary "NanoGrow Max bundle **$99.99** · free shipping + a free Nano Odor Max ($12.99 value) included · 30-day money-back guarantee", "Both bonuses apply automatically at checkout — no code needed.", hold timer (10 min, sessionStorage `fb_hold_deadline`, "Your rewards are held · m:ss").
- Initial copy: H1 "Feed smarter. <span>Grow more.</span>"; sub "A nano nutrient that absorbs where ordinary feeds can't — growers saw **+40% more yield** in a field trial.* Feed the plant for free shipping + a free Nano Odor Max."; trust "✓ Won't burn your plants at label dose · ✓ 30-day money-back guarantee"; cue "Tap the bottle to see your offer ↓"; skip "Skip — just show me the offer".
- Checkout: `https://nanogrowmax.com/cart/56039175618863:1,58065260478767:1` (+ utm/fbclid from sessionStorage `fb_attr`). `NGM_VARIANT_ID "56039175618863"` (bundle, $99.99), `NOM_VARIANT_ID "58065260478767"` ($0 "Free Gift (8oz Bottle)" variant). `FREE_SHIP_CODE: ""` — "PAUSED 2026-07-16 … passing [CODE:bloom-ship] made checkout show a "can't be used" conflict" (`[CODE:bloom-ship]` is EXPIRED in Shopify).
- Possible double-gift: the Flip page's comments say BOGOS auto-adds the free bottle when the bundle is in cart and that appending the $0 variant "shipped two"; Feed & Bloom still appends `58065260478767`. Not verified at checkout — flag for testing.
- No email capture. Tracking: `feed_tap`, `GameStart` (once/session), `GameBloom`, `rewards_revealed`, `skip_to_offer`, `cta_click`, Meta std `ViewContent` + `AddToCart`.

### 2.3 Flip to Unlock (Grow Max)

`templates/page.flip-unlock.liquid` (`{% layout 'theme.flip-lp' %}`; noindex,nofollow; Fraunces font; emerald + champagne-gold palette).

- Assets: `flip-ngm-logo.png` (70×70 brand logo), `flip-nano-odor-max.jpg` (bottle photo on reveal card and claim panel).
- Copy: kicker "Nano-Encapsulated Plant Nutrients"; H1 "Flip 2 cards to <span>unlock your rewards</span>"; sub "Two flips. Two rewards. Then you're off to checkout."; "Every visitor unlocks both — guaranteed. Not a game of chance."; counter "0 / 2 flipped".
- `TOTAL_CARDS = 6` (2×3 mobile, 3×2 ≥680px), `REQUIRED_FLIPS = 2`, `REVEAL_TO_CTA_MS = 1400`. Card back = SVG crest (crown, "NGM", "NANO GROW MAX", hex lattice). **Fixed order** regardless of which card is tapped: `order = ["ship", "bottle"]` → "Free Shipping" then "Free Nano Odor Max". After 2 flips: remaining cards locked/dimmed, flash + 2 confetti bursts (150 particles), vibration, then claim panel: ribbon "Both Rewards Unlocked", "You've unlocked both — head to checkout", items "Free Shipping — Applied to your whole order" and "Free Bottle of Nano Odor Max — A $12.99 odor-eliminating spray — yours free" (FREE badge), order summary $99.99, CTA "Claim rewards & checkout →", hold text, "No codes to copy — both rewards travel with you to checkout."
- Checkout: `https://nanogrowmax.com/cart/56039175618863:1` only (+utm/fbclid/gclid). Free bottle is added by BOGOS; free shipping by the $0 Domestic rate. No codes. No email capture. Meta: `CardFlip` custom, `ViewContent` (product id `14234610762031`, `product_group`) on unlock.

### 2.4 Nano Odor Max LP (`/pages/nano-odor-max`, layout `nom-lp`)

No game and no email capture. Sections: hero ("Any Odor. Gone in Seconds."), sources, science (mask vs destroy), **how** ("How It Works" — "Spray the source" / "Molecules break down" / "Nothing to re-smell" + safety checklist), proof (hidden until photos), reviews, offer (live variants; 3-Pack pre-selected; review drawer with Apple/Google Pay), FAQ, final+legal, sticky bar. `nom-lp.js` adds via `/cart/add.js` then `/checkout` (8 s watchdog → `/cart/{id}:1`).

---

## 3. Klaviyo

### 3.1 Account

| Field | Value |
|---|---|
| Account / public API key (company id) | `[KLAVIYO-PUBLIC-ID]` (public site key — safe in client code) |
| Organization | NanoGrow Max |
| Default sender | parker@nanogrowmax.com |
| Website | https://nanogrowmax.com |
| Timezone / currency | America/New_York / USD |

No private API key was seen anywhere in the theme or config. The Klaviyo onsite embed app block is enabled in `settings_data.json` (`shopify://apps/klaviyo-email-marketing-sms/blocks/klaviyo-onsite-embed/...`, `disabled: false`), so `klaviyo.js` is loaded site-wide (native Klaviyo signup forms, if any, could not be listed with the available tools).

### 3.2 Lists

| ID | Name | Opt-in | Profiles | Flow triggered |
|---|---|---|---|---|
| **W5ffbq** | **Email List** (← Pick Your Prize popup) | **double_opt_in** | **5** | Email Welcome Series `VTqXAN` (manual) |
| Supuas | Text Messaging List | double_opt_in | 0 | — |
| VYBYQ2 | Preview List | double_opt_in | — | — |
| T3cj6y | Deep Clean Game — Email Unlock (single opt-in) | single | 0 | — |
| VbyeU9 | Lander Capture — Single Opt-in | single | 0 | Welcome — Lander Capture `RTpJin` (draft) |
| VBxET3 | Win-back 2026-10 — Odor Max checkout abandoners (Jul–Sep, no order) | single | — | — |
| WLWvLT | Win-back 2026-10 — Grow Max checkout abandoners (Jul–Sep, no order) | single | — | — |

### 3.3 Flows

| ID | Name | Trigger | Status |
|---|---|---|---|
| VTqXAN | Email Welcome Series | Added to list W5ffbq | **manual** |
| RTpJin | Welcome — Lander Capture — 2026-09 | Added to list VbyeU9 | draft |
| W7j6Hu | Abandoned Checkout → Deep Clean Game (Nano Odor Max) | Checkout Started (Items contains "Nano Odor Max") | manual |
| Srr2DJ | NOM Abandoned Checkout — 2026-09 | Metric | live |
| WDhQhj | NGM Abandoned Checkout — 2026-09 | Metric | live |
| YvZrnG | Abandoned Checkout | Metric | manual |
| TdHqWj | Browse Abandonment | Metric | live |
| USxqaR | Order Confirmation | Metric | live |
| TGz82H | Post-Purchase — Thank You & Review Request | Metric | manual |
| Sn9gqZ | Win-Back — Lapsed Purchasers | Added to List | live |

**Email Welcome Series (VTqXAN)** — 5 emails, all `manual`:
1. Immediately — "Welcome to NanoGrow Max — The future of growing starts here 🌱" (preview "Your prize is waiting. Discover how growers are doubling their yields."), template `TfS2yA` "Welcome email (no coupon)". Body references the popup prize but contains **no code and no profile-property merge tag** (only `{{ first_name|default:"there" }}`).
2. +4 d — "Growers are getting 2× yields with NanoGrow Max 🌱…" (`RibCmj`)
3. +3 d — "See why 2,000+ growers trust NanoGrow Max" (`UhJ3cC`)
4. +3 d — "How to get 2x more yield with NanoGrow Max" (`Y5p4Xu`)
5. +4 d — "A special gift for you — 10% off your first NanoGrow Max order" (`UqYhBk`)

**Welcome — Lander Capture (RTpJin, draft)** — splits on `properties['signup_source'] == "nom_lander"` → "Your Nano Odor Max deal, as promised" (NOM) else "Your NanoGrow Max offer, as promised" (NGM). Nothing currently writes `signup_source` or posts to `VbyeU9`.

### 3.4 Relevant metrics

- `XpDjDR` Subscribed to Email Marketing — 5 events total Apr–Oct 2026 (0,1,1,0,2,0,1 by month). No flow triggered.
- `VBds9n` Subscribed to List — Email List only: 5 unique profiles (14 events). No flow triggered.
- No custom metric for the popup (no "Pick Your Prize", "Prize Won", or form metric).

### 3.5 What is broken in the Klaviyo wiring

- Popup → double-opt-in list → most entrants never become list members.
- Welcome flow on that list is `manual` → no emails sent even to confirmed members.
- Welcome email promises the prize code; nothing delivers it and the profile carries no prize data.
- Single-opt-in lists (`VbyeU9`, `T3cj6y`) and the segment-aware draft flow exist but are wired to nothing.
- Deep Clean game recovery flow `W7j6Hu` is `manual`.
- No SMS capture although a Text Messaging list exists.

---

## 4. Recommendations for the rebuilt integration

1. **Draw the prize first, then subscribe** with the prize attached. Preserve the exact pool and odds (48/20/14/10/8) and the same weighted algorithm; consider moving the draw server-side (Next.js route) so it cannot be replayed client-side.
2. **Klaviyo Client Subscriptions API** (`POST https://a.klaviyo.com/client/subscriptions?company_id=[KLAVIYO-PUBLIC-ID]`, current `revision`):
   - `profile.data.attributes`: `email`, `first_name`, optional `phone_number`, `properties: { pyp_prize_name, pyp_prize_code, pyp_prize_type, pyp_game, pyp_won_at, pyp_source_url, signup_source: "pick_your_prize" }`.
   - `subscriptions.email.marketing.consent: "SUBSCRIBED"` (and `sms.marketing.consent` + `sms.transactional` when a phone is given, with TCPA disclosure copy).
   - `custom_source: "Pick Your Prize"`.
   - Point at a **single-opt-in** list (e.g. reuse `VbyeU9` "Lander Capture — Single Opt-in" or create a dedicated one), or switch `W5ffbq` to single opt-in.
   - Check `response.ok` (202) and retry/log failures.
3. **Also send a Klaviyo client event** (`POST /client/events`, metric e.g. "Pick Your Prize Won" with prize properties) so a flow can be triggered by the win itself and the code merged with `{{ event.prize_code }}`.
4. **Fix the flows**: set the welcome flow live; first email must show `{{ person|lookup:'pyp_prize_code' }}` / prize name and a `https://nanogrowmax.com/discount/{{code}}?redirect=…` button; replace the myshopify.com link; branch Odor Max vs Grow Max by `signup_source`/source URL.
5. **Auto-apply the code without relying on a click**: on reveal, `fetch('/discount/CODE')` (or the Storefront/Cart API `discountCodes` update) in the background, also write a cart attribute (`pyp_code`), and persist `{code, prize, expiresAt}` in a cookie/localStorage so the drawer/checkout can re-apply it on later sessions; render a real "Copy code" button.
6. **Fix the prize pool in Shopify**: re-activate or replace `[CODE:fre-x]` (expired); replace `[CODE:prize-freeship]` with a prize that has value while free shipping is store-wide; set `combinesWith.shippingDiscounts = true` on percent codes; decide how codes should interact with the automatic BXGY bundle discount. Consider unique single-use codes (Klaviyo coupon pools or a Shopify app) instead of shared strings.
7. **Honour frequency rules**: after a win, never re-show (cookie + Klaviyo `_kx`/identified-profile check); otherwise once per `frequency_days` (7); implement the mobile teaser tab if wanted; suppress on landing pages that have their own offer.
8. **Remove fake mechanics**: drop the filler "WIN" slice (or make it a real prize), make the 10-minute timer either real (code expiry) or honest.
9. **Spray game as Odor Max "How It Works"**: port `deep-clean-lp` canvas logic 1:1 (constants in 2.1) as a React client component using the five `dc-*` assets; keep reduced-motion handling; optionally reward completion with the popup's email capture instead of a hard-coded discount.
