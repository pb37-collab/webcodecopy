/**
 * Entity diagram for Canna Connect OS, drawn from the Supabase migrations.
 * HTML/CSS rather than SVG so it reflows to a single column at 390px.
 */
type Table = { name: string; cols: readonly string[]; portal: "read" | "write" | "hidden" };

const core: readonly Table[] = [
  { name: "clients", cols: ["id", "name", "status", "is_demo", "private_owner"], portal: "read" },
  { name: "campaigns", cols: ["client_id → clients", "name", "start / end", "status", "value_usd 🔒", "notes 🔒"], portal: "read" },
  { name: "deliverables", cols: ["per campaign", "progress via deliverable_progress"], portal: "read" },
  { name: "posts", cols: ["kind (7 types)", "category", "platform: X | IG"], portal: "read" },
  { name: "post_metrics", cols: ["per post", "append-only snapshots", "views, accounts_reached"], portal: "read" },
];

const side: readonly Table[] = [
  { name: "client_users", cols: ["user_id → auth.users", "client_id → clients"], portal: "read" },
  { name: "invoices", cols: ["client_id → clients", "amount", "pay links", "status"], portal: "read" },
  { name: "campaign_onboardings", cols: ["client_id → clients", "campaign_id → campaigns", "one per campaign"], portal: "write" },
  { name: "follower_growth", cols: ["growth snapshots"], portal: "read" },
  { name: "tasks · prospects · payments · campaign_alerts", cols: ["admin only"], portal: "hidden" },
];

const badge = {
  read: "border-accent/50 text-accent",
  write: "border-ink-2/60 text-ink",
  hidden: "border-line-2 text-ink-3",
} as const;

const badgeLabel = { read: "portal: read own", write: "portal: write own", hidden: "service role only" } as const;

function TableCard({ t }: { t: Table }) {
  return (
    <div className="rounded-xl border border-line-2 bg-bg">
      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
        <span className="font-mono text-[12px] text-ink">{t.name}</span>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider ${badge[t.portal]}`}>
          {badgeLabel[t.portal]}
        </span>
      </div>
      <ul className="space-y-0.5 px-3 py-2 font-mono text-[11px] text-ink-3">
        {t.cols.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  );
}

export function SchemaDiagram() {
  return (
    <figure className="rounded-3xl border border-line bg-card p-4 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
            Reporting spine
          </p>
          <ol className="space-y-2">
            {core.map((t, i) => (
              <li key={t.name}>
                <TableCard t={t} />
                {i < core.length - 1 && (
                  <p aria-hidden className="py-0.5 text-center font-mono text-xs text-line-2">
                    ↓ 1 : many
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
            Access, billing & ops
          </p>
          <div className="space-y-2">
            {side.map((t) => (
              <TableCard key={t.name} t={t} />
            ))}
          </div>
        </div>
      </div>
      <figcaption className="mt-5 text-[13px] leading-relaxed text-ink-3">
        Simplified from the Supabase migrations. 🔒 = column not granted to portal roles. Views{" "}
        <span className="font-mono">posts_with_metrics</span>,{" "}
        <span className="font-mono">deliverable_progress</span> and{" "}
        <span className="font-mono">portal_campaigns</span> compute totals live.
      </figcaption>
    </figure>
  );
}
