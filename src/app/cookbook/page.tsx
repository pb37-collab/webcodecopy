import { BookOpen, Clock, Feather, Gift, Users } from "lucide-react";
import { CookbookFooter, CookbookHeader, SectionHeading } from "@/components/cookbook/cookbook-chrome";
import { DelftPlate, DelftTile, Flourish, TileStrip } from "@/components/cookbook/delft-art";
import { BookCover, CameoPortrait, DelftPhoto } from "@/components/cookbook/delft-media";
import { SubscribeForm } from "@/components/cookbook/subscribe-form";
import { VideoCard } from "@/components/cookbook/video-card";
import {
  authorNote,
  chapters,
  cookbook,
  faqs,
  featuredRecipes,
  gallery,
  newsletterFeatures,
  substack,
  videos,
} from "@/data/cookbook";
import { hasPublicFile } from "@/lib/media";
import { cn } from "@/lib/utils";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export default function CookbookPage() {
  return (
    <>
      <CookbookHeader />
      <main id="top" className="flex-1">
        <Hero />
        <TileStrip />
        <InsideTheBook />
        <Recipes />
        <Watch />
        <Gallery />
        <Newsletter />
        <AuthorNote />
        <Faq />
        <FinalCta />
      </main>
      <CookbookFooter />
    </>
  );
}

