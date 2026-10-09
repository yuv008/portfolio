"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const visibleRef = useRef(false);
  const [interactive, setInteractive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.body.dataset.cursor = "custom";

    let frame = 0;

    const animate = () => {
      const current = currentRef.current;
      const target = targetRef.current;
      const dx = target.x - current.x;
      const dy = target.y - current.y;

      if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) {
        current.x = target.x;
        current.y = target.y;
      } else {
        current.x += dx * 0.35;
        current.y += dy * 0.35;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }

      if (current.x !== target.x || current.y !== target.y) {
        frame = window.requestAnimationFrame(animate);
      } else {
        frame = 0;
      }
    };

    const updateTarget = (event: PointerEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };
      if (!visibleRef.current) {
        visibleRef.current = true;
        currentRef.current = { ...targetRef.current };
        setVisible(true);
      }
      if (!frame) frame = window.requestAnimationFrame(animate);
    };

    const updateInteractive = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const nextInteractive = Boolean(target?.closest("a, button, input, textarea, [data-cursor='interactive']"));
      setInteractive((current) => current === nextInteractive ? current : nextInteractive);
    };

    window.addEventListener("pointermove", updateTarget, { passive: true });
    window.addEventListener("pointerover", updateInteractive, { passive: true });
    window.addEventListener("pointerout", updateInteractive, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", updateTarget);
      window.removeEventListener("pointerover", updateInteractive);
      window.removeEventListener("pointerout", updateInteractive);
      delete document.body.dataset.cursor;
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[120] hidden h-10 w-10 rounded-full border border-neural-cyan/60 bg-transparent mix-blend-screen transition-[width,height,background-color,border-color,opacity] duration-200 md:block ${
          visible ? "opacity-100" : "opacity-0"
        } ${interactive ? "h-16 w-16 border-text-strong/60 bg-text-strong/10" : ""}`}
        style={{ transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)" }}
      />
      <div
        ref={dotRef}
        className={`pointer-events-none fixed left-0 top-0 z-[121] hidden h-2.5 w-2.5 rounded-full bg-neural-cyan transition-[background-color,opacity] duration-200 md:block ${
          visible ? "opacity-100" : "opacity-0"
        } ${interactive ? "bg-text-strong" : ""}`}
        style={{ transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)" }}
      />
    </>
  );
}
