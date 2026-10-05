import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Wordmark } from "@/components/chunky/shared";
import { claimConfig, isLive } from "@/lib/chunky/config";

export const metadata: Metadata = {
  title: "Free Sample Landers | Chunky Academy",
};

const versions = [
  {
    href: "/chunky/free-sample-v1/",
    name: "Version 1: Two strains, one is on us",
    body: "Side-by-side product cards with the form right under them. Pick, type, claim. A sticky claim bar follows on phones.",
  },
  {
    href: "/chunky/free-sample-v2/",
    name: "Version 2: Pick a hand",
    body: "Red hand or blue hand. The email unlocks the hands; the hand you tap goes straight to the cart.",
  },
];

/** Internal index for reviewing the two landers side by side. Not linked from either page. */
export default function ChunkyIndex() {
  const connected = isLive("runtz") && isLive("snowcaps");
  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 py-10 sm:py-16">
      <Wordmark />
      <h1 className="mt-8 font-ca-display text-4xl font-medium tracking-[-0.02em]">Free sample landers</h1>
      <p className="mt-2 text-sm text-ca-ink-2">
        Store connection:{" "}
        <span className={connected ? "font-semibold text-emerald-400" : "font-semibold text-ca-gold"}>
          {connected ? `live (${claimConfig.shopDomain || "custom cart URL"})` : "preview mode"}
        </span>
        . Setup: <code className="font-ca-mono text-xs">docs/chunky/INTEGRATION.md</code>
      </p>
      <ul className="mt-8 space-y-3">
        {versions.map((v) => (
          <li key={v.href}>
            <a
              href={v.href}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-ca-line bg-ca-card p-5 transition hover:border-ca-line-2"
            >
              <span>
                <span className="block font-semibold">{v.name}</span>
                <span className="mt-1 block text-sm text-ca-ink-2">{v.body}</span>
              </span>
              <ArrowRight className="size-5 shrink-0 text-ca-gold transition-transform group-hover:translate-x-1" />
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
