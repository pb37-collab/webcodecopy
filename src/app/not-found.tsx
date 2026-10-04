import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center gap-4 px-5 py-24">
        <h1 className="font-display text-5xl tracking-tight">Page not found.</h1>
        <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent hover:opacity-80">
          Back to the work
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
