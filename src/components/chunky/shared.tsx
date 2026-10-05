import {
  BadgeCheck,
  Camera,
  CreditCard,
  Leaf,
  Mail,
  MapPin,
  Music2,
  Package,
  Star,
  Users,
} from "lucide-react";
import type { SampleId } from "@/lib/chunky/config";
import { claimConfig } from "@/lib/chunky/config";
import { brand, samples, stats, trustPoints } from "@/lib/chunky/products";
import { cn } from "@/lib/utils";

/* Per-product theme: cherry for Runtz, ice for Snowcaps. */
export const theme: Record<
  SampleId,
  { text: string; solid: string; ring: string; glow: string; panel: string; chip: string; dot: string }
> = {
  runtz: {
    text: "ca-text-runtz",
    solid: "bg-runtz text-white",
    ring: "border-runtz shadow-[0_0_0_1px_var(--color-runtz),0_18px_50px_-12px_rgb(244_63_94/0.7)]",
    glow: "bg-[radial-gradient(closest-side,rgb(244_63_94/0.55),rgb(244_63_94/0.15)_55%,transparent)]",
    panel: "bg-[radial-gradient(120%_90%_at_50%_0%,#5b0a21_0%,#22070f_55%,#0d0709_100%)] border-runtz/30",
    chip: "border-runtz/50 text-runtz-hi bg-runtz/10",
    dot: "bg-runtz",
  },
  snowcaps: {
    text: "ca-text-snow",
    solid: "bg-snow text-black",
    ring: "border-snow shadow-[0_0_0_1px_var(--color-snow),0_18px_50px_-12px_rgb(34_211_238/0.65)]",
    glow: "bg-[radial-gradient(closest-side,rgb(34_211_238/0.5),rgb(165_243_252/0.15)_55%,transparent)]",
    panel: "bg-[radial-gradient(120%_90%_at_50%_0%,#0b3a4d_0%,#081a24_55%,#060b0f_100%)] border-snow/30",
    chip: "border-snow/50 text-snow-hi bg-snow/10",
    dot: "bg-snow",
  },
};

export function Logo({ className }: { className?: string }) {
  return (
    <a href={brand.site} aria-label="Chunky Academy home" className={cn("inline-block", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
      <img src={brand.logo} alt="Chunky Academy" width={600} height={300} className="h-full w-auto" />
    </a>
  );
}

/** Red offer strip, as on the current chunkyacademy.com/free-sample. */
export function UrgencyBar({ children }: { children?: React.ReactNode }) {
  return (
    <div className="bg-ca-red px-4 py-2 text-center font-ca-display text-[0.78rem] font-extrabold tracking-[0.06em] text-white uppercase sm:text-sm">
      {children ?? "Limited time offer! Claim your free THCa flower sample"}
    </div>
  );
}

export function LanderHeader({ tone = "default" }: { tone?: "default" | "terminal" }) {
  return (
    <header className="relative z-20 border-b border-ca-line bg-black/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Logo className="h-11 sm:h-14" />
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "hidden text-[0.7rem] font-semibold tracking-[0.18em] text-ca-ink-3 uppercase sm:inline",
              tone === "terminal" && "font-ca-mono tracking-[0.08em]",
            )}
          >
            Trusted since 2020
          </span>
          <span className="rounded-xl bg-gradient-to-b from-ca-green-2 to-ca-green px-3 py-1.5 font-ca-display text-xs font-extrabold tracking-wide text-white shadow-[0_6px_20px_-6px_rgb(34_197_94/0.7)]">
            21+ ONLY
          </span>
        </div>
      </div>
    </header>
  );
}

// Position, size and timing for each floating leaf.
const LEAVES = [
  "left-[6%] top-[12%] size-7 [animation-duration:18s]",
  "left-[88%] top-[8%] size-5 [animation-delay:-3s]",
  "left-[14%] top-[46%] size-4 [animation-duration:11s] [animation-delay:-6s]",
  "left-[92%] top-[40%] size-7 [animation-duration:18s] [animation-delay:-9s]",
  "left-[48%] top-[22%] size-4 [animation-delay:-2s]",
  "left-[72%] top-[64%] size-5 [animation-duration:11s] [animation-delay:-11s]",
  "left-[26%] top-[78%] size-5 [animation-duration:18s] [animation-delay:-5s]",
  "left-[60%] top-[90%] size-4 [animation-delay:-8s]",
];

