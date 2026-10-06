"use client";

import { ArrowRight, BookOpen, Check, Mail } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { READER_HREF, SUBSTACK_LIVE, substack } from "@/data/cookbook";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Email capture that subscribes straight to Substack.
 *
 * The site is a static export (no server), so the form posts to Substack's
 * no-JS subscribe endpoint inside a hidden iframe. Visitors stay on the page
 * and see a confirmation; Substack then sends its own confirm email. Put the
 * download link in your Substack welcome email so every new subscriber gets
 * the book automatically.
 */
export function SubscribeForm({
  tone = "light",
  buttonLabel = "Send me the free cookbook",
  className,
}: {
  tone?: "light" | "dark";
  buttonLabel?: string;
  className?: string;
}) {
  const id = useId();
  const frameName = `substack-frame-${id.replace(/[^a-zA-Z0-9]/g, "")}`;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "invalid" | "sent">("idle");
  const dark = tone === "dark";

  if (status === "sent") {
    return (
      <div
        role="status"
        className={cn(
          "flex items-start gap-4 rounded-sm border p-5",
          dark ? "border-glaze/40 bg-glaze/10 text-glaze" : "border-delft-700/30 bg-delft-100 text-delft-900",
          className,
        )}
      >
        <span
          className={cn(
            "mt-0.5 grid size-9 shrink-0 place-items-center rounded-full",
            dark ? "bg-glaze text-delft-800" : "bg-delft-700 text-glaze",
          )}
        >
          <Check className="size-5" aria-hidden />
        </span>
        <div>
          <p className="font-delft-display text-2xl font-semibold leading-tight">Your copy is unlocked.</p>
          <p className={cn("mt-1 text-lg leading-snug", dark ? "text-glaze/85" : "text-delft-800")}>
            Open it now, or download the PDF from inside.
            {SUBSTACK_LIVE && (
              <>
                {" "}Check <span className="font-semibold">{email}</span> to confirm your Substack subscription.
              </>
            )}
          </p>
          <Link
            href={READER_HREF}
            className={cn(
              "group mt-4 inline-flex h-11 items-center gap-2 rounded-sm px-5 font-delft-display text-lg font-semibold transition-colors",
              dark ? "bg-glaze text-delft-800 hover:bg-delft-100" : "bg-delft-700 text-glaze hover:bg-delft-900",
            )}
          >
            <BookOpen className="size-5" aria-hidden />
            Open the cookbook
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          {SUBSTACK_LIVE ? (
            <a
              href={substack.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-base underline decoration-1 underline-offset-4"
            >
              No confirmation email? Subscribe on Substack directly
            </a>
          ) : (
            <p className={cn("mt-3 text-sm italic", dark ? "text-glaze/70" : "text-delft-800/70")}>
              Preview mode: Substack isn&rsquo;t connected yet, so no email was sent.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <form
        action={`${substack.url}/api/v1/free?nojs=true`}
        method="post"
        target={frameName}
        noValidate
        onSubmit={(e) => {
          if (!EMAIL_RE.test(email.trim())) {
            e.preventDefault();
            setStatus("invalid");
            return;
          }
          // Preview mode: nowhere to post yet, just unlock.
          if (!SUBSTACK_LIVE) e.preventDefault();
          // Otherwise let the browser post into the hidden iframe, then swap the UI.
          try {
            localStorage.setItem("cookbook-unlocked", "1");
          } catch {
            // Storage blocked (private mode) — the unlock link still works.
          }
          setTimeout(() => setStatus("sent"), 0);
        }}
        className={cn(
          "flex flex-col gap-2 rounded-sm border-2 p-1.5 sm:flex-row sm:items-stretch",
          dark ? "border-glaze/70 bg-glaze" : "border-delft-700 bg-glaze shadow-[4px_4px_0_0_var(--color-delft-700)]",
        )}
      >
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <div className="flex flex-1 items-center gap-2 px-3">
          <Mail className="size-5 shrink-0 text-delft-500" aria-hidden />
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder="you@example.com"
            value={email}
            aria-invalid={status === "invalid"}
            aria-describedby={`${id}-hint`}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "invalid") setStatus("idle");
            }}
            className="h-12 w-full min-w-0 bg-transparent text-lg text-delft-950 placeholder:text-delft-500/70 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className={cn(
            "group inline-flex h-12 items-center justify-center gap-2 rounded-sm px-5 font-delft-display text-lg font-semibold tracking-wide transition-colors",
            dark ? "bg-delft-800 text-glaze hover:bg-delft-950" : "bg-delft-700 text-glaze hover:bg-delft-900",
          )}
        >
          {buttonLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </button>
      </form>
      <p
        id={`${id}-hint`}
        className={cn(
          "mt-3 text-base",
          status === "invalid" ? (dark ? "text-glaze" : "text-red-700") : dark ? "text-glaze/75" : "text-delft-800/80",
        )}
      >
        {status === "invalid" ? "That email doesn’t look quite right — try again?" : substack.cadence}
      </p>
      <iframe name={frameName} title="Substack subscription" className="hidden" tabIndex={-1} aria-hidden />
    </div>
  );
}
