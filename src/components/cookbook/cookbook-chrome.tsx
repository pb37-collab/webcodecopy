import { cookbook, cookbookNav, socials, substack } from "@/data/cookbook";
import { cn } from "@/lib/utils";
import { DelftTile, Flourish, MotifGlyph } from "./delft-art";

export function CookbookHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-double border-delft-700 bg-glaze/92 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5 text-delft-800">
          <svg viewBox="0 0 100 100" className="size-8" aria-hidden>
            <circle cx={50} cy={50} r={46} fill="none" stroke="currentColor" strokeWidth={4} />
            <MotifGlyph name="rosette" />
          </svg>
          <span className="font-delft-display text-xl font-semibold tracking-tight sm:text-2xl">{cookbook.title}</span>
        </a>
        <nav className="flex items-center gap-6">
          <ul className="hidden items-center gap-6 text-sm uppercase tracking-[0.18em] text-delft-800 lg:flex">
            {cookbookNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-delft-500">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#get-the-book"
            className="rounded-sm bg-delft-700 px-3.5 py-2 font-delft-display text-base font-semibold text-glaze transition-colors hover:bg-delft-900 sm:px-4"
          >
            Get it free
          </a>
        </nav>
      </div>
    </header>
  );
}

export function CookbookFooter() {
  return (
    <footer className="border-t-[3px] border-double border-delft-700 bg-glaze">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center sm:px-6">
        <div className="flex gap-px bg-delft-200" aria-hidden>
          {(["tulip", "rosette", "windmill"] as const).map((m) => (
            <DelftTile key={m} motif={m} className="size-14" />
          ))}
        </div>
        <p className="font-delft-display text-3xl font-semibold text-delft-800">{cookbook.title}</p>
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm uppercase tracking-[0.18em] text-delft-700">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-delft-500">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-base text-delft-800/70">
          &copy; {new Date().getFullYear()} {cookbook.author}. Newsletter powered by{" "}
          <a href={substack.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
            Substack
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <p className={cn("text-sm uppercase tracking-[0.28em]", dark ? "text-delft-200" : "text-delft-600")}>
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-3 font-delft-display text-4xl font-semibold leading-[1.05] text-balance sm:text-5xl",
          dark ? "text-glaze" : "text-delft-800",
        )}
      >
        {title}
      </h2>
      <Flourish className={cn("mx-auto mt-5", dark && "text-delft-200")} />
      {intro && (
        <p className={cn("mt-5 text-lg leading-relaxed sm:text-xl", dark ? "text-delft-100/90" : "text-delft-900/80")}>
          {intro}
        </p>
      )}
    </div>
  );
}
