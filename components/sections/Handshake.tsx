"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, ExternalLink } from "lucide-react";

function GitHubSvg({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInSvg({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const socialLinks = {
  email: "yuvrajms008@gmail.com",
  phone: "+91-8378833508",
  github: "https://github.com/yuvraj008",
  linkedin: "https://linkedin.com/in/yuvraj008",
  huggingface: "https://huggingface.co/yuv008",
};

// ---------------------------------------------------------------------------
// Terminal script
// Each entry is either plain text or a link token so we can render anchors
// inside the typed output without stringifying markup.
// ---------------------------------------------------------------------------

type PlainSegment = { kind: "text"; value: string };
type LinkSegment = {
  kind: "link";
  display: string;
  href: string;
};
type Segment = PlainSegment | LinkSegment;

// We build the full terminal as a list of "lines", each line being a list of
// segments.  This lets the typing engine reveal characters progressively while
// still rendering real <a> elements for link segments.

const TERMINAL_LINES: Segment[][] = [
  [{ kind: "text", value: "$ whoami" }],
  [{ kind: "text", value: "Yuvraj Sanghai — Pune, India" }],
  [{ kind: "text", value: "" }],
  [{ kind: "text", value: "$ cat contact.json" }],
  [{ kind: "text", value: "{" }],
  [
    { kind: "text", value: '  "email": "' },
    {
      kind: "link",
      display: socialLinks.email,
      href: `mailto:${socialLinks.email}`,
    },
    { kind: "text", value: '",' },
  ],
  [{ kind: "text", value: `  "phone": "${socialLinks.phone}",` }],
  [
    { kind: "text", value: '  "github": "' },
    {
      kind: "link",
      display: "github.com/yuvraj008",
      href: socialLinks.github,
    },
    { kind: "text", value: '",' },
  ],
  [
    { kind: "text", value: '  "linkedin": "' },
    {
      kind: "link",
      display: "linkedin.com/in/yuvraj008",
      href: socialLinks.linkedin,
    },
    { kind: "text", value: '",' },
  ],
  [
    { kind: "text", value: '  "huggingface": "' },
    {
      kind: "link",
      display: "huggingface.co/yuv008",
      href: socialLinks.huggingface,
    },
    { kind: "text", value: '"' },
  ],
  [{ kind: "text", value: "}" }],
  [{ kind: "text", value: "" }],
  [{ kind: "text", value: '$ echo "Let\'s build something."' }],
  [{ kind: "text", value: "Let's build something." }],
];

// Pre-compute the total character count so the typing hook knows when to stop.
// Link segments count their display text as characters.
function segmentCharCount(seg: Segment): number {
  return seg.kind === "text" ? seg.value.length : seg.display.length;
}
const TOTAL_CHARS = TERMINAL_LINES.reduce(
  (sum, line) =>
    sum + line.reduce((s, seg) => s + segmentCharCount(seg), 0) + 1, // +1 for the newline
  0
);

// ---------------------------------------------------------------------------
// Custom hook: typing animation
// ---------------------------------------------------------------------------

function useTypingAnimation(active: boolean, charInterval = 30) {
  const [revealedChars, setRevealedChars] = useState(0);
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) return;

    let count = 0;

    function tick() {
      count += 1;
      setRevealedChars(count);
      if (count < TOTAL_CHARS) {
        rafRef.current = setTimeout(tick, charInterval);
      }
    }

    rafRef.current = setTimeout(tick, charInterval);

    return () => {
      if (rafRef.current !== null) clearTimeout(rafRef.current);
    };
  }, [active, charInterval]);

  return revealedChars;
}

// ---------------------------------------------------------------------------
// Helper: render terminal lines up to `revealedChars`
// ---------------------------------------------------------------------------

function renderTerminalContent(revealedChars: number): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let consumed = 0;

  for (let lineIdx = 0; lineIdx < TERMINAL_LINES.length; lineIdx++) {
    const line = TERMINAL_LINES[lineIdx];

    // Characters available for this line (excluding the trailing newline we
    // model implicitly).
    const lineCharTotal = line.reduce((s, seg) => s + segmentCharCount(seg), 0);

    if (consumed >= revealedChars) break; // nothing left to reveal

    const lineNodes: React.ReactNode[] = [];
    let lineConsumed = 0; // chars consumed within this line

    for (const seg of line) {
      const segLen = segmentCharCount(seg);
      const charsLeft = revealedChars - consumed - lineConsumed;

      if (charsLeft <= 0) break;

      const visible = Math.min(segLen, charsLeft);

      if (seg.kind === "text") {
        const text = seg.value.slice(0, visible);
        // Colour the prompt character cyan
        if (text.startsWith("$")) {
          lineNodes.push(
            <span key={`${lineIdx}-prompt`} style={{ color: "var(--accent)" }}>
              $
            </span>,
            <span key={`${lineIdx}-cmd`}>{text.slice(1)}</span>
          );
        } else {
          lineNodes.push(<span key={`${lineIdx}-${lineConsumed}`}>{text}</span>);
        }
      } else {
        // Link segment — only render if at least 1 char is visible
        const displayText = seg.display.slice(0, visible);
        lineNodes.push(
          <a
            key={`${lineIdx}-link-${lineConsumed}`}
            href={seg.href}
            target="_blank"
            rel="noopener noreferrer"
            style={
              {
                color: "inherit",
                textDecoration: "none",
                transition: "color 0.15s ease",
              } as React.CSSProperties
            }
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "var(--accent)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "inherit")
            }
          >
            {displayText}
          </a>
        );
      }

      lineConsumed += segLen;
    }

    nodes.push(
      <div key={lineIdx} style={{ minHeight: "1.4em" }}>
        {lineNodes}
      </div>
    );

    // +1 accounts for the newline between lines
    consumed += lineCharTotal + 1;
  }

  return nodes;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Handshake() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });
  const revealedChars = useTypingAnimation(isInView);
  const isTypingDone = revealedChars >= TOTAL_CHARS;

  return (
    <motion.section
      id="connect"
      ref={sectionRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container-main" style={{ maxWidth: 760 }}>
        {/* ── Section heading ── */}
        <div style={{ marginBottom: "2rem" }}>
          <p className="mono-label" style={{ marginBottom: "0.5rem" }}>
            // connect
          </p>
          <h2 style={{ color: "var(--text-primary)" }}>The Handshake</h2>
        </div>

        {/* ── Terminal block ── */}
        <div
          className="glow-card"
          style={{
            background: "var(--bg-elevated)",
            borderRadius: "0.5rem",
            border: "1px solid var(--accent-border)",
            overflow: "hidden",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              borderBottom: "1px solid var(--accent-border)",
              background: "var(--bg-card)",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "var(--signal-red)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "var(--signal-amber)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "var(--signal-green)",
                flexShrink: 0,
              }}
            />
            <span
              className="mono-label"
              style={{ marginLeft: "0.5rem", color: "var(--text-muted)" }}
            >
              terminal
            </span>
          </div>

          {/* Terminal body */}
          <div
            style={{
              padding: "2rem",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: "0.82rem",
              lineHeight: 1.75,
              color: "var(--text-secondary)",
              minHeight: 320,
            }}
          >
            {renderTerminalContent(revealedChars)}

            {/* Blinking cursor */}
            {!isTypingDone || isInView ? (
              <span
                className="animate-blink"
                style={{
                  display: "inline-block",
                  width: "0.55em",
                  height: "1em",
                  background: "var(--accent)",
                  verticalAlign: "text-bottom",
                  marginLeft: 1,
                }}
                aria-hidden="true"
              />
            ) : null}
          </div>
        </div>

        {/* ── Social icon row ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          style={{
            marginTop: "2rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* GitHub */}
          <SocialIconLink
            href={socialLinks.github}
            label="GitHub"
            icon={<GitHubSvg size={18} />}
          />

          {/* LinkedIn */}
          <SocialIconLink
            href={socialLinks.linkedin}
            label="LinkedIn"
            icon={<LinkedInSvg size={18} />}
          />

          {/* Email */}
          <SocialIconLink
            href={`mailto:${socialLinks.email}`}
            label="Email"
            icon={<Mail size={18} strokeWidth={1.5} />}
          />

          {/* HuggingFace — text link (no icon in lucide) */}
          <a
            href={socialLinks.huggingface}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="HuggingFace"
            style={
              {
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 0.75rem",
                border: "1px solid var(--accent-border)",
                borderRadius: "0.375rem",
                background: "var(--bg-elevated)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "color 0.2s ease, border-color 0.2s ease, background 0.2s ease",
                letterSpacing: "0.03em",
              } as React.CSSProperties
            }
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = "var(--accent)";
              el.style.borderColor = "var(--accent)";
              el.style.background = "var(--accent-glow)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = "var(--text-secondary)";
              el.style.borderColor = "var(--accent-border)";
              el.style.background = "var(--bg-elevated)";
            }}
          >
            {/* Minimal HF logotype */}
            <span style={{ fontSize: "1rem", lineHeight: 1 }} aria-hidden="true">
              🤗
            </span>
            HuggingFace
          </a>

          {/* Availability label — pushed right on wider screens */}
          <p
            className="mono-label"
            style={{
              marginLeft: "auto",
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            // currently open to opportunities
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: icon social link
// ---------------------------------------------------------------------------

interface SocialIconLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function SocialIconLink({ href, label, icon }: SocialIconLinkProps) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      aria-label={label}
      style={
        {
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.5rem 0.75rem",
          border: "1px solid var(--accent-border)",
          borderRadius: "0.375rem",
          background: "var(--bg-elevated)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.75rem",
          color: "var(--text-secondary)",
          textDecoration: "none",
          transition:
            "color 0.2s ease, border-color 0.2s ease, background 0.2s ease",
          letterSpacing: "0.03em",
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.color = "var(--accent)";
        el.style.borderColor = "var(--accent)";
        el.style.background = "var(--accent-glow)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.color = "var(--text-secondary)";
        el.style.borderColor = "var(--accent-border)";
        el.style.background = "var(--bg-elevated)";
      }}
    >
      {icon}
      {label}
    </a>
  );
}
