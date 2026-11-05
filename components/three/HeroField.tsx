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
uniform float uTime, uFreq, uAmp, uShape, uTwist, uSize, uPixelRatio;
uniform vec3 uOffset;
attribute vec3 aSeed;
varying float vMix; varying float vR; varying float vNear;
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
  for (int i = 0; i < 1; i++) {
    q += flow(q * uFreq + uOffset + vec3(0.0, 0.0, t)) * uAmp * 0.8;
  }

  vec4 mv = modelViewMatrix * vec4(q, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = min(uSize * uPixelRatio * (0.55 + aSeed.z) / -mv.z, 46.0 * uPixelRatio);
  vNear = smoothstep(0.35, 1.7, -mv.z); // dots that fly past the camera dissolve instead of becoming blobs
  vMix = clamp(length(q - p) / (uAmp * 0.9 + 0.001), 0.0, 1.0);
  vR = aSeed.z;
}`;

const FRAG = /* glsl */ `
uniform vec3 uC1, uC2, uC3; uniform float uOpacity;
varying float vMix; varying float vR; varying float vNear;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d);
  vec3 col = mix(uC1, uC2, smoothstep(0.1, 0.9, vMix));
  col = mix(col, uC3, step(0.86, vR) * 0.85);
  gl_FragColor = vec4(col, a * uOpacity * vNear);
}`;

export default function HeroField({
  colors = ["#888888", "#dbdbdb", "#f4f4f4"],
  particles = 32000,
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
    // The background is decorative, so render at device-independent resolution.
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    const baseZ = isSmall ? 6.4 : 4.6;
    camera.position.set(0, 0.4, baseZ);

    // Two layers give real parallax: a dense, distant cloud and a sparse, larger one that sits nearer the
    // camera. The camera pans and dollies, so the near layer slides further than the far one.
    const nearCount = scrollLinked ? Math.round(count * 0.1) : 0;
    const farCount = count - nearCount;
    const makeGeo = (n: number) => {
      const g = new THREE.BufferGeometry();
      const sd = new Float32Array(n * 3);
      for (let i = 0; i < sd.length; i++) sd[i] = Math.random();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      g.setAttribute("aSeed", new THREE.BufferAttribute(sd, 3));
      g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
      return g;
    };
    const geo = makeGeo(farCount);
    const geoNear = nearCount ? makeGeo(nearCount) : null;

    const uniforms = {
      uTime: { value: 0 },
      uFreq: { value: 0.85 },
      uAmp: { value: 0.8 },
      uShape: { value: shape },
      uTwist: { value: 0.8 },
      uOffset: { value: new THREE.Vector3(Math.random() * 50, Math.random() * 50, Math.random() * 50) },
      uSize: { value: isSmall ? 18 : 16 },
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

    const nearUniforms = THREE.UniformsUtils.clone(uniforms);
    nearUniforms.uSize.value = uniforms.uSize.value * 2.1;
    const matNear = new THREE.ShaderMaterial({
      uniforms: nearUniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const near = geoNear ? new THREE.Points(geoNear, matNear) : null;
    if (near) {
      near.scale.setScalar(1.75);
      near.position.set(0.2, -0.1, 0.9);
      scene.add(near);
    }

    // Adaptive quality: seeds are random, so drawing a prefix of the buffer
    // is an even thinning of the whole field. Only ever steps down.
    const minCount = Math.round(farCount * 0.3);
    let drawCount = farCount;

    // Camera path, in three moves as you scroll the page:
    //   1. the cloud eases from the right of the hero to just right of centre,
    //   2. then the camera dollies in, so the cloud comes toward you and the near dots fly past,
    //   3. and in the last stretch it settles very slightly to the left.
    // Everything is eased in the frame loop, and the top of the page is exactly the hero as before.
    const RIGHT = 0.22; // how far right of centre the cloud starts (fraction of the window width)
    const DOLLY = isSmall ? 1.0 : 1.7; // world units the camera moves toward the cloud
    const X_KEYS: [number, number][] = [[0, RIGHT], [0.22, 0.04], [0.72, 0.0], [1, -0.06]];
    const Z_KEYS: [number, number][] = [[0, 0], [0.22, 0], [0.72, 1], [1, 1]]; // fraction of DOLLY
    const through = (p: number, keys: [number, number][]) => {
      for (let i = 1; i < keys.length; i++) {
        if (p <= keys[i][0]) {
          const [p0, v0] = keys[i - 1];
          const [p1, v1] = keys[i];
          const t = Math.min(Math.max((p - p0) / (p1 - p0), 0), 1);
          return v0 + (v1 - v0) * (t * t * (3 - 2 * t));
        }
      }
      return keys[keys.length - 1][1];
    };
    let camF = scrollLinked ? RIGHT : 0;
    let camZ = baseZ;
    let targetF = camF;
    let targetZ = camZ;
    let approach = 0; // 0 at the top, 1 when the camera is closest; used to ease the opacity a little
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const unitW = () => 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    const applyCamera = () => {
      const wide = scrollLinked && (mount.clientWidth || 1) >= 900;
      camera.position.x = -(wide ? camF : 0) * unitW() * camZ + pointer.x * 0.12;
      camera.position.y = 0.4 - pointer.y * 0.06;
      camera.position.z = camZ;
    };
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      applyCamera();
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      uniforms.uPixelRatio.value = renderer.getPixelRatio();
      nearUniforms.uPixelRatio.value = renderer.getPixelRatio();
      if (reduceMotion) renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

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
      const progress = Math.min(Math.max(y / Math.max(pageHeight - vh, 1), 0), 1);
      targetF = through(progress, X_KEYS);
      approach = through(progress, Z_KEYS);
      targetZ = baseZ - DOLLY * approach;
      // The closer the cloud comes, the more transparent it gets, so text stays readable.
      targetOpacity *= 1 - 0.28 * approach;
      const rest = Math.max(pageHeight - vh * 2, 1);
      const t = Math.min(Math.max((y - vh) / rest, 0), 1);
      targetShape = shape + (1 - shape) * t * t * (3 - 2 * t);
      if (reduceMotion) {
        // No animation: jump straight to the new state and draw once
        uniforms.uOpacity.value = targetOpacity;
        uniforms.uShape.value = targetShape;
        nearUniforms.uOpacity.value = targetOpacity * 0.55;
        nearUniforms.uShape.value = targetShape;
        camF = targetF;
        camZ = targetZ;
        applyCamera();
        renderer.render(scene, camera);
      }
    };
    if (scrollLinked) {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
    // A little cursor depth on desktop: the near layer follows the pointer more than the far one.
    const finePointer = window.matchMedia("(pointer: fine)").matches && !isSmall;
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (scrollLinked && finePointer && !reduceMotion) window.addEventListener("pointermove", onPointer, { passive: true });

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

    // If rendered frames fall below ~26fps, progressively thin the field.
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
      if (avg <= 38) return;
      if (drawCount > minCount) {
        drawCount = Math.max(minCount, Math.round(drawCount * 0.7));
        geo.setDrawRange(0, drawCount);
        geoNear?.setDrawRange(0, Math.round(drawCount * (nearCount / Math.max(farCount, 1))));
      } else if (renderer.getPixelRatio() > 1) {
        renderer.setPixelRatio(1);
        resize();
      }
    };

    let prevNow = 0; // timestamp of the last rendered frame, for the frame delta
    let raf = 0;
    let lastRenderAt = 0;
    const frame = (now: number) => {
      raf = 0;
      if (!onScreen || document.hidden || contextLost) return;
      if (lastRenderAt && now - lastRenderAt < 1000 / 30) {
        raf = requestAnimationFrame(frame);
        return;
      }
      lastRenderAt = now;
      adapt(now);
      const dt = prevNow ? Math.min((now - prevNow) / 1000, 0.05) : 0;
      prevNow = now;
      uniforms.uTime.value += dt;
      points.rotation.y += dt * 0.05;
      if (near) near.rotation.y += dt * 0.08;
      const ease = 1 - Math.exp(-dt * 4);
      const slow = 1 - Math.exp(-dt * 2.2); // the camera glides more slowly than the fades
      uniforms.uOpacity.value += (targetOpacity - uniforms.uOpacity.value) * ease;
      uniforms.uShape.value += (targetShape - uniforms.uShape.value) * ease;
      camF += (targetF - camF) * slow;
      camZ += (targetZ - camZ) * slow;
      pointer.x += (pointer.tx - pointer.x) * slow;
      pointer.y += (pointer.ty - pointer.y) * slow;
      applyCamera();
      nearUniforms.uTime.value = uniforms.uTime.value;
      nearUniforms.uShape.value = uniforms.uShape.value;
      nearUniforms.uOpacity.value = uniforms.uOpacity.value * 0.55;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    function start() {
      if (reduceMotion || raf || contextLost) return;
      prevNow = 0;
      lastRenderAt = 0;
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
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      geo.dispose();
      geoNear?.dispose();
      mat.dispose();
      matNear.dispose();
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
