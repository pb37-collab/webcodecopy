import type { Metadata } from "next";
import { ArrowUp } from "lucide-react";
import { CodeRain } from "@/components/chunky/code-rain";
import { Comparison, ProductFeature } from "@/components/chunky/features";
import { HandChoice } from "@/components/chunky/hand-choice";
import {
  Faq,
  HowItWorks,
  LanderHeader,
  LegalFooter,
  SectionHeading,
  TrustMarquee,
} from "@/components/chunky/shared";
import { ReturningNotice } from "@/components/chunky/use-claim";
import { claimConfig } from "@/lib/chunky/config";

export const metadata: Metadata = {
  title: "Pick a Hand | Free Sample | Chunky Academy",
};

const steps = [
  {
    title: "Unlock the choice",
    body: "Drop your first name and email. That's what opens the hands.",
  },
  {
    title: "Pick a hand",
    body: "Red for 7g of Jolly Rancher Runtz. Blue for 3.5g of Cotton Candy Toast Snowcaps.",
  },
  {
    title: "Land in your cart",
    body: `Your pick is already in the cart at $0. ${claimConfig.offerNote}`,
  },
];

function BackToChoice({ tone }: { tone: "red" | "blue" }) {
  return (
    <a
      href="#choice"
      className={
        tone === "red"
          ? "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#ff2e4d]/60 text-sm font-bold text-[#ff8197] transition hover:bg-[#ff2e4d]/10"
          : "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#4db8ff]/60 text-sm font-bold text-[#a6dcff] transition hover:bg-[#4db8ff]/10"
      }
    >
      Take the {tone} hand
      <ArrowUp className="size-4" />
    </a>
  );
}

export default function FreeSampleV2() {
  return (
    <>
      <ReturningNotice />
      <div className="relative isolate overflow-hidden bg-[#060608]">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <CodeRain />
          <div className="absolute top-[18%] -left-24 size-[26rem] rounded-full bg-[#ff2e4d]/20 blur-[100px] sm:left-[8%]" />
          <div className="absolute top-[18%] -right-24 size-[26rem] rounded-full bg-[#4db8ff]/18 blur-[100px] sm:right-[8%]" />
          {/* Scanlines. */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgb(255_255_255/0.025)_0_1px,transparent_1px_3px)]" />
          <div className="ca-grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
        </div>

        <LanderHeader tone="terminal" />

        <section id="choice" className="scroll-mt-4 px-4 pt-2 pb-14 sm:px-6 sm:pt-6 sm:pb-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="animate-ca-rise font-ca-mono text-[0.7rem] tracking-[0.12em] text-ca-ink-2 sm:text-xs">
              &gt; one free sample. two hands. no going back
              <span className="ml-0.5 inline-block w-2 animate-ca-pulse bg-ca-ink-2">&nbsp;</span>
            </p>
            <h1 className="mt-2 animate-ca-rise font-ca-display text-[2.7rem] leading-[0.95] font-medium tracking-[-0.035em] [animation-delay:60ms] sm:mt-4 sm:text-7xl">
              Pick a <span className="italic">hand.</span>
            </h1>
            <p className="mx-auto mt-2.5 max-w-sm animate-ca-rise text-[0.92rem] leading-snug text-ca-ink-2 [animation-delay:120ms] sm:mt-4 sm:max-w-md sm:text-lg">
              Take the <span className="font-semibold text-[#ff6b82]">Runtz</span> and the story stays sweet.
              Take the <span className="font-semibold text-[#8fd0ff]">Snowcaps</span> and see how deep the
              frost goes.
            </p>
          </div>
          <div className="mt-4 animate-ca-rise [animation-delay:180ms] sm:mt-10">
            <HandChoice />
          </div>
        </section>
      </div>

      <TrustMarquee tone="terminal" />

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Know what you're choosing"
          title={
            <>
              Red or blue. <span className="italic">Both</span> worth it.
            </>
          }
        />
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:mt-14 md:grid-cols-2 md:gap-5">
          <ProductFeature sample="runtz" label="The red hand" action={<BackToChoice tone="red" />} />
          <ProductFeature sample="snowcaps" label="The blue hand" action={<BackToChoice tone="blue" />} />
        </div>
      </section>

      <section className="border-t border-ca-line bg-ca-bg-2/60 px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Side by side"
          title={
            <>
              More flower, or <span className="italic">more frost</span>?
            </>
          }
        />
        <Comparison headers={{ runtz: "The red hand", snowcaps: "The blue hand" }} />
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading eyebrow="How it works" title="Unlock. Choose. Done." />
        <HowItWorks steps={steps} />
      </section>

      <section className="border-t border-ca-line px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading eyebrow="Questions" title="Before you choose." />
        <Faq />
      </section>

      <section className="relative isolate overflow-hidden bg-[#060608] px-4 py-20 text-center sm:px-6 sm:py-28">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-[5%] size-80 rounded-full bg-[#ff2e4d]/15 blur-[100px]" />
          <div className="absolute right-[5%] bottom-0 size-80 rounded-full bg-[#4db8ff]/15 blur-[100px]" />
        </div>
        <p className="font-ca-mono text-xs tracking-[0.12em] text-ca-ink-3">&gt; still here?</p>
        <h2 className="mx-auto mt-3 max-w-xl font-ca-display text-4xl leading-[1.02] font-medium tracking-[-0.03em] text-balance sm:text-6xl">
          The choice is <span className="ca-text-gold italic">still yours.</span>
        </h2>
        <a
          href="#choice"
          className="mt-8 inline-flex h-14 items-center gap-2 rounded-full bg-ca-ink px-8 font-extrabold text-ca-bg"
        >
          Back to the hands
          <ArrowUp className="size-4" />
        </a>
      </section>

      <LegalFooter />
    </>
  );
}
