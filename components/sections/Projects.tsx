"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { projects } from "@/components/projects/projectData";

const OrpheusWaveform = dynamic(
  () => import("@/components/three/OrpheusWaveform").then((mod) => mod.OrpheusWaveform),
  { ssr: false, loading: () => <div className="w-full h-full bg-surface-2/40" /> },
);

/* ── Media map ─────────────────────────────────────────────── */
const PROJECT_IMAGES: Record<string, string> = {
  "orpheus-tts":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBGH2997hdFF4MNkLoOVa73F1hrtN2wecl2WKdJZynfB8Ky6yL87-1wy8zzq6YAKIFqSuiWHIa2ov923KqQLfXuHiLASFeEoTgIjH1ay-1haw_abu9mLDW6IShx_kD2SYsOz7hWJeb4v3OaLRCOZ7Skr_oXxjLFzTHB5Pv6-080_DG9ozG8SL87AD0a2EdyeO-6modikW4H53IyV6mXqHvYzX1DpXupcETbsu9mHqzSic-yz4JL0gB4tEnU9kBthfqXyAMisAmOg2U",
  "smart-pathshala": "/smart-pathshala.png",
  "legify":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDmquO-TmvSCNWbbe3E2ce4ZvzVkXzXPDXSxrgBOAc512e84U_4uGrk4iOi7sgll_Xm1aAcYVAygiuL0dBsZssU2NbzmG9iXOBN3kRNgFMLzd1cxpWYQnwmhc1kpQ5hseRWnHKwEqlYGIZo3vebhj9HsJedMzw09zEiUB5qboZqbbklWVnak8qeXa98BTSV9RfPrlDF_2SJncZG9wULo9Jpf07t5X40DocuWeo8EZNk2fVXzmNnY58mSuHysPTpA1gn4F2qFRDDG8A",
};

const PROJECT_VIDEOS: Record<string, string> = {
  "shetniyojan": "/shetniyojan.mp4",
};

const PROJECT_WAVEFORM = new Set(["orpheus-tts"]);

const VIDEO_CLIP_END = 10; // seconds

const ACCENT_HEX: Record<string, string> = {
  "orpheus-tts": "#a8e8ff",
  "smart-pathshala": "#dcb8ff",
  "shetniyojan": "#00d4ff",
  "legify": "#d9dfe9",
};

const FALLBACK_IMAGES = Object.values(PROJECT_IMAGES);
const FALLBACK_HEX = Object.values(ACCENT_HEX);

function getPrimaryLink(links?: Record<string, string>): string | null {
  if (!links) return null;
  return links.github ?? links.model ?? links.demo ?? Object.values(links)[0] ?? null;
}

function ProjectImageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={alt}
        draggable={false}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
      />
    );
  }

  return (
    <div className="grid w-full h-full grid-cols-2 grid-rows-2 gap-1">
      {images.slice(0, 4).map((src, index) => (
        <div key={src} className="relative overflow-hidden">
          <img
            src={src}
            alt={`${alt} screenshot ${index + 1}`}
            draggable={false}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
          />
        </div>
      ))}
    </div>
  );
}

/* ── Video Card (isolated so it has its own ref + state) ───── */
function VideoCard({
  src,
  accentColor,
}: {
  src: string;
  accentColor: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Loop within 0–10 s
  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.currentTime >= VIDEO_CLIP_END) {
      v.currentTime = 0;
      if (playing) v.play();
    }
    setProgress((v.currentTime / VIDEO_CLIP_END) * 100);
  }, [playing]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(14,20,26,0.9))" }}
      />

      {/* Play / pause button */}
      <button
        onClick={togglePlay}
        className="absolute bottom-3 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-10"
        style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          border: `1px solid ${accentColor}50`,
        }}
        aria-label={playing ? "Pause" : "Play"}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "16px", color: accentColor }}
        >
          {playing ? "pause" : "play_arrow"}
        </span>
      </button>

      {/* 10-second clip progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        <div
          className="h-full transition-none"
          style={{ width: `${progress}%`, background: accentColor }}
        />
      </div>

      {/* Live demo badge */}
      <span
        className="absolute bottom-3 left-4 text-[9px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 z-10"
        style={{
          fontFamily: "var(--font-display), monospace",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          color: accentColor,
          border: `1px solid ${accentColor}40`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: accentColor,
            animation: playing ? "pulse 1.5s ease-in-out infinite" : "none",
          }}
        />
        {playing ? "Live Demo" : "Paused"}
      </span>
    </div>
  );
}

