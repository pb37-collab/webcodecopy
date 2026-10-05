import type { Metadata } from "next";
import Image from "next/image";
import { Sora } from "next/font/google";
import { ArrowDown, Check } from "lucide-react";
import { AutoVideo } from "@/components/giveaway/eq/auto-video";
import { ColorwayPicker } from "@/components/giveaway/eq/colorway-picker";
import { Countdown, CountdownInline } from "@/components/giveaway/eq/countdown";
import { EntryForm } from "@/components/giveaway/eq/entry-form";
import { EqExperience } from "@/components/giveaway/eq/experience";
import { EntryStatsBar, OddsCalculator } from "@/components/giveaway/eq/odds";
import { Bubbles, Caustics, QuartzCrystal } from "@/components/giveaway/eq/motion";
import { ProductStage } from "@/components/giveaway/eq/product-stage";
import { QuartzLab } from "@/components/giveaway/eq/quartz-lab";
import { HeroCta, StickyCta } from "@/components/giveaway/eq/sticky-cta";
import { eqGiveaway as g, type ColorwayId } from "@/data/giveaways/davinci-eq-skyrise";
import { hasPublicFile } from "@/lib/media";
import "./eq.css";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["300", "400", "600", "700"] });

const totalValue = (g.retailPrice * g.winners).toLocaleString("en-US");

export const metadata: Metadata = {
  title: { absolute: `Win the ${g.brand} ${g.productShort} Quartz · ${g.winners} winners` },
  description: `${g.winners} limited-edition ${g.brand} ${g.product} rigs up for grabs, $${totalValue} in prizes. Enter with your email before the countdown ends. ${g.minAge}+, no purchase necessary.`,
  // Paid/social traffic only: keep campaign pages out of search.
  robots: { index: false, follow: false },
  openGraph: {
    title: `Win the ${g.brand} ${g.productShort} (Limited Edition: Quartz)`,
    description: `${g.winners} winners. $${totalValue} in prizes. Enter before the countdown hits zero.`,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  }).format(new Date(iso));

