"use client";

import { eqGiveaway } from "@/data/giveaways/davinci-eq-skyrise";
import { cn } from "@/lib/utils";
import { useEq } from "./experience";

/**
 * Finish picker. Choosing a colorway re-tints the whole page and is saved
 * with the entry so the team knows which finish to ship a winner.
 */
export function ColorwayPicker({ size = "sm", className }: { size?: "sm" | "lg"; className?: string }) {
  const { colorway, setColorway } = useEq();
  const lg = size === "lg";

  return (
    <div role="radiogroup" aria-label="Pick your colorway" className={cn("flex flex-wrap gap-2", lg && "gap-3", className)}>
      {eqGiveaway.colorways.map((c) => {
        const active = c.id === colorway.id;
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setColorway(c.id)}
            className={cn(
              "group flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-1.5 text-left transition-all duration-300",
              lg && "py-2 pr-5 pl-2",
              active
                ? "border-eq/70 bg-eq/10 text-ink shadow-[0_0_24px_-6px_var(--eq)]"
                : "border-white/10 bg-white/[0.02] text-ink-2 hover:border-white/25 hover:text-ink",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "relative size-6 shrink-0 rounded-full ring-1 ring-white/20 transition-transform duration-300",
                lg && "size-8",
                active && "scale-110",
              )}
              style={{
                background: `radial-gradient(circle at 32% 28%, #ffffffcc 0 6%, ${c.accent} 22%, ${c.deep} 78%)`,
              }}
            />
            <span className={cn("text-[13px] font-medium", lg && "text-sm")}>{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}
