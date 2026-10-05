"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import type { SampleId } from "@/lib/chunky/config";
import { isValidEmail } from "@/lib/chunky/claim";
import { sampleOrder, samples } from "@/lib/chunky/products";
import { cn } from "@/lib/utils";
import { ConsentNote, ProductArt } from "./shared";
import { BodyPortal, DemoSheet, useClaim, useSampleParam } from "./use-claim";

/** Fired by "Choose this one" buttons elsewhere on the page. */
export const SELECT_EVENT = "ca:select-sample";

const cardTheme: Record<SampleId, { idle: string; active: string; check: string; hook: string; bg: string }> =
  {
    runtz: {
      bg: "bg-[radial-gradient(120%_90%_at_50%_0%,#4a0a1c_0%,#1c0a10_55%,#120a0e_100%)]",
      idle: "border-ruby/25",
      active: "border-ruby shadow-[0_0_0_1px_var(--color-ruby),0_18px_50px_-12px_rgb(224_41_79/0.65)]",
      check: "bg-ruby text-white",
      hook: "ca-text-ruby",
    },
    snowcaps: {
      bg: "bg-[radial-gradient(120%_90%_at_50%_0%,#1d2547_0%,#141428_55%,#0e0e18_100%)]",
      idle: "border-frost/25",
      active: "border-frost shadow-[0_0_0_1px_var(--color-frost),0_18px_50px_-12px_rgb(159_214_255/0.6)]",
      check: "bg-frost text-ca-bg",
      hook: "ca-text-frost",
    },
  };

