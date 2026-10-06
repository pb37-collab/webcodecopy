import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond } from "next/font/google";
import { cookbook } from "@/data/cookbook";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const description = `${cookbook.subtitle} A free cookbook by ${cookbook.author} — join the Substack to get your copy.`;

export const metadata: Metadata = {
  title: { absolute: `${cookbook.title} — a free cookbook by ${cookbook.author}` },
  description,
  openGraph: {
    title: `${cookbook.title} — a free cookbook`,
    description,
    type: "website",
    url: "/cookbook/",
  },
  twitter: {
    card: "summary",
    title: `${cookbook.title} — a free cookbook`,
    description,
  },
};

export default function CookbookLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`delft-page ${cormorant.variable} ${ebGaramond.variable} flex flex-1 flex-col bg-glaze font-delft-body text-delft-950`}
    >
      {children}
    </div>
  );
}
