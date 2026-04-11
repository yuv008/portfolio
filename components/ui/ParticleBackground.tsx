"use client";

import { useEffect, useRef, useState } from "react";

// ────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  PARTICLE_DENSITY: 1 / 55000, // particles per px²
  CONNECTION_DISTANCE: 100,
  BASE_SPEED: 0.18,
  FLOW_STRENGTH: 0.004,
  FLOW_SCALE: 0.003,
  FLOW_SPEED: 0.00028,
  MOUSE_RADIUS: 280,
  MOUSE_STRENGTH: 0.18,
  FLICKER_AMOUNT: 0.08,
  PARALLAX_SCALE: 0.012,
  HERO_ZONE_BIAS: 0.4, // 40% spawned in center-right (x: 40%-70%)
};

// ────────────────────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetVx: number;
  targetVy: number;
  radius: number;
  opacity: number;
  layer: number; // 0=background, 1=mid, 2=foreground
  parallaxFactor: number;
  glowRadius: number;
  flickerSpeed: number;
  flickerPhase: number;
  gridCell: number; // cell index for spatial partitioning
}

interface SpatialGrid {
  cells: Map<number, Particle[]>;
  cellSize: number;
  cols: number;
  rows: number;
}

interface ParticleBackgroundConfig {
  particleCount?: number;
}

// ────────────────────────────────────────────────────────────────────────────
// FLOW FIELD (Perlin-like sinusoidal noise)
// ────────────────────────────────────────────────────────────────────────────

function getFlowFieldAngle(x: number, y: number, t: number): number {
  const a = Math.sin(x * CONFIG.FLOW_SCALE + t * CONFIG.FLOW_SPEED) *
    Math.cos(y * CONFIG.FLOW_SCALE + t * CONFIG.FLOW_SPEED * 0.85) *
    Math.PI *
    2;
  const b = Math.sin((x + y) * 0.002 + t * 0.0002) * Math.PI;
  return a + b;
}

// ────────────────────────────────────────────────────────────────────────────
// PARTICLE SYSTEM
// ────────────────────────────────────────────────────────────────────────────

