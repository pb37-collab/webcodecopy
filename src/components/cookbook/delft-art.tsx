import type { DelftMotif } from "@/data/cookbook";
import { cn } from "@/lib/utils";

/*
 * Hand-drawn Delft motifs. Everything paints with `currentColor` — set the
 * colour with a text-* class. Washes use currentColor at low opacity, like
 * cobalt brushed thin over tin glaze.
 */

const WASH = 0.32;

const wash = { fill: "currentColor", fillOpacity: WASH, stroke: "currentColor" } as const;
const line = { fill: "none", stroke: "currentColor" } as const;
const solid = { fill: "currentColor", stroke: "none" } as const;

/** One motif drawn in a 100×100 box, centred on (50, 50). */
export function MotifGlyph({ name }: { name: DelftMotif }) {
  switch (name) {
    case "tulip":
      return (
        <g strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path {...line} d="M50 75 C50 66 50 60 50 53" />
          <path {...wash} d="M50 72 C42 68 37 60 38 52 C44 56 48 63 50 72 Z" />
          <path {...wash} d="M50 69 C58 65 63 57 62 49 C56 53 52 60 50 69 Z" />
          <path {...wash} d="M40 38 C40 49 44 54 50 54 C56 54 60 49 60 38 L55 43 L50 34 L45 43 Z" />
          <path {...line} d="M50 37 L50 52" strokeWidth={1} />
        </g>
      );
    case "windmill":
      return (
        <g strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path {...line} d="M28 74 Q50 69 72 74" />
          <path {...wash} d="M44 73 L46.5 50 L53.5 50 L56 73 Z" />
          <path {...solid} d="M48 73 L48 66 Q50 64 52 66 L52 73 Z" />
          <path {...wash} d="M45.5 50 Q50 44 54.5 50 Z" />
          {[20, 110, 200, 290].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 50 47)`}>
              <path {...line} d="M50 47 L50 24" />
              <rect {...wash} x={50.5} y={24} width={6} height={18} />
              <path {...line} d="M50.5 30 H56.5 M50.5 36 H56.5" strokeWidth={0.8} />
            </g>
          ))}
          <circle {...solid} cx={50} cy={47} r={1.8} />
        </g>
      );
    case "rosette":
      return (
        <g strokeWidth={1.4} strokeLinejoin="round">
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse key={i} {...wash} cx={50} cy={37} rx={4.6} ry={10} transform={`rotate(${i * 45} 50 50)`} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i} {...solid} cx={50} cy={24} r={1.4} transform={`rotate(${i * 45 + 22.5} 50 50)`} />
          ))}
          <circle {...solid} cx={50} cy={50} r={5.5} />
        </g>
      );
    case "jug":
      return (
        <g strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path {...wash} d="M39 72 C32 63 34 49 42 44 L58 44 C66 49 68 63 61 72 Z" />
          <path {...wash} d="M43 44 L44 36 L56 36 L57 44" />
          <circle {...solid} cx={50} cy={33} r={2} />
          <path {...line} d="M63 54 C70 52 72 46 75 41" />
          <path {...line} d="M38 50 C30 50 30 62 37 64" />
          <path {...line} d="M37 57 Q50 62 63 57" strokeWidth={1} />
          <path {...line} d="M46 52 Q50 48 54 52 Q50 56 46 52 Z" strokeWidth={1} />
        </g>
      );
    case "wheat":
      return (
        <g strokeWidth={1.4} strokeLinecap="round">
          {[-16, 0, 16].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 50 72)`}>
              <path {...line} d="M50 74 L50 30" />
              {[34, 41, 48, 55].map((y) => (
                <g key={y}>
                  <ellipse {...wash} cx={46.5} cy={y} rx={2.6} ry={4.6} transform={`rotate(-28 46.5 ${y})`} />
                  <ellipse {...wash} cx={53.5} cy={y + 3} rx={2.6} ry={4.6} transform={`rotate(28 53.5 ${y + 3})`} />
                </g>
              ))}
            </g>
          ))}
          <path {...line} d="M44 64 Q50 67 56 64" strokeWidth={2} />
        </g>
      );
    case "fish":
      return (
        <g strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round">
          <path {...wash} d="M28 50 C37 39 56 39 63 50 C56 61 37 61 28 50 Z" />
          <path {...wash} d="M63 50 L74 41 L71 50 L74 59 Z" />
          <circle {...solid} cx={36} cy={48} r={1.6} />
          <path {...line} d="M42 44 Q46 50 42 56 M48 43 Q52 50 48 57 M54 44 Q58 50 54 56" strokeWidth={0.9} />
          <path {...line} d="M24 66 Q30 63 36 66 T48 66 T60 66 T72 66" strokeWidth={1} />
        </g>
      );
    case "pear":
      return (
        <g strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path {...wash} d="M50 35 C46 35 46 42 44 47 C37 55 39 71 50 71 C61 71 63 55 56 47 C54 42 54 35 50 35 Z" />
          <path {...line} d="M50 35 C50 31 51 28 53 26" />
          <path {...wash} d="M52 30 C56 24 63 24 66 27 C61 31 56 32 52 30 Z" />
          <path {...line} d="M45 58 Q47 64 52 66" strokeWidth={1} />
        </g>
      );
  }
}