/* ── Main Projects section ─────────────────────────────────── */
export function Projects() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);

  // Momentum scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const rafId = useRef<number | null>(null);

  /* track scroll position */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const available = el.scrollWidth - el.clientWidth;
      const pct = available > 0 ? (el.scrollLeft / available) * 100 : 0;
      setScrollPct(Math.round(pct));
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-project-card='true']"));
      if (!cards.length) return;

      const scrollCenter = el.scrollLeft + el.clientWidth / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - scrollCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      setActiveIdx(nearestIndex);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  /* Cancel any running momentum animation */
  const cancelMomentum = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  };

  const applyMomentum = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    velocity.current *= 0.92; // friction
    if (Math.abs(velocity.current) < 0.5) {
      velocity.current = 0;
      return;
    }
    el.scrollLeft += velocity.current;
    rafId.current = requestAnimationFrame(applyMomentum);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button, a, video")) return;
    cancelMomentum();
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = scrollRef.current?.scrollLeft ?? 0;
    lastX.current = e.pageX;
    lastTime.current = Date.now();
    velocity.current = 0;
    const track = e.currentTarget as HTMLDivElement;
    track.style.userSelect = "none";
    track.style.cursor = "grabbing";
    track.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const dx = e.pageX - startX.current;
    scrollRef.current.scrollLeft = scrollStart.current - dx;

    // track velocity
    const now = Date.now();
    const dt = now - lastTime.current || 1;
    velocity.current = ((lastX.current - e.pageX) / dt) * 16;
    lastX.current = e.pageX;
    lastTime.current = now;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const track = e.currentTarget as HTMLDivElement;
    track.style.userSelect = "";
    track.style.cursor = "grab";
    // kick off momentum
    if (Math.abs(velocity.current) > 1) {
      rafId.current = requestAnimationFrame(applyMomentum);
    }
  };

  const scrollToCard = (idx: number) => {
    cancelMomentum();
    const el = scrollRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-project-card='true']"));
    cards[idx]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <section id="projects" className="relative z-10 pt-28 pb-16">
      {/* Section header */}
      <div className="px-8 md:px-20 mb-10 flex flex-col md:flex-row md:items-end gap-4">
        <div>
          <p
            className="text-[10px] text-neural-cyan uppercase tracking-[0.2em] mb-2"
            style={{ fontFamily: "var(--font-display), monospace" }}
          >
            Manifest_v{projects.length}.0
          </p>
          <h2
            className="text-7xl md:text-8xl font-bold tracking-tighter leading-none"
            style={{ fontFamily: "var(--font-display), monospace" }}
          >
            THE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#a8e8ff] to-[#dcb8ff]">
              FORGE
            </span>
          </h2>
        </div>
        <p className="md:ml-auto md:text-right max-w-xs text-text-soft text-sm leading-relaxed">
          Incubating neural architectures and decentralized systems. A gallery of
          synthetic intelligence.
        </p>
      </div>

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        className="flex gap-6 px-8 md:px-20 pb-6"
        style={{
          overflowX: "auto",
          overflowY: "visible",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          cursor: isDragging.current ? "grabbing" : "grab",
          WebkitOverflowScrolling: "touch",
          willChange: "scroll-position",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="flex-shrink-0 w-2" aria-hidden />

        {projects.map((project, idx) => {
          const img = PROJECT_IMAGES[project.id] ?? FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
          const color = ACCENT_HEX[project.id] ?? FALLBACK_HEX[idx % FALLBACK_HEX.length];
          const primaryLink = getPrimaryLink(project.links);
          const topMetric = project.metrics?.[0];
          const isActive = activeIdx === idx;
          const videoSrc = PROJECT_VIDEOS[project.id];
          const isWaveform = PROJECT_WAVEFORM.has(project.id);
          const galleryImages = project.images?.length ? project.images : [img];

          return (
            <div
              key={project.id}
              data-project-card="true"
              className="group flex-shrink-0 transition-all duration-300"
              style={{
                width: "min(80vw, 680px)",
                borderRadius: "2.5rem",
                background: "rgba(20, 27, 35, 0.85)",
                backdropFilter: "blur(32px)",
                border: `1px solid ${isActive ? color + "45" : "rgba(255,255,255,0.06)"}`,
                boxShadow: isActive ? `0 0 48px ${color}18` : "none",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transform: isActive ? "translateY(-4px)" : "translateY(0)",
                transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              {/* Media panel */}
              <div className="relative flex-shrink-0 overflow-hidden" style={{ height: "220px" }}>
                {isWaveform ? (
                  <div className="w-full h-full" style={{ background: "rgba(8,12,18,0.8)" }}>
                    <OrpheusWaveform />
                  </div>
                ) : videoSrc ? (
                  <VideoCard src={videoSrc} accentColor={color} />
                ) : project.images?.length ? (
                  <ProjectImageGallery images={project.images} alt={project.name} />
                ) : (
                  <ProjectImageGallery images={galleryImages} alt={project.name} />
                )}

                {!(isWaveform || videoSrc) && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(14,20,26,0.9))" }}
                  />
                )}

                {/* Accent dot */}
                <div
                  className="absolute top-4 left-5 w-2 h-2 rounded-full"
                  style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                />

                {project.featured && (
                  <span
                    className="absolute top-3 right-4 text-[9px] uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{
                      fontFamily: "var(--font-display), monospace",
                      background: `${color}20`,
                      color,
                      border: `1px solid ${color}40`,
                    }}
                  >
                    Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-7">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-display), monospace", color }}
                  >
                    {project.stack[0]}
                  </span>
                  <span
                    className="text-[10px] text-text-muted"
                    style={{ fontFamily: "var(--font-display), monospace" }}
                  >
                    {project.period.slice(0, 4)}
                  </span>
                </div>

                <h3
                  className="text-2xl font-bold mb-2 transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-display), monospace",
                    color: isActive ? color : undefined,
                  }}
                >
                  {project.name}
                </h3>
                <p className="text-sm text-text-soft leading-relaxed mb-4 line-clamp-2">
                  {project.tagline}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {project.stack.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-[10px]"
                      style={{
                        fontFamily: "var(--font-display), monospace",
                        background: `${color}0d`,
                        border: `1px solid ${color}20`,
                        color: "rgba(221,227,236,0.7)",
                      }}
                    >
                      {t.toUpperCase()}
                    </span>
                  ))}
                  {project.stack.length > 4 && (
                    <span
                      className="px-3 py-1 rounded-full text-[10px] text-text-muted"
                      style={{ fontFamily: "var(--font-display), monospace" }}
                    >
                      +{project.stack.length - 4}
                    </span>
                  )}
                </div>

                {topMetric && (
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl mb-5"
                    style={{ background: `${color}0d`, border: `1px solid ${color}20` }}
                  >
                    <span
                      className="text-xl font-bold"
                      style={{ fontFamily: "var(--font-display), monospace", color }}
                    >
                      {topMetric.value}
                      {topMetric.unit && (
                        <span className="text-xs ml-1 opacity-70">{topMetric.unit}</span>
                      )}
                    </span>
                    <span
                      className="text-xs text-text-soft leading-snug"
                      style={{ fontFamily: "var(--font-display), monospace" }}
                    >
                      {topMetric.detail}
                    </span>
                  </div>
                )}

                <div className="mt-auto flex items-center gap-3">
                  {primaryLink ? (
                    <a
                      href={primaryLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
                      style={{
                        fontFamily: "var(--font-display), monospace",
                        border: `1px solid ${color}40`,
                        color,
                        background: `${color}10`,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background = `${color}25`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background = `${color}10`;
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                        open_in_new
                      </span>
                      View Project
                    </a>
                  ) : (
                    <span
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest opacity-40"
                      style={{
                        fontFamily: "var(--font-display), monospace",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                        lock
                      </span>
                      Private
                    </span>
                  )}
                  {project.links &&
                    Object.entries(project.links).length > 1 &&
                    Object.entries(project.links)
                      .slice(1, 2)
                      .map(([key, url]) => (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] uppercase tracking-widest text-text-muted hover:text-neural-cyan transition-colors"
                          style={{ fontFamily: "var(--font-display), monospace" }}
                        >
                          {key} ↗
                        </a>
                      ))}
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex-shrink-0 w-2" aria-hidden />
      </div>

      {/* Controls */}
      <div className="px-8 md:px-20 mt-5 flex items-center gap-5">
        <div className="flex gap-2">
          {projects.map((p, i) => {
            const color = ACCENT_HEX[p.id] ?? FALLBACK_HEX[i % FALLBACK_HEX.length];
            return (
              <button
                key={p.id}
                onClick={() => scrollToCard(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: activeIdx === i ? "28px" : "8px",
                  height: "8px",
                  background: activeIdx === i ? color : "rgba(255,255,255,0.15)",
                  boxShadow: activeIdx === i ? `0 0 10px ${color}` : "none",
                }}
                aria-label={`Go to ${p.name}`}
                suppressHydrationWarning
              />
            );
          })}
        </div>

        <div className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-150"
            style={{
              width: `${scrollPct}%`,
              background: "linear-gradient(to right, #a8e8ff, #dcb8ff)",
            }}
          />
        </div>

        <span
          className="text-[10px] text-text-muted whitespace-nowrap"
          style={{ fontFamily: "var(--font-display), monospace" }}
        >
          {projects.length} projects
        </span>
      </div>
    </section>
  );
}
