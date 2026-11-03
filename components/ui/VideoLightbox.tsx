"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/** Full-screen video player. Mount it while open; call onClose to dismiss. */
export function VideoLightbox({
  src,
  poster,
  title,
  onClose,
}: {
  src: string;
  poster?: string;
  title: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-3 md:p-8"
      style={{ background: "rgba(4,7,11,0.86)", backdropFilter: "blur(6px)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-label={title} className="relative w-full max-w-5xl">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full text-text-soft hover:text-text-strong"
          style={{ background: "rgba(8,12,18,0.7)", border: "1px solid rgba(255,255,255,0.14)" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            close
          </span>
        </button>
        <video
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          className="w-full rounded-2xl"
          style={{ background: "#000", boxShadow: "0 24px 60px rgba(0,0,0,0.55)" }}
        />
        <p className="mt-3 text-center font-display text-[10px] uppercase tracking-[0.18em] text-text-muted">{title}</p>
      </div>
    </div>,
    document.body,
  );
}
