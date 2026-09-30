import Link from "next/link";
import { Media } from "@/components/media";
import { ProjectCard } from "@/components/project-card";
import { Eyebrow, Prose, Section, StatGrid, type Stat } from "@/components/primitives";
import { projects, roleFilters } from "@/data/projects";
import { site } from "@/lib/site";

const RESUME = "Parker_J_Beck_Resume_2026";

const headline: readonly Stat[] = [
  { value: "2.5B+", label: "organic impressions in 2024", source: RESUME },
  { value: "1.2B", label: "video views in 2024", source: RESUME },
  { value: "800K+", label: "new followers across agency-owned accounts, 2024", source: RESUME },
  { value: "12+ yrs", label: "scaling brands, agencies and viral media", source: RESUME },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 pt-14 sm:pt-20 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <Eyebrow>Social · Growth · Marketing engineering · Creative ops</Eyebrow>
          <h1 className="mt-5 font-display text-[3.4rem] leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            Growth for brands <em className="text-accent">that can&rsquo;t buy ads.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
            I&rsquo;m Parker Beck. I grow audiences organically, test paid traffic hard and build
            the tools that run it all, mostly in cannabis, where Meta and Google take paid reach
            off the table and results have to be earned.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
            <Link href="#work" className="rounded-full bg-accent px-5 py-2.5 text-bg hover:opacity-85">
              See the work
            </Link>
            <Link
              href="/content/"
              className="rounded-full border border-line-2 px-5 py-2.5 text-ink hover:border-accent hover:text-accent"
            >
              Content gallery
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="rounded-full border border-line-2 px-5 py-2.5 text-ink hover:border-accent hover:text-accent"
            >
              Email me
            </a>
          </div>
        </div>
        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-line lg:mx-0">
          <Media src="/images/team/parker-beck.webp" alt="Parker Beck" aspect="4 / 5" priority />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 pt-12">
        <StatGrid stats={headline} />
      </div>

      <Section eyebrow="Hiring for" title="Start with the work that fits your role.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {roleFilters.map((role) => (
            <div key={role.key} className="rounded-2xl border border-line bg-card p-4">
              <p className="font-medium text-ink">{role.label}</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {projects
                  .filter((p) => p.roles.includes(role.key))
                  .map((p) => (
                    <li key={p.slug}>
                      <Link href={`/work/${p.slug}/`} className="text-ink-2 hover:text-accent">
                        {p.title} →
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="work" eyebrow="Selected work" title="Seven projects. What was wrong, what I built, what moved.">
        <div className="space-y-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Why cannabis" title="The hardest category to grow in is the best proof.">
        <Prose>
          <p>
            Cannabis brands can&rsquo;t run most paid social. Meta and Google restrict the
            category, so the usual lever of spending into growth mostly doesn&rsquo;t exist.{" "}
            <strong>Most results on this site were earned organically</strong>. The paid ones were
            bought with creative scrubbed to pass ad review.
          </p>
          <p>
            That constraint shaped how I work: own the audience (@WeedPorns), turn it into a
            distribution network for clients (Canna Connect), build the reporting so clients can see
            what it earned (Canna Connect OS), and treat every paid test as a diagnosis (Nano Odor
            Max).
          </p>
        </Prose>
      </Section>
    </>
  );
}
