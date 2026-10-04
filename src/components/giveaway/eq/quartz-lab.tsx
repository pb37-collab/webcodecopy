"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Flame, RotateCcw } from "lucide-react";
import { eqGiveaway } from "@/data/giveaways/davinci-eq-skyrise";
import { cn } from "@/lib/utils";

const ROOM = 72;
const MIN = 450;
const MAX = 650;
const HEAT_SECONDS = 25;
/** The demo runs the 25-second heat-up at 10× speed (and says so). */
const SPEED = 10;

// Gauge geometry: a 240° arc.
const R = 128;
const CX = 160;
const CY = 160;
const START = 150;
const SWEEP = 240;

function polar(deg: number, r = R) {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function arc(fromDeg: number, toDeg: number, r = R) {
  const a = polar(fromDeg, r);
  const b = polar(toDeg, r);
  const large = toDeg - fromDeg > 180 ? 1 : 0;
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

const angleFor = (temp: number) => START + ((temp - ROOM) / (MAX - ROOM)) * SWEEP;

/** Blend from the colorway's cool glass toward amber and white-hot. */
function heatColor(temp: number) {
  const t = Math.min(1, Math.max(0, (temp - 250) / (MAX - 250)));
  const warm = Math.round(t * 100);
  return `color-mix(in oklab, color-mix(in oklab, #ff8a2b ${Math.min(100, warm * 1.6)}%, var(--eq)) ${100 - Math.max(0, warm - 70)}%, #fff3dc)`;
}

/**
 * Interactive "quartz lab": pick a temperature on the dial, then watch the
 * crucible run the EQ's 25-second heat-up. Auto-runs once on first view.
 */
export function QuartzLab() {
  const [setpoint, setSetpoint] = useState(520);
  const [temp, setTemp] = useState(ROOM);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const raf = useRef<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const autoRan = useRef(false);

  const zone = eqGiveaway.tempZones.find((z) => setpoint >= z.min && setpoint <= z.max) ?? eqGiveaway.tempZones[0];

  const run = useCallback((target: number) => {
    if (raf.current) cancelAnimationFrame(raf.current);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTemp(target);
      setElapsed(HEAT_SECONDS);
      return;
    }
    const duration = (HEAT_SECONDS / SPEED) * 1000;
    const t0 = performance.now();
    setRunning(true);
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 2.4);
      setTemp(Math.round(ROOM + (target - ROOM) * eased));
      setElapsed(p * HEAT_SECONDS);
      if (p < 1) raf.current = requestAnimationFrame(step);
      else setRunning(false);
    };
    raf.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !autoRan.current) {
          autoRan.current = true;
          run(520);
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [run]);

  const hot = heatColor(temp);
  const glow = Math.max(0, (temp - 200) / (MAX - 200));
  const done = !running && temp > ROOM && elapsed >= HEAT_SECONDS;

  return (
    <div ref={root} className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
      {/* Gauge + crucible */}
      <div className="relative mx-auto w-full max-w-[440px]">
        <svg viewBox="0 0 320 300" className="w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="eq-gauge" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" style={{ stopColor: "var(--eq)" }} />
              <stop offset="0.7" stopColor="#ff8a2b" />
              <stop offset="1" stopColor="#fff3dc" />
            </linearGradient>
            <radialGradient id="eq-heat" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" style={{ stopColor: hot, stopOpacity: 0.95 }} />
              <stop offset="1" style={{ stopColor: hot, stopOpacity: 0 }} />
            </radialGradient>
            <linearGradient id="eq-glass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
              <stop offset="0.35" stopColor="#fff" stopOpacity="0.06" />
              <stop offset="0.8" stopColor="#fff" stopOpacity="0.16" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Track, zones, progress */}
          <path d={arc(START, START + SWEEP)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" />
          <path d={arc(angleFor(MIN), angleFor(MAX))} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="10" />
          <path
            d={arc(START, Math.max(START + 0.01, angleFor(temp)))}
            fill="none"
            stroke="url(#eq-gauge)"
            strokeWidth="10"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 ${4 + glow * 10}px ${hot})` }}
          />
          {[MIN, 520, 590, MAX].map((t) => {
            const a = polar(angleFor(t), R + 14);
            const b = polar(angleFor(t), R + 22);
            const l = polar(angleFor(t), R + 36);
            return (
              <g key={t}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                <text x={l.x} y={l.y} fill="rgba(255,255,255,0.45)" fontSize="9" textAnchor="middle" dominantBaseline="middle" className="font-mono">
                  {t}°
                </text>
              </g>
            );
          })}
          {/* Setpoint marker */}
          {(() => {
            const p = polar(angleFor(setpoint));
            return <circle cx={p.x} cy={p.y} r="8" fill="#07070a" strokeWidth="3" style={{ stroke: "var(--eq)" }} />;
          })()}

          {/* Heat bloom */}
          <circle cx={CX} cy={CY + 34} r={60 + glow * 40} fill="url(#eq-heat)" opacity={0.25 + glow * 0.75} />

          {/* Quartz crucible */}
          <g transform={`translate(${CX - 46} ${CY + 4})`}>
            <path d="M0 14 L8 64 Q46 80 84 64 L92 14" fill="url(#eq-glass)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
            <path d="M10 58 Q46 72 82 58 L80 66 Q46 80 12 66 Z" opacity={0.15 + glow * 0.85} style={{ fill: hot }} />
            <ellipse cx="46" cy="14" rx="46" ry="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
            <ellipse cx="46" cy="62" rx="34" ry="8" opacity={glow * 0.9} style={{ fill: hot, filter: `blur(${2 + glow * 4}px)` }} />
            <path d="M14 22 L20 58" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Shimmer when hot */}
          {glow > 0.4 &&
            [0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${CX - 20 + i * 20} ${CY - 2} q 6 -12 0 -24 q -6 -12 0 -24`}
                fill="none"
                stroke="#fff"
                strokeOpacity={0.12 + glow * 0.18}
                strokeWidth="1.5"
                strokeLinecap="round"
                className="animate-[eq-float_2.4s_ease-in-out_infinite]"
                style={{ animationDelay: `${-i * 0.6}s` }}
              />
            ))}
        </svg>

        <div className="pointer-events-none absolute inset-x-0 top-[23%] text-center">
          <span className="block text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl" style={{ color: glow > 0.2 ? hot : undefined }}>
            {temp}°
          </span>
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
            {running ? "Heating…" : done ? `Ready at ${setpoint}°F` : "Fahrenheit"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-eq">Quartz lab · try it</p>
        <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Dial in your dab. <span className="text-ink-3">Hot in 25 seconds.</span>
        </h3>

        <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-baseline justify-between">
            <label htmlFor="eq-temp" className="text-sm text-ink-2">
              Set temperature
            </label>
            <span className="text-2xl font-semibold tabular-nums text-ink">{setpoint}°F</span>
          </div>
          <input
            id="eq-temp"
            type="range"
            min={MIN}
            max={MAX}
            step={5}
            value={setpoint}
            onChange={(e) => setSetpoint(Number(e.target.value))}
            onPointerUp={() => run(setpoint)}
            onKeyUp={(e) => (e.key.startsWith("Arrow") || e.key === "Home" || e.key === "End") && run(setpoint)}
            className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-[linear-gradient(90deg,var(--eq),#ff8a2b_75%,#fff3dc)] accent-[var(--eq)] [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-[#07070a] [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-[#07070a] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_var(--eq)]"
          />
          <div className="mt-2 grid grid-cols-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-3">
            {eqGiveaway.tempZones.map((z, i) => (
              <span key={z.name} className={cn(i === 1 && "text-center", i === 2 && "text-right", z === zone && "text-eq")}>
                {z.name}
              </span>
            ))}
          </div>

          <div key={zone.name} className="mt-5 animate-[eq-tick_400ms_ease-out] border-t border-white/10 pt-4">
            <p className="text-lg font-semibold">{zone.name}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-2">{zone.body}</p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => run(setpoint)}
              disabled={running}
              className="flex h-11 items-center gap-2 rounded-xl bg-eq px-4 text-sm font-semibold text-[#08080b] hover:brightness-110 disabled:opacity-60"
            >
              {done ? <RotateCcw className="size-4" /> : <Flame className="size-4" />}
              {done ? "Run it again" : "Heat it up"}
            </button>
            <div className="min-w-0 flex-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-eq" style={{ width: `${(elapsed / HEAT_SECONDS) * 100}%` }} />
              </div>
              <p className="mt-1.5 font-mono text-[10px] tracking-[0.08em] text-ink-3">
                <span className="tabular-nums">{elapsed.toFixed(1)}s</span> / {HEAT_SECONDS}s · shown at {SPEED}× speed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
