"use client";

import { cn } from "@/lib/utils";
import { giveawayEnd, useNow } from "./experience";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Large segmented countdown for the hero. */
export function Countdown({ className }: { className?: string }) {
  const now = useNow();
  const p = now === null ? null : parts(giveawayEnd - now);
  const closed = now !== null && now >= giveawayEnd;
  const units = [
    { label: "Days", value: p?.days },
    { label: "Hours", value: p?.hours },
    { label: "Min", value: p?.minutes },
    { label: "Sec", value: p?.seconds },
  ];

  if (closed) {
    return (
      <div className={cn("rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center", className)}>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-eq">Entries closed</p>
        <p className="mt-1 text-sm text-ink-2">Winners are being drawn and will be notified by email.</p>
      </div>
    );
  }

  return (
    <div className={className} role="timer" aria-live="off" aria-label="Time left to enter">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((u) => (
          <div
            key={u.label}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-1 py-2 text-center sm:py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          >
            <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/40" aria-hidden />
            <span
              key={u.value ?? "x"}
              className="block animate-[eq-tick_350ms_ease-out] font-eq text-[1.7rem] font-semibold tabular-nums tracking-tight sm:text-4xl"
            >
              {u.value === undefined ? "--" : pad(u.value)}
            </span>
            <span className="mt-1 block font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink-3">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** One-line countdown for the ticker and sticky bar. */
export function CountdownInline({ className }: { className?: string }) {
  const now = useNow();
  if (now === null) return <span className={className}>--d --:--:--</span>;
  if (now >= giveawayEnd) return <span className={className}>Closed</span>;
  const p = parts(giveawayEnd - now);
  return (
    <span className={cn("tabular-nums", className)}>
      {p.days}d {pad(p.hours)}:{pad(p.minutes)}:{pad(p.seconds)}
    </span>
  );
}
