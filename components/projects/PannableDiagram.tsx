"use client";

import { useRef } from "react";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import type { Project } from "./projectData";

/** The full, labelled diagram at a readable size. It can be wider than its box, so it pans: drag, swipe or scroll sideways. */
export function PannableDiagram({ project, height = 230, className = "mt-3" }: { project: Project; height?: number; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  return (
    <div className={`relative rounded-2xl ${className}`} style={{ background: "rgba(12,12,12,0.7)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div
        ref={box}
        className="cursor-grab overflow-x-auto overflow-y-hidden p-3 active:cursor-grabbing [scrollbar-width:thin]"
        style={{ maskImage: "linear-gradient(to right, #000 88%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, #000 88%, transparent 100%)" }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && box.current) drag.current = { x: e.clientX, left: box.current.scrollLeft };
        }}
        onPointerMove={(e) => {
          if (drag.current && box.current) box.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
      >
        <ArchitectureDiagram nodes={project.architecture.nodes} edges={project.architecture.edges} className="w-auto max-w-none select-none" style={{ height }} />
      </div>
      <p className="pointer-events-none absolute bottom-1.5 right-4 text-[9px] uppercase tracking-[0.16em] text-text-muted" style={{ fontFamily: "var(--font-display), monospace" }}>
        Drag to explore →
      </p>
    </div>
  );
}
