"use client";

import { useEffect, useState } from "react";

type Palette = {
  cyan: string;
  violet: string;
  amber: string;
  mist: string;
  green: string;
  surface: string;
};

const paletteVars: Record<keyof Palette, string> = {
  cyan: "--neural-cyan",
  violet: "--neural-violet",
  amber: "--neural-amber",
  mist: "--neural-mist",
  green: "--neural-green",
  surface: "--neural-surface-2",
};

const FALLBACK_PALETTE: Palette = {
  cyan: "rgb(230, 230, 230)",
  violet: "rgb(172, 172, 172)",
  amber: "rgb(205, 205, 205)",
  mist: "rgb(219, 219, 219)",
  green: "rgb(239, 239, 239)",
  surface: "rgb(25, 25, 25)",
};

function readPalette(): Palette {
  if (typeof window === "undefined") return FALLBACK_PALETTE;
  const styles = getComputedStyle(document.documentElement);

  const result = Object.entries(paletteVars).reduce((accumulator, [key, cssVar]) => {
    const raw = styles.getPropertyValue(cssVar).trim();
    // CSS vars are space-separated RGB: "110 231 255" → "rgb(110, 231, 255)"
    const value = raw ? raw.split(/\s+/).join(", ") : null;
    return {
      ...accumulator,
      [key]: value ? `rgb(${value})` : FALLBACK_PALETTE[key as keyof Palette],
    };
  }, {} as Palette);

  return result;
}

export function useThemePalette() {
  const [palette, setPalette] = useState<Palette>(FALLBACK_PALETTE);

  useEffect(() => {
    setPalette(readPalette());
  }, []);

  return palette;
}
