import Link from "next/link";
import { nav, site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="font-display text-xl tracking-tight">
          Parker Beck
        </Link>
        <nav className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2 sm:gap-6">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-accent">
              {item.label}
            </Link>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="hidden rounded-full border border-line-2 px-3 py-1.5 text-ink transition-colors hover:border-accent hover:text-accent sm:inline-block"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
