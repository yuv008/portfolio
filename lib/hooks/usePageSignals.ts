"use client";

import { useEffect, useState } from "react";

type PageFlags = {
  isScrolled: boolean;
  nearBottom: boolean;
};

function getFlags(): PageFlags {
  if (typeof window === "undefined") {
    return { isScrolled: false, nearBottom: false };
  }

  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  return {
    isScrolled: scrollY > 60,
    nearBottom: maxScroll > 0 && maxScroll - scrollY < 520,
  };
}

export function usePageSignals() {
  const [flags, setFlags] = useState(getFlags);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const nextFlags = getFlags();
        setFlags((current) =>
          current.isScrolled === nextFlags.isScrolled && current.nearBottom === nextFlags.nearBottom
            ? current
            : nextFlags,
        );
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return flags;
}
