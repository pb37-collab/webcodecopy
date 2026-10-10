import type { Metadata } from "next";
import { ContentGallery, type GalleryItem } from "@/components/content-gallery";
import { Eyebrow, PendingNote, Prose } from "@/components/primitives";
import { content } from "@/data/content";
import { hasPublicFile } from "@/lib/media";

export const metadata: Metadata = {
  title: "Content",
  description: "Ads, social posts, video and AI creators produced by Parker Beck.",
};

export default function Page() {
  const items: GalleryItem[] = content
    .filter((item) => item.clientApproved !== false)
    .map((item) => ({
      ...item,
      present: hasPublicFile(item.src),
      posterPresent: item.poster ? hasPublicFile(item.poster) : false,
    }));
  const missing = items.filter((i) => !i.present).length;

  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 sm:pt-16">
      <Eyebrow>Content</Eyebrow>
      <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[0.98] sm:text-7xl">
        The work itself.
      </h1>
      <Prose className="mt-5">
        <p>
          Ads, posts, video and AI creators. Anything made with generative AI (Higgsfield,
          Midjourney) is labelled <strong>AI-produced</strong>. That&rsquo;s the point, not a
          disclaimer: it&rsquo;s how one operator ships a full test slate every round.
        </p>
      </Prose>
      <div className="mt-10">
        <ContentGallery items={items} />
      </div>
      {missing > 0 && (
        <div className="mt-6">
          <PendingNote>
            {missing} of {items.length} pieces are waiting on their web-optimized export (run
            scripts/optimize-content.mjs). Client work from Frosty Hemp Co, Chunky Academy and
            bud.com gets added once each client signs off.
          </PendingNote>
        </div>
      )}
    </div>
  );
}
