"use client";

import { ChevronLeft, ChevronRight, Maximize, Minus, Plus, X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { type BookPage, BookPageContent, PAGE_RATIO, spreadLabel } from "./book-pages";

/** Pages render at this height, then get scaled — keeps text sharp when zoomed. */
const BASE_H = 1100;
const MAX_ZOOM = 5;
const PAD = 32;

type View = { s: number; x: number; y: number };
type Pt = { x: number; y: number };

/**
 * Full-screen zoom on the open spread: scroll / pinch to zoom, drag to pan,
 * double-click (or double-tap) to jump in and back out.
 */
export function BookZoom({
  pages,
  focus,
  onClose,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: {
  pages: { page: BookPage; index: number }[];
  /** Which page of the spread was double-clicked, if any. */
  focus: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, Pt>());
  const gesture = useRef<{ dist: number; mid: Pt; view: View } | null>(null);
  const lastTap = useRef(0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [view, setView] = useState<View>({ s: 0, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const pageW = BASE_H * PAGE_RATIO;
  const contentW = pageW * pages.length;
  const fit = size.w ? Math.min((size.w - PAD * 2) / contentW, (size.h - PAD * 2) / BASE_H) : 0;

  const clamp = useCallback(
    (v: View): View => {
      const s = Math.min(Math.max(v.s, fit), fit * MAX_ZOOM);
      const maxX = Math.max(0, (contentW * s - size.w) / 2 + PAD);
      const maxY = Math.max(0, (BASE_H * s - size.h) / 2 + PAD);
      return { s, x: Math.min(maxX, Math.max(-maxX, v.x)), y: Math.min(maxY, Math.max(-maxY, v.y)) };
    },
    [fit, contentW, size.w, size.h],
  );

  /** Zoom to scale `s` keeping the point `p` (relative to centre) still. */
  const zoomAt = useCallback(
    (from: View, s: number, p: Pt) => {
      const k = Math.min(Math.max(s, fit), fit * MAX_ZOOM) / from.s;
      return clamp({ s: from.s * k, x: p.x - (p.x - from.x) * k, y: p.y - (p.y - from.y) * k });
    },
    [clamp, fit],
  );

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Reset to fit whenever the spread or viewport changes; zoom toward the
  // double-clicked page on open.
  const spreadKey = pages.map((p) => p.index).join("-");
  useLayoutEffect(() => {
    if (!fit) return;
    const base = { s: fit, x: 0, y: 0 };
    if (focus !== null && pages.length > 1) {
      const i = pages.findIndex((p) => p.index === focus);
      const cx = (i - (pages.length - 1) / 2) * pageW * fit;
      setView(zoomAt(base, fit * 1.8, { x: cx, y: 0 }));
    } else {
      setView(base);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on new spread / resize
  }, [spreadKey, fit]);

  // Wheel needs a non-passive listener to stop the page from scrolling.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const p = { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
      setView((v) => zoomAt(v, v.s * Math.exp(-e.deltaY * 0.0012), p));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "+" || e.key === "=") setView((v) => zoomAt(v, v.s * 1.4, { x: 0, y: 0 }));
      else if (e.key === "-" || e.key === "_") setView((v) => zoomAt(v, v.s / 1.4, { x: 0, y: 0 }));
      else if (e.key === "0") setView({ s: fit, x: 0, y: 0 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomAt, fit]);

  const local = (e: React.PointerEvent): Pt => {
    const r = viewportRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
  };

  const startGesture = () => {
    const pts = [...pointers.current.values()];
    if (pts.length === 2) {
      gesture.current = {
        dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
        mid: { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 },
        view,
      };
    } else if (pts.length === 1) {
      gesture.current = { dist: 0, mid: pts[0], view };
    } else {
      gesture.current = null;
    }
  };

  const toggleZoom = (p: Pt) => setView((v) => (v.s > fit * 1.3 ? { s: fit, x: 0, y: 0 } : zoomAt(v, fit * 2.5, p)));

  const zoomPct = fit ? Math.round((view.s / fit) * 100) : 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Zoomed page view"
      className="fixed inset-0 z-50 flex flex-col bg-delft-950/95 backdrop-blur-sm animate-[book-fade_200ms_ease-out]"
    >
      <div
        ref={viewportRef}
        className={cn(
          "relative min-h-0 flex-1 touch-none overflow-hidden",
          view.s > fit * 1.01 ? (dragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in",
        )}
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          pointers.current.set(e.pointerId, local(e));
          setDragging(true);
          startGesture();
          if (e.pointerType === "touch" && pointers.current.size === 1) {
            const now = Date.now();
            if (now - lastTap.current < 300) toggleZoom(local(e));
            lastTap.current = now;
          }
        }}
        onPointerMove={(e) => {
          if (!pointers.current.has(e.pointerId)) return;
          pointers.current.set(e.pointerId, local(e));
          const g = gesture.current;
          if (!g) return;
          const pts = [...pointers.current.values()];
          if (pts.length === 2 && g.dist) {
            const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
            const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
            const zoomed = zoomAt(g.view, g.view.s * (dist / g.dist), g.mid);
            setView(clamp({ ...zoomed, x: zoomed.x + mid.x - g.mid.x, y: zoomed.y + mid.y - g.mid.y }));
          } else if (pts.length === 1) {
            setView(clamp({ ...g.view, x: g.view.x + pts[0].x - g.mid.x, y: g.view.y + pts[0].y - g.mid.y }));
          }
        }}
        onPointerUp={(e) => {
          pointers.current.delete(e.pointerId);
          setDragging(pointers.current.size > 0);
          startGesture();
        }}
        onPointerCancel={(e) => {
          pointers.current.delete(e.pointerId);
          setDragging(pointers.current.size > 0);
          startGesture();
        }}
        onDoubleClick={(e) => {
          const r = viewportRef.current!.getBoundingClientRect();
          toggleZoom({ x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 });
        }}
      >
        {fit > 0 && (
          <div
            className={cn(
              "absolute top-1/2 left-1/2 flex origin-center shadow-[0_30px_80px_rgba(0,0,0,0.5)]",
              !dragging && "transition-transform duration-200 ease-out",
            )}
            style={{
              width: contentW,
              height: BASE_H,
              transform: `translate(calc(-50% + ${view.x}px), calc(-50% + ${view.y}px)) scale(${view.s})`,
            }}
          >
            {pages.map(({ page, index }) => (
              <div key={index} className="relative h-full" style={{ width: pageW }}>
                <BookPageContent page={page} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 border-t border-glaze/15 px-4 py-3 text-glaze">
        <ZoomButton label="Previous pages" onClick={onPrev} disabled={!canPrev}>
          <ChevronLeft className="size-5" />
        </ZoomButton>
        <span className="min-w-28 text-center font-delft-display text-lg">
          {spreadLabel(pages.map((p) => p.page))}
        </span>
        <ZoomButton label="Next pages" onClick={onNext} disabled={!canNext}>
          <ChevronRight className="size-5" />
        </ZoomButton>
        <span className="mx-2 h-6 w-px bg-glaze/20" aria-hidden />
        <ZoomButton label="Zoom out" onClick={() => setView((v) => zoomAt(v, v.s / 1.4, { x: 0, y: 0 }))}>
          <Minus className="size-5" />
        </ZoomButton>
        <span className="w-14 text-center font-mono text-sm tabular-nums">{zoomPct}%</span>
        <ZoomButton label="Zoom in" onClick={() => setView((v) => zoomAt(v, v.s * 1.4, { x: 0, y: 0 }))}>
          <Plus className="size-5" />
        </ZoomButton>
        <ZoomButton label="Fit to screen" onClick={() => setView({ s: fit, x: 0, y: 0 })}>
          <Maximize className="size-4" />
        </ZoomButton>
        <span className="mx-2 h-6 w-px bg-glaze/20" aria-hidden />
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-glaze px-4 font-delft-display text-lg font-semibold text-delft-800 transition-colors hover:bg-delft-100"
        >
          <X className="size-4" aria-hidden />
          Back to book
        </button>
      </div>
    </div>
  );
}

function ZoomButton({
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
      className="grid size-10 place-items-center rounded-full border border-glaze/30 transition-colors hover:bg-glaze/10 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
