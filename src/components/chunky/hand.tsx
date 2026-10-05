import { cn } from "@/lib/utils";

/**
 * An open hand, palm toward the viewer, fingers up: the "offering" pose.
 * Drawn as a dark obsidian silhouette with a colored rim light. The outline
 * comes from stroking every shape first, then filling them on top, so only
 * the outer edge of the union shows.
 *
 * Base drawing has the thumb on the left; `mirror` flips it for the other hand.
 */

const fingers = [
  // [base x, base y, length, rotation deg] — index, middle, ring, pinky
  [106, 178, 112, 9],
  [136, 170, 128, 2],
  [165, 176, 116, -5],
  [191, 192, 90, -13],
] as const;

const FINGER_W = 29;

function Shapes({ className }: { className?: string }) {
  return (
    <g className={className}>
      {fingers.map(([x, y, len, rot], i) => (
        <rect
          key={i}
          x={x - FINGER_W / 2}
          y={y - len}
          width={FINGER_W}
          height={len + 24}
          rx={FINGER_W / 2}
          transform={`rotate(${rot} ${x} ${y})`}
        />
      ))}
      {/* Thumb, angled out and up. */}
      <rect x={78} y={168} width={34} height={104} rx={17} transform="rotate(-38 95 262)" />
      {/* Palm and wrist. */}
      <path d="M92 168 C 88 210, 84 248, 96 282 C 100 296, 104 312, 106 340 L 186 340 C 188 312, 194 294, 200 276 C 210 246, 210 206, 205 180 C 196 162, 110 156, 92 168 Z" />
    </g>
  );
}

export function Hand({
  color,
  mirror = false,
  lit = true,
  className,
}: {
  /** Rim-light color, any CSS color. */
  color: string;
  mirror?: boolean;
  lit?: boolean;
  className?: string;
}) {
  const id = `hand-${color.replace(/[^a-z0-9]/gi, "")}-${mirror ? "l" : "r"}`;
  return (
    <svg
      viewBox="0 0 290 340"
      aria-hidden
      className={cn("overflow-visible", className)}
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#2a2730" />
          <stop offset="0.55" stopColor="#16141a" />
          <stop offset="1" stopColor="#0b0a0d" />
        </linearGradient>
        <radialGradient id={`${id}-palm`} cx="0.5" cy="0.62" r="0.42">
          <stop offset="0" stopColor={color} stopOpacity={lit ? 0.28 : 0.05} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.72" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect width="290" height="340" fill={`url(#${id}-fade)`} />
        </mask>
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <g transform={mirror ? "translate(290 0) scale(-1 1)" : undefined} mask={`url(#${id}-mask)`}>
        {/* Bloom behind the rim. */}
        {lit && (
          <g filter={`url(#${id}-glow)`} opacity="0.75">
            <g stroke={color} strokeWidth="10" fill="none">
              <Shapes />
            </g>
          </g>
        )}
        {/* Crisp rim. */}
        <g stroke={lit ? color : "#3a3640"} strokeWidth="3" strokeOpacity={lit ? 0.95 : 0.8}>
          <Shapes />
        </g>
        <g fill={`url(#${id}-skin)`}>
          <Shapes />
        </g>
        <g fill={`url(#${id}-palm)`}>
          <Shapes />
        </g>
        {/* Creases. */}
        <g stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1.6" fill="none" strokeLinecap="round">
          <path d="M108 214 C 134 204, 168 204, 198 214" />
          <path d="M104 238 C 128 236, 150 226, 176 206" />
          <path d="M118 290 C 112 262, 116 236, 132 214" />
          {fingers.map(([x, y, len, rot], i) => (
            <path
              key={i}
              d={`M${x - 8} ${y - len * 0.45} h16 M${x - 7} ${y - len * 0.75} h14`}
              transform={`rotate(${rot} ${x} ${y})`}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
