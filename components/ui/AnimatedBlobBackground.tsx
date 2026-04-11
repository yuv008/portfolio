"use client";

import { useEffect, useRef, useState } from "react";

// ────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  BLOB_COUNT: 6,
  BLOB_RADIUS_MIN: 0.12, // ratio to viewport diagonal
  BLOB_RADIUS_MAX: 0.2,
  DRIFT_SPEED: 0.08,
  MOUSE_RADIUS: 300,
  MOUSE_STRENGTH: 0.015,
  MOUSE_STRENGTH_BOOST: 0.025,
  BREATHE_PERIOD_MIN: 8000,
  BREATHE_PERIOD_MAX: 12000,
  BREATHE_AMPLITUDE: 0.12,
  OPACITY_AMPLITUDE: 0.15,
  WOBBLE_POINT_COUNT: 10,
  WOBBLE_FREQ_MIN: 0.3,
  WOBBLE_FREQ_MAX: 0.8,
  WOBBLE_AMPLITUDE_RATIO: 0.2,
};

const COLORS = [
  "rgba(110, 231, 255, 0.7)", // neural-cyan
  "rgba(171, 138, 255, 0.7)", // neural-violet
  "rgba(255, 172, 94, 0.65)", // neural-amber
  "rgba(97, 255, 171, 0.6)", // neural-green
  "rgba(209, 220, 254, 0.5)", // neural-mist
  "rgba(110, 231, 255, 0.4)", // second cyan
];

// ────────────────────────────────────────────────────────────────────────────
// 2D PERLIN NOISE (Inline, No Dependencies)
// ────────────────────────────────────────────────────────────────────────────

// Simple 2D noise using gradient vectors and interpolation
function noise2D(x: number, y: number, seed: number): number {
  // Permutation table (deterministic)
  const p: number[] = [];
  for (let i = 0; i < 256; i++) {
    p[i] = (i + seed * 73) % 256;
  }

  // Hash function
  const hash = (xi: number, yi: number) => {
    let n = Math.sin(xi * 12.9898 + yi * 78.233 + seed) * 43758.5453;
    return n - Math.floor(n);
  };

  // Gradient vectors for 2D
  const grad = (h: number) => {
    const angle = h * Math.PI * 2;
    return [Math.cos(angle), Math.sin(angle)];
  };

  // Cell coordinates
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  // Smooth interpolation (Smoothstep)
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);

  // Corner hashes
  const h00 = hash(xi, yi);
  const h10 = hash(xi + 1, yi);
  const h01 = hash(xi, yi + 1);
  const h11 = hash(xi + 1, yi + 1);

  // Gradient contributions
  const g00 = grad(h00);
  const g10 = grad(h10);
  const g01 = grad(h01);
  const g11 = grad(h11);

  const d00 = g00[0] * xf + g00[1] * yf;
  const d10 = g10[0] * (xf - 1) + g10[1] * yf;
  const d01 = g01[0] * xf + g01[1] * (yf - 1);
  const d11 = g11[0] * (xf - 1) + g11[1] * (yf - 1);

  // Interpolate
  const nx0 = d00 + (d10 - d00) * u;
  const nx1 = d01 + (d11 - d01) * u;
  const result = nx0 + (nx1 - nx0) * v;

  return result;
}

// Fractal Brownian Motion (multiple octaves)
function fbm2D(x: number, y: number, octaves: number, seed: number): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let max = 0;

  for (let i = 0; i < octaves; i++) {
    value += noise2D(x * frequency, y * frequency, seed + i) * amplitude;
    max += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / max;
}

// ────────────────────────────────────────────────────────────────────────────
// BLOB CLASS
// ────────────────────────────────────────────────────────────────────────────

interface BlobData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  color: string;
  noiseSeedX: number;
  noiseSeedY: number;
  breathePeriod: number;
  breathePhase: number;
  opacityPeriod: number;
  opacityPhase: number;
  wobbleFreqs: number[];
  wobblePhases: number[];
  attractionStrength: number;
}

class Blob {
  data: BlobData;
  canvasWidth: number;
  canvasHeight: number;

  constructor(
    x: number,
    y: number,
    baseRadius: number,
    color: string,
    seed: number,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    const wobbleFreqs: number[] = [];
    const wobblePhases: number[] = [];
    for (let i = 0; i < CONFIG.WOBBLE_POINT_COUNT; i++) {
      wobbleFreqs.push(
        CONFIG.WOBBLE_FREQ_MIN +
          (Math.random() * (CONFIG.WOBBLE_FREQ_MAX - CONFIG.WOBBLE_FREQ_MIN))
      );
      wobblePhases.push(Math.random() * Math.PI * 2);
    }

    this.data = {
      x,
      y,
      vx: 0,
      vy: 0,
      baseRadius,
      color,
      noiseSeedX: seed,
      noiseSeedY: seed + 1000,
      breathePeriod: CONFIG.BREATHE_PERIOD_MIN + Math.random() * (CONFIG.BREATHE_PERIOD_MAX - CONFIG.BREATHE_PERIOD_MIN),
      breathePhase: Math.random() * Math.PI * 2,
      opacityPeriod: 6000 + Math.random() * 8000,
      opacityPhase: Math.random() * Math.PI * 2,
      wobbleFreqs,
      wobblePhases,
      attractionStrength: 0,
    };
  }

