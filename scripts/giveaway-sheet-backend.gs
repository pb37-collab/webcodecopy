/**
 * Google Sheet backend for the giveaway page: stores entries and serves the
 * live entry count + referral totals. Free, no server to run.
 *
 * SETUP (about 5 minutes)
 *  1. Create a Google Sheet. Extensions → Apps Script. Replace Code.gs with
 *     this file and Save.
 *  2. Deploy → New deployment → type "Web app".
 *       Execute as: Me        Who has access: Anyone
 *     Copy the Web app URL (ends in /exec).
 *  3. In Vercel (or .env.local), set BOTH of these to that URL:
 *       NEXT_PUBLIC_GIVEAWAY_ENDPOINT=<url>     (entries are POSTed here)
 *       NEXT_PUBLIC_GIVEAWAY_COUNT_URL=<url>    (the page GETs the count here)
 *     Redeploy the site. Klaviyo variables can stay set too; entries then go
 *     to both.
 *  4. After editing this script later: Deploy → Manage deployments → Edit →
 *     New version, or the old code keeps running.
 *
 * WHAT IT COUNTS
 *  - One row per email (repeat entries are ignored).
 *  - A referral counts when a new email enters with ?ref=CODE, CODE belongs to
 *    a different entrant, and that entrant isn't referring themselves.
 *  - tickets = entrants + BONUS × credited referrals.
 *
 * The "Entries" tab is the draw list: draw from it with each entrant weighted
 * by 1 + BONUS × their referrals.
 */

const SHEET_NAME = "Entries";
const BONUS = 3;
const HEADERS = [
  "entered_at", "email", "first_name", "colorway", "ref_code", "referred_by",
  "giveaway", "marketing_opt_in", "age_confirmed", "utm",
];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function rows_() {
  const sh = sheet_();
  const n = sh.getLastRow() - 1;
  return n > 0 ? sh.getRange(2, 1, n, HEADERS.length).getValues() : [];
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** POST: one entry (JSON body sent as text/plain by the page). */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const email = String(d.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || d.ageConfirmed !== true || d.marketingOptIn !== true) {
      return json_({ ok: false });
    }
    const existing = rows_();
    if (existing.some((r) => r[1] === email)) return json_({ ok: true, duplicate: true });

    sheet_().appendRow([
      new Date(), email, String(d.firstName || "").slice(0, 60), String(d.colorway || "").slice(0, 20),
      String(d.refCode || "").toUpperCase().slice(0, 12), String(d.referredBy || "").toUpperCase().slice(0, 12),
      String(d.giveaway || "").slice(0, 80), true, true, JSON.stringify(d.utm || {}).slice(0, 500),
    ]);
    CacheService.getScriptCache().remove("stats");
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

/** GET: {"entrants", "tickets", "referrals"} — referrals for ?ref=CODE. */
function doGet(e) {
  const cache = CacheService.getScriptCache();
  let stats = JSON.parse(cache.get("stats") || "null");
  if (!stats) {
    const rows = rows_();
    const owner = {};
    rows.forEach((r) => { if (r[4]) owner[r[4]] = r[1]; });
    const credited = {};
    let referrals = 0;
    rows.forEach((r) => {
      const by = r[5];
      if (by && owner[by] && owner[by] !== r[1]) {
        credited[by] = (credited[by] || 0) + 1;
        referrals++;
      }
    });
    stats = { entrants: rows.length, tickets: rows.length + BONUS * referrals, credited: credited };
    cache.put("stats", JSON.stringify(stats), 20);
  }
  const ref = String((e && e.parameter && e.parameter.ref) || "").toUpperCase();
  return json_({ entrants: stats.entrants, tickets: stats.tickets, referrals: (ref && stats.credited[ref]) || 0 });
}
