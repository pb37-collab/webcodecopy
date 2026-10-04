import { cn } from "@/lib/utils";

/**
 * Rising bubbles, like the Skyrise bubbler's 30 ml of water. Positions come
 * from a fixed formula (not Math.random) so server and client markup match.
 */
export function Bubbles({ count = 18, rise = 520, className }: { count?: number; rise?: number; className?: string }) {
  const bubbles = Array.from({ length: count }, (_, i) => {
    const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
    return {
      left: `${(4 + r(1) * 92).toFixed(1)}%`,
      size: 3 + Math.round(r(2) * 9),
      dur: `${(6 + r(3) * 7).toFixed(1)}s`,
      delay: `${(-r(4) * 12).toFixed(1)}s`,
      drift: `${Math.round((r(5) - 0.5) * 60)}px`,
    };
  });

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="eq-bubble absolute bottom-0 rounded-full border border-white/40 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.7),rgba(255,255,255,0.05)_60%)] shadow-[0_0_10px_-2px_var(--eq)]"
          style={
            {
              left: b.left,
              width: b.size,
              height: b.size,
              "--dur": b.dur,
              "--delay": b.delay,
              "--drift": b.drift,
              "--rise": `${rise}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Faceted quartz crystal: the stand-in hero graphic when no product media is present. */
export function QuartzCrystal({ className }: { className?: string }) {
  const faces = [
    { d: "M40 100 L80 112 L80 320 L40 300 Z", o: 0.5, delay: "0s" },
    { d: "M80 112 L120 112 L120 320 L80 320 Z", o: 0.28, delay: "-1.2s" },
    { d: "M120 112 L160 100 L160 300 L120 320 Z", o: 0.65, delay: "-2.4s" },
    { d: "M40 100 L100 18 L80 112 Z", o: 0.75, delay: "-0.6s" },
    { d: "M80 112 L100 18 L120 112 Z", o: 0.45, delay: "-1.8s" },
    { d: "M120 112 L100 18 L160 100 Z", o: 0.9, delay: "-3s" },
  ];
  return (
    <svg viewBox="0 0 200 340" className={className} role="img" aria-label="Quartz crystal">
      <defs>
        <linearGradient id="eq-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.45" style={{ stopColor: "var(--eq)", stopOpacity: 0.7 }} />
          <stop offset="1" style={{ stopColor: "var(--eq-deep)", stopOpacity: 0.9 }} />
        </linearGradient>
        <linearGradient id="eq-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="eq-core" cx="0.5" cy="0.55" r="0.5">
          <stop offset="0" style={{ stopColor: "var(--eq)", stopOpacity: 0.9 }} />
          <stop offset="1" style={{ stopColor: "var(--eq)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="200" rx="90" ry="150" fill="url(#eq-core)" className="origin-center animate-[eq-glow_5s_ease-in-out_infinite]" />
      {faces.map((f, i) => (
        <path
          key={i}
          d={f.d}
          fill="url(#eq-face)"
          fillOpacity={f.o}
          stroke="url(#eq-edge)"
          strokeWidth="0.8"
          className="animate-[eq-facet_6s_ease-in-out_infinite]"
          style={{ animationDelay: f.delay }}
        />
      ))}
      <path d="M58 140 L66 136 L66 280 L58 276 Z" fill="#fff" fillOpacity="0.35" />
      <ellipse cx="100" cy="326" rx="70" ry="8" style={{ fill: "var(--eq)", fillOpacity: 0.35 }} className="blur-[6px]" />
    </svg>
  );
}

/** Slow-moving light caustics behind a section. */
export function Caustics({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -inset-[20%] animate-[eq-caustic_18s_ease-in-out_infinite] bg-[radial-gradient(40%_35%_at_30%_30%,color-mix(in_oklab,var(--eq)_38%,transparent),transparent_70%),radial-gradient(35%_30%_at_75%_60%,color-mix(in_oklab,var(--eq)_22%,transparent),transparent_70%),radial-gradient(30%_25%_at_50%_90%,color-mix(in_oklab,var(--eq-deep)_80%,transparent),transparent_70%)] transition-[background] duration-700" />
      <div className="eq-grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
    </div>
  );
}
