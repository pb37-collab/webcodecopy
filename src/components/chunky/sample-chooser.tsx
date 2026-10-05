"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import type { SampleId } from "@/lib/chunky/config";
import { isValidEmail } from "@/lib/chunky/claim";
import { sampleOrder, samples } from "@/lib/chunky/products";
import { cn } from "@/lib/utils";
import { AllClaimed, SoldOutStamp, StockBadge, useInventory } from "./inventory";
import { ConsentNote, FreeSticker, ProductArt, theme } from "./shared";
import { BodyPortal, PreviewSheet, useClaim, useSampleParam } from "./use-claim";

/** Fired by "Choose this one" buttons elsewhere on the page. */
export const SELECT_EVENT = "ca:select-sample";

const inputClass =
  "h-[3.25rem] w-full rounded-xl border-2 bg-white px-4 font-medium text-gray-900 placeholder:text-gray-500 focus:border-ca-green-2 focus:outline-none";

function OptionCard({
  id,
  selected,
  dimmed,
  soldOut,
  onSelect,
}: {
  id: SampleId;
  selected: boolean;
  dimmed: boolean;
  soldOut: boolean;
  onSelect: (id: SampleId) => void;
}) {
  const p = samples[id];
  const t = theme[id];
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${p.name}, ${p.weightLong}, free${soldOut ? ", sold out" : ""}`}
      disabled={soldOut}
      onClick={() => onSelect(id)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border-2 text-left transition-all duration-300 active:scale-[0.98]",
        t.panel,
        selected ? t.ring : "border-white/10",
        dimmed && "opacity-55 saturate-50",
        soldOut && "cursor-not-allowed",
        !selected && !soldOut && "hover:-translate-y-0.5 hover:border-white/25",
      )}
    >
      <div
        aria-hidden
        className={cn("absolute inset-0", id === "runtz" ? "ca-halftone text-runtz/15" : "ca-frost")}
      />
      <div className="relative flex items-start justify-between p-3 pb-0 sm:p-5 sm:pb-0">
        <div>
          <p className="font-ca-display text-[2.1rem] leading-none font-black tracking-tight sm:text-5xl">
            {p.weight}
          </p>
          <p className="mt-1 text-[0.6rem] font-bold tracking-[0.16em] text-ca-ink-2 uppercase sm:text-[0.7rem]">
            {p.type}
          </p>
          <StockBadge sample={id} className="mt-1.5" />
        </div>
        <span
          aria-hidden
          className={cn(
            "grid size-6 place-items-center rounded-full border-2 transition-all sm:size-7",
            selected ? cn(t.solid, "border-transparent") : "border-white/30 bg-black/30",
          )}
        >
          {selected && <Check className="size-3.5 sm:size-4" strokeWidth={3.5} />}
        </span>
      </div>
      <div className="relative">
        <ProductArt
          sample={id}
          priority
          className={cn(
            "mx-auto mt-1 w-[70%] transition-transform duration-500 group-hover:scale-[1.04] sm:mt-0 sm:w-[46%]",
            soldOut && "opacity-50 grayscale",
          )}
        />
        {soldOut ? (
          <SoldOutStamp />
        ) : (
          <FreeSticker sample={id} className="absolute right-2 bottom-1 sm:right-5 sm:bottom-3" />
        )}
      </div>
      <div className="relative mt-auto p-3 pt-1.5 sm:p-5 sm:pt-2">
        <p className="font-ca-display text-[0.98rem] leading-[1.02] font-black uppercase sm:text-2xl">
          {p.nameLines[0]}
          <br />
          <span className={t.text}>{p.nameLines[1]}</span>
        </p>
        <p className="mt-1.5 font-ca-tag text-[0.8rem] text-ca-ink-2 sm:text-base">{p.hook}</p>
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
  const { status, claim, preview, error, reset } = useClaim("free-sample-v1");
  const fromParam = useSampleParam();
  const { left, allGone } = useInventory();
  const busy = status === "submitting" || status === "redirecting";
  // A pick that has since sold out no longer counts as a pick.
  const pick = selected && left[selected] > 0 ? selected : null;

  useEffect(() => {
    // Apply a ?sample= preselection once it's been read from the URL.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (fromParam) setSelected(fromParam);
  }, [fromParam]);

  useEffect(() => {
    const onSelect = (e: Event) => {
      setSelected((e as CustomEvent<SampleId>).detail);
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
    if (!pick) next.sample = "Pick one of the two samples above.";
    if (!firstName.trim()) next.firstName = "Add your first name.";
    if (!isValidEmail(email)) next.email = "Enter a valid email so we can send your order details.";
    setErrors(next);
    return next;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const next = validate();
    if (Object.keys(next).length || !pick) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (next.firstName) nameRef.current?.focus();
      else if (next.email) emailRef.current?.focus();
      return;
    }
    await claim({ firstName, email, sample: pick });
  }

  function jumpToForm() {
    document.getElementById("claim")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      if (!pick) return;
      if (!firstName.trim()) nameRef.current?.focus({ preventScroll: true });
      else if (!isValidEmail(email)) emailRef.current?.focus({ preventScroll: true });
    }, 450);
  }

  const chosen = pick ? samples[pick] : null;
  const ctaLabel = chosen ? `Claim my free ${chosen.weight}` : "Pick your free sample";
  const message = errors.firstName ?? errors.email ?? error;

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
              selected={pick === id}
              dimmed={pick !== null && pick !== id}
              soldOut={left[id] === 0}
              onSelect={select}
            />
          ))}
        </div>
        {errors.sample && (
          <p role="alert" className="mt-2 text-center text-xs font-bold text-ca-red">
            {errors.sample}
          </p>
        )}

        {allGone ? (
          <div className="mt-4 sm:mt-5">
            <AllClaimed />
          </div>
        ) : (
          <form
            noValidate
            onSubmit={onSubmit}
            className={cn(
              "relative mt-4 rounded-2xl border border-ca-line bg-ca-navy/90 p-3 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] backdrop-blur sm:mt-5 sm:p-4",
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
                  className={cn(inputClass, errors.firstName ? "border-ca-red" : "border-transparent")}
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
                  className={cn(inputClass, errors.email ? "border-ca-red" : "border-transparent")}
                />
              </label>
              <button
                ref={submitRef}
                type="submit"
                disabled={busy}
                className="group relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-ca-green-2 to-ca-green px-6 font-ca-display text-base font-black tracking-wide text-white uppercase shadow-[0_10px_30px_-6px_rgb(34_197_94/0.7)] transition active:scale-[0.98] disabled:opacity-80 sm:h-[3.25rem]"
              >
                <span aria-hidden className="ca-shimmer absolute inset-0 animate-ca-shimmer" />
                {busy ? (
                  <>
                    <Loader2 className="relative size-4 animate-spin" />
                    <span className="relative">
                      {status === "redirecting" ? "Opening checkout…" : "Locking it in…"}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="relative">{ctaLabel}</span>
                    <ArrowRight
                      className="relative size-5 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={2.5}
                    />
                  </>
                )}
              </button>
            </div>
            {message && (
              <p role="alert" className="mt-2 px-1 text-xs font-bold text-ca-red">
                {message}
              </p>
            )}
            <ConsentNote className="mt-2.5 px-1 text-center sm:text-left" />
          </form>
        )}
      </div>

      {/* Sticky claim bar on phones while the form is off-screen. */}
      <BodyPortal>
        <div
          className={cn(
            "ca-safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-ca-line bg-black/90 px-3 pt-3 backdrop-blur-xl transition-transform duration-300 sm:hidden",
            ctaVisible || allGone || status === "demo" ? "translate-y-full" : "translate-y-0",
          )}
        >
          <button
            type="button"
            onClick={jumpToForm}
            className="flex h-14 w-full items-center gap-3 rounded-xl bg-gradient-to-b from-ca-green-2 to-ca-green pr-4 pl-2 text-left font-ca-display font-black text-white uppercase shadow-[0_10px_30px_-6px_rgb(34_197_94/0.7)]"
          >
            <span className="flex -space-x-3">
              {(pick ? [pick] : sampleOrder).map((id) => (
                <span key={id} className="grid size-10 place-items-center rounded-lg bg-black/80">
                  <ProductArt sample={id} float={false} glow={false} className="size-9" />
                </span>
              ))}
            </span>
            <span className="flex-1 text-[0.95rem] leading-tight">
              {chosen ? `Claim free ${chosen.weight} ${chosen.shortName}` : "Pick your free sample"}
            </span>
            <ArrowRight className="size-5" strokeWidth={2.5} />
          </button>
        </div>
      </BodyPortal>

      <PreviewSheet preview={preview} onClose={reset} />
    </>
  );
}

export function ChooseButton({ sample, className }: { sample: SampleId; className?: string }) {
  const p = samples[sample];
  const soldOut = useInventory().left[sample] === 0;
  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() => {
        window.dispatchEvent(new CustomEvent(SELECT_EVENT, { detail: sample }));
        document.getElementById("claim")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className={cn(
        "inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-ca-green-2 to-ca-green px-6 font-ca-display text-sm font-black tracking-wide text-white uppercase shadow-[0_10px_30px_-8px_rgb(34_197_94/0.7)] transition active:scale-[0.98] disabled:from-ca-red/60 disabled:to-ca-red/60 disabled:shadow-none",
        className,
      )}
    >
      {soldOut ? (
        `${p.shortName} is sold out`
      ) : (
        <>
          Claim the free {p.weight} {p.shortName}
          <ArrowRight className="size-4" strokeWidth={2.5} />
        </>
      )}
    </button>
  );
}
