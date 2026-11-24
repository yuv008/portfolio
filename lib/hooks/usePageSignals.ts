"use client";

import { useEffect, useState } from "react";

type PageFlags = {
  isScrolled: boolean;
  nearBottom: boolean;
};

function flagsAt(scrollY: number, maxScroll: number): PageFlags {
  return {
    isScrolled: scrollY > 60,
    nearBottom: maxScroll > 0 && maxScroll - scrollY < 520,
  };
}

function getFlags(): PageFlags {
  if (typeof window === "undefined") {
    return { isScrolled: false, nearBottom: false };
  }
  return flagsAt(window.scrollY, document.documentElement.scrollHeight - window.innerHeight);
}

export function usePageSignals() {
  const [flags, setFlags] = useState(getFlags);

  useEffect(() => {
    // The page height only changes when the content or the window resizes, so it is cached instead of being read
    // on every scroll (reading it forces a layout). The scroll position is read in the scroll event itself, before
    // any animation-frame code has written styles, so it never forces an extra style recalculation.
    let maxScroll = 0;
    let last = flags;

    const update = () => {
      const next = flagsAt(window.scrollY, maxScroll);
      if (next.isScrolled === last.isScrolled && next.nearBottom === last.nearBottom) return;
      last = next;
      setFlags(next);
    };
    const measure = () => {
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      update();
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
    };
    // Runs once; `flags` only seeds the comparison.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return flags;
}
