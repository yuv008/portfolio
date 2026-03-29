"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/animations";

interface SkillNode {
  id: string;
  label: string;
  group: "language" | "framework" | "database" | "concept";
  size: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface SkillEdge {
  source: string;
  target: string;
}

const groupColors: Record<string, string> = {
  language: "#00d4ff",
  framework: "#00ff88",
  database: "#ffaa00",
  concept: "#ff6b9d",
};

const groupLabels: Record<string, string> = {
  language: "Languages",
  framework: "Frameworks",
  database: "Databases",
  concept: "Concepts",
};

const skillsData: Omit<SkillNode, "x" | "y" | "vx" | "vy">[] = [
  // Languages
  { id: "python", label: "Python", group: "language", size: 24 },
  { id: "cpp", label: "C++", group: "language", size: 14 },
  { id: "typescript", label: "TypeScript", group: "language", size: 12 },
  // Frameworks
  { id: "fastapi", label: "FastAPI", group: "framework", size: 20 },
  { id: "pytorch", label: "PyTorch", group: "framework", size: 18 },
  { id: "langchain", label: "LangChain", group: "framework", size: 16 },
  { id: "pipecat", label: "Pipecat", group: "framework", size: 14 },
  { id: "livekit", label: "LiveKit", group: "framework", size: 16 },
  { id: "crewai", label: "CrewAI", group: "framework", size: 14 },
  { id: "unsloth", label: "Unsloth", group: "framework", size: 14 },
  { id: "llamacpp", label: "llama.cpp", group: "framework", size: 14 },
  // Databases
  { id: "qdrant", label: "Qdrant", group: "database", size: 20 },
  { id: "postgresql", label: "PostgreSQL", group: "database", size: 16 },
  { id: "mongodb", label: "MongoDB", group: "database", size: 14 },
  { id: "redis", label: "Redis", group: "database", size: 14 },
  { id: "faiss", label: "FAISS", group: "database", size: 12 },
  // Concepts
  { id: "rag", label: "RAG", group: "concept", size: 22 },
  { id: "voice-ai", label: "Voice AI", group: "concept", size: 20 },
  { id: "fine-tuning", label: "Fine-tuning", group: "concept", size: 18 },
  { id: "caching", label: "Semantic Caching", group: "concept", size: 16 },
  { id: "observability", label: "LLM Observability", group: "concept", size: 14 },
  { id: "tts", label: "TTS / Speech Synthesis", group: "concept", size: 18 },
  { id: "quantization", label: "Model Quantization", group: "concept", size: 14 },
  { id: "snac", label: "Audio Codecs (SNAC)", group: "concept", size: 12 },
];

const skillEdges: SkillEdge[] = [
  { source: "python", target: "fastapi" },
  { source: "python", target: "pytorch" },
  { source: "python", target: "langchain" },
  { source: "pytorch", target: "fine-tuning" },
  { source: "fine-tuning", target: "unsloth" },
  { source: "unsloth", target: "tts" },
  { source: "tts", target: "snac" },
  { source: "tts", target: "voice-ai" },
  { source: "snac", target: "llamacpp" },
  { source: "fine-tuning", target: "quantization" },
  { source: "quantization", target: "llamacpp" },
  { source: "langchain", target: "rag" },
  { source: "rag", target: "qdrant" },
  { source: "rag", target: "faiss" },
  { source: "fastapi", target: "livekit" },
  { source: "livekit", target: "voice-ai" },
  { source: "pipecat", target: "voice-ai" },
  { source: "voice-ai", target: "caching" },
  { source: "caching", target: "redis" },
  { source: "caching", target: "qdrant" },
  { source: "crewai", target: "langchain" },
  { source: "fastapi", target: "postgresql" },
  { source: "observability", target: "langchain" },
];

function initializeNodes(width: number, height: number): SkillNode[] {
  return skillsData.map((s) => ({
    ...s,
    x: width * 0.2 + Math.random() * width * 0.6,
    y: height * 0.2 + Math.random() * height * 0.6,
    vx: 0,
    vy: 0,
  }));
}

export function StackGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [nodes, setNodes] = useState<SkillNode[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const animFrameRef = useRef<number>(0);
  const nodesRef = useRef<SkillNode[]>([]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = Math.min(500, Math.max(350, w * 0.55));
        setDimensions({ width: w, height: h });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const initialNodes = initializeNodes(dimensions.width, dimensions.height);
    nodesRef.current = initialNodes;
    setNodes([...initialNodes]);

    let iteration = 0;
    const maxIterations = 300;

    const simulate = () => {
      if (iteration >= maxIterations) return;
      const ns = nodesRef.current;
      const alpha = 0.3 * (1 - iteration / maxIterations);

      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          let dx = ns[j].x - ns[i].x;
          let dy = ns[j].y - ns[i].y;
          let dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = (ns[i].size + ns[j].size) * 2.5;
          if (dist < minDist) {
            const force = ((minDist - dist) / dist) * alpha * 0.5;
            const fx = dx * force;
            const fy = dy * force;
            ns[i].x -= fx;
            ns[i].y -= fy;
            ns[j].x += fx;
            ns[j].y += fy;
          }
          const repulsion = (200 * alpha) / (dist * dist);
          ns[i].x -= (dx / dist) * repulsion;
          ns[i].y -= (dy / dist) * repulsion;
          ns[j].x += (dx / dist) * repulsion;
          ns[j].y += (dy / dist) * repulsion;
        }
      }

      for (const edge of skillEdges) {
        const source = ns.find((n) => n.id === edge.source);
        const target = ns.find((n) => n.id === edge.target);
        if (!source || !target) continue;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 100;
        const force = ((dist - targetDist) / dist) * alpha * 0.1;
        source.x += dx * force;
        source.y += dy * force;
        target.x -= dx * force;
        target.y -= dy * force;
      }

      const padding = 40;
      for (const n of ns) {
        n.x = Math.max(padding + n.size, Math.min(dimensions.width - padding - n.size, n.x));
        n.y = Math.max(padding + n.size, Math.min(dimensions.height - padding - n.size, n.y));
      }

      nodesRef.current = ns;
      setNodes([...ns]);
      iteration++;
      animFrameRef.current = requestAnimationFrame(simulate);
    };

