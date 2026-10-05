import { cn } from "@/lib/utils";

const WORDS = ["RUNTZ", "7G", "SNOWCAPS", "3.5G", "CHOOSE", "THCA", "FROST", "CHUNKY", "0101", "21+"];

/** Deterministic pseudo-random so server and client render the same columns. */
function seeded(n: number) {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/**
 * Faint falling-glyph columns behind the v2 hero: the film nod, kept quiet.
 * Columns on the left run red, on the right blue, matching the hands.
 */
export function CodeRain({ className }: { className?: string }) {
  const columns = Array.from({ length: 16 }, (_, i) => {
    const text = Array.from({ length: 14 }, (_, j) => WORDS[Math.floor(seeded(i * 31 + j) * WORDS.length)]).join(
      " ",
    );
    return {
      left: `${(i / 16) * 100 + seeded(i) * 3}%`,
      text,
      duration: 10 + seeded(i + 7) * 14,
      delay: -seeded(i + 3) * 20,
      opacity: 0.12 + seeded(i + 11) * 0.22,
      red: i < 8,
    };
  });

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,black,transparent_85%)]",
        className,
      )}
    >
      {columns.map((c, i) => (
        <div
          key={i}
          className={cn(
            "absolute top-0 animate-ca-rain font-ca-mono text-[11px] leading-[1.45] tracking-[0.3em] whitespace-nowrap [writing-mode:vertical-rl]",
            c.red ? "text-ruby" : "text-frost",
            i % 2 === 1 && "hidden sm:block",
          )}
          // Position and timing are generated per column, so they have to be inline.
          style={{
            left: c.left,
            opacity: c.opacity,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          {c.text} {c.text}
        </div>
      ))}
    </div>
  );
}
