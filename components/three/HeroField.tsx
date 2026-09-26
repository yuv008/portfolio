"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type HeroFieldProps = {
  /** Three colors: base, flow highlight, sparse accent. Swap for your site tokens. */
  colors?: [string, string, string];
  /** Particle count on desktop. Mobile automatically uses ~45%. */
  particles?: number;
  /** Overall particle opacity. Keep low when text sits on top. */
  opacity?: number;
  /** 0 = sphere, 1 = torus. */
  shape?: number;
  /**
   * Link to page scroll (for a fixed, full-page background): fades to
   * `scrollDim` of full opacity over the first viewport of scrolling, and
   * morphs from `shape` toward a torus across the rest of the page.
   */
  scrollLinked?: boolean;
  /** Opacity multiplier once scrolled past the first viewport. */
  scrollDim?: number;
  className?: string;
};

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERT = /* glsl */ `
uniform float uTime, uFreq, uAmp, uShape, uTwist, uPush, uSize, uPixelRatio;
uniform vec3 uOffset, uPointer;
attribute vec3 aSeed;
varying float vMix; varying float vR;
${NOISE}
vec3 flow(vec3 p){
  return vec3(snoise(p), snoise(p+vec3(31.4,-12.7,5.1)), snoise(p+vec3(-7.3,19.9,43.2)));
}
void main(){
  float TAU = 6.2831853;
  float u = aSeed.x * TAU;
  float v = acos(2.0 * aSeed.y - 1.0);
  vec3 sph = vec3(sin(v)*cos(u), cos(v), sin(v)*sin(u)) * (1.15 + 0.3*aSeed.z);
  float R = 1.15; float r = 0.42 * (0.55 + 0.45*aSeed.z);
  float a2 = aSeed.y * TAU;
  vec3 tor = vec3((R + r*cos(a2))*cos(u), r*sin(a2), (R + r*cos(a2))*sin(u));
  vec3 p = mix(sph, tor, uShape);
  float tw = uTwist * p.y;
  p.xz = mat2(cos(tw), -sin(tw), sin(tw), cos(tw)) * p.xz;

  vec3 q = p;
  float t = uTime * 0.12;
  for (int i = 0; i < 4; i++) {
    q += flow(q * uFreq + uOffset + vec3(0.0, 0.0, t)) * uAmp * 0.25;
  }
  vec3 d = q - uPointer;
  q += normalize(d + 1e-4) * uPush * exp(-dot(d, d) * 1.6) * 0.6;

  vec4 mv = modelViewMatrix * vec4(q, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.55 + aSeed.z) / -mv.z;
  vMix = clamp(length(q - p) / (uAmp * 0.9 + 0.001), 0.0, 1.0);
  vR = aSeed.z;
}`;

const FRAG = /* glsl */ `
uniform vec3 uC1, uC2, uC3; uniform float uOpacity;
varying float vMix; varying float vR;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d);
  vec3 col = mix(uC1, uC2, smoothstep(0.1, 0.9, vMix));
  col = mix(col, uC3, step(0.86, vR) * 0.85);
  gl_FragColor = vec4(col, a * uOpacity);
}`;

