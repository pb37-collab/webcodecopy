import type { Metadata } from "next";
import { ArrowUp } from "lucide-react";
import { Comparison, ProductFeature } from "@/components/chunky/features";
import { ChooseButton, SampleChooser } from "@/components/chunky/sample-chooser";
import {
  Faq,
  HowItWorks,
  LanderHeader,
  LegalFooter,
  ProductArt,
  SectionHeading,
  TrustMarquee,
} from "@/components/chunky/shared";
import { ReturningNotice } from "@/components/chunky/use-claim";
import { claimConfig } from "@/lib/chunky/config";

export const metadata: Metadata = {
  title: "Choose Your Free Sample | Chunky Academy",
};

const steps = [
  {
    title: "Pick your sample",
    body: "7g of Jolly Rancher Runtz or 3.5g of Cotton Candy Toast Snowcaps. One per customer.",
  },
  {
    title: "Tell us where to send it",
    body: "First name and email. We'll send your order details and the occasional drop you'll want to hear about.",
  },
  {
    title: "Check out, flower's on us",
    body: `Your sample is already in your cart at $0. ${claimConfig.offerNote}`,
  },
];

export default function FreeSampleV1() {
  return (
    <>
      <ReturningNotice />
      <div className="relative isolate overflow-hidden">
        {/* Ambient light: ruby on the left, frost on the right. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 size-[34rem] rounded-full bg-ruby/25 blur-[110px]" />
          <div className="absolute -top-32 -right-40 size-[34rem] rounded-full bg-frost/20 blur-[110px]" />
          <div className="ca-grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
        </div>

        <LanderHeader />

        <section className="px-4 pt-3 pb-12 sm:px-6 sm:pt-8 sm:pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex animate-ca-rise items-center gap-2 rounded-full border border-ca-line-2 bg-white/[0.03] px-3 py-1.5 text-[0.66rem] font-bold tracking-[0.22em] text-ca-ink-2 uppercase">
              <span className="size-1.5 animate-ca-pulse rounded-full bg-ca-gold" />
              Free sample · While supplies last
            </p>
            <h1 className="mt-3 animate-ca-rise font-ca-display text-[2.45rem] leading-[0.98] font-medium tracking-[-0.035em] text-balance [animation-delay:60ms] sm:mt-5 sm:text-6xl lg:text-7xl">
              Two strains. <span className="ca-text-gold italic">One</span> is on us.
            </h1>
            <p className="mx-auto mt-2.5 max-w-md animate-ca-rise text-[0.95rem] leading-snug text-ca-ink-2 [animation-delay:120ms] sm:mt-5 sm:text-lg">
              More flower or more frost? Pick your free sample. {claimConfig.offerNote}
            </p>
          </div>

          <div className="mt-4 animate-ca-rise [animation-delay:180ms] sm:mt-10">
            <SampleChooser />
          </div>
        </section>
      </div>

      <TrustMarquee />

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Meet the samples"
          title={
            <>
              Equally rare. <span className="italic">Completely</span> different.
            </>
          }
        />
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:mt-14 md:grid-cols-2 md:gap-5">
          <ProductFeature sample="runtz" label="Option A" action={<ChooseButton sample="runtz" className="w-full" />} />
          <ProductFeature
            sample="snowcaps"
            label="Option B"
            action={<ChooseButton sample="snowcaps" className="w-full" />}
          />
        </div>
      </section>

      <section className="border-t border-ca-line bg-ca-bg-2/60 px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Still deciding?"
          title={
            <>
              More flower, or <span className="italic">more frost</span>?
            </>
          }
        />
        <Comparison />
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading eyebrow="How it works" title="Three steps. About thirty seconds." />
        <HowItWorks steps={steps} />
      </section>

      <section className="border-t border-ca-line px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading eyebrow="Questions" title="The fine print, in plain English." />
        <Faq />
      </section>

      <section className="relative isolate overflow-hidden px-4 py-20 text-center sm:px-6 sm:py-28">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-[10%] size-80 rounded-full bg-ruby/20 blur-[100px]" />
          <div className="absolute right-[10%] bottom-0 size-80 rounded-full bg-frost/15 blur-[100px]" />
        </div>
        <div className="mx-auto flex max-w-xs items-end justify-center">
          <ProductArt sample="runtz" className="w-32 -rotate-6 sm:w-40" />
          <ProductArt sample="snowcaps" className="-ml-6 w-32 rotate-6 sm:w-40" />
        </div>
        <h2 className="mx-auto mt-4 max-w-xl font-ca-display text-4xl leading-[1.02] font-medium tracking-[-0.03em] text-balance sm:text-6xl">
          Your sample is <span className="ca-text-gold italic">waiting.</span>
        </h2>
        <p className="mt-3 text-ca-ink-2">One per customer, while supplies last.</p>
        <a
          href="#claim"
          className="mt-8 inline-flex h-14 items-center gap-2 rounded-full bg-gradient-to-b from-ca-gold-2 to-ca-gold px-8 font-extrabold text-ca-bg shadow-[0_10px_30px_-8px_rgb(220_189_133/0.6)]"
        >
          Choose mine
          <ArrowUp className="size-4" />
        </a>
      </section>

      <LegalFooter />
    </>
  );
}
