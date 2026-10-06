import Image from "next/image";
import type { DelftMotif } from "@/data/cookbook";
import { cookbook } from "@/data/cookbook";
import { hasPublicFile } from "@/lib/media";
import { cn } from "@/lib/utils";
import { DelftPlate, DelftTile } from "./delft-art";

/**
 * Photo in a blue tile-edge frame. Until the file exists in /public it shows
 * a painted tile with the caption, so the layout never looks broken.
 */
export function DelftPhoto({
  src,
  alt,
  motif,
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority,
}: {
  src: string;
  alt: string;
  motif: DelftMotif;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const present = hasPublicFile(src);
  return (
    <div className={cn("relative border border-delft-700 bg-glaze p-1.5", className)}>
      <div className="relative h-full w-full overflow-hidden border border-delft-700/50">
        {present ? (
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-glaze-2 p-4 text-center">
            <div aria-hidden className="delft-tiles absolute inset-0 opacity-[0.1] [background-size:72px_72px]" />
            <DelftTile motif={motif} className="relative size-20 border border-delft-700/40 shadow-sm sm:size-28" />
            <span className="relative max-w-[16rem] bg-glaze-2 px-2 font-delft-display text-lg italic leading-tight text-delft-800">
              {alt}
            </span>
            {process.env.NODE_ENV !== "production" && (
              <span className="relative font-mono text-[10px] break-all text-delft-500">add {src}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** The book, standing at an angle. Uses real cover art once it exists. */
export function BookCover({ className }: { className?: string }) {
  const art = hasPublicFile(cookbook.coverImage);
  return (
    <div className={cn("[perspective:1600px]", className)}>
      <div className="relative aspect-[3/4] w-full [transform:rotateY(-16deg)_rotateX(3deg)] [transform-style:preserve-3d]">
        {/* page block */}
        <div className="absolute inset-y-[1.5%] right-[-14px] w-[18px] rounded-r-sm bg-[repeating-linear-gradient(90deg,#fbfaf6_0_2px,#e4e2da_2px_3px)] [transform:translateZ(-1px)]" />
        <div className="absolute inset-0 overflow-hidden rounded-r-md rounded-l-sm border border-delft-800 bg-glaze shadow-[30px_40px_60px_-20px_rgba(11,26,64,0.55),0_2px_0_0_rgba(11,26,64,0.2)]">
          {art ? (
            <Image src={cookbook.coverImage} alt={`${cookbook.title} cover`} fill priority sizes="380px" className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center px-[9%] pt-[9%] pb-[8%] text-center text-delft-800">
              <div className="pointer-events-none absolute inset-[4.5%] border-2 border-delft-700" />
              <div className="pointer-events-none absolute inset-[6.5%] border border-delft-700/60" />
              <p className="relative text-[clamp(0.6rem,1.6vw,0.8rem)] uppercase tracking-[0.3em] text-delft-600">
                A free cookbook
              </p>
              <DelftPlate className="relative mt-[6%] w-[62%]" />
              <p className="relative mt-[7%] font-delft-display text-[clamp(1.4rem,3.4vw,2.2rem)] font-semibold leading-[0.95]">
                {cookbook.titleLead}
                <span className="block italic font-medium">{cookbook.titleTail}</span>
              </p>
              <p className="relative mt-auto text-[clamp(0.6rem,1.6vw,0.8rem)] uppercase tracking-[0.3em] text-delft-600">
                {cookbook.author}
              </p>
            </div>
          )}
          {/* spine shading */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-delft-900/45 via-delft-900/10 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-delft-950/10" />
        </div>
      </div>
    </div>
  );
}

/** Oval cameo frame for the author portrait. */
export function CameoPortrait({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const present = hasPublicFile(src);
  return (
    <div className={cn("relative aspect-[4/5] rounded-[50%] border-2 border-delft-700 bg-glaze p-2.5", className)}>
      <div className="absolute inset-[5px] rounded-[50%] border border-delft-700/50" />
      <div className="relative h-full w-full overflow-hidden rounded-[50%] bg-glaze-2">
        {present ? (
          <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 380px, 80vw" className="object-cover" />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center">
            <div aria-hidden className="delft-tiles absolute inset-0 opacity-[0.1] [background-size:64px_64px]" />
            <DelftPlate motif="jug" className="relative w-3/4" />
          </div>
        )}
      </div>
    </div>
  );
}
