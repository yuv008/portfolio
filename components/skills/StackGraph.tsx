"use client";

import { useEffect, useRef } from "react";
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from "d3-force-3d";
import { STACK_HUBS } from "@/lib/stack";
import { isLite } from "@/lib/lite";

type GNode = {
  id: string;
  hub: boolean;
  hubId?: string; // for hubs: their id
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
};
type GLink = { source: string | GNode; target: string | GNode; bend: number };

/** Build the node/edge lists from the stack data. A skill under two hubs becomes one node with two edges. */
function build() {
  const nodes: GNode[] = [];
  const links: GLink[] = [];
  const index = new Map<string, GNode>();
  const add = (id: string, hub: boolean, hubId?: string) => {
    if (index.has(id)) return index.get(id)!;
    const a = Math.random() * Math.PI * 2;
    const r = hub ? 90 : 200;
    const n: GNode = { id, hub, hubId, x: Math.cos(a) * r, y: Math.sin(a) * r };
    index.set(id, n);
    nodes.push(n);
    return n;
  };
  STACK_HUBS.forEach((h) => add(`hub:${h.id}`, true, h.id));
  STACK_HUBS.forEach((h, hi) => {
    h.skills.forEach((s, si) => {
      add(s, false);
      links.push({ source: `hub:${h.id}`, target: s, bend: ((hi + si) % 2 ? 1 : -1) * 0.14 });
    });
  });
  return { nodes, links };
}

/**
 * Interactive skill graph: category hubs, skill nodes, hairline curved edges and drifting dust.
 * `focus` is a hub id or a skill name that should be lit; hovering a node reports it through onFocus.
 */
