#!/usr/bin/env node
/**
 * Builds the two Looper free-sample landers as single, self-contained HTML
 * files (same format as the Looperverse Giveaway page): markup, CSS, JS and
 * images all inside one index.html, ready to upload to looperverse.com.
 *
 *   node campaigns/looper-free-samples/build.mjs
 *
 * Output:
 *   public/looper/free-duos/index.html    → upload as looperverse.com/free-duos/
 *   public/looper/free-fusion/index.html  → upload as looperverse.com/free-fusion/
 *
 * Copy lives in products.mjs, styles in src/styles.css, behaviour in
 * src/client.js. Images come from ./assets (run fetch-assets.mjs to refresh).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { products, SHIP_STATES } from "./products.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT_DIR = path.join(ROOT, "public/looper");

const css = await fs.readFile(path.join(HERE, "src/styles.css"), "utf8");
const clientJs = await fs.readFile(path.join(HERE, "src/client.js"), "utf8");
const dataUri = async (file) =>
  `data:image/webp;base64,${(await fs.readFile(path.join(HERE, "assets", file))).toString("base64")}`;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const money = (n) => `$${n.toFixed(2)}`;

/** Escape copy, then swap in live-updating tokens (the page re-fills them from CONFIG). */
function fill(text, p) {
  return esc(text)
    .replace(/\{retail\}/g, `<span data-retail>${money(p.retail)}</span>`)
    .replace(/\{supply\}/g, `<span data-supply>${p.supply}</span>`)
    .replace(/\{stateCount\}/g, `<span data-state-count>${SHIP_STATES.length}</span>`)
    .replace(/\{states\}/g, `<span data-ship-states>${esc(SHIP_STATES.join(", "))}</span>`);
}

function marquee(p) {
  const run = p.marquee.map((m) => `<span>${fill(m, p)}</span> <i>✦</i>`).join(" ");
  return `<span>${run}</span>\n      <span>${run}</span>`;
}

const lede = (p) =>
  p.lede
    .map(([kind, t]) => (kind === "b" ? `<b>${esc(t)}</b>` : kind === "m" ? `<b class="m">${esc(t)}</b>` : esc(t)))
    .join("");

