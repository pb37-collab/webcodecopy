import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: every route becomes a plain HTML file in `out/`.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
