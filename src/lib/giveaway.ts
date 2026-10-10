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

export async function submitEntry(entry: GiveawayEntry, config: CaptureConfig): Promise<SubmitResult> {
  try {
    if (config.klaviyoCompanyId && config.klaviyoListId) {
      const res = await fetch(
        `https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(config.klaviyoCompanyId)}`,
        {
          method: "POST",
          headers: { "content-type": "application/vnd.api+json", revision: "2025-01-15" },
          body: JSON.stringify(klaviyoBody(entry, config.klaviyoListId)),
        },
      );
      if (!res.ok) return { ok: false, error: "We couldn't save your entry. Try again in a moment." };
    }
    if (config.webhookUrl) {
      // no-cors + text/plain: a "simple request" any webhook accepts, even one
      // that sends no CORS headers. The response is opaque in that case.
      const res = await fetch(config.webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "content-type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ ...entry, enteredAt: new Date().toISOString() }),
      });
      if (!res.ok && res.type !== "opaque") {
        return { ok: false, error: "We couldn't save your entry. Try again in a moment." };
      }
    }
    return { ok: true, demo: !isConfigured(config) };
  } catch {
    return { ok: false, error: "Network hiccup. Check your connection and try again." };
  }
}

function klaviyoBody(entry: GiveawayEntry, listId: string) {
  return {
    data: {
      type: "subscription",
      attributes: {
        custom_source: `Giveaway: ${entry.giveaway}`,
        profile: {
          data: {
            type: "profile",
            attributes: {
              email: entry.email,
              ...(entry.firstName ? { first_name: entry.firstName } : {}),
              properties: {
                giveaway: entry.giveaway,
                giveaway_colorway: entry.colorway,
                giveaway_ref_code: entry.refCode,
                giveaway_referred_by: entry.referredBy ?? "",
                giveaway_age_confirmed: entry.ageConfirmed,
                ...prefixKeys(entry.utm, "giveaway_"),
              },
            },
          },
        },
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
