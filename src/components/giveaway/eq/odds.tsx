"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Users } from "lucide-react";
import { eqGiveaway as g } from "@/data/giveaways/davinci-eq-skyrise";
import {
  formatOdds,
  formatPercent,
  getServerStats,
  getStats,
  setStatsRef,
  statsAvailable,
  subscribeStats,
  winChance,
  type GiveawayStats,
} from "@/lib/giveaway-stats";
import { cn } from "@/lib/utils";
import { useEq } from "./experience";

function useStats(): GiveawayStats | null {
  const { entry } = useEq();
  useEffect(() => setStatsRef(entry?.refCode ?? null), [entry?.refCode]);
  return useSyncExternalStore(subscribeStats, getStats, getServerStats);
}

/**
 * The visitor's odds. Before entering: as if they entered now with one entry.
 * After: their own entry plus bonus entries for credited referrals (`extra`
 * previews more friends).
 */
function useOdds(stats: GiveawayStats | null, extraFriends = 0) {
  const { entry } = useEq();
  if (!stats) return null;
  const entered = Boolean(entry);
  const friends = (entered ? stats.referrals : 0) + extraFriends;
  const mine = 1 + g.referralBonus * friends;
  // Not entered yet: add them (and any previewed friends) to the pool.
  const entrants = stats.entrants + (entered ? 0 : 1) + extraFriends;
  const tickets = stats.tickets + (entered ? 0 : 1) + extraFriends + g.referralBonus * extraFriends;
  return { mine, friends, entered, chance: winChance(mine, tickets, entrants, g.winners) };
}

/** Counts up to the new value instead of jumping. */
function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    const dur = reduce ? 0 : Math.min(1600, 300 + Math.abs(value - start) * 2);
    let raf = 0;
    const step = (now: number) => {
      const p = dur === 0 ? 1 : Math.min(1, (now - t0) / dur);
      const v = Math.round(start + (value - start) * (1 - Math.pow(1 - p, 3)));
      setShown(v);
      from.current = v;
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className={cn("tabular-nums", className)}>{shown.toLocaleString("en-US")}</span>;
}

function LiveDot({ live }: { live: boolean }) {
  return (
    <span className="relative flex size-2">
      {live && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />}
      <span className={cn("relative inline-flex size-2 rounded-full", live ? "bg-emerald-400" : "bg-amber-300")} />
    </span>
  );
}

function DemoTag() {
  return (
    <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-1.5 py-px font-mono text-[9px] uppercase tracking-[0.12em] text-amber-100">
      Demo numbers
    </span>
  );
}

/** One-line live count + odds, under the hero countdown. */
export function EntryStatsBar({ className }: { className?: string }) {
  const stats = useStats();
  const odds = useOdds(stats);
  if (!statsAvailable) return null;

  return (
    <div
      className={cn(
        "flex min-h-11 flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[13px]",
        className,
      )}
      aria-live="polite"
    >
      {stats && odds ? (
        <>
          <span className="flex items-center gap-2 text-ink">
            <LiveDot live={stats.live} />
            <AnimatedNumber value={stats.entrants} className="font-semibold" /> entered
          </span>
          <span className="text-ink-2">
            {odds.entered ? "Your odds" : "Your odds if you enter now"}:{" "}
            <strong className="font-semibold text-eq">{formatOdds(odds.chance)}</strong>
          </span>
          {!stats.live && <DemoTag />}
        </>
      ) : (
        <span className="h-4 w-48 animate-pulse rounded bg-white/10" />
      )}
    </div>
  );
}

