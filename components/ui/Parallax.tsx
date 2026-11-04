"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { registerParallax } from "@/lib/parallax";

/** Fills its (clipped, positioned) parent and drifts slightly slower than it, so a picture has depth inside its frame. */
export function ParallaxMedia({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    return el && el.parentElement ? registerParallax(el, el.parentElement, "media") : undefined;
  }, []);
  return (
    <div ref={ref} className="absolute inset-0">
      {children}
    </div>
  );
}

/** Lets a grid tile drift a little differently from its neighbours. factor is -1, 0 or 1. */
export function useStagger(ref: RefObject<HTMLElement | null>, factor: number) {
  useEffect(() => {
    const el = ref.current;
    return el && el.parentElement ? registerParallax(el, el.parentElement, "stagger", factor) : undefined;
  }, [ref, factor]);
}
