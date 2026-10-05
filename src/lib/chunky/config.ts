/**
 * Chunky Academy free-sample landers: every setting the Chunky team needs to
 * plug in lives here. Each value reads from a NEXT_PUBLIC_* environment
 * variable first (set them in Vercel, or in .env.local), so going live needs
 * no code change. Setup steps: docs/chunky/INTEGRATION.md.
 *
 * While the Shopify domain or a variant ID is missing the pages run in demo
 * mode: the full flow works, but instead of redirecting, the page shows the
 * cart URL it would have opened.
 */

export type SampleId = "runtz" | "snowcaps";

/** `cart` lands on the Online Store cart page; `checkout` skips straight to checkout. */
export type CartDestination = "cart" | "checkout";

function read(value: string | undefined, fallback = ""): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

// NEXT_PUBLIC_* values are inlined at build time, so each one has to be
// referenced by its literal name.
export const claimConfig = {
  /**
   * Domain that serves the Shopify cart: the primary storefront domain
   * (www.chunkyacademy.com) when it runs on Shopify's Online Store, or the
   * *.myshopify.com domain when the storefront is custom/headless.
   */
  shopDomain: read(process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN),

  destination: (read(process.env.NEXT_PUBLIC_SAMPLE_DESTINATION, "cart") === "checkout"
    ? "checkout"
    : "cart") as CartDestination,

  /** Numeric Shopify variant IDs (Admin → Products → variant → the number in the URL). */
  variants: {
    runtz: read(process.env.NEXT_PUBLIC_RUNTZ_VARIANT_ID),
    snowcaps: read(process.env.NEXT_PUBLIC_SNOWCAPS_VARIANT_ID),
  } satisfies Record<SampleId, string>,

  /** Optional discount code applied through the cart link (e.g. a 100%-off, once-per-customer code). */
  discountCode: read(process.env.NEXT_PUBLIC_SAMPLE_DISCOUNT_CODE),

  /**
   * Optional full override for stores that don't use Shopify cart links.
   * Tokens: {variantId} {sample} {email} {firstName} {discount} {source}
   * e.g. https://www.chunkyacademy.com/cart/add?id={variantId}&return_to=/cart
   */
  cartUrlTemplate: read(process.env.NEXT_PUBLIC_SAMPLE_CART_URL_TEMPLATE),

  /** Pre-fill the checkout email so the customer doesn't type it twice. */
  prefillCheckoutEmail: read(process.env.NEXT_PUBLIC_PREFILL_CHECKOUT_EMAIL, "true") !== "false",

  klaviyo: {
    /** Klaviyo public API key (6 characters, "Site ID"). Safe to expose in the browser. */
    publicKey: read(process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY),
    /** List that claimers are subscribed to. */
    listId: read(process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID),
    /** Metric name for the event fired on each claim; trigger flows from it. */
    eventName: read(process.env.NEXT_PUBLIC_KLAVIYO_EVENT_NAME, "Claimed Free Sample"),
  },

  /** Optional webhook (Zapier, Make, Shopify Flow, your own API) that receives every lead as JSON. */
  webhookUrl: read(process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL),

  /** Longest the page waits on lead capture before redirecting anyway. */
  leadTimeoutMs: 2500,

  /** Shown on both pages wherever the offer terms appear. */
  offerNote: read(process.env.NEXT_PUBLIC_SAMPLE_OFFER_NOTE, "Just cover shipping."),
} as const;

export function isLive(sample: SampleId): boolean {
  const variant = claimConfig.variants[sample];
  if (claimConfig.cartUrlTemplate)
    return Boolean(variant) || !claimConfig.cartUrlTemplate.includes("{variantId}");
  return Boolean(claimConfig.shopDomain && variant);
}
