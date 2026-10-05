"use client";

import { useRef, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import type { SampleId } from "@/lib/chunky/config";
import { isValidEmail } from "@/lib/chunky/claim";
import { samples } from "@/lib/chunky/products";
import { cn } from "@/lib/utils";
import { Hand } from "./hand";
import { AllClaimed, SoldOutStamp, StockBadge, StockMeter, useInventory } from "./inventory";
import { ConsentNote, FreeSticker, ProductArt } from "./shared";
import { PreviewSheet, useClaim } from "./use-claim";

const hands: {
  sample: SampleId;
  side: "left" | "right";
  color: string;
  label: string;
  glow: string;
  text: string;
  fill: string;
  border: string;
}[] = [
  {
    sample: "runtz",
    side: "left",
    color: "#f43f5e",
    label: "The red hand",
    glow: "bg-[radial-gradient(closest-side,rgb(244_63_94/0.45),transparent)]",
    text: "text-runtz-hi",
    fill: "bg-runtz",
    border: "border-runtz shadow-[0_0_0_1px_var(--color-runtz),0_20px_60px_-20px_rgb(244_63_94/0.7)]",
  },
  {
    sample: "snowcaps",
    side: "right",
    color: "#22d3ee",
    label: "The blue hand",
    glow: "bg-[radial-gradient(closest-side,rgb(34_211_238/0.42),transparent)]",
    text: "text-snow-hi",
    fill: "bg-snow",
    border: "border-snow shadow-[0_0_0_1px_var(--color-snow),0_20px_60px_-20px_rgb(34_211_238/0.65)]",
  },
];

const inputClass =
  "h-[3.25rem] w-full rounded-xl border-2 bg-white px-4 font-medium text-gray-900 placeholder:text-gray-500 focus:border-ca-green-2 focus:outline-none";

/**
 * v2 hero: two hands, one sample in each. Tapping a hand picks it (the other
 * dims, and they can still switch); the email form then appears to claim it.
 * Submitting claims that sample and opens checkout.
 */
export function HandChoice() {
  const [selected, setSelected] = useState<SampleId | null>(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>({});
  const [shake, setShake] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const { status, claim, preview, error: claimError, reset } = useClaim("free-sample-v2");
  const { left, allGone } = useInventory();
  const busy = status === "submitting" || status === "redirecting";
  // A pick that has since sold out no longer counts as a pick.
  const pick = selected && left[selected] > 0 ? selected : null;
  const chosen = pick ? samples[pick] : null;
  const chosenHand = hands.find((h) => h.sample === pick);

  function choose(sample: SampleId) {
    if (busy || left[sample] === 0) return;
    const first = pick === null;
    setSelected(sample);
    // First pick: bring the claim form into view so the next step is obvious.
    if (first) {
      setTimeout(() => {
        const rect = formRef.current?.getBoundingClientRect();
        if (rect && rect.bottom > window.innerHeight) {
          formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 120);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !pick) return;
    const next: typeof errors = {};
    if (!firstName.trim()) next.firstName = "Add your first name.";
    if (!isValidEmail(email)) next.email = "Enter a valid email to claim your sample.";
    setErrors(next);
    if (next.firstName || next.email) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      (next.firstName ? nameRef : emailRef).current?.focus();
      return;
    }
    await claim({ firstName, email, sample: pick }, { delayMs: 900 });
  }

  const message = errors.firstName ?? errors.email ?? claimError;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="relative">
        <div role="radiogroup" aria-label="Pick a hand" className="grid grid-cols-2 gap-2 sm:gap-8">
          {hands.map((h) => {
            const p = samples[h.sample];
            const isChosen = pick === h.sample;
            const isOther = pick !== null && !isChosen;
            const soldOut = left[h.sample] === 0;
            return (
              <button
                key={h.sample}
                type="button"
                role="radio"
                aria-checked={isChosen}
                disabled={soldOut || busy}
                onClick={() => choose(h.sample)}
                aria-label={soldOut ? `${p.name}, sold out` : `${p.name}, ${p.weightLong}, free`}
                className={cn(
                  "group relative flex flex-col items-center text-center transition-all duration-500 ease-out",
                  !isChosen && !soldOut && "hover:-translate-y-1.5",
                  isChosen && "z-10 -translate-y-1 scale-[1.05]",
                  isOther && "scale-95 opacity-35 grayscale-[0.8] hover:opacity-60",
                  soldOut && "cursor-not-allowed",
                )}
              >
                <div className="relative aspect-[290/340] w-full max-w-[300px]">
                  <div
                    aria-hidden
                    className={cn(
                      "absolute inset-x-[5%] top-[30%] bottom-[5%] transition-opacity duration-500",
                      h.glow,
                      soldOut || isOther ? "opacity-0" : "opacity-100",
                      isChosen && "animate-ca-pulse",
                    )}
                  />
                  <Hand
                    color={h.color}
                    mirror={h.side === "right"}
                    lit={!soldOut && !isOther}
                    className="absolute inset-0 h-full w-full"
                  />
                  <div
                    className={cn(
                      "absolute top-[38%] w-[48%] transition-all duration-500",
                      h.side === "left" ? "left-[27%]" : "left-[25%]",
                      soldOut && "opacity-55 grayscale-[0.7]",
                    )}
                  >
                    <ProductArt sample={h.sample} priority glow={false} float={!soldOut && !isOther} />
                  </div>
                  {soldOut ? (
                    <SoldOutStamp className="top-[55%]" />
                  ) : (
                    <FreeSticker
                      sample={h.sample}
                      className="absolute top-[30%] right-[6%] scale-90 sm:scale-100"
                    />
                  )}
                  {isChosen && (
                    <span
                      className={cn(
                        "absolute top-[24%] left-1/2 grid size-9 -translate-x-1/2 animate-ca-rise place-items-center rounded-full text-black",
                        h.fill,
                      )}
                    >
                      <Check className="size-5" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-1 font-ca-mono text-[0.6rem] font-bold tracking-[0.14em] uppercase sm:text-[0.72rem]",
                    soldOut ? "text-ca-ink-3" : h.text,
                  )}
                >
                  {isChosen ? "Your pick" : h.label}
                </p>
                <p className="mt-1 font-ca-display text-[0.98rem] leading-[1.02] font-black uppercase sm:text-2xl">
                  {p.nameLines[0]}
                  <br />
                  {p.nameLines[1]}
                </p>
                <p className="mt-1 text-[0.7rem] font-semibold text-ca-ink-2 sm:text-sm">
                  {p.weight} · {p.type}
                </p>
                <StockBadge sample={h.sample} className="mt-1.5" />
              </button>
            );
          })}
        </div>

        <p
          aria-live="polite"
          className="mt-4 text-center font-ca-mono text-[0.72rem] tracking-[0.04em] text-ca-neon sm:text-sm"
        >
          {allGone
            ? "> the run is over. every sample is claimed_"
            : status === "redirecting" && chosen
              ? `> loading ${chosen.shortName.toLowerCase()} into your cart_`
              : chosen
                ? `> ${chosen.shortName.toLowerCase()} it is. claim it below_`
                : "> tap the hand you want_"}
        </p>
      </div>

      {/* The claim form appears once a hand is picked. */}
      <div ref={formRef} className={cn("scroll-mt-24", shake && "animate-ca-shake")}>
        {allGone ? (
          <div className="mt-5">
            <AllClaimed />
          </div>
        ) : chosen && chosenHand ? (
          <form
            noValidate
            onSubmit={onSubmit}
            className={cn(
              "mt-5 animate-ca-rise rounded-2xl border-2 bg-ca-navy/90 p-3 backdrop-blur transition-colors sm:p-4",
              chosenHand.border,
            )}
          >
            <div className="mb-3 flex items-center gap-3 px-1">
              <ProductArt sample={chosen.id} float={false} glow={false} className="size-12 shrink-0" />
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-ca-mono text-[0.62rem] font-bold tracking-[0.12em] uppercase",
                    chosenHand.text,
                  )}
                >
                  {chosenHand.label} · {chosen.weight} free
                </p>
                <p className="font-ca-display text-lg leading-tight font-black uppercase sm:text-xl">
                  Claim your {chosen.name}
                </p>
                <p className="text-xs text-ca-ink-2">
                  Enter your email to lock it in. Changed your mind? Tap the other hand.
                </p>
              </div>
            </div>
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
                    <span className="relative">Claim my free {chosen.weight}</span>
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
        ) : null}
      </div>

      <StockMeter tone="terminal" className="mt-5" />

      <PreviewSheet preview={preview} onClose={reset} />
    </div>
  );
}