class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private grid: SpatialGrid;

  private mouseX: number = 0;
  private mouseY: number = 0;
  private isMouseActive: boolean = false;

  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private isActive: boolean = true;
  private flowTime: number = 0;
  private frameCount: number = 0;

  private particleCount: number;

  // Bound handlers for cleanup
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseLeave: () => void;
  private boundResize: () => void;
  private boundVisibilityChange: () => void;
  private mouseTimeout: NodeJS.Timeout | null = null;

  constructor(canvas: HTMLCanvasElement, _config: ParticleBackgroundConfig = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");
    this.ctx = ctx;

    this.particleCount = this.calculateParticleCount();
    this.grid = this.createGrid();

    // Bind handlers
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseLeave = this.handleMouseLeave.bind(this);
    this.boundResize = this.handleResize.bind(this);
    this.boundVisibilityChange = this.handleVisibilityChange.bind(this);

    this.setupCanvas();
    this.initParticles();
    this.setupEventListeners();
    this.startAnimation();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // INITIALIZATION
  // ──────────────────────────────────────────────────────────────────────────

  private setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private calculateParticleCount(): number {
    const area = window.innerWidth * window.innerHeight;
    return Math.max(15, Math.floor(area * CONFIG.PARTICLE_DENSITY));
  }

  private createGrid(): SpatialGrid {
    const cellSize = CONFIG.CONNECTION_DISTANCE / 1.5;
    const cols = Math.ceil(this.canvas.width / cellSize);
    const rows = Math.ceil(this.canvas.height / cellSize);
    return {
      cells: new Map(),
      cellSize,
      cols,
      rows,
    };
  }

  private initParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private createParticle(x?: number, y?: number): Particle {
    // Biased spawning: 40% in hero zone (x: 40%-70%), rest uniform
    let px: number;
    if (Math.random() < CONFIG.HERO_ZONE_BIAS) {
      const heroStart = this.canvas.width * 0.4;
      const heroEnd = this.canvas.width * 0.7;
      px = heroStart + Math.random() * (heroEnd - heroStart);
    } else {
      px = Math.random() * this.canvas.width;
    }
    const py = y ?? Math.random() * this.canvas.height;
    px = x ?? px;

    // Layer assignment: 50% bg, 35% mid, 15% fg
    const rand = Math.random();
    let layer: number;
    let radius: number;
    let speedMult: number;
    let opacity: number;
    let parallaxFactor: number;

    if (rand < 0.5) {
      layer = 0;
      radius = 0.5 + Math.random() * 0.8;
      speedMult = 0.6;
      opacity = 0.2 + Math.random() * 0.2;
      parallaxFactor = 0.3;
    } else if (rand < 0.85) {
      layer = 1;
      radius = 0.8 + Math.random() * 1.0;
      speedMult = 1.0;
      opacity = 0.3 + Math.random() * 0.25;
      parallaxFactor = 0.7;
    } else {
      layer = 2;
      radius = 1.2 + Math.random() * 1.5;
      speedMult = 1.4;
      opacity = 0.35 + Math.random() * 0.3;
      parallaxFactor = 1.2;
    }

    const angle = Math.random() * Math.PI * 2;
    const speed = CONFIG.BASE_SPEED * speedMult * (0.7 + Math.random() * 0.6);

    return {
      x: px,
      y: py,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      targetVx: Math.cos(angle) * speed,
      targetVy: Math.sin(angle) * speed,
      radius,
      opacity,
      layer,
      parallaxFactor,
      glowRadius: radius * (2.5 + Math.random() * 2.5),
      flickerSpeed: 0.008 + Math.random() * 0.012,
      flickerPhase: Math.random() * Math.PI * 2,
      gridCell: 0,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EVENT LISTENERS
  // ──────────────────────────────────────────────────────────────────────────

  private setupEventListeners() {
    window.addEventListener("mousemove", this.boundMouseMove);
    window.addEventListener("mouseleave", this.boundMouseLeave);
    window.addEventListener("resize", this.boundResize);
    document.addEventListener("visibilitychange", this.boundVisibilityChange);
  }

  private handleMouseMove = (e: MouseEvent) => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.isMouseActive = true;

    if (this.mouseTimeout) clearTimeout(this.mouseTimeout);
    this.mouseTimeout = setTimeout(() => {
      this.isMouseActive = false;
    }, 800);
  };

  private handleMouseLeave = () => {
    this.isMouseActive = false;
  };

  private handleResize = () => {
    this.setupCanvas();
    const newCount = this.calculateParticleCount();
    if (newCount > this.particles.length) {
      for (let i = this.particles.length; i < newCount; i++) {
        this.particles.push(this.createParticle());
      }
    } else if (newCount < this.particles.length) {
      this.particles = this.particles.slice(0, newCount);
    }
    this.grid = this.createGrid();
  };

  private handleVisibilityChange = () => {
    this.isActive = !document.hidden;
  };

  // ──────────────────────────────────────────────────────────────────────────
  // SPATIAL GRID
  // ──────────────────────────────────────────────────────────────────────────

  private rebuildGrid() {
    this.grid.cells.clear();
    for (const p of this.particles) {
      const col = Math.floor(p.x / this.grid.cellSize);
      const row = Math.floor(p.y / this.grid.cellSize);
      const cellKey = row * this.grid.cols + col;
      p.gridCell = cellKey;

      if (!this.grid.cells.has(cellKey)) {
        this.grid.cells.set(cellKey, []);
      }
      this.grid.cells.get(cellKey)!.push(p);
    }
  }

  private getNeighborCells(col: number, row: number): number[] {
    const keys: number[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nc = col + dx;
        const nr = row + dy;
        if (nc >= 0 && nc < this.grid.cols && nr >= 0 && nr < this.grid.rows) {
          keys.push(nr * this.grid.cols + nc);
        }
      }
    }
    return keys;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PHYSICS UPDATE
  // ──────────────────────────────────────────────────────────────────────────

  private updateParticles(deltaTime: number) {
    for (const p of this.particles) {
      // Sample flow field and apply as target velocity nudge
      const flowAngle = getFlowFieldAngle(p.x, p.y, this.flowTime);
      const flowVx = Math.cos(flowAngle) * CONFIG.FLOW_STRENGTH;
      const flowVy = Math.sin(flowAngle) * CONFIG.FLOW_STRENGTH;

      p.targetVx += flowVx;
      p.targetVy += flowVy;

      // Mouse influence (gentle attraction)
      if (this.isMouseActive) {
        const dx = this.mouseX - p.x;
        const dy = this.mouseY - p.y;
        const distSq = dx * dx + dy * dy;
        const maxDistSq = CONFIG.MOUSE_RADIUS * CONFIG.MOUSE_RADIUS;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const influence = (1 - dist / CONFIG.MOUSE_RADIUS) * CONFIG.MOUSE_STRENGTH * 0.3;
          const angle = Math.atan2(dy, dx);

          p.targetVx += Math.cos(angle) * influence;
          p.targetVy += Math.sin(angle) * influence;
        }
      }

      // Smooth velocity interpolation (lerp)
      const lerpFactor = 0.08;
      p.vx += (p.targetVx - p.vx) * lerpFactor;
      p.vy += (p.targetVy - p.vy) * lerpFactor;

      // Decay target velocity back toward zero
      const decayFactor = 0.96;
      p.targetVx *= decayFactor;
      p.targetVy *= decayFactor;

      // Delta-time corrected position update
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;

      // Wrap around edges
      const margin = 50;
      if (p.x < -margin) p.x = this.canvas.width + margin;
      if (p.x > this.canvas.width + margin) p.x = -margin;
      if (p.y < -margin) p.y = this.canvas.height + margin;
      if (p.y > this.canvas.height + margin) p.y = -margin;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CONNECTION UPDATE (Every 4 frames with spatial grid)
  // ──────────────────────────────────────────────────────────────────────────

  private updateConnections() {
    this.rebuildGrid();

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const col = Math.floor(p.x / this.grid.cellSize);
      const row = Math.floor(p.y / this.grid.cellSize);

      const neighborKeys = this.getNeighborCells(col, row);
      let bestNeighbor: Particle | null = null;
      let bestDist = CONFIG.CONNECTION_DISTANCE;

      // Find closest same-layer neighbor within distance
      for (const key of neighborKeys) {
        const cellParticles = this.grid.cells.get(key) || [];
        for (const other of cellParticles) {
          // Only connect same-layer particles
          if (other.layer !== p.layer) continue;

          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < bestDist && dist > 0) {
            bestDist = dist;
            bestNeighbor = other;
          }
        }
      }

      // Store connection (as index) if found
      (p as any).connectedParticle = bestNeighbor;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDERING
  // ──────────────────────────────────────────────────────────────────────────

  private drawConnections() {
    const ctx = this.ctx;

    for (const p of this.particles) {
      const other = (p as any).connectedParticle as Particle | null;
      if (!other) continue;

      const dx = p.x - other.x;
      const dy = p.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist >= CONFIG.CONNECTION_DISTANCE) continue;

      // Distance-based opacity fade
      const opacity = (1 - dist / CONFIG.CONNECTION_DISTANCE) * 0.08;

      ctx.strokeStyle = `rgba(125, 211, 252, ${opacity})`;
      ctx.lineWidth = 0.35;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(other.x, other.y);
      ctx.stroke();
    }
  }

  private drawParticles(time: number) {
    const ctx = this.ctx;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    ctx.save();

    for (const p of this.particles) {
      // Opacity flicker
      const flicker = 0.92 + 0.08 * Math.sin(time * p.flickerSpeed + p.flickerPhase);
      const finalOpacity = p.opacity * flicker;

      // Parallax offset based on mouse
      const parallaxOffsetX = (this.mouseX - centerX) * p.parallaxFactor * CONFIG.PARALLAX_SCALE;
      const parallaxOffsetY = (this.mouseY - centerY) * p.parallaxFactor * CONFIG.PARALLAX_SCALE;

      const renderX = p.x + parallaxOffsetX;
      const renderY = p.y + parallaxOffsetY;

      // Glow pass with shadow blur
      ctx.shadowBlur = p.glowRadius;
      ctx.shadowColor = `rgba(125, 211, 252, ${finalOpacity * 0.6})`;
      ctx.fillStyle = `rgba(200, 240, 255, ${finalOpacity})`;
      ctx.beginPath();
      ctx.arc(renderX, renderY, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Disable shadow blur for next particle
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ANIMATION LOOP
  // ──────────────────────────────────────────────────────────────────────────

  private frame = (timestamp: number) => {
    if (!this.lastFrameTime) this.lastFrameTime = timestamp;
    const deltaTime = Math.min((timestamp - this.lastFrameTime) / 16.67, 2);
    this.lastFrameTime = timestamp;

    if (this.isActive) {
      this.flowTime += deltaTime;
      this.updateParticles(deltaTime);

      // Update connections every 4 frames
      if (this.frameCount % 4 === 0) {
        this.updateConnections();
      }
      this.frameCount++;
    }

    // Clear canvas (transparent)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawConnections();
    this.drawParticles(timestamp);

    this.animationFrameId = requestAnimationFrame(this.frame);
  };

  private startAnimation() {
    this.animationFrameId = requestAnimationFrame(this.frame);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CLEANUP
  // ──────────────────────────────────────────────────────────────────────────

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.mouseTimeout) {
      clearTimeout(this.mouseTimeout);
    }
    // Remove all event listeners
    window.removeEventListener("mousemove", this.boundMouseMove);
    window.removeEventListener("mouseleave", this.boundMouseLeave);
    window.removeEventListener("resize", this.boundResize);
    document.removeEventListener("visibilitychange", this.boundVisibilityChange);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// REACT COMPONENT
// ────────────────────────────────────────────────────────────────────────────

export interface ParticleBackgroundProps extends ParticleBackgroundConfig {
  className?: string;
}

export function ParticleBackground({
  className = "",
  ...config
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const systemRef = useRef<ParticleSystem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    try {
      systemRef.current = new ParticleSystem(canvasRef.current, config);
    } catch (error) {
      console.error("Failed to initialize particle system:", error);
    }

    return () => {
      systemRef.current?.destroy();
    };
  }, [mounted, config]);

  if (!mounted) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        zIndex: 0,
        width: "100%",
        height: "100%",
        willChange: "contents",
      }}
    />
  );
}
