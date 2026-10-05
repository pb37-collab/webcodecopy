"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Flame } from "lucide-react";
import { claimConfig, isLive, type SampleId } from "@/lib/chunky/config";
import { samples, sampleOrder } from "@/lib/chunky/products";
import { cn } from "@/lib/utils";

/*
 * Limited-run stock: 150 of each sample. Counts start from the configured
 * fallback (claimConfig.stock.left) and switch to live numbers when the
 * inventory endpoint answers, refreshing while the page is open. Nothing here
 * invents scarcity: the page only ever shows the configured or live count.
 */

type Counts = Record<SampleId, number>;
interface InventoryState {
  left: Counts;
  live: boolean;
}

const { total, left: fallback, refreshMs } = claimConfig.stock;

const serverState: InventoryState = { left: { ...fallback }, live: false };
let state: InventoryState = serverState;
const listeners = new Set<() => void>();
let started = false;

function clamp(sample: SampleId, n: unknown): number | null {
  if (typeof n !== "number" || !Number.isFinite(n)) return null;
  return Math.min(total[sample], Math.max(0, Math.floor(n)));
}

function inventoryUrl(): string | null {
  const { url } = claimConfig.stock;
  if (url === "off") return null;
  if (url) return url;
  return claimConfig.mode === "chunky-api" && isLive()
    ? `${claimConfig.apiBase}/api/free-sample/inventory`
    : null;
}

async function refresh(url: string) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as Partial<Record<SampleId, unknown>>;
    const runtz = clamp("runtz", data.runtz);
    const snowcaps = clamp("snowcaps", data.snowcaps);
    if (runtz === null || snowcaps === null) return;
    state = { left: { runtz, snowcaps }, live: true };
    listeners.forEach((fn) => fn());
  } catch {
    // Keep showing the last known counts.
  }
}

function start() {
  if (started) return;
  started = true;
  const url = inventoryUrl();
  if (!url) return;
  void refresh(url);
  setInterval(() => void refresh(url), refreshMs);
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  start();
  return () => listeners.delete(fn);
}

export function useInventory(): InventoryState & { total: Counts; allGone: boolean; totalLeft: number } {
  const s = useSyncExternalStore(
    subscribe,
    () => state,
    () => serverState,
  );
  const totalLeft = s.left.runtz + s.left.snowcaps;
  return { ...s, total, totalLeft, allGone: totalLeft === 0 };
}

/**
 * Ticks a number down from `from` to `to` (and on to new values as they
 * arrive), so the count visibly counts down when the page opens.
 */
function useCountdown(to: number, from: number, ms = 1400): number {
  const [shown, setShown] = useState(from);
  const current = useRef(from);
  useEffect(() => {
    const start = current.current;
    if (start === to) return;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(start + (to - start) * eased);
      current.current = value;
      setShown(value);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return shown;
}

function Bar({ value, max, className }: { value: number; max: number; className: string }) {
  const pct = max ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", className)}
        // Width is data, not design: the share of the run still available.
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/** Hero strip: "Limited run · 279 of 300 left" with a per-strain bar. */
export function StockMeter({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "terminal";
}) {
  const { left, totalLeft, allGone } = useInventory();
  const runTotal = total.runtz + total.snowcaps;
  const shown = useCountdown(totalLeft, runTotal);
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[52rem] rounded-2xl border-2 border-ca-red/60 bg-ca-red/[0.08] px-3 py-2.5 sm:p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex -rotate-2 items-center gap-1.5 rounded-lg bg-ca-red px-2.5 py-1 font-ca-display text-[0.72rem] font-black tracking-wide text-white uppercase shadow-[2px_2px_0_#000] sm:text-sm">
          <Flame className="size-3.5 sm:size-4" /> Limited run
        </span>
        <p
          className={cn("font-ca-display font-black uppercase", tone === "terminal" && "font-ca-mono")}
          aria-live="polite"
        >
          {allGone ? (
            <span className="text-lg text-ca-red sm:text-2xl">All {runTotal} claimed</span>
          ) : (
            <>
              <span className="text-2xl text-white tabular-nums sm:text-3xl">{shown}</span>
              <span className="text-sm text-ca-ink-2 sm:text-base"> / {runTotal} left</span>
            </>
          )}
        </p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {sampleOrder.map((id) => (
          <StrainCount key={id} sample={id} count={left[id]} />
        ))}
      </div>
      <p className="mt-2 hidden text-center text-xs font-semibold text-ca-ink-3 sm:block">
        {`Only ${runTotal} samples exist: ${total.runtz} Runtz, ${total.snowcaps} Snowcaps. When they're gone, they're gone.`}
      </p>
    </div>
  );
}

function StrainCount({ sample, count }: { sample: SampleId; count: number }) {
  const shown = useCountdown(count, total[sample]);
  const out = count === 0;
  const low = !out && count <= claimConfig.stock.lowAt;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-1 text-[0.68rem] font-bold sm:text-xs">
        <span className="truncate text-ca-ink-2 uppercase">
          {samples[sample].shortName} {samples[sample].weight}
        </span>
        <span className={cn("tabular-nums", out || low ? "text-ca-red" : "text-white")}>
          {out ? "Sold out" : `${shown} left`}
        </span>
      </div>
      <Bar value={shown} max={total[sample]} className={sample === "runtz" ? "bg-runtz" : "bg-snow"} />
    </div>
  );
}

/** Per-product badge: "142 / 150 left", "Only 12 left", or "Sold out". */
export function StockBadge({ sample, className }: { sample: SampleId; className?: string }) {
  const { left } = useInventory();
  const count = left[sample];
  const shown = useCountdown(count, total[sample]);
  const out = count === 0;
  const low = !out && count <= claimConfig.stock.lowAt;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-ca-display text-[0.62rem] font-extrabold tracking-wide uppercase tabular-nums sm:text-[0.7rem]",
        out ? "bg-ca-red text-white" : low ? "bg-ca-red/20 text-ca-red" : "bg-black/50 text-white",
        className,
      )}
    >
      {out ? "Sold out" : low ? `Only ${shown} left` : `${shown} / ${total[sample]} left`}
    </span>
  );
}

/** "SOLD OUT" stamp laid over a product that's gone. */
export function SoldOutStamp({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-lg border-4 border-ca-red bg-black/70 px-3 py-1 font-ca-display text-xl font-black tracking-wide whitespace-nowrap text-ca-red uppercase sm:text-3xl",
        className,
      )}
    >
      Sold out
    </span>
  );
}

/** Replaces the form once every sample is claimed. */
export function AllClaimed() {
  return (
    <div className="rounded-2xl border-2 border-ca-red/60 bg-ca-navy/90 p-5 text-center">
      <p className="font-ca-display text-2xl font-black uppercase">
        All {total.runtz + total.snowcaps} claimed
      </p>
      <p className="mt-1 text-sm text-ca-ink-2">
        That&apos;s the whole limited run. Both strains are still in the shop.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {sampleOrder.map((id) => (
          <a
            key={id}
            href={samples[id].url}
            className="rounded-xl bg-gradient-to-b from-ca-green-2 to-ca-green px-4 py-3 font-ca-display text-sm font-black text-white uppercase"
          >
            Shop {samples[id].shortName}
          </a>
        ))}
      </div>
    </div>
  );
}
