import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Outfit, Permanent_Marker } from "next/font/google";
import "./chunky.css";

// Outfit + DM Sans are chunkyacademy.com's own type pairing.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

// Spray-tag accent for stickers and scribbles, after the site's graffiti promo art.
const marker = Permanent_Marker({
  variable: "--font-marker",
  subsets: ["latin"],
  weight: "400",
});

const mono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free Sample | Chunky Academy",
  description:
    "Claim a free sample from Chunky Academy: 7g of Jolly Rancher Runtz or 3.5g of Cotton Candy Toast Snowcaps. 21+ only.",
  // Paid-traffic landers: keep them out of search results.
  robots: { index: false, follow: false },
  icons: { icon: "/images/chunky/chunky-academy-logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#050807",
  colorScheme: "dark",
};

export default function ChunkyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${dmSans.variable} ${marker.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh bg-ca-bg font-ca-sans text-ca-ink antialiased">{children}</body>
    </html>
  );
}
