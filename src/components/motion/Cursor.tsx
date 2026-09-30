"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Leest of dit apparaat een eigen cursor verdient: een echte muis én geen
 * voorkeur voor minder beweging. Via useSyncExternalStore in plaats van state
 * in een effect, zodat de eerste client-render meteen klopt en de waarde
 * meeverandert wanneer de gebruiker zijn systeeminstelling aanpast.
 */
function subscribe(callback: () => void) {
  const queries = [window.matchMedia("(pointer: fine)"), window.matchMedia("(prefers-reduced-motion: reduce)")];
  queries.forEach((q) => q.addEventListener("change", callback));
  return () => queries.forEach((q) => q.removeEventListener("change", callback));
}

function getSnapshot() {
  return window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Op de server bestaat er geen cursor; daar is het antwoord altijd nee. */
function getServerSnapshot() {
  return false;
}

/**
 * Eigen cursor voor desktop: een kleine ring die de muis volgt en groeit bij
 * interactieve elementen. Een label binnen de ring vertelt wat een klik doet
 * (bijvoorbeeld "Bekijk"), gestuurd via `data-cursor` op het element.
 *
 * Bewust gebouwd zonder React-state per frame: de positie wordt rechtstreeks op
 * het DOM-element geschreven in een requestAnimationFrame-lus. Dat scheelt
 * duizenden re-renders en houdt de INP laag.
 *
 * De cursor verschijnt alleen op apparaten met een echte muis en nooit bij
 * `prefers-reduced-motion`; de systeemcursor blijft altijd zichtbaar, zodat er
 * geen toegankelijkheidsrisico ontstaat als dit onderdeel faalt.
 */
export function Cursor() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!ring || !label) return;

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: pointer.x, y: pointer.y };
    let frame = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!visible) {
        visible = true;
        ring.style.opacity = "1";
      }

      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [data-cursor]");
      const text = target?.dataset.cursor ?? "";
      const interactive = Boolean(target);

      ring.dataset.state = text ? "label" : interactive ? "active" : "idle";
      if (label.textContent !== text) label.textContent = text;
    };

    const onLeave = () => {
      visible = false;
      ring.style.opacity = "0";
    };

    const loop = () => {
      // Lineaire interpolatie geeft de ring een lichte naloop op de muis.
      current.x += (pointer.x - current.x) * 0.18;
      current.y += (pointer.y - current.y) * 0.18;
      ring.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      data-state="idle"
      className="pointer-events-none fixed left-0 top-0 z-[90] flex items-center justify-center rounded-full border border-champagne/70 opacity-0 mix-blend-difference transition-[width,height,background-color,border-color] duration-500 ease-[var(--ease-couture)] data-[state=active]:h-12 data-[state=active]:w-12 data-[state=active]:bg-champagne/10 data-[state=idle]:h-6 data-[state=idle]:w-6 data-[state=label]:h-24 data-[state=label]:w-24 data-[state=label]:border-champagne data-[state=label]:bg-champagne/15"
    >
      <span
        ref={labelRef}
        className="font-sans text-[0.55rem] uppercase tracking-luxe text-champagne opacity-0 transition-opacity duration-300"
      />
      <style>{`[data-state="label"] > span { opacity: 1; }`}</style>
    </div>
  );
}
