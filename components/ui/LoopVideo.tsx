"use client";

import { useEffect, useRef, useState } from "react";
import { isLite, LITE_EVENT } from "@/lib/lite";

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
  // The poster is a real image request, so it only starts loading once the video is close to the screen.
  const [near, setNear] = useState(false);
  const [posterOn, setPosterOn] = useState(false);

  const sync = () => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || isLite()) {
      v.pause();
      return;
    }
    if (visible.current && want.current) void v.play().catch(() => undefined);
    else v.pause();
  };

  useEffect(() => {
    want.current = playing;
    sync();
  }, [playing]);

  // Stacked clips (the Legion steps) all sit in one spot, so only the one in use loads its poster, and it stays loaded.
  useEffect(() => {
    if (near && playing) setPosterOn(true);
  }, [near, playing]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting && e.intersectionRatio >= 0.25;
        sync();
      },
      { threshold: [0, 0.25] },
    );
    io.observe(v);
    const preload = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "600px" });
    preload.observe(v);
    window.addEventListener(LITE_EVENT, sync);
    return () => {
      io.disconnect();
      preload.disconnect();
      window.removeEventListener(LITE_EVENT, sync);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={posterOn ? poster : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
    />
  );
}
