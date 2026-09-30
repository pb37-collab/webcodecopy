import Link from "next/link";
import { CaseLayout, projectMetadata } from "@/components/case-layout";
import { Media } from "@/components/media";
import { Flow, PendingNote, Prose, Section } from "@/components/primitives";
import { getProject } from "@/data/projects";

const project = getProject("content-production");
export const metadata = projectMetadata(project);

const models = [
  { need: "Start/end frames, product and text stills", use: "Nano Banana Pro", note: "Most reliable for text and labels. The clean product render goes in as the reference." },
  { need: "Default vertical animation", use: "Kling 3.0 · 9:16 · 5s", note: "The workhorse. True 9:16, stable, sound off, voiceover added in edit." },
  { need: "Time-lapse, native audio", use: "Seedance 2.0", note: "Start and end frames plus audio, for pieces like the growth race." },
  { need: "Anything vertical", use: "✕ Grok Video", note: "Ignored 9:16 and returned landscape. Dropped after one wasted clip." },
];

export default function Page() {
  return (
    <CaseLayout
      project={project}
      problem={
        <p>
          Creative testing needs volume: new hooks, faces and formats every round. Studio shoots and
          creator rosters are too slow and too expensive for a one-person team, and most AI output
          fails brand safety or can&rsquo;t spell a label.
        </p>
      }
      built={
        <>
          <p>
            A production system across Claude (briefs, scripts, review), Midjourney and Higgsfield
            (stills and motion) and OpenClaw. It includes <strong>virtual creators</strong> whose
            faces stay consistent across videos, and prompt rules that keep everything brand-safe.
          </p>
          <p>
            Each round follows the same steps: brief, frames, verify, animate, review, ship. It is
            written down so the whole team can run it.
          </p>
        </>
      }
      moved={
        <>
          <p>
            About <strong>60% less production time</strong>, with output scaled across X,
            Instagram, TikTok and LinkedIn.
          </p>
          <p>
            For Parker&rsquo;s own brands, one round produced <strong>20 stills</strong> and an{" "}
            <strong>8-video UGC slate across five AI creators</strong>.
          </p>
        </>
      }
    >
      <Section eyebrow="The playbook" title="Three steps per finished video.">
        <Flow
          steps={[
            { title: "Start frame", body: "Scene, headline and product baked into a 9:16 still. The clean product render is the reference, so the label stays correct." },
            { title: "Animate", body: "Kling 9:16, standard mode, 5 seconds, sound off. The prompt always ends: 'keep the top text and labels stable and legible.'" },
            { title: "Reveal frame", body: "The payoff (the exact discount or code) is a separate, controlled still. AI never gets to spell a number." },
            { title: "Edit", body: "Splice clip and reveal, then add voiceover, caption and trending audio." },
          ]}
        />
        <Prose className="mt-6">
          <p>
            <strong>Credit discipline:</strong> generate every start frame first, check it, then
            animate only the good ones. Flawed frames are where the budget leaks. Check cost before
            trying any new model or setting.
          </p>
        </Prose>
      </Section>

      <Section eyebrow="Model selection" title="The right model for each job.">
        <div className="overflow-hidden rounded-2xl border border-line">
          {models.map((m, i) => (
            <div
              key={m.use}
              className={`grid gap-1 p-4 sm:grid-cols-[1fr_1fr_1.6fr] sm:gap-4 ${i > 0 ? "border-t border-line" : ""} ${i % 2 ? "bg-card" : ""}`}
            >
              <p className="text-sm text-ink-2">{m.need}</p>
              <p className="font-mono text-[12px] text-ink">{m.use}</p>
              <p className="text-sm text-ink-3">{m.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Guardrails" title="Honest by design.">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { t: "Label it", b: "AI creative is marked AI-produced, here and in the gallery. It's part of the offer." },
            { t: "No fake testimonials", b: "An AI avatar never claims a personal result. Real testimonials come from real people, and paid creators disclose #ad." },
            { t: "Compliance first", b: "Cannabis context is scrubbed for Meta: clean labels, and smoke / pet / food framing instead of cannabis." },
          ].map((g) => (
            <div key={g.t} className="rounded-2xl border border-line bg-card p-5">
              <p className="font-medium text-ink">{g.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{g.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Before → after" title="Same product, reworked for the platform.">
        <div className="grid grid-cols-2 gap-3 md:max-w-2xl">
          <figure className="overflow-hidden rounded-2xl border border-line bg-card">
            <Media src="/content/before-after/before.webp" alt="Before: original label, not allowed on Meta" aspect="4 / 5" />
            <figcaption className="p-3 text-[12.5px] text-ink-3">Before · original label, blocked on Meta</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-line bg-card">
            <Media src="/content/nom/NOM_S6_couch.webp" alt="After: clean Nano Odor Max label" aspect="4 / 5" />
            <figcaption className="p-3 text-[12.5px] text-ink-3">After · clean label, mechanism hook · AI-produced</figcaption>
          </figure>
        </div>
      </Section>

      <Section eyebrow="Client programs" title="The same system, run for clients.">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-card p-5">
            <p className="font-medium text-ink">Frosty Hemp Co</p>
            <ul className="mt-2 space-y-1 text-sm text-ink-2">
              <li>R1: 88 images in 7 content buckets</li>
              <li>R2 &ldquo;After Dark&rdquo;: 80 stills, dark premium macro</li>
              <li>R3: fall-into-winter batch, queued in Buffer</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-card p-5">
            <p className="font-medium text-ink">Chunky Academy</p>
            <ul className="mt-2 space-y-1 text-sm text-ink-2">
              <li>45 premium macro stills</li>
            </ul>
          </div>
        </div>
        <div className="mt-5">
          <PendingNote>
            Sample stills from these programs are added only after each client approves. Until
            then, see Parker&rsquo;s own brands in the{" "}
            <Link href="/content/" className="text-accent">
              content gallery
            </Link>
            .
          </PendingNote>
        </div>
      </Section>
    </CaseLayout>
  );
}
