"use client";

export function Footer() {
  return (
    <footer className="border-t border-[var(--accent-border)]/20 py-8 px-6">
      <div className="container-main flex flex-col md:flex-row items-center justify-between gap-4">
        <p
          className="text-[var(--text-muted)] text-sm"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          &copy; {new Date().getFullYear()} Yuvraj Sanghai
        </p>
        <p
          className="text-[var(--text-muted)] text-xs"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          // built with systems thinking
        </p>
      </div>
    </footer>
  );
}
