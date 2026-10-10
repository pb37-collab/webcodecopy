import type { Metadata } from "next";
import { Eyebrow, PillRow } from "@/components/primitives";
import { hasPublicFile } from "@/lib/media";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: "Parker J. Beck: social media, influencer marketing and AI-powered content operations.",
};

const PDF = "/resume/Parker_J_Beck_Resume_2026.pdf";

// Mirrors Parker_J_Beck_Resume_2026 (Google Doc). The DTC client stays
// anonymous here until it confirms it can be named.
const roles = [
  {
    title: "Co-Founder",
    org: "Canna Connect Agency",
    when: "Mar 2024 – Present",
    points: [
      "Co-founded and lead a full-service digital marketing agency serving 30+ clients across cannabis, consumer goods, hospitality and entertainment. Direct creative, paid, influencer and analytics; manage two marketing interns.",
      "Drove $100K+ in client sales for a hemp smokables DTC brand from organic posting alone within 3 months; generated $10K in revenue for ZenCo from 10 organic posts.",
      "Designed free-sample landing pages and acquisition funnels: the last two campaigns each drove 500+ orders in week one and a 67% first-month retention rate.",
      "Engineered a single X campaign that delivered 25M+ impressions and 50,000+ link clicks for a smoking-device client, shot iPhone-native.",
      "Scaled agency-owned accounts by 800K+ followers and drove 2.5B organic impressions and 1.2B video views in 2024.",
      "Built an AI content and avatar-production system (Claude, Midjourney, Higgsfield, OpenClaw), cutting production time ~60%.",
      "Architected the agency's client and admin platform (Next.js, Supabase, Vercel): client portal, campaign tracking, CSV import and automated KPI dashboards.",
      "Built and published “Midterms 2026, Cannabis Edition,” an interactive D3.js dashboard of candidates' cannabis-policy positions.",
    ],
  },
  {
    title: "Marketing Manager",
    org: "NanoGrow Max + Canna Buust",
    when: "Mar 2026 – Present",
    points: [
      "Build and run full-stack Meta Ads: Pixel and Conversions API, audience architecture, creative testing and ROAS reporting, plus TikTok and Google.",
      "Designed, built and CRO-optimized the Shopify storefronts from scratch.",
      "Built a Klaviyo lifecycle system: 13 automated flows across 39 emails.",
      "Own organic social, content and influencer marketing; produce 100% of brand content, including AI-generated visuals.",
      "Run operations with the 3PL partner: receiving, fulfillment, restock forecasting.",
    ],
  },
  {
    title: "Social Media Manager",
    org: "Bud.com",
    when: "Oct 2024 – Oct 2025",
    points: [
      "Revamped X strategy: 10M+ impressions, +73,000% engagements and +10,000% profile visits in 6 months.",
      "Founded “The Rolling Derby,” a joint-rolling competition across 5 cities with 5M+ social impressions.",
    ],
  },
  {
    title: "Social Media Specialist",
    org: "Kush.com",
    when: "Sept 2024 – May 2025",
    points: ["Re-launched social across X, Instagram and LinkedIn: 6M impressions, +30,000% engagements and +17,000% profile visits in 4 months."],
  },
  {
    title: "Social Media Manager & Equity Partner",
    org: "Glunt",
    when: "Jan 2023 – Oct 2023",
    points: [
      "12x ROAS: $50K+ in sales on $4K ad spend via influencer and paid campaigns; managed 30+ influencer partnerships.",
      "Grew X by 10K followers in 3 months, fully organic.",
    ],
  },
  {
    title: "Head of Content",
    org: "Top Tree Agency",
    when: "Jun 2018 – Dec 2022",
    points: [
      "Directed meme-marketing campaigns for Columbia and Atlantic Records artists including Wiz Khalifa, T-Pain, Missy Elliott, Megan Thee Stallion and Joyner Lucas; scaled agency-owned profiles to 1.4M followers.",
    ],
  },
  {
    title: "Founder",
    org: "Parker Beck Marketing",
    when: "2013 – Mar 2024",
    points: [
      "@WeedPorns and @SkateboardVine: 1.5M+ followers. @WeedPorns drove 2.1B impressions, 783K new followers and 802M media views in 2024.",
      "Campaigns for DraftKings, Mizuno, New Balance and Beats by Dre.",
    ],
  },
];

const stack = [
  "Claude · Claude Code",
  "ChatGPT · Codex",
  "Midjourney",
  "Higgsfield",
  "Runway · Kling · Sora",
  "Meta Ads · CAPI",
  "X · TikTok · Google Ads",
  "Shopify · Klaviyo",
  "Next.js · Supabase · Vercel",
  "D3.js",
  "Adobe CC · Figma · CapCut",
  "Buffer · Sprout Social",
];

export default function Page() {
  const hasPdf = hasPublicFile(PDF);
  return (
    <div className="mx-auto max-w-4xl px-5 pt-12 sm:pt-16">
      <Eyebrow>Resume</Eyebrow>
      <h1 className="mt-3 font-display text-5xl leading-[0.98] sm:text-7xl">Parker J. Beck</h1>
      <p className="mt-4 text-lg text-ink-2">
        Social Media Manager · Influencer Marketing Strategist · AI-Powered Content Operator
      </p>
      <div className="mt-6 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
        {hasPdf && (
          <a href={PDF} className="rounded-full bg-accent px-4 py-2 text-bg hover:opacity-85">
            Download PDF
          </a>
        )}
        <a href={`mailto:${site.email}`} className="rounded-full border border-line-2 px-4 py-2 hover:border-accent hover:text-accent">
          {site.email}
        </a>
        <a href={site.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-line-2 px-4 py-2 hover:border-accent hover:text-accent">
          LinkedIn
        </a>
      </div>

      <p className="mt-10 max-w-3xl text-[15px] leading-relaxed text-ink-2">
        Press-featured social media and influencer marketing professional with 12+ years scaling
        consumer brands, agencies and viral media networks. Early adopter and power user of
        generative AI across the marketing stack. Profiled by High Times for co-founding Canna
        Connect Agency.
      </p>

      <ol className="mt-12 space-y-10">
        {roles.map((r) => (
          <li key={r.org} className="grid gap-2 border-t border-line pt-6 sm:grid-cols-[180px_1fr] sm:gap-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">{r.when}</p>
            <div>
              <p className="font-display text-2xl leading-tight">
                {r.title} <span className="text-ink-3">·</span> {r.org}
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-[14.5px] leading-relaxed text-ink-2 marker:text-line-2">
                {r.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-12 border-t border-line pt-6">
        <Eyebrow>Stack</Eyebrow>
        <PillRow items={stack} className="mt-4" />
      </section>

      <section className="mt-10 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
        <div>
          <Eyebrow>Education</Eyebrow>
          <p className="mt-3 text-sm text-ink-2">B.S. Marketing, Fairleigh Dickinson University</p>
        </div>
        <div>
          <Eyebrow>Certifications</Eyebrow>
          <p className="mt-3 text-sm text-ink-2">
            HubSpot Social Media · Hootsuite · Meta Ads Manager Advanced · X Analytics &amp; Ads
          </p>
        </div>
      </section>
    </div>
  );
}
