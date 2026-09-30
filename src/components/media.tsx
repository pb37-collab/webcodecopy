import Image from "next/image";
import { hasPublicFile } from "@/lib/media";
import { cn } from "@/lib/utils";

type MediaProps = {
  src: string;
  alt: string;
  /** CSS aspect ratio, e.g. "4 / 5". */
  aspect?: string;
  kind?: "image" | "video";
  poster?: string;
  className?: string;
  priority?: boolean;
};

/**
 * Local image or video with a placeholder fallback. Every src points inside
 * /public — nothing is hotlinked.
 */
export function Media({
  src,
  alt,
  aspect = "4 / 5",
  kind = "image",
  poster,
  className,
  priority,
}: MediaProps) {
  const present = hasPublicFile(src);
  return (
    <div
      className={cn("relative w-full overflow-hidden bg-card", className)}
      style={{ aspectRatio: aspect }}
    >
      {!present ? (
        <MediaPlaceholder label={alt} file={src} />
      ) : kind === "video" ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster && hasPublicFile(poster) ? poster : undefined}
          controls
          playsInline
          preload="none"
          muted
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
      )}
    </div>
  );
}

export function MediaPlaceholder({ label, file }: { label: string; file: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(135deg,#161614_0_12px,#1b1b18_12px_24px)] p-4 text-center">
      <span className="font-display text-2xl leading-tight text-ink-2">{label}</span>
      {process.env.NODE_ENV !== "production" && (
        <span className="font-mono text-[10px] break-all text-ink-3">missing: {file}</span>
      )}
    </div>
  );
}

/** Phone bezel around a 9:19.5 screenshot. */
export function PhoneFrame({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[280px] rounded-[2.2rem] border border-line-2 bg-[#0f0f0e] p-2.5 shadow-[0_30px_80px_-30px_rgba(212,242,92,0.18)]",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[1.7rem]">
        <Media src={src} alt={alt} aspect="9 / 19.5" />
      </div>
    </div>
  );
}

/** Minimal browser chrome around a 16:10 screenshot. */
export function BrowserFrame({
  src,
  alt,
  url,
  className,
}: {
  src: string;
  alt: string;
  url: string;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-line-2 bg-[#0f0f0e]", className)}>
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-line-2" />
          <span className="size-2.5 rounded-full bg-line-2" />
          <span className="size-2.5 rounded-full bg-line-2" />
        </span>
        <span className="min-w-0 truncate rounded-md bg-card px-2 py-0.5 font-mono text-[10.5px] text-ink-3">
          {url}
        </span>
      </div>
      <Media src={src} alt={alt} aspect="16 / 10" />
    </div>
  );
}