export default function EqSkyriseGiveaway() {
  const pick = (key: "cutout" | "studio"): Partial<Record<ColorwayId, string>> =>
    Object.fromEntries(g.colorways.filter((c) => hasPublicFile(c[key])).map((c) => [c.id, c[key]]));
  const cutouts = pick("cutout");
  const studios = pick("studio");
  const gallery = g.media.gallery.filter((item) => hasPublicFile(item.src));
  const films = g.media.films.filter((f) => hasPublicFile(f.src));
  const macro = hasPublicFile(g.media.quartzMacro.src) ? g.media.quartzMacro : null;
  const closeup = hasPublicFile(g.media.closeup) ? g.media.closeup : null;

  return (
    <EqExperience>
      <div className={`${sora.variable} font-eq`}>
        <Ticker />

        <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-3 lg:py-4">
          <a href={g.brandUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
            <span className="text-[15px] font-semibold tracking-[0.42em]">DAVINCI</span>
            <span className="rounded-full border border-eq/40 bg-eq/10 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-eq">
              Giveaway
            </span>
          </a>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3 sm:block">
            Ends in <CountdownInline className="text-ink" />
          </span>
        </header>

        {/* HERO */}
        <section className="relative">
          <Caustics />
          <div className="relative mx-auto grid max-w-6xl gap-y-4 px-5 pt-2 pb-16 lg:grid-cols-[1fr_1fr] lg:gap-8 lg:gap-x-14 lg:pt-10 lg:pb-24">
            <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
              <p className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-eq lg:block">
                Limited-edition giveaway · {g.winners} winners
              </p>
              <h1 className="text-[2.6rem] leading-[0.95] font-semibold tracking-[-0.03em] sm:text-7xl lg:mt-4">
                Win the EQ Skyrise{" "}
                <span className="bg-gradient-to-r from-white via-eq to-white bg-clip-text font-light text-transparent italic lg:block">
                  Quartz.
                </span>
              </h1>
              <p className="mt-2 text-[15px] text-ink-2 lg:hidden">
                <span className="text-eq">{g.winners} limited-edition rigs</span> · ${totalValue} in prizes
              </p>
              <p className="mt-5 hidden max-w-lg text-[17px] leading-relaxed text-ink-2 lg:block">
                {g.brand}&rsquo;s limited-edition electric quartz rig: a tall Skyrise glass bubbler, on-device
                touchscreen and a 25-second heat-up. We&rsquo;re giving away {g.winners}. Entering takes ten
                seconds.
              </p>
            </div>

            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
              <ProductStage images={cutouts} />
              <ColorwayPicker size="stage" className="mt-2 lg:hidden" />
            </div>

            <div className="lg:col-start-1 lg:row-start-2">
              <HeroCta className="mb-5" />
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3 lg:mb-3">Entries close in</p>
              <Countdown />
              <EntryStatsBar className="mt-3" />
              <div className="mt-5">
                <EntryForm />
              </div>
            </div>
          </div>
        </section>

        {/* PRIZE STRIP */}
        <section className="border-y border-white/10 bg-white/[0.02]">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 divide-white/10 px-5 sm:grid-cols-4 sm:divide-x">
            {[
              { v: String(g.winners), l: "Winners" },
              { v: `$${g.retailPrice}`, l: "Retail value, each" },
              { v: `$${totalValue}`, l: "Total prize pool" },
              { v: "Limited", l: "Edition run" },
            ].map((s) => (
              <div key={s.l} className="py-6 sm:px-6 sm:first:pl-0">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">{s.l}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight">{s.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <OddsCalculator />

        {films.length > 0 && <FilmBand films={films} />}

        {/* COLORWAYS */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 lg:grid-cols-[1fr_1.1fr] lg:py-28">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-eq">Four finishes</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Pick the one you&rsquo;d ship home.</h2>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-2">
                Tap a finish and the whole page shifts to match. Your pick is saved with your entry, so if
                you win, that&rsquo;s the {g.productShort} we send.
              </p>
              <ColorwayPicker size="lg" className="mt-7" />
            </div>
            <ColorwayShowcase images={studios} />
          </div>
        </section>

        {/* QUARTZ LAB */}
        <section className="relative border-t border-white/10 bg-[radial-gradient(60%_50%_at_30%_40%,color-mix(in_oklab,var(--eq-deep)_90%,transparent),transparent)]">
          <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
            <QuartzLab macro={macro} />
          </div>
        </section>

        {/* FEATURES */}
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-eq">The prize</p>
                <h2 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  Electric quartz, built for concentrates.
                </h2>
              </div>
              <a
                href={g.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ink-2 underline decoration-eq/50 underline-offset-4 hover:text-ink"
              >
                Full specs at {g.brand.toLowerCase()}vaporizer.com
              </a>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {g.specs.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <dd className="text-3xl font-semibold tracking-tight text-eq sm:text-4xl">{s.value}</dd>
                  <dt className="mt-2 text-[13px] text-ink-2">{s.label}</dt>
                </div>
              ))}
            </dl>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {g.features.map((f, i) => (
                <div
                  key={f.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 transition-colors hover:border-eq/40"
                >
                  <span className="font-mono text-[10px] text-ink-3">0{i + 1}</span>
                  <h3 className="mt-3 text-xl font-semibold">{f.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{f.body}</p>
                  <div
                    aria-hidden
                    className="absolute -right-10 -bottom-10 size-40 rounded-full bg-eq/0 blur-2xl transition-colors duration-500 group-hover:bg-eq/20"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {gallery.length > 0 && <Gallery images={gallery} />}

        {g.media.youtubeId && (
          <section className="border-t border-white/10">
            <div className="mx-auto max-w-5xl px-5 py-20">
              <div className="aspect-video overflow-hidden rounded-3xl border border-white/10">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${g.media.youtubeId}?rel=0`}
                  title={`${g.product} video`}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        )}

        {/* HOW IT WORKS + WINNER SLOTS */}
        <section className="relative overflow-hidden border-t border-white/10">
          <Bubbles count={22} rise={900} className="opacity-60" />
          <div className="relative mx-auto max-w-6xl px-5 py-20 lg:py-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-eq">How it works</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Five rigs. Five names. One draw.</h2>

            <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { t: "Enter", b: "Drop your email and opt in. Free, ten seconds." },
                { t: "Pick a finish", b: "Amethyst, Sapphire, Gunmetal or Onyx. We ship your pick if you win." },
                { t: "Share your link", b: `Every friend who enters through it adds +${g.referralBonus} entries to yours.` },
                { t: "Winners drawn", b: `${g.winners} random winners on ${g.drawDate}, notified by email.` },
              ].map((s, i) => (
                <li key={s.t} className="rounded-2xl border border-white/10 bg-[#0b0b10]/80 p-5 backdrop-blur">
                  <span className="grid size-8 place-items-center rounded-full bg-eq text-sm font-bold text-[#08080b]">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">{s.b}</p>
                </li>
              ))}
            </ol>

            <div className="mt-14 grid grid-cols-5 gap-2 sm:gap-4">
              {Array.from({ length: g.winners }, (_, i) => (
                <div
                  key={i}
                  className="group relative flex aspect-[3/5] flex-col items-center justify-between overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-2 transition-colors hover:border-eq/60 sm:p-4"
                >
                  <span className="font-mono text-[9px] tracking-[0.14em] text-ink-3 sm:text-[11px]">
                    WINNER {String(i + 1).padStart(2, "0")}
                  </span>
                  <QuartzCrystal className="h-[55%] opacity-70 transition-[opacity,transform] duration-500 group-hover:-translate-y-1 group-hover:opacity-100" />
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-eq sm:text-[10px]">
                    Unclaimed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IN THE BOX */}
        <section className="border-t border-white/10">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-eq">Each winner gets</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight">The full EQ Skyrise kit.</h2>
              <p className="mt-4 text-[15px] text-ink-2">
                One {g.product}, retail ${g.retailPrice}, shipped in the finish you pick.
              </p>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {g.inTheBox.map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[15px]">
                  <span className="grid size-6 place-items-center rounded-full bg-eq/15 text-eq">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ + RULES */}
        <section id="rules" className="scroll-mt-6 border-t border-white/10">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-eq">Questions</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight">The fine print, in plain English.</h2>
            </div>
            <div>
              <div className="divide-y divide-white/10 border-y border-white/10">
                {g.faq.map((f) => (
                  <details key={f.q} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span className="grid size-7 shrink-0 place-items-center rounded-full border border-white/15 text-ink-2 transition-transform duration-300 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 pr-10 text-[15px] leading-relaxed text-ink-2">{f.a}</p>
                  </details>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-[12.5px] leading-relaxed text-ink-3">
                <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2">Official rules (summary)</h3>
                <p>
                  NO PURCHASE NECESSARY. A purchase will not increase your chances of winning. Open to {g.eligibility}{" "}
                  who are {g.minAge} or older at the time of entry. Void where prohibited. Entry period: {fmt(g.startsAt)}{" "}
                  through {fmt(g.endsAt)}. Enter by submitting the form on this page; limit one entry per person
                  and email address, plus +{g.referralBonus} bonus entries for each eligible person who enters
                  through your referral link. {g.winners} winners will be selected at random on or about {g.drawDate}{" "}
                  and notified by email; a winner who doesn&rsquo;t respond within 72 hours may be replaced by an
                  alternate. Prize: one {g.product} per winner (ARV ${g.retailPrice}; total ARV ${totalValue}).
                  Odds depend on the number of eligible entries received. Sponsor: {g.sponsor}. This promotion
                  is not sponsored, endorsed or administered by, or associated with, Instagram, Meta, X or TikTok.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden border-t border-white/10">
          {closeup && (
            <>
              <Image src={closeup} alt="" fill sizes="100vw" className="object-cover opacity-45" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#07070a] via-[#07070a]/55 to-[#07070a]" />
            </>
          )}
          <Caustics className="opacity-70" />
          <div className="relative mx-auto max-w-3xl px-5 py-24 text-center">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              The clock&rsquo;s <span className="text-eq">running.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[16px] text-ink-2">
              {`${g.winners} limited-edition rigs`}, one email to enter. Don&rsquo;t be the friend who missed it.
            </p>
            <Countdown className="mx-auto mt-8 max-w-md" />
            <a
              href="#enter"
              className="mt-8 inline-flex h-14 items-center gap-2 rounded-xl bg-eq px-7 text-[15px] font-semibold text-[#08080b] shadow-[0_20px_60px_-15px_var(--eq)] hover:brightness-110"
            >
              Enter the giveaway <ArrowDown className="size-4 rotate-180" />
            </a>
          </div>
        </section>

        <footer className="border-t border-white/10 pb-28 lg:pb-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-[12px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-semibold tracking-[0.42em] text-ink-2">DAVINCI</span>
            <span>
              For adults {g.minAge}+ only. Product images and specifications courtesy of {g.brand}.
            </span>
          </div>
        </footer>

        <StickyCta />
      </div>
    </EqExperience>
  );
}

function Ticker() {
  const items = [
    `${g.winners} winners`,
    "EQ Skyrise · Limited Edition: Quartz",
    `$${totalValue} in prizes`,
    "25-second heat-up",
    "No purchase necessary",
    `${g.minAge}+ only`,
  ];
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t) => (
        <span key={t} className="flex items-center gap-6 pr-6">
          {t}
          <span aria-hidden className="size-1 rounded-full bg-[#08080b]/50" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative z-30 overflow-hidden bg-eq py-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#08080b] transition-colors duration-700">
      <div className="flex w-max animate-[eq-marquee_32s_linear_infinite]" aria-hidden>
        {row}
        {row}
        {row}
        {row}
      </div>
      <span className="sr-only">{items.join(" · ")}</span>
    </div>
  );
}

/** Crossfading photo of the selected finish, or a swatch-lit crystal. */
function ColorwayShowcase({ images }: { images: Partial<Record<ColorwayId, string>> }) {
  const has = Object.keys(images).length > 0;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <div aria-hidden className="absolute inset-[10%] rounded-full bg-eq/30 blur-[80px] transition-colors duration-700" />
      <div aria-hidden className="absolute inset-[18%] rounded-full bg-[conic-gradient(from_0deg,transparent,var(--eq),transparent_40%)] opacity-40 animate-[eq-spin_14s_linear_infinite]" />
      <div className="absolute inset-[4%] overflow-hidden rounded-full border border-white/10 bg-[#0b0b10]/70 backdrop-blur">
        {has ? (
          <ShowcaseImages images={images} />
        ) : (
          <div className="grid h-full place-items-center">
            <QuartzCrystal className="h-[70%] animate-[eq-float_7s_ease-in-out_infinite] drop-shadow-[0_0_40px_var(--eq)]" />
          </div>
        )}
        <Bubbles count={10} rise={520} />
      </div>
    </div>
  );
}

function ShowcaseImages({ images }: { images: Partial<Record<ColorwayId, string>> }) {
  // Every finish is rendered; eq.css shows the one matching the root's data-colorway.
  return (
    <>
      {g.colorways.map((c) =>
        images[c.id] ? (
          <Image
            key={c.id}
            src={images[c.id] as string}
            alt={`${g.productShort} in ${c.name}`}
            fill
            sizes="(min-width: 1024px) 520px, 90vw"
            data-colorway={c.id}
            className="eq-showcase scale-110 object-cover opacity-0 transition-opacity duration-700"
          />
        ) : null,
      )}
    </>
  );
}

function Gallery({ images }: { images: readonly { src: string; fit: "cover" | "contain" }[] }) {
  const row = images.map((img, i) => (
    <div
      key={`${img.src}-${i}`}
      className="relative aspect-[4/5] w-56 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(80%_60%_at_50%_70%,color-mix(in_oklab,var(--eq)_22%,#0d0d12),#0a0a0e)] sm:w-72"
    >
      <Image
        src={img.src}
        alt={`${g.product}, photo ${i + 1}`}
        fill
        sizes="288px"
        className={img.fit === "cover" ? "object-cover" : "object-contain p-4"}
      />
    </div>
  ));
  return (
    <section className="overflow-hidden border-t border-white/10 py-16" aria-label="Product photos">
      <div className="flex w-max animate-[eq-marquee_60s_linear_infinite] gap-4 pr-4 hover:[animation-play-state:paused]">
        {row}
        {row}
      </div>
    </section>
  );
}

/** DaVinci's own EQ films, playing only while on screen. */
function FilmBand({ films }: { films: readonly { src: string; poster: string; label: string }[] }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pt-20 lg:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-eq">See it in motion</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Glass, quartz and a screen that runs the show.
            </h2>
          </div>
        </div>
        <div className={`mt-10 grid gap-3 ${films.length > 1 ? "lg:grid-cols-[1.25fr_1fr]" : ""}`}>
          {films.map((f, i) => (
            <figure
              key={f.src}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b10] ${
                i === 0 ? "aspect-[5/4] lg:aspect-auto lg:h-[480px]" : "aspect-video lg:aspect-auto lg:h-[480px]"
              }`}
            >
              <AutoVideo src={f.src} poster={f.poster} label={f.label} />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#07070a]/80 via-transparent to-transparent" />
              <figcaption className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/15 bg-[#07070a]/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink backdrop-blur-md">
                <span className="size-1.5 animate-pulse rounded-full bg-eq" />
                {f.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
