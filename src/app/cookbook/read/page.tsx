import type { Metadata } from "next";
import { BookReader } from "@/components/cookbook/book-reader";
import { cookbook } from "@/data/cookbook";

export const metadata: Metadata = {
  title: { absolute: `Read ${cookbook.title}` },
  description: `Your free copy of ${cookbook.title} by ${cookbook.author}.`,
  // Reached after signing up (and from the Substack welcome email), not search.
  robots: { index: false, follow: false },
};

export default function ReadCookbookPage() {
  return <BookReader />;
}
