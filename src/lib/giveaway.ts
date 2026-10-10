/**
 * Giveaway entry capture for statically exported pages (no server). Entries go
 * straight from the browser to the email platform:
 *
 *   Klaviyo company ID (public API key) + list ID
 *     → Klaviyo client subscription (public key, safe in the browser)
 *   Webhook URL
 *     → plain JSON POST to a webhook (Zapier, Make, Apps Script, …).
 *     scripts/giveaway-sheet-backend.gs is a ready-made Google Sheet backend.
 *
 * Settings come from a config.json served next to the page, so a hosted copy
 * can be connected by editing one file, no rebuild. NEXT_PUBLIC_KLAVIYO_COMPANY_ID,
 * NEXT_PUBLIC_KLAVIYO_LIST_ID and NEXT_PUBLIC_GIVEAWAY_ENDPOINT still work as
 * build-time defaults; non-empty values in config.json win.
 *
 * With nothing set the page runs in demo mode and shows a visible banner, so
 * an unconfigured page can't quietly drop real entries.
 */

export type GiveawayEntry = {
  email: string;
  firstName: string;
  colorway: string;
  refCode: string;
  referredBy: string | null;
  giveaway: string;
  utm: Record<string, string>;
  marketingOptIn: true;
  ageConfirmed: true;
};

export type SubmitResult = { ok: true; demo: boolean } | { ok: false; error: string };

export type CaptureConfig = { klaviyoCompanyId: string; klaviyoListId: string; webhookUrl: string };

const BUILD_DEFAULTS: CaptureConfig = {
  klaviyoCompanyId: process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID ?? "",
  klaviyoListId: process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID ?? "",
  webhookUrl: process.env.NEXT_PUBLIC_GIVEAWAY_ENDPOINT ?? "",
};

const loads = new Map<string, Promise<CaptureConfig>>();

/** Reads config.json once per page load; a missing or broken file falls back to build defaults. */
export function loadCaptureConfig(path: string): Promise<CaptureConfig> {
  let p = loads.get(path);
  if (!p) {
    p = fetch(path, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : {}))
      .catch(() => ({}))
      .then((file: Partial<Record<keyof CaptureConfig, unknown>>) => {
        const pick = (k: keyof CaptureConfig) => {
          const v = file?.[k];
          return typeof v === "string" && v.trim() ? v.trim() : BUILD_DEFAULTS[k];
        };
        return { klaviyoCompanyId: pick("klaviyoCompanyId"), klaviyoListId: pick("klaviyoListId"), webhookUrl: pick("webhookUrl") };
      });
    loads.set(path, p);
  }
  return p;
}

export const isConfigured = (c: CaptureConfig) => Boolean((c.klaviyoCompanyId && c.klaviyoListId) || c.webhookUrl);

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Sends the entry to every configured destination. It succeeds if at least
 * one of them accepts it, so a hiccup at Klaviyo can't lose an entry the
 * webhook (e.g. the Google Sheet) already saved, and vice versa.
 */
export async function submitEntry(entry: GiveawayEntry, config: CaptureConfig): Promise<SubmitResult> {
  const useKlaviyo = Boolean(config.klaviyoCompanyId && config.klaviyoListId);
  const useWebhook = Boolean(config.webhookUrl);
  if (!useKlaviyo && !useWebhook) return { ok: true, demo: true };

  const [klaviyo, webhook] = await Promise.all([
    useKlaviyo ? sendToKlaviyo(entry, config) : Promise.resolve(false),
    useWebhook ? sendToWebhook(entry, config.webhookUrl) : Promise.resolve(false),
  ]);
  if (klaviyo || webhook) return { ok: true, demo: false };
  return { ok: false, error: "We couldn't save your entry. Check your connection and try again." };
}

/**
 * Klaviyo client subscription. If Klaviyo rejects the request body (for
 * example a profile field it no longer accepts), retry with just the email
 * and list so the sign-up still lands; the extra details are nice to have.
 */
async function sendToKlaviyo(entry: GiveawayEntry, config: CaptureConfig): Promise<boolean> {
  const url = `https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(config.klaviyoCompanyId)}`;
  const post = (body: unknown) =>
    fetch(url, {
      method: "POST",
      headers: { "content-type": "application/vnd.api+json", revision: "2025-01-15" },
      body: JSON.stringify(body),
    });
  try {
    const res = await post(klaviyoBody(entry, config.klaviyoListId));
    if (res.ok) return true;
    if (res.status === 400 || res.status === 422) {
      console.warn(`Klaviyo rejected the full entry (HTTP ${res.status}); retrying with email and list only.`);
      const retry = await post(klaviyoBody(entry, config.klaviyoListId, { minimal: true }));
      return retry.ok;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * no-cors + text/plain: a "simple request" any webhook accepts, even one that
 * sends no CORS headers. The response is opaque then, so a request that went
 * out counts as delivered.
 */
async function sendToWebhook(entry: GiveawayEntry, url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "content-type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...entry, enteredAt: new Date().toISOString() }),
    });
    return res.ok || res.type === "opaque";
  } catch {
    return false;
  }
}

function klaviyoBody(entry: GiveawayEntry, listId: string, { minimal = false } = {}) {
  const extras = minimal
    ? {}
    : {
        ...(entry.firstName ? { first_name: entry.firstName } : {}),
        properties: {
          giveaway: entry.giveaway,
          giveaway_colorway: entry.colorway,
          giveaway_ref_code: entry.refCode,
          giveaway_referred_by: entry.referredBy ?? "",
          giveaway_age_confirmed: entry.ageConfirmed,
          ...prefixKeys(entry.utm, "giveaway_"),
        },
      };
  return {
    data: {
      type: "subscription",
      attributes: {
        custom_source: `Giveaway: ${entry.giveaway}`,
        profile: { data: { type: "profile", attributes: { email: entry.email, ...extras } } },
      },
      relationships: { list: { data: { type: "list", id: listId } } },
    },
  };
}

function prefixKeys(obj: Record<string, string>, prefix: string) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [`${prefix}${k}`, v]));
}

const REF_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/**
 * Referral code for an email: short, unambiguous (no 0/O, 1/I/L) and the same
 * every time that email enters, so a returning entrant keeps their link and
 * the referrals already credited to it.
 */
export async function refCodeFor(email: string, salt: string, length = 6): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${email.trim().toLowerCase()}`);
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", data)).slice(0, length);
  return Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("");
}

/** utm_* params and the ?ref= code from the current URL. */
export function readAttribution(search: string): { utm: Record<string, string>; ref: string | null } {
  const params = new URLSearchParams(search);
  const utm: Record<string, string> = {};
  for (const [k, v] of params) {
    if (k.startsWith("utm_") && v) utm[k] = v.slice(0, 120);
  }
  const ref = params.get("ref");
  return { utm, ref: ref && /^[A-Z0-9]{4,12}$/i.test(ref) ? ref.toUpperCase() : null };
}
