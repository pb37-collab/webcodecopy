"use client";

import { ArrowLeft, ChevronLeft, ChevronRight, Download, Expand, List, Minimize, X, ZoomIn } from "lucide-react";
import Link from "next/link";
import type { PageFlip } from "page-flip";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cookbook } from "@/data/cookbook";
import { cn } from "@/lib/utils";
import {
  BOOK_PAGES,
  BookPageContent,
  bookIndexOfPage,
  CONTENTS,
  isHard,
  PAGE_RATIO,
  PDF_HREF,
  spreadLabel,
} from "./book-pages";
import { BookZoom } from "./book-zoom";

const LAST = BOOK_PAGES.length - 1;
const FLIP_MS = 900;
/** Pages either side of the open spread whose images load ahead of time. */
const PRELOAD = 4;

const TOC = [
  { title: "Title page", page: 1, index: bookIndexOfPage(1) },
  ...CONTENTS,
];

type Mode = "landscape" | "portrait";

/** Indexes of the pages visible at `page`. Landscape shows spreads, cover and back alone. */
function spreadAt(page: number, mode: Mode): number[] {
  if (mode === "portrait" || page === 0) return [page];
  const left = page % 2 === 1 ? page : page - 1;
  return left >= LAST ? [LAST] : [left, left + 1];
}

/**
 * The cookbook as a book: it arrives closed, the cover swings open, and pages
 * turn by dragging a corner, the arrow buttons or the keyboard. Fills the
 * viewport exactly — nothing on this page scrolls.
 */
