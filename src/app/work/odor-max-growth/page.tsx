import Link from "next/link";
import { CaseLayout, projectMetadata } from "@/components/case-layout";
import { Media, PhoneFrame } from "@/components/media";
import { Flow, PendingNote, Prose, Section } from "@/components/primitives";
import { getProject } from "@/data/projects";

const project = getProject("odor-max-growth");
export const metadata = projectMetadata(project);

const UTM =
  "utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&utm_id={{campaign.id}}";

const STORE = "https://nanogrowmax.com";

const landers = [
  {
    src: "/images/work/lander-nano-nutrient.webp",
    name: "NanoGrow Max · A",
    path: "/pages/nano-nutrient",
    why: "Plain plant-nutrient copy with no cannabis language, so Meta approves it. One offer and one CTA.",
  },
  {
    src: "/images/work/lander-feed-and-bloom.webp",
    name: "NanoGrow Max · B (BLOOMSHIP)",
    path: "/pages/feed-and-bloom",
    why: "The gamified variant: a tap-the-bottle feeding game in place of a static offer. Results go here once they're on record.",
  },
  {
    src: "/images/work/lander-nano-odor-max.webp",
    name: "Nano Odor Max · A",
    path: "/pages/nano-odor-max",
    why: "Framed around smoke, pet, food and car odors. With no reviews yet, the proof is a 30-day money-back guarantee.",
  },
  {
    src: "/images/work/lander-deep-clean.webp",
    name: "Nano Odor Max · B",
    path: "/pages/deep-clean",
    why: "A gamified variant: a room-by-room spray-down game in place of a static offer.",
  },
];

