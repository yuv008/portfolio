"use client";

import type { ReactNode } from "react";

interface TerminalBlockProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function TerminalBlock({
  title = "terminal",
  children,
  className = "",
}: TerminalBlockProps) {
  return (
    <div
      className={`rounded-lg border border-[var(--accent-border)] overflow-hidden ${className}`}
      style={{ background: "var(--bg-elevated)" }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--accent-border)]/30">
        <span
          className="w-[10px] h-[10px] rounded-full"
          style={{ background: "var(--signal-red)" }}
        />
        <span
          className="w-[10px] h-[10px] rounded-full"
          style={{ background: "var(--signal-amber)" }}
        />
        <span
          className="w-[10px] h-[10px] rounded-full"
          style={{ background: "var(--signal-green)" }}
        />
        <span
          className="ml-2 text-xs"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "var(--text-muted)",
          }}
        >
          {title}
        </span>
      </div>
      {/* Content */}
      <div
        className="p-6 text-sm leading-relaxed"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {children}
      </div>
    </div>
  );
}