export function BookReader() {
  const stageRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const clonesRef = useRef<HTMLElement[]>([]);
  const pageRef = useRef(0);
  const introDone = useRef(false);

  const [stage, setStage] = useState({ w: 0, h: 0 });
  const [page, setPage] = useState(0);
  const [turning, setTurning] = useState(false);
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState<{ focus: number | null } | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // ---- sizing: fit a spread (or one page on narrow screens) into the stage
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setStage({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const wide = stage.w >= 768;
  const availW = Math.max(0, stage.w - (wide ? 176 : 24));
  const availH = Math.max(0, stage.h - (wide ? 48 : 24));
  const mode: Mode = availW >= 560 && availW > availH * 1.05 ? "landscape" : "portrait";
  const bookW = Math.floor(mode === "landscape" ? Math.min(availW, availH * 2 * PAGE_RATIO) : Math.min(availW, availH * PAGE_RATIO));
  const bookH = Math.floor(mode === "landscape" ? bookW / (2 * PAGE_RATIO) : bookW / PAGE_RATIO);
  const measured = stage.w > 0;

  // ---- page-flip lifecycle (rebuilt only when switching spread ↔ single page)
  useEffect(() => {
    if (!measured) return;
    let cancelled = false;
    let pf: PageFlip | null = null;
    let host: HTMLDivElement | null = null;
    const timers: number[] = [];

    import("page-flip").then(({ PageFlip }) => {
      if (cancelled || !mountRef.current || !sourceRef.current) return;
      host = document.createElement("div");
      host.className = "book-host";
      mountRef.current.appendChild(host);

      // page-flip moves its page nodes around, so hand it copies and keep
      // React's originals untouched in the hidden source.
      const nodes = [...sourceRef.current.children].map((n) => n.cloneNode(true) as HTMLElement);
      clonesRef.current = nodes;

      pf = new PageFlip(host, {
        width: 612,
        height: Math.round(612 / PAGE_RATIO),
        size: "stretch",
        // page-flip goes single-page when the block is under 2 × minWidth.
        minWidth: mode === "portrait" ? 100000 : 50,
        maxWidth: 100000,
        minHeight: 50,
        maxHeight: 100000,
        showCover: true,
        usePortrait: true,
        drawShadow: true,
        maxShadowOpacity: 0.45,
        flippingTime: FLIP_MS,
        mobileScrollSupport: false,
        disableFlipByClick: true,
        showPageCorners: true,
        startPage: pageRef.current,
        autoSize: true,
      });
      pf.loadFromHTML(nodes);
      // Its UI pins min-width to 2 × minWidth — undo that so the block
      // follows our sizing, then re-measure.
      host.style.minWidth = "0";
      host.style.minHeight = "0";
      pf.update();
      pf.on("flip", (e) => {
        pageRef.current = e.data;
        setPage(e.data);
      });
      pf.on("changeState", (e) => setTurning(e.data === "flipping"));
      flipRef.current = pf;
      setReady(true);

      if (!introDone.current) {
        // Let the closed book land, then open the cover.
        timers.push(
          window.setTimeout(() => {
            if (introDone.current || pageRef.current !== 0) return;
            introDone.current = true;
            pf?.flipNext();
            timers.push(window.setTimeout(() => setHint(true), FLIP_MS));
          }, 1300),
        );
      }
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      if (pf) {
        pf.getRender().render = () => {}; // stop its orphaned rAF loop from drawing
        pf.destroy();
      }
      host?.remove();
      flipRef.current = null;
    };
  }, [mode, measured]);

  useEffect(() => {
    flipRef.current?.update();
  }, [bookW, bookH]);

  // Scans are lazy; warm up the pages around the open spread so a turn
  // never reveals a blank sheet.
  useEffect(() => {
    if (!ready) return;
    clonesRef.current.slice(Math.max(0, page - PRELOAD), page + PRELOAD + 2).forEach((el) =>
      el.querySelectorAll("img").forEach((img) => {
        img.loading = "eager";
      }),
    );
  }, [page, ready, mode]);

  // ---- navigation
  const spread = spreadAt(page, mode);
  const canPrev = page > 0;
  const canNext = !spread.includes(LAST);

  const go = useCallback(
    (dir: 1 | -1) => {
      const pf = flipRef.current;
      if (!pf) return;
      introDone.current = true;
      setHint(false);
      if (zoom) {
        // In the zoom view, jump instantly instead of animating behind it.
        const cur = spreadAt(pageRef.current, mode);
        const target = dir === 1 ? cur[cur.length - 1] + 1 : cur[0] - 1;
        if (target < 0 || target > LAST) return;
        pf.turnToPage(target);
        pageRef.current = target;
        setPage(target);
      } else if (dir === 1) {
        pf.flipNext();
      } else {
        pf.flipPrev();
      }
    },
    [mode, zoom],
  );

  const lastTap = useRef(0);
  const openZoomAt = (el: HTMLElement, clientX: number) => {
    const r = el.getBoundingClientRect();
    setZoom({ focus: spread.length > 1 && clientX > r.left + r.width / 2 ? spread[1] : spread[0] });
  };

  const jump = useCallback(
    (target: number) => {
      introDone.current = true;
      setHint(false);
      if (spreadAt(pageRef.current, mode).includes(target)) return;
      flipRef.current?.flip(target);
    },
    [mode],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight" || e.key === "PageDown" || (e.key === " " && !zoom)) go(1);
      else if (e.key === "ArrowLeft" || e.key === "PageUp") go(-1);
      else if (e.key === "Home" && !zoom) jump(0);
      else if (e.key === "End" && !zoom) jump(LAST);
      else if (e.key === "z" || e.key === "Z") setZoom((z) => (z ? null : { focus: null }));
      else if (e.key === "Escape") {
        setZoom(null);
        setTocOpen(false);
      }
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, jump, zoom]);

  useEffect(() => {
    if (!hint) return;
    const t = window.setTimeout(() => setHint(false), 5200);
    return () => clearTimeout(t);
  }, [hint]);

  useEffect(() => {
    setCanFullscreen(Boolean(document.fullscreenEnabled));
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Closed book: centre the lone cover (or back cover) instead of leaving
  // an empty half. While the cover is swinging open, slide to centre.
  const closedFront = mode === "landscape" && page === 0 && !turning;
  const closedBack = mode === "landscape" && page === LAST && !turning;
  const shift = closedFront ? "-25%" : closedBack ? "25%" : "0%";

  const label = spreadLabel(spread.map((i) => BOOK_PAGES[i]));
  const progress = LAST ? spread[spread.length - 1] / LAST : 0;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-delft-900 text-glaze select-none">
      <div aria-hidden className="delft-tiles-light pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(163,182,222,0.28),transparent_62%)]"
      />

      {/* top bar */}
      <header className="relative z-10 flex h-14 shrink-0 items-center justify-between gap-3 px-3 sm:px-5">
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/cookbook/"
            aria-label="Back to the cookbook page"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm uppercase tracking-[0.18em] text-delft-100 transition-colors hover:bg-glaze/10"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span className="hidden sm:inline">Back</span>
          </Link>
          {TOC.length > 1 && (
            <button
              type="button"
              onClick={() => setTocOpen(true)}
              aria-label="Contents"
              aria-expanded={tocOpen}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-glaze/25 px-3 text-sm uppercase tracking-[0.18em] text-delft-100 transition-colors hover:bg-glaze/10 sm:px-4"
            >
              <List className="size-4" aria-hidden />
              <span className="hidden sm:inline">Contents</span>
            </button>
          )}
        </div>
        <p className="min-w-0 flex-1 truncate text-center font-delft-display text-lg font-semibold sm:text-xl">
          {cookbook.title}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {canFullscreen && (
            <button
              type="button"
              onClick={() => (fullscreen ? document.exitFullscreen() : document.documentElement.requestFullscreen())}
              aria-label={fullscreen ? "Exit full screen" : "Full screen"}
              title={fullscreen ? "Exit full screen" : "Full screen"}
              className="hidden size-10 place-items-center rounded-full border border-glaze/25 transition-colors hover:bg-glaze/10 sm:grid"
            >
              {fullscreen ? <Minimize className="size-4" /> : <Expand className="size-4" />}
            </button>
          )}
          <a
            href={PDF_HREF}
            download
            className="inline-flex h-10 items-center gap-2 rounded-full bg-glaze px-3.5 font-delft-display text-base font-semibold text-delft-800 transition-colors hover:bg-delft-100 sm:px-4 sm:text-lg"
          >
            <Download className="size-4" aria-hidden />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </a>
        </div>
      </header>

      {/* the book */}
      <div ref={stageRef} className="relative flex min-h-0 flex-1 items-center justify-center">
        {wide && (
          <SideArrow dir="prev" disabled={!canPrev} onClick={() => go(-1)} />
        )}
        <div
          className={cn("relative [perspective:2000px]", ready && "animate-[book-enter_900ms_cubic-bezier(.2,.7,.2,1)_both]")}
          style={{ width: bookW, height: bookH, visibility: ready ? "visible" : "hidden" }}
        >
          <div
            ref={mountRef}
            onPointerDown={(e) => {
              introDone.current = true;
              setHint(false);
              // Touch browsers don't reliably fire dblclick, so detect double-taps.
              if (e.pointerType !== "touch") return;
              const now = Date.now();
              if (now - lastTap.current < 320) openZoomAt(e.currentTarget, e.clientX);
              lastTap.current = now;
            }}
            onDoubleClick={(e) => openZoomAt(e.currentTarget, e.clientX)}
            className="h-full w-full drop-shadow-[0_28px_40px_rgba(5,12,32,0.55)] transition-transform ease-[cubic-bezier(.3,.7,.2,1)]"
            style={{ transform: `translateX(${shift})`, transitionDuration: `${FLIP_MS}ms` }}
          />
          <p
            role="status"
            className={cn(
              "pointer-events-none absolute -top-2 left-1/2 w-max max-w-[90vw] -translate-x-1/2 -translate-y-full rounded-full bg-delft-950/80 px-4 py-1.5 text-center text-sm text-delft-100 transition-opacity duration-500",
              hint ? "opacity-100" : "opacity-0",
            )}
          >
            Drag a page corner to turn &middot; double-{wide ? "click" : "tap"} to zoom
          </p>
        </div>
        {wide && <SideArrow dir="next" disabled={!canNext} onClick={() => go(1)} />}
      </div>

      {/* bottom controls */}
      <footer className="relative z-10 flex shrink-0 items-center justify-center gap-2 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-3">
        <RoundButton label="Previous page" onClick={() => go(-1)} disabled={!canPrev}>
          <ChevronLeft className="size-5" />
        </RoundButton>
        <div className="flex w-44 flex-col items-center gap-1.5 sm:w-60">
          <span className="font-delft-display text-lg leading-none">{label}</span>
          <span className="relative h-1 w-full overflow-hidden rounded-full bg-glaze/15" aria-hidden>
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-delft-200 transition-[width] duration-500"
              style={{ width: `${Math.max(4, progress * 100)}%` }}
            />
          </span>
        </div>
        <RoundButton label="Next page" onClick={() => go(1)} disabled={!canNext}>
          <ChevronRight className="size-5" />
        </RoundButton>
        <span className="mx-1 h-6 w-px bg-glaze/20" aria-hidden />
        <RoundButton label="Zoom in on these pages" onClick={() => setZoom({ focus: null })}>
          <ZoomIn className="size-5" />
        </RoundButton>
      </footer>

      {/* React-owned originals; page-flip gets clones */}
      <div ref={sourceRef} hidden>
        {BOOK_PAGES.map((p, i) => (
          <div key={i} data-density={isHard(p) ? "hard" : "soft"} className="relative overflow-hidden bg-[#fbfaf5]">
            <BookPageContent page={p} index={i} />
          </div>
        ))}
      </div>

      {tocOpen && (
        <div className="fixed inset-0 z-40 flex" role="dialog" aria-modal="true" aria-label="Contents">
          <nav className="flex h-full w-[min(400px,88vw)] flex-col bg-glaze text-delft-900 shadow-2xl animate-[book-slide_260ms_cubic-bezier(.2,.7,.2,1)]">
            <div className="flex items-center justify-between border-b-[3px] border-double border-delft-700 px-5 py-4">
              <p className="font-delft-display text-2xl font-semibold text-delft-800">Contents</p>
              <button
                type="button"
                onClick={() => setTocOpen(false)}
                aria-label="Close contents"
                className="grid size-9 place-items-center rounded-full text-delft-700 transition-colors hover:bg-delft-100"
              >
                <X className="size-5" />
              </button>
            </div>
            <ol className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3">
              {TOC.map((entry) => {
                const here = spread.includes(entry.index);
                return (
                  <li key={`${entry.index}-${entry.title}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setTocOpen(false);
                        jump(entry.index);
                      }}
                      aria-current={here ? "page" : undefined}
                      className={cn(
                        "flex w-full items-baseline gap-2 rounded-sm px-3 py-2 text-left text-lg leading-snug transition-colors hover:bg-delft-100",
                        here && "bg-delft-100 text-delft-700",
                      )}
                    >
                      <span className="min-w-0">{entry.title}</span>
                      <span aria-hidden className="mb-1 min-w-4 flex-1 border-b border-dotted border-delft-300" />
                      <span className="font-delft-display text-base tabular-nums text-delft-600">
                        {entry.page}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
          <button
            type="button"
            aria-label="Close contents"
            onClick={() => setTocOpen(false)}
            className="flex-1 bg-delft-950/50 animate-[book-fade_200ms_ease-out]"
          />
        </div>
      )}

      {zoom && (
        <BookZoom
          pages={spread.map((i) => ({ page: BOOK_PAGES[i], index: i }))}
          focus={zoom.focus}
          onClose={() => setZoom(null)}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
          canPrev={canPrev}
          canNext={canNext}
        />
      )}
    </div>
  );
}

function RoundButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-glaze/30 text-glaze transition-colors hover:bg-glaze/10 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function SideArrow({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous page" : "Next page"}
      className={cn(
        "absolute top-1/2 z-10 grid size-14 -translate-y-1/2 place-items-center rounded-full bg-glaze text-delft-800 shadow-lg transition-all hover:scale-105 hover:bg-delft-100 disabled:pointer-events-none disabled:opacity-0",
        dir === "prev" ? "left-6" : "right-6",
      )}
    >
      <Icon className="size-7" aria-hidden />
    </button>
  );
}
