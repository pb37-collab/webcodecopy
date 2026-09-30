"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  captionFor,
  categoryLabels,
  type ContentCategory,
  type ContentItem,
} from "@/data/content";
import { cn } from "@/lib/utils";

export type GalleryItem = ContentItem & { present: boolean; posterPresent: boolean };

type Filter = "all" | ContentCategory;

export function ContentGallery({ items }: { items: readonly GalleryItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<GalleryItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const visible = filter === "all" ? items : items.filter((i) => i.categories.includes(filter));
  const filters: Filter[] = ["all", "ads", "social", "video", "ai-creators"];

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const step = (dir: 1 | -1) => {
    if (!open) return;
    const i = visible.findIndex((v) => v.id === open.id);
    setOpen(visible[(i + dir + visible.length) % visible.length]);
  };

  return (
    <div>
      <div role="tablist" aria-label="Filter content" className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors",
              filter === f
                ? "border-accent bg-accent text-bg"
                : "border-line-2 text-ink-2 hover:border-ink-3 hover:text-ink",
            )}
          >
            {f === "all" ? "All" : categoryLabels[f]}
          </button>
        ))}
      </div>

      <ul className="mt-8 columns-2 gap-3 sm:columns-3 lg:columns-4">
        {visible.map((item) => (
          <li key={item.id} className="mb-3 break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpen(item)}
              className="group block w-full overflow-hidden rounded-2xl border border-line bg-card text-left transition-colors hover:border-line-2"
            >
              <Thumb item={item} />
              <div className="space-y-2 p-3">
                <div className="flex flex-wrap gap-1.5">
                  {item.winner && <Tag tone="accent">Proven winner</Tag>}
                  {item.aiProduced && <Tag>AI-produced</Tag>}
                  {item.kind === "video" && <Tag>Video</Tag>}
                </div>
                <p className="text-[12.5px] leading-snug text-ink-2">{captionFor(item)}</p>
                {item.result && <p className="text-[12.5px] text-accent">{item.result}</p>}
              </div>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(null);
        }}
        className="m-auto max-h-[92vh] w-[min(92vw,960px)] rounded-3xl border border-line-2 bg-bg p-0 text-ink backdrop:bg-black/80"
      >
        {open && (
          <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
            <div className="flex max-h-[70vh] items-center justify-center bg-black md:max-h-[92vh]">
              <Full item={open} />
            </div>
            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-wrap gap-1.5">
                {open.winner && <Tag tone="accent">Proven winner</Tag>}
                {open.aiProduced && <Tag>AI-produced</Tag>}
              </div>
              <p className="font-display text-2xl leading-tight">{open.brand}</p>
              <p className="text-sm leading-relaxed text-ink-2">{captionFor(open)}</p>
              {open.result && <p className="text-sm text-accent">{open.result}</p>}
              <div className="mt-auto flex gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
                <button onClick={() => step(-1)} className="rounded-full border border-line-2 px-3 py-1.5 hover:border-accent">
                  ← Prev
                </button>
                <button onClick={() => step(1)} className="rounded-full border border-line-2 px-3 py-1.5 hover:border-accent">
                  Next →
                </button>
                <button onClick={() => setOpen(null)} className="ml-auto rounded-full border border-line-2 px-3 py-1.5 hover:border-accent">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}

function Tag({ children, tone }: { children: React.ReactNode; tone?: "accent" }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.1em]",
        tone === "accent" ? "border-accent/60 text-accent" : "border-line-2 text-ink-3",
      )}
    >
      {children}
    </span>
  );
}

function Placeholder({ item }: { item: GalleryItem }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(135deg,#161614_0_12px,#1b1b18_12px_24px)] p-3 text-center">
      <span className="font-display text-lg leading-tight text-ink-3">
        {item.id.replaceAll("_", " ")}
      </span>
    </div>
  );
}

function Thumb({ item }: { item: GalleryItem }) {
  const src = item.kind === "video" ? item.poster : item.src;
  const show = item.kind === "video" ? item.posterPresent : item.present;
  return (
    <div className="relative w-full" style={{ aspectRatio: item.aspect }}>
      {show && src ? (
        <Image src={src} alt={captionFor(item)} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
      ) : (
        <Placeholder item={item} />
      )}
      {item.kind === "video" && (
        <span className="absolute right-2 bottom-2 rounded-full bg-black/70 px-2 py-1 font-mono text-[10px] text-ink">
          ▶
        </span>
      )}
    </div>
  );
}

function Full({ item }: { item: GalleryItem }) {
  if (!item.present) {
    return (
      <div className="relative w-full max-w-sm" style={{ aspectRatio: item.aspect }}>
        <Placeholder item={item} />
      </div>
    );
  }
  if (item.kind === "video") {
    return (
      <video
        key={item.src}
        src={item.src}
        poster={item.posterPresent ? item.poster : undefined}
        controls
        autoPlay
        playsInline
        className="max-h-[70vh] w-auto md:max-h-[92vh]"
      >
        {/* No burned-in captions were used; add a WebVTT track here once transcribed. */}
      </video>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- natural-size lightbox image
    <img src={item.src} alt={captionFor(item)} className="max-h-[70vh] w-auto object-contain md:max-h-[92vh]" />
  );
}
