"use client";

import { useEffect } from "react";
import { isLite } from "@/lib/lite";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>_";
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scramble a short mono label and let it resolve left to right, like a terminal decoding it. */
function decode(el: HTMLElement) {
  const final = el.textContent ?? "";
  if (!final.trim()) return;
  el.setAttribute("aria-label", final);
  const n = final.length;
  const DUR = 700;
  const at = Array.from(final, (_, i) => (i / Math.max(n - 1, 1)) * DUR * 0.7 + Math.random() * DUR * 0.3);
  const t0 = performance.now();
  const step = (t: number) => {
    const e = t - t0;
    let out = "";
    for (let i = 0; i < n; i++) {
      const c = final[i];
      out += e >= at[i] || /[\s/·.:_\-—()]/.test(c) ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (e < DUR) requestAnimationFrame(step);
    else {
      el.textContent = final;
      el.removeAttribute("aria-label");
    }
  };
  requestAnimationFrame(step);
}

/**
 * Small page-wide motion details, mounted once in the layout:
 *  - section kickers (and anything marked data-decode) decode the first time they scroll into view,
 *  - every tile gets a cursor spotlight: one shared pointer listener sets --mx/--my on the tile under the cursor.
 * Both are skipped in Lite mode and with reduced motion; the spotlight only runs on fine pointers.
 */
export function MotionDetails() {
  useEffect(() => {
    if (reduced()) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          if (!isLite()) decode(e.target as HTMLElement);
        });
      },
      { threshold: 0.6 },
    );
    const watch = () =>
      document.querySelectorAll<HTMLElement>(".section-kicker, [data-decode]").forEach((el) => {
        if (el.dataset.decodeWatched) return;
        // Only plain text labels: never touch elements that hold other markup.
        if (el.childNodes.length === 1 && el.firstChild?.nodeType === Node.TEXT_NODE) {
          el.dataset.decodeWatched = "1";
          io.observe(el);
        }
      });
    watch();
    const later = window.setTimeout(watch, 2000); // sections that mount a little later

    let frame = 0;
    let last: { el: HTMLElement; x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element | null)?.closest?.(".tile") as HTMLElement | null;
      if (!el) return;
      last = { el, x: e.clientX, y: e.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!last) return;
        const r = last.el.getBoundingClientRect();
        last.el.style.setProperty("--mx", `${last.x - r.left}px`);
        last.el.style.setProperty("--my", `${last.y - r.top}px`);
      });
    };
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) document.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      io.disconnect();
      window.clearTimeout(later);
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
