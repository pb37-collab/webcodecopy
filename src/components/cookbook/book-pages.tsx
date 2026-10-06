import Image from "next/image";
import manuscript from "@/data/cookbook-book.json";
import { cookbook, substack } from "@/data/cookbook";
import { cn } from "@/lib/utils";
import { DelftPlate, DelftTile, Flourish, MotifGlyph } from "./delft-art";

/*
 * The physical book: designed front/back matter wrapped around the
 * manuscript pages (rendered from the PDF by scripts/build-cookbook.mjs).
 * Everything is sized in container units (cqw) so a page looks identical
 * whether it's 300px wide in the book or 1200px wide in the zoom view.
 */

export type BookPage =
  | { kind: "cover" }
  | { kind: "endpaper"; end: "front" | "back" }
  | { kind: "title" }
  | { kind: "scan"; src: string; number: number }
  | { kind: "notes" }
  | { kind: "back" };

/** Page aspect (width / height) taken from the manuscript, US Letter by default. */
export const PAGE_RATIO = manuscript.pages[0] ? manuscript.pages[0].width / manuscript.pages[0].height : 8.5 / 11;
export const PDF_HREF = manuscript.pdf;

function buildPages(): BookPage[] {
  const scans: BookPage[] = manuscript.pages.map((p, i) => ({ kind: "scan", src: p.src, number: i + 1 }));
  const pages: BookPage[] = [{ kind: "cover" }, { kind: "endpaper", end: "front" }, { kind: "title" }, ...scans];
  // With the cover alone on the right, the back cover must land alone on
  // the left — i.e. an even page count. Pad with a notes page if needed.
  if ((pages.length + 2) % 2 !== 0) pages.push({ kind: "notes" });
  pages.push({ kind: "endpaper", end: "back" }, { kind: "back" });
  return pages;
}

export const BOOK_PAGES = buildPages();

export function pageLabel(page: BookPage): string {
  switch (page.kind) {
    case "cover":
      return "Cover";
    case "endpaper":
      return page.end === "front" ? "Inside cover" : "Inside back cover";
    case "title":
      return "Title page";
    case "scan":
      return `Page ${page.number}`;
    case "notes":
      return "Kitchen notes";
    case "back":
      return "Back cover";
  }
}

/** "Pages 3–4" for two manuscript pages, otherwise each page's name. */
export function spreadLabel(pages: BookPage[]): string {
  const [a, b] = pages;
  if (a?.kind === "scan" && b?.kind === "scan") return `Pages ${a.number}–${b.number}`;
  return pages.map(pageLabel).join(" · ");
}

export const isHard = (page: BookPage) => page.kind === "cover" || page.kind === "back" || page.kind === "endpaper";

/** Which edge the spine is on, for gutter shading. Odd pages sit on the left. */
function gutter(index: number): "left" | "right" {
  return index % 2 === 1 ? "right" : "left";
}

export function BookPageContent({ page, index }: { page: BookPage; index: number }) {
  return (
    <div className="@container absolute inset-0 overflow-hidden">
      <Face page={page} />
      {!isHard(page) && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 w-[9%]",
            gutter(index) === "left"
              ? "left-0 bg-gradient-to-r from-delft-950/22 via-delft-950/6 to-transparent"
              : "right-0 bg-gradient-to-l from-delft-950/22 via-delft-950/6 to-transparent",
          )}
        />
      )}
    </div>
  );
}

function Face({ page }: { page: BookPage }) {
  switch (page.kind) {
    case "cover":
      return <Cover />;
    case "endpaper":
      return <Endpaper end={page.end} />;
    case "title":
      return <TitlePage />;
    case "scan":
      return (
        <div className="absolute inset-0 bg-[#fbfaf5]">
          <Image
            src={page.src}
            alt={`Page ${page.number}`}
            fill
            loading="eager"
            sizes="(min-width: 1024px) 50vw, 100vw"
            draggable={false}
            className="object-contain mix-blend-multiply"
          />
        </div>
      );
    case "notes":
      return <NotesPage />;
    case "back":
      return <BackCover />;
  }
}

