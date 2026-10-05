"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { SampleId } from "@/lib/chunky/config";
import { claimConfig } from "@/lib/chunky/config";
import {
  ClaimError,
  claimSample,
  readStoredClaim,
  type ClaimSource,
  type StoredClaim,
} from "@/lib/chunky/claim";
import { samples } from "@/lib/chunky/products";

export type ClaimStatus = "idle" | "submitting" | "redirecting" | "demo";

/**
 * Runs a claim and handles the hand-off: a real redirect when the store is
 * connected, the preview sheet when it isn't, an error message when the
 * Chunky API refuses. `delayMs` lets a page finish its "chosen" animation.
 */
export function useClaim(source: ClaimSource) {
  const [status, setStatus] = useState<ClaimStatus>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const claim = useCallback(
    async (
      input: { firstName: string; email: string; sample: SampleId },
      { delayMs = 0 } = {},
    ): Promise<boolean> => {
      setStatus("submitting");
      setError(null);
      const started = Date.now();
      try {
        const result = await claimSample({ ...input, source });
        const wait = Math.max(0, delayMs - (Date.now() - started));
        if (wait) await new Promise((r) => setTimeout(r, wait));
        if (result.live) {
          setStatus("redirecting");
          window.location.assign(result.url);
        } else {
          console.info("[chunky] preview mode:\n" + result.preview);
          setPreview(result.preview);
          setStatus("demo");
        }
        return true;
      } catch (err) {
        setError(err instanceof ClaimError ? err.message : "Something went wrong. Please try again.");
        setStatus("idle");
        return false;
      }
    },
    [source],
  );

  const reset = useCallback(() => {
    setPreview(null);
    setStatus("idle");
  }, []);

  return { status, claim, preview, error, reset };
}

/** A previous claim from this browser, read after mount (localStorage). */
export function useStoredClaim(): StoredClaim | null {
  const [stored, setStored] = useState<StoredClaim | null>(null);
  useEffect(() => {
    // localStorage only exists client-side, so this has to run after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStored(readStoredClaim());
  }, []);
  return stored;
}

/** `?sample=runtz` / `?sample=snowcaps` preselects a product (for single-product ads). */
export function useSampleParam(): SampleId | null {
  const [param, setParam] = useState<SampleId | null>(null);
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("sample");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value === "runtz" || value === "snowcaps") setParam(value);
  }, []);
  return param;
}

/**
 * Renders into <body>. Fixed-position UI must escape animated ancestors: a
 * parent with a transform becomes the containing block for `position: fixed`.
 */
export function BodyPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  return mounted ? createPortal(children, document.body) : null;
}

export function PreviewSheet({ preview, onClose }: { preview: string | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  if (!preview) return null;
  const api = claimConfig.mode === "chunky-api";
  return (
    <BodyPortal>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ca-preview-title"
        className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 p-3 backdrop-blur-sm sm:items-center"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg animate-ca-rise rounded-2xl border-2 border-ca-green/60 bg-ca-card p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-ca-display text-[0.7rem] font-bold tracking-[0.22em] text-ca-neon uppercase">
            Preview mode
          </p>
          <h2 id="ca-preview-title" className="mt-2 font-ca-display text-2xl font-black uppercase">
            Claim works. Store not connected here.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ca-ink-2">
            {api
              ? "On chunkyacademy.com this page makes the same calls the current free-sample page makes, then sends the customer to checkout:"
              : "Once connected, the customer goes straight to this cart link:"}
          </p>
          <pre className="mt-4 max-h-48 overflow-auto rounded-xl border border-ca-line bg-black p-3 font-ca-mono text-[0.7rem] leading-relaxed break-all whitespace-pre-wrap text-ca-mint">
            {preview}
          </pre>
          <p className="mt-2 text-xs text-ca-ink-3">
            Setup: <code>docs/chunky/INTEGRATION.md</code>
          </p>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(preview).then(() => setCopied(true));
              }}
              className="flex-1 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-gradient-to-b from-ca-green-2 to-ca-green px-4 py-3 text-sm font-extrabold uppercase"
            >
              Back to page
            </button>
          </div>
        </div>
      </div>
    </BodyPortal>
  );
}

/** "You already picked X, finish checkout" strip for returning visitors. */
export function ReturningNotice() {
  const stored = useStoredClaim();
  if (!stored) return null;
  return (
    <div className="relative z-30 bg-ca-deep px-4 py-2.5 text-center text-[0.82rem] text-ca-ink-2">
      You picked <span className="font-bold text-white">{samples[stored.sample].name}</span>.{" "}
      <a href={stored.url} className="font-bold text-ca-neon underline underline-offset-4">
        Finish checkout →
      </a>
    </div>
  );
}
