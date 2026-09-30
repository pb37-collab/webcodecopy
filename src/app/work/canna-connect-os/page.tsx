import { CaseLayout, projectMetadata } from "@/components/case-layout";
import { BrowserFrame } from "@/components/media";
import { Flow, PendingNote, Prose, Section } from "@/components/primitives";
import { SchemaDiagram } from "@/components/schema-diagram";
import { getProject } from "@/data/projects";

const project = getProject("canna-connect-os");
export const metadata = projectMetadata(project);

export default function Page() {
  return (
    <CaseLayout
      project={project}
      problem={
        <p>
          Every client had a monthly Google Sheet: post links, impressions, engagement, link clicks,
          media views, all typed in by hand and totalled by hand. Reporting took hours, and clients
          couldn&rsquo;t see anything between reports.
        </p>
      }
      built={
        <>
          <p>
            <strong>Agency OS</strong>: one source of truth for clients, campaigns, deliverables,
            scheduled posts and post analytics. An admin app for the agency, plus a{" "}
            <strong>client portal</strong> on the same deployment.
          </p>
          <p>
            Built with Next.js (App Router, TypeScript), Tailwind, Supabase (Postgres, Auth,
            Storage) and Vercel crons.
          </p>
        </>
      }
      moved={
        <>
          <p>
            Hand-built monthly reports gave way to live totals, CSV import and AI-written
            performance summaries. Clients now log in and check their own campaigns.
          </p>
          <p>
            The same app runs invoices, onboarding, milestone alerts and the sales pipeline, so the
            agency works from one system instead of a folder of sheets.
          </p>
        </>
      }
    >
      <Section eyebrow="Screens" title="Admin and portal, shown with the demo client.">
        <div className="grid gap-5 lg:grid-cols-2">
          <BrowserFrame
            src="/images/proof/portal-screen.webp"
            alt="Client portal, Highland Harvest Co. (demo)"
            url="portal · Highland Harvest Co. (demo)"
          />
          <BrowserFrame
            src="/images/work/ccos-admin.webp"
            alt="Admin campaign view, demo data"
            url="admin · campaigns (demo data)"
          />
        </div>
        <p className="mt-4 text-[13px] text-ink-3">
          All screenshots use Highland Harvest Co., a demo client flagged{" "}
          <span className="font-mono">is_demo</span>. It works fully in the portal but stays out of
          agency roll-ups and Slack digests. No real client data is shown.
        </p>
      </Section>

      <Section eyebrow="Data model" title="Clients → campaigns → deliverables → posts → metrics.">
        <SchemaDiagram />
        <Prose className="mt-6">
          <p>
            Column names in the first migration match the old spreadsheet, so a month of CSV
            imports cleanly. Post metrics are <strong>append-only snapshots</strong>, so a
            post&rsquo;s growth over time is kept instead of overwritten. There are seven post
            kinds (giveaway, direct, quote tweet, article, threaded reply, 24-hour retweet,
            Instagram collab) across X and Instagram.
          </p>
        </Prose>
      </Section>

      <Section eyebrow="Security" title="Row-level security: each client sees only their own rows.">
        <div className="grid gap-5 lg:grid-cols-2">
          <Prose>
            <p>
              The admin app uses Supabase&rsquo;s service role and is the only thing that can write
              reporting data. Portal users sign in and query with their own session, so{" "}
              <strong>Postgres row-level security</strong> decides what they see.
            </p>
            <p>
              A <span className="font-mono text-ink">client_users</span> table maps each login to one
              client. Every portal policy is read-only and has the same shape, shown on the right.
            </p>
            <p>
              <strong>Column grants</strong> go further. Portal roles can&rsquo;t read deal value,
              invoice status or internal notes on a campaign. The portal reads those columns
              through a <span className="font-mono text-ink">security_invoker</span> view instead.
              Tasks, prospects, payments and alerts have RLS on and no portal policy, so the portal
              can&rsquo;t see them at all.
            </p>
          </Prose>
          <div className="space-y-4">
            <pre className="overflow-x-auto rounded-2xl border border-line bg-card p-4 font-mono text-[12px] leading-relaxed text-ink-2">
{`-- the shape of every portal read policy
create policy "portal reads own rows"
  on posts for select
  to authenticated
  using (
    client_id in (
      select client_id from client_users
      where user_id = auth.uid()
    )
  );`}
            </pre>
            <Flow
              className="md:grid-flow-row md:auto-cols-auto"
              steps={[
                { title: "rls-check", body: "An anon key with no session must see 0 rows across 7 tables and 3 views. Any row counts as a leak." },
                { title: "portal-rls-check", body: "Sign in as client A: A's rows only, none of B's, no financial columns, no tasks. Then clean up." },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section eyebrow="Automation" title="The agency runs on crons, not reminders.">
        <Flow
          steps={[
            { title: "Daily 12:00 UTC", body: "A daily job checks campaign progress and sends one-time alerts at 85% (time to re-up) and 100%." },
            { title: "Mondays 13:00 UTC", body: "A weekly Slack digest for the team. Demo clients are left out." },
            { title: "Invoices", body: "Pay links live in the portal. Marking an invoice paid clears them so nobody pays twice." },
            { title: "Onboarding", body: "Question templates and portal uploads. Clients can only write to their own open onboarding." },
          ]}
        />
      </Section>

      <Section>
        <PendingNote>
          Pending from Parker: fresh admin and portal screenshots of the demo client (Highland
          Harvest Co.), exported to /public/images/proof/ and /public/images/work/.
        </PendingNote>
      </Section>
    </CaseLayout>
  );
}
