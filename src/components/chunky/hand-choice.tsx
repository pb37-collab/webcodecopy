"use client";

import { useRef, useState } from "react";
import { ArrowRight, Check, Loader2, Lock, LockOpen } from "lucide-react";
import type { SampleId } from "@/lib/chunky/config";
import { ClaimError, isValidEmail, submitEmail } from "@/lib/chunky/claim";
import { samples } from "@/lib/chunky/products";
import { cn } from "@/lib/utils";
import { Hand } from "./hand";
import { AllClaimed, SoldOutStamp, StockBadge, StockMeter, useInventory } from "./inventory";
import { ConsentNote, FreeSticker, ProductArt } from "./shared";
import { PreviewSheet, useClaim } from "./use-claim";

type Step = "email" | "choose";

const hands: {
  sample: SampleId;
  side: "left" | "right";
  color: string;
  label: string;
  glow: string;
  text: string;
  fill: string;
}[] = [
  {
    sample: "runtz",
    side: "left",
    color: "#f43f5e",
    label: "The red hand",
    glow: "bg-[radial-gradient(closest-side,rgb(244_63_94/0.45),transparent)]",
    text: "text-runtz-hi",
    fill: "bg-runtz",
  },
  {
    sample: "snowcaps",
    side: "right",
    color: "#22d3ee",
    label: "The blue hand",
    glow: "bg-[radial-gradient(closest-side,rgb(34_211_238/0.42),transparent)]",
    text: "text-snow-hi",
    fill: "bg-snow",
  },
];

const inputClass =
  "h-[3.25rem] w-full rounded-xl border-2 border-transparent bg-white px-4 font-medium text-gray-900 placeholder:text-gray-500 focus:border-ca-green-2 focus:outline-none";

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  return `${user.slice(0, 2)}${user.length > 2 ? "•••" : ""}@${domain}`;
}

/**
 * v2 hero: two hands, one sample in each. The email comes first: until it's
 * in, the hands are locked. Picking a hand claims that sample and opens checkout.
 */
