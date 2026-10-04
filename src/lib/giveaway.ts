/**
 * Giveaway entry capture for statically exported pages (no server). Entries go
 * straight from the browser to the email platform:
 *
 *   NEXT_PUBLIC_KLAVIYO_COMPANY_ID + NEXT_PUBLIC_KLAVIYO_LIST_ID
 *     → Klaviyo client subscription (public key, safe in the browser)
 *   NEXT_PUBLIC_GIVEAWAY_ENDPOINT
 *     → plain JSON POST to a webhook (Zapier, Make, Apps Script, …)
 *
 * With neither set the page runs in demo mode and shows a visible banner, so
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

const KLAVIYO_COMPANY_ID = process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID ?? "";
const KLAVIYO_LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID ?? "";
const WEBHOOK = process.env.NEXT_PUBLIC_GIVEAWAY_ENDPOINT ?? "";

export const captureConfigured = Boolean((KLAVIYO_COMPANY_ID && KLAVIYO_LIST_ID) || WEBHOOK);

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitEntry(entry: GiveawayEntry): Promise<SubmitResult> {
  try {
    if (KLAVIYO_COMPANY_ID && KLAVIYO_LIST_ID) {
      const res = await fetch(
        `https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(KLAVIYO_COMPANY_ID)}`,
        {
          method: "POST",
          headers: { "content-type": "application/vnd.api+json", revision: "2025-01-15" },
          body: JSON.stringify(klaviyoBody(entry)),
        },
      );
      if (!res.ok) return { ok: false, error: "We couldn't save your entry. Try again in a moment." };
    }
    if (WEBHOOK) {
      // no-cors + text/plain: a "simple request" any webhook accepts, even one
      // that sends no CORS headers. The response is opaque in that case.
      const res = await fetch(WEBHOOK, {
        method: "POST",
        mode: "no-cors",
        headers: { "content-type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ ...entry, enteredAt: new Date().toISOString() }),
      });
      if (!res.ok && res.type !== "opaque") {
        return { ok: false, error: "We couldn't save your entry. Try again in a moment." };
      }
    }
    return { ok: true, demo: !captureConfigured };
  } catch {
    return { ok: false, error: "Network hiccup. Check your connection and try again." };
  }
}

function klaviyoBody(entry: GiveawayEntry) {
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
      relationships: { list: { data: { type: "list", id: KLAVIYO_LIST_ID } } },
    },
  };
}

function prefixKeys(obj: Record<string, string>, prefix: string) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [`${prefix}${k}`, v]));
}

/** Short, unambiguous referral code (no 0/O, 1/I/L). */
export function makeRefCode(length = 6): string {
  const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
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
