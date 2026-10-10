"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountdownInline } from "./countdown";
import { useEnded, useEq, useNotStarted } from "./experience";

/** Scrolls to the entry form and puts the cursor in the email field. */
function jumpToForm(target: string) {
  const form = document.getElementById(target);
  if (!form) return;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  const email = form.querySelector<HTMLInputElement>("input[type=email]");
  // Focus without a second jump; the smooth scroll is already underway.
  window.setTimeout(() => email?.focus({ preventScroll: true }), 450);
}

/** Phone-only CTA inside the first screen, right under the rig and finishes. */
export function HeroCta({ target = "enter", className }: { target?: string; className?: string }) {
  const { entry } = useEq();
  const ended = useEnded();
  const notStarted = useNotStarted();
  if (ended) return null;
  return (
    <a
      id="hero-cta"
      href={`#${target}`}
      onClick={(e) => {
        e.preventDefault();
        jumpToForm(target);
      }}
      className={cn(
        "group relative flex h-14 items-center justify-start overflow-hidden px-5 rounded-2xl bg-eq text-[16px] font-semibold text-[#08080b] shadow-[0_18px_50px_-14px_var(--eq)] active:scale-[0.99] lg:hidden",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-[eq-shine_3.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"
      />
      <span className="flex items-center gap-2">
        {entry ? "Share for bonus entries" : notStarted ? "Entries open soon" : "Enter to win · free"}
        <ArrowDown className="size-4" />
      </span>
      <span className="absolute right-4 font-mono text-[11px] font-medium opacity-70 max-[359px]:hidden">
        <CountdownInline />
      </span>
    </a>
  );
}

/** Bottom bar on small screens once both the hero CTA and the form are out of view. */
export function StickyCta({ target = "enter" }: { target?: string }) {
  const { entry } = useEq();
  const ended = useEnded();
  const notStarted = useNotStarted();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const els = [document.getElementById(target), document.getElementById("hero-cta")].filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;
    // The form counts as on screen once a sliver shows; the hero CTA only
    // when it is fully visible, so a half-cut button still gets the bar.
    const onScreen = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          onScreen.set(e.target, e.target.id === "hero-cta" ? e.intersectionRatio >= 0.98 : e.intersectionRatio >= 0.15),
        );
        setShow(![...onScreen.values()].some(Boolean));
      },
      { threshold: [0, 0.15, 0.98, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [target, entry]);

  const visible = show && !ended;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#07070a]/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-300 lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!visible}
    >
      <a
        href={`#${target}`}
        tabIndex={visible ? 0 : -1}
        onClick={(e) => {
          e.preventDefault();
          jumpToForm(target);
        }}
        className="flex h-12 items-center justify-between rounded-xl bg-eq px-4 text-[15px] font-semibold text-[#08080b]"
      >
        <span>{entry ? "Share for bonus entries" : notStarted ? "Entries open soon" : "Enter to win"}</span>
        <span className="flex items-center gap-2 font-mono text-[12px]">
          <CountdownInline /> <ArrowRight className="size-4" />
        </span>
      </a>
    </div>
  );
}
