import { claimConfig, isLive, type SampleId } from "./config";
import { samples } from "./products";

/** Which lander the lead came from; lands on the order as a cart attribute. */
export type ClaimSource = "free-sample-v1" | "free-sample-v2";

export interface Lead {
  firstName: string;
  email: string;
  sample: SampleId;
  source: ClaimSource;
}

export interface ClaimResult {
  url: string;
  live: boolean;
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const CLAIM_STORAGE_KEY = "chunky-free-sample-claim";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
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

/**
 * Builds the URL that loads the chosen sample into a fresh Shopify cart.
 * Shopify cart permalinks replace whatever was in the cart, which suits a
 * one-item free sample. Reference:
 * https://shopify.dev/docs/apps/build/checkout/create-cart-permalinks
 */
export function buildCartUrl(lead: Lead): string {
  const { cartUrlTemplate, shopDomain, variants, discountCode, destination, prefillCheckoutEmail } =
    claimConfig;
  const variantId = variants[lead.sample] || `${lead.sample.toUpperCase()}_VARIANT_ID`;

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

  const url = new URL(`https://${shopDomain || "your-store.myshopify.com"}/cart/${variantId}:1`);
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

async function postKlaviyo(path: string, body: unknown): Promise<void> {
  await fetch(`https://a.klaviyo.com/client/${path}?company_id=${claimConfig.klaviyo.publicKey}`, {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/vnd.api+json", revision: "2024-10-15" },
    body: JSON.stringify(body),
  });
}

/** A lead before a product is picked (v2 captures the email first). */
export type EmailLead = Omit<Lead, "sample"> & { sample?: SampleId };

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
 * Sends the lead everywhere that's configured: Klaviyo (list subscription,
 * plus a metric event once a sample is chosen) and/or a JSON webhook. Never
 * throws and never waits longer than leadTimeoutMs, so a slow or broken
 * integration can't stop someone reaching their cart.
 *
 * `stage` is "email" when only the email is known (v2's unlock step) and
 * "claimed" when the sample has been picked.
 */
export async function captureLead(lead: EmailLead, stage: "email" | "claimed"): Promise<void> {
  const { klaviyo, webhookUrl, leadTimeoutMs } = claimConfig;
  const product = lead.sample ? samples[lead.sample] : null;
  const tasks: Promise<unknown>[] = [];

  if (klaviyo.publicKey) {
    if (klaviyo.listId) {
      tasks.push(
        postKlaviyo("subscriptions", {
          data: {
            type: "subscription",
            attributes: {
              custom_source: `Chunky free sample (${lead.source})`,
              profile: profile(lead),
            },
            relationships: { list: { data: { type: "list", id: klaviyo.listId } } },
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
              properties: {
                Sample: product.name,
                Weight: product.weight,
                Page: lead.source,
                ...readUtms(),
              },
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

  if (tasks.length === 0) return;
  await Promise.race([
    Promise.allSettled(tasks),
    new Promise((resolve) => setTimeout(resolve, leadTimeoutMs)),
  ]);
}

export function normalizeLead<T extends EmailLead>(lead: T): T {
  return { ...lead, email: lead.email.trim().toLowerCase(), firstName: lead.firstName.trim() };
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

/**
 * The whole claim: capture the lead, record analytics, build the cart URL.
 * The caller decides when to navigate (pages animate first), using `live`
 * to tell a real redirect from demo mode.
 */
export async function claimSample(lead: Lead): Promise<ClaimResult> {
  const clean = normalizeLead(lead);
  const url = buildCartUrl(clean);
  track("free_sample_claim", {
    sample: samples[clean.sample].name,
    sample_id: clean.sample,
    page: clean.source,
  });
  await captureLead(clean, "claimed");
  storeClaim({ sample: clean.sample, url, at: Date.now() });
  return { url, live: isLive(clean.sample) };
}
