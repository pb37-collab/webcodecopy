"use client";

import { useRef, useState } from "react";
import { ArrowRight, Check, Loader2, Lock, LockOpen } from "lucide-react";
import type { SampleId } from "@/lib/chunky/config";
import { captureLead, isValidEmail, normalizeLead, track } from "@/lib/chunky/claim";
import { samples } from "@/lib/chunky/products";
import { cn } from "@/lib/utils";
import { Hand } from "./hand";
import { ConsentNote, ProductArt } from "./shared";
import { DemoSheet, useClaim } from "./use-claim";

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
    color: "#ff2e4d",
    label: "The red hand",
    text: "text-[#ff2e4d]",
    fill: "bg-[#ff2e4d]",
    glow: "bg-[radial-gradient(closest-side,rgb(255_46_77/0.45),transparent)]",
  },
  {
    sample: "snowcaps",
    side: "right",
    color: "#4db8ff",
    label: "The blue hand",
    text: "text-[#4db8ff]",
    fill: "bg-[#4db8ff]",
    glow: "bg-[radial-gradient(closest-side,rgb(77_184_255/0.42),transparent)]",
  },
];

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  return `${user.slice(0, 2)}${user.length > 2 ? "•••" : ""}@${domain}`;
}

/**
 * v2 hero: two hands, one nug in each. The email comes first: until it's in,
 * the hands are locked. Picking a hand claims that sample and opens the cart.
 */
