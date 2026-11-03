"use client";

import { useEffect, useRef, useState } from "react";
import { OrpheusWaveform } from "@/components/three/OrpheusWaveform";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import type { Project } from "./projectData";

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Still image that plays a muted clip while hovered or focused. */
function HoverVideo({
  image,
  video,
  alt,
  watchHref,
  fit = "cover",
}: {
  image: string;
  video: string;
  alt: string;
  watchHref?: string;
  fit?: "cover" | "contain";
}) {
  const fitClass = fit === "contain" ? "object-contain" : "object-cover object-top";
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = ref.current;
    if (!v || reduced()) return;
    v.currentTime = 0;
    void v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };
  const stop = () => {
    ref.current?.pause();
    setPlaying(false);
  };

  return (
    <div className="absolute inset-0" style={{ background: "#0a0a0a" }} onMouseEnter={play} onMouseLeave={stop} onFocus={play} onBlur={stop}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={alt} loading="lazy" decoding="async" draggable={false} className={`h-full w-full ${fitClass}`} />
      <video
        ref={ref}
        src={video}
        poster={image}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        className={`pointer-events-none absolute inset-0 h-full w-full ${fitClass} transition-opacity duration-500`}
        style={{ opacity: playing ? 1 : 0 }}
      />
      <span
        className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-widest transition-opacity duration-300"
        style={{
          fontFamily: "var(--font-display), monospace",
          background: "rgba(8,12,18,0.7)",
          border: "1px solid rgba(255,255,255,0.15)",
          opacity: playing ? 0 : 1,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
          play_arrow
        </span>
        Hover to preview
      </span>
      {watchHref && (
        <a
          href={watchHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 right-4 z-10 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-widest"
          style={{
            fontFamily: "var(--font-display), monospace",
            background: "rgba(8,12,18,0.7)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          Watch demo ↗
        </a>
      )}
    </div>
  );
}

/* Slow crossfade through screenshots. */
function Slides({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reduced() || images.length < 2) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % images.length), 3200);
    return () => window.clearInterval(t);
  }, [visible, images.length]);

  return (
    <div ref={root} className="absolute inset-0">
      {images.map((src, n) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={n === 0 ? alt : ""}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-[900ms]"
          style={{ opacity: n === i ? 1 : 0 }}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-3 right-4 flex gap-1.5" aria-hidden>
          {images.map((_, n) => (
            <span
              key={n}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: n === i ? 18 : 6, background: n === i ? "#fff" : "rgba(255,255,255,0.35)" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectCover({ project }: { project: Project }) {
  const c = project.cover;

  if (c.kind === "hover-video") {
    return <HoverVideo image={c.image} video={c.video} alt={`${project.name} preview`} watchHref={c.watchHref} fit={c.fit} />;
  }
  if (c.kind === "slides") {
    return <Slides images={c.images} alt={`${project.name} screenshots`} />;
  }
  if (c.kind === "waveform") {
    return (
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(168,232,255,0.10), rgba(8,12,18,0.9) 70%)" }}>
        <OrpheusWaveform />
      </div>
    );
  }
  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-5"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(171,138,255,0.16), transparent 60%), radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px) 0 0 / 18px 18px, rgb(10,14,20)",
      }}
    >
      <ArchitectureDiagram nodes={project.architecture.nodes} edges={project.architecture.edges} compact className="h-full w-full" />
    </div>
  );
}
