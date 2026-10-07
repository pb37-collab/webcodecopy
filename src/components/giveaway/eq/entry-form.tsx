"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check, Copy, Loader2, Share2 } from "lucide-react";
import { eqGiveaway } from "@/data/giveaways/davinci-eq-jacuzzi";
import {
  EMAIL_PATTERN,
  captureConfigured,
  refCodeFor,
  readAttribution,
  submitEntry,
} from "@/lib/giveaway";
import { bumpOwnEntry } from "@/lib/giveaway-stats";
import { cn } from "@/lib/utils";
import { ColorwayPicker } from "./colorway-picker";
import { useEnded, useEq } from "./experience";
import { ShareOdds } from "./odds";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "error"; message: string };

export function EntryForm({ id = "enter" }: { id?: string }) {
  const { colorway, entry, setEntry } = useEq();
  const ended = useEnded();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState(false);
  const [optIn, setOptIn] = useState(false);
  const [trap, setTrap] = useState("");
  const uid = useId();

  if (entry) return <SharePanel id={id} />;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(clean)) return setStatus({ kind: "error", message: "Enter a valid email address." });
    if (!age) return setStatus({ kind: "error", message: `Confirm you're ${eqGiveaway.minAge}+ and accept the rules.` });
    if (!optIn) return setStatus({ kind: "error", message: "Opt in to emails to enter. Unsubscribe anytime." });

    setStatus({ kind: "submitting" });
    const refCode = await refCodeFor(clean, eqGiveaway.slug);
    // Bots fill the hidden field; give them a success screen and save nothing.
    if (trap) {
      setEntry({ refCode, email: clean, demo: true });
      return;
    }
    const { utm, ref } = readAttribution(window.location.search);
    const result = await submitEntry({
      email: clean,
      firstName: firstName.trim().slice(0, 60),
      colorway: colorway.name,
      refCode,
      referredBy: ref,
      giveaway: `${eqGiveaway.brand} ${eqGiveaway.productShort}`,
      utm,
      marketingOptIn: true,
      ageConfirmed: true,
    });
    if (!result.ok) return setStatus({ kind: "error", message: result.error });
    bumpOwnEntry();
    setEntry({ refCode, email: clean, demo: result.demo });
  }

  const busy = status.kind === "submitting";

  return (
    <form
      id={id}
      onSubmit={onSubmit}
      noValidate
      className="relative scroll-mt-24 rounded-3xl border border-white/10 bg-[#0d0d12]/80 p-5 shadow-[0_40px_120px_-40px_var(--eq)] backdrop-blur-xl sm:p-6"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Enter to win</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">Free · 10 seconds</span>
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-[0.8fr_1.2fr]">
        <label className="sr-only" htmlFor={`${uid}-name`}>First name</label>
        <input
          id={`${uid}-name`}
          name="firstName"
          autoComplete="given-name"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={ended || busy}
          className="h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-eq/70 focus:bg-white/[0.06]"
        />
        <label className="sr-only" htmlFor={`${uid}-email`}>Email address</label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={ended || busy}
          aria-invalid={status.kind === "error" && !EMAIL_PATTERN.test(email.trim()) ? true : undefined}
          className="h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-eq/70 focus:bg-white/[0.06]"
        />
      </div>

      {/* Honeypot: hidden from people and assistive tech. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      <fieldset className="mt-4">
        <legend className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
          Your colorway if you win
        </legend>
        <ColorwayPicker className="mt-2" />
      </fieldset>

      <div className="mt-4 space-y-2.5 text-[13px] leading-snug text-ink-2">
        <Checkbox checked={age} onChange={setAge} disabled={ended || busy}>
          I&rsquo;m {eqGiveaway.minAge}+ and agree to the{" "}
          <a href="#rules" className="text-ink underline decoration-white/30 underline-offset-2 hover:decoration-eq">
            official rules
          </a>
          .
        </Checkbox>
        <Checkbox checked={optIn} onChange={setOptIn} disabled={ended || busy}>
          Yes, email me {eqGiveaway.brand} drops, restocks and offers. Unsubscribe anytime.
        </Checkbox>
      </div>

      <button
        type="submit"
        disabled={ended || busy}
        className="group relative mt-5 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-eq text-[15px] font-semibold text-[#08080b] transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-[eq-shine_3.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"
        />
        {ended ? (
          "Entries closed"
        ) : busy ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Entering…
          </>
        ) : (
          <>
            Enter the giveaway <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      <p role="status" aria-live="polite" className={cn("mt-3 min-h-5 text-[13px]", status.kind === "error" ? "text-[#ff8f8f]" : "text-ink-3")}>
        {status.kind === "error"
          ? status.message
          : `${eqGiveaway.winners} winners · drawn ${eqGiveaway.drawDate} · No purchase necessary`}
      </p>

      {!captureConfigured && <DemoNote />}
    </form>
  );
}

function Checkbox({
  checked,
  onChange,
  disabled,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3", disabled && "cursor-not-allowed opacity-60")}>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden
        className={cn(
          "mt-px grid size-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-eq",
          checked ? "border-eq bg-eq text-[#08080b]" : "border-white/25 bg-white/[0.03]",
        )}
      >
        {checked && <Check className="size-3" strokeWidth={3.5} />}
      </span>
      <span>{children}</span>
    </label>
  );
}

function DemoNote() {
  return (
    <p className="mt-3 rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-[12px] leading-snug text-amber-100">
      <strong className="font-semibold">Demo mode:</strong>{" "}entry capture isn&rsquo;t connected yet, so entries
      aren&rsquo;t saved. Set the Klaviyo or webhook variables before launch.
    </p>
  );
}

function SharePanel({ id }: { id: string }) {
  const { entry, colorway } = useEq();
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");
  const [canShare, setCanShare] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!entry) return;
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("ref", entry.refCode);
    // Browser-only values, read after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLink(url.toString());
    setCanShare(typeof navigator.share === "function");
    ref.current?.focus();
  }, [entry]);

  if (!entry) return null;
  const text = `I just entered to win a ${eqGiveaway.brand} ${eqGiveaway.product} kit plus ${eqGiveaway.bonus.size} of live hash rosin. ${eqGiveaway.winners} winners. Enter here:`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the link is still selectable in the field.
    }
  }

  return (
    <div
      id={id}
      ref={ref}
      tabIndex={-1}
      className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-eq/40 bg-[#0d0d12]/85 p-5 shadow-[0_40px_120px_-40px_var(--eq)] outline-none backdrop-blur-xl sm:p-6"
    >
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-eq/25 blur-3xl" />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-eq px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#08080b]">
          <Check className="size-3" strokeWidth={3} /> You&rsquo;re in
        </span>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">
          Entry locked: <span className="text-eq">{colorway.name}</span>.
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
          Want better odds? Every friend who enters with your link adds{" "}
          <strong className="text-ink">+{eqGiveaway.referralBonus} bonus entries</strong> to yours.
        </p>

        <ShareOdds />

        <div className="mt-4 flex gap-2">
          <input
            readOnly
            value={link}
            aria-label="Your referral link"
            onFocus={(e) => e.currentTarget.select()}
            className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 font-mono text-[12.5px] text-ink-2 outline-none focus:border-eq/70"
          />
          <button
            type="button"
            onClick={copy}
            className="flex h-12 shrink-0 items-center gap-1.5 rounded-xl bg-eq px-4 text-sm font-semibold text-[#08080b] hover:brightness-110"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="mt-2.5 grid grid-cols-3 gap-2 text-[13px] font-medium">
          {canShare && (
            <button
              type="button"
              onClick={() => navigator.share({ title: document.title, text, url: link }).catch(() => {})}
              className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-white/25"
            >
              <Share2 className="size-4" /> Share
            </button>
          )}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] hover:border-white/25"
          >
            Post on X
          </a>
          <a
            href={`sms:?&body=${encodeURIComponent(`${text} ${link}`)}`}
            className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] hover:border-white/25"
          >
            Text a friend
          </a>
        </div>

        <p className="mt-4 border-t border-white/10 pt-4 text-[13px] text-ink-3">
          Can&rsquo;t wait for the draw?{" "}
          <a
            href={eqGiveaway.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline decoration-eq/60 underline-offset-2 hover:decoration-eq"
          >
            Shop the {eqGiveaway.productShort} at {eqGiveaway.brand}
          </a>
          .
        </p>
        {entry.demo && <DemoNote />}
      </div>
    </div>
  );
}