export function HandChoice() {
  const [step, setStep] = useState<Step>("email");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [chosen, setChosen] = useState<SampleId | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const handsRef = useRef<HTMLDivElement>(null);
  const { status, claim, demoUrl, reset } = useClaim("free-sample-v2");
  const unlocked = step === "choose";

  function bump() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) {
      setError("Add your first name.");
      nameRef.current?.focus();
      bump();
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email to unlock the choice.");
      emailRef.current?.focus();
      bump();
      return;
    }
    setError(null);
    setNudge(false);
    setStep("choose");
    track("free_sample_email", { page: "free-sample-v2" });
    // Save the lead now, so it isn't lost if they leave before choosing.
    void captureLead(normalizeLead({ firstName, email, source: "free-sample-v2" }), "email");
    requestAnimationFrame(() => {
      const rect = handsRef.current?.getBoundingClientRect();
      if (rect && (rect.top < 0 || rect.bottom > window.innerHeight)) {
        handsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  function pick(sample: SampleId) {
    if (chosen) return;
    if (!unlocked) {
      // Email first. Point them at the form.
      setNudge(true);
      bump();
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => (firstName.trim() ? emailRef : nameRef).current?.focus({ preventScroll: true }), 350);
      return;
    }
    setChosen(sample);
    void claim({ firstName, email, sample }, 1400);
  }

  function closeDemo() {
    reset();
    setChosen(null);
  }

  const chosenProduct = chosen ? samples[chosen] : null;

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* The hands. */}
      <div ref={handsRef} className="relative">
        <div className="grid grid-cols-2 gap-2 sm:gap-8">
          {hands.map((h) => {
            const p = samples[h.sample];
            const isChosen = chosen === h.sample;
            const isOther = chosen !== null && !isChosen;
            return (
              <button
                key={h.sample}
                type="button"
                onClick={() => pick(h.sample)}
                aria-disabled={chosen !== null}
                aria-label={
                  unlocked
                    ? `Choose ${p.name}, ${p.weightLong}, free`
                    : `${p.name}, locked. Enter your email first.`
                }
                className={cn(
                  "group relative flex flex-col items-center text-center transition-all duration-700 ease-out",
                  unlocked && !chosen && "hover:-translate-y-1.5",
                  isChosen && "z-10 -translate-y-2 scale-[1.06]",
                  isOther && "scale-95 opacity-15 blur-[2px] grayscale",
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
                      "absolute top-[39%] w-[46%] transition-all duration-700",
                      h.side === "left" ? "left-[28%]" : "left-[26%]",
                      !unlocked && "opacity-55 grayscale-[0.7]",
                    )}
                  >
                    <ProductArt sample={h.sample} priority glow={false} float={unlocked && !chosen} />
                  </div>
                  {!unlocked && (
                    <span className="absolute top-[64%] left-1/2 grid size-8 -translate-x-1/2 place-items-center rounded-full border border-white/15 bg-black/75 text-ca-ink-2 backdrop-blur">
                      <Lock className="size-3.5" />
                    </span>
                  )}
                  {isChosen && (
                    <span
                      className={cn(
                        "absolute top-[30%] left-1/2 grid size-9 -translate-x-1/2 animate-ca-rise place-items-center rounded-full text-ca-bg",
                        h.fill,
                      )}
                    >
                      <Check className="size-5" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-1 font-ca-mono text-[0.6rem] tracking-[0.18em] uppercase sm:text-[0.7rem]",
                    unlocked ? h.text : "text-ca-ink-3",
                  )}
                >
                  {h.label}
                </p>
                <p className="mt-1 font-ca-display text-[1rem] leading-[1.1] font-medium sm:text-2xl">
                  {p.nameLines[0]}
                  <br />
                  <span className="italic">{p.nameLines[1]}</span>
                </p>
                <p className="mt-1 text-[0.7rem] font-semibold text-ca-ink-2 sm:text-sm">
                  {p.weight} · {p.type} · {p.hook}
                </p>
              </button>
            );
          })}
        </div>

        <p
          aria-live="polite"
          className={cn(
            "mt-4 text-center font-ca-mono text-[0.72rem] tracking-[0.06em] sm:text-sm",
            nudge && !unlocked ? "text-ruby-hi" : "text-ca-ink-3",
          )}
        >
          {chosenProduct
            ? `> loading ${chosenProduct.shortName.toLowerCase()} into your cart_`
            : unlocked
              ? "> unlocked. tap the hand you want_"
              : nudge
                ? "> email first. then the choice is yours_"
                : "> locked. enter your email below to choose_"}
        </p>
      </div>

      {/* Step 1: email gate. Collapses to a pill once it's done. */}
      <div ref={formRef} className={cn("mt-5 scroll-mt-24", shake && "animate-ca-shake")}>
        {unlocked ? (
          <div className="mx-auto flex max-w-md items-center justify-between gap-3 rounded-full border border-ca-line-2 bg-ca-card/80 py-2 pr-2 pl-4 text-sm backdrop-blur">
            <span className="flex min-w-0 items-center gap-2 text-ca-ink-2">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-400/90 text-ca-bg">
                <Check className="size-3" strokeWidth={3} />
              </span>
              <span className="truncate">
                Sending to <span className="font-semibold text-ca-ink">{maskEmail(email)}</span>
              </span>
            </span>
            <button
              type="button"
              disabled={chosen !== null}
              onClick={() => setStep("email")}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-ca-gold hover:bg-white/5"
            >
              Change
            </button>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={unlock}
            className={cn(
              "rounded-[1.4rem] border bg-ca-card/85 p-3 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] backdrop-blur transition-colors sm:p-4",
              nudge ? "border-ruby/60" : "border-ca-line-2",
            )}
          >
            <p className="mb-2.5 px-1 font-ca-mono text-[0.66rem] tracking-[0.14em] text-ca-ink-2 uppercase">
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
                  className="h-[3.25rem] w-full rounded-xl border border-ca-line bg-ca-bg/80 px-4 text-ca-ink placeholder:text-ca-ink-3 focus:border-ca-gold focus:outline-none"
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
                  className="h-[3.25rem] w-full rounded-xl border border-ca-line bg-ca-bg/80 px-4 text-ca-ink placeholder:text-ca-ink-3 focus:border-ca-gold focus:outline-none"
                />
              </label>
              <button
                type="submit"
                className="group relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-xl bg-ca-ink px-6 text-[0.95rem] font-extrabold text-ca-bg transition active:scale-[0.98] sm:h-[3.25rem]"
              >
                <span aria-hidden className="ca-shimmer absolute inset-0 animate-ca-shimmer" />
                <LockOpen className="relative size-4" />
                <span className="relative">Unlock the choice</span>
                <ArrowRight className="relative size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
            {error && (
              <p role="alert" className="mt-2 px-1 text-xs font-semibold text-ruby-hi">
                {error}
              </p>
            )}
            <ConsentNote className="mt-2.5 px-1 text-center sm:text-left" />
          </form>
        )}
      </div>

      {chosenProduct && status !== "demo" && (
        <div className="mt-5 flex animate-ca-rise items-center justify-center gap-2 text-sm font-semibold text-ca-ink-2">
          <Loader2 className="size-4 animate-spin" />
          Good choice{firstName.trim() ? `, ${firstName.trim()}` : ""}. Opening your cart…
        </div>
      )}

      <DemoSheet url={demoUrl} onClose={closeDemo} />
    </div>
  );
}
