import type { SampleId } from "@/lib/chunky/config";
import { claimConfig } from "@/lib/chunky/config";
import { samples, trustPoints } from "@/lib/chunky/products";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <a
      href="https://www.chunkyacademy.com/"
      className={cn("group inline-flex items-baseline gap-1.5 leading-none", className)}
      aria-label="Chunky Academy home"
    >
      <span className="font-ca-display text-[1.35rem] font-semibold tracking-[-0.02em] text-ca-ink italic">
        Chunky
      </span>
      <span className="text-[0.62rem] font-semibold tracking-[0.32em] text-ca-gold uppercase">Academy</span>
    </a>
  );
}

export function LanderHeader({ tone = "default" }: { tone?: "default" | "terminal" }) {
  return (
    <header className="relative z-20 mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
      <Wordmark />
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "hidden text-[0.68rem] tracking-[0.22em] text-ca-ink-3 uppercase sm:inline",
            tone === "terminal" && "font-ca-mono tracking-[0.12em]",
          )}
        >
          Lab tested · Since 2020
        </span>
        <span className="rounded-full border border-ca-line-2 px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.14em] text-ca-ink-2">
          21+
        </span>
      </div>
    </header>
  );
}

const glowBySample: Record<SampleId, string> = {
  runtz: "bg-[radial-gradient(closest-side,rgb(224_41_79/0.55),rgb(224_41_79/0.18)_55%,transparent)]",
  snowcaps: "bg-[radial-gradient(closest-side,rgb(159_214_255/0.5),rgb(245_185_214/0.2)_55%,transparent)]",
};

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
      {glow && <div aria-hidden className={cn("absolute inset-[-8%] blur-md", glowBySample[sample])} />}
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
          "relative h-full w-full object-contain drop-shadow-[0_18px_30px_rgb(0_0_0/0.55)]",
          float && (sample === "runtz" ? "animate-ca-float" : "animate-ca-float-late"),
        )}
      />
    </div>
  );
}

export function TrustMarquee({ tone = "default" }: { tone?: "default" | "terminal" }) {
  const items = [...trustPoints, ...trustPoints];
  return (
    <div className="relative overflow-hidden border-y border-ca-line bg-ca-bg-2/80 py-3.5">
      <div className="flex w-max animate-ca-marquee gap-10 pr-10">
        {items.map((item, i) => (
          <span
            key={i}
            aria-hidden={i >= trustPoints.length}
            className={cn(
              "flex items-center gap-10 text-[0.7rem] font-semibold tracking-[0.24em] whitespace-nowrap text-ca-gold uppercase",
              tone === "terminal" && "font-ca-mono font-normal tracking-[0.14em] text-ca-ink-2",
            )}
          >
            {item}
            <span aria-hidden className="text-ca-ink-3">
              ✦
            </span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-ca-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-ca-bg to-transparent" />
    </div>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-[0.68rem] font-semibold tracking-[0.3em] text-ca-gold uppercase sm:text-xs",
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
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-ca-display text-[2rem] leading-[1.05] font-medium tracking-[-0.02em] text-balance sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}

export function HowItWorks({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-3 sm:gap-4">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="relative overflow-hidden rounded-2xl border border-ca-line bg-ca-card/70 p-5 sm:p-6"
        >
          <span className="font-ca-display text-4xl text-ca-gold/90 italic">0{i + 1}</span>
          <h3 className="mt-3 text-base font-bold tracking-tight">{step.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ca-ink-2">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

export const faqItems = [
  {
    q: "Is the sample really free?",
    a: `Yes. The flower is on us. ${claimConfig.offerNote} Your sample is added to your cart at no charge and you finish checkout like any other order.`,
  },
  {
    q: "Can I get both samples?",
    a: "One free sample per customer and per household, while supplies last. Pick the one you're most curious about. The other one's in the shop.",
  },
  {
    q: "What's the difference between the two?",
    a: "Jolly Rancher Runtz is 7g of classic cured flower: more volume, bright fruit-forward terps. Cotton Candy Toast Snowcaps is 3.5g of flower rolled in THCa crystal: less weight, a lot more frost.",
  },
  {
    q: "What are Snowcaps?",
    a: "Snowcaps are buds coated in THCa crystal (isolate), which gives them their bright white, freshly-snowed-on look and a stronger finish than the same flower uncoated.",
  },
  {
    q: "Is this legal?",
    a: "Our products are hemp-derived and 2018 Farm Bill compliant, testing below 0.3% Δ9-THC on a dry-weight basis, with a lab report (COA) for every batch. Local laws vary: check yours before ordering. You must be 21+ to order and to sign for delivery.",
  },
  {
    q: "How does it ship?",
    a: "In plain, discreet, smell-proof packaging. An adult 21+ may need to be present to receive it.",
  },
];

export function Faq() {
  return (
    <div className="mx-auto mt-10 max-w-3xl divide-y divide-ca-line border-y border-ca-line">
      {faqItems.map((item) => (
        <details key={item.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[0.95rem] font-semibold [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden
              className="grid size-7 shrink-0 place-items-center rounded-full border border-ca-line-2 text-ca-gold transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="pb-5 text-sm leading-relaxed text-ca-ink-2">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function LegalFooter() {
  return (
    <footer className="border-t border-ca-line bg-ca-bg-2 px-4 pt-12 pb-28 sm:px-6 sm:pb-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Wordmark />
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ca-ink-2">
            <a className="hover:text-ca-ink" href="https://www.chunkyacademy.com/products">
              Shop
            </a>
            <a className="hover:text-ca-ink" href="https://www.chunkyacademy.com/about">
              About
            </a>
            <a className="hover:text-ca-ink" href="https://www.chunkyacademy.com/shipping-info">
              Shipping
            </a>
          </nav>
        </div>
        <div className="mt-8 space-y-3 text-[0.72rem] leading-relaxed text-ca-ink-3">
          <p>
            Offer valid for one free sample per customer and household, while supplies last. Must be 21 or
            older. Void where prohibited. Chunky Academy may change or end this offer at any time.
          </p>
          <p>
            Products contain less than 0.3% Δ9-THC on a dry-weight basis in compliance with the 2018 Farm
            Bill. THCa converts to Δ9-THC when heated. Use may result in a positive drug test. Keep out of
            reach of children and pets. Do not drive or operate machinery after use.
          </p>
          <p>
            These statements have not been evaluated by the Food and Drug Administration. These products are
            not intended to diagnose, treat, cure or prevent any disease.
          </p>
          <p>© {new Date().getFullYear()} Chunky Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function ConsentNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-[0.7rem] leading-relaxed text-ca-ink-3", className)}>
      By claiming, you confirm you&apos;re 21+ and agree to get emails from Chunky Academy. Unsubscribe
      anytime. One per customer.
    </p>
  );
}