export default function HeroField({
  colors = ["#1E88E5", "#5CE1E6", "#E6F7FF"],
  particles = 120000,
  opacity = 0.45,
  shape = 0,
  scrollLinked = false,
  scrollDim = 0.25,
  className,
}: HeroFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = Math.min(window.innerWidth, window.innerHeight) < 700;
    const count = Math.round(isSmall ? particles * 0.4 : particles);
    // Phones put the densest part of the field right behind body text
    const baseOpacity = isSmall ? opacity * 0.7 : opacity;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL: the hero simply shows its normal background.
    }
    // Soft background: 1.5x is visually indistinguishable from 2x and far cheaper
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0.4, isSmall ? 6.4 : 4.6);

    const geo = new THREE.BufferGeometry();
    const seeds = new Float32Array(count * 3);
    for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);

    const uniforms = {
      uTime: { value: 0 },
      uFreq: { value: 0.85 },
      uAmp: { value: 0.8 },
      uShape: { value: shape },
      uTwist: { value: 0.8 },
      uOffset: { value: new THREE.Vector3(Math.random() * 50, Math.random() * 50, Math.random() * 50) },
      uPointer: { value: new THREE.Vector3(99, 99, 99) },
      uPush: { value: 0 },
      uSize: { value: isSmall ? 26 : 22 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uOpacity: { value: baseOpacity },
      uC1: { value: new THREE.Color(colors[0]) },
      uC2: { value: new THREE.Color(colors[1]) },
      uC3: { value: new THREE.Color(colors[2]) },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Adaptive quality: seeds are random, so drawing a prefix of the buffer
    // is an even thinning of the whole field. Only ever steps down.
    const minCount = Math.round(count * 0.3);
    let drawCount = count;

    // Size to the container, not the window
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      uniforms.uPixelRatio.value = renderer.getPixelRatio();
      if (reduceMotion) renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    // Cursor: gentle parallax plus a soft push where the pointer is.
    // Listens on window so the canvas never blocks clicks on hero content.
    const pointer = new THREE.Vector2(0, 0);
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hit = new THREE.Vector3();
    const onMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      ray.setFromCamera(pointer, camera);
      if (ray.ray.intersectPlane(plane, hit)) {
        uniforms.uPointer.value.lerp(hit, 0.25);
        uniforms.uPush.value = Math.min(uniforms.uPush.value + 0.08, 1);
      }
    };
    if (!reduceMotion) window.addEventListener("pointermove", onMove, { passive: true });

    // Scroll link: targets are eased toward in the frame loop.
    // Page height is cached so scroll events never force a layout.
    let targetOpacity = baseOpacity;
    let targetShape = shape;
    let pageHeight = document.documentElement.scrollHeight;
    const pageRo = new ResizeObserver(() => {
      pageHeight = document.documentElement.scrollHeight;
    });
    if (scrollLinked) pageRo.observe(document.body);
    const onScroll = () => {
      const vh = window.innerHeight || 1;
      const y = window.scrollY;
      const fade = Math.min(y / vh, 1);
      targetOpacity = baseOpacity * (1 - fade * (1 - scrollDim));
      const rest = Math.max(pageHeight - vh * 2, 1);
      const t = Math.min(Math.max((y - vh) / rest, 0), 1);
      targetShape = shape + (1 - shape) * t * t * (3 - 2 * t);
      if (reduceMotion) {
        // No animation: jump straight to the new state and draw once
        uniforms.uOpacity.value = targetOpacity;
        uniforms.uShape.value = targetShape;
        renderer.render(scene, camera);
      }
    };
    if (scrollLinked) {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    // Only animate when the hero is on screen and the tab is visible
    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
    });
    io.observe(mount);
    const onVisibility = () => { if (!document.hidden) start(); };
    document.addEventListener("visibilitychange", onVisibility);

    // If the GPU drops the context, stop drawing instead of freezing; three.js
    // rebuilds its resources on restore and the loop picks back up.
    let contextLost = false;
    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onContextRestored = () => {
      contextLost = false;
      if (reduceMotion) renderer.render(scene, camera);
      else start();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener("webglcontextrestored", onContextRestored);

    // Frame-time budget: below ~45fps, thin the field, then drop resolution
    let sampleStart = 0;
    let sampleFrames = 0;
    let warmedUp = false; // first window includes shader compile
    const adapt = (now: number) => {
      if (!sampleStart) {
        sampleStart = now;
        sampleFrames = 0;
        return;
      }
      sampleFrames++;
      const elapsed = now - sampleStart;
      if (elapsed < 1000) return;
      const avg = elapsed / sampleFrames;
      sampleStart = now;
      sampleFrames = 0;
      if (!warmedUp) {
        warmedUp = true;
        return;
      }
      if (avg <= 22) return;
      if (drawCount > minCount) {
        drawCount = Math.max(minCount, Math.round(drawCount * 0.7));
        geo.setDrawRange(0, drawCount);
      } else if (renderer.getPixelRatio() > 1) {
        renderer.setPixelRatio(1);
        resize();
      }
    };

    const clock = new THREE.Clock();
    let raf = 0;
    const frame = (now: number) => {
      raf = 0;
      if (!onScreen || document.hidden || contextLost) return;
      adapt(now);
      const dt = Math.min(clock.getDelta(), 0.05);
      uniforms.uTime.value += dt;
      uniforms.uPush.value *= Math.exp(-dt * 1.5);
      points.rotation.y += dt * 0.05;
      points.rotation.x += (pointer.y * 0.15 - points.rotation.x) * 0.03;
      const ease = 1 - Math.exp(-dt * 4);
      uniforms.uOpacity.value += (targetOpacity - uniforms.uOpacity.value) * ease;
      uniforms.uShape.value += (targetShape - uniforms.uShape.value) * ease;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    function start() {
      if (reduceMotion || raf || contextLost) return;
      clock.getDelta();
      sampleStart = 0; // don't count a pause as a slow frame
      raf = requestAnimationFrame(frame);
    }

    if (reduceMotion) renderer.render(scene, camera); // single still frame
    else start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      pageRo.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
    // Re-init only if these change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particles, shape, opacity, scrollLinked, scrollDim, colors.join(",")]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={className}
      style={{
        pointerEvents: "none",
        // Fades the edges so it sits behind text without a hard frame
        maskImage: "radial-gradient(ellipse at center, #000 35%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, #000 35%, transparent 75%)",
      }}
    />
  );
}
