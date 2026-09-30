"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Stuurt één `view_dress`-event zodra een jurkpagina is geopend. */
export function DressViewTracker({ slug, name }: { slug: string; name: string }) {
  useEffect(() => {
    track("view_dress", { dress_slug: slug, dress_name: name });
  }, [slug, name]);

  return null;
}