  update(
    time: number,
    mouseX: number,
    mouseY: number,
    isMouseActive: boolean,
    closestBlob: Blob | null,
    allBlobs: Blob[]
  ) {
    const data = this.data;

    // Sample 2D noise for drift direction
    const noiseTime = time * 0.0005; // Slow time scale
    const noiseLookupX = data.x / 200 + noiseTime;
    const noiseLookupY = data.y / 200 + noiseTime;

    const noiseValX = fbm2D(noiseLookupX, noiseLookupY, 2, data.noiseSeedX);
    const noiseValY = fbm2D(noiseLookupX + 100, noiseLookupY + 100, 2, data.noiseSeedY);

    const angle = Math.atan2(noiseValY, noiseValX);
    const driftVx = Math.cos(angle) * CONFIG.DRIFT_SPEED;
    const driftVy = Math.sin(angle) * CONFIG.DRIFT_SPEED;

    // Mouse attraction
    let targetAttractionStrength = 0;
    if (isMouseActive) {
      const dx = mouseX - data.x;
      const dy = mouseY - data.y;
      const distSq = dx * dx + dy * dy;
      const maxDistSq = CONFIG.MOUSE_RADIUS * CONFIG.MOUSE_RADIUS;

      if (distSq < maxDistSq) {
        const dist = Math.sqrt(distSq);
        const strength = this === closestBlob ? CONFIG.MOUSE_STRENGTH_BOOST : CONFIG.MOUSE_STRENGTH;
        targetAttractionStrength = strength * (1 - dist / CONFIG.MOUSE_RADIUS);
      }
    }

    // Lerp attraction strength
    data.attractionStrength += (targetAttractionStrength - data.attractionStrength) * 0.1;

    // Apply attraction force
    const dx = mouseX - data.x;
    const dy = mouseY - data.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0.1) {
      const attractVx = (dx / dist) * data.attractionStrength;
      const attractVy = (dy / dist) * data.attractionStrength;
      data.vx = driftVx * 0.7 + attractVx;
      data.vy = driftVy * 0.7 + attractVy;
    } else {
      data.vx = driftVx;
      data.vy = driftVy;
    }

    // Update position
    data.x += data.vx;
    data.y += data.vy;

    // Wrap at edges
    const margin = 100;
    if (data.x < -margin) data.x = this.canvasWidth + margin;
    if (data.x > this.canvasWidth + margin) data.x = -margin;
    if (data.y < -margin) data.y = this.canvasHeight + margin;
    if (data.y > this.canvasHeight + margin) data.y = -margin;
  }

  draw(ctx: CanvasRenderingContext2D, time: number) {
    const data = this.data;
    const timeMs = time;

    // Breathing effect
    const breatheCycle = (timeMs % data.breathePeriod) / data.breathePeriod;
    const breatheAmount = CONFIG.BREATHE_AMPLITUDE * Math.sin(breatheCycle * Math.PI * 2 + data.breathePhase);
    const displayRadius = data.baseRadius * (1 + breatheAmount);

    // Opacity pulse
    const opacityCycle = (timeMs % data.opacityPeriod) / data.opacityPeriod;
    const opacityAmount = CONFIG.OPACITY_AMPLITUDE * Math.sin(opacityCycle * Math.PI * 2 + data.opacityPhase);
    const displayOpacity = 0.65 + opacityAmount;

    // Build bezier path with morphing control points
    const points: [number, number][] = [];
    for (let i = 0; i < CONFIG.WOBBLE_POINT_COUNT; i++) {
      const angle = (i / CONFIG.WOBBLE_POINT_COUNT) * Math.PI * 2;
      const freq = data.wobbleFreqs[i];
      const phase = data.wobblePhases[i];

      // Wobble amplitude
      const wobbleAmount = CONFIG.WOBBLE_AMPLITUDE_RATIO * displayRadius;
      const wobble = wobbleAmount * Math.sin((timeMs * freq * 0.001) + phase);

      const r = displayRadius + wobble;
      const px = data.x + Math.cos(angle) * r;
      const py = data.y + Math.sin(angle) * r;

      points.push([px, py]);
    }

    // Draw bezier curve
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // Create radial gradient
    const gradient = ctx.createRadialGradient(
      data.x, data.y, 0,
      data.x, data.y, displayRadius * 1.3
    );
    const baseColor = data.color.replace(/[\d.]+\)/, `${displayOpacity})`);
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(1, data.color.replace(/[\d.]+\)/, "0)"));

    // Build bezier path
    ctx.fillStyle = gradient;
    ctx.beginPath();

    // Move to first point
    ctx.moveTo(points[0][0], points[0][1]);

    // Draw cubic bezier curves connecting points
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      const nextNext = points[(i + 2) % points.length];

      // Control point 1 (from current toward next)
      const cp1x = current[0] + (next[0] - current[0]) * 0.33;
      const cp1y = current[1] + (next[1] - current[1]) * 0.33;

      // Control point 2 (from next toward nextNext, going backward)
      const cp2x = next[0] - (nextNext[0] - next[0]) * 0.33;
      const cp2y = next[1] - (nextNext[1] - next[1]) * 0.33;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next[0], next[1]);
    }

    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

