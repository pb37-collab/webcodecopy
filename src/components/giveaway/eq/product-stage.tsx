"use client";

import { useRef } from "react";
import Image from "next/image";
import { eqGiveaway, type ColorwayId } from "@/data/giveaways/davinci-eq-skyrise";
import { cn } from "@/lib/utils";
import { useEq } from "./experience";
import { Bubbles, QuartzCrystal } from "./motion";

type StageProps = {
  /** Cut-out per finish, present only when the file exists in /public at build time. */
  images: Partial<Record<ColorwayId, string>>;
};

/**
 * Hero product stage: DaVinci's transparent cut-out of the selected finish
 * floating over a colorway glow, crossfading when the finish changes. Falls
 * back to a faceted-quartz motion graphic without product photos. Spec chips
 * orbit it in both cases.
 *
 * On phones the stage is a short, wide band sized to the screen height so the
 * rig, the finish tiles under it and the CTA all fit on the first screen;
 * swiping across it steps through the finishes.
 */
export function ProductStage({ images }: StageProps) {
  const { colorway, setColorway } = useEq();
  const hasImages = Object.keys(images).length > 0;
  const touchX = useRef<number | null>(null);

  function step(dir: 1 | -1) {
    const list = eqGiveaway.colorways;
    const i = list.findIndex((c) => c.id === colorway.id);
    setColorway(list[(i + dir + list.length) % list.length].id);
  }

  return (
    <div
      className="relative mx-auto h-[clamp(200px,36svh,340px)] w-full max-w-[520px] touch-pan-y lg:aspect-[4/5] lg:h-auto"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
      }}
    >
      {/* Halo + rotating ring */}
      <div aria-hidden className="absolute inset-[6%] rounded-full bg-eq/25 blur-3xl transition-colors duration-700" />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 aspect-square h-full -translate-x-1/2 -translate-y-1/2 lg:inset-x-0 lg:h-auto lg:translate-x-0"
      >
        <div className="absolute inset-[2%] animate-[eq-spin_40s_linear_infinite] rounded-full border border-dashed border-eq/30" />
        <div className="absolute inset-[11%] rounded-full border border-white/[0.06]" />
      </div>

      <div className="absolute inset-[4%] overflow-hidden rounded-[2.5rem]">
        <Bubbles count={14} rise={600} />
      </div>

      {hasImages ? (
        <div className="absolute inset-x-0 -inset-y-[7%] lg:-inset-x-[8%] lg:-top-[6%] lg:bottom-0">
          {/* Light pool under the base */}
          <div
            aria-hidden
            className="absolute bottom-[12%] left-1/2 h-[9%] w-[58%] -translate-x-1/2 rounded-[50%] bg-eq/45 blur-2xl transition-colors duration-700"
          />
          <div className="absolute inset-0 scale-110 animate-[eq-float_7s_ease-in-out_infinite] lg:scale-100">
            {eqGiveaway.colorways.map((c) =>
              images[c.id] ? (
                <Image
                  key={c.id}
                  src={images[c.id] as string}
                  alt={c.id === colorway.id ? `${eqGiveaway.product} in ${c.name}` : ""}
                  fill
                  priority={c.id === eqGiveaway.colorways[0].id}
                  sizes="(min-width: 1024px) 520px, 90vw"
                  className={cn(
                    "object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.65)] transition-[opacity,transform] duration-700",
                    c.id === colorway.id ? "scale-100 opacity-100" : "scale-[0.97] opacity-0",
                  )}
                />
              ) : null,
            )}
          </div>
        </div>
      ) : (
        <div className="absolute inset-[8%] grid place-items-center">
          <QuartzCrystal className="h-[78%] animate-[eq-float_7s_ease-in-out_infinite] drop-shadow-[0_0_40px_var(--eq)]" />
        </div>
      )}

      <SpecChip className="top-[10%] left-0 lg:top-[14%]" label="Heat-up" value="25s" />
      <SpecChip className="top-[46%] right-0 [animation-delay:-2s] lg:top-[44%]" label="Temp" value="450–650°F" />
      <SpecChip className="bottom-[6%] left-[3%] [animation-delay:-4s] lg:bottom-[12%] lg:left-[4%]" label="Bubbler" value="30 ml" />

      <div className="absolute top-0 right-[2%] grid size-16 place-items-center rounded-full bg-eq text-center text-[#08080b] shadow-[0_10px_40px_-8px_var(--eq)] sm:size-24 lg:top-[4%] lg:right-[6%]">
        <span className="leading-none">
          <span className="block text-xl font-bold sm:text-3xl">{eqGiveaway.winners}</span>
          <span className="block font-mono text-[8.5px] font-semibold uppercase tracking-[0.14em] sm:text-[9.5px]">
            winners
          </span>
        </span>
      </div>
    </div>
  );
}

function SpecChip({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div
      className={cn(
        "absolute z-10 animate-[eq-float_6s_ease-in-out_infinite] rounded-xl border border-white/15 bg-[#0d0d12]/75 px-2.5 py-1.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-md lg:rounded-2xl lg:px-3.5 lg:py-2",
        className,
      )}
    >
      <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-ink-3">{label}</span>
      <span className="block text-[13px] font-semibold text-ink lg:text-[15px]">{value}</span>
    </div>
  );
}
