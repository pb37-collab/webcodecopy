"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { SampleId } from "@/lib/chunky/config";
import { claimSample, readStoredClaim, type ClaimSource, type StoredClaim } from "@/lib/chunky/claim";
import { samples } from "@/lib/chunky/products";

export type ClaimStatus = "idle" | "submitting" | "redirecting" | "demo";

/**
 * Runs a claim and handles the hand-off: a real redirect when the store is
 * connected, the demo sheet when it isn't. `delayMs` lets a page finish its
 * "chosen" animation before leaving.
 */
export function useClaim(source: ClaimSource) {
  const [status, setStatus] = useState<ClaimStatus>("idle");
  const [demoUrl, setDemoUrl] = useState<string | null>(null);

  const claim = useCallback(
    async (input: { firstName: string; email: string; sample: SampleId }, delayMs = 0) => {
      setStatus("submitting");
      const started = Date.now();
      const result = await claimSample({ ...input, source });
      const wait = Math.max(0, delayMs - (Date.now() - started));
      if (wait) await new Promise((r) => setTimeout(r, wait));
      if (result.live) {
        setStatus("redirecting");
        window.location.assign(result.url);
      } else {
        console.info("[chunky] demo mode, cart URL:", result.url);
        setDemoUrl(result.url);
        setStatus("demo");
      }
    },
    [source],
  );

  const reset = useCallback(() => {
    setDemoUrl(null);
    setStatus("idle");
  }, []);

  return { status, claim, demoUrl, reset };
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

export function DemoSheet({ url, onClose }: { url: string | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  if (!url) return null;
  return (
    <BodyPortal>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ca-demo-title"
        className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg animate-ca-rise rounded-3xl border border-ca-line-2 bg-ca-card p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[0.68rem] font-semibold tracking-[0.28em] text-ca-gold uppercase">
            Preview mode
          </p>
          <h2 id="ca-demo-title" className="mt-2 font-ca-display text-2xl">
            Claim captured. No store connected yet.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ca-ink-2">
            Once the Shopify domain and variant IDs are set (see{" "}
            <code className="text-ca-ink">docs/chunky/INTEGRATION.md</code>), the customer goes straight to
            this cart link:
          </p>
          <code className="mt-4 block max-h-36 overflow-auto rounded-xl border border-ca-line bg-ca-bg p-3 font-ca-mono text-[0.72rem] leading-relaxed break-all text-ca-ink-2">
            {url}
          </code>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(url).then(() => setCopied(true));
              }}
              className="flex-1 rounded-full border border-ca-line-2 px-4 py-3 text-sm font-semibold"
            >
              {copied ? "Copied" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full bg-ca-ink px-4 py-3 text-sm font-semibold text-ca-bg"
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
    <div className="relative z-30 border-b border-ca-line bg-ca-card/90 px-4 py-2.5 text-center text-[0.8rem] text-ca-ink-2 backdrop-blur">
      You picked <span className="font-semibold text-ca-ink">{samples[stored.sample].name}</span>.{" "}
      <a href={stored.url} className="font-semibold text-ca-gold underline underline-offset-4">
        Finish checkout →
      </a>
    </div>
  );
}
