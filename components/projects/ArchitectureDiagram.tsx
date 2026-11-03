"use client";

import { useMemo } from "react";
import type { ProjectEdge, ProjectNode } from "./projectData";

const TYPE_COLOR: Record<ProjectNode["type"], string> = {
  frontend: "#6ee7ff",
  backend: "#ab8aff",
  database: "#ffac5e",
  "vector-db": "#ffd166",
  ai: "#61ffab",
  feature: "#d1dce9",
  data: "#9fb0c3",
  process: "#ffd166",
  infra: "#ff7078",
};

type Placed = ProjectNode & { x: number; y: number; w: number; h: number; layer: number; lines: string[] };

/** Layer nodes left to right by shortest distance from the sources. Back-edges are ignored for layering. */
function layout(nodes: ProjectNode[], edges: ProjectEdge[], compact: boolean) {
  const incoming = new Map<string, number>();
  nodes.forEach((n) => incoming.set(n.id, 0));
  edges.forEach((e) => incoming.set(e.to, (incoming.get(e.to) ?? 0) + 1));

  const layer = new Map<string, number>();
  let queue = nodes.filter((n) => (incoming.get(n.id) ?? 0) === 0).map((n) => n.id);
  if (!queue.length && nodes[0]) queue = [nodes[0].id];
  queue.forEach((id) => layer.set(id, 0));
  while (queue.length) {
    const next: string[] = [];
    for (const id of queue) {
      for (const e of edges) {
        if (e.from === id && !layer.has(e.to)) {
          layer.set(e.to, (layer.get(id) ?? 0) + 1);
          next.push(e.to);
        }
      }
    }
    queue = next;
  }
  nodes.forEach((n) => {
    if (!layer.has(n.id)) layer.set(n.id, 0);
  });

  const w = compact ? 104 : 150;
  const h = compact ? 34 : 50;
  const colGap = compact ? 38 : 64;
  const rowGap = compact ? 14 : 22;

  const columns = new Map<number, ProjectNode[]>();
  nodes.forEach((n) => {
    const l = layer.get(n.id) ?? 0;
    columns.set(l, [...(columns.get(l) ?? []), n]);
  });
  const maxRows = Math.max(...Array.from(columns.values()).map((c) => c.length));
  const totalH = maxRows * h + (maxRows - 1) * rowGap;

  const placed: Placed[] = [];
  columns.forEach((col, l) => {
    const colH = col.length * h + (col.length - 1) * rowGap;
    col.forEach((n, i) => {
      const lines = n.label.split("\n");
      placed.push({
        ...n,
        w,
        h,
        layer: l,
        lines: compact ? [lines[0]] : lines,
        x: l * (w + colGap),
        y: (totalH - colH) / 2 + i * (h + rowGap),
      });
    });
  });
  const cols = Math.max(...Array.from(columns.keys())) + 1;
  return { placed, width: cols * w + (cols - 1) * colGap, height: totalH };
}

export function ArchitectureDiagram({
  nodes,
  edges,
  compact = false,
  className = "",
}: {
  nodes: ProjectNode[];
  edges: ProjectEdge[];
  compact?: boolean;
  className?: string;
}) {
  const { placed, width, height } = useMemo(() => layout(nodes, edges, compact), [nodes, edges, compact]);
  const byId = useMemo(() => new Map(placed.map((p) => [p.id, p])), [placed]);
  const pad = compact ? 14 : 24;
  const font = compact ? 10 : 12.5;

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="img"
      aria-label="Architecture diagram"
    >
      <style>{`
        .arch-flow { stroke-dasharray: 5 7; animation: arch-dash 1.6s linear infinite; }
        @keyframes arch-dash { to { stroke-dashoffset: -24; } }
        @media (prefers-reduced-motion: reduce) { .arch-flow { animation: none; } }
      `}</style>
      <defs>
        <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="rgba(171,138,255,0.9)" />
        </marker>
      </defs>

      {edges.map((e, i) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        const forward = b.x > a.x;
        const sx = forward ? a.x + a.w : a.x;
        const ex = forward ? b.x : b.x + b.w;
        const sy = a.y + a.h / 2;
        const ey = b.y + b.h / 2;
        let d: string;
        if (b.x === a.x) {
          // same column: loop out to the side
          const bulge = a.w * 0.55;
          d = `M ${a.x + a.w} ${sy} C ${a.x + a.w + bulge} ${sy}, ${a.x + a.w + bulge} ${ey}, ${b.x + b.w} ${ey}`;
        } else {
          const dx = Math.max(24, Math.abs(ex - sx) / 2);
          d = forward
            ? `M ${sx} ${sy} C ${sx + dx} ${sy}, ${ex - dx} ${ey}, ${ex} ${ey}`
            : `M ${sx} ${sy} C ${sx - dx} ${sy - 40}, ${ex + dx} ${ey - 40}, ${ex} ${ey}`;
        }
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="rgba(171,138,255,0.55)" strokeWidth={compact ? 1.2 : 1.6} markerEnd="url(#arch-arrow)" className="arch-flow" />
            {e.label && !compact && (
              <text x={(sx + ex) / 2} y={(sy + ey) / 2 - 6} fill="#7e8e9c" fontSize={10} textAnchor="middle">
                {e.label}
              </text>
            )}
          </g>
        );
      })}

      {placed.map((n) => {
        const c = TYPE_COLOR[n.type];
        return (
          <g key={n.id}>
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={n.h}
              rx={compact ? 8 : 12}
              fill="rgba(14,20,28,0.92)"
              stroke={c}
              strokeOpacity={0.7}
              strokeWidth={1.2}
            />
            <rect x={n.x} y={n.y + 6} width={3} height={n.h - 12} rx={1.5} fill={c} />
            {n.lines.map((line, i) => (
              <text
                key={i}
                x={n.x + n.w / 2 + 2}
                y={n.y + n.h / 2 + (i - (n.lines.length - 1) / 2) * (font + 2) + font / 3}
                fill="#e9f0f5"
                fontSize={font}
                textAnchor="middle"
                fontFamily="var(--font-display), monospace"
              >
                {line}
              </text>
            ))}
            {!compact && n.tooltip && <title>{n.tooltip}</title>}
          </g>
        );
      })}
    </svg>
  );
}

export const NODE_TYPE_COLORS = TYPE_COLOR;