// ────────────────────────────────────────────────────────────────────────────
// BLOB SYSTEM
// ────────────────────────────────────────────────────────────────────────────

class BlobSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private blobs: Blob[] = [];
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private isActive: boolean = true;

  private mouseX: number = 0;
  private mouseY: number = 0;
  private isMouseActive: boolean = false;
  private mouseTimeout: NodeJS.Timeout | null = null;

  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseLeave: () => void;
  private boundResize: () => void;
  private boundVisibilityChange: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");
    this.ctx = ctx;

    // Bind handlers
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseLeave = this.handleMouseLeave.bind(this);
    this.boundResize = this.handleResize.bind(this);
    this.boundVisibilityChange = this.handleVisibilityChange.bind(this);

    this.setupCanvas();
    this.initBlobs();
    this.setupEventListeners();
    this.startAnimation();
  }

  private setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private initBlobs() {
    this.blobs = [];
    const diagonal = Math.sqrt(this.canvas.width ** 2 + this.canvas.height ** 2);

    for (let i = 0; i < CONFIG.BLOB_COUNT; i++) {
      const radius = diagonal * (CONFIG.BLOB_RADIUS_MIN + Math.random() * (CONFIG.BLOB_RADIUS_MAX - CONFIG.BLOB_RADIUS_MIN));
      const blob = new Blob(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height,
        radius,
        COLORS[i % COLORS.length],
        i,
        this.canvas.width,
        this.canvas.height
      );
      this.blobs.push(blob);
    }
  }

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
    const oldWidth = this.canvas.width;
    const oldHeight = this.canvas.height;

    this.setupCanvas();

    // Scale blob positions and radii proportionally
    const scaleX = this.canvas.width / oldWidth;
    const scaleY = this.canvas.height / oldHeight;
    const scaleRadius = Math.sqrt(scaleX * scaleX + scaleY * scaleY) / Math.sqrt(2);

    for (const blob of this.blobs) {
      blob.data.x *= scaleX;
      blob.data.y *= scaleY;
      blob.data.baseRadius *= scaleRadius;
      blob.canvasWidth = this.canvas.width;
      blob.canvasHeight = this.canvas.height;
    }
  };

  private handleVisibilityChange = () => {
    this.isActive = !document.hidden;
  };

  private frame = (timestamp: number) => {
    if (!this.lastFrameTime) this.lastFrameTime = timestamp;
    this.lastFrameTime = timestamp;

    if (this.isActive) {
      // Find closest blob to mouse
      let closestBlob: Blob | null = null;
      let closestDist = Infinity;

      if (this.isMouseActive) {
        for (const blob of this.blobs) {
          const dx = this.mouseX - blob.data.x;
          const dy = this.mouseY - blob.data.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < closestDist) {
            closestDist = dist;
            closestBlob = blob;
          }
        }
      }

      // Update all blobs
      for (const blob of this.blobs) {
        blob.update(
          timestamp,
          this.mouseX,
          this.mouseY,
          this.isMouseActive,
          closestBlob,
          this.blobs
        );
      }
    }

    // Clear canvas
    this.ctx.fillStyle = "rgb(8, 12, 18)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw all blobs
    for (const blob of this.blobs) {
      blob.draw(this.ctx, timestamp);
    }

    this.animationFrameId = requestAnimationFrame(this.frame);
  };

  private startAnimation() {
    this.animationFrameId = requestAnimationFrame(this.frame);
  }

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.mouseTimeout) {
      clearTimeout(this.mouseTimeout);
    }
    window.removeEventListener("mousemove", this.boundMouseMove);
    window.removeEventListener("mouseleave", this.boundMouseLeave);
    window.removeEventListener("resize", this.boundResize);
    document.removeEventListener("visibilitychange", this.boundVisibilityChange);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// REACT COMPONENT
// ────────────────────────────────────────────────────────────────────────────

export function AnimatedBlobBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const systemRef = useRef<BlobSystem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    try {
      systemRef.current = new BlobSystem(canvasRef.current);
    } catch (error) {
      console.error("Failed to initialize blob system:", error);
    }

    return () => {
      systemRef.current?.destroy();
    };
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: -1,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
