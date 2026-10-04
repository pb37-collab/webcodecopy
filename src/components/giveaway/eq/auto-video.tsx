"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Muted looping video that only loads and plays while on screen, so a page
 * with several clips doesn't spend data on ones nobody is looking at.
 * Reduced-motion visitors get the poster frame.
 */
export function AutoVideo({
  src,
  poster,
  className,
  label,
}: {
  src: string;
  poster?: string;
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!video.src) video.src = src;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.1 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
