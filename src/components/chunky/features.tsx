import type { SampleId } from "@/lib/chunky/config";
import { samples } from "@/lib/chunky/products";
import { cn } from "@/lib/utils";
import { ProductArt } from "./shared";

const panelTheme: Record<SampleId, { bg: string; texture: string; text: string; chip: string; dot: string }> =
  {
    runtz: {
      bg: "bg-[radial-gradient(90%_70%_at_50%_10%,#52091f_0%,#21080f_50%,#110a0d_100%)] border-ruby/25",
      texture: "ca-facets",
      text: "ca-text-ruby",
      chip: "border-ruby/40 text-ruby-hi",
      dot: "bg-ruby",
    },
    snowcaps: {
      bg: "bg-[radial-gradient(90%_70%_at_50%_10%,#222c55_0%,#15152b_50%,#0d0d17_100%)] border-frost/25",
      texture: "ca-frost",
      text: "ca-text-frost",
      chip: "border-frost/40 text-frost-hi",
      dot: "bg-frost",
    },
  };

/** Editorial panel for one product: art, story, tasting notes, CTA. */
export function ProductFeature({
  sample,
  label,
  action,
}: {
  sample: SampleId;
  /** Small caps label over the name, e.g. "Option A" or "The red hand". */
  label: string;
  action: React.ReactNode;
}) {
  const p = samples[sample];
  const t = panelTheme[sample];
  return (
    <article className={cn("relative overflow-hidden rounded-[1.75rem] border", t.bg)}>
      <div aria-hidden className={cn("absolute inset-0 opacity-60", t.texture)} />
      <div className="relative p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <p className="text-[0.66rem] font-bold tracking-[0.3em] text-ca-ink-2 uppercase">{label}</p>
          <p className="font-ca-display text-3xl font-semibold tracking-[-0.03em]">{p.weight}</p>
        </div>
        <ProductArt sample={sample} className="mx-auto my-2 w-[72%] max-w-[300px]" />
        <h3 className="font-ca-display text-[2rem] leading-[1.02] font-medium tracking-[-0.02em] sm:text-[2.4rem]">
          {p.nameLines[0]} <span className={cn("italic", t.text)}>{p.nameLines[1]}</span>
        </h3>
        <p className="mt-2 text-sm font-semibold text-ca-ink-2">{p.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[p.type, p.weightLong, p.finish].map((chip) => (
            <span
              key={chip}
              className={cn(
                "rounded-full border px-3 py-1 text-[0.7rem] font-bold tracking-[0.08em]",
                t.chip,
              )}
            >
              {chip}
            </span>
          ))}
        </div>
        <p className="mt-5 text-[0.95rem] leading-relaxed text-ca-ink-2">{p.description}</p>
        <div className="mt-6 border-t border-ca-line pt-5">
          <p className="text-[0.66rem] font-bold tracking-[0.28em] text-ca-ink-3 uppercase">Tasting notes</p>
          <ul className="mt-3 grid grid-cols-3 gap-2">
            {p.notes.map((note) => (
              <li
                key={note}
                className="rounded-xl border border-ca-line bg-black/20 px-2 py-3 text-center text-[0.78rem] leading-tight font-semibold"
              >
                <span aria-hidden className={cn("mx-auto mb-2 block size-1.5 rounded-full", t.dot)} />
                {note}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-7">{action}</div>
      </div>
    </article>
  );
}

const rows: { label: string; get: (id: SampleId) => string }[] = [
  { label: "Weight", get: (id) => samples[id].weightLong },
  { label: "Type", get: (id) => samples[id].type },
  { label: "Finish", get: (id) => samples[id].finish },
  { label: "Profile", get: (id) => samples[id].notes.join(", ") },
  { label: "Pick it if", get: (id) => samples[id].pickIf },
];

/** Side-by-side comparison: "more flower" vs "more frost". */
export function Comparison({ headers }: { headers?: Record<SampleId, string> }) {
  return (
    <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-[1.5rem] border border-ca-line bg-ca-card/60">
      <div className="grid grid-cols-[0.8fr_1fr_1fr] border-b border-ca-line sm:grid-cols-[0.7fr_1fr_1fr]">
        <div />
        {(["runtz", "snowcaps"] as const).map((id) => (
          <div
            key={id}
            className={cn(
              "flex flex-col items-center gap-1 px-2 py-4 text-center sm:py-6",
              id === "runtz"
                ? "bg-[radial-gradient(circle_at_50%_0%,rgb(224_41_79/0.22),transparent_70%)]"
                : "bg-[radial-gradient(circle_at_50%_0%,rgb(159_214_255/0.2),transparent_70%)]",
            )}
          >
            <ProductArt sample={id} float={false} className="w-14 sm:w-20" />
            <p
              className={cn(
                "font-ca-display text-base leading-tight font-medium italic sm:text-xl",
                id === "runtz" ? "ca-text-ruby" : "ca-text-frost",
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
            <dt className="px-3 py-3.5 text-[0.62rem] font-bold tracking-[0.18em] text-ca-ink-3 uppercase sm:px-6 sm:text-[0.7rem]">
              {row.label}
            </dt>
            {(["runtz", "snowcaps"] as const).map((id) => (
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
