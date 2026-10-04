"use client";

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
 */
export function ProductStage({ images }: StageProps) {
  const { colorway } = useEq();
  const hasImages = Object.keys(images).length > 0;

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px]">
      {/* Halo + rotating ring */}
      <div aria-hidden className="absolute inset-[6%] rounded-full bg-eq/25 blur-3xl transition-colors duration-700" />
      <div aria-hidden className="absolute inset-x-0 top-1/2 aspect-square -translate-y-1/2">
        <div className="absolute inset-[2%] animate-[eq-spin_40s_linear_infinite] rounded-full border border-dashed border-eq/30" />
        <div className="absolute inset-[11%] rounded-full border border-white/[0.06]" />
      </div>

      <div className="absolute inset-[4%] overflow-hidden rounded-[2.5rem]">
        <Bubbles count={14} rise={600} />
      </div>

      {hasImages ? (
        <div className="absolute -inset-x-[8%] -top-[6%] bottom-0">
          {/* Light pool under the base */}
          <div
            aria-hidden
            className="absolute bottom-[12%] left-1/2 h-[9%] w-[58%] -translate-x-1/2 rounded-[50%] bg-eq/45 blur-2xl transition-colors duration-700"
          />
          <div className="absolute inset-0 animate-[eq-float_7s_ease-in-out_infinite]">
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

      <SpecChip className="top-[14%] -left-1 sm:left-0" label="Heat-up" value="25s" />
      <SpecChip className="top-[44%] -right-1 sm:right-0 [animation-delay:-2s]" label="Temp" value="450–650°F" />
      <SpecChip className="bottom-[12%] left-[4%] [animation-delay:-4s]" label="Bubbler" value="30 ml" />

      <div className="absolute top-[4%] right-[6%] grid size-20 place-items-center rounded-full bg-eq text-center text-[#08080b] shadow-[0_10px_40px_-8px_var(--eq)] sm:size-24">
        <span className="leading-none">
          <span className="block text-2xl font-bold sm:text-3xl">{eqGiveaway.winners}</span>
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
        "absolute z-10 animate-[eq-float_6s_ease-in-out_infinite] rounded-2xl border border-white/15 bg-[#0d0d12]/75 px-3.5 py-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-md",
        className,
      )}
    >
      <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-ink-3">{label}</span>
      <span className="block text-[15px] font-semibold text-ink">{value}</span>
    </div>
  );
}
