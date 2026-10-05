import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";
import "./chunky.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free Sample | Chunky Academy",
  description:
    "Choose your free sample from Chunky Academy: 7g of Jolly Rancher Runtz or 3.5g of Cotton Candy Toast Snowcaps. 21+ only.",
  // Paid-traffic landers: keep them out of search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0a0d",
  colorScheme: "dark",
};

export default function ChunkyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-ca-bg font-ca-sans text-ca-ink antialiased">{children}</body>
    </html>
  );
}