const SPECKS = [
  "left-[12%] top-[18%]",
  "left-[34%] top-[58%]",
  "left-[57%] top-[34%]",
  "left-[79%] top-[82%]",
  "left-[91%] top-[66%]",
];

/** Floating leaf outlines and specks, like the background on chunkyacademy.com. */
export function LeafField({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {LEAVES.map((pos) => (
        <svg
          key={pos}
          viewBox="0 0 24 24"
          className={cn("absolute animate-ca-drift text-ca-neon/25", pos)}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M5 19C5 11 10 5 19 5c0 9-6 14-14 14Z" />
          <path d="M5 19 13 11" />
        </svg>
      ))}
      {SPECKS.map((pos) => (
        <span key={pos} className={cn("absolute size-1 animate-ca-pulse rounded-full bg-ca-neon/50", pos)} />
      ))}
    </div>
  );
}

/** Product cutout over a soft colored glow, with optional idle float. */
export function ProductArt({
  sample,
  className,
  float = true,
  priority = false,
  glow = true,
}: {
  sample: SampleId;
  className?: string;
  float?: boolean;
  priority?: boolean;
  glow?: boolean;
}) {
  const p = samples[sample];
  return (
    <div className={cn("relative aspect-square", className)}>
      {glow && <div aria-hidden className={cn("absolute inset-[-6%] blur-md", theme[sample].glow)} />}
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
      <img
        src={p.image}
        alt={p.imageAlt}
        width={800}
        height={800}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={cn(
          "relative h-full w-full object-contain drop-shadow-[0_18px_28px_rgb(0_0_0/0.6)]",
          float && (sample === "runtz" ? "animate-ca-float" : "animate-ca-float-late"),
        )}
      />
    </div>
  );
}

/** Tilted "FREE" sticker with the retail price struck through. */
export function FreeSticker({ sample, className }: { sample: SampleId; className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex -rotate-6 flex-col items-center rounded-lg border-2 border-black bg-ca-neon px-2 py-0.5 leading-none text-black shadow-[3px_3px_0_#000]",
        className,
      )}
    >
      <span className="text-[0.62rem] font-bold line-through decoration-2 opacity-70">
        {samples[sample].retail}
      </span>
      <span className="font-ca-display text-base font-black tracking-tight sm:text-lg">FREE</span>
    </div>
  );
}

const iconMask: Record<(typeof trustPoints)[number]["icon"], string> = {
  "grown-in-cali": "[mask-image:url(/images/chunky/icon-grown-in-cali.svg)]",
  "lab-tested": "[mask-image:url(/images/chunky/icon-lab-tested.svg)]",
  "federally-legal": "[mask-image:url(/images/chunky/icon-federally-legal.svg)]",
  "fast-shipping": "[mask-image:url(/images/chunky/icon-fast-shipping.svg)]",
};

