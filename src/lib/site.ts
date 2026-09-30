/**
 * Site-wide constants. Contact details and the LinkedIn URL are still open
 * items for Parker (see docs/research/OPEN_ITEMS.md) — change them here only.
 */
export const site = {
  name: "Parker Beck",
  title: "Parker Beck — Social, growth & marketing engineering",
  description:
    "Portfolio of Parker Beck: social and influencer marketing, paid-traffic testing, AI content production and the tools built to run it.",
  email: "parker@cannaconnect.agency",
  linkedin: "https://www.linkedin.com/in/parker-beck-3bb939102/",
  location: "New York, NY",
  url: "https://parker-beck-portfolio.vercel.app",
} as const;

export const nav = [
  { href: "/#work", label: "Work" },
  { href: "/content/", label: "Content" },
  { href: "/resume/", label: "Resume" },
] as const;
