import { claimConfig, isLive, toVariantGid, type SampleId } from "./config";
import { samples } from "./products";

/** Which lander the lead came from; lands on the order and in Klaviyo. */
export type ClaimSource = "free-sample-v1" | "free-sample-v2";

export interface Lead {
  firstName: string;
  email: string;
  sample: SampleId;
  source: ClaimSource;
}

/** A lead before a product is picked (v2 captures the email first). */
export type EmailLead = Omit<Lead, "sample"> & { sample?: SampleId };

export type ClaimResult =
  | { live: true; url: string }
  /** Preview mode: what would have happened, for the preview sheet. */
  | { live: false; preview: string };

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const CLAIM_STORAGE_KEY = "chunky-free-sample-claim";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function normalizeLead<T extends EmailLead>(lead: T): T {
  return { ...lead, email: lead.email.trim().toLowerCase(), firstName: lead.firstName.trim() };
}

function readUtms(): Partial<Record<(typeof UTM_KEYS)[number], string>> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Partial<Record<(typeof UTM_KEYS)[number], string>> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) out[key] = value;
  }
  return out;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | undefined> {
  return Promise.race([promise, new Promise<undefined>((resolve) => setTimeout(resolve, ms))]);
}

/* Chunky API: the same calls chunkyacademy.com/free-sample makes today. */

function apiUrl(path: string) {
  return `${claimConfig.apiBase}${path}`;
}

/** A failure with a message that's fine to show the customer. */
export class ClaimError extends Error {}

/** POST /api/klaviyo/subscribe on the Chunky site. */
async function chunkySubscribe(lead: EmailLead): Promise<void> {
  const res = await fetch(apiUrl("/api/klaviyo/subscribe"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: lead.email,
      name: lead.firstName,
      listId: claimConfig.klaviyoListId,
      redirectUrl: null,
    }),
  }).catch(() => null);
  const data = (await res?.json().catch(() => ({}))) as { success?: boolean; error?: string } | undefined;
  if (!res?.ok || !data?.success) {
    throw new ClaimError(data?.error || "We couldn't save your email. Try again.");
  }
}

/** POST /api/cart/create-with-product: returns the Shopify checkout URL. */
async function chunkyCreateCart(sample: SampleId): Promise<string> {
  const res = await fetch(apiUrl("/api/cart/create-with-product"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      variantId: toVariantGid(claimConfig.variants[sample]),
      quantity: 1,
      discountCode: claimConfig.discountCode,
    }),
  }).catch(() => null);
  const data = (await res?.json().catch(() => ({}))) as
    | { success?: boolean; checkoutUrl?: string }
    | undefined;
  if (!res?.ok || !data?.success || !data.checkoutUrl) {
    throw new ClaimError("We couldn't build your cart. Try again in a moment.");
  }
  return data.checkoutUrl;
}

/* Shopify cart permalink: works from any host. */

/**
 * Loads the chosen sample into a fresh Shopify cart. Cart permalinks replace
 * whatever was in the cart, which suits a one-item free sample. Reference:
 * https://shopify.dev/docs/apps/build/checkout/create-cart-permalinks
 */
export function buildCartUrl(lead: Lead): string {
  const { cartUrlTemplate, shopDomain, variants, discountCode, destination, prefillCheckoutEmail } =
    claimConfig;
  const variantId = variants[lead.sample];

  if (cartUrlTemplate) {
    const tokens: Record<string, string> = {
      variantId,
      sample: lead.sample,
      email: lead.email,
      firstName: lead.firstName,
      discount: discountCode,
      source: lead.source,
    };
    return cartUrlTemplate.replace(/\{(\w+)\}/g, (match, key: string) =>
      key in tokens ? encodeURIComponent(tokens[key]) : match,
    );
  }

  const url = new URL(`https://${shopDomain}/cart/${variantId}:1`);
  const p = url.searchParams;
  if (discountCode) p.set("discount", discountCode);
  if (prefillCheckoutEmail && lead.email) p.set("checkout[email]", lead.email);
  if (lead.firstName) p.set("checkout[shipping_address][first_name]", lead.firstName);
  // Attributes show in the order's Notes section, so every order says where it came from.
  p.set("attributes[Free sample]", samples[lead.sample].name);
  p.set("attributes[Sample page]", lead.source);
  for (const [key, value] of Object.entries(readUtms())) p.set(`attributes[${key}]`, value);
  p.set("ref", lead.source);
  if (destination === "cart") p.set("storefront", "true");
  return url.toString();
}

/* Optional extras: Klaviyo client API, webhook, analytics. */

async function postKlaviyo(path: string, body: unknown): Promise<void> {
  await fetch(`https://a.klaviyo.com/client/${path}?company_id=${claimConfig.klaviyo.publicKey}`, {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/vnd.api+json", revision: "2024-10-15" },
    body: JSON.stringify(body),
  });
}

function profile(lead: EmailLead) {
  return {
    data: {
      type: "profile",
      attributes: {
        email: lead.email,
        first_name: lead.firstName || undefined,
        properties: {
          "Free sample page": lead.source,
          ...(lead.sample ? { "Free sample choice": samples[lead.sample].name } : {}),
        },
      },
    },
  };
}

