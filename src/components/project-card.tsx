import Link from "next/link";
import { Media } from "@/components/media";
import { Eyebrow, PillRow } from "@/components/primitives";
import type { Project } from "@/data/projects";

/** Home-page card: body column + visual column, links to the case page. */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const lead = project.stats.slice(0, 2);
  return (
    <Link
      href={`/work/${project.slug}/`}
      className="group grid gap-6 rounded-3xl border border-line bg-card p-5 transition-colors hover:border-line-2 sm:p-7 md:grid-cols-[1.1fr_1fr] md:gap-10"
    >
      <div className="flex min-w-0 flex-col">
        <Eyebrow>
          {String(index + 1).padStart(2, "0")} · {project.eyebrow}
        </Eyebrow>
        <h3 className="mt-3 font-display text-3xl leading-[1.05] sm:text-4xl">{project.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{project.summary}</p>
        {lead.length > 0 && (
          <dl className="mt-5 grid grid-cols-2 gap-4">
            {lead.map((s) => (
              <div key={s.label} title={`Source: ${s.source}`}>
                <dd className="font-display text-2xl text-accent sm:text-3xl">{s.value}</dd>
                <dt className="mt-1 text-[12.5px] leading-snug text-ink-3">{s.label}</dt>
              </div>
            ))}
          </dl>
        )}
        <PillRow items={project.tags} className="mt-6" />
        <span className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2 transition-colors group-hover:text-accent md:mt-auto md:pt-6">
          Read the case →
        </span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line">
        <Media src={project.image.src} alt={project.image.alt} aspect={project.image.aspect} />
      </div>
    </Link>
  );
}