    animFrameRef.current = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isInView, dimensions]);

  const isConnected = useCallback(
    (nodeId: string) => {
      if (!hoveredNode) return true;
      if (nodeId === hoveredNode) return true;
      return skillEdges.some(
        (e) =>
          (e.source === hoveredNode && e.target === nodeId) ||
          (e.target === hoveredNode && e.source === nodeId)
      );
    },
    [hoveredNode]
  );

  const isEdgeConnected = useCallback(
    (edge: SkillEdge) => {
      if (!hoveredNode) return true;
      return edge.source === hoveredNode || edge.target === hoveredNode;
    },
    [hoveredNode]
  );

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <section id="stack" className="relative" ref={containerRef}>
      <div className="container-main">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportConfig}
        >
          <motion.p variants={fadeInUp} className="mono-label mb-3">
            // skills
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            The Stack
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-2 mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Not a checklist. A system.
          </motion.p>
        </motion.div>

        {/* SVG Graph */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="rounded-lg border border-[var(--accent-border)]/30 overflow-hidden"
          style={{ background: "var(--bg-secondary)" }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            className="w-full"
            style={{ height: dimensions.height }}
          >
            {/* Edges */}
            {skillEdges.map((edge, i) => {
              const source = nodeMap.get(edge.source);
              const target = nodeMap.get(edge.target);
              if (!source || !target) return null;
              return (
                <line
                  key={i}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={
                    isEdgeConnected(edge)
                      ? "rgba(0, 212, 255, 0.2)"
                      : "rgba(0, 212, 255, 0.05)"
                  }
                  strokeWidth={isEdgeConnected(edge) ? 1.5 : 0.5}
                  style={{ transition: "all 0.3s ease" }}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const connected = isConnected(node.id);
              const color = groupColors[node.group];
              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: "pointer", transition: "opacity 0.3s ease" }}
                  opacity={connected ? 1 : 0.15}
                >
                  {/* Glow */}
                  {hoveredNode === node.id && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size + 8}
                      fill={color}
                      opacity={0.1}
                    />
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size}
                    fill={color}
                    opacity={0.15}
                    stroke={color}
                    strokeWidth={hoveredNode === node.id ? 2 : 1}
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size * 0.5}
                    fill={color}
                    opacity={0.6}
                  />
                  <text
                    x={node.x}
                    y={node.y + node.size + 14}
                    textAnchor="middle"
                    fill={connected ? "var(--text-primary)" : "var(--text-muted)"}
                    fontSize={10}
                    fontFamily="'JetBrains Mono', monospace"
                    style={{ transition: "fill 0.3s ease" }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap gap-6 mt-6 justify-center"
        >
          {Object.entries(groupColors).map(([group, color]) => (
            <div key={group} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: color }}
              />
              <span className="mono-label">{groupLabels[group]}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
