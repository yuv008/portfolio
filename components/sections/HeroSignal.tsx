"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NeuralNode {
  id: string;
  layer: number;
  indexInLayer: number;
  x: number;
  y: number;
  r: number;
  label?: string;
  isOutput?: boolean;
}

interface NeuralEdge {
  fromId: string;
  toId: string;
  fromLayer: number;
  skipSpan?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function bezier(x1: number, y1: number, x2: number, y2: number, t = 0.44): string {
  const dx = (x2 - x1) * t;
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
}

/** Stable pseudo-random float [0,1] for a node id — consistent across renders */
function stableVal(id: string): string {
  let h = 5381;
  for (let i = 0; i < id.length; i++) h = ((h << 5) + h) ^ id.charCodeAt(i);
  return (Math.abs(h % 100) / 100).toFixed(2);
}

// ─── Desktop: 6 layers, 33 nodes ──────────────────────────────────────────────

const D_SVG_W = 900;
const D_SVG_H = 282;
const D_LAYER_XS     = [70, 222, 390, 558, 718, 856];
const D_LAYER_LABELS = ["INPUT", "EMBED", "HIDDEN", "DECODE", "REFINE", "OUTPUT"];

const D_NODES: NeuralNode[] = [
  { id:"L0-N0", layer:0, indexInLayer:0, x:68,  y:52,  r:6,  label:"audio" },
  { id:"L0-N1", layer:0, indexInLayer:1, x:73,  y:116, r:6,  label:"query" },
  { id:"L0-N2", layer:0, indexInLayer:2, x:67,  y:180, r:6,  label:"context" },
  { id:"L0-N3", layer:0, indexInLayer:3, x:71,  y:238, r:5,  label:"signal" },

  { id:"L1-N0", layer:1, indexInLayer:0, x:218, y:22,  r:5 },
  { id:"L1-N1", layer:1, indexInLayer:1, x:226, y:58,  r:6 },
  { id:"L1-N2", layer:1, indexInLayer:2, x:220, y:90,  r:5 },
  { id:"L1-N3", layer:1, indexInLayer:3, x:225, y:124, r:7 },
  { id:"L1-N4", layer:1, indexInLayer:4, x:218, y:158, r:5 },
  { id:"L1-N5", layer:1, indexInLayer:5, x:224, y:196, r:6 },
  { id:"L1-N6", layer:1, indexInLayer:6, x:217, y:252, r:5 },

  { id:"L2-N0", layer:2, indexInLayer:0, x:385, y:16,  r:5 },
  { id:"L2-N1", layer:2, indexInLayer:1, x:394, y:48,  r:6 },
  { id:"L2-N2", layer:2, indexInLayer:2, x:387, y:80,  r:5 },
  { id:"L2-N3", layer:2, indexInLayer:3, x:395, y:110, r:7 },
  { id:"L2-N4", layer:2, indexInLayer:4, x:386, y:142, r:5 },
  { id:"L2-N5", layer:2, indexInLayer:5, x:393, y:174, r:6 },
  { id:"L2-N6", layer:2, indexInLayer:6, x:385, y:210, r:5 },
  { id:"L2-N7", layer:2, indexInLayer:7, x:392, y:256, r:6 },

  { id:"L3-N0", layer:3, indexInLayer:0, x:554, y:24,  r:6 },
  { id:"L3-N1", layer:3, indexInLayer:1, x:562, y:62,  r:5 },
  { id:"L3-N2", layer:3, indexInLayer:2, x:556, y:98,  r:7 },
  { id:"L3-N3", layer:3, indexInLayer:3, x:563, y:134, r:5 },
  { id:"L3-N4", layer:3, indexInLayer:4, x:556, y:170, r:6 },
  { id:"L3-N5", layer:3, indexInLayer:5, x:562, y:212, r:5 },
  { id:"L3-N6", layer:3, indexInLayer:6, x:554, y:250, r:6 },

  { id:"L4-N0", layer:4, indexInLayer:0, x:714, y:58,  r:6 },
  { id:"L4-N1", layer:4, indexInLayer:1, x:722, y:108, r:7 },
  { id:"L4-N2", layer:4, indexInLayer:2, x:715, y:156, r:6 },
  { id:"L4-N3", layer:4, indexInLayer:3, x:722, y:206, r:5 },
  { id:"L4-N4", layer:4, indexInLayer:4, x:714, y:248, r:6 },

  { id:"L5-N0", layer:5, indexInLayer:0, x:856, y:114, r:7, label:"speech",  isOutput:true },
  { id:"L5-N1", layer:5, indexInLayer:1, x:856, y:200, r:7, label:"insight", isOutput:true },
];

const D_EDGES: NeuralEdge[] = [
  // 0→1
  {fromId:"L0-N0",toId:"L1-N0",fromLayer:0},{fromId:"L0-N0",toId:"L1-N1",fromLayer:0},{fromId:"L0-N0",toId:"L1-N2",fromLayer:0},{fromId:"L0-N0",toId:"L1-N3",fromLayer:0},
  {fromId:"L0-N1",toId:"L1-N1",fromLayer:0},{fromId:"L0-N1",toId:"L1-N2",fromLayer:0},{fromId:"L0-N1",toId:"L1-N3",fromLayer:0},{fromId:"L0-N1",toId:"L1-N4",fromLayer:0},{fromId:"L0-N1",toId:"L1-N5",fromLayer:0},
  {fromId:"L0-N2",toId:"L1-N2",fromLayer:0},{fromId:"L0-N2",toId:"L1-N3",fromLayer:0},{fromId:"L0-N2",toId:"L1-N4",fromLayer:0},{fromId:"L0-N2",toId:"L1-N5",fromLayer:0},{fromId:"L0-N2",toId:"L1-N6",fromLayer:0},
  {fromId:"L0-N3",toId:"L1-N3",fromLayer:0},{fromId:"L0-N3",toId:"L1-N4",fromLayer:0},{fromId:"L0-N3",toId:"L1-N5",fromLayer:0},{fromId:"L0-N3",toId:"L1-N6",fromLayer:0},
  // 1→2
  {fromId:"L1-N0",toId:"L2-N0",fromLayer:1},{fromId:"L1-N0",toId:"L2-N1",fromLayer:1},{fromId:"L1-N0",toId:"L2-N2",fromLayer:1},
  {fromId:"L1-N1",toId:"L2-N0",fromLayer:1},{fromId:"L1-N1",toId:"L2-N1",fromLayer:1},{fromId:"L1-N1",toId:"L2-N2",fromLayer:1},{fromId:"L1-N1",toId:"L2-N3",fromLayer:1},
  {fromId:"L1-N2",toId:"L2-N1",fromLayer:1},{fromId:"L1-N2",toId:"L2-N2",fromLayer:1},{fromId:"L1-N2",toId:"L2-N3",fromLayer:1},{fromId:"L1-N2",toId:"L2-N4",fromLayer:1},
  {fromId:"L1-N3",toId:"L2-N2",fromLayer:1},{fromId:"L1-N3",toId:"L2-N3",fromLayer:1},{fromId:"L1-N3",toId:"L2-N4",fromLayer:1},{fromId:"L1-N3",toId:"L2-N5",fromLayer:1},
  {fromId:"L1-N4",toId:"L2-N3",fromLayer:1},{fromId:"L1-N4",toId:"L2-N4",fromLayer:1},{fromId:"L1-N4",toId:"L2-N5",fromLayer:1},{fromId:"L1-N4",toId:"L2-N6",fromLayer:1},
  {fromId:"L1-N5",toId:"L2-N4",fromLayer:1},{fromId:"L1-N5",toId:"L2-N5",fromLayer:1},{fromId:"L1-N5",toId:"L2-N6",fromLayer:1},{fromId:"L1-N5",toId:"L2-N7",fromLayer:1},
  {fromId:"L1-N6",toId:"L2-N5",fromLayer:1},{fromId:"L1-N6",toId:"L2-N6",fromLayer:1},{fromId:"L1-N6",toId:"L2-N7",fromLayer:1},
  // 2→3
  {fromId:"L2-N0",toId:"L3-N0",fromLayer:2},{fromId:"L2-N0",toId:"L3-N1",fromLayer:2},
  {fromId:"L2-N1",toId:"L3-N0",fromLayer:2},{fromId:"L2-N1",toId:"L3-N1",fromLayer:2},{fromId:"L2-N1",toId:"L3-N2",fromLayer:2},
  {fromId:"L2-N2",toId:"L3-N1",fromLayer:2},{fromId:"L2-N2",toId:"L3-N2",fromLayer:2},{fromId:"L2-N2",toId:"L3-N3",fromLayer:2},
  {fromId:"L2-N3",toId:"L3-N1",fromLayer:2},{fromId:"L2-N3",toId:"L3-N2",fromLayer:2},{fromId:"L2-N3",toId:"L3-N3",fromLayer:2},{fromId:"L2-N3",toId:"L3-N4",fromLayer:2},
  {fromId:"L2-N4",toId:"L3-N2",fromLayer:2},{fromId:"L2-N4",toId:"L3-N3",fromLayer:2},{fromId:"L2-N4",toId:"L3-N4",fromLayer:2},
  {fromId:"L2-N5",toId:"L3-N3",fromLayer:2},{fromId:"L2-N5",toId:"L3-N4",fromLayer:2},{fromId:"L2-N5",toId:"L3-N5",fromLayer:2},
  {fromId:"L2-N6",toId:"L3-N4",fromLayer:2},{fromId:"L2-N6",toId:"L3-N5",fromLayer:2},{fromId:"L2-N6",toId:"L3-N6",fromLayer:2},
  {fromId:"L2-N7",toId:"L3-N5",fromLayer:2},{fromId:"L2-N7",toId:"L3-N6",fromLayer:2},
  // 3→4
  {fromId:"L3-N0",toId:"L4-N0",fromLayer:3},{fromId:"L3-N0",toId:"L4-N1",fromLayer:3},
  {fromId:"L3-N1",toId:"L4-N0",fromLayer:3},{fromId:"L3-N1",toId:"L4-N1",fromLayer:3},{fromId:"L3-N1",toId:"L4-N2",fromLayer:3},
  {fromId:"L3-N2",toId:"L4-N0",fromLayer:3},{fromId:"L3-N2",toId:"L4-N1",fromLayer:3},{fromId:"L3-N2",toId:"L4-N2",fromLayer:3},
  {fromId:"L3-N3",toId:"L4-N1",fromLayer:3},{fromId:"L3-N3",toId:"L4-N2",fromLayer:3},{fromId:"L3-N3",toId:"L4-N3",fromLayer:3},
  {fromId:"L3-N4",toId:"L4-N1",fromLayer:3},{fromId:"L3-N4",toId:"L4-N2",fromLayer:3},{fromId:"L3-N4",toId:"L4-N3",fromLayer:3},
  {fromId:"L3-N5",toId:"L4-N2",fromLayer:3},{fromId:"L3-N5",toId:"L4-N3",fromLayer:3},{fromId:"L3-N5",toId:"L4-N4",fromLayer:3},
  {fromId:"L3-N6",toId:"L4-N3",fromLayer:3},{fromId:"L3-N6",toId:"L4-N4",fromLayer:3},
  // 4→5
  {fromId:"L4-N0",toId:"L5-N0",fromLayer:4},{fromId:"L4-N0",toId:"L5-N1",fromLayer:4},
  {fromId:"L4-N1",toId:"L5-N0",fromLayer:4},{fromId:"L4-N1",toId:"L5-N1",fromLayer:4},
  {fromId:"L4-N2",toId:"L5-N0",fromLayer:4},{fromId:"L4-N2",toId:"L5-N1",fromLayer:4},
  {fromId:"L4-N3",toId:"L5-N0",fromLayer:4},{fromId:"L4-N3",toId:"L5-N1",fromLayer:4},
  {fromId:"L4-N4",toId:"L5-N0",fromLayer:4},{fromId:"L4-N4",toId:"L5-N1",fromLayer:4},
  // skip span-2
  {fromId:"L0-N0",toId:"L2-N0",fromLayer:0,skipSpan:2},{fromId:"L0-N3",toId:"L2-N7",fromLayer:0,skipSpan:2},
  {fromId:"L1-N0",toId:"L3-N0",fromLayer:1,skipSpan:2},{fromId:"L1-N3",toId:"L3-N3",fromLayer:1,skipSpan:2},{fromId:"L1-N6",toId:"L3-N6",fromLayer:1,skipSpan:2},
  {fromId:"L2-N0",toId:"L4-N0",fromLayer:2,skipSpan:2},{fromId:"L2-N4",toId:"L4-N2",fromLayer:2,skipSpan:2},{fromId:"L2-N7",toId:"L4-N4",fromLayer:2,skipSpan:2},
  {fromId:"L3-N0",toId:"L5-N0",fromLayer:3,skipSpan:2},{fromId:"L3-N6",toId:"L5-N1",fromLayer:3,skipSpan:2},
  // skip span-3
  {fromId:"L0-N1",toId:"L3-N3",fromLayer:0,skipSpan:3},{fromId:"L1-N0",toId:"L4-N0",fromLayer:1,skipSpan:3},{fromId:"L2-N3",toId:"L5-N0",fromLayer:2,skipSpan:3},
];

// ─── Mobile: 4 layers ─────────────────────────────────────────────────────────

const M_SVG_W = 430;
const M_SVG_H = 200;
const M_LAYER_XS     = [40, 146, 284, 400];
const M_LAYER_LABELS = ["INPUT", "EMBED", "PROCESS", "OUTPUT"];

const M_NODES: NeuralNode[] = [
  { id:"L0-N0", layer:0, indexInLayer:0, x:38,  y:44,  r:5,  label:"audio" },
  { id:"L0-N1", layer:0, indexInLayer:1, x:43,  y:100, r:5,  label:"query" },
  { id:"L0-N2", layer:0, indexInLayer:2, x:38,  y:156, r:5,  label:"ctx" },

  { id:"L1-N0", layer:1, indexInLayer:0, x:142, y:18,  r:4 },
  { id:"L1-N1", layer:1, indexInLayer:1, x:149, y:52,  r:5 },
  { id:"L1-N2", layer:1, indexInLayer:2, x:143, y:84,  r:4 },
  { id:"L1-N3", layer:1, indexInLayer:3, x:150, y:118, r:5 },
  { id:"L1-N4", layer:1, indexInLayer:4, x:143, y:152, r:4 },
  { id:"L1-N5", layer:1, indexInLayer:5, x:148, y:180, r:4 },

  { id:"L2-N0", layer:2, indexInLayer:0, x:280, y:22,  r:5 },
  { id:"L2-N1", layer:2, indexInLayer:1, x:287, y:56,  r:4 },
  { id:"L2-N2", layer:2, indexInLayer:2, x:281, y:90,  r:5 },
  { id:"L2-N3", layer:2, indexInLayer:3, x:288, y:124, r:4 },
  { id:"L2-N4", layer:2, indexInLayer:4, x:281, y:158, r:5 },
  { id:"L2-N5", layer:2, indexInLayer:5, x:286, y:184, r:4 },

  { id:"L3-N0", layer:3, indexInLayer:0, x:400, y:84,  r:6,  label:"speech",  isOutput:true },
  { id:"L3-N1", layer:3, indexInLayer:1, x:400, y:140, r:6,  label:"insight", isOutput:true },
];

const M_EDGES: NeuralEdge[] = [
  {fromId:"L0-N0",toId:"L1-N0",fromLayer:0},{fromId:"L0-N0",toId:"L1-N1",fromLayer:0},{fromId:"L0-N0",toId:"L1-N2",fromLayer:0},
  {fromId:"L0-N1",toId:"L1-N1",fromLayer:0},{fromId:"L0-N1",toId:"L1-N2",fromLayer:0},{fromId:"L0-N1",toId:"L1-N3",fromLayer:0},{fromId:"L0-N1",toId:"L1-N4",fromLayer:0},
  {fromId:"L0-N2",toId:"L1-N2",fromLayer:0},{fromId:"L0-N2",toId:"L1-N3",fromLayer:0},{fromId:"L0-N2",toId:"L1-N4",fromLayer:0},{fromId:"L0-N2",toId:"L1-N5",fromLayer:0},
  {fromId:"L1-N0",toId:"L2-N0",fromLayer:1},{fromId:"L1-N0",toId:"L2-N1",fromLayer:1},
  {fromId:"L1-N1",toId:"L2-N0",fromLayer:1},{fromId:"L1-N1",toId:"L2-N1",fromLayer:1},{fromId:"L1-N2",toId:"L2-N1",fromLayer:1},
  {fromId:"L1-N2",toId:"L2-N2",fromLayer:1},{fromId:"L1-N2",toId:"L2-N3",fromLayer:1},
  {fromId:"L1-N3",toId:"L2-N2",fromLayer:1},{fromId:"L1-N3",toId:"L2-N3",fromLayer:1},{fromId:"L1-N3",toId:"L2-N4",fromLayer:1},
  {fromId:"L1-N4",toId:"L2-N3",fromLayer:1},{fromId:"L1-N4",toId:"L2-N4",fromLayer:1},{fromId:"L1-N4",toId:"L2-N5",fromLayer:1},
  {fromId:"L1-N5",toId:"L2-N4",fromLayer:1},{fromId:"L1-N5",toId:"L2-N5",fromLayer:1},
  {fromId:"L2-N0",toId:"L3-N0",fromLayer:2},{fromId:"L2-N1",toId:"L3-N0",fromLayer:2},
  {fromId:"L2-N2",toId:"L3-N0",fromLayer:2},{fromId:"L2-N2",toId:"L3-N1",fromLayer:2},
  {fromId:"L2-N3",toId:"L3-N0",fromLayer:2},{fromId:"L2-N3",toId:"L3-N1",fromLayer:2},
  {fromId:"L2-N4",toId:"L3-N0",fromLayer:2},{fromId:"L2-N4",toId:"L3-N1",fromLayer:2},
  {fromId:"L2-N5",toId:"L3-N1",fromLayer:2},
  {fromId:"L0-N0",toId:"L2-N0",fromLayer:0,skipSpan:2},{fromId:"L0-N2",toId:"L2-N5",fromLayer:0,skipSpan:2},
  {fromId:"L1-N0",toId:"L3-N0",fromLayer:1,skipSpan:2},{fromId:"L1-N5",toId:"L3-N1",fromLayer:1,skipSpan:2},
  {fromId:"L0-N1",toId:"L3-N0",fromLayer:0,skipSpan:3},
];

// ─── Animation timing ─────────────────────────────────────────────────────────

const D_LAYER_DELAYS = [0, 360, 720, 1080, 1400, 1680];
const D_EDGE_DELAYS  = [155, 510, 870, 1230, 1540];
const M_LAYER_DELAYS = [0, 400, 800, 1160];
const M_EDGE_DELAYS  = [175, 575, 975];
const EDGE_DURATION  = 280;
const WAVE_TOTAL     = 2100;
const WAVE_PAUSE     = 1600;
const MOUNT_DELAY    = 700;
const PROXIMITY_R    = 90; // SVG units for proximity glow

// ─── NeuralNet component ──────────────────────────────────────────────────────

function NeuralNet({ isMobile }: { isMobile: boolean }) {
  const nodes        = isMobile ? M_NODES        : D_NODES;
  const edges        = isMobile ? M_EDGES        : D_EDGES;
  const svgW         = isMobile ? M_SVG_W        : D_SVG_W;
  const svgH         = isMobile ? M_SVG_H        : D_SVG_H;
  const layerXs      = isMobile ? M_LAYER_XS     : D_LAYER_XS;
  const layerLabels  = isMobile ? M_LAYER_LABELS : D_LAYER_LABELS;
  const layerDelays  = isMobile ? M_LAYER_DELAYS : D_LAYER_DELAYS;
  const edgeDelays   = isMobile ? M_EDGE_DELAYS  : D_EDGE_DELAYS;
  const layerCount   = layerLabels.length;

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  // ── Animation state ──
  const [activeLayer, setActiveLayer]           = useState<number | null>(null);
  const [activeEdgeLayers, setActiveEdgeLayers] = useState<Set<number>>(new Set());

  // ── Interaction state ──
  const [mousePos, setMousePos]       = useState<{ x: number; y: number } | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // ── Refs ──
  const svgRef      = useRef<SVGSVGElement>(null);
  const timers      = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafRef      = useRef<number>(0);
  const autoRunning = useRef(false);

  // ── Timer helpers ──
  function addTimer(fn: () => void, ms: number) {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  }
  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  // ── Auto-wave loop ──
  function runWave(offset: number) {
    layerDelays.forEach((d, li) => addTimer(() => setActiveLayer(li), offset + d));
    edgeDelays.forEach((d, eli) => {
      addTimer(() => setActiveEdgeLayers((p) => new Set([...p, eli])), offset + d);
      addTimer(() => setActiveEdgeLayers((p) => { const n = new Set(p); n.delete(eli); return n; }), offset + d + EDGE_DURATION);
    });
    addTimer(() => { setActiveLayer(null); setActiveEdgeLayers(new Set()); }, offset + WAVE_TOTAL);
    addTimer(() => { if (autoRunning.current) runWave(0); }, offset + WAVE_TOTAL + WAVE_PAUSE);
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    autoRunning.current = true;
    addTimer(() => runWave(0), MOUNT_DELAY);
    return () => { clearTimers(); autoRunning.current = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Click: fire wave from node's layer forward ──
  const handleNodeClick = useCallback((node: NeuralNode) => {
    autoRunning.current = false;
    clearTimers();
    setActiveLayer(null);
    setActiveEdgeLayers(new Set());

    const STEP = 290;
    for (let li = node.layer; li < layerCount; li++) {
      const d = (li - node.layer) * STEP;
      addTimer(() => setActiveLayer(li), d);
      if (li < layerCount - 1) {
        addTimer(() => setActiveEdgeLayers((p) => new Set([...p, li])), d + 120);
        addTimer(() => setActiveEdgeLayers((p) => { const n = new Set(p); n.delete(li); return n; }), d + 120 + EDGE_DURATION);
      }
    }
    const clickDuration = (layerCount - node.layer) * STEP + 350;
    addTimer(() => {
      setActiveLayer(null);
      setActiveEdgeLayers(new Set());
      autoRunning.current = true;
      addTimer(() => runWave(0), WAVE_PAUSE);
    }, clickDuration);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerCount]);

  // ── Mouse proximity (RAF-throttled) ──
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const cx = e.clientX, cy = e.clientY;
    rafRef.current = requestAnimationFrame(() => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      setMousePos({
        x: (cx - rect.left) * (svgW / rect.width),
        y: (cy - rect.top)  * (svgH / rect.height),
      });
    });
  }, [svgW, svgH]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setMousePos(null);
    setHoveredNodeId(null);
  }, []);

  // ── Proximity map (recomputed per mouse move) ──
  const proximityMap = useMemo(() => {
    if (!mousePos) return new Map<string, number>();
    const map = new Map<string, number>();
    nodes.forEach((node) => {
      const d = Math.hypot(mousePos.x - node.x, mousePos.y - node.y);
      const v = Math.max(0, 1 - d / PROXIMITY_R);
      if (v > 0.01) map.set(node.id, v);
    });
    return map;
  }, [mousePos, nodes]);

  // ── Hover connections ──
  const { connEdgeKeys, connNodeIds } = useMemo(() => {
    if (!hoveredNodeId) return { connEdgeKeys: new Set<string>(), connNodeIds: new Set<string>() };
    const edgeKeys = new Set<string>();
    const nodeIds  = new Set<string>();
    edges.forEach((e) => {
      if (e.fromId === hoveredNodeId || e.toId === hoveredNodeId) {
        edgeKeys.add(`${e.fromId}>${e.toId}`);
        nodeIds.add(e.fromId === hoveredNodeId ? e.toId : e.fromId);
      }
    });
    return { connEdgeKeys: edgeKeys, connNodeIds: nodeIds };
  }, [hoveredNodeId, edges]);

  const labelY = svgH - 7;
  const regularEdges = useMemo(() => edges.filter((e) => !e.skipSpan), [edges]);
  const skipEdges    = useMemo(() => edges.filter((e) => !!e.skipSpan), [edges]);

  return (
    <motion.svg
      ref={svgRef}
      viewBox={`0 0 ${svgW} ${svgH}`}
      width="100%"
      height="100%"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ overflow: "visible", cursor: "crosshair" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        <filter id="nn-node-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nn-output-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nn-hover-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nn-edge-glow" x="-10%" y="-80%" width="120%" height="260%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* HUD corner brackets */}
      <path d="M8 22 L8 8 L22 8" fill="none" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
      <path d={`M${svgW-22} 8 L${svgW-8} 8 L${svgW-8} 22`} fill="none" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
      <path d={`M8 ${svgH-22} L8 ${svgH-8} L22 ${svgH-8}`} fill="none" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
      <path d={`M${svgW-22} ${svgH-8} L${svgW-8} ${svgH-8} L${svgW-8} ${svgH-22}`} fill="none" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />

      {/* Skip / residual edges */}
      {skipEdges.map((edge) => {
        const from = nodeMap.get(edge.fromId);
        const to   = nodeMap.get(edge.toId);
        if (!from || !to) return null;
        const waveActive  = activeEdgeLayers.has(edge.fromLayer);
        const hoverActive = connEdgeKeys.has(`${edge.fromId}>${edge.toId}`);
        const lit  = waveActive || hoverActive;
        const span = edge.skipSpan ?? 2;
        const d    = bezier(from.x, from.y, to.x, to.y, span >= 3 ? 0.65 : 0.56);
        const base = span >= 3 ? "160,80,255" : "124,58,237";
        return (
          <path key={`skip-${edge.fromId}>${edge.toId}`} d={d} fill="none"
            stroke={lit ? `rgba(${base},${hoverActive ? 0.8 : 0.6})` : `rgba(${base},0.1)`}
            strokeWidth={lit ? (hoverActive ? 1.3 : 1.0) : 0.55}
            strokeDasharray={span >= 3 ? "2 5" : "3 4"}
            style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
          />
        );
      })}

      {/* Regular forward edges */}
      {regularEdges.map((edge) => {
        const from = nodeMap.get(edge.fromId);
        const to   = nodeMap.get(edge.toId);
        if (!from || !to) return null;
        const waveActive  = activeEdgeLayers.has(edge.fromLayer);
        const hoverActive = connEdgeKeys.has(`${edge.fromId}>${edge.toId}`);
        const lit = waveActive || hoverActive;
        const d   = bezier(from.x, from.y, to.x, to.y);
        return (
          <path key={`${edge.fromId}>${edge.toId}`} d={d} fill="none"
            stroke={hoverActive ? "rgba(0,212,255,0.9)" : (waveActive ? "var(--accent)" : "var(--accent-border)")}
            strokeWidth={hoverActive ? 1.6 : (waveActive ? 1.2 : 0.55)}
            strokeOpacity={hoverActive ? 0.85 : (waveActive ? 0.68 : 0.18)}
            filter={lit ? "url(#nn-edge-glow)" : undefined}
            style={{ transition: "stroke 0.15s ease, stroke-opacity 0.15s ease, stroke-width 0.15s ease" }}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node, idx) => {
        const isWaveActive = activeLayer === node.layer;
        const isHovered    = hoveredNodeId === node.id;
        const isConnected  = connNodeIds.has(node.id);
        const proximity    = proximityMap.get(node.id) ?? 0;
        const isOut        = !!node.isOutput;

        // Visual priority: hover > wave > connected > proximity
        const accentRaw   = isOut ? "0,255,136" : "0,212,255";
        const accent      = isOut ? "var(--signal-green)" : "var(--accent)";

        const glowOpacity = isHovered ? 0.18
          : isWaveActive ? 0.055
          : isConnected  ? 0.08
          : proximity * 0.1;

        const ringOpacity = isHovered ? 0.55
          : isWaveActive ? 0.3
          : isConnected  ? 0.22
          : proximity * 0.25;

        const bodyFill = (isHovered || isWaveActive || isConnected)
          ? `rgba(${accentRaw},${isHovered ? 0.22 : isConnected ? 0.1 : 0.14})`
          : proximity > 0
            ? `rgba(${accentRaw},${proximity * 0.1})`
            : "var(--bg-elevated)";

        const bodyStroke = (isHovered || isWaveActive || isConnected || proximity > 0.2)
          ? accent
          : "rgba(0,212,255,0.18)";

        const bodyStrokeWidth = isHovered ? 2
          : isWaveActive ? 1.5
          : isConnected  ? 1.2
          : 0.75 + proximity * 0.6;

        const innerDotOpacity = isHovered ? 1
          : isWaveActive ? 0.9
          : isConnected  ? 0.4
          : proximity * 0.35;

        const filterVal = isHovered
          ? "url(#nn-hover-glow)"
          : (isWaveActive || isConnected)
            ? (isOut ? "url(#nn-output-glow)" : "url(#nn-node-glow)")
            : undefined;

        const waveDelay  = isWaveActive ? `${node.indexInLayer * 0.038}s` : "0s";
        const transBase  = `fill 0.18s ease ${waveDelay}, stroke 0.18s ease ${waveDelay}, stroke-width 0.15s ease ${waveDelay}`;

        return (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.04 + idx * 0.022, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHoveredNodeId(node.id)}
            onMouseLeave={() => setHoveredNodeId(null)}
            onClick={() => handleNodeClick(node)}
          >
            {/* Wide halo */}
            <circle cx={node.x} cy={node.y} r={node.r + 11}
              fill={accent} opacity={glowOpacity}
              style={{ transition: "opacity 0.2s ease" }}
            />
            {/* Tight ring */}
            <circle cx={node.x} cy={node.y} r={node.r + 3.5}
              fill="none" stroke={accent} strokeWidth="0.8"
              strokeOpacity={ringOpacity}
              style={{ transition: "stroke-opacity 0.18s ease" }}
            />
            {/* Body */}
            <circle cx={node.x} cy={node.y} r={isHovered ? node.r + 1 : node.r}
              fill={bodyFill} stroke={bodyStroke} strokeWidth={bodyStrokeWidth}
              filter={filterVal}
              style={{ transition: `${transBase}, r 0.15s ease` }}
            />
            {/* Inner dot */}
            <circle cx={node.x} cy={node.y} r={node.r * 0.34}
              fill={accent} opacity={innerDotOpacity}
              style={{ transition: `opacity 0.15s ease ${waveDelay}` }}
            />

            {/* Activation value — shown on hover */}
            {isHovered && !node.label && (
              <text
                x={node.x} y={node.y - node.r - 6}
                textAnchor="middle"
                fill={accent}
                fontSize={isMobile ? 6 : 7.5}
                fontFamily="'JetBrains Mono', monospace"
                opacity={0.85}
                style={{ userSelect: "none", pointerEvents: "none" }}
              >
                {stableVal(node.id)}
              </text>
            )}

            {/* Node label */}
            {node.label && (
              <text
                x={node.layer === 0 ? node.x - node.r - 6 : node.x + node.r + 6}
                y={node.y}
                textAnchor={node.layer === 0 ? "end" : "start"}
                dominantBaseline="middle"
                fill={(isHovered || isWaveActive || isConnected) ? accent : "var(--text-muted)"}
                fontSize={isMobile ? 7 : 8}
                fontFamily="'JetBrains Mono', monospace"
                letterSpacing="0.05em"
                style={{ transition: "fill 0.18s ease", userSelect: "none", pointerEvents: "none" }}
              >
                {node.label}
              </text>
            )}
          </motion.g>
        );
      })}

      {/* Layer column labels */}
      {layerLabels.map((label, li) => (
        <text key={label}
          x={layerXs[li]} y={labelY}
          textAnchor="middle"
          fill={activeLayer === li ? "var(--accent)" : "var(--text-muted)"}
          fontSize={isMobile ? 5.5 : 7}
          fontFamily="'JetBrains Mono', monospace"
          letterSpacing="0.12em" opacity={0.44}
          style={{ transition: "fill 0.2s ease", userSelect: "none", pointerEvents: "none" }}
        >
          {label}
        </text>
      ))}

      {/* Node-count badges */}
      {layerXs.map((lx, li) => {
        const count = nodes.filter((n) => n.layer === li).length;
        if (count <= 3) return null;
        return (
          <text key={`badge-${li}`}
            x={lx} y={isMobile ? 9 : 11}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize={isMobile ? 5 : 6.5}
            fontFamily="'JetBrains Mono', monospace"
            opacity={0.28}
            style={{ userSelect: "none", pointerEvents: "none" }}
          >
            ×{count}
          </text>
        );
      })}
    </motion.svg>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function HeroSignal() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const svgWidth  = isMobile ? M_SVG_W : D_SVG_W;
  const svgHeight = isMobile ? M_SVG_H : D_SVG_H;

  return (
    <section id="hero" style={{
      minHeight: "100svh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      background: "var(--bg-primary)", padding: "0 1.5rem",
    }} aria-label="Hero section">
      <a href="#pipeline" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded focus:bg-[var(--bg-elevated)] focus:text-[var(--accent)] focus:border focus:border-[var(--accent-border)] focus:font-mono focus:text-sm">
        Skip to content
      </a>

      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 65% 45% at 50% 48%, rgba(0,212,255,0.11) 0%, transparent 70%)",
      }} />

      <div style={{ width: "100%", maxWidth: svgWidth, height: svgHeight, position: "relative", flexShrink: 0 }}>
        <NeuralNet key={isMobile ? "mobile" : "desktop"} isMobile={isMobile} />
      </div>

      <div style={{ marginTop: "2.5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", minHeight: "clamp(7rem, 10vh, 9rem)" }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--text-primary)", fontSize: "clamp(1.75rem, 5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}
        >
          Yuvraj Sanghai
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--text-secondary)", fontSize: "1.125rem", lineHeight: 1.6, maxWidth: "42ch" }}
        >
          I build the systems behind the intelligence.
        </motion.p>

        <motion.a href="#pipeline"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: "0.5rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.25rem", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent)", textDecoration: "none", background: "transparent", cursor: "pointer", transition: "background 0.2s ease, border-color 0.2s ease" }}
          whileHover={{ backgroundColor: "rgba(0,212,255,0.08)", borderColor: "var(--accent)" }}
          whileTap={{ scale: 0.97 }}
        >
          Explore My Work
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1v10M1 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}
        aria-label="Scroll to explore"
      >
        <motion.span
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", userSelect: "none" }}
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
        >
          // scroll to explore
        </motion.span>
        <motion.svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatType: "loop", delay: 0.1 }}
        >
          <path d="M1 1.5L8 8.5L15 1.5" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
