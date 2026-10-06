import { CaseLayout, projectMetadata } from "@/components/case-layout";
import { BrowserFrame } from "@/components/media";
import { Flow, Section } from "@/components/primitives";
import { getProject } from "@/data/projects";

const project = getProject("midterms-map");
export const metadata = projectMetadata(project);

const LIVE = "https://midterms2026-cannabis-map.vercel.app";

export default function Page() {
  return (
    <CaseLayout
      project={project}
      problem={
        <p>
          Agencies all say they understand the cannabis industry. Very few publish anything that
          proves it, and the 2026 midterms were a moment when cannabis operators needed an
          easy-to-read view of where candidates stand.
        </p>
      }
      built={
        <p>
          <strong>Midterms 2026, Cannabis Edition</strong>: an interactive D3.js map of federal
          candidates&rsquo; cannabis-policy positions. It layers in FEC data, state ballot measures
          and DOJ rescheduling news, and is deployed on Vercel.
        </p>
      }
      moved={
        <p>
          An original thought-leadership asset for Canna Connect. It gives the agency something
          worth sharing with operators, press and prospects besides client work.
        </p>
      }
    >
      <Section eyebrow="Live" title="Try the map.">
        <a href={LIVE} target="_blank" rel="noreferrer" className="block transition-opacity hover:opacity-90">
          <BrowserFrame
            src="/images/work/midterms-map.webp"
            alt="Midterms 2026 cannabis map"
            url="midterms2026-cannabis-map.vercel.app"
          />
        </a>
        <a
          href={LIVE}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-block rounded-full bg-accent px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-bg hover:opacity-85"
        >
          Open the live map ↗
        </a>
      </Section>

      <Section eyebrow="What's on the map" title="Public data, one clear picture.">
        <Flow
          steps={[
            { title: "Candidates", body: "Federal candidates' cannabis-policy positions." },
            { title: "FEC data", body: "Campaign-finance context from the Federal Election Commission." },
            { title: "Ballot measures", body: "State cannabis measures on the 2026 ballot." },
            { title: "Rescheduling", body: "DOJ rescheduling news, as it moves." },
          ]}
        />
        <p className="mt-4 text-[13px] text-ink-3">Built with D3.js, deployed on Vercel.</p>
      </Section>
    </CaseLayout>
  );
}
