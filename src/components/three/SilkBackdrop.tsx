"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Laadt de 3D-scene pas client-side, en alleen wanneer dat zinvol is.
 *
 * Overgeslagen bij:
 *  - prefers-reduced-motion
 *  - ontbrekende WebGL-ondersteuning
 *  - weinig CPU-cores of een save-data-verbinding
 *
 * In die gevallen blijft de CSS-gradient van de hero zichtbaar; de layout verandert niet.
 */
const SilkScene = dynamic(() => import("@/components/three/SilkScene"), { ssr: false });

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

function shouldRender(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (connection?.saveData) return false;
  if (connection?.effectiveType && ["slow-2g", "2g"].includes(connection.effectiveType)) return false;
  if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency < 4) return false;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function SilkBackdrop({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // requestIdleCallback houdt de hero-LCP vrij van dit werk.
    const idle = window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(() => cb({} as IdleDeadline), 400));
    const handle = idle(() => setEnabled(shouldRender()));
    return () => {
      if (typeof handle === "number" && window.cancelIdleCallback) window.cancelIdleCallback(handle);
    };
  }, []);

  if (!enabled) return null;
  return <SilkScene className={className} />;
}
