# NanoGrow Max: Performance, SEO and CRO Playbook (Online Store 2.0 custom theme)

**Scope:** Custom Online Store 2.0 Liquid theme for NanoGrow Max.
- **Grow Max** bundle (RootMax + GroMax), $99.99
- **Nano Odor Max** spray, $12.99 to $39.99

**Traffic:** Mostly mobile visitors from paid social (Meta and TikTok in-app browsers). **Launch:** Holiday season 2026.
**Research date:** October 2026. Shopify docs were read through the shopify.dev doc index, and other claims come from the linked sources. Treat any number marked *(verify)* as something to re-check before launch.

---

## 0. TL;DR: the 12 decisions that matter most

1. **Render the PDP in Liquid, not JavaScript.** The first gallery image is the LCP element. Give it `loading: 'eager'` and `fetchpriority: 'high'`, and pass `preload: true` so Shopify sends it as an HTTP 103 Early Hint. Use `image_tag` with 4 to 6 `widths` and a correct `sizes`.
2. **Put first-paint CSS and fonts above `{{ content_for_header }}`.** Shopify now streams JSON-template pages, so anything above that tag starts downloading while the sections are still rendering.
3. **Use a system font stack, or at most one self-hosted woff2 family.** Load it with `font_face: font_display: 'swap'` and tune the fallback metrics.
4. **No jQuery and no framework.** Build with custom elements (islands) as ES modules, use `defer`, and load code with `import()` on interaction. Build the cart drawer DOM only the first time it opens.
5. **Use the Cart Ajax API with bundled section rendering** (`sections` on `/cart/add.js` and `/cart/change.js`). Render the cart optimistically, then reconcile with the server response.
6. **Show accelerated checkout buttons (Shop Pay first) in the cart drawer** and Shop Pay Installments messaging on the PDP. At $99.99, "4 × $24.99" removes price friction.
7. **Offer a three-tier bundle selector** (1 / 2 "Most Popular" / 3 "Best Value"). Back it with **native automatic discounts** (minimum-quantity rules) so the cart and checkout always match the PDP.
8. **Add a sticky mobile ATC** that appears when the main ATC scrolls out of view. A/B test it, because published tests run from -7.7% to +16% CVR.
9. **Gamified popup:** no entry interstitial. Trigger it after engagement (scroll or time) as a bottom sheet. Subscribe through Klaviyo's client Subscriptions API with a TCPA-compliant SMS disclosure. Apply the won code with `/cart/update.js { discount }`.
10. **Write the JSON-LD by hand.** Use Product or ProductGroup, Offer, AggregateRating, and Organization-level `hasMerchantReturnPolicy` plus `hasShippingService`. **FAQ rich results stopped appearing on May 7, 2026, and HowTo rich results were deprecated in 2023.** Keep FAQ content for users and AI answers, but don't expect SERP dropdowns.
11. **Audit every app.** Shopify blocks new script tags from **Oct 1, 2026** and stops injecting them on **Mar 1, 2027**, so accept only apps that ship as app embeds or app blocks.
12. **Set budgets and enforce them in CI** with Lighthouse CI and Theme Check. Field targets at p75 are LCP ≤ 2.0 s, INP ≤ 150 ms and CLS ≤ 0.05, which is tighter than Google's "good" thresholds.

**Holiday 2026 calendar:** Thanksgiving is Thu Nov 26, Black Friday is Fri Nov 27, and Cyber Monday is Mon Nov 30. **Freeze code by Fri Nov 13** and use the last two weeks for load testing and app audits only.

---

## 1. Shopify theme performance

### 1.1 Targets

| Metric | Google "good" (p75 field) | NanoGrow Max target (p75 mobile) | Notes |
|---|---|---|---|
| LCP | ≤ 2.5 s (poor > 4.0 s) | **≤ 2.0 s** | The LCP element is the first PDP gallery image or the landing hero image |
| INP | ≤ 200 ms (poor > 500 ms) | **≤ 150 ms** | INP replaced FID on Mar 12, 2024 |
| CLS | ≤ 0.1 (poor > 0.25) | **≤ 0.05** | Review widgets, announcement bars and fonts are the usual culprits |
| Lighthouse Perf (mobile, lab) | Theme Store minimum is an **average of 60** across home, product and collection | **≥ 80 on PDP, ≥ 75 on home** | Shopify's speed score weights Home 17%, Product 40%, Collection 43% |
| Lighthouse A11y | Theme Store minimum is an **average of 90** | **≥ 95** | |

**Our page budgets (mobile PDP, compressed).** These are NanoGrow Max's own numbers, not Shopify rules:

| Resource | Budget |
|---|---|
| HTML | ≤ 60 KB |
| Critical CSS (render-blocking) | ≤ 25 KB |
| Theme JS loaded on page load | ≤ 20 KB (Shopify suggests that minified app bundles stay ≤ 16 KB) |
| All third-party JS combined | ≤ 120 KB |
| LCP image | ≤ 120 KB at 2x DPR for a ~400 CSS-px-wide viewport |
| Font files | ≤ 2 files, woff2 only |
| Total requests before LCP | ≤ 15 |

**Paid-social caveat.** Most sessions open inside the Instagram, Facebook or TikTok in-app browser.
- On iOS these are WebKit, so speculation rules don't apply there. Raw LCP is what you have to win.
- The Theme Store also requires themes to support purchasing inside the Instagram, Facebook and Pinterest webviews, which is a good QA list for us.
- Test on a mid-tier Android phone (Moto G class) over throttled 4G, not only on an iPhone over Wi-Fi.

