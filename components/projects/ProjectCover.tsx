"use client";

import { useEffect, useRef, useState } from "react";
import { OrpheusOrb } from "@/components/three/OrpheusOrb";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { ParallaxMedia } from "@/components/ui/Parallax";
import { useLite } from "@/lib/lite";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import type { Project } from "./projectData";

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Clip that plays while the tile is on screen. The poster shows first and when motion is reduced. */
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
  return (
    <div className="absolute inset-0" style={{ background: "#080808" }} role="img" aria-label={alt}>
      {/* Letterboxed clips are shown whole, so they must not be scaled up for parallax. */}
      {fit === "contain" ? (
        <LoopVideo src={video} poster={image} fit={fit} />
      ) : (
        <ParallaxMedia>
          <LoopVideo src={video} poster={image} fit={fit} className="object-top" />
        </ParallaxMedia>
      )}
      {watchHref && (
        <a
          href={watchHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 right-4 z-10 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-widest"
          style={{
            fontFamily: "var(--font-display), monospace",
            background: "rgba(12,12,12,0.7)",
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
  const lite = useLite();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || lite || reduced() || images.length < 2) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % images.length), 3200);
    return () => window.clearInterval(t);
  }, [visible, lite, images.length]);

  return (
    <div ref={root} className="absolute inset-0 overflow-hidden">
      <ParallaxMedia>
      {images.map((src, n) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={n === 0 ? alt : ""}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="tile-anim absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-[900ms]"
          style={{ opacity: n === i ? 1 : 0, animation: n === i ? "kenburns 6.5s ease-out forwards" : "none" }}
        />
      ))}
      </ParallaxMedia>
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
    return <OrpheusOrb />;
  }
  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-5"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(172,172,172,0.16), transparent 60%), radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px) 0 0 / 18px 18px, rgb(14,14,14)",
      }}
    >
      <ArchitectureDiagram nodes={project.architecture.nodes} edges={project.architecture.edges} compact className="h-full w-full" />
    </div>
  );
}
