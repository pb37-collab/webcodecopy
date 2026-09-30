import { CaseLayout, projectMetadata } from "@/components/case-layout";
import { BrowserFrame } from "@/components/media";
import { PendingNote, Prose, Section } from "@/components/primitives";
import { getProject } from "@/data/projects";

const project = getProject("cannaconnect-site");
export const metadata = projectMetadata(project);

const SITE = "https://www.cannaconnect.agency/";

export default function Page() {
  return (
    <CaseLayout
      project={project}
      problem={
        <p>
          A cannabis agency sells a point of view. A logo wall doesn&rsquo;t show that. The site had to give
          press and prospects something to cite, share and link to.
        </p>
      }
      built={
        <>
          <p>
            The agency site: services, client proof, a @WeedPorns feed page and a preview of the client
            portal. Plus <strong>Insights</strong>, an editorial publication on cannabis marketing.
          </p>
        </>
      }
      moved={
        <p>
          The agency&rsquo;s point of view got into print: <strong>High Times</strong> profiled
          Canna Connect in &ldquo;Most Cannabis Brands Still Post Like It&rsquo;s 2018&rdquo;
          (April 16, 2026). Medium, America Daily Post, Respect-Mag, Boherald and USA Hemp also
          covered it.
        </p>
      }
    >
      <Section eyebrow="The site" title="cannaconnect.agency">
        <a href={SITE} target="_blank" rel="noreferrer" className="block hover:opacity-90">
          <BrowserFrame src="/images/og.png" alt="cannaconnect.agency" url="cannaconnect.agency" />
        </a>
      </Section>

      <Section eyebrow="Insights" title="Publishing to earn the press.">
        <Prose>
          <p>
            Insights turns what the agency learns running client accounts into articles people can
            cite. It&rsquo;s the same approach as the midterms map: publish something original,
            then let press and prospects find it.
          </p>
        </Prose>
        <div className="mt-6">
          <PendingNote>
            Pending from Parker: Insights screenshots and a list of the top articles, with any
            traffic numbers on record.
          </PendingNote>
        </div>
      </Section>
    </CaseLayout>
  );
}