function Hero() {
  return (
    <section id="get-the-book" className="relative scroll-mt-20 overflow-hidden">
      <div
        aria-hidden
        className="delft-tiles absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_75%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pt-20 lg:pb-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-delft-700/40 bg-glaze px-3.5 py-1 text-xs uppercase tracking-[0.16em] text-delft-700 sm:text-sm sm:tracking-[0.22em]">
            <Gift className="size-4" aria-hidden />
            Free cookbook &middot; {cookbook.releaseLabel}
          </p>
          <h1 className="mt-6 font-delft-display text-6xl font-semibold leading-[0.92] tracking-tight text-delft-800 sm:text-7xl lg:text-[5.5rem]">
            {cookbook.titleLead}
            <span className="block italic font-medium text-delft-600">{cookbook.titleTail}</span>
          </h1>
          <p className="mt-6 font-delft-display text-2xl italic text-delft-900 sm:text-3xl">{cookbook.subtitle}</p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-delft-900/80 sm:text-xl">{cookbook.pitch}</p>
          <SubscribeForm className="mt-8 max-w-xl" />
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-base text-delft-800">
            {["100% free", "Sample chapters early", "A new recipe every week"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <svg viewBox="0 0 10 10" className="size-2.5 text-delft-600" aria-hidden>
                  <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <DelftPlate
            motif="rosette"
            className="absolute top-1/2 left-1/2 w-[118%] max-w-none -translate-x-[42%] -translate-y-1/2 rotate-12 opacity-95 drop-shadow-[0_20px_30px_rgba(11,26,64,0.18)]"
          />
          <BookCover className="relative mx-auto w-[70%] sm:w-[62%] lg:w-[72%]" />
        </div>
      </div>
    </section>
  );
}

function InsideTheBook() {
  return (
    <section id="the-book" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-sm uppercase tracking-[0.28em] text-delft-600">Inside the book</p>
          <h2 className="mt-3 font-delft-display text-4xl font-semibold leading-[1.05] text-delft-800 sm:text-5xl">
            Home cooking, <span className="italic font-medium">dressed for company.</span>
          </h2>
          <Flourish className="mt-5" />
          <p className="mt-5 text-lg leading-relaxed text-delft-900/80 sm:text-xl">
            Six chapters that follow a day at the table &mdash; from slow mornings to the last forkful of dessert.
            Every recipe is tested in a regular home kitchen, with notes on what to make ahead and what to do when
            it goes sideways.
          </p>
          <dl className="mt-10 grid grid-cols-3 border-y border-delft-700/30">
            {cookbook.stats.map((s, i) => (
              <div key={s.label} className={cn("py-5 text-center", i > 0 && "border-l border-delft-700/30")}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-delft-display text-4xl font-semibold text-delft-700 sm:text-5xl">{s.value}</dd>
                <dd className="mt-1 text-sm uppercase tracking-[0.18em] text-delft-800/80">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative border-2 border-delft-700 bg-glaze p-2">
          <div className="border border-delft-700/50 px-5 py-8 sm:px-10 sm:py-10">
            <div className="flex items-center justify-center gap-3 text-delft-700">
              <BookOpen className="size-5" aria-hidden />
              <p className="font-delft-display text-2xl font-semibold tracking-wide">Contents</p>
            </div>
            <ol className="mt-8 space-y-6">
              {chapters.map((c, i) => (
                <li key={c.title} className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3">
                  <span className="font-delft-display text-xl font-semibold text-delft-500">{ROMAN[i]}.</span>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-3">
                      <span className="font-delft-display text-2xl font-semibold text-delft-800 sm:text-[1.7rem]">
                        {c.title}
                      </span>
                      <span aria-hidden className="mb-1.5 hidden flex-1 border-b-2 border-dotted border-delft-300 sm:block" />
                    </div>
                    <p className="mt-0.5 text-base italic text-delft-900/75 sm:text-lg">{c.blurb}</p>
                  </div>
                  <span className="text-sm uppercase tracking-[0.14em] text-delft-600">{c.count} recipes</span>
                </li>
              ))}
            </ol>
          </div>
          {(["tl", "tr", "bl", "br"] as const).map((pos) => (
            <DelftTile
              key={pos}
              motif="rosette"
              className={cn(
                "absolute size-8 border border-delft-700 sm:size-10",
                pos === "tl" && "-top-3 -left-3 sm:-top-5 sm:-left-5",
                pos === "tr" && "-top-3 -right-3 sm:-top-5 sm:-right-5",
                pos === "bl" && "-bottom-3 -left-3 sm:-bottom-5 sm:-left-5",
                pos === "br" && "-right-3 -bottom-3 sm:-right-5 sm:-bottom-5",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Recipes() {
  return (
    <section id="recipes" className="scroll-mt-20 border-t border-delft-700/20 bg-glaze-2 px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="A taste of what's inside"
        title={
          <>
            Recipes you&rsquo;ll <span className="italic font-medium">cook on repeat</span>
          </>
        }
        intro="A few of the dishes friends ask for most. The full recipes — with every step, swap and make-ahead note — are in the book."
      />
      <ul className="mx-auto mt-16 grid max-w-6xl gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {featuredRecipes.map((r) => (
          <li key={r.name} className="group">
            <DelftPhoto
              src={r.image}
              alt={r.name}
              motif={r.motif}
              className="aspect-[4/5] transition-transform duration-300 group-hover:-translate-y-1"
            />
            <p className="mt-5 text-sm uppercase tracking-[0.22em] text-delft-600">{r.chapter}</p>
            <h3 className="mt-1.5 font-delft-display text-3xl font-semibold leading-tight text-delft-800">{r.name}</h3>
            <p className="mt-2 text-lg leading-snug text-delft-900/80">{r.tease}</p>
            <div className="mt-4 flex gap-5 border-t border-delft-700/25 pt-3 text-base text-delft-700">
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden />
                {r.time}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-4" aria-hidden />
                {r.serves}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-16 text-center">
        <a
          href="#get-the-book"
          className="inline-flex items-center gap-2 border-b-2 border-delft-700 pb-1 font-delft-display text-2xl font-semibold text-delft-700 transition-colors hover:border-delft-500 hover:text-delft-500"
        >
          Get every recipe, free &rarr;
        </a>
      </div>
    </section>
  );
}

function Watch() {
  const [feature, ...rest] = videos.map((v) => ({
    ...v,
    poster: v.poster && hasPublicFile(v.poster) ? v.poster : undefined,
  }));
  return (
    <section id="watch" className="relative scroll-mt-20 overflow-hidden bg-delft-800 px-4 py-24 sm:px-6">
      <div aria-hidden className="delft-tiles-light absolute inset-0 opacity-[0.06]" />
      <div className="relative">
        <SectionHeading
          tone="dark"
          eyebrow="Watch"
          title={
            <>
              Cook along <span className="italic font-medium">with me</span>
            </>
          }
          intro="Short, unfussy videos for the recipes with a trick to them — so you can see exactly what the batter should look like."
        />
        <div className="mx-auto mt-16 grid max-w-6xl gap-10 lg:grid-cols-[1.6fr_1fr]">
          {feature && <VideoCard {...feature} featured />}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
            {rest.map((v) => (
              <VideoCard key={v.title} {...v} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="From the table"
        title={
          <>
            A few of my <span className="italic font-medium">favourite plates</span>
          </>
        }
      />
      <ul className="mx-auto mt-16 grid max-w-6xl grid-flow-dense auto-rows-[170px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 lg:grid-cols-4">
        {gallery.map((g) => (
          <li
            key={g.src}
            className={cn(g.span === "tall" && "row-span-2", g.span === "wide" && "col-span-2")}
          >
            <DelftPhoto
              src={g.src}
              alt={g.alt}
              motif={g.motif}
              className="h-full"
              sizes="(min-width: 1024px) 25vw, 50vw"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Newsletter() {
  return (
    <section id="newsletter" className="scroll-mt-20 border-y border-delft-700/20 bg-glaze-2 px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow={`On Substack · ${substack.name}`}
        title={
          <>
            The book is just <span className="italic font-medium">the beginning</span>
          </>
        }
        intro="Signing up for the cookbook also gets you the newsletter — the place the book is being written in public."
      />
      <ul className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {newsletterFeatures.map((f) => (
          <li key={f.title} className="border-2 border-delft-700 bg-glaze p-1.5">
            <div className="flex h-full flex-col items-center border border-delft-700/40 px-5 py-8 text-center">
              <DelftPlate motif={f.motif} className="size-24" />
              <h3 className="mt-5 font-delft-display text-2xl font-semibold leading-tight text-delft-800">{f.title}</h3>
              <p className="mt-2 text-lg leading-snug text-delft-900/80">{f.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-12 text-center text-lg italic text-delft-800">{substack.cadence}</p>
    </section>
  );
}

function AuthorNote() {
  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <CameoPortrait src={authorNote.portrait} alt={cookbook.author} className="mx-auto w-full max-w-xs" />
        <div>
          <p className="flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-delft-600">
            <Feather className="size-4" aria-hidden />A note from the kitchen
          </p>
          <h2 className="mt-3 font-delft-display text-4xl font-semibold leading-[1.05] text-delft-800 sm:text-5xl">
            {authorNote.heading}
          </h2>
          <Flourish className="mt-5" />
          {authorNote.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="mt-5 text-lg leading-relaxed text-delft-900/85 sm:text-xl">
              {p}
            </p>
          ))}
          <p className="mt-6 text-lg italic text-delft-800">{authorNote.signoff}</p>
          <p className="mt-1 font-delft-display text-3xl font-semibold italic text-delft-700">{cookbook.author}</p>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="border-t border-delft-700/20 px-4 py-24 sm:px-6">
      <SectionHeading eyebrow="Good questions" title="Before you sign up" />
      <div className="mx-auto mt-12 max-w-3xl divide-y divide-delft-700/25 border-y border-delft-700/25">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-delft-display text-2xl font-semibold text-delft-800 [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                aria-hidden
                className="grid size-8 shrink-0 place-items-center rounded-full border border-delft-700 text-xl leading-none text-delft-700 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 pr-12 text-lg leading-relaxed text-delft-900/80">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 pb-24 sm:px-6">
      <div className="relative mx-auto max-w-5xl overflow-hidden border-2 border-delft-800 bg-delft-700 p-2">
        <div aria-hidden className="delft-tiles-light absolute inset-0 opacity-[0.08]" />
        <div className="relative grid items-center gap-10 border border-glaze/40 px-6 py-14 sm:px-12 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-delft-200">Free &middot; {cookbook.releaseLabel}</p>
            <h2 className="mt-3 font-delft-display text-4xl font-semibold leading-[1.05] text-glaze sm:text-5xl">
              Save your seat <span className="italic font-medium">at the table.</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-delft-100/90 sm:text-xl">
              Join the list now and {cookbook.title}{" "}lands in your inbox the day it&rsquo;s released &mdash; free.
            </p>
            <SubscribeForm tone="dark" buttonLabel="Reserve my free copy" className="mt-8 max-w-xl" />
          </div>
          <DelftPlate
            motif="windmill"
            className="mx-auto hidden w-56 rotate-[-8deg] drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] md:block lg:w-64"
          />
        </div>
      </div>
    </section>
  );
}
