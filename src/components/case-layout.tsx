import Link from "next/link";
import { Eyebrow, PillRow, StatGrid } from "@/components/primitives";
import { projects, type Project } from "@/data/projects";

/**
 * Case-study hero + the three questions every page answers: the problem, what
 * was built, and what moved. Page-specific sections go in `children`.
 */
export function CaseLayout({
  project,
  problem,
  built,
  moved,
  children,
}: {
  project: Project;
  problem: React.ReactNode;
  built: React.ReactNode;
  moved: React.ReactNode;
  children?: React.ReactNode;
}) {
  const i = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(i + 1) % projects.length];
  return (
    <article>
      <header className="mx-auto max-w-6xl px-5 pt-12 sm:pt-16">
        <Link
          href="/#work"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3 hover:text-accent"
        >
          ← All work
        </Link>
        <Eyebrow className="mt-8">{project.eyebrow}</Eyebrow>
        <h1 className="mt-3 max-w-4xl font-display text-5xl leading-[0.98] sm:text-7xl">
          {project.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{project.summary}</p>
        <PillRow items={project.tags} className="mt-6" />
        {project.stats.length > 0 && <StatGrid stats={project.stats} className="mt-10" />}
      </header>

      <section className="mx-auto mt-14 grid max-w-6xl gap-px overflow-hidden px-5 md:grid-cols-3">
        <Question n="01" label="The problem">
          {problem}
        </Question>
        <Question n="02" label="What Parker built">
          {built}
        </Question>
        <Question n="03" label="What moved">
          {moved}
        </Question>
      </section>

      {children}

      <nav className="mx-auto mt-24 max-w-6xl px-5">
        <Link
          href={`/work/${next.slug}/`}
          className="group flex flex-col gap-2 rounded-3xl border border-line bg-card p-6 transition-colors hover:border-line-2 sm:flex-row sm:items-end sm:justify-between"
        >
          <span>
            <Eyebrow>Next case</Eyebrow>
            <span className="mt-2 block font-display text-3xl sm:text-4xl">{next.title}</span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2 group-hover:text-accent">
            Continue →
          </span>
        </Link>
      </nav>
    </article>
  );
}

function Question({ n, label, children }: { n: string; label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-5 pb-6 md:pr-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
        {n} · {label}
      </p>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-2 [&_strong]:font-medium [&_strong]:text-ink">
        {children}
      </div>
    </div>
  );
}

export function projectMetadata(project: Project) {
  return { title: project.title, description: project.summary };
}
