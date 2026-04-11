"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const [interactive, setInteractive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.body.dataset.cursor = "custom";

    let isMouseMoving = false;
    const updateTarget = (event: MouseEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };
      if (!visible) setVisible(true);
      isMouseMoving = true;
    };

    const updateInteractive = (event: Event) => {
      const target = event.target as HTMLElement | null;
      setInteractive(Boolean(target?.closest("a, button, input, textarea, [data-cursor='interactive']")));
    };

    const loop = () => {
      if (isMouseMoving) {
        const current = currentRef.current;
        const target = targetRef.current;

        current.x += (target.x - current.x) * 0.18;
        current.y += (target.y - current.y) * 0.18;
        currentRef.current = current;

        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
        }

        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
        }
      }

      frame = window.requestAnimationFrame(loop);
    };

    let frame = window.requestAnimationFrame(loop);

    window.addEventListener("mousemove", updateTarget, { passive: true });
    window.addEventListener("mouseover", updateInteractive, { passive: true });
    window.addEventListener("mouseout", updateInteractive, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", updateTarget);
      window.removeEventListener("mouseover", updateInteractive);
      window.removeEventListener("mouseout", updateInteractive);
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