async function render(p) {
  const group = await sharp(path.join(HERE, "assets", `${p.id}-group.webp`)).metadata();
  const imgVars = [
    `--group-ar:${group.width}/${group.height}`,
    `--logo:url("${await dataUri("looperverse-logo.webp")}")`,
    `--group:url("${await dataUri(`${p.id}-group.webp`)}")`,
    ...(await Promise.all(p.flavors.map(async (f) => `--f-${f.slug}:url("${await dataUri(`${p.id}-${f.slug}.webp`)}")`))),
  ];

  const config = {
    KLAVIYO_COMPANY_ID: "RwbMFF",
    KLAVIYO_LIST_ID: "",
    KLAVIYO_EVENT: p.eventName,
    KLAVIYO_SOURCE: `Looper Free Sample LP: ${p.shortName}`,
    CHECKOUT: Object.fromEntries(
      p.flavors.map((f) => [f.slug, `https://looperverse.com/checkout/?PLACEHOLDER=${p.id}-${f.slug}`]),
    ),
    RETAIL: p.retail,
    SUPPLY: p.supply,
    LEFT: null,
    SOLD_OUT: false,
    SOLD_OUT_FLAVORS: [],
    END: "",
    PASS_UTM: true,
    CAPTURE_TIMEOUT_MS: 2500,
  };
  const checkoutLines = p.flavors
    .map((f) => `    '${f.slug}': '${config.CHECKOUT[f.slug]}',   // ${f.name} (retail variation ${f.variationId})`)
    .join("\n");

  const product = {
    id: p.id,
    fullName: p.fullName,
    shortName: p.shortName,
    unit: p.unit,
    unitPlural: `${p.unit}s`,
    sampleKey: p.sampleKey,
    productUrl: p.productUrl,
    flavors: p.flavors.map(({ slug, name, note, glow, strain }) => ({ slug, name, note, glow, ...(strain ? { strain } : {}) })),
  };

  const tiles = p.flavors
    .map(
      (f) => `            <input type="radio" name="flavor" id="f-${f.slug}" value="${f.slug}">
            <label for="f-${f.slug}" style="--img:var(--f-${f.slug});--glow:${f.glow}99"><span class="ph" aria-hidden="true"></span><b>${esc(f.name)}</b>${f.strain ? `<em>${esc(f.strain)}</em>` : ""}</label>`,
    )
    .join("\n");

  const flavorCards = p.flavors
    .map(
      (f) => `        <article class="fcard rv" style="--img:var(--f-${f.slug});--glow:${f.glow}55">
          <div class="art" role="img" aria-label="${esc(`${p.fullName}, ${f.name}`)}"></div>
          <div class="txt">
            <h3>${esc(f.name)}</h3>
            ${f.strain ? `<span class="strain">${esc(f.strain)}</span>` : ""}
            <p>${esc(f.note)}</p>
            <a class="pill" href="#claim" data-pick="${f.slug}">Claim<span class="xs-hide">&nbsp;This Flavor</span> <span aria-hidden="true">→</span></a>
          </div>
        </article>`,
    )
    .join("\n");

  const specs = p.specs.map(([b, s]) => `<li><b>${esc(b)}</b><span>${esc(s)}</span></li>`).join("");
  const stats = p.stats
    .map(([b, s]) => `<div class="stat"><b>${esc(b)}</b><span>${esc(s)}</span></div>`)
    .join("\n          ");
  const steps = p.steps
    .map(
      ([h, body, tag], i) =>
        `<div class="step rv"><div class="n">0${i + 1}</div><h3>${esc(h)}</h3><p>${fill(body, p)}</p><span class="tag">${fill(tag, p)}</span></div>`,
    )
    .join("\n        ");
  const faq = p.faq
    .map(([q, a]) => `<details class="rv"><summary>${esc(q)}</summary><p>${fill(a, p)}</p></details>`)
    .join("\n        ");
  const first = p.flavors[0];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<meta name="robots" content="noindex">
<meta property="og:type" content="website">
<meta property="og:url" content="${p.pageUrl}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:image" content="${p.ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#000000">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="https://looperverse.com/wp-content/uploads/2025/09/cropped-LOOPER-LOGO-GRAFFITI-STYLE-01_lowres-e1757701238783.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://a.klaviyo.com">
<!-- Fallbacks only. The real brand fonts below load when this page is served from looperverse.com (their font files send no CORS header). -->
<link href="https://fonts.googleapis.com/css2?family=League+Gothic&family=Unbounded:wght@700;800;900&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  /* Images, embedded so the page is one file: looperverse wordmark, ${p.shortName} group render and one shot per flavor (sources: looperverse.com product pages) */
  :root{${imgVars.join(";")}}
${css}</style>
</head>
<body>
<canvas id="stars" aria-hidden="true"></canvas>
<div class="static" aria-hidden="true"></div>
<div class="scan" aria-hidden="true"></div>

<div class="page">
  <div class="ann" role="region" aria-label="Announcement">
    <span class="ann-tag">Free Sample</span>
    <div class="ann-track"><div class="ann-run" aria-hidden="true">
      ${marquee(p)}
    </div></div>
  </div>

  <header>
    <div class="nav">
      <a class="logo" href="https://looperverse.com" aria-label="Looper home">
        <span class="lv-logo" role="img" aria-label="looperverse"></span>
      </a>
      <a class="pill" href="#claim" data-claim-link>Claim Free</a>
    </div>
  </header>

  <main>
    <!-- ================= HERO + CLAIM ================= -->
    <div class="hero" id="top">
      <div class="hero-copy">
        <div class="welcome">${esc(p.welcome)}</div>
        <h1>
          <span class="prod-name ${p.nameSize} glitch jitter" data-text="${esc(p.name.toUpperCase())}">${esc(p.name)}</span>
          <span class="h-give">Free <em>Sample</em>//</span>
        </h1>
        <div class="hero-art"><div class="art" role="img" aria-label="${esc(p.groupAlt)}"></div></div>
        <p class="lede">${lede(p)}</p>
        <div class="stats">
          ${stats}
        </div>
        <div class="supply">
          <span class="supply-line" id="supplyLine">Only <b data-supply>${p.supply}</b>&nbsp;free ${p.unit}s in this drop · 1 per person</span>
          <span class="meter" id="supplyMeter" hidden><i></i></span>
        </div>
        <div class="cd-wrap" id="cdWrap" hidden>
          <div class="cd-label">Offer ends in</div>
          <div class="countdown" aria-label="Time left to claim">
            <div><b id="cd-d">--</b><span>Days</span></div>
            <div><b id="cd-h">--</b><span>Hrs</span></div>
            <div><b id="cd-m">--</b><span>Min</span></div>
            <div><b id="cd-s">--</b><span>Sec</span></div>
          </div>
        </div>
      </div>

      <!-- ===== claim card ===== -->
      <div class="hero-card">
      <div class="card" id="claim">
        <form id="claimForm" novalidate>
          <div class="card-head">
            <h2 class="slash-title">Claim//</h2>
            <span class="live">Live</span>
          </div>
          <span class="outline">${esc(p.pickTitle)}</span>
          <div class="returning" id="returning" hidden></div>

          <div class="lbl" id="flavLbl">Choose your flavor</div>
          <div class="flav-grid" id="flavGrid" role="radiogroup" aria-labelledby="flavLbl">
${tiles}
          </div>
          <p class="pick-note" id="pickNote" aria-live="polite">${esc(p.pickHint)}</p>

          <div class="row2">
            <div class="field">
              <label class="lbl" for="email">Email</label>
              <input class="inp" id="email" name="email" type="email" placeholder="you@email.com" autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false" enterkeyhint="go" required>
            </div>
            <div class="field">
              <label class="lbl" for="state">Ship to state</label>
              <select class="inp" id="state" name="state" required autocomplete="address-level1"><option value="">Select…</option></select>
            </div>
          </div>

          <input type="text" name="website" id="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;opacity:0" aria-hidden="true">

          <label class="check" for="agree">
            <input type="checkbox" id="agree" required>
            <span><strong>I'm 21 or older</strong> and I'm in for Looper emails about drops and deals (unsubscribe anytime). I agree to the <a href="https://looperverse.com/terms-of-service/" target="_blank" rel="noopener">Terms</a>, <a href="https://looperverse.com/privacy-policy-2/" target="_blank" rel="noopener">Privacy Policy</a> and <a href="#details">Offer Details</a>.</span>
          </label>

          <div class="summary" aria-label="What you pay">
            <div><span>${esc(p.shortName)} ${esc(p.unit)} <i id="sumFlavor"></i></span><span><s data-retail>${money(p.retail)}</s><b class="free">Free</b></span></div>
            <div><span>Shipping</span><span class="ship">At checkout</span></div>
          </div>
          <button class="cta" type="submit" id="submitBtn">Claim My ${esc(p.claimUnit)} <span class="arr" aria-hidden="true">→</span></button>
          <div class="msg" id="formMsg" role="alert"></div>
          <div class="trust"><span>Lab Tested</span><span>21+ Only</span><span>1 Per Person</span></div>
          <p class="fine">The product is free. You just cover shipping, shown at checkout. One free sample per person and household while supplies last. Ships only to the states in the <a href="#details">Offer Details</a>.</p>
        </form>

        <!-- ===== success: on the way to checkout ===== -->
        <div class="success" id="successBox" aria-live="polite">
          <div class="welcome">Locked in</div>
          <div class="lock-art" id="lockArt" style="--img:var(--f-${first.slug})" role="img" aria-label="Your flavor"></div>
          <h3><span id="successFlavor">${esc(first.name)}</span>//</h3>
          <p id="successText">Taking you to checkout. Your ${esc(p.unit)} is <b>$0</b>, you just cover shipping.</p>
          <div class="redirect-bar" id="redirectBar"><i></i></div>
          <a class="cta" id="checkoutBtn" href="#">Continue to Checkout <span class="arr" aria-hidden="true">→</span></a>
          <div class="preview" id="previewNote" hidden></div>
          <button class="pill ghost" type="button" id="changeBtn">Pick a different flavor</button>
        </div>

        <!-- ===== closed: sold out or past CONFIG.END ===== -->
        <div class="closed" id="closedBox" hidden>
          <div class="welcome">Drop closed</div>
          <h3>All <span data-supply>${p.supply}</span> free ${esc(p.unit)}s are claimed//</h3>
          <p>Thanks for the love. ${esc(p.shortName)} is still in the shop, and Looper drops new deals by email all the time.</p>
          <a class="cta" href="${p.productUrl}">Shop ${esc(p.shortName)} <span class="arr" aria-hidden="true">→</span></a>
        </div>
      </div>
      </div>
    </div>

    <!-- ================= FEATURED ON ================= -->
    <div class="featured" aria-label="As featured on">
      <span class="kicker">As Featured On</span>
      <div class="logos" id="logos"></div>
    </div>

    <!-- ================= WHAT YOU GET ================= -->
    <section id="product">
      <div class="sec-head rv">
        <h2 class="slash-title">What You Get//</h2>
        <span class="outline">${esc(p.tagline)}</span>
      </div>
      <article class="grand rv">
        <div>
          <span class="tier">Free Sample</span>
          <h3>${esc(p.fullName)}</h3>
          <p class="about">${esc(p.about)}</p>
          <ul class="specs">${specs}</ul>
          <div class="foot">
            <span class="kicker">Retail <s data-retail>${money(p.retail)}</s> · <b>Yours free</b></span>
            <a class="pill" href="#claim" data-claim-link>Claim Now</a>
          </div>
        </div>
        <div class="box-stage"><div class="art" role="img" aria-label="${esc(p.groupAlt)}"></div></div>
        <span class="times" aria-hidden="true">${esc(p.times)}</span>
      </article>
    </section>

    <!-- ================= FLAVORS ================= -->
    <section id="flavors" style="padding-top:0">
      <div class="sec-head rv">
        <h2 class="slash-title">${esc(p.flavorsTitle)}</h2>
        <span class="outline">${esc(p.flavorsSub)}</span>
      </div>
      <div class="flavs">
${flavorCards}
      </div>
    </section>

    <!-- ================= HOW IT WORKS ================= -->
    <section style="padding-top:0">
      <div class="sec-head center rv">
        <h2 class="slash-title">How It Works//</h2>
        <span class="outline">Free in 30 seconds</span>
      </div>
      <div class="steps">
        ${steps}
      </div>
      <div class="again rv"><a class="cta" href="#claim" data-claim-link>Claim My ${esc(p.claimUnit)}</a></div>
    </section>

    <!-- ================= FAQ ================= -->
    <section id="faq" style="padding-top:0">
      <div class="sec-head center rv">
        <h2 class="slash-title">FAQ//</h2>
        <span class="outline">Real quick</span>
      </div>
      <div class="faq">
        ${faq}
      </div>
    </section>

    <!-- ================= OFFER DETAILS ================= -->
    <section id="details" style="padding-top:0">
      <div class="rules rv">
        <h3>Free Sample Offer Details</h3>
        <ol>
          <li><strong>The offer:</strong> ${esc(p.rulesItem)} The product is free; you just cover shipping, which is shown at checkout before you pay.</li>
          <li><strong>Limit:</strong> One (1) free sample per person, household and shipping address. Duplicate or fraudulent claims may be canceled.</li>
          <li><strong>While supplies last:</strong> This drop is limited to <span data-supply>${p.supply}</span> ${esc(p.unit)}s. Flavors are subject to availability.</li>
          <li><strong>Eligibility:</strong> You must be 21 years of age or older. Samples ship only to U.S. addresses in these states: <span data-ship-states>${esc(SHIP_STATES.join(", "))}</span>.</li>
          <li><strong>Emails:</strong> Claiming a sample signs you up for Looper marketing emails about drops, deals and giveaways. Unsubscribe anytime.</li>
          <li><strong>Privacy:</strong> Information collected is used to fulfill your sample and, as described above, to send Looper marketing emails. See the <a href="https://looperverse.com/privacy-policy-2/" target="_blank" rel="noopener">Privacy Policy</a>.</li>
        </ol>
        <p>Offered by looperverse Inc. Questions? <a href="https://looperverse.com/contact-us/" target="_blank" rel="noopener">Contact us</a>.</p>
      </div>
    </section>
  </main>

  <footer>
    <div class="wrap">
      <div class="top">
        <span class="lv-logo" role="img" aria-label="looperverse"></span>
        <nav aria-label="Footer">
          <a href="https://looperverse.com/shop/">Shop</a>
          <a href="https://looperverse.com/labs/">Lab Reports</a>
          <a href="https://looperverse.com/shipping-policy/">Shipping</a>
          <a href="https://looperverse.com/terms-of-service/">Terms</a>
          <a href="https://looperverse.com/privacy-policy-2/">Privacy</a>
          <a href="https://looperverse.com/contact-us/">Contact</a>
        </nav>
      </div>
      <p>Products on this site may contain a value of 0.3% or less Δ9THC (or no more than 0.3% Δ9THC). Do not use these products without approval from a doctor, especially if you take prescription medications.</p>
      <p>FDA Disclosure: This product is not for use by or sale to persons under the age of 18 or 21 depending on the laws of your governing state or territory. This product should be used only as directed on the label. It should not be used if you are pregnant or nursing. Consult with a physician before use, especially if you have a medical condition or use prescription medications. These statements have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure or prevent any disease. Void Where Prohibited By Law.</p>
      <p>© <span id="year"></span> looperverse Inc.</p>
    </div>
  </footer>
</div>

<!-- ===== sticky claim bar (phones) ===== -->
<div class="sticky" id="sticky">
  <span class="thumb" style="--img:var(--group)" aria-hidden="true"></span>
  <div class="s-txt"><b>${esc(p.stickyTitle)}</b><span>Just cover shipping · 21+</span></div>
  <a class="cta" href="#claim" data-claim-link>Claim <span class="arr" aria-hidden="true">→</span></a>
</div>

<script>
/* =====================================================================
   CONFIG: edit before launch (see README.md)
   ===================================================================== */
const CONFIG = {
  // Klaviyo public key, from looperverse.com's live Klaviyo snippet (same as the giveaway).
  KLAVIYO_COMPANY_ID: '${config.KLAVIYO_COMPANY_ID}',
  // Klaviyo list for free-sample claimers. While blank, the page runs in preview mode and sends nothing.
  KLAVIYO_LIST_ID: '',
  // Event logged on every claim, to trigger flows (e.g. "finish your checkout" reminders).
  KLAVIYO_EVENT: '${config.KLAVIYO_EVENT}',
  KLAVIYO_SOURCE: '${config.KLAVIYO_SOURCE}',

  // Checkout link for each flavor's free sample. PLACEHOLDERS for now: while a link
  // contains "PLACEHOLDER" the page shows a preview screen instead of redirecting.
  // Optional tokens: {email} {flavor} {state}, e.g. '...&billing_email={email}'
  CHECKOUT: {
${checkoutLines}
  },
  PASS_UTM: true,           // copy utm_* / fbclid / gclid from the ad onto the checkout link

  RETAIL: ${config.RETAIL},           // shown struck through next to "Free"
  SUPPLY: ${config.SUPPLY},              // samples in this drop
  LEFT: null,              // optional: set a number (e.g. 18) to show "18 of ${config.SUPPLY} left" with a meter
  SOLD_OUT: false,         // true closes the offer and points everyone to the shop
  SOLD_OUT_FLAVORS: [],    // e.g. ['${first.slug}'] greys out a flavor
  END: '',                 // optional end time, e.g. '2026-11-01T23:59:00-04:00' (shows a countdown)
  CAPTURE_TIMEOUT_MS: 2500 // longest the page waits on Klaviyo before going to checkout
};

// States Looper ships to (same list as the Looperverse Giveaway).
const SHIP_STATES = ${JSON.stringify(SHIP_STATES)};

// Product data (from looperverse.com). Flavor names and notes appear on the page.
const PRODUCT = ${JSON.stringify(product)};
</script>
<script>
${clientJs}</script>
</body>
</html>
`;
}

for (const p of Object.values(products)) {
  const html = await render(p);
  const out = path.join(OUT_DIR, p.slug, "index.html");
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, html);
  console.log(`✓ ${path.relative(ROOT, out)} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`);
}