/** Full odds section: live count, the visitor's odds, and what each friend adds. */
export function OddsCalculator() {
  const stats = useStats();
  const [friends, setFriends] = useState(3);
  const now = useOdds(stats);
  const withFriends = useOdds(stats, friends);
  if (!statsAvailable) return null;

  const better = now && withFriends && now.chance > 0 ? withFriends.chance / now.chance : 1;

  return (
    <section className="relative border-t border-white/10">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:py-28">
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-eq">
            <LiveDot live={Boolean(stats?.live)} /> Live entry count {stats && !stats.live && <DemoTag />}
          </p>
          <p className="mt-4 text-[clamp(3.5rem,12vw,7rem)] leading-none font-semibold tracking-[-0.04em]">
            {stats ? <AnimatedNumber value={stats.entrants} /> : "—"}
          </p>
          <p className="mt-2 text-lg text-ink-2">
            people entered for {g.winners} rigs
            {stats && stats.tickets > stats.entrants && (
              <span className="text-ink-3"> · {stats.tickets.toLocaleString("en-US")} entries with bonuses</span>
            )}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                {now?.entered ? "Your odds now" : "Your odds if you enter"}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{now ? formatOdds(now.chance) : "—"}</p>
              <p className="mt-1 text-[13px] text-ink-3">
                {now ? `${formatPercent(now.chance)} · ${now.mine} ${now.mine === 1 ? "entry" : "entries"}` : ""}
              </p>
            </div>
            <div className="rounded-2xl border border-eq/40 bg-eq/[0.08] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-eq">
                +{friends} {friends === 1 ? "friend" : "friends"}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {withFriends ? formatOdds(withFriends.chance) : "—"}
              </p>
              <p className="mt-1 text-[13px] text-ink-2">
                {withFriends ? `${formatPercent(withFriends.chance)} · ${better.toFixed(1)}× better` : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0d0d12]/80 p-6 sm:p-8">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Stack the odds.</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
            Everyone starts with one entry. Each friend who enters with your link adds{" "}
            <strong className="text-ink">+{g.referralBonus}</strong> to yours. Slide to see what bringing friends does.
          </p>

          <div className="mt-7 flex items-baseline justify-between">
            <label htmlFor="eq-friends" className="text-sm text-ink-2">
              Friends who enter with your link
            </label>
            <span className="text-2xl font-semibold tabular-nums">{friends}</span>
          </div>
          <input
            id="eq-friends"
            type="range"
            min={0}
            max={10}
            step={1}
            value={friends}
            onChange={(e) => setFriends(Number(e.target.value))}
            className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[var(--eq)] [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-[#07070a] [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-[#07070a] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_var(--eq)]"
          />

          {/* Your entries as tickets */}
          <div className="mt-6 flex flex-wrap gap-1.5" aria-label={`${1 + g.referralBonus * friends} entries`}>
            {Array.from({ length: 1 + g.referralBonus * friends }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "grid h-7 w-5 animate-[eq-tick_300ms_ease-out] place-items-center rounded-[5px] text-[9px] font-bold",
                  i === 0 ? "bg-white text-[#08080b]" : "bg-eq text-[#08080b]",
                )}
              >
                {i === 0 ? "1" : "+"}
              </span>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-2 text-[13px] text-ink-3">
            <Users className="size-3.5" />
            {1 + g.referralBonus * friends} entries: 1 for you + {g.referralBonus * friends} bonus
          </p>

          <a
            href="#enter"
            className="mt-7 flex h-12 items-center justify-center rounded-xl bg-eq text-[15px] font-semibold text-[#08080b] hover:brightness-110"
          >
            {now?.entered ? "Get your share link" : "Enter and get your link"}
          </a>
          <p className="mt-3 text-[11.5px] leading-snug text-ink-3">
            Odds are estimates from the live entry count and change as more people enter. {g.winners} winners
            drawn at random from all eligible entries.
          </p>
        </div>
      </div>
    </section>
  );
}

/** Odds line for the post-entry share panel. */
export function ShareOdds() {
  const stats = useStats();
  const now = useOdds(stats);
  const next = useOdds(stats, 1);
  if (!statsAvailable || !stats || !now || !next) return null;
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 text-center">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-3">
          Your odds · {now.mine} {now.mine === 1 ? "entry" : "entries"}
        </p>
        <p className="mt-0.5 text-lg font-semibold">{formatOdds(now.chance)}</p>
      </div>
      <div className="rounded-xl border border-eq/40 bg-eq/10 px-3 py-2.5">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-eq">With 1 more friend</p>
        <p className="mt-0.5 text-lg font-semibold">{formatOdds(next.chance)}</p>
      </div>
      <p className="col-span-2 text-[11.5px] text-ink-3">
        <AnimatedNumber value={stats.entrants} /> entered so far{!stats.live && " (demo numbers)"}. Odds are estimates.
      </p>
    </div>
  );
}
