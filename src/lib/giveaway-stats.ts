/**
 * Live entry stats and win odds for the giveaway page.
 *
 *   NEXT_PUBLIC_GIVEAWAY_COUNT_URL
 *     GET → {"entrants": 1284, "tickets": 1530, "referrals": 2}
 *     `?ref=CODE` asks for that code's referral count. The Google Sheet backend
 *     in scripts/giveaway-sheet-backend.gs serves this (and takes entries).
 *
 * Without a count URL, a page that is also in demo mode (no entry capture)
 * shows labelled sample numbers; a live page with capture but no count URL
 * hides the counter rather than invent a number.
 */
import { captureConfigured } from "./giveaway";

export type GiveawayStats = {
  /** Unique people entered. */
  entrants: number;
  /** All entries in the draw, bonus entries included. */
  tickets: number;
  /** Friends credited to the visitor's referral code, when known. */
  referrals: number;
  live: boolean;
};

const COUNT_URL = process.env.NEXT_PUBLIC_GIVEAWAY_COUNT_URL ?? "";
const POLL_MS = 30_000;
const DEMO: GiveawayStats = { entrants: 1284, tickets: 1530, referrals: 0, live: false };

export const statsAvailable = Boolean(COUNT_URL) || !captureConfigured;

let snapshot: GiveawayStats | null = null;
let ref: string | null = null;
let timer: number | null = null;
const listeners = new Set<() => void>();

function emit(next: GiveawayStats) {
  snapshot = next;
  listeners.forEach((l) => l());
}

export async function refreshStats(): Promise<void> {
  if (!COUNT_URL) {
    if (!captureConfigured && !snapshot) emit(DEMO);
    return;
  }
  try {
    const url = new URL(COUNT_URL);
    if (ref) url.searchParams.set("ref", ref);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as Partial<GiveawayStats>;
    const entrants = Math.max(0, Math.floor(Number(data.entrants) || 0));
    const tickets = Math.max(entrants, Math.floor(Number(data.tickets) || entrants));
    emit({ entrants, tickets, referrals: Math.max(0, Math.floor(Number(data.referrals) || 0)), live: true });
  } catch {
    // Keep the last good numbers; the next poll retries.
  }
}

/** Tell the store whose referrals to ask for (after the visitor enters). */
export function setStatsRef(code: string | null) {
  if (code === ref) return;
  ref = code;
  void refreshStats();
}

/** Count the visitor's own entry right away, before the next poll. */
export function bumpOwnEntry() {
  if (snapshot) emit({ ...snapshot, entrants: snapshot.entrants + 1, tickets: snapshot.tickets + 1 });
  window.setTimeout(() => void refreshStats(), 2500);
}

export function subscribeStats(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1 && statsAvailable) {
    void refreshStats();
    if (COUNT_URL) {
      timer = window.setInterval(() => {
        if (document.visibilityState === "visible") void refreshStats();
      }, POLL_MS);
    }
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };
}

export const getStats = () => snapshot;
export const getServerStats = () => null;

/**
 * Estimated chance that someone holding `mine` of `tickets` entries is one of
 * `winners` drawn. Approximates the draw as independent picks, which is close
 * whenever one person holds a small share of the entries. With no more
 * entrants than prizes, every eligible entrant wins.
 */
export function winChance(mine: number, tickets: number, entrants: number, winners: number): number {
  if (entrants <= winners) return 1;
  if (tickets <= 0 || mine <= 0) return 0;
  return 1 - Math.pow(1 - Math.min(1, mine / tickets), winners);
}

/** "1 in 257" */
export function formatOdds(chance: number): string {
  if (chance >= 0.999) return "1 in 1";
  if (chance <= 0) return "—";
  return `1 in ${Math.max(1, Math.round(1 / chance)).toLocaleString("en-US")}`;
}

export function formatPercent(chance: number): string {
  const pct = chance * 100;
  return `${pct >= 10 ? pct.toFixed(0) : pct >= 1 ? pct.toFixed(1) : pct.toFixed(2)}%`;
}
