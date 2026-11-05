"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { isPlaying, levels, subscribe, toggle } from "@/lib/orpheusAudio";
import { useLite } from "@/lib/lite";

/**
 * A softly iridescent orb (pale blue, with a faint rainbow rim) that breathes while idle and, when you press play, moves with the real Orpheus TTS sample:
 * loudness swells it, bass pushes the edge, treble ripples it, and louder moments send rings outward.
 * Plain WebGL, one full-screen shader. The one deliberate splash of colour on an otherwise monochrome site. Still (single frame) in Lite mode and with reduced motion, except while
 * you are actively listening.
 */
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uLevel; uniform float uBass; uniform float uHigh;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for(int i=0;i<4;i++){ v += a*noise(p); p = p*2.03 + 7.1; a *= 0.5; } return v; }
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / min(uRes.x, uRes.y);
  float r = length(uv); float a = atan(uv.y, uv.x); float t = uTime;

  // Smooth droplet silhouette: a few slow, low modes that travel around the rim. No sharp bumps.
  float amp = 0.004 + 0.022*uLevel;
  float def = sin(a*2.0 + t*0.8)*amp + sin(a*3.0 - t*1.1 + 1.7)*amp*0.7 + sin(a*5.0 + t*1.9)*0.007*uHigh;
  float R = 0.265 + 0.010*sin(t*0.9) + 0.040*uBass + 0.028*uLevel + def;
  float d = r - R;
  float body = smoothstep(0.004, -0.004, d);

  // Sphere normal, then a slowly flowing, domain-warped colour field mapped onto it.
  float z = sqrt(max(R*R - r*r, 0.0)) / R;
  vec3 n = normalize(vec3(uv / R, z));
  vec2 q = vec2(fbm(n.xy*1.5 + t*0.10), fbm(n.xy*1.5 + 4.2 - t*0.12));
  float w = fbm(n.xy*1.3 + 1.8*q + vec2(t*0.14, -t*0.10) + uLevel*0.9);
  w = 0.55 + (w - 0.5)*0.85;   // less contrast: flowing light, not dark marbling

  vec3 deep  = vec3(0.30, 0.42, 0.70);   // softest shade
  vec3 mid   = vec3(0.70, 0.82, 0.97);   // pale blue
  vec3 light = vec3(0.90, 0.95, 1.00);   // near white
  vec3 col = mix(deep, mid, smoothstep(0.20, 0.60, w));
  col = mix(col, light, smoothstep(0.50, 0.85, w) * (0.65 + 0.35*uLevel));

  // Soft light from the top left, a glassy highlight and a faint iridescent rim (cyan, lavender, rose).
  float diff = 0.52 + 0.48*max(dot(n, normalize(vec3(-0.45, 0.60, 0.65))), 0.0);
  float spec = pow(max(dot(n, normalize(vec3(-0.30, 0.50, 0.80))), 0.0), 28.0);
  float rim = pow(1.0 - n.z, 2.2);
  vec3 irid = 0.5 + 0.5*cos(6.2831*(vec3(0.0, 0.33, 0.67) + rim*0.7 + w*0.4 + t*0.03));
  col = col*diff + spec*0.55 + rim*mix(vec3(0.55, 0.75, 1.0), irid, 0.55)*(0.45 + 0.55*uLevel);
  col += uLevel*0.10*light;

  // Outer glow and a few soft echo rings that fade as they travel outward.
  float outside = max(d, 0.0);
  vec3 glowCol = vec3(0.35, 0.55, 0.95);
  float glow = exp(-outside*6.0)*(0.22 + 0.5*uLevel);
  float ring = exp(-pow((fract(r*4.2 - t*0.35*(0.3 + uLevel)) - 0.5)*4.5, 2.0)) * exp(-outside*5.5) * uLevel * 0.40 * smoothstep(0.0, 0.05, outside);
  vec3 bg = vec3(0.027, 0.032, 0.042) * smoothstep(0.95, 0.15, r);
  vec3 outc = bg + glowCol*glow + vec3(0.6, 0.75, 1.0)*ring;
  gl_FragColor = vec4(mix(outc, col, body), 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export function OrpheusOrb() {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const playing = useSyncExternalStore(subscribe, isPlaying, () => false);
  const lite = useLite();
  const [failed, setFailed] = useState(false);
  const live = useRef({ playing: false, still: false });
  live.current.playing = playing;
  live.current.still =
    lite || (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const wake = useRef<() => void>(() => {});

  useEffect(() => {
    const cv = canvas.current;
    const host = box.current;
    if (!cv || !host) return;
    const gl = cv.getContext("webgl", { antialias: true, alpha: false, powerPreference: "low-power" });
    if (!gl) {
      setFailed(true);
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("uRes"), uTime = U("uTime"), uLevel = U("uLevel"), uBass = U("uBass"), uHigh = U("uHigh");

    let visible = false;
    let raf = 0;
    const t0 = performance.now();
    let idle = 0; // eases the idle breathing in and out

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(host.clientWidth * dpr));
      const h = Math.max(1, Math.round(host.clientHeight * dpr));
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
      gl.viewport(0, 0, w, h);
    };
    const draw = (time: number) => {
      size();
      const lv = live.current.playing ? levels() : { level: 0, bass: 0, high: 0 };
      idle += ((live.current.playing ? 0 : 1) - idle) * 0.08;
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uLevel, lv.level + idle * (0.06 + 0.04 * Math.sin(time * 0.8)));
      gl.uniform1f(uBass, lv.bass);
      gl.uniform1f(uHigh, lv.high);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const frame = () => {
      raf = 0;
      if (!visible) return;
      const time = (performance.now() - t0) / 1000;
      draw(time);
      // Animate while listening, or when motion is allowed; otherwise hold the still frame.
      if (live.current.playing || !live.current.still) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };
    wake.current = start;

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(host);
    const ro = new ResizeObserver(() => {
      if (visible) {
        draw((performance.now() - t0) / 1000);
        start();
      }
    });
    ro.observe(host);
    const onLost = (e: Event) => {
      e.preventDefault();
      setFailed(true);
    };
    cv.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      cv.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  // Play/pause or Lite changes may need the loop started (or one last still frame drawn).
  useEffect(() => wake.current(), [playing, lite]);

  return (
    <div ref={box} className="absolute inset-0" style={{ background: "#07080b" }}>
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="h-24 w-24 rounded-full" style={{ background: "radial-gradient(circle at 35% 30%, #fff, #8a8a8a 45%, #1a1a1a 80%)", boxShadow: "0 0 40px rgba(255,255,255,0.15)" }} />
        </div>
      ) : (
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          void toggle();
        }}
        aria-pressed={playing}
        aria-label={playing ? "Stop the Orpheus TTS sample" : "Hear it: a sample generated by the fine-tuned Orpheus model"}
        className="hit absolute bottom-3 left-4 z-10 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-widest text-text-strong transition-colors hover:bg-white/20"
        style={{ fontFamily: "var(--font-display), monospace", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(6px)" }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
          {playing ? <rect x="2" y="2" width="8" height="8" rx="1" /> : <path d="M3 1.5v9l7.5-4.5z" />}
        </svg>
        {playing ? "Stop" : "Hear it"}
      </button>
      <p className="pointer-events-none absolute bottom-3.5 right-4 text-[10px] uppercase tracking-[0.18em] text-text-muted" style={{ fontFamily: "var(--font-display), monospace" }}>
        {playing ? "Fine-tuned model · live" : "Generated by the model"}
      </p>
    </div>
  );
}
