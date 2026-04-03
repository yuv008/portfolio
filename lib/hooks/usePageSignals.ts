"use client";

import { useEffect, useState } from "react";

function getSignals() {
  if (typeof window === "undefined") {
    return { scrollY: 0, progress: 0, nearBottom: false };
  }

  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
  const nearBottom = maxScroll > 0 && maxScroll - scrollY < 520;

  return { scrollY, progress, nearBottom };
}

export function usePageSignals() {
  const [signals, setSignals] = useState(getSignals);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setSignals(getSignals());
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return signals;
}
