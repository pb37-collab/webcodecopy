import type { Metadata } from "next";
import { ArrowUp, Gift } from "lucide-react";
import { Comparison, ProductFeature } from "@/components/chunky/features";
import { ChooseButton, SampleChooser } from "@/components/chunky/sample-chooser";
import {
  Faq,
  HowItWorks,
  LanderHeader,
  LeafField,
  LegalFooter,
  Pill,
  ProductArt,
  SectionHeading,
  SpotsLeft,
  StatsBand,
  TrustMarquee,
  TrustTiles,
  UrgencyBar,
} from "@/components/chunky/shared";
import { ReturningNotice } from "@/components/chunky/use-claim";
import { claimConfig } from "@/lib/chunky/config";

export const metadata: Metadata = {
  title: "Claim Your Free Sample | Chunky Academy",
};

const steps = [
  {
    title: "Pick your sample",
    body: "7g of Jolly Rancher Runtz or 3.5g of Cotton Candy Toast Snowcaps. One per customer.",
  },
  {
    title: "Drop your email",
    body: "First name and email. We send your order details and first dibs on new drops.",
  },
  {
    title: "Check out, flower's on us",
    body: `Your sample lands in checkout with the free-sample discount applied. ${claimConfig.offerNote}`,
  },
];

export default function FreeSampleV1() {
  return (
    <>
      <ReturningNotice />
      <UrgencyBar />
      <div className="relative isolate overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 size-[30rem] rounded-full bg-runtz/20 blur-[110px]" />
          <div className="absolute -top-24 -right-32 size-[30rem] rounded-full bg-snow/15 blur-[110px]" />
          <div className="absolute top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-ca-green/15 blur-[120px]" />
          <LeafField />
          <div className="ca-grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
        </div>

        <LanderHeader />

        <section className="px-4 pt-4 pb-10 sm:px-6 sm:pt-10 sm:pb-16">
          <div className="mx-auto max-w-3xl text-center">
            <Pill className="animate-ca-rise">
              <Gift className="size-3.5" /> Free sample drop<span className="hidden sm:inline"> · While supplies last</span>
            </Pill>
            <h1 className="mt-3 animate-ca-rise font-ca-display text-[2.55rem] leading-[0.92] font-black tracking-[-0.02em] text-balance uppercase [animation-delay:60ms] sm:mt-5 sm:text-7xl">
              Two strains.
              <br />
              <span className="ca-text-green">One&apos;s on us.</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md animate-ca-rise text-[0.98rem] leading-snug text-ca-ink-2 [animation-delay:120ms] sm:mt-5 sm:text-lg">
              More flower or more frost? Pick your free sample.{" "}
              <span className="font-semibold text-white">{claimConfig.offerNote}</span>
            </p>
            <SpotsLeft className="mt-3" />
          </div>

          <div className="mt-5 animate-ca-rise [animation-delay:180ms] sm:mt-10">
            <SampleChooser />
          </div>

          <TrustTiles className="mx-auto mt-6 max-w-[52rem]" />
        </section>
      </div>

      <TrustMarquee />

      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Meet the samples"
          title={
            <>
              Same academy. <span className="ca-text-green">Two flavors.</span>
            </>
          }
          sub="Both are top-shelf, lab tested and free. One's bigger, one's frostier."
        />
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:mt-14 md:grid-cols-2 md:gap-5">
          <ProductFeature sample="runtz" label="Option A" action={<ChooseButton sample="runtz" />} />
          <ProductFeature sample="snowcaps" label="Option B" action={<ChooseButton sample="snowcaps" />} />
        </div>
      </section>

      <section className="border-y border-ca-line bg-ca-bg-2 px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Still deciding?"
          title={
            <>
              More flower or <span className="ca-text-snow">more frost?</span>
            </>
          }
        />
        <Comparison />
      </section>

      <StatsBand />

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              Three steps. <span className="ca-text-green">Thirty seconds.</span>
            </>
          }
        />
        <HowItWorks steps={steps} />
      </section>

      <section className="border-t border-ca-line bg-ca-bg-2 px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading eyebrow="FAQ" title="The fine print" />
        <Faq />
      </section>

      <section className="relative isolate overflow-hidden px-4 py-20 text-center sm:px-6 sm:py-28">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-[10%] size-80 rounded-full bg-runtz/20 blur-[100px]" />
          <div className="absolute right-[10%] bottom-0 size-80 rounded-full bg-snow/15 blur-[100px]" />
          <LeafField />
        </div>
        <div className="mx-auto flex max-w-xs items-end justify-center">
          <ProductArt sample="runtz" className="w-32 -rotate-6 sm:w-40" />
          <ProductArt sample="snowcaps" className="-ml-4 w-32 rotate-6 sm:w-40" />
        </div>
        <h2 className="mx-auto mt-4 max-w-xl font-ca-display text-4xl leading-[0.95] font-black uppercase sm:text-6xl">
          Your sample is <span className="ca-text-green">waiting.</span>
        </h2>
        <p className="mt-3 text-ca-ink-2">One per customer, while supplies last.</p>
        <a
          href="#claim"
          className="mt-8 inline-flex h-14 items-center gap-2 rounded-xl bg-gradient-to-b from-ca-green-2 to-ca-green px-8 font-ca-display font-black tracking-wide text-white uppercase shadow-[0_10px_30px_-6px_rgb(34_197_94/0.7)]"
        >
          Claim mine
          <ArrowUp className="size-5" strokeWidth={2.5} />
        </a>
      </section>

      <LegalFooter />
    </>
  );
}
