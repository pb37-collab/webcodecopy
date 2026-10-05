import { ExternalLink } from "lucide-react";
import type { SampleId } from "@/lib/chunky/config";
import { samples, sampleOrder } from "@/lib/chunky/products";
import { cn } from "@/lib/utils";
import { StockBadge } from "./inventory";
import { ProductArt, theme } from "./shared";

/** Product panel in the chunkyacademy.com card style: art, name, price, notes, CTA. */
export function ProductFeature({
  sample,
  label,
  action,
}: {
  sample: SampleId;
  /** Small label over the art, e.g. "Option A" or "The red hand". */
  label: string;
  action: React.ReactNode;
}) {
  const p = samples[sample];
  const t = theme[sample];
  return (
    <article className="overflow-hidden rounded-2xl border border-ca-line bg-ca-card">
      <div className={cn("relative border-b", t.panel)}>
        <div
          aria-hidden
          className={cn("absolute inset-0", sample === "runtz" ? "ca-halftone text-runtz/15" : "ca-frost")}
        />
        <div className="relative flex items-center justify-between p-4">
          <span
            className={cn(
              "rounded-full border px-3 py-1 font-ca-display text-[0.68rem] font-bold tracking-[0.18em] uppercase",
              t.chip,
            )}
          >
            {label}
          </span>
          <span className="font-ca-display text-3xl font-black">{p.weight}</span>
        </div>
        <ProductArt sample={sample} className="relative mx-auto -mt-2 mb-4 w-[68%] max-w-[280px]" />
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="font-ca-display text-[1.65rem] leading-[1.02] font-black tracking-tight uppercase sm:text-3xl">
          {p.nameLines[0]} <span className={t.text}>{p.nameLines[1]}</span>
        </h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-ca-display text-2xl font-black text-ca-neon">FREE</span>
          <span className="text-sm text-ca-ink-3 line-through">{p.retail} USD</span>
          <span className="text-sm text-ca-ink-3">· {p.weightLong}</span>
          <StockBadge sample={sample} className="ml-auto self-center" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[p.type, p.finish].map((chip) => (
            <span
              key={chip}
              className="rounded-lg bg-ca-green/15 px-3 py-1.5 text-[0.72rem] font-bold text-ca-mint"
            >
              {chip}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-ca-ink-2">{p.description}</p>
        <div className="mt-5">
          <p className="text-[0.66rem] font-bold tracking-[0.24em] text-ca-ink-3 uppercase">Flavor profile</p>
          <ul className="mt-2.5 grid grid-cols-3 gap-2">
            {p.notes.map((note) => (
              <li
                key={note}
                className="rounded-lg border border-white/8 bg-ca-navy/70 px-2 py-3 text-center text-[0.76rem] leading-tight font-semibold"
              >
                <span aria-hidden className={cn("mx-auto mb-2 block size-1.5 rounded-full", t.dot)} />
                {note}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">{action}</div>
        <a
          href={p.url}
          className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-ca-ink-3 hover:text-white"
        >
          Full product page and COA <ExternalLink className="size-3" />
        </a>
      </div>
    </article>
  );
}

const rows: { label: string; get: (id: SampleId) => string }[] = [
  { label: "Your sample", get: (id) => `${samples[id].weightLong}, free` },
  { label: "Retail value", get: (id) => samples[id].retail },
  { label: "Type", get: (id) => samples[id].type },
  { label: "Finish", get: (id) => samples[id].finish },
  { label: "Flavor", get: (id) => samples[id].notes.join(", ") },
  { label: "Pick it if", get: (id) => samples[id].pickIf },
];

/** Side-by-side comparison: "more flower" vs "more frost". */
export function Comparison({ headers }: { headers?: Record<SampleId, string> }) {
  return (
    <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-ca-line bg-ca-card">
      <div className="grid grid-cols-[0.8fr_1fr_1fr] border-b border-ca-line sm:grid-cols-[0.7fr_1fr_1fr]">
        <div />
        {sampleOrder.map((id) => (
          <div
            key={id}
            className={cn(
              "flex flex-col items-center gap-1 border-l border-ca-line px-2 py-4 text-center sm:py-6",
              theme[id].panel,
            )}
          >
            <ProductArt sample={id} float={false} className="w-14 sm:w-20" />
            <p
              className={cn(
                "font-ca-display text-base leading-tight font-black uppercase sm:text-xl",
                theme[id].text,
              )}
            >
              {headers?.[id] ?? samples[id].hook}
            </p>
            <p className="text-[0.62rem] font-bold tracking-[0.16em] text-ca-ink-3 uppercase">
              {samples[id].shortName}
            </p>
          </div>
        ))}
      </div>
      <dl>
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[0.8fr_1fr_1fr] border-b border-ca-line last:border-b-0 sm:grid-cols-[0.7fr_1fr_1fr]"
          >
            <dt className="px-3 py-3.5 text-[0.62rem] font-bold tracking-[0.16em] text-ca-ink-3 uppercase sm:px-6 sm:text-[0.7rem]">
              {row.label}
            </dt>
            {sampleOrder.map((id) => (
              <dd
                key={id}
                className="border-l border-ca-line px-3 py-3.5 text-[0.8rem] leading-snug text-ca-ink-2 sm:px-6 sm:text-sm"
              >
                {row.get(id)}
              </dd>
            ))}
          </div>
        ))}
      </dl>
    </div>
  );
}