export function StackGraph({
  focus,
  onFocus,
  height = 560,
}: {
  focus: string | null;
  onFocus: (v: string | null) => void;
  height?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const focusRef = useRef<string | null>(focus);
  const onFocusRef = useRef(onFocus);
  const drawRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    focusRef.current = focus;
    drawRef.current();
  }, [focus]);
  useEffect(() => {
    onFocusRef.current = onFocus;
  }, [onFocus]);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { nodes, links } = build();
    const byId = new Map(nodes.map((n) => [n.id, n]));
    // which hub ids each node belongs to (skills) or is (hubs)
    const memberOf = new Map<string, Set<string>>();
    STACK_HUBS.forEach((h) => {
      memberOf.set(`hub:${h.id}`, new Set([h.id]));
      h.skills.forEach((s) => {
        const set = memberOf.get(s) ?? new Set<string>();
        set.add(h.id);
        memberOf.set(s, set);
      });
    });

    // Narrow screens get a taller, tighter layout so labels stay readable.
    const narrow = el.clientWidth < 640;
    const sim = forceSimulation(nodes as never)
      .numDimensions(2)
      .force("charge", forceManyBody().strength((n: GNode) => (n.hub ? (narrow ? -260 : -520) : narrow ? -50 : -90)))
      .force(
        "link",
        forceLink(links as never)
          .id((n: GNode) => n.id)
          .distance(narrow ? 62 : 105)
          .strength(0.55),
      )
      .force("collide", forceCollide((n: GNode) => (n.hub ? (narrow ? 34 : 54) : (narrow ? 14 : 18) + n.id.length * (narrow ? 1.9 : 2.1))))
      .force("x", forceX(0).strength(narrow ? 0.16 : 0.045))
      .force("y", forceY(0).strength(narrow ? 0.02 : 0.075))
      .alphaDecay(0.02)
      .stop();
    for (let i = 0; i < 320; i++) sim.tick(); // settle before the first paint

    // Fit the settled layout to the canvas (with room for labels).
    const bb = (() => {
      const xs = nodes.map((n) => n.x);
      const ys = nodes.map((n) => n.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, w: maxX - minX + 150, h: maxY - minY + 80 };
    })();

    // ambient dust
    const dust = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      s: Math.random() * 0.00006 + 0.00002,
      a: Math.random() * 0.35 + 0.1,
    }));

    let w = 0;
    let h = 0;
    let dpr = 1;
    let hover: GNode | null = null;
    let dragging: GNode | null = null;
    let raf = 0;
    let visible = false;
    let last = performance.now();

    const isCompact = () => w < 640;
    const scale = () => Math.min((w * 0.96) / bb.w, (h * 0.96) / bb.h, 1.15);
    const toScreen = (n: GNode) => ({ x: w / 2 + (n.x - bb.cx) * scale(), y: h / 2 + (n.y - bb.cy) * scale() });

    const lit = (n: GNode, f: string | null) => {
      if (!f) return true;
      const m = memberOf.get(n.id);
      if (!m) return false;
      if (STACK_HUBS.some((hub) => hub.id === f)) return m.has(f);
      // focus is a skill: light that skill and the hubs it belongs to
      const fm = memberOf.get(f);
      return n.id === f || (n.hub && !!fm && fm.has(n.hubId as string));
    };

    function draw() {
      if (!w) return;
      const f = focusRef.current;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);

      // dust
      const t = performance.now();
      for (const d of dust) {
        const x = ((d.x + t * d.s) % 1) * w;
        const y = ((d.y + Math.sin(t * d.s * 20 + d.a * 9) * 0.01) % 1) * h;
        ctx!.fillStyle = `rgba(190,205,225,${d.a * 0.5})`;
        ctx!.beginPath();
        ctx!.arc(x, y, d.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // edges
      for (const l of links) {
        const a = l.source as GNode;
        const b = l.target as GNode;
        const pa = toScreen(a);
        const pb = toScreen(b);
        const on = !f || (lit(a, f) && lit(b, f));
        const mx = (pa.x + pb.x) / 2 + (pb.y - pa.y) * l.bend;
        const my = (pa.y + pb.y) / 2 - (pb.x - pa.x) * l.bend;
        ctx!.beginPath();
        ctx!.moveTo(pa.x, pa.y);
        ctx!.quadraticCurveTo(mx, my, pb.x, pb.y);
        ctx!.strokeStyle = f && on ? "rgba(110,231,255,0.7)" : on ? "rgba(190,205,225,0.2)" : "rgba(190,205,225,0.05)";
        ctx!.lineWidth = f && on ? 1.2 : 1;
        ctx!.stroke();
      }

      // nodes + labels
      for (const n of nodes) {
        const p = toScreen(n);
        const on = lit(n, f);
        const isHover = hover === n;
        const r = n.hub ? 7 : 3.6;
        ctx!.globalAlpha = on ? 1 : 0.28;
        ctx!.fillStyle = n.hub ? "#e9f0f5" : isHover ? "#6ee7ff" : "#9fb0c3";
        if (f && on && !n.hub) ctx!.fillStyle = "#6ee7ff";
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx!.fill();
        if (n.hub) {
          ctx!.strokeStyle = "rgba(110,231,255,0.45)";
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, r + 5, 0, Math.PI * 2);
          ctx!.stroke();
        }
        const label = n.hub ? STACK_HUBS.find((x) => x.id === n.hubId)!.label : n.id;
        ctx!.font = n.hub
          ? `600 ${isCompact() ? 12 : 14}px var(--font-display), monospace`
          : `${isCompact() ? 10 : 11}px var(--font-body), sans-serif`;
        ctx!.fillStyle = n.hub ? "#e9f0f5" : on && f ? "#cfeaf5" : "rgba(160,176,196,0.9)";
        ctx!.textAlign = "center";
        ctx!.textBaseline = "top";
        ctx!.fillText(label, p.x, p.y + r + (n.hub ? 9 : 5));
        ctx!.globalAlpha = 1;
      }
    }
    drawRef.current = draw;

    function frame(now: number) {
      raf = 0;
      if (!visible) return;
      const dt = now - last;
      last = now;
      const still = reduce || isLite();
      if (!still) {
        // keep the layout gently alive
        if (sim.alpha() < 0.04) sim.alpha(0.04);
        sim.tick();
      }
      draw();
      void dt;
      if (!still || dragging) raf = requestAnimationFrame(frame);
    }
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    function resize() {
      w = el!.clientWidth;
      h = height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv!.width = Math.round(w * dpr);
      cv!.height = Math.round(h * dpr);
      cv!.style.width = `${w}px`;
      cv!.style.height = `${h}px`;
      draw();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const pick = (ev: PointerEvent): GNode | null => {
      const r = cv!.getBoundingClientRect();
      const x = ev.clientX - r.left;
      const y = ev.clientY - r.top;
      let best: GNode | null = null;
      let bd = 18;
      for (const n of nodes) {
        const p = toScreen(n);
        const d = Math.hypot(p.x - x, p.y - y);
        if (d < bd) {
          bd = d;
          best = n;
        }
      }
      return best;
    };
    const toSim = (ev: PointerEvent) => {
      const r = cv!.getBoundingClientRect();
      return { x: (ev.clientX - r.left - w / 2) / scale() + bb.cx, y: (ev.clientY - r.top - h / 2) / scale() + bb.cy };
    };
    const setHover = (n: GNode | null) => {
      if (hover === n) return;
      hover = n;
      cv!.style.cursor = n ? "grab" : "default";
      onFocusRef.current(n ? (n.hub ? (n.hubId as string) : n.id) : null);
      kick();
      draw();
    };
    const onMove = (ev: PointerEvent) => {
      if (dragging) {
        const p = toSim(ev);
        dragging.fx = p.x;
        dragging.fy = p.y;
        sim.alpha(0.3);
        kick();
        return;
      }
      setHover(pick(ev));
    };
    const onDown = (ev: PointerEvent) => {
      const n = pick(ev);
      if (!n) return;
      dragging = n;
      cv!.setPointerCapture(ev.pointerId);
      cv!.style.cursor = "grabbing";
      const p = toSim(ev);
      n.fx = p.x;
      n.fy = p.y;
      sim.alpha(0.3);
      kick();
    };
    const onUp = (ev: PointerEvent) => {
      if (!dragging) return;
      dragging.fx = null;
      dragging.fy = null;
      dragging = null;
      cv!.releasePointerCapture(ev.pointerId);
      cv!.style.cursor = hover ? "grab" : "default";
      kick();
    };
    const onLeave = () => {
      if (!dragging) setHover(null);
    };
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onUp);
    cv.addEventListener("pointerleave", onLeave);

    // only animate while on screen
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) {
          last = performance.now();
          kick();
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);

    void byId;
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      sim.stop();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointercancel", onUp);
      cv.removeEventListener("pointerleave", onLeave);
    };
  }, [height]);

  return (
    <div ref={wrap} className="relative w-full" style={{ height }}>
      <canvas ref={canvas} aria-hidden="true" className="block select-none" style={{ touchAction: "pan-y" }} />
    </div>
  );
}
