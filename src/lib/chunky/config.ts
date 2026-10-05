/**
 * Chunky Academy free-sample landers: every setting the Chunky team needs to
 * plug in lives here. Each value reads from a NEXT_PUBLIC_* environment
 * variable first (set them in Vercel, or in .env.local), so going live needs
 * no code change. Setup steps: docs/chunky/INTEGRATION.md.
 *
 * Defaults match chunkyacademy.com's current free-sample setup (October 2026):
 * its own /api/klaviyo/subscribe and /api/cart/create-with-product routes, the
 * "free-sample" discount code and Klaviyo list V2Si39.
 */

export type SampleId = "runtz" | "snowcaps";

/**
 * `chunky-api`: the same calls chunkyacademy.com/free-sample makes today
 * (Klaviyo subscribe, then create a Shopify cart and go to its checkout).
 * Only works when the page is served from chunkyacademy.com, or when
 * `apiBase` points at it and that site allows cross-origin requests.
 *
 * `permalink`: a Shopify cart permalink on the myshopify domain. Works from
 * any host.
 */
export type CartMode = "chunky-api" | "permalink";

/** Permalink mode only: `cart` lands on the cart page, `checkout` skips to checkout. */
export type CartDestination = "cart" | "checkout";

function read(value: string | undefined, fallback = ""): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

// NEXT_PUBLIC_* values are inlined at build time, so each one has to be
// referenced by its literal name.
export const claimConfig = {
  mode: (read(process.env.NEXT_PUBLIC_SAMPLE_CART_MODE, "chunky-api") === "permalink"
    ? "permalink"
    : "chunky-api") as CartMode,

  /**
   * chunky-api mode: origin of the Chunky site's API. Empty means "same site",
   * which is right once these pages live on chunkyacademy.com.
   */
  apiBase: read(process.env.NEXT_PUBLIC_CHUNKY_API_BASE).replace(/\/$/, ""),

  /** Hostnames that count as "on the Chunky site" when apiBase is empty. */
  siteHosts: ["chunkyacademy.com", "www.chunkyacademy.com"],

  /** Klaviyo list the Chunky API subscribes claimers to. */
  klaviyoListId: read(process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID, "V2Si39"),

  /** permalink mode: the Shopify domain that serves carts. */
  shopDomain: read(process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN, "chunkyacademy.myshopify.com"),

  destination: (read(process.env.NEXT_PUBLIC_SAMPLE_DESTINATION, "checkout") === "cart"
    ? "cart"
    : "checkout") as CartDestination,

  /**
   * Numeric Shopify variant IDs. Defaults are the live retail variants
   * (Jolly Rancher Runtz 7g, Cotton Candy Toast Snow Cap 3.5g). Swap in
   * dedicated $0 sample variants, or make sure the discount code below
   * covers these, before sending traffic.
   */
  variants: {
    runtz: read(process.env.NEXT_PUBLIC_RUNTZ_VARIANT_ID, "42552332812362"),
    snowcaps: read(process.env.NEXT_PUBLIC_SNOWCAPS_VARIANT_ID, "43660890832970"),
  } satisfies Record<SampleId, string>,

  /** Discount code applied to the cart. "free-sample" is the code the current page uses. */
  discountCode: read(process.env.NEXT_PUBLIC_SAMPLE_DISCOUNT_CODE, "free-sample"),

  /**
   * Optional full override of the cart URL (permalink mode only).
   * Tokens: {variantId} {sample} {email} {firstName} {discount} {source}
   */
  cartUrlTemplate: read(process.env.NEXT_PUBLIC_SAMPLE_CART_URL_TEMPLATE),

  /** permalink mode: pre-fill the checkout email so the customer doesn't type it twice. */
  prefillCheckoutEmail: read(process.env.NEXT_PUBLIC_PREFILL_CHECKOUT_EMAIL, "true") !== "false",

  /**
   * Extra, optional lead destinations on top of the Chunky API (or instead of
   * it in permalink mode): Klaviyo's client API and/or a JSON webhook.
   */
  klaviyo: {
    /** Klaviyo public API key (6 characters, "Site ID"). Safe to expose in the browser. */
    publicKey: read(process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY),
    /** Metric name for the event fired on each claim; trigger flows from it. */
    eventName: read(process.env.NEXT_PUBLIC_KLAVIYO_EVENT_NAME, "Claimed Free Sample"),
  },
  webhookUrl: read(process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL),

  /** Longest the page waits on optional lead capture before moving on. */
  leadTimeoutMs: 2500,

  /** Offer terms line shown on both pages. */
  offerNote: read(process.env.NEXT_PUBLIC_SAMPLE_OFFER_NOTE, "Just cover shipping."),

  /**
   * Optional scarcity line, the way the current page does it ("Available for
   * the next ~~1000~~ 450 people"). Set both to show it; leave empty to hide.
   */
  spotsTotal: read(process.env.NEXT_PUBLIC_SAMPLE_SPOTS_TOTAL),
  spotsLeft: read(process.env.NEXT_PUBLIC_SAMPLE_SPOTS_LEFT),
} as const;

/** True when a claim would really reach the store rather than preview mode. */
export function isLive(): boolean {
  if (claimConfig.mode === "permalink") {
    return Boolean(claimConfig.cartUrlTemplate || claimConfig.shopDomain);
  }
  if (claimConfig.apiBase) return true;
  if (typeof window === "undefined") return false;
  return (claimConfig.siteHosts as readonly string[]).includes(window.location.hostname);
}

export function toVariantGid(id: string): string {
  return id.startsWith("gid://") ? id : `gid://shopify/ProductVariant/${id}`;
}
