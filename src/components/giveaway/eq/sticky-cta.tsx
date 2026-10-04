"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountdownInline } from "./countdown";
import { useEnded, useEq } from "./experience";

/** Bottom bar on small screens whenever the entry form is out of view. */
export function StickyCta({ target = "enter" }: { target?: string }) {
  const { entry } = useEq();
  const ended = useEnded();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    // Visible whenever the form is off screen, above or below.
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
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
        className="flex h-12 items-center justify-between rounded-xl bg-eq px-4 text-[15px] font-semibold text-[#08080b]"
      >
        <span>{entry ? "Share for bonus entries" : "Enter to win"}</span>
        <span className="flex items-center gap-2 font-mono text-[12px]">
          <CountdownInline /> <ArrowRight className="size-4" />
        </span>
      </a>
    </div>
  );
}