Sources:
- [web.dev Core Web Vitals](https://web.dev/articles/vitals)
- [web.dev threshold rationale](https://web.dev/articles/defining-core-web-vitals-thresholds)
- [Shopify Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements)
- [Shopify testing for performance](https://shopify.dev/docs/storefronts/themes/best-practices/performance/testing-for-performance)
- [Shopify app performance best practices (16 KB)](https://shopify.dev/docs/apps/build/performance/general-best-practices)

### 1.2 `theme.liquid` head order (streaming-aware)

Shopify streams JSON-template pages, so everything above `{{ content_for_header }}` reaches the browser before the sections render. The layout must keep `{{ content_for_header }}` as a plain output tag inside `<head>`.
- Put critical CSS, the font preload and the main module script **above** it.
- **Caveat:** a stylesheet moved above `content_for_header` loses specificity ties against the stylesheet that `{% stylesheet %}` tags compile into. Check `.shopify-payment-button` styling after the move.

```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{{ page_title }}{% unless page_title contains shop.name %} | {{ shop.name }}{% endunless %}</title>
  {%- if page_description %}<meta name="description" content="{{ page_description | escape }}">{% endif -%}
  <link rel="canonical" href="{{ canonical_url }}">

  {%- comment -%} 1. Fonts: preload only the one above-the-fold face; skip entirely for system fonts {%- endcomment -%}
  {%- unless settings.type_body_font.system? -%}
    {{ settings.type_body_font | font_url | preload_tag: as: 'font', type: 'font/woff2' }}
  {%- endunless -%}
  {% style %}
    {{ settings.type_body_font | font_face: font_display: 'swap' }}
    :root {
      --font-body: {% if settings.type_body_font.system? %}system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif{% else %}{{ settings.type_body_font.family }}, {{ settings.type_body_font.fallback_families }}{% endif %};
    }
  {% endstyle %}

  {%- comment -%} 2. Critical CSS: render-blocking, small, above content_for_header {%- endcomment -%}
  {{ 'critical.css' | asset_url | stylesheet_tag }}

  {%- comment -%} 3. Theme JS as modules (deferred by default). Shopify already injects es-module-shims: don't add your own. {%- endcomment -%}
  <script type="importmap">{"imports":{"@theme/cart":"{{ 'cart.js' | asset_url }}","@theme/utils":"{{ 'utils.js' | asset_url }}"}}</script>
  <script type="module" src="{{ 'global.js' | asset_url }}"></script>

  {%- comment -%} 4. Theme-owned speculation rules (see 1.7) {%- endcomment -%}
  {% render 'speculation-rules' %}

  {{ content_for_header }}

  {%- comment -%} Non-critical CSS below this line {%- endcomment -%}
</head>
```

Sources:
- [Load first-paint resources before content_for_header](https://shopify.dev/docs/storefronts/themes/best-practices/performance/load-critical-resources-before-content-for-header)
- [The Shopify platform: streaming, Early Hints, es-module-shims](https://shopify.dev/docs/storefronts/themes/best-practices/performance/platform)

### 1.3 Images: `image_url` + `image_tag`

What `image_tag` does automatically:
- It generates a `srcset`. Default widths are 352, 832, 1200 and 1920. Passing `widths:` replaces the defaults, and the set is capped at the `image_url` width.
- It writes intrinsic `width` and `height` attributes, which prevents CLS.
- It applies the focal point as `object-position`.
- The CDN negotiates **WebP or AVIF automatically** (about 25 to 35% smaller), so don't hand-build format URLs.
- `preload: true` emits an HTTP 103 Early Hint. Use it for exactly one image: the LCP image.

**PDP main gallery image (LCP):**

```liquid
{%- liquid
  assign hero = product.selected_or_first_available_variant.featured_media | default: product.featured_media
-%}
{{ hero.preview_image
  | image_url: width: 1400
  | image_tag:
    widths: '400, 600, 800, 1000, 1400',
    sizes: '(min-width: 990px) 55vw, 100vw',
    loading: 'eager',
    fetchpriority: 'high',
    preload: true,
    alt: hero.alt | default: product.title,
    class: 'pdp-gallery__img'
}}
```

**Position-aware sections.** Section 1 or 2 gets eager loading and high priority; later sections are lazy. Test the lazy case positively, because `section.index` is nil in the editor and in Section Rendering:

```liquid
{%- liquid
  if section.index > 2
    assign img_loading = 'lazy'
    assign img_priority = 'auto'
  else
    assign img_loading = 'eager'
    assign img_priority = 'high'
  endif
-%}
```

**Below-the-fold and lazy images** can use `sizes: 'auto'`. Shopify polyfills it, but it only works with `loading="lazy"`.

```liquid
{{ block.settings.image | image_url: width: 1000 | image_tag: loading: 'lazy', widths: '400, 600, 800, 1000', sizes: 'auto' }}
```

**Rules:**
- Never lazy-load the LCP image.
- Don't use CSS `background-image` for heroes.
- Use `<picture>` only when art direction differs between mobile and desktop.
- Don't set `quality:` unless you measured a gain, because Shopify chooses quality per format.
- Carousels: render `<img>` only for the first slide plus thumbnails, and inject the rest on swipe.

**Gallery UX (Baymard):**
- Show **thumbnails, not just dots**. Only 24% of mobile sites do, and dots caused users to miss images.
- Include an **"in scale" image**: a bottle in someone's hand, or next to a grow tent. 42% of users try to judge size from images.

Sources:
- [Use responsive images](https://shopify.dev/docs/storefronts/themes/best-practices/performance/use-responsive-images)
- [Use filter chains / image_tag automatic optimizations](https://shopify.dev/docs/storefronts/themes/best-practices/performance/use-filter-chains)
- [Set fetchpriority high on LCP image](https://shopify.dev/docs/storefronts/themes/best-practices/performance/set-fetchpriority-high-on-lcp-image)
- [Never lazy load LCP image](https://shopify.dev/docs/storefronts/themes/best-practices/performance/never-lazy-load-lcp-image)
- [Build responsive layouts](https://shopify.dev/docs/storefronts/themes/best-practices/performance/implement-responsive-design)
- [Baymard: thumbnails](https://baymard.com/research-articles/always-use-thumbnails-additional-images)
- [Baymard: in-scale images](https://baymard.com/research-articles/in-scale-product-images)

### 1.4 Fonts

- **Prefer system fonts for body text.** That means no request, no swap and no font CLS. Use one display face for headings at most.
- **Self-hosting rules:**
  - woff2 only, `font-display: swap`.
  - 1 to 2 families and 2 to 4 weights. More than 6 files hurts performance.
  - Preload only the face used above the fold. `preload_tag` adds `crossorigin` itself, so don't add it.
- **Tune the fallback metrics** to kill swap CLS. Fontaine or Capsize generate the values.

```css
@font-face{font-family:"Brand Fallback";src:local("Arial");size-adjust:104%;ascent-override:92%;descent-override:24%;line-gap-override:0%}
h1,h2,h3{font-family:"Brand Display","Brand Fallback",system-ui,sans-serif}
```

Sources:
- [Use system fonts](https://shopify.dev/docs/storefronts/themes/best-practices/performance/use-system-fonts)
- [Self-host web fonts](https://shopify.dev/docs/storefronts/themes/best-practices/performance/self-host-web-fonts)
- [Reduce CLS from font swapping](https://shopify.dev/docs/storefronts/themes/best-practices/performance/reduce-cls-font-swapping)

### 1.5 CSS

- **Critical CSS stays render-blocking.** Anything visible before scrolling loads synchronously. Async CSS above the fold causes FOUC and CLS.
- **Below-the-fold sections** (reviews, FAQ, comparison table, footer) can use the async pattern, gated on `section.index`:

```liquid
{% unless section.index > 3 %}
  {{ 'section-reviews.css' | asset_url | stylesheet_tag }}
{% else %}
  <link rel="stylesheet" href="{{ 'section-reviews.css' | asset_url }}" media="print" onload="this.media='all'">
  <noscript>{{ 'section-reviews.css' | asset_url | stylesheet_tag }}</noscript>
{% endunless %}
```

- **Use `{% stylesheet %}` inside sections and blocks** for small, component-scoped CSS. Shopify bundles and dedupes it.
- **Prefer CSS over JS for interactions:** `<details>` accordions, `:has()` for the bundle selector state, `scroll-snap` galleries, and `position: sticky`.
- **Inline only truly tiny critical rules.** On Shopify, a cached `critical.css` file on the same CDN origin is usually better than a large inline `<style>`, because inline styles bloat every HTML response and can't be cached.

Source: [Load critical CSS synchronously](https://shopify.dev/docs/storefronts/themes/best-practices/performance/load-critical-css-synchronously)

### 1.6 JavaScript: islands, no jQuery

Shopify's guidance:
- Avoid frameworks and jQuery.
- Use `defer`; use `async` only for independent third parties.
- Use dynamic `import()` on interaction.
- Remove A/B anti-flicker snippets when no test is running.
- Build DOM for hidden components (cart drawer, filters, dialogs) only when first opened.
- Debounce, throttle, use passive listeners, and **yield to the main thread**.

**Island pattern.** Each interactive component is a custom element that hydrates on visibility or interaction:

```js
// assets/global.js  (type="module", deferred)
const lazyIslands = {
  'reviews-widget': () => import('@theme/reviews'),
  'compare-table':  () => import('@theme/compare'),
  'spin-popup':     () => import('@theme/spin-popup'),
};

const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    io.unobserve(e.target);
    lazyIslands[e.target.localName]?.();
  }
}, { rootMargin: '200px' });

for (const tag of Object.keys(lazyIslands)) {
  document.querySelectorAll(tag).forEach((el) => io.observe(el));
}

// Yield helper: scheduler.yield() is in Chrome/Edge 129+ and Firefox 142+, but not Safari, so fall back.
export const yieldToMain = () =>
  globalThis.scheduler?.yield ? scheduler.yield() : new Promise((r) => setTimeout(r, 0));
```

**Cart drawer: fetch its DOM on first open.**

```js
let drawerLoaded = false;
document.addEventListener('click', async (e) => {
  const trigger = e.target.closest('[data-open-cart]');
  if (!trigger) return;
  e.preventDefault();
  if (!drawerLoaded) {
    const r = await fetch(`${window.Shopify.routes.root}?sections=cart-drawer`);
    document.querySelector('#CartDrawerMount').innerHTML = (await r.json())['cart-drawer'];
    drawerLoaded = true;
  }
  document.querySelector('cart-drawer')?.open();
});
```

Sources:
- [Performance best practices index](https://shopify.dev/docs/storefronts/themes/best-practices/performance)
- [Build DOM for hidden components only when opened](https://shopify.dev/docs/storefronts/themes/best-practices/performance/lazy-dom-rendering)
- [Understanding INP](https://shopify.dev/docs/storefronts/themes/best-practices/performance/understanding-inp)
- [Finding worst JS offenders](https://shopify.dev/docs/storefronts/themes/best-practices/performance/finding-worst-offenders)
- [Chrome: scheduler.yield](https://developer.chrome.com/blog/use-scheduler-yield)

### 1.7 Speculation rules (prefetch and prerender)

**What Shopify already does.** Since **June 2025**, every Liquid storefront gets a `Speculation-Rules` HTTP header with `prefetch` at **`conservative`** eagerness, which fires on touchdown or mousedown.
- Shopify measured about 220 ms faster median same-site navigations on desktop and about 20 ms on mobile (Chromium).
- **Shopify only prefetches; it never prerenders.**
- Shopify sends `Clear-Site-Data` to flush speculative caches when the cart changes.

**What we add.** Targeted **prerender** at `moderate` eagerness (about 200 ms hover on desktop), only on high-confidence links: the home or landing hero CTA, and "Shop Grow Max" links to the PDP.

```liquid
{%- comment -%} snippets/speculation-rules.liquid {%- endcomment -%}
<script type="speculationrules">
{
  "prerender": [{
    "where": { "and": [
      { "selector_matches": "[data-instant-navigation]" },
      { "not": { "href_matches": "/cart*" } },
      { "not": { "href_matches": "/checkouts/*" } },
      { "not": { "href_matches": "/account*" } }
    ]},
    "eagerness": "moderate"
  }]
}
</script>
```

```liquid
<a href="{{ product.url }}" data-instant-navigation class="btn">Shop Grow Max</a>
```

**Caveats:**
- Prerender executes JavaScript, so make sure analytics only fire on activation. Shopify's web pixels and `document.prerendering` checks handle this.
- Only Chromium supports speculation rules. Safari, Firefox and iOS in-app browsers ignore them.
- Don't use `immediate` on collection grids.
- Verify in DevTools under Application, then Speculative loads.

Sources:
- [Shopify: Use speculation rules](https://shopify.dev/docs/storefronts/themes/best-practices/performance/use-speculation-rules)
- [Speculation Rules at Shopify (performance blog)](https://performance.shopify.com/blogs/blog/speculation-rules-at-shopify)

### 1.8 View Transitions

- **Opt in on both documents:** `@view-transition { navigation: auto; }` in `base.css`.
- **Use them selectively.** Shopify recommends limiting them to product card → PDP image morphs.
- **Skip on reduced motion.** Do this in `pageswap` or `pagereveal`.
- **Cancel the transition on user interaction.** Cross-document transitions block rendering between the snapshot and the server response, which hurts INP.
- **Don't** drive navigations with `document.startViewTransition()`. That API is same-document only.

```css
@view-transition { navigation: auto; }
.card__media img, .pdp-gallery__img { view-transition-name: var(--vt-name, none); }
::view-transition-old(root), ::view-transition-new(root) { animation-duration: .2s; }
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
}
```

```js
window.addEventListener('pageswap', (e) => {
  const vt = e.viewTransition; if (!vt) return;
  const to = e.activation?.entry?.url;
  if (!to || !new URL(to).pathname.startsWith('/products/') || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    vt.skipTransition();
  }
});
```

Source: [Cancel in-progress view transitions on interaction](https://shopify.dev/docs/storefronts/themes/best-practices/performance/cancel-view-transitions-on-interaction)

### 1.9 Apps and third-party scripts

- **Script tag deprecation.** From **Oct 1, 2026**, apps can't create or update ScriptTags. From **Mar 1, 2027**, Shopify stops injecting them into storefronts.
  - Accept only apps that ship **theme app extensions**: app embed blocks or app blocks.
  - Analytics-only scripts should be **web pixels**, which respect consent and run sandboxed.
- **Audit questions for each app.**
  - Is it used? Does it need to load on every page? Is there a native alternative? Can it be deferred or faceaded?
  - Remove anything that adds 500 ms or more of blocking time.
- **Reviews.** Pick a provider that writes Shopify's **standard `reviews.rating` and `reviews.rating_count` metafields**. Render the stars server-side in Liquid next to the title (no CLS), and lazy-load the full widget below the fold.
- **Chat:** use a facade. Load the widget on click, or after about 10 s of idle time.
- **Reserve space** for any app block that renders above the fold (`min-height` in Custom CSS). Cookie banners and chat bubbles must be `position: fixed` overlays.
- **Don't buy "speed booster" apps** that cheat Lighthouse. Shopify explicitly warns about apps that inject transparent elements or serve different pages to crawlers.

Sources:
- [Storefront script tag deprecation](https://shopify.dev/docs/apps/build/online-store/script-tag-deprecation/storefront)
- [Changelog: script tags stop running Mar 1, 2027](https://shopify.dev/changelog/posts/online-store-script-tags-deprecation)
- [Remove render-blocking apps](https://shopify.dev/docs/storefronts/themes/best-practices/performance/remove-render-blocking-apps)
- [Reserve space for app-injected content](https://shopify.dev/docs/storefronts/themes/best-practices/performance/reserve-space-app-injected)
- [Migrate to theme app extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/migrate)

### 1.10 Resource hints and CDN

- **Shopify already handles the common hints.**
  - It preloads up to 10 render-blocking head resources.
  - It preconnects to the **first three third-party origins** that serve render-blocking resources.
  - It always preconnects to the Shopify CDN.
  - All of this goes out as Link headers and 103 Early Hints.
- **Add `<link rel="preconnect">` only** for origins the platform can't see, such as a below-the-fold video host that we know we'll need.
- **Use `preload` sparingly**, for 1 or 2 late-discovered resources at most.
- **Checkout** runs on our own domain (`/checkouts/...`), so it needs no preconnect.
- **Move vendor files into `assets/`** wherever licensing allows, so they're served same-origin from the CDN.

Sources:
- [Use preconnect](https://shopify.dev/docs/storefronts/themes/best-practices/performance/use-preconnect)
- [Serve assets from Shopify CDN](https://shopify.dev/docs/storefronts/themes/best-practices/performance/use-shopify-cdn)

### 1.11 Liquid server time (TTFB)

- Avoid nested loops over products, variants and options.
- Don't build manual `srcset` strings. One `image_tag` call is much cheaper than N `image_url` calls.
- Profile with the Shopify Theme Inspector Chrome extension.
- Shopify estimates that its Liquid micro-optimizations save 25 to 50 ms of TTFB on complex themes.

Source: [Liquid performance patterns, via the performance index](https://shopify.dev/docs/storefronts/themes/best-practices/performance)

### 1.12 Measurement and CI

**Lab tools:**
- **Lighthouse CI GitHub Action** ([shopify.dev/themes/tools/lighthouse-ci](https://shopify.dev/themes/tools/lighthouse-ci)) runs on every PR against a dev store, testing the home page, PDP and collection page.
- **Theme Check** in CI catches oversized bundles, parser-blocking scripts and remote assets.
- For Theme Store-comparable runs, append `?pb=0` to preview URLs, use Incognito, and take the median of 3 runs.

**Field data:**
- Shopify admin Web Performance report (CrUX-based).
- Optionally, the `web-vitals` library with attribution, sending to GA4 or a pixel. This tells you which interaction causes poor INP. Usual suspects are the variant or bundle selector, drawer open, and the quantity stepper.

---

## 2. Fast add-to-cart → cart → checkout

### 2.1 Cart Ajax API essentials

| Endpoint | Use | Notes |
|---|---|---|
| `POST /cart/add.js` | Add one or more lines | `{ items:[{id, quantity, properties, selling_plan}] }`. Returns the added items, not the full cart. A 422 includes `description`, for example when an item is out of stock. |
| `POST /cart/change.js` | Change **one** line | Use `id` set to the line item **key**, not the variant ID, so lines with properties stay distinct. Returns the full cart. |
| `POST /cart/update.js` | Bulk quantities, `attributes`, `note`, and **`discount`** | `discount` takes one code or a comma-separated list. **It replaces all existing codes**; `""` clears them. Returns the cart. |
| `GET /cart.js` | Read the cart | |
| `POST /cart/clear.js` | Empty the cart | |

- Always build URLs from `window.Shopify.routes.root` so Markets and locale prefixes work.
- All of the mutating endpoints support **bundled section rendering**: `sections` takes up to 5 section IDs, and `sections_url` sets the render context (it must start with `/`).
- Sections that fail to render come back as `null`, and the request still succeeds. An invalid `sections_url` returns 400.

Sources:
- [Cart API reference / bundled section rendering](https://shopify.dev/docs/api/ajax/reference/cart)
- [Section Rendering API](https://shopify.dev/docs/api/ajax/section-rendering)
- [Changelog: discounts on /cart/update.js](https://shopify.dev/changelog/cart-ajax-api-discounts-support-on-cartupdatejs)

### 2.2 Optimistic add-to-cart with bundled sections

```js
// assets/cart.js  (imported as '@theme/cart')
const root = window.Shopify?.routes?.root ?? '/';
const SECTIONS = ['cart-drawer', 'cart-icon-bubble']; // <= 5
let queue = Promise.resolve(); // serialize mutations to avoid race conditions

function enqueue(fn) { queue = queue.then(fn, fn); return queue; }

export function addToCart({ items, optimistic }) {
  // 1) Instant feedback (render line from PDP data already on the page)
  if (optimistic) {
    document.querySelector('cart-drawer')?.renderOptimistic(optimistic); // title, image, price, qty
    document.querySelector('cart-drawer')?.open();
  }
  // 2) Server truth, one round trip, sections included
  return enqueue(async () => {
    const res = await fetch(`${root}cart/add.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ items, sections: SECTIONS, sections_url: window.location.pathname }),
    });
    const data = await res.json();
    if (!res.ok) {
      document.querySelector('cart-drawer')?.rollback(data.description ?? 'Could not add to cart');
      return;
    }
    applySections(data.sections);
    document.dispatchEvent(new CustomEvent('shopify:cart:lines-update', { bubbles: true, detail: { action: 'add', items } }));
  });
}

export function changeLine(key, quantity) {
  return enqueue(async () => {
    const res = await fetch(`${root}cart/change.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity, sections: SECTIONS, sections_url: window.location.pathname }),
    });
    const cart = await res.json();
    applySections(cart.sections);
    return cart;
  });
}

export function applyDiscount(codes /* string[] */) {
  // update.js REPLACES codes, so always send the full desired set
  return enqueue(async () => {
    const res = await fetch(`${root}cart/update.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ discount: codes.join(','), sections: SECTIONS, sections_url: window.location.pathname }),
    });
    const cart = await res.json();
    applySections(cart.sections);
    return cart; // inspect cart.discount_codes[].applicable to show "code not applicable" messages
  });
}

function applySections(sections = {}) {
  for (const [id, html] of Object.entries(sections)) {
    if (!html) continue; // null = render failure
    const target = document.getElementById(`shopify-section-${id}`);
    if (!target) continue;
    const fresh = new DOMParser().parseFromString(html, 'text/html').getElementById(`shopify-section-${id}`);
    if (fresh) target.replaceWith(fresh); // scripts inside won't run: bind behavior via custom elements / delegation
  }
}
```

**Interaction details that protect INP and UX:**
- Debounce the quantity stepper by about 300 ms. Update the number on screen immediately, then send one `change.js`.
- Use `<button>` elements with `aria-busy` while a request is pending. Announce subtotal changes through an `aria-live="polite"` region.
- Don't block the drawer opening on the network. Open it first and show the optimistic line; Shopify's own guidance documents this pattern.
- **Standard storefront events and actions** (Shopify changelog, **June 17, 2026**):
  - Configure `Shopify.actions.updateCart` with `eventTarget` and `handler`, above `content_for_header`, inside `DOMContentLoaded`. Then apps such as upsell, bundle or Klaviyo tools that call `updateCart` re-render **your** drawer instead of triggering a full page reload.
  - Dispatch `shopify:product:view` and `shopify:cart:*` events from the theme.
  - These events fire regardless of consent, so use web pixels for analytics.

```js
document.addEventListener('DOMContentLoaded', () => {
  Shopify.actions?.updateCart?.configure({
    eventTarget: () => document.querySelector('cart-drawer'),
    handler: async (defaultHandler, ...args) => {
      const result = await defaultHandler(...args);        // Shopify writes via Storefront API
      const r = await fetch(`${root}?sections=cart-drawer,cart-icon-bubble`);
      applySections(await r.json());
      return result;
    },
  });
});
```

Sources:
- [Use the Section Rendering API (optimistic cart)](https://shopify.dev/docs/storefronts/themes/best-practices/performance/use-section-rendering-api)
- [Standard storefront events and actions](https://shopify.dev/docs/storefronts/themes/best-practices/standard-events-and-actions)
- [Configure actions](https://shopify.dev/docs/api/storefront-events-and-actions/actions/configure)
- [Changelog, June 17 2026](https://shopify.dev/changelog/posts/standard-storefront-events-and-actions)

### 2.3 Accelerated checkout in the cart drawer

**PDP:** `{{ form | payment_button }}` inside `{% form 'product' %}` renders one dynamic button, usually Shop Pay. Add `{{ form | payment_terms }}` for **Shop Pay Installments** messaging ("4 interest-free payments of $24.99").

**Cart drawer:**

```liquid
<div class="cart-drawer__checkout">
  <button type="submit" name="checkout" form="CartDrawerForm" class="btn btn--primary btn--full">
    Checkout · {{ cart.total_price | money }}
  </button>
  {% if additional_checkout_buttons %}
    <div class="additional-checkout-buttons additional-checkout-buttons--vertical">
      {{ content_for_additional_checkout_buttons }}
    </div>
  {% endif %}
</div>
```

**Style them through CSS custom properties.** The buttons live in a closed shadow DOM, so normal selectors can't reach them.

```css
.cart-drawer__checkout{
  --shopify-accelerated-checkout-button-block-size: 48px;   /* 25–55px allowed */
  --shopify-accelerated-checkout-button-border-radius: 8px;
  --shopify-accelerated-checkout-skeleton-background-color: #eef3ee;
}
.additional-checkout-buttons{ min-height: 48px; } /* reserve space → no CLS on first render */
```

**Notes:**
- Accelerated buttons render slower on their first request and faster once the library is cached. Because the drawer DOM is built lazily, reserve their height.
- To track clicks, listen on `shop-pay-wallet-button`, `shopify-apple-pay-button`, `shopify-google-pay-button` and `shopify-paypal-button`.
- Shopify's marketing claims:
  - Shop Pay lifts conversion by "up to 50% vs guest checkout".
  - Buyers choose it about two-thirds of the time when it's offered.
  - These are vendor numbers, so treat them as directional.
- Wallet availability inside Meta and TikTok in-app browsers varies. QA Shop Pay, Apple Pay and Google Pay in each webview.

Sources:
- [Accelerated checkout](https://shopify.dev/docs/storefronts/themes/pricing-payments/accelerated-checkout)
- [Shop Pay (Shopify)](https://shopify.com/solutions/shop-pay/enterprise)

### 2.4 Discount codes: which mechanism to use when

| Scenario | Mechanism |
|---|---|
| Email or SMS links, influencer links, ads | `https://nanogrowmax.com/discount/HOLIDAY15?redirect=/products/grow-max`. It stores the code and applies it to active carts and checkout. |
| Popup win, in-drawer code field | `POST /cart/update.js { discount: "SPIN15" }`. Merge it with existing codes, because this call replaces them. Show `applicable:false` errors inline. |
| Bundle tiers and quantity breaks | **Automatic discounts** with a minimum-quantity requirement. No code is needed, so there's no "where's my discount?" support load. |
| Free shipping over a threshold | A shipping rate condition or an automatic free-shipping discount. Mirror the threshold in a theme setting for the progress bar. |

- Don't append `?discount=` to `/checkout`. Shopify removed that for privacy.
- Check the **discount combinations** settings in admin. For example, the SPIN code should combine with free shipping but not stack on top of the bundle discount, unless you mean it to.

Sources:
- [Discounts in themes](https://shopify.dev/docs/storefronts/themes/pricing-payments/discounts)
- [shopify:cart:discount-update (replace semantics, `applicable`)](https://shopify.dev/docs/api/storefront-events-and-actions/events/cart-discount-update)
- [Community: checkout?discount removed](https://community.shopify.com/t/auto-apply-discount-code-at-checkout-doesnt-work-anymore/235659)

### 2.5 Free-shipping progress bar

> **Owner decision (2026-10-07): free shipping on ALL orders, no threshold.** The threshold discussion below is general background only. On this site the bar becomes a "Free shipping unlocked ✓" confirmation, and the progress-bar slot is reused to drive free-gift or tier unlocks instead.

**Where to set the threshold (background):**
- Industry practice is 20 to 30% above the current AOV. Shoppers within about 20% of the threshold are the most responsive.
- **NanoGrow Max:** the Grow Max bundle alone is $99.99. A **$75 threshold** makes any Grow Max order ship free, which is a strong PDP message. Nano Odor Max buyers ($12.99 to $39.99) are then nudged up toward $75.
- Alternatively, set the threshold at $100 so that a single Odor Max **plus** Grow Max qualifies. That raises AOV but leaves single-bundle buyers paying shipping. A/B test both.
- Baymard's top abandonment reason is **"extra costs too high" at 39%**, so show shipping cost certainty early.

```liquid
{%- liquid
  assign threshold = settings.free_ship_threshold | times: 100   # store-currency cents
  assign remaining = threshold | minus: cart.total_price
  assign pct = cart.total_price | times: 100 | divided_by: threshold
  if pct > 100
    assign pct = 100
  endif
-%}
<div class="ship-bar" role="status" aria-live="polite">
  {%- if remaining > 0 -%}
    You're <strong>{{ remaining | money }}</strong> away from <strong>free shipping</strong>
  {%- else -%}
    You've unlocked <strong>free shipping</strong> 🎉
  {%- endif -%}
  <progress max="100" value="{{ pct }}" aria-label="Progress to free shipping">{{ pct }}%</progress>
</div>
```

- For Markets and multi-currency, convert in JS with `Shopify.currency.rate`, or keep the store US-only for launch.
- Match the threshold basis to the shipping rule. "Order price" conditions are evaluated after discounts.

Sources:
- [Baymard abandonment reasons, via a summary of the 2025 data](https://redstagfulfillment.com/percentage-of-online-shoppers-abandon-their-cart/)
- [Free-shipping threshold guidance](https://www.growthsuite.net/resources/shopify-upsell-cross-sell/increase-average-order-value/free-shipping-threshold)

### 2.6 In-cart upsells

- **Show 1 or 2 complementary items at most.** One-tap add, no modal.
  - For Grow Max carts, add Nano Odor Max: "Keep your grow room smelling clean, +$12.99".
  - For Nano Odor Max carts, show Grow Max with a "Ships free" badge.
- Use the **Product Recommendations API** with `intent=complementary` (curated in the Search & Discovery app), rendered as a section:

```js
const url = `${root}recommendations/products?product_id=${productId}&limit=2&intent=complementary&section_id=cart-upsell`;
const html = await (await fetch(url)).text();
```

- Hide an upsell if adding it would trigger nothing useful, or if the item is already in the cart.
- Make the upsell the gap-closer for the shipping bar: "Add Odor Max ($12.99) → free shipping unlocked".
- Upsells must never block or delay the Checkout button. Render them after the core drawer content, and make them lazy.

### 2.7 Cart attributes and notes (holiday)

- **Gift message:** use a `note`, or `attributes[Gift message]`. Write it with `/cart/update.js { attributes: {...} }` on blur, not on every keystroke.
- **Private attributes:** prefix with `__`, for example `__utm_campaign` or `__popup_variant`. They're hidden from Liquid and the Ajax API but appear on the order, and they don't affect page caching. Use them for attribution.
- **Private line properties:** prefix with `_`, for example `_bundle_tier`, and filter them out in the cart UI.

---

## 3. High-converting DTC product page patterns (2025–2026)

### 3.1 Mobile above-the-fold order (Grow Max PDP)

1. **Announcement bar** (one line, static height): "Free shipping on Grow Max · 30-day money-back guarantee". Use real holiday shipping cutoffs in December.
2. **Gallery.** Image 1 shows both bottles together on clean white (the LCP image), with a visible thumbnail strip. Then:
   - an in-scale or hand shot,
   - a dosing chart image,
   - a before/after grow progression,
   - the label with the guaranteed analysis,
   - a UGC video poster (lazy).
3. **Title + review stars** ("★ 4.8 (1,240 reviews)"). Render from metafields; it's an anchor link to the reviews section. Baymard found **95% of users rely on reviews**, and **53% seek out negative ones**, so offer a rating-distribution filter.
4. **One-line outcome promise.** Plain language, substantiated (see §3.6).
5. **Price + compare-at + savings.** Add the **Shop Pay Installments** line below the price.
6. **Bundle selector** (§3.2).
7. **ATC button** (full width, at least 48 px tall) plus the dynamic checkout button.
8. **Trust row** of icons with text, not images of text:
   - Free shipping
   - 30-day money-back
   - Secure checkout
   - "Made in USA", only if true
9. **Benefit bullets** (3 or 4), then the below-the-fold sections.

**Below the fold, in order:**
1. How it works: the RootMax + GroMax roles.
2. How to use: a dosing table by growth stage, measured per gallon.
3. Results: UGC and before/after.
4. Comparison table.
5. Reviews.
6. FAQ.
7. Guarantee block.
8. Cross-sell Nano Odor Max.

Sources:
- [Baymard product page UX 2026](https://baymard.com/blog/current-state-ecommerce-product-page-ux)
- [Baymard: negative reviews](https://baymard.com/blog/respond-to-negative-user-reviews)
- [Baymard user reviews section benchmark](https://baymard.com/product-page/benchmark/page-designs/user-reviews-section)

### 3.2 Bundle and quantity-break selector with "Most Popular" anchoring

Present the tiers as radio cards (`<fieldset>` and `<input type="radio">`) so the selector is accessible and can be styled in pure CSS with `:has(:checked)`:

| Tier | Label | Price (illustrative, set by merchandising) | Badge |
|---|---|---|---|
| 1× Grow Max | "Try it" | $99.99 | |
| 2× Grow Max | "Most Popular" | $179.98 → save 10% | **Most Popular** (pre-selected) |
| 3× Grow Max | "Best Value / Full Season" | $254.97 → save 15% + free Nano Odor Max | Best Value |

**Implementation:**
- **Grow Max as one SKU** that combines RootMax and GroMax: use **Shopify Bundles** (native, inventory-synced), or a single product if fulfillment ships them together.
- **Tier discounts** come from **automatic discounts with minimum quantity 2 or 3**. The UI shows the computed price, and the cart and checkout apply the same rule, so they always agree.
- **Free gift on tier 3:** use a native "Buy X get Y" automatic discount, plus `/cart/add.js` adding the gift line.
- **Pre-selecting the middle tier** is a standard anchoring tactic. The single-unit price becomes the reference, and savings read as gains. Shopify brands commonly report 18 to 35% AOV gains from bundles and volume offers (vendor-reported).
- **Show per-unit price** ("$89.99 per kit") and the **savings in dollars**. Don't show percentages alone.
- **Subscription (optional):** a "Subscribe & save 10%, every 8 weeks" toggle through a selling plan (Shopify Subscriptions app). Grow cycles make this natural. Disclose renewal terms clearly next to the toggle, because state auto-renewal laws apply.

Sources:
- [Quantity breaks overview](https://oxify.app/blog/ultimate-guide-to-quantity-breaks)
- [Shopify product bundling (Shopify blog)](https://www.shopify.com/il/blog/product-bundling)
- [Bundle AOV examples](https://www.skailama.com/blog/product-bundling-strategies-shopify)

### 3.3 Sticky mobile ATC

- **Show it** when the main ATC is **out of view**, using an IntersectionObserver. **Hide it** when the main ATC, the footer or the cart drawer is visible.
- **Contents:** thumbnail, selected tier, price and an "Add to cart" button. It reuses the main form through the `form="product-form-{{ section.id }}"` attribute, so there's no duplicate state.
- **Layout:** respect `env(safe-area-inset-bottom)`. Don't cover the cookie banner or chat facade. Use a translate animation (compositor-only), with no animation under reduced motion.
- **Test it.** Published tests:
  - Clean Commit reported **+6.2% CVR** for AFTCO and **+16.4%** for a top-sticky variant.
  - Another bottom-sticky test showed **-7.7% CVR and -22% RPV** despite more add-to-carts.
  - Placement matters, so A/B test top versus bottom.

```js
const main = document.querySelector('[data-main-atc]');
const sticky = document.querySelector('sticky-atc');
new IntersectionObserver(([e]) => sticky.toggleAttribute('hidden', e.isIntersecting), { threshold: 0 }).observe(main);
```

Sources:
- [Clean Commit sticky mobile ATC test](https://cleancommit.io/ab-tests/sticky-mobile-add-to-cart-button/)
- [Top sticky test](https://cleancommit.io/ab-tests/top-mobile-sticky-add-to-cart/)
- [Bottom sticky negative result](https://cleancommit.io/ab-tests/mobile-bottom-sticky-add-to-cart-button/)
- [Blend Commerce test](https://blendcommerce.com/blogs/ab-tests-shopify/10-increase-in-conversion-rate)

### 3.4 Social proof, UGC, and before/after

- **UGC influence.** Sites with UGC report about 29% higher CVR (vendor data). Garden products are visual, so grow-progression photos are the strongest asset:
  - Day 0, 14 and 28.
  - Same plant variety and lighting.
  - Dated, and from real customers.
- **Before/after rules (FTC):**
  - Results must be typical, or carry a clear "results not typical" disclosure.
  - No AI-generated or staged comparisons presented as customer results.
- **Reviews (FTC rule effective Oct 21, 2024):**
  - No fake or AI reviews.
  - No incentives conditioned on positive sentiment.
  - No suppressing negative reviews.
  - Disclose insider reviews.
  - Penalties are up to about $52k per violation.
  - Show the real distribution, and respond publicly to negative reviews. Baymard found 37% of users factor in responses.
- **Holiday social proof:** "Gifted to 2,000+ growers this season" is fine **only if true and current**.

Sources:
- [FTC fake reviews rule summary (WSGR)](https://wsgr.com/en/insights/ftc-issues-final-rule-banning-fake-and-misleading-consumer-reviews-and-testimonials.html)
- [UGC data (Emplifi via Splitbase)](https://splitbase.com/blog/high-converting-product-page)

### 3.5 How-to-use, comparison table, FAQ, risk reversal, honest urgency

- **How to use:**
  - A dosing table (ml per gallon by stage: seedling, veg, flower), as an HTML table.
  - A 30–60 s video, lazy with a poster image.
  - This is high-intent content, and it's indexable.
- **Comparison table:** "Grow Max vs typical 3-part nutrient systems". Compare:
  - number of bottles,
  - mixing steps,
  - cost per gallon of feed,
  - root support included (Y/N).
  
  Use a real `<table>`. On mobile, use a sticky first column with horizontal scroll *inside* the table only. Don't name competitors without substantiation.
- **FAQ:** native `<details><summary>`, which needs no JS and is accessible. Questions to cover:
  - Hydro vs soil?
  - Is it safe for edibles?
  - How long does a kit last?
  - Can I combine it with Nano Odor Max?
  - Shipping and returns.
- **Risk reversal:**
  - "30-day money-back guarantee, even if the bottle's opened". Benchmark: AG1 runs a 90-day guarantee, limited to first-time subscribers.
  - Put it in a dedicated block near the ATC and again near the footer. Link to the policy page, and match it to `MerchantReturnPolicy` in the JSON-LD (§5.3).
- **Honest urgency:**
  - Real shipping cutoffs ("Order by Dec 17 for Christmas delivery, Ground"), computed from carrier calendars.
  - Real sale end dates (BFCM ends Mon Nov 30, 11:59 pm PT).
  - Real low-stock messages from `variant.inventory_quantity`, only below a true threshold.
  - **No fake timers, stock counters or "X people viewing"**. Shopify's Theme Store explicitly bans them, and they're FTC risk.

Sources:
- [Theme Store "must not mislead … fictitious countdown timers"](https://shopify.dev/docs/storefronts/themes/store/requirements)
- [AG1 guarantee terms](https://nutrola.app/en/blog/can-you-buy-ag1-without-a-subscription)
- [Grüns offer-stack landing pages](https://blog.funneloftheweek.com/p/the-secret-behind-gr-ns-99-landing-pages-offer-stack)
- [Grüns growth teardown](https://growthcurve.co/how-gruns-built-the-d2c-growth-machine-most-brands-are-pretending-to-have)

**Paid-social landing pages (the Grüns pattern):** Grüns runs 99+ landing pages per product line, each tailored to an avatar or pain point. For NanoGrow Max, build 3 or 4 PDP variants as **alternate product templates** (`product.landing-hydro.json`, `product.landing-firsttime.json`, `product.landing-odor.json`).
- Each has a different hero copy, gallery order and FAQ.
- All of them use the same sections, so performance stays identical.
- Point ad sets to `?view=landing-hydro`, or assign the template per product. Canonical tags keep SEO clean.

### 3.6 Claims compliance (category-specific; get counsel to review)

- **Nano Odor Max:**
  - "Eliminates odors" claims are fine.
  - "**Kills bacteria, germs, mold or viruses**" makes the product a *pesticide* under FIFRA, which requires EPA registration. EPA has fined brands (Crocs, VF Corp) for unregistered antimicrobial claims.
  - Substantiate any "nano" claims.
- **Grow Max:**
  - Plant nutrients are regulated at state level (fertilizer registration and guaranteed-analysis labeling).
  - Yield claims ("2× bigger harvest") need competent and reliable evidence (FTC).

Source: [Textile World: antimicrobial claims under FIFRA](https://www.textileworld.com/textile-world/dyeing-printing-finishing-2/2011/06/antimicrobial-claims-mold-and-mildew-prevention-subject-to-pesticide-regulation/)

---

## 4. Gamified email and SMS capture (spin, scratch, flip)

### 4.1 Benchmarks

**Conversion benchmarks vary a lot by source:**
- Spin-to-win: about 8–13% average, top decile around 30%.
- Standard discount popups: about 3–5%.
- Mobile popups convert higher than desktop (5.6% vs 2.9% in Wisepops' data).
- Use these to set expectations, not as guarantees.

**Ethics and legal framing:**
- Every slice wins. Show the odds. No cash prizes.
- The prize is a discount, which avoids sweepstakes and lottery issues. Confirm with counsel.

Sources:
- [Wisepops popup stats](https://wisepops.com/blog/popup-stats)
- [OptiMonk stats](https://www.optimonk.com/popup-statistics)
- [Popupbuilder on odds and consent](https://popupbuilder.io/gamified-popups/)

### 4.2 Google intrusive-interstitial rules (mobile)

- **Avoid:**
  - Popups that cover the main content immediately after a user lands from Search.
  - Standalone interstitials that must be dismissed before content is visible.
  - Above-the-fold layouts that look like interstitials.
- **Allowed:**
  - Legally required notices (cookie, age).
  - Login walls.
  - **Banners that use a reasonable amount of screen space.**
- **Scope:** the page-experience concern applies on the **entry page**. Popups that open after scrolling or engagement aren't the target.

**NanoGrow Max rules:**
1. **No popup on entry.** Show a small **teaser tab** ("🎁 Spin for a holiday gift") pinned bottom-left, under 15% of the viewport.
2. **Auto-open as a bottom sheet** (≤ 60% of the viewport height, content still visible above) when:
   - 50% scroll depth on the PDP, **or** 12 s of engagement, **or** the 2nd pageview, whichever comes first.
   - **Never** while the cart drawer is open, and **never** within 5 s of an add-to-cart.
3. **Suppress:**
   - on `/cart` and checkout,
   - for visitors from Klaviyo email or SMS (`utm_medium=email|sms`, or `_kx` present),
   - for known subscribers (a Klaviyo-identified cookie, or our own flag),
   - for 7 days after dismissal, and for 30 days after conversion.
4. **Exit intent on mobile is unreliable.** Use "fast scroll up near the top" or a back-button heuristic only as a secondary trigger. Never hijack the back button.
5. **Accessibility:**
   - Use `<dialog>` with focus trap and Escape-to-close, and a visible close button at least 44×44.
   - Provide a "No thanks" text link.
   - `prefers-reduced-motion` gets an instant reveal instead of the spin animation.
6. **Performance:** don't load the popup JS until the trigger fires, using `import('@theme/spin-popup')`. Reserve no layout space, since it's a fixed overlay.

Sources:
- [Google: Avoid intrusive interstitials](https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials)
- [Smashing Magazine explainer](https://www.smashingmagazine.com/2017/05/intrusive-interstitials-guidelines-avoid-google-penalty/)

### 4.3 Two-step flow (email first, then SMS)

1. **Step 1:** spin (or tap to scratch), then "You won 15% off! Enter your email to claim." Call the Klaviyo subscribe API with the email.
2. **Step 2:** "Want early access and an extra $5 off? Get texts." Phone field plus the TCPA disclosure. Call the Klaviyo subscribe API with the phone number. This step is optional and skippable.
3. **Success:**
   - Reveal the code with a copy button.
   - **Auto-apply** it with `/cart/update.js { discount }`, merging existing codes. Also store it in `localStorage` so it can be re-applied after the first ATC if the cart had no token yet.
   - Show "Applied at checkout ✓".
   - Also send the code by email (Klaviyo flow), so it survives device switches.

### 4.4 Klaviyo client Subscriptions API

**Request basics:**
- **Endpoint:** `POST https://a.klaviyo.com/client/subscriptions/?company_id=<PUBLIC_API_KEY>`. It's safe in the browser because it takes the public 6-character site ID, not a private key.
- **Headers:**
  - `Content-Type: application/vnd.api+json`
  - `Accept: application/vnd.api+json`
  - `revision: <pinned GA revision>`
- Recent GA revisions include `2026-01-15`, `2026-04-15` and `2026-07-15`. Pin one and test it; don't float. *(verify the current revision)*
- **Response:** `202 Accepted` with an empty body. Processing is asynchronous.

```js
// assets/klaviyo-subscribe.js
const KLAVIYO_PUBLIC_KEY = window.theme.klaviyoPublicKey; // from a theme setting
const KLAVIYO_REVISION = '2026-07-15';
const LIST_ID = window.theme.klaviyoPopupListId;

export async function klaviyoSubscribe({ email, phone, prize, source = 'Holiday Spin 2026' }) {
  const attributes = {
    ...(email && { email }),
    ...(phone && { phone_number: phone }),              // E.164, e.g. +15551234567
    properties: {                                       // custom profile properties
      popup_prize: prize,                               // "15% off"
      popup_variant: 'spin_v1',
      interest: document.body.dataset.productHandle ?? 'unknown', // grow-max | nano-odor-max
      landing_utm_campaign: new URLSearchParams(location.search).get('utm_campaign'),
    },
    subscriptions: {
      ...(email && { email: { marketing: { consent: 'SUBSCRIBED' } } }),
      ...(phone && { sms: { marketing: { consent: 'SUBSCRIBED' }, transactional: { consent: 'SUBSCRIBED' } } }),
    },
  };

  const res = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_PUBLIC_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
      revision: KLAVIYO_REVISION,
    },
    body: JSON.stringify({
      data: {
        type: 'subscription',
        attributes: {
          custom_source: source,                        // shows as consent source in Klaviyo
          profile: { data: { type: 'profile', attributes } },
        },
        relationships: { list: { data: { type: 'list', id: LIST_ID } } },
      },
    }),
  });
  if (res.status !== 202) throw new Error(`Klaviyo subscribe failed: ${res.status}`);
}
```

**Notes:**
- **Double opt-in:**
  - If the list is double opt-in, email consent stays pending until the subscriber confirms.
  - For a holiday push, **single opt-in** is common in the US, so decide deliberately.
  - SMS always gets Klaviyo's keyword or confirmation flow, depending on account settings.
- **Phone format:** valid E.164, with a country the sending number supports. If SMS age-gating is on, `age_gated_date_of_birth` is required, or the call returns 400.
- **Onsite tracking:**
  - Keep the Klaviyo app embed enabled. It's async and provides Active on Site, Viewed Product and identify.
  - **If you build your own popup, turn Klaviyo forms off** so the two don't double-fire.
  - Alternatively, use Klaviyo's native forms and skip the custom build. The tradeoff is less control over performance and design.
- **Flows:** trigger the welcome flow from "Added to list" (the popup list). Branch on `popup_prize` and `interest`.
- **Codes:** for abuse resistance, use Klaviyo **unique coupon codes**, synced to Shopify with expiry, in the welcome email. The on-site reveal can use a tier code (SPIN10 / SPIN15 / FREESHIP) set to "one use per customer" with an end date.
  - Never trust a client-side wheel outcome for high-value prizes. Anyone can call the API with any prize property.

Sources:
- [Klaviyo: Create Client Subscription](https://developers.klaviyo.com/en/reference/create_client_subscription)
- [Klaviyo: Collect email and SMS consent via API](https://developers.klaviyo.com/en/docs/collect_email_and_sms_consent_via_api)
- [Klaviyo changelog](https://developers.klaviyo.com/en/docs/changelog_)

### 4.5 SMS consent (TCPA) language

**The 2025–2026 legal state:**
- The FCC "one-to-one consent" rule was **vacated by the 11th Circuit on Jan 24, 2025**.
- **Prior express written consent** is still required for marketing texts.
- The FCC **revocation rule took effect Apr 11, 2025**:
  - Honor "stop", "cancel", "remove me" and any other reasonable opt-out within 10 business days.
  - Include opt-out instructions in marketing messages.
- State "mini-TCPA" and quiet-hours laws (for example Florida and Oklahoma) are the main litigation risk. Send between **8 am and 8 pm recipient-local time**.

**Disclosure** (place it directly under the phone field and above the submit button, in readable size and contrast):

> By submitting this form and signing up for texts, you consent to receive marketing text messages (e.g. promos, cart reminders) from NanoGrow Max at the number provided, including messages sent by autodialer. Consent is not a condition of purchase. Msg & data rates may apply. Msg frequency varies. Unsubscribe at any time by replying STOP or clicking the unsubscribe link (where available). Reply HELP for help. [Privacy Policy](/policies/privacy-policy) & [Terms](/policies/terms-of-service).

**Implementation rules:**
- No pre-checked SMS box. The submit button label must make the action clear ("Text me my extra $5").
- Log consent with `custom_source`, the timestamp (Klaviyo records it), the page URL and the disclosure version (a profile property such as `sms_disclosure_v`).

Sources:
- [Kelley Drye: 11th Cir. vacates 1:1 rule](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/eleventh-circuit-vacates-tcpa-11-consent-rule)
- [McGuireWoods TCPA updates](https://www.mcguirewoods.com/client-resources/alerts/2025/1/delayed-one-to-one-consent-rule-gives-companies-reprieve-plus-other-tcpa-updates/)
- [TCPA 2025 changes and quiet hours](https://www.omago.ai/blog/tcpa-2025-changes-quiet-hours-litigation-us)

### 4.6 Auto-applying the won code

```js
import { applyDiscount } from '@theme/cart';

export async function claimPrize(code) {
  localStorage.setItem('ngm_prize_code', code);
  const cart = await (await fetch(`${window.Shopify.routes.root}cart.js`)).json();
  const existing = (cart.discount_codes ?? []).map((d) => d.code).filter((c) => c !== code);
  const updated = await applyDiscount([...existing, code]);
  const ok = updated.discount_codes?.some((d) => d.code === code && d.applicable);
  return ok; // if !ok (e.g., empty cart / not combinable) show "Code saved — applies at checkout" and re-apply on next add
}
```

Fallback: `fetch('/discount/' + encodeURIComponent(code))` stores the code for checkout even when the cart is empty.

---

## 5. Shopify SEO

### 5.1 What Google supports as of October 2026

| Type | Status | Action |
|---|---|---|
| Product (merchant listings + product snippets) | **Supported** | Primary investment |
| Offer, AggregateRating, Review | Supported, as part of Product | Ratings must be visible on the page |
| MerchantReturnPolicy | Supported, at **Organization level** (`hasMerchantReturnPolicy`) or per offer | Declare once on Organization |
| ShippingService / OfferShippingDetails | Supported, at **Organization level** (`hasShippingService`) or per offer | Declare once on Organization |
| ProductGroup (variants) | Supported (`hasVariant`, `variesBy`, `productGroupID`) | Use for Nano Odor Max sizes |
| Organization / OnlineStore, WebSite (site name) | Supported | Homepage only |
| BreadcrumbList | Supported markup. Since Jan 23, 2025, Google shows breadcrumbs on desktop only; mobile shows the domain ([Google, Jan 2025](https://developers.google.com/search/blog/2025/01/simplifying-breadcrumbs)). | Low effort, keep it |
| VideoObject (+ Clip / SeekToAction key moments) | **Supported** | Use for how-to video; key moments need video ≥ 30 s |
| **FAQPage** | **FAQ rich results stopped appearing May 7, 2026.** Search Console reports were removed in June 2026 and API support in August 2026. Restricted to government and health sites since Aug 2023. | Keep visible FAQs for users and AI answers. Markup is harmless but brings no SERP feature. |
| **HowTo** | **Deprecated.** Removed from mobile Aug 2023 and from desktop Sep 13, 2023. | Don't bother |
| Sitelinks search box (`WebSite` + `SearchAction`) | Discontinued from Nov 21, 2024 ([SEJ](https://searchenginejournal.com/google-removes-sitelinks-search-box-documentation/533973)) | Omit |
| Seven types phased out June 2025 (Book Actions, Course Info, ClaimReview, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing) | Deprecated | Not relevant |

Sources:
- [Google: simplifying search results (June 12, 2025)](https://developers.google.com/search/blog/2025/06/simplifying-search-results)
- [Google: HowTo/FAQ changes (Aug 2023)](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [FAQ rich results end, May 7 2026 (TechWyse)](https://www.techwyse.com/news/ai-search/google-faq-rich-results-deprecated-2026)
- [SEJ coverage](https://www.searchenginejournal.com/google-drops-faq-rich-results/574429/)
- [Google merchant listing docs](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)
- [Return policy docs](https://developers.google.com/search/docs/appearance/structured-data/return-policy)
- [Shipping policy (ShippingService) docs](https://developers.google.com/search/docs/appearance/structured-data/shipping-policy)
- [Video structured data](https://developers.google.com/search/docs/appearance/structured-data/video)

### 5.2 Product JSON-LD (hand-built)

Shopify's `{{ product | structured_data }}` filter outputs Product, or ProductGroup when variants exist. It's a fine baseline, but it **omits aggregateRating, shipping and returns**. Build our own, and **don't output both**, because duplicate Product entities confuse validation.

```liquid
{%- comment -%} snippets/jsonld-product.liquid — render once in main-product section {%- endcomment -%}
{%- liquid
  assign v = product.selected_or_first_available_variant
  assign rating = product.metafields.reviews.rating.value
  assign rating_count = product.metafields.reviews.rating_count.value
-%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": {{ canonical_url | append: '#product' | json }},
  "name": {{ product.title | json }},
  "description": {{ product.description | strip_html | strip_newlines | truncate: 4900 | json }},
  "url": {{ canonical_url | json }},
  "image": [
    {%- for image in product.images limit: 6 -%}
      {{ image | image_url: width: 1600 | prepend: 'https:' | json }}{% unless forloop.last %},{% endunless %}
    {%- endfor -%}
  ],
  "brand": { "@type": "Brand", "name": {{ product.vendor | json }} },
  {%- if v.sku != blank %}"sku": {{ v.sku | json }},{% endif %}
  {%- if v.barcode != blank %}"gtin": {{ v.barcode | json }},{% endif %}
  {%- if rating_count > 0 %}
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": {{ rating.rating | json }},
    "bestRating": {{ rating.scale_max | json }},
    "worstRating": {{ rating.scale_min | json }},
    "ratingCount": {{ rating_count | json }}
  },
  {%- endif %}
  "offers": {
    "@type": "Offer",
    "url": {{ request.origin | append: v.url | json }},
    "priceCurrency": {{ cart.currency.iso_code | json }},
    "price": "{{ v.price | divided_by: 100.0 }}",
    "availability": "https://schema.org/{% if v.available %}InStock{% else %}OutOfStock{% endif %}",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": { "@id": {{ shop.url | append: '/#organization' | json }} }
  }
}
</script>
```

**Rules:**
- The price, availability and rating in the JSON-LD must **match what's visible on the page**.
- `availability` must be a full schema.org URL.
- For quantity-break tiers, keep the Offer at the single-unit price. Tier pricing is shown in the UI but isn't the product's list price.
- **Nano Odor Max** has several sizes, so use `ProductGroup`:
  - `productGroupID`
  - `variesBy: ["https://schema.org/size"]`
  - `hasVariant: [Product…]`, each variant with its own Offer at $12.99 to $39.99
  
  Don't use `AggregateOffer` for merchant listings.
- `aggregateRating` only from genuine, on-site reviews. Omit it when the count is 0.
- Validate with the Rich Results Test and Search Console's Merchant listings report. Also link **Google Merchant Center** through the Google & YouTube app for free listings.

### 5.3 Organization JSON-LD (homepage only) with return and shipping policies

```liquid
{%- if request.page_type == 'index' -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "@id": {{ shop.url | append: '/#organization' | json }},
  "name": {{ shop.name | json }},
  "url": {{ shop.url | json }},
  "logo": {{ settings.logo | image_url: width: 512 | prepend: 'https:' | json }},
  "sameAs": ["https://www.instagram.com/…", "https://www.tiktok.com/@…", "https://www.facebook.com/…"],
  "hasMerchantReturnPolicy": {
    "@type": "MerchantReturnPolicy",
    "applicableCountry": "US",
    "returnPolicyCountry": "US",
    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
    "merchantReturnDays": 30,
    "returnMethod": "https://schema.org/ReturnByMail",
    "returnFees": "https://schema.org/FreeReturn"
  },
  "hasShippingService": {
    "@type": "ShippingService",
    "name": "Free US shipping on all orders",
    "shippingConditions": {
      "@type": "ShippingConditions",
      "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" },
            "shippingRate": { "@type": "MonetaryAmount", "value": 0, "currency": "USD" },
      "transitTime": { "@type": "ServicePeriod", "duration": { "@type": "QuantitativeValue", "minValue": 3, "maxValue": 6, "unitCode": "DAY" } }
    }
  }
}
</script>
<script type="application/ld+json">
{ "@context": "https://schema.org", "@type": "WebSite", "name": {{ shop.name | json }}, "url": {{ shop.url | json }} }
</script>
{%- endif -%}
```

- The `ShippingService` property names follow Google's 2025 shipping-policy docs. **Validate in the Rich Results Test** before launch *(verify)*.
- If validation is awkward, put per-offer `shippingDetails` (`OfferShippingDetails` with `shippingRate`, `shippingDestination` and `deliveryTime`) on the Product instead.
- Keep the policy values identical to the `/policies/refund-policy` page and to Merchant Center settings.

Sources:
- [Product schema fields that matter](https://www.anglera.com/blog/product-schema-fields-that-matter)
- [ProductGroup guide](https://www.magstags.com/notes/product-vs-productgroup-schema/)
- [Shopify `structured_data` filter](https://shopify.dev/docs/api/liquid/filters/structured_data)

### 5.4 BreadcrumbList, VideoObject

- **BreadcrumbList:** Home › Grow Max, or Home › Collection › Product. Always use the `/products/` URL as the final item.
- **VideoObject** for the how-to video. Fields:
  - `name`, `description`, `thumbnailUrl`, `uploadDate`, `duration`, and `contentUrl` or `embedUrl`.
  - `hasPart` `Clip`s for the steps (Mix → Feed → Flush) to get key moments.

### 5.5 Canonicals, URLs and duplicate paths

- Shopify outputs `{{ canonical_url }}`, which points `/collections/x/products/y` to `/products/y`. **Still link to `/products/y` everywhere:** use `{{ product.url }}` and **never** `{{ product.url | within: collection }}` in cards, so crawl budget and link equity aren't split.
- **Alternate templates** (`?view=landing-hydro`) inherit the canonical to `/products/grow-max`, so ad landing variants don't create duplicates.
- **Filter and sort parameters** on collections: the canonical goes to the clean collection URL. Don't let faceted URLs be linked internally.
- **Don't add `noindex`** to `/collections/all` blindly. Make it useful, or keep it out of nav.

Sources:
- [Tenten: Shopify duplicate content](https://tenten.co/shopify/shopify-duplicate-content-fix/)
- [Shopify community redirect thread](https://community.shopify.com/t/how-to-properly-301-redirect-collections-products-to-products-in-shopify/581291)

### 5.6 On-page

- **Title (about 50–60 characters):** "Grow Max Plant Nutrient Kit: RootMax + GroMax | NanoGrow Max".
- **Meta description (about 140–155 characters):** a benefit, a proof point and the offer, for example "Free shipping. 30-day guarantee." Set it in product SEO fields, not in theme code.
- **One `<h1>` per page**, which is the product title. Section headings go in order (h2, then h3). Theme Store rules also require h1–h6 to be visually distinct.
- **Alt text:** describe the image ("Grow Max kit: RootMax and GroMax 1 L bottles side by side"). Required by the Theme Store (`image.alt`). Empty `alt=""` is only for purely decorative images.
- **Internal linking:**
  - PDP cross-links (Grow Max ↔ Nano Odor Max).
  - A blog or guides hub ("Hydro feeding schedule", "How to get rid of grow tent smell") that links to the PDPs with descriptive anchors.
  - Collection intro copy above the grid.
- **Open Graph and Twitter cards** are required for the Theme Store, and matter for paid social and share previews. Use `og:image` at 1200×630 from the product featured image.
- **Page speed and ranking:** Google says Core Web Vitals "are used by our ranking systems", but that good scores don't guarantee top rankings, and relevance dominates. The speed work in §1 pays off mostly through **conversion**, and secondarily through SEO.

Source: [Google page experience](https://developers.google.com/search/docs/appearance/page-experience)

---

## 6. Accessibility and mobile UX

### 6.1 Tap targets and basics

- **Requirement:** the Theme Store requires at least **24×24 CSS px** (WCAG 2.2 SC 2.5.8, AA).
- **Our standard:** **≥ 44×44** for all controls (Apple HIG 44 pt, Material 48 dp, WCAG AAA 2.5.5). Primary CTAs are 48–56 px tall and full-width on mobile.
- **Contrast:** at least 4.5:1 for body text, and 3:1 for large text, icons and borders. The sale price and badges must pass too.
- **Selectors:** tier and size selectors are `<fieldset>` + `<legend>` + radio inputs, never a `<div>` with click handlers. Price updates are announced politely.
- **Focus:** visible focus on everything (`:focus-visible`). The cart drawer and popup are `<dialog>` elements with `showModal()`, which give focus trapping and Escape for free. Focus returns to the trigger on close.
- **Keyboard:** the whole flow works by keyboard, including the gallery (arrow keys) and accordions (native `<details>`).
- **Forms:** labels have `for`/`id` pairs, and `autocomplete="email"` / `autocomplete="tel"`. Use `inputmode="tel"` and `type="email"` for mobile keyboards.

Sources:
- [Theme Store accessibility requirements](https://shopify.dev/docs/storefronts/themes/store/requirements)
- [WCAG 2.5.8 explainer](https://wcag.dock.codes/documentation/wcag258)

### 6.2 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

In JS, check `matchMedia('(prefers-reduced-motion: reduce)').matches` before running the spin wheel, counters, auto-advancing carousels or autoplay video. **No autoplaying carousels** on the PDP.

### 6.3 Scroll-driven reveal animations: CSS first, IntersectionObserver fallback

**Support (Oct 2026):**
- `animation-timeline` / `view()` works in Chrome and Edge 115+ and **Safari 26+**.
- **Firefox** still has it behind a flag in stable (it's an Interop 2026 focus).
- Global support is about 83%. Use `@supports` plus an IntersectionObserver fallback.

**Animate only `opacity` and `transform`**, which run on the compositor and don't trigger layout. **Never** hide above-the-fold content waiting for an animation, because that delays LCP.

```css
.reveal { opacity: 1; transform: none; } /* default: visible (no-JS, reduced motion) */

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .reveal {
      animation: reveal-up linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 40%;
    }
  }
  @supports not (animation-timeline: view()) {
    .reveal.js-pending { opacity: 0; transform: translateY(16px); transition: opacity .4s ease, transform .4s ease; }
    .reveal.is-visible { opacity: 1; transform: none; }
  }
}
@keyframes reveal-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
```

```js
// Fallback only where CSS scroll timelines are unsupported
if (!CSS.supports('animation-timeline: view()') && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -10% 0px' });
  els.forEach((el) => {
    if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('js-pending'); io.observe(el); } // never hide in-viewport content
  });
}
```

Sources:
- [Scroll-driven animations cross-browser status 2026](https://www.buildmvpfast.com/blog/css-scroll-driven-animations-replace-js-2026)
- [animation-timeline support](https://www.cssportal.com/css-properties/animation-timeline.php)

### 6.4 Number counters ("1,240 growers", "30-day guarantee")

- **Server-render the final number in HTML.** That's good for SEO, no-JS and screen readers. Animate only visually.
- **Reserve the width** with `font-variant-numeric: tabular-nums` and `min-width: <n>ch` to avoid CLS.
- **Start on intersection.** Animate with `requestAnimationFrame` (about 800 ms, easeOut) and write `textContent` once per frame. No `setInterval`, and no layout reads inside the loop.
- **Accessibility:** set `aria-hidden="true"` on the animating span, with a visually hidden final value next to it, or no animation at all under reduced motion.
- **CSS-only alternative** (Chromium and Safari): register an `@property --n { syntax: '<integer>'; }` and use `counter-reset: n var(--n)` with `content: counter(n)` in a transition. It needs no JS, but keep the real number in the DOM.

```js
export function countUp(el, to, ms = 800) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = to.toLocaleString(); return; }
  const start = performance.now(), fmt = new Intl.NumberFormat();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / ms), eased = 1 - Math.pow(1 - t, 3);
    el.textContent = fmt.format(Math.round(to * eased));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
```

### 6.5 Mobile layout specifics

- Account for `100dvh` and `env(safe-area-inset-*)` for the sticky ATC, popup sheet and drawer.
- Announcement and header heights are fixed in CSS. **Never** inject a bar above the header after load (CLS).
- Inputs are at least 16 px in font size, so iOS doesn't zoom on focus.
- Horizontal scroll happens only inside explicit containers (gallery, comparison table), never on the page.

---

## 7. Build checklist (must-dos)

### Performance
- [ ] `theme.liquid`: critical CSS, the font preload and module scripts sit **above** `{{ content_for_header }}`. `content_for_header` is a plain tag inside `<head>`.
- [ ] The PDP gallery image and the landing hero use `image_tag` with `loading:'eager'`, `fetchpriority:'high'`, `preload:true`, 4 to 6 `widths` and a correct `sizes`. **Only one** image per page is preloaded.
- [ ] Every other image is `loading:'lazy'` with `sizes:'auto'`. Thumbnail strip, no dots-only galleries. Carousel slides after the first are injected on demand.
- [ ] No `background-image` heroes. Every image has width and height (automatic through `image_tag`).
- [ ] System font body. At most one display family in woff2 with `font-display: swap`, a preload guarded by `.system?`, and tuned fallback metrics.
- [ ] Zero jQuery and zero frameworks. Custom elements, ES modules through an import map (no extra es-module-shims), `import()` on interaction or visibility.
- [ ] The cart drawer, popup, reviews widget and chat are lazy. Drawer DOM is fetched with `?sections=cart-drawer` on first open.
- [ ] Event handlers are debounced or passive, and long work yields with `scheduler.yield()` plus a fallback.
- [ ] `<script type="speculationrules">` prerenders `[data-instant-navigation]` at `moderate`, excluding cart, checkout and account. Analytics are prerender-safe.
- [ ] `@view-transition` is opt-in, limited to product image morphs, skipped on reduced motion, and cancelled on interaction.
- [ ] App audit: **only app embeds, app blocks and web pixels** (script tags end Oct 1, 2026 / Mar 1, 2027). Review stars come from `reviews.*` metafields in Liquid. Space is reserved for above-the-fold app blocks.
- [ ] Budgets enforced in CI with Lighthouse CI (home, PDP, collection; mobile) and Theme Check. Mobile PDP Lighthouse ≥ 80, A11y ≥ 95.
- [ ] Field monitoring (CrUX or web-vitals RUM) with targets p75 LCP ≤ 2.0 s, INP ≤ 150 ms, CLS ≤ 0.05.
- [ ] QA in the Instagram, Facebook and TikTok webviews (iOS and Android) and on a mid-tier Android over 4G.

### Cart and checkout
- [ ] `/cart/add.js` and `/cart/change.js` (line **key**) send `sections` (≤ 5) and `sections_url`. Optimistic render with rollback on 422. Mutations are serialized.
- [ ] `Shopify.actions.updateCart.configure()` is registered above `content_for_header`, so app cart updates re-render the drawer without a reload.
- [ ] Theme dispatches `shopify:product:view` and `shopify:cart:*` events.
- [ ] The drawer has a free-shipping bar (threshold in theme settings, matching the shipping rule), 1 or 2 complementary upsells, and **accelerated checkout buttons** with reserved height and CSS custom-property styling.
- [ ] PDP has `payment_button` and `payment_terms` (Shop Pay Installments).
- [ ] The discount field uses `/cart/update.js { discount }` and merges existing codes. Shows `applicable:false` messaging. `/discount/CODE?redirect=` is used for email, SMS and ads links.
- [ ] Gift note and cart attributes are written on blur. Attribution goes in `__private` attributes.

### Product page CRO
- [ ] Above the fold on mobile: gallery, title, stars (linked to reviews), outcome line, price and installments, bundle selector, ATC, trust row.
- [ ] Three-tier selector (Most Popular pre-selected) backed by **native automatic discounts**. Per-unit price and dollar savings shown. Grow Max sold as a Shopify Bundle.
- [ ] Sticky mobile ATC appears when the main ATC leaves the viewport, and it's **A/B tested** (top vs bottom).
- [ ] Sections: how it works, dosing table, UGC and before/after (real, dated, typical-results disclosure), comparison table, filterable reviews, FAQ with `<details>`, guarantee block, Odor Max cross-sell.
- [ ] Honest urgency only: real carrier cutoffs, real sale end dates, real low stock. No fake timers or viewer counters.
- [ ] Claims reviewed: no "kills bacteria/germs" for Nano Odor Max unless EPA-registered. Yield claims substantiated. Fertilizer labeling complies with state rules.
- [ ] Ad landing variants are alternate product templates (`?view=`) and inherit the canonical.

### Popup and capture
- [ ] No entry interstitial. The teaser tab is under 15% of the viewport. The bottom sheet opens after 50% scroll, 12 s or the 2nd pageview. Suppressed on cart and checkout, for email or SMS traffic, and for subscribers. 7-day and 30-day frequency caps.
- [ ] `<dialog>` with focus trap, Escape, a 44 px close button and a "No thanks" link. The reduced-motion version doesn't spin.
- [ ] Email step, then an optional SMS step, through the Klaviyo **client Subscriptions API** with a pinned `revision`, `custom_source`, the list relationship, and custom `properties` (`popup_prize`, `interest`, `sms_disclosure_v`).
- [ ] TCPA disclosure sits under the phone field. No pre-checked boxes. Sends only between 8 am and 8 pm local. STOP and other reasonable opt-outs are honored.
- [ ] Prize code auto-applied with `/cart/update.js` and stored for re-apply. Codes are one-use-per-customer with real expiry. Unique codes go in the welcome email.
- [ ] Klaviyo onsite JS kept as an app embed for tracking. Klaviyo forms disabled if the custom popup is used.

### SEO
- [ ] One hand-built Product JSON-LD per PDP. Nano Odor Max uses ProductGroup with variants. Prices, availability and ratings match the visible page. No duplicate `structured_data` output.
- [ ] Homepage OnlineStore/Organization with `hasMerchantReturnPolicy` (30 days, free returns) and `hasShippingService` (free on all orders), matching the policy pages and Merchant Center. WebSite site-name markup.
- [ ] BreadcrumbList. VideoObject with Clips for the how-to video. FAQ content visible, but **no expectation of FAQ rich results** (ended May 7, 2026). No HowTo markup.
- [ ] All product links use `{{ product.url }}`, never `within: collection`. `canonical_url` is in the head.
- [ ] Titles about 55 characters, meta descriptions about 150. One h1. Descriptive alt text on every product image. OG and Twitter tags with a 1200×630 image.
- [ ] Guides hub (feeding schedules, grow-room odor) internally linked to the PDPs. Merchant Center connected for free listings.

### Accessibility and motion
- [ ] Tap targets ≥ 44×44 (the hard minimum is 24×24). Contrast ≥ 4.5:1. Visible `:focus-visible`. Radio-based selectors. Labeled inputs with `autocomplete`. 16 px input font.
- [ ] Global `prefers-reduced-motion` reset. JS animation checks honor it. No autoplay carousels.
- [ ] Scroll reveals use CSS `animation-timeline: view()` under `@supports`, with an IntersectionObserver fallback. Only `opacity` and `transform` are animated. In-viewport content is never hidden.
- [ ] Counters are server-rendered with the final value, use tabular-nums with reserved width, animate with rAF on intersection, and are hidden from assistive tech while animating.

### Holiday 2026 operations
- [ ] Code freeze **Fri Nov 13, 2026**. BFCM is **Nov 26–30**. Discount schedules are pre-built with start and end times. Load-test the drawer and popup.
- [ ] Carrier holiday cutoffs are configured as data (theme settings or a metaobject), not hard-coded strings. A post-cutoff message switches to "Arrives after Dec 25, gift a digital card" if offered.