/** Quarter-rosette that sits in a tile corner; four tiles meet as a flower. */
function Corner() {
  return (
    <g strokeWidth={1} strokeLinejoin="round">
      <path {...solid} d="M0 0 H12 A12 12 0 0 1 0 12 Z" />
      <path {...wash} d="M9 9 Q19 12 24 24 Q12 19 9 9 Z" />
      <path {...wash} d="M14 2.5 Q22 1.5 28 5.5 Q20 8 14 2.5 Z" />
      <path {...wash} d="M2.5 14 Q1.5 22 5.5 28 Q8 20 2.5 14 Z" />
    </g>
  );
}

/** A single blue-and-white tile with corners, a ring and a centre motif. */
export function DelftTile({
  motif,
  className,
  title,
}: {
  motif: DelftMotif;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("text-delft-700", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <rect width={100} height={100} className="fill-glaze" />
      {[0, 90, 180, 270].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 50 50)`}>
          <Corner />
        </g>
      ))}
      <circle {...line} cx={50} cy={50} r={33} strokeWidth={1.1} />
      <circle {...line} cx={50} cy={50} r={30} strokeWidth={0.5} />
      <g transform="translate(50 50) scale(0.78) translate(-50 -50)">
        <MotifGlyph name={motif} />
      </g>
    </svg>
  );
}

const STRIP: DelftMotif[] = ["tulip", "windmill", "rosette", "jug", "wheat", "fish", "pear"];

/** A frieze of tiles across the page — the classic Delft border. */
export function TileStrip({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex justify-center gap-px overflow-hidden border-y border-delft-700/40 bg-delft-200",
        className,
      )}
    >
      {Array.from({ length: 24 }, (_, i) => (
        <DelftTile key={i} motif={STRIP[i % STRIP.length]} className="size-20 shrink-0 sm:size-24" />
      ))}
    </div>
  );
}

/** A Delft charger plate: petal rim, double well, tulip at the centre. */
export function DelftPlate({ className, motif = "tulip" }: { className?: string; motif?: DelftMotif }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden className={cn("text-delft-700", className)}>
      <circle cx={200} cy={200} r={196} className="fill-glaze" stroke="currentColor" strokeWidth={3} />
      <circle {...line} cx={200} cy={200} r={186} strokeWidth={1} />
      {Array.from({ length: 16 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 22.5} 200 200)`}>
          <path
            {...wash}
            strokeWidth={1.4}
            strokeLinejoin="round"
            d="M200 20 C214 36 214 52 200 64 C186 52 186 36 200 20 Z"
          />
          <path {...line} d="M200 28 L200 58" strokeWidth={0.8} />
          <circle {...solid} cx={200} cy={34} r={3.2} transform="rotate(11.25 200 200)" />
          <path {...line} strokeWidth={1} d="M190 64 Q200 72 210 64" transform="rotate(11.25 200 200)" />
        </g>
      ))}
      <circle {...line} cx={200} cy={200} r={132} strokeWidth={2.2} />
      <circle {...line} cx={200} cy={200} r={125} strokeWidth={0.8} />
      {Array.from({ length: 36 }, (_, i) => (
        <circle key={i} {...solid} cx={200} cy={71} r={1.6} transform={`rotate(${i * 10} 200 200)`} />
      ))}
      <g transform="translate(200 200) scale(2.5) translate(-50 -50)">
        <MotifGlyph name={motif} />
      </g>
    </svg>
  );
}

/** Ornamental rule with a centre rosette, used under section titles. */
export function Flourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 24" aria-hidden className={cn("h-6 w-60 text-delft-700", className)}>
      <path {...line} d="M8 12 H96 M144 12 H232" strokeWidth={1} />
      <path {...line} d="M30 8 H90 M150 8 H210" strokeWidth={0.5} />
      <path {...solid} d="M4 12 L8 9 L12 12 L8 15 Z M228 12 L232 9 L236 12 L232 15 Z" />
      <path {...solid} d="M100 12 L104 10 L108 12 L104 14 Z M132 12 L136 10 L140 12 L136 14 Z" />
      <g transform="translate(120 12) scale(0.22) translate(-50 -50)">
        <MotifGlyph name="rosette" />
      </g>
    </svg>
  );
}
