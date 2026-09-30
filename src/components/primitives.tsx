import { cn } from "@/lib/utils";

/** Mono uppercase label used above headings and on cards. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3", className)}>
      {children}
    </p>
  );
}

export function Pill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em]",
        tone === "accent" ? "border-accent/60 text-accent" : "border-line-2 text-ink-2",
      )}
    >
      {children}
    </span>
  );
}

export function PillRow({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <Pill key={item}>{item}</Pill>
      ))}
    </div>
  );
}

export type Stat = {
  value: string;
  label: string;
  /** Where the number comes from. Rendered as a tooltip; tracked in docs/research/SOURCES.md. */
  source: string;
};

export function StatGrid({ stats, className }: { stats: readonly Stat[]; className?: string }) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4",
        className,
      )}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card p-4 sm:p-5" title={`Source: ${stat.source}`}>
          <dt className="sr-only">{stat.label}</dt>
          <dd className="font-display text-3xl leading-none text-ink sm:text-4xl">{stat.value}</dd>
          <dd className="mt-2 text-[13px] leading-snug text-ink-2">{stat.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export type FlowStep = { title: string; body: string };

/** Numbered left-to-right (stacked on mobile) process diagram. */
export function Flow({ steps, className }: { steps: readonly FlowStep[]; className?: string }) {
  return (
    <ol className={cn("grid gap-3 md:grid-flow-col md:auto-cols-fr", className)}>
      {steps.map((step, i) => (
        <li key={step.title} className="relative rounded-2xl border border-line bg-card p-4">
          <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
          <p className="mt-2 font-medium text-ink">{step.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{step.body}</p>
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="absolute top-1/2 -right-3 hidden -translate-y-1/2 font-mono text-line-2 md:block"
            >
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-6xl scroll-mt-20 px-5 pt-16 sm:pt-20", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {title && (
        <h2 className="mt-3 max-w-3xl font-display text-3xl leading-[1.05] sm:text-5xl">{title}</h2>
      )}
      <div className={cn(title || eyebrow ? "mt-8" : undefined)}>{children}</div>
    </section>
  );
}

export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-4 text-[15px] leading-relaxed text-ink-2 [&_strong]:font-medium [&_strong]:text-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Honest marker for anything waiting on Parker (assets, sign-off). */
export function PendingNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-line-2 px-4 py-3 font-mono text-[11px] leading-relaxed tracking-wide text-ink-3">
      {children}
    </p>
  );
}
