"use client";

import { useEffect, useState } from "react";
import { TOAST_EVENT, type ToastDetail } from "@/lib/toast";

/** Bottom-right notices (for example "Email copied."). Announced to screen readers; each one fades out after a few seconds. */
export function Toaster() {
  const [items, setItems] = useState<(ToastDetail & { leaving?: boolean })[]>([]);
  useEffect(() => {
    const timers: number[] = [];
    const onToast = (e: Event) => {
      const d = (e as CustomEvent<ToastDetail>).detail;
      setItems((list) => [...list.slice(-2), d]);
      timers.push(window.setTimeout(() => setItems((l) => l.map((t) => (t.id === d.id ? { ...t, leaving: true } : t))), 3600));
      timers.push(window.setTimeout(() => setItems((l) => l.filter((t) => t.id !== d.id)), 4000));
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      timers.forEach(window.clearTimeout);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2" role="status" aria-live="polite">
      {items.map((t) => (
        <div
          key={t.id}
          className="toast-in pointer-events-auto flex max-w-[min(360px,calc(100vw-32px))] items-start gap-2.5 rounded-xl px-4 py-3 text-sm transition-opacity duration-300"
          style={{
            opacity: t.leaving ? 0 : 1,
            border: "1px solid rgba(var(--neural-cyan), 0.22)",
            background: "rgba(var(--neural-surface), 0.94)",
            color: "rgb(var(--neural-text))",
            fontFamily: "var(--font-display)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
          }}
        >
          <span aria-hidden="true" className="mt-[3px] text-xs" style={{ color: t.kind === "error" ? "rgb(255,112,120)" : "rgb(var(--neural-text))" }}>
            {t.kind === "error" ? "✕" : "✓"}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
