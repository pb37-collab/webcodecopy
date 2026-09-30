import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-3xl leading-tight sm:text-4xl">
            Let&rsquo;s build the next one.
          </p>
          <p className="mt-2 text-sm text-ink-3">{site.location}</p>
        </div>
        <div className="flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
          <a
            href={`mailto:${site.email}`}
            className="rounded-full bg-accent px-4 py-2 text-bg transition-opacity hover:opacity-85"
          >
            {site.email}
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line-2 px-4 py-2 text-ink-2 transition-colors hover:border-accent hover:text-accent"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
