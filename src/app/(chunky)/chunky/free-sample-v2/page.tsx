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
  StatsBand,
  TrustMarquee,
  TrustTiles,
  UrgencyBar,
} from "@/components/chunky/shared";
import { ReturningNotice } from "@/components/chunky/use-claim";
import { claimConfig } from "@/lib/chunky/config";

export const metadata: Metadata = {
  title: "Free Flower: The Choice Is in Your Hands | Chunky Academy",
};

const stock = claimConfig.stock.total;
const runTotal = stock.runtz + stock.snowcaps;

const steps = [
  {
    title: "Pick a hand",
    body: "Red for 7g of Jolly Rancher Runtz. Blue for 3.5g of Cotton Candy Toast Snowcaps.",
  },
  {
    title: "Claim it with your email",
    body: "First name and email lock in your pick. Change your mind first? Tap the other hand.",
  },
  {
    title: "Land in checkout",
    body: `Your pick is already in the cart with the free-sample discount applied. ${claimConfig.offerNote}`,
  },
];

function BackToChoice({ tone }: { tone: "red" | "blue" }) {
  return (
    <a
      href="#choice"
      className={
        tone === "red"
          ? "inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl border-2 border-runtz bg-runtz/10 font-ca-display text-sm font-black tracking-wide text-runtz-hi uppercase transition hover:bg-runtz/20"
          : "inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl border-2 border-snow bg-snow/10 font-ca-display text-sm font-black tracking-wide text-snow-hi uppercase transition hover:bg-snow/20"
      }
    >
      Take the {tone} hand
      <ArrowUp className="size-4" strokeWidth={2.5} />
    </a>
  );
}

export default function FreeSampleV2() {
  return (
    <>
      <ReturningNotice />
      <UrgencyBar>
        Limited run: only {runTotal} free samples
        <span className="hidden sm:inline">
          {" "}
          · {stock.runtz} in the red hand, {stock.snowcaps} in the blue
        </span>
      </UrgencyBar>
      <div className="relative isolate overflow-hidden bg-black">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <CodeRain />
          <div className="absolute top-[22%] -left-24 size-[26rem] rounded-full bg-runtz/20 blur-[100px] sm:left-[8%]" />
          <div className="absolute top-[22%] -right-24 size-[26rem] rounded-full bg-snow/15 blur-[100px] sm:right-[8%]" />
          {/* Scanlines. */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgb(74_222_128/0.035)_0_1px,transparent_1px_3px)]" />
          <div className="ca-grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
        </div>

        <LanderHeader tone="terminal" />

        <section id="choice" className="scroll-mt-4 px-4 pt-4 pb-12 sm:px-6 sm:pt-8 sm:pb-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="animate-ca-rise font-ca-mono text-[0.72rem] font-bold tracking-[0.06em] text-ca-neon sm:text-sm">
              &gt; the academy is offering you a choice
              <span className="ml-0.5 inline-block w-2 animate-ca-pulse bg-ca-neon">&nbsp;</span>
            </p>
            <h1 className="mt-2 animate-ca-rise font-ca-display font-black tracking-[-0.02em] uppercase [animation-delay:60ms] sm:mt-4">
              <span className="ca-text-green block text-[2.8rem] leading-[0.9] whitespace-nowrap sm:text-7xl">
                Free flower.
              </span>
              <span className="mt-1.5 block text-[1.6rem] leading-[1] text-balance sm:mt-2 sm:text-4xl">
                The choice is in your hands.
              </span>
            </h1>
          </div>
          <div className="mt-4 animate-ca-rise [animation-delay:180ms] sm:mt-10">
            <HandChoice />
          </div>
          <TrustTiles className="mx-auto mt-8 max-w-3xl" />
        </section>
      </div>

      <TrustMarquee tone="terminal" />

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Know what you're choosing"
          title={
            <>
              <span className="ca-text-runtz">Red</span> or <span className="ca-text-snow">blue.</span> Both
              free.
            </>
          }
        />
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:mt-14 md:grid-cols-2 md:gap-5">
          <ProductFeature sample="runtz" label="The red hand" action={<BackToChoice tone="red" />} />
          <ProductFeature sample="snowcaps" label="The blue hand" action={<BackToChoice tone="blue" />} />
        </div>
      </section>

      <section className="border-y border-ca-line bg-ca-bg-2 px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Side by side"
          title={
            <>
              More flower or <span className="ca-text-snow">more frost?</span>
            </>
          }
        />
        <Comparison headers={{ runtz: "The red hand", snowcaps: "The blue hand" }} />
      </section>

      <StatsBand />

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              Choose. Claim. <span className="ca-text-green">Done.</span>
            </>
          }
        />
        <HowItWorks steps={steps} />
      </section>

      <section className="border-t border-ca-line bg-ca-bg-2 px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading eyebrow="FAQ" title="Before you choose" />
        <Faq />
      </section>

      <section className="relative isolate overflow-hidden bg-black px-4 py-20 text-center sm:px-6 sm:py-28">
        <div aria-hidden className="absolute inset-0 -z-10">
          <CodeRain className="opacity-60" />
          <div className="absolute bottom-0 left-[5%] size-80 rounded-full bg-runtz/15 blur-[100px]" />
          <div className="absolute right-[5%] bottom-0 size-80 rounded-full bg-snow/15 blur-[100px]" />
        </div>
        <p className="font-ca-mono text-xs font-bold tracking-[0.06em] text-ca-neon">&gt; still here?</p>
        <h2 className="mx-auto mt-3 max-w-xl font-ca-display text-4xl leading-[0.95] font-black uppercase sm:text-6xl">
          The choice is <span className="ca-text-green">still yours.</span>
        </h2>
        <a
          href="#choice"
          className="mt-8 inline-flex h-14 items-center gap-2 rounded-xl bg-gradient-to-b from-ca-green-2 to-ca-green px-8 font-ca-display font-black tracking-wide text-white uppercase shadow-[0_10px_30px_-6px_rgb(34_197_94/0.7)]"
        >
          Back to the hands
          <ArrowUp className="size-5" strokeWidth={2.5} />
        </a>
      </section>

      <LegalFooter />
    </>
  );
}
