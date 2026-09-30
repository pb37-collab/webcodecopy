import { CaseLayout, projectMetadata } from "@/components/case-layout";
import { Flow, Prose, Section, StatGrid } from "@/components/primitives";
import { getProject } from "@/data/projects";

const project = getProject("canna-connect");
export const metadata = projectMetadata(project);

export default function Page() {
  return (
    <CaseLayout
      project={project}
      problem={
        <p>
          Cannabis brands were posting like it was 2018: product shots, no voice, no distribution.
          With paid social off the table, most had no way to turn content into customers.
        </p>
      }
      built={
        <>
          <p>
            Co-founded in March 2024. Canna Connect runs creative, influencer, paid (where it&rsquo;s
            allowed) and analytics for <strong>30+ clients</strong> across X, Instagram, Facebook,
            TikTok and LinkedIn.
          </p>
          <p>
            The playbook: distribution through owned and partner accounts, giveaway mechanics,
            native creative, free-sample landing pages that capture the customer, and reporting
            clients can check.
          </p>
        </>
      }
      moved={
        <>
          <p>
            <strong>$100K+</strong> in client sales for a hemp smokables DTC brand from organic
            posting alone, in 3 months. <strong>$10K</strong> in revenue for ZenCo from 10 organic
            posts.
          </p>
          <p>
            Profiled by <strong>High Times</strong>: &ldquo;Most Cannabis Brands Still Post Like
            It&rsquo;s 2018&rdquo; (April 16, 2026).
          </p>
        </>
      }
    >
      <Section eyebrow="Acquisition funnels" title="Free-sample landers that turn reach into repeat buyers.">
        <StatGrid
          stats={[
            { value: "500+", label: "orders in week one, each of the last two campaigns", source: "Parker_J_Beck_Resume_2026" },
            { value: "67%", label: "first-month retention, sample claimers to paid buyers", source: "Parker_J_Beck_Resume_2026" },
            { value: "25M+", label: "impressions, one X campaign for a smoking-device client", source: "Parker_J_Beck_Resume_2026" },
            { value: "50K+", label: "link clicks from that campaign, shot on iPhone", source: "Parker_J_Beck_Resume_2026" },
          ]}
        />
        <Flow
          className="mt-6"
          steps={[
            { title: "Reach", body: "Giveaway and direct posts across owned and partner accounts." },
            { title: "Free-sample lander", body: "One offer, one form, no nav. The claim captures the customer." },
            { title: "Lifecycle", body: "Email and SMS flows turn a free claim into a first paid order." },
            { title: "Report", body: "Post-level numbers roll up into a campaign report the client can see." },
          ]}
        />
      </Section>

      <Section eyebrow="Campaign snapshots" title="What a month of posts looks like.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-card p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
              Cannabis lifestyle brand · giveaways, Mar–Apr 2025
            </p>
            <StatGrid
              className="mt-4 lg:grid-cols-2"
              stats={[
                { value: "1,302,300", label: "impressions from 4 giveaway posts", source: "Campaign sheet (client anonymized)" },
                { value: "34,192", label: "engagements", source: "Campaign sheet (client anonymized)" },
              ]}
            />
          </div>
          <div className="rounded-2xl border border-line bg-card p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
              Cannabis software company · launch, Oct–Nov 2025
            </p>
            <StatGrid
              className="mt-4 lg:grid-cols-2"
              stats={[
                { value: "260K", label: "impressions on the giveaway post", source: "Campaign sheet (client anonymized)" },
                { value: "224K", label: "impressions on the Episode 1 post", source: "Campaign sheet (client anonymized)" },
              ]}
            />
          </div>
        </div>
        <Prose className="mt-6">
          <p>
            Clients are anonymized until they sign off on being named. The numbers are exactly as
            recorded in each campaign&rsquo;s tracking sheet.
          </p>
        </Prose>
      </Section>
    </CaseLayout>
  );
}