/**
 * Sends the lead to the optional extras: Klaviyo's client API (list
 * subscription in permalink mode, plus a metric event once a sample is
 * chosen) and/or a JSON webhook. Never throws, never waits longer than
 * leadTimeoutMs.
 *
 * `stage` is "email" when only the email is known (v2's unlock step) and
 * "claimed" once the sample is picked.
 */
export async function captureExtras(lead: EmailLead, stage: "email" | "claimed"): Promise<void> {
  const { klaviyo, webhookUrl, leadTimeoutMs, klaviyoListId, mode } = claimConfig;
  const product = lead.sample ? samples[lead.sample] : null;
  const tasks: Promise<unknown>[] = [];

  if (klaviyo.publicKey) {
    // In chunky-api mode the site's own route already subscribes them.
    if (mode === "permalink" && klaviyoListId) {
      tasks.push(
        postKlaviyo("subscriptions", {
          data: {
            type: "subscription",
            attributes: { custom_source: `Chunky free sample (${lead.source})`, profile: profile(lead) },
            relationships: { list: { data: { type: "list", id: klaviyoListId } } },
          },
        }),
      );
    }
    if (stage === "claimed" && product) {
      tasks.push(
        postKlaviyo("events", {
          data: {
            type: "event",
            attributes: {
              properties: { Sample: product.name, Weight: product.weight, Page: lead.source, ...readUtms() },
              metric: { data: { type: "metric", attributes: { name: klaviyo.eventName } } },
              profile: profile(lead),
            },
          },
        }),
      );
    }
  }

  if (webhookUrl) {
    tasks.push(
      fetch(webhookUrl, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage,
          firstName: lead.firstName,
          email: lead.email,
          sample: product?.name ?? null,
          sampleId: lead.sample ?? null,
          weight: product?.weight ?? null,
          page: lead.source,
          ...readUtms(),
          pageUrl: typeof window === "undefined" ? "" : window.location.href,
          at: new Date().toISOString(),
        }),
      }),
    );
  }

  if (tasks.length) await withTimeout(Promise.allSettled(tasks), leadTimeoutMs);
}

type AnalyticsWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  fbq?: (...args: unknown[]) => void;
  ttq?: { track: (event: string, params?: Record<string, unknown>) => void };
};

/** Pushes to GTM's dataLayer, plus Meta/TikTok pixels if the page has them. */
export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  w.dataLayer?.push({ event, ...params });
  if (event === "free_sample_claim") {
    w.fbq?.("track", "Lead", params);
    w.ttq?.track("SubmitForm", params);
  }
}

/* The flows the pages call. */

/**
 * v2's unlock step: save the email before a sample is picked. In chunky-api
 * mode this subscribes through the site and throws ClaimError if that fails;
 * the extras run in the background.
 */
export async function submitEmail(input: EmailLead): Promise<void> {
  const lead = normalizeLead(input);
  track("free_sample_email", { page: lead.source });
  void captureExtras(lead, "email");
  if (claimConfig.mode === "chunky-api" && isLive()) await chunkySubscribe(lead);
}

export interface StoredClaim {
  sample: SampleId;
  url: string;
  at: number;
}

export function readStoredClaim(): StoredClaim | null {
  try {
    const raw = window.localStorage.getItem(CLAIM_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredClaim) : null;
  } catch {
    return null;
  }
}

function storeClaim(claim: StoredClaim): void {
  try {
    window.localStorage.setItem(CLAIM_STORAGE_KEY, JSON.stringify(claim));
  } catch {
    // Storage blocked (private mode): the claim still goes through.
  }
}

function previewOf(lead: Lead): string {
  if (claimConfig.mode === "permalink") return buildCartUrl(lead);
  return [
    `POST ${apiUrl("/api/klaviyo/subscribe")}`,
    JSON.stringify({ email: lead.email, name: lead.firstName, listId: claimConfig.klaviyoListId }),
    "",
    `POST ${apiUrl("/api/cart/create-with-product")}`,
    JSON.stringify({
      variantId: toVariantGid(claimConfig.variants[lead.sample]),
      quantity: 1,
      discountCode: claimConfig.discountCode,
    }),
    "",
    "→ redirect to the checkoutUrl it returns",
  ].join("\n");
}

/**
 * The whole claim: subscribe, build the cart, record analytics. The caller
 * decides when to navigate (pages animate first). Throws ClaimError when the
 * Chunky API refuses, with a message fit to show.
 *
 * `emailAlreadySubmitted` skips the subscribe call when v2 already made it.
 */
export async function claimSample(input: Lead, emailAlreadySubmitted = false): Promise<ClaimResult> {
  const lead = normalizeLead(input);
  const product = samples[lead.sample];

  track("free_sample_claim", { sample: product.name, sample_id: lead.sample, page: lead.source });
  const extras = captureExtras(lead, "claimed");

  if (!isLive()) {
    await extras;
    return { live: false, preview: previewOf(lead) };
  }

  let url: string;
  if (claimConfig.mode === "chunky-api") {
    if (!emailAlreadySubmitted) await chunkySubscribe(lead);
    url = await chunkyCreateCart(lead.sample);
  } else {
    url = buildCartUrl(lead);
  }
  await extras;
  storeClaim({ sample: lead.sample, url, at: Date.now() });
  return { live: true, url };
}
