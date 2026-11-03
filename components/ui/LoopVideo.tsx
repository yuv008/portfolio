"use client";

import { useEffect, useRef } from "react";

/**
 * Muted looping clip that loads and plays only while it is on screen (and `playing`),
 * and shows its poster when motion is reduced. Nothing downloads until it is near view.
 */
export function LoopVideo({
  src,
  poster,
  className = "",
  fit = "cover",
  playing = true,
}: {
  src: string;
  poster?: string;
  className?: string;
  fit?: "cover" | "contain";
  playing?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const visible = useRef(false);
  const want = useRef(playing);

  const sync = () => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (visible.current && want.current) void v.play().catch(() => undefined);
    else v.pause();
  };

  useEffect(() => {
    want.current = playing;
    sync();
  }, [playing]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
    />
  );
}