/** Green ticker with Chunky's trust icons (the marquee from the current free-sample page). */
export function TrustMarquee({ tone = "default" }: { tone?: "default" | "terminal" }) {
  const items = [...trustPoints, ...trustPoints, ...trustPoints, ...trustPoints];
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-ca-green via-ca-green-2 to-ca-green py-3">
      <div className="flex w-max animate-ca-marquee">
        {items.map((item, i) => (
          <span
            key={i}
            aria-hidden={i >= trustPoints.length}
            className={cn(
              "flex shrink-0 items-center gap-2 px-6 font-ca-display text-sm font-extrabold tracking-wide whitespace-nowrap text-white uppercase",
              tone === "terminal" && "font-ca-mono font-bold tracking-[0.04em]",
            )}
          >
            <span
              className={cn(
                "size-4 bg-white [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]",
                iconMask[item.icon],
              )}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

const tiles = [
  {
    icon: BadgeCheck,
    title: "COA verified",
    body: "Every batch tested",
    tint: "bg-ca-green/15 text-ca-neon",
  },
  { icon: Leaf, title: "2018 Farm Bill", body: "Fully compliant", tint: "bg-ca-orange/15 text-ca-orange" },
  {
    icon: Users,
    title: "10,000+ customers",
    body: "4.9/5 average rating",
    tint: "bg-sky-500/15 text-sky-400",
  },
  {
    icon: Package,
    title: "Discreet shipping",
    body: "Plain, smell-proof",
    tint: "bg-ca-purple/15 text-ca-purple",
  },
];

/** The four trust tiles from the chunkyacademy.com homepage. */
export function TrustTiles({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3", className)}>
      {tiles.map(({ icon: Icon, title, body, tint }) => (
        <div
          key={title}
          className="flex items-center gap-3 rounded-xl border border-white/8 bg-ca-navy/80 p-3"
        >
          <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", tint)}>
            <Icon className="size-4.5" />
          </span>
          <span className="min-w-0">
            <span className="block text-[0.8rem] leading-tight font-bold">{title}</span>
            <span className="block text-[0.7rem] text-ca-ink-3">{body}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/** Rounded outline pill, like "Now live · Subscribe & save" on the site. */
export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-ca-green/50 bg-ca-green/10 px-3.5 py-1.5 font-ca-display text-[0.7rem] font-bold tracking-[0.18em] text-ca-mint uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow && <Pill>{eyebrow}</Pill>}
      <h2 className="mt-4 font-ca-display text-[2rem] leading-[1] font-black tracking-[-0.01em] text-balance uppercase sm:text-5xl">
        {title}
      </h2>
      {sub && <p className="mx-auto mt-3 max-w-md text-ca-ink-2">{sub}</p>}
    </div>
  );
}

/** The green "Trusted by thousands" block from the homepage. */
export function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ca-green-2 via-ca-green to-ca-emerald px-4 py-16 text-center sm:py-20">
      <div aria-hidden className="ca-halftone absolute inset-0 text-white/10" />
      <div className="relative mx-auto max-w-4xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-semibold">
          <Star className="size-4 fill-yellow-300 text-yellow-300" /> Verified reviews from real customers
        </p>
        <h2 className="mt-5 font-ca-display text-[2.6rem] leading-[0.95] font-black uppercase sm:text-6xl">
          Trusted by thousands
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-white/90">
          Join over 10,000 customers who trust Chunky Academy for premium THCa flower.
        </p>
        <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-y-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-ca-display text-4xl font-black sm:text-5xl">{s.value}</dd>
              <dd className="mt-1 text-sm text-white/85">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function HowItWorks({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-3 sm:gap-4">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="relative overflow-hidden rounded-2xl border border-ca-line bg-ca-navy/70 p-5 sm:p-6"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-b from-ca-green-2 to-ca-green font-ca-display text-xl font-black shadow-[0_8px_24px_-8px_rgb(34_197_94/0.8)]">
            {i + 1}
          </span>
          <h3 className="mt-4 font-ca-display text-lg font-extrabold uppercase">{step.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ca-ink-2">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

export const faqItems = [
  {
    q: "How many free samples are there?",
    a: `It's a limited run: ${claimConfig.stock.total.runtz + claimConfig.stock.total.snowcaps} samples total, ${claimConfig.stock.total.runtz} Jolly Rancher Runtz and ${claimConfig.stock.total.snowcaps} Cotton Candy Toast Snowcaps. The counter at the top shows what's left. When a strain hits zero, it's gone.`,
  },
  {
    q: "Is the sample really free? Do I pay anything?",
    a: `The flower is free; you just pay shipping. Your sample goes into your cart with the free-sample discount already applied, and you check out like any other order.`,
  },
  {
    q: "Can I get both samples?",
    a: "One free sample per customer, while supplies last. Duplicate sample orders are automatically canceled, so pick the one you're most curious about. The other one's in the shop.",
  },
  {
    q: "What's the difference between the two?",
    a: "Jolly Rancher Runtz is 7g of frosty sativa-hybrid flower: more weight, sweet candy and tropical fruit. Cotton Candy Toast Snowcaps is 3.5g of hybrid flower rolled in THCa crystal: less weight, a lot more frost.",
  },
  {
    q: "What are Snow Caps?",
    a: "Snow Caps are buds coated in THCa crystal, which gives them that bright white, snowed-on look and a stronger finish than the same flower uncoated.",
  },
  {
    q: "Is this legal?",
    a: "Everything we sell is hemp-derived and meets the 2018 Farm Bill: under 0.3% Δ9-THC by dry weight, third-party lab tested, with a COA for every batch. Hemp laws vary by state, so check yours. You must be 21+ to order.",
  },
  {
    q: "Where do you ship?",
    a: `Fast, discreet shipping nationwide, usually 2 to 5 days. We can't ship to ${brand.noShipStates}.`,
  },
];

export function Faq() {
  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-2.5">
      {faqItems.map((item) => (
        <details
          key={item.q}
          className="group rounded-xl border border-ca-line bg-ca-card/80 px-4 open:border-ca-green/50"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-ca-display text-[0.98rem] font-bold [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden
              className="grid size-7 shrink-0 place-items-center rounded-lg bg-ca-green/15 text-lg leading-none text-ca-neon transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="pb-4 text-sm leading-relaxed text-ca-ink-2">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Footer in the chunkyacademy.com style, with its disclaimer verbatim. */
export function LegalFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-ca-line bg-[#06100a] px-4 pt-12 pb-28 sm:px-6 sm:pb-12">
      <LeafField className="opacity-60" />
      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="rounded-2xl border border-ca-line bg-white/5 px-6 py-4">
            <Logo className="h-12" />
          </div>
          <div className="grid w-full max-w-xl grid-cols-2 gap-3">
            <div className="rounded-xl border border-ca-line bg-white/[0.03] p-4">
              <MapPin className="mx-auto size-5 text-ca-neon" />
              <p className="mt-2 text-[0.66rem] font-bold tracking-[0.18em] text-ca-neon uppercase">
                Distributed by
              </p>
              <p className="mt-1 text-sm font-semibold">{brand.company}</p>
              <p className="text-xs text-ca-ink-3">{brand.location}</p>
            </div>
            <div className="rounded-xl border border-ca-line bg-white/[0.03] p-4">
              <Mail className="mx-auto size-5 text-ca-neon" />
              <p className="mt-2 text-[0.66rem] font-bold tracking-[0.18em] text-ca-neon uppercase">
                Customer support
              </p>
              <a href={`mailto:${brand.support}`} className="mt-1 block text-sm font-semibold break-all">
                {brand.support}
              </a>
            </div>
          </div>
          <div className="flex gap-2">
            {brand.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={`${s.label} ${s.handle}`}
                className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-ca-ink-2 hover:text-white"
              >
                {s.label === "Instagram" ? (
                  <Camera className="size-4" />
                ) : s.label === "TikTok" ? (
                  <Music2 className="size-4" />
                ) : (
                  "𝕏"
                )}
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-xl rounded-xl border border-ca-red/60 bg-ca-red/10 p-4 text-center">
          <p className="font-ca-display text-lg font-black text-ca-red">21+ ONLY</p>
          <p className="mt-1 text-sm text-ca-ink-2">
            You must be 21 years of age or older to purchase these products. By entering this site, you agree
            to our terms and confirm you are of legal age.
          </p>
        </div>

        <div className="mt-8 space-y-3 text-[0.75rem] leading-relaxed text-ca-ink-3">
          <p>
            <span className="font-bold text-ca-ink-2">FREE SAMPLE OFFER:</span> One free sample per customer,
            while supplies last. Duplicate sample orders will be automatically canceled. Chunky Academy may
            change or end this offer at any time.
          </p>
          <p>
            <span className="font-bold text-ca-ink-2">DISCLAIMER:</span> For purchase and use by adults 21
            years of age and older only. Intoxicating products. Keep out of reach of children. Do not use if
            pregnant or nursing. The products displayed and available for sale on this site are hemp-derived
            cannabinoid products that comply with the federal legal limit containing less than zero and
            three-tenths (0.3%) Delta-9 Tetrahydrocannabinol (THC). The products and statements contained in
            this site have not been evaluated or approved by the Food and Drug Administration. These products
            are not intended to diagnose, treat, cure, or prevent any diseases. Results of use may vary. Laws
            governing the legality, availability, and use of hemp vary by state.
          </p>
          <p>
            <span className="font-bold text-ca-ink-2">
              These products are not available for shipment to the following states:
            </span>{" "}
            {brand.noShipStates}
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-ca-line pt-6 text-xs text-ca-ink-3 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {brand.company} All Rights Reserved
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <CreditCard className="size-3.5" /> Secure checkout
            </span>
            <a href={`${brand.site}/shipping-info`} className="hover:text-white">
              Shipping &amp; Returns
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function ConsentNote({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-[0.82rem] font-bold text-white">
        Free flower. Just pay shipping{" "}
        <span className="text-ca-ink-3" aria-hidden>
          |
        </span>{" "}
        Limit one per customer. Must be 21+.
      </p>
      <p className="text-[0.7rem] leading-relaxed text-ca-ink-3">
        Duplicate sample orders will be automatically canceled. By claiming, you agree to get emails from
        Chunky Academy (unsubscribe anytime).
      </p>
    </div>
  );
}