function OptionCard({
  id,
  selected,
  dimmed,
  onSelect,
}: {
  id: SampleId;
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: SampleId) => void;
}) {
  const p = samples[id];
  const t = cardTheme[id];
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${p.name}, ${p.weightLong}, free`}
      onClick={() => onSelect(id)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[1.4rem] border text-left transition-all duration-300 active:scale-[0.98]",
        t.bg,
        selected ? t.active : t.idle,
        dimmed && "opacity-60 saturate-[0.6]",
        !selected && "hover:-translate-y-0.5 hover:border-ca-line-2",
      )}
    >
      <div
        aria-hidden
        className={cn("absolute inset-0 opacity-70", id === "runtz" ? "ca-facets" : "ca-frost")}
      />
      <div className="relative flex items-start justify-between p-3 pb-0 sm:p-5 sm:pb-0">
        <div>
          <p className="font-ca-display text-[2rem] leading-none font-semibold tracking-[-0.03em] sm:text-5xl">
            {p.weight}
          </p>
          <p className="mt-1 text-[0.6rem] font-bold tracking-[0.2em] text-ca-ink-2 uppercase sm:text-[0.68rem]">
            Free · {p.type}
          </p>
        </div>
        <span
          aria-hidden
          className={cn(
            "grid size-6 place-items-center rounded-full border transition-all sm:size-7",
            selected ? cn(t.check, "border-transparent") : "border-ca-line-2 bg-black/20",
          )}
        >
          {selected && <Check className="size-3.5 sm:size-4" strokeWidth={3} />}
        </span>
      </div>
      <ProductArt
        sample={id}
        priority
        className="relative mx-auto -my-2 w-[70%] transition-transform duration-500 group-hover:scale-[1.04] sm:my-0 sm:w-[54%]"
      />
      <div className="relative mt-auto p-3 pt-0 sm:p-5 sm:pt-0">
        <p className="font-ca-display text-[1.05rem] leading-[1.08] font-medium tracking-[-0.01em] sm:text-2xl">
          {p.nameLines[0]}
          <br />
          <span className="italic">{p.nameLines[1]}</span>
        </p>
        <p className={cn("mt-1.5 text-[0.68rem] font-bold tracking-[0.18em] uppercase sm:text-xs", t.hook)}>
          {p.hook}
        </p>
      </div>
    </button>
  );
}

export function SampleChooser() {
  const [selected, setSelected] = useState<SampleId | null>(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ sample?: string; firstName?: string; email?: string }>({});
  const [shake, setShake] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(true);
  const submitRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const { status, claim, demoUrl, reset } = useClaim("free-sample-v1");
  const fromParam = useSampleParam();
  const busy = status === "submitting" || status === "redirecting";

  useEffect(() => {
    // Apply a ?sample= preselection once it's been read from the URL.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (fromParam) setSelected(fromParam);
  }, [fromParam]);

  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<SampleId>).detail;
      setSelected(id);
      setErrors((prev) => ({ ...prev, sample: undefined }));
    };
    window.addEventListener(SELECT_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_EVENT, onSelect);
  }, []);

  // Sticky mobile CTA shows whenever the real submit button is off-screen.
  useEffect(() => {
    const el = submitRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setCtaVisible(entry.isIntersecting), {
      rootMargin: "0px 0px -40px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function select(id: SampleId) {
    setSelected(id);
    setErrors((prev) => ({ ...prev, sample: undefined }));
  }

  function validate() {
    const next: typeof errors = {};
    if (!selected) next.sample = "Pick one of the two samples above.";
    if (!firstName.trim()) next.firstName = "Add your first name.";
    if (!isValidEmail(email)) next.email = "Enter a valid email so we can send your order details.";
    setErrors(next);
    return next;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const next = validate();
    if (Object.keys(next).length || !selected) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (next.firstName) nameRef.current?.focus();
      else if (next.email) emailRef.current?.focus();
      return;
    }
    await claim({ firstName, email, sample: selected });
  }

  function jumpToForm() {
    document.getElementById("claim")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      if (!selected) return;
      if (!firstName.trim()) nameRef.current?.focus({ preventScroll: true });
      else if (!isValidEmail(email)) emailRef.current?.focus({ preventScroll: true });
    }, 450);
  }

  const chosen = selected ? samples[selected] : null;
  const ctaLabel = chosen
    ? `Claim my free ${chosen.weight} of ${chosen.shortName}`
    : "Choose your free sample";

  return (
    <>
      <div id="claim" className="mx-auto w-full max-w-[52rem] scroll-mt-4">
        <div
          role="radiogroup"
          aria-label="Choose your free sample"
          className={cn("grid grid-cols-2 gap-3 sm:gap-5", shake && errors.sample && "animate-ca-shake")}
        >
          {sampleOrder.map((id) => (
            <OptionCard
              key={id}
              id={id}
              selected={selected === id}
              dimmed={selected !== null && selected !== id}
              onSelect={select}
            />
          ))}
        </div>
        {errors.sample && (
          <p role="alert" className="mt-2 text-center text-xs font-semibold text-ruby-hi">
            {errors.sample}
          </p>
        )}

        <form
          noValidate
          onSubmit={onSubmit}
          className={cn(
            "relative mt-4 rounded-[1.4rem] border border-ca-line-2 bg-ca-card/80 p-3 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] backdrop-blur sm:mt-5 sm:p-4",
            shake && !errors.sample && "animate-ca-shake",
          )}
        >
          <div className="grid gap-2.5 sm:grid-cols-[1fr_1.4fr_auto] sm:gap-3">
            <label className="block">
              <span className="sr-only">First name</span>
              <input
                ref={nameRef}
                name="firstName"
                autoComplete="given-name"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                aria-invalid={Boolean(errors.firstName)}
                className={cn(
                  "h-[3.25rem] w-full rounded-xl border bg-ca-bg/80 px-4 text-ca-ink placeholder:text-ca-ink-3 focus:border-ca-gold focus:outline-none",
                  errors.firstName ? "border-ruby" : "border-ca-line",
                )}
              />
            </label>
            <label className="block">
              <span className="sr-only">Email</span>
              <input
                ref={emailRef}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                className={cn(
                  "h-[3.25rem] w-full rounded-xl border bg-ca-bg/80 px-4 text-ca-ink placeholder:text-ca-ink-3 focus:border-ca-gold focus:outline-none",
                  errors.email ? "border-ruby" : "border-ca-line",
                )}
              />
            </label>
            <button
              ref={submitRef}
              type="submit"
              disabled={busy}
              className="group relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-ca-gold-2 to-ca-gold px-6 text-[0.95rem] font-extrabold text-ca-bg shadow-[0_10px_30px_-8px_rgb(220_189_133/0.6)] transition active:scale-[0.98] disabled:opacity-80 sm:h-[3.25rem]"
            >
              <span aria-hidden className="ca-shimmer absolute inset-0 animate-ca-shimmer" />
              {busy ? (
                <>
                  <Loader2 className="relative size-4 animate-spin" />
                  <span className="relative">
                    {status === "redirecting" ? "Opening your cart…" : "Reserving your sample…"}
                  </span>
                </>
              ) : (
                <>
                  <span className="relative">{ctaLabel}</span>
                  <ArrowRight className="relative size-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
          {(errors.firstName || errors.email) && (
            <p role="alert" className="mt-2 px-1 text-xs font-semibold text-ruby-hi">
              {errors.firstName ?? errors.email}
            </p>
          )}
          <ConsentNote className="mt-2.5 px-1 text-center sm:text-left" />
        </form>
      </div>

      {/* Sticky claim bar on phones while the form is off-screen. */}
      <BodyPortal>
        <div
          className={cn(
            "ca-safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-ca-line-2 bg-ca-bg/90 px-3 pt-3 backdrop-blur-xl transition-transform duration-300 sm:hidden",
            ctaVisible || status === "demo" ? "translate-y-full" : "translate-y-0",
          )}
        >
          <button
            type="button"
            onClick={jumpToForm}
            className="flex h-14 w-full items-center gap-3 rounded-2xl bg-gradient-to-b from-ca-gold-2 to-ca-gold pr-4 pl-2 text-left font-extrabold text-ca-bg"
          >
            <span className="flex -space-x-3">
              {(selected ? [selected] : sampleOrder).map((id) => (
                <span key={id} className="grid size-10 place-items-center rounded-xl bg-ca-bg/90">
                  <ProductArt sample={id} float={false} glow={false} className="size-9" />
                </span>
              ))}
            </span>
            <span className="flex-1 text-[0.92rem] leading-tight">
              {chosen ? `Claim free ${chosen.weight} ${chosen.shortName}` : "Pick your free sample"}
            </span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </BodyPortal>

      <DemoSheet url={demoUrl} onClose={reset} />
    </>
  );
}

export function ChooseButton({ sample, className }: { sample: SampleId; className?: string }) {
  const p = samples[sample];
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent(SELECT_EVENT, { detail: sample }));
        document.getElementById("claim")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition active:scale-[0.98]",
        sample === "runtz"
          ? "bg-ruby text-white shadow-[0_10px_30px_-10px_rgb(224_41_79/0.8)] hover:bg-ruby-hi"
          : "bg-frost text-ca-bg shadow-[0_10px_30px_-10px_rgb(159_214_255/0.8)] hover:bg-frost-hi",
        className,
      )}
    >
      Choose the free {p.weight} {p.shortName}
      <ArrowRight className="size-4" />
    </button>
  );
}
