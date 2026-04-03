"use client";

import { useEffect, useMemo, useState } from "react";

type ScrollSpyItem = {
  id: string;
  spyIds?: string[];
};

const THRESHOLDS = Array.from({ length: 11 }, (_, index) => index / 10);

export function useScrollSpy(items: ScrollSpyItem[]) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  const sectionToItem = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((item) => {
      (item.spyIds ?? [item.id]).forEach((spyId) => {
        map.set(spyId, item.id);
      });
    });
    return map;
  }, [items]);

  useEffect(() => {
    if (!items.length) return;

    const ratios = new Map<string, number>();
    const observedSections = Array.from(sectionToItem.keys())
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => Boolean(section));

    const updateActive = () => {
      const scores = items.map((item) => {
        const score = Math.max(
          ...(item.spyIds ?? [item.id]).map((spyId) => ratios.get(spyId) ?? 0),
        );

        return { id: item.id, score };
      });

      const visible = scores
        .filter((entry) => entry.score > 0)
        .sort((left, right) => right.score - left.score);

      if (visible[0]) {
        setActiveId(visible[0].id);
        return;
      }

      const scrollY = window.scrollY + window.innerHeight * 0.4;
      const fallback = observedSections
        .map((section) => ({
          id: sectionToItem.get(section.id) ?? items[0].id,
          top: section.offsetTop,
        }))
        .filter((entry, index, array) => array.findIndex((candidate) => candidate.id === entry.id) === index)
        .sort((left, right) => left.top - right.top)
        .filter((entry) => entry.top <= scrollY)
        .at(-1);

      if (fallback) {
        setActiveId(fallback.id);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        updateActive();
      },
      {
        threshold: THRESHOLDS,
        rootMargin: "-18% 0px -48% 0px",
      },
    );

    observedSections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActive);
    };
  }, [items, sectionToItem]);

  return activeId;
}