function Cover() {
  return (
    <div className="absolute inset-0 bg-glaze text-delft-800">
      <div className="absolute inset-[4.5%] border-[0.7cqw] border-delft-700" />
      <div className="absolute inset-[6.5%] border-[0.25cqw] border-delft-700/60" />
      <div className="absolute inset-0 flex flex-col items-center px-[12%] pt-[12%] pb-[11%] text-center">
        <p className="text-[2.6cqw] uppercase tracking-[0.35em] text-delft-600">A free cookbook</p>
        <DelftPlate className="mt-[7%] w-[62%]" />
        <p className="mt-[8%] font-delft-display text-[11cqw] font-semibold leading-[0.92]">
          {cookbook.titleLead}
          <span className="block font-medium italic text-delft-600">{cookbook.titleTail}</span>
        </p>
        <p className="mt-[4%] font-delft-display text-[3.6cqw] italic text-delft-900/80">{cookbook.subtitle}</p>
        <p className="mt-auto text-[2.6cqw] uppercase tracking-[0.35em] text-delft-600">{cookbook.author}</p>
      </div>
      {/* spine + gloss */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[6%] bg-gradient-to-r from-delft-900/40 via-delft-900/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-delft-950/10" />
    </div>
  );
}

function Endpaper({ end }: { end: "front" | "back" }) {
  return (
    <div className="absolute inset-0 bg-delft-800">
      <div aria-hidden className="delft-tiles-light absolute inset-0 opacity-[0.13] [background-size:12.5cqw_12.5cqw]" />
      {end === "front" ? (
        <div className="absolute top-1/2 left-1/2 w-[58%] -translate-x-1/2 -translate-y-1/2 border-[0.6cqw] border-glaze bg-glaze p-[1.4%] text-center text-delft-800 shadow-[0_1cqw_3cqw_rgba(0,0,0,0.3)]">
          <div className="border-[0.25cqw] border-delft-700 px-[8%] py-[10%]">
            <svg viewBox="0 0 100 100" className="mx-auto w-[22%] text-delft-700" aria-hidden>
              <circle cx={50} cy={50} r={46} fill="none" stroke="currentColor" strokeWidth={3} />
              <MotifGlyph name="tulip" />
            </svg>
            <p className="mt-[8%] text-[2.4cqw] uppercase tracking-[0.3em] text-delft-600">Ex libris</p>
            <p className="mt-[4%] font-delft-display text-[5cqw] italic leading-tight">This book belongs to</p>
            <div className="mx-auto mt-[12%] h-[0.25cqw] w-[80%] bg-delft-700/60" />
          </div>
        </div>
      ) : (
        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-[0.4cqw] bg-delft-200 p-[0.4cqw] shadow-[0_1cqw_3cqw_rgba(0,0,0,0.3)]">
          {(["wheat", "jug", "fish"] as const).map((m) => (
            <DelftTile key={m} motif={m} className="w-[18cqw]" />
          ))}
        </div>
      )}
    </div>
  );
}

function TitlePage() {
  return (
    <div className="absolute inset-0 flex flex-col items-center bg-[#fbfaf5] px-[14%] pt-[16%] pb-[12%] text-center text-delft-800">
      <svg viewBox="0 0 100 100" className="w-[12%] text-delft-700" aria-hidden>
        <MotifGlyph name="rosette" />
      </svg>
      <p className="mt-[10%] font-delft-display text-[10cqw] font-semibold leading-[0.95]">
        {cookbook.titleLead}
        <span className="block font-medium italic text-delft-600">{cookbook.titleTail}</span>
      </p>
      <Flourish className="mt-[7%] h-auto w-[55%]" />
      <p className="mt-[7%] font-delft-display text-[4cqw] italic text-delft-900/80">{cookbook.subtitle}</p>
      <p className="mt-[16%] text-[2.6cqw] uppercase tracking-[0.3em] text-delft-600">Recipes by</p>
      <p className="mt-[2%] font-delft-display text-[6cqw] font-semibold">{cookbook.author}</p>
      <div className="mt-auto flex items-center gap-[3%] text-[2.2cqw] uppercase tracking-[0.3em] text-delft-600">
        <span className="whitespace-nowrap">Free edition</span>
        <span aria-hidden>&#9670;</span>
        <span>{cookbook.releaseLabel.replace(/^Releasing\s*/i, "")}</span>
      </div>
    </div>
  );
}

function NotesPage() {
  return (
    <div className="absolute inset-0 bg-[#fbfaf5] px-[12%] pt-[12%] pb-[10%] text-delft-800">
      <p className="text-center font-delft-display text-[6.5cqw] font-semibold italic">Kitchen notes</p>
      <Flourish className="mx-auto mt-[3%] h-auto w-[45%]" />
      <div
        aria-hidden
        className="mt-[8%] h-[72%] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(6cqw_-_0.25cqw),var(--color-delft-300)_calc(6cqw_-_0.25cqw),var(--color-delft-300)_6cqw)]"
      />
      <DelftTile motif="pear" className="absolute right-[8%] bottom-[5%] w-[9cqw] border-[0.2cqw] border-delft-700/40" />
    </div>
  );
}

function BackCover() {
  const host = substack.url.replace(/^https?:\/\//, "");
  return (
    <div className="absolute inset-0 bg-delft-700 text-glaze">
      <div aria-hidden className="delft-tiles-light absolute inset-0 opacity-[0.12] [background-size:16.66cqw_16.66cqw]" />
      <div className="absolute inset-[4.5%] border-[0.7cqw] border-glaze/80" />
      <div className="absolute inset-[6.5%] border-[0.25cqw] border-glaze/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[16%] text-center">
        <DelftPlate motif="windmill" className="w-[40%] drop-shadow-[0_1.5cqw_2cqw_rgba(0,0,0,0.3)]" />
        <p className="mt-[9%] font-delft-display text-[6cqw] font-semibold italic leading-tight">
          &ldquo;{cookbook.subtitle}&rdquo;
        </p>
        <p className="mt-[6%] text-[3.2cqw] leading-relaxed text-delft-100/90">
          New recipes every week, straight from the kitchen, on Substack.
        </p>
        <p className="mt-[3%] text-[2.6cqw] uppercase tracking-[0.25em] text-delft-200">{host}</p>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[6%] bg-gradient-to-l from-delft-950/45 via-delft-950/10 to-transparent" />
    </div>
  );
}