export function HandChoice() {
  const [step, setStep] = useState<Step>("email");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [shake, setShake] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [chosen, setChosen] = useState<SampleId | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const handsRef = useRef<HTMLDivElement>(null);
  const { status, claim, preview, error: claimError, reset } = useClaim("free-sample-v2");
  const { left, allGone } = useInventory();
  const unlocked = step === "choose";

  function bump() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (!firstName.trim()) {
      setFormError("Add your first name.");
      nameRef.current?.focus();
      bump();
      return;
    }
    if (!isValidEmail(email)) {
      setFormError("Enter a valid email to unlock the choice.");
      emailRef.current?.focus();
      bump();
      return;
    }
    setSaving(true);
    try {
      // Saves the lead now, so it isn't lost if they leave before choosing.
      await submitEmail({ firstName, email, source: "free-sample-v2" });
    } catch (err) {
      setFormError(err instanceof ClaimError ? err.message : "Something went wrong. Please try again.");
      setSaving(false);
      bump();
      return;
    }
    setSaving(false);
    setFormError(null);
    setNudge(false);
    setStep("choose");
    requestAnimationFrame(() => {
      const rect = handsRef.current?.getBoundingClientRect();
      if (rect && (rect.top < 0 || rect.bottom > window.innerHeight)) {
        handsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  async function pick(sample: SampleId) {
    if (chosen || left[sample] === 0) return;
    if (!unlocked) {
      // Email first. Point them at the form.
      setNudge(true);
      bump();
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => (firstName.trim() ? emailRef : nameRef).current?.focus({ preventScroll: true }), 350);
      return;
    }
    setChosen(sample);
    const ok = await claim({ firstName, email, sample }, { delayMs: 1400, emailAlreadySubmitted: true });
    if (!ok) setChosen(null);
  }

  function closePreview() {
    reset();
    setChosen(null);
  }

  const chosenProduct = chosen ? samples[chosen] : null;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div ref={handsRef} className="relative">
        <div className="grid grid-cols-2 gap-2 sm:gap-8">
          {hands.map((h) => {
            const p = samples[h.sample];
            const isChosen = chosen === h.sample;
            const isOther = chosen !== null && !isChosen;
            const soldOut = left[h.sample] === 0;
            return (
              <button
                key={h.sample}
                type="button"
                onClick={() => void pick(h.sample)}
                aria-disabled={chosen !== null || soldOut}
                aria-label={
                  soldOut
                    ? `${p.name}, sold out`
                    : unlocked
                      ? `Choose ${p.name}, ${p.weightLong}, free`
                      : `${p.name}, locked. Enter your email first.`
                }
                className={cn(
                  "group relative flex flex-col items-center text-center transition-all duration-700 ease-out",
                  unlocked && !chosen && "hover:-translate-y-1.5",
                  isChosen && "z-10 -translate-y-2 scale-[1.06]",
                  isOther && "scale-95 opacity-15 blur-[2px] grayscale",
                  soldOut && !isOther && "cursor-not-allowed",
                )}
              >
                <div className="relative aspect-[290/340] w-full max-w-[300px]">
                  <div
                    aria-hidden
                    className={cn(
                      "absolute inset-x-[5%] top-[30%] bottom-[5%] transition-opacity duration-700",
                      h.glow,
                      unlocked ? "opacity-100" : "opacity-0",
                      isChosen && "animate-ca-pulse",
                    )}
                  />
                  <Hand
                    color={h.color}
                    mirror={h.side === "right"}
                    lit={unlocked}
                    className="absolute inset-0 h-full w-full"
                  />
                  <div
                    className={cn(
                      "absolute top-[38%] w-[48%] transition-all duration-700",
                      h.side === "left" ? "left-[27%]" : "left-[25%]",
                      (!unlocked || soldOut) && "opacity-55 grayscale-[0.7]",
                    )}
                  >
                    <ProductArt sample={h.sample} priority glow={false} float={unlocked && !chosen} />
                  </div>
                  {soldOut && <SoldOutStamp className="top-[55%]" />}
                  {!unlocked && !soldOut && (
                    <span className="absolute top-[64%] left-1/2 grid size-8 -translate-x-1/2 place-items-center rounded-full border border-white/15 bg-black/75 text-ca-ink-2 backdrop-blur">
                      <Lock className="size-3.5" />
                    </span>
                  )}
                  {unlocked && !chosen && !soldOut && (
                    <FreeSticker
                      sample={h.sample}
                      className="absolute top-[30%] right-[6%] scale-90 sm:scale-100"
                    />
                  )}
                  {isChosen && (
                    <span
                      className={cn(
                        "absolute top-[28%] left-1/2 grid size-9 -translate-x-1/2 animate-ca-rise place-items-center rounded-full text-black",
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
                    unlocked ? h.text : "text-ca-ink-3",
                  )}
                >
                  {h.label}
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
          className={cn(
            "mt-4 text-center font-ca-mono text-[0.72rem] tracking-[0.04em] sm:text-sm",
            nudge && !unlocked ? "text-ca-red" : "text-ca-neon",
          )}
        >
          {chosenProduct
            ? `> loading ${chosenProduct.shortName.toLowerCase()} into your cart_`
            : unlocked
              ? allGone
                ? "> the run is over. every sample is claimed_"
                : "> unlocked. tap the hand you want_"
              : nudge
                ? "> email first. then the choice is yours_"
                : "> locked. enter your email below to choose_"}
        </p>
        {claimError && (
          <p role="alert" className="mt-2 text-center text-xs font-bold text-ca-red">
            {claimError}
          </p>
        )}
      </div>

      <StockMeter tone="terminal" className="mt-5" />

      {/* Step 1: email gate. Collapses to a pill once it's done. */}
      <div ref={formRef} className={cn("mt-4 scroll-mt-24", shake && "animate-ca-shake")}>
        {allGone ? (
          <AllClaimed />
        ) : unlocked ? (
          <div className="mx-auto flex max-w-md items-center justify-between gap-3 rounded-full border border-ca-green/50 bg-ca-green/10 py-2 pr-2 pl-4 text-sm">
            <span className="flex min-w-0 items-center gap-2 text-ca-ink-2">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ca-green-2 text-black">
                <Check className="size-3" strokeWidth={3} />
              </span>
              <span className="truncate">
                Sending to <span className="font-semibold text-white">{maskEmail(email)}</span>
              </span>
            </span>
            <button
              type="button"
              disabled={chosen !== null}
              onClick={() => setStep("email")}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-ca-neon hover:bg-white/5"
            >
              Change
            </button>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={unlock}
            className={cn(
              "rounded-2xl border bg-ca-navy/90 p-3 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] backdrop-blur transition-colors sm:p-4",
              nudge ? "border-ca-red/70" : "border-ca-line",
            )}
          >
            <p className="mb-2.5 px-1 font-ca-mono text-[0.68rem] font-bold tracking-[0.1em] text-ca-neon uppercase">
              Step 1 of 2 · Where do we send it?
            </p>
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
                  className={inputClass}
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
                  className={inputClass}
                />
              </label>
              <button
                type="submit"
                disabled={saving}
                className="group relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-ca-green-2 to-ca-green px-6 font-ca-display text-base font-black tracking-wide text-white uppercase shadow-[0_10px_30px_-6px_rgb(34_197_94/0.7)] transition active:scale-[0.98] sm:h-[3.25rem]"
              >
                <span aria-hidden className="ca-shimmer absolute inset-0 animate-ca-shimmer" />
                {saving ? (
                  <Loader2 className="relative size-4 animate-spin" />
                ) : (
                  <LockOpen className="relative size-4" />
                )}
                <span className="relative">Unlock the choice</span>
                <ArrowRight
                  className="relative size-5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2.5}
                />
              </button>
            </div>
            {formError && (
              <p role="alert" className="mt-2 px-1 text-xs font-bold text-ca-red">
                {formError}
              </p>
            )}
            <ConsentNote className="mt-2.5 px-1 text-center sm:text-left" />
          </form>
        )}
      </div>

      {chosenProduct && status !== "demo" && !claimError && (
        <div className="mt-5 flex animate-ca-rise items-center justify-center gap-2 text-sm font-semibold text-ca-ink-2">
          <Loader2 className="size-4 animate-spin" />
          Good choice{firstName.trim() ? `, ${firstName.trim()}` : ""}. Opening checkout…
        </div>
      )}

      <PreviewSheet preview={preview} onClose={closePreview} />
    </div>
  );
}
