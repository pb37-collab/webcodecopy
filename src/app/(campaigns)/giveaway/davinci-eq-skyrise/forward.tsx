"use client";

import { useEffect } from "react";

/** Replaces the current URL with `href`, carrying over the query string and hash. */
export function ForwardTo({ href }: { href: string }) {
  useEffect(() => {
    window.location.replace(href + window.location.search + window.location.hash);
  }, [href]);
  return null;
}