export default function Page() {
  return (
    <CaseLayout
      project={project}
      problem={
        <>
          <p>
            Two new DTC products: <strong>NanoGrow Max</strong>, a two-bottle GroMax + RootMax
            plant-nutrient system, and <strong>Nano Odor Max</strong>, an odor-eliminator spray. The
            natural buyers overlap with cannabis, but Meta bans cannabis context in ads.
          </p>
          <p>
            At launch the store had about one sale: no reviews, no ratings, no social proof.
          </p>
        </>
      }
      built={
        <>
          <p>
            An AI-produced creative stack scrubbed for compliance, one-offer landers, a two-campaign
            Meta structure with a clean UTM taxonomy, and round-by-round creative testing.
          </p>
          <p>
            Hard rule throughout: <strong>no invented reviews or ratings</strong>. The only proof
            used is a +40% verified field trial, a real testimonial from a field-trial partner and a 30-day
            money-back guarantee.
          </p>
        </>
      }
      moved={
        <>
          <p>
            Round 1 bought add-to-carts at <strong>$0.87–$1.09</strong>. By August it was{" "}
            <strong>326 add-to-carts at $1.53</strong>.
          </p>
          <p>
            Cheap add-to-carts that didn&rsquo;t become purchases pointed to the real problem: a
            leak at checkout. Parker found it and fixed it.{" "}
            <strong>This is a testing and diagnosis story, not a sales claim.</strong>
          </p>
        </>
      }
    >
      <Section eyebrow="Compliance gate" title="Before spending a dollar: what can actually run?">
        <Prose>
          <p>
            Five vision-analyst agents scored all <strong>45 existing statics</strong> against an
            ad-psychology rubric and competitor benchmarks, with compliance scored first. A creative
            that gets the ad account banned converts at zero.
          </p>
          <p>
            <strong>11 of the 25 NanoGrow Max statics</strong> were built around cannabis and
            couldn&rsquo;t run on Meta. Most of the odor set was fixable: the concepts were fine but
            the bottle label wasn&rsquo;t. Everything was re-rendered with a clean &ldquo;Nano Odor
            Max&rdquo; label.
          </p>
        </Prose>
        <Flow
          className="mt-8"
          steps={[
            { title: "Score", body: "45 statics rated 1–5 per dimension. Compliance overrides everything else." },
            { title: "Scrub", body: "Cannabis context out: clean labels, 'smoke / vape / pet' instead of 'marijuana'." },
            { title: "Launch set", body: "Round 1: 12 statics (7 NGM, 5 NOM) plus 2 AI UGC videos." },
            { title: "Iterate", body: "Round 2: 20 stills and an 8-video UGC slate across five AI creators. Round 4: new NGM angles." },
          ]}
        />
      </Section>

      <Section eyebrow="Landing pages" title="Two landers per product, one offer each. No nav. Noindex.">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {landers.map((l) => (
            <div key={l.name}>
              <PhoneFrame src={l.src} alt={l.name} />
              <p className="mt-4 font-medium text-ink">{l.name}</p>
              <a
                href={STORE + l.path}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[11px] text-ink-3 hover:text-accent"
              >
                nanogrowmax.com{l.path} ↗
              </a>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{l.why}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[13px] leading-relaxed text-ink-3">
          Paid-traffic landers skip the global nav (every exit costs a sale) and are noindexed so ad
          variants don&rsquo;t compete with the store in search. Each product&rsquo;s B page is
          a gamified variant, tested against its standard page. Results go here once they&rsquo;re on
          record.
        </p>
      </Section>

      <Section eyebrow="Campaign structure" title="Two Sales campaigns, two ad sets each.">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { c: "ngm_sales_prospecting", sets: ["broad_us", "int_gardening"], lp: "/pages/nano-nutrient" },
            { c: "nom_sales_prospecting", sets: ["broad_us", "int_home_pet"], lp: "/pages/nano-odor-max" },
          ].map((row) => (
            <div key={row.c} className="rounded-2xl border border-line bg-card p-5 font-mono text-[12px] text-ink-2">
              <p className="text-ink">{row.c}</p>
              <p className="mt-1 text-ink-3">Sales · Purchase event · Advantage+ placements</p>
              <ul className="mt-3 space-y-1">
                {row.sets.map((s) => (
                  <li key={s}>└ {s}</li>
                ))}
              </ul>
              <p className="mt-3 text-ink-3">→ {row.lp}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">UTM taxonomy</p>
          <pre className="mt-2 overflow-x-auto rounded-2xl border border-line bg-card p-4 font-mono text-[12px] whitespace-pre-wrap break-all text-ink-2">
            {UTM}
          </pre>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-3">
            Campaigns, ad sets and ads are named with underscores so the names come through clean
            in GA4. Each product has its own discount code (GROW10, FRESH10), so a sale can be
            credited to its product.
          </p>
        </div>
      </Section>

      <Section eyebrow="Funnel diagnosis" title="Cheap add-to-carts are a signal, not a result.">
        <Flow
          steps={[
            { title: "Creative works", body: "Add-to-carts at $0.87–$1.09 in Round 1 showed the hooks and offer were landing." },
            { title: "Purchases don't follow", body: "Add-to-cart volume far ahead of purchases means the drop happens after intent." },
            { title: "Find the leak", body: "Walk the path from cart to checkout, event by event, until the break shows up." },
            { title: "Fix, then scale", body: "Fix checkout first, then put spend behind the winning creative." },
          ]}
        />
      </Section>

      <Section eyebrow="Proven winners" title="The creative that earned its spend.">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { src: "/content/nom/NOM_S7_torturetest.webp", alt: "NOM · 'We sprayed it on the worst smell we could find'" },
            { src: "/content/nom/NOM_S6_couch.webp", alt: "NOM · 'It's not you. It's the couch.'" },
            { src: "/content/video/NO_UGC_SOFIA_smoke.webp", alt: "NOM · UGC, AI creator Sofia" },
            { src: "/content/ngm/NGM_S6_value.webp", alt: "NGM · 'A whole harvest. About $6.'" },
          ].map((w) => (
            <figure key={w.src} className="overflow-hidden rounded-2xl border border-line bg-card">
              <Media src={w.src} alt={w.alt} aspect="4 / 5" />
              <figcaption className="p-3 text-[12.5px] leading-snug text-ink-2">
                {w.alt} <span className="text-ink-3">· AI-produced</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-5 text-sm">
          <Link href="/content/" className="text-accent hover:underline">
            See every round in the content gallery →
          </Link>
        </p>
      </Section>

      <Section>
        <PendingNote>
          Pending from Parker: the before/after checkout funnel numbers and the A/B results. The leak gets described in specifics only once
          those numbers are on record.
        </PendingNote>
      </Section>
    </CaseLayout>
  );
}
