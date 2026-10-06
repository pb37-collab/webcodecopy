"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Click-to-play video. YouTube only loads once played (no third-party
 * requests on page load); local files use a native <video>; with neither
 * it shows a "coming soon" card.
 */
export function VideoCard({
  title,
  description,
  duration,
  youtubeId,
  src,
  poster,
  featured,
  className,
}: {
  title: string;
  description: string;
  duration: string;
  youtubeId?: string;
  src?: string;
  /** Only pass a poster that actually exists. */
  poster?: string;
  featured?: boolean;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const thumb = poster ?? (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : undefined);
  const playable = Boolean(youtubeId || src);

  return (
    <figure className={cn("group flex flex-col", className)}>
      <div className="relative aspect-video overflow-hidden border border-glaze/60 bg-delft-950 p-1.5">
        <div className="relative h-full w-full overflow-hidden border border-glaze/30">
          {playing && youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : playing && src ? (
            <video src={src} poster={poster} controls autoPlay playsInline className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <button
              type="button"
              disabled={!playable}
              onClick={() => setPlaying(true)}
              aria-label={playable ? `Play: ${title}` : `${title} — coming soon`}
              className="absolute inset-0 flex items-center justify-center disabled:cursor-default"
            >
              {thumb ? (
                <Image src={thumb} alt="" fill unoptimized sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              ) : (
                <span className="absolute inset-0 bg-delft-900">
                  <span className="delft-tiles-light absolute inset-0 opacity-[0.08] [background-size:64px_64px]" />
                </span>
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-delft-950/70 via-delft-950/10 to-transparent" />
              <span
                className={cn(
                  "relative grid place-items-center rounded-full border-2 border-glaze bg-delft-700/85 text-glaze shadow-lg transition-transform group-hover:scale-105",
                  featured ? "size-20" : "size-14",
                )}
              >
                <Play className={cn("translate-x-0.5 fill-current", featured ? "size-8" : "size-5")} aria-hidden />
              </span>
              <span className="absolute right-3 bottom-3 rounded-sm bg-delft-950/80 px-2 py-0.5 font-mono text-xs text-glaze">
                {playable ? duration : "Coming soon"}
              </span>
            </button>
          )}
        </div>
      </div>
      <figcaption className="mt-4">
        <p className={cn("font-delft-display font-semibold leading-tight text-glaze", featured ? "text-3xl" : "text-xl")}>
          {title}
        </p>
        <p className={cn("mt-1 leading-snug text-delft-200", featured ? "text-lg" : "text-base")}>{description}</p>
      </figcaption>
    </figure>
  );
}
