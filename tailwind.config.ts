import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--neural-bg) / <alpha-value>)",
        surface: "rgb(var(--neural-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--neural-surface-2) / <alpha-value>)",
        "surface-3": "rgb(var(--neural-surface-3) / <alpha-value>)",
        "surface-border": "rgb(var(--neural-border) / <alpha-value>)",
        "surface-muted": "rgb(var(--neural-muted) / <alpha-value>)",
        "text-strong": "rgb(var(--neural-text) / <alpha-value>)",
        "text-soft": "rgb(var(--neural-text-soft) / <alpha-value>)",
        "text-muted": "rgb(var(--neural-text-muted) / <alpha-value>)",
        "neural-cyan": "rgb(var(--neural-cyan) / <alpha-value>)",
        "neural-violet": "rgb(var(--neural-violet) / <alpha-value>)",
        "neural-amber": "rgb(var(--neural-amber) / <alpha-value>)",
        "neural-mist": "rgb(var(--neural-mist) / <alpha-value>)",
        "neural-green": "rgb(var(--neural-green) / <alpha-value>)",
        "neural-red": "rgb(var(--neural-red) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "monospace"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-display)", "monospace"],
      },
      boxShadow: {
        glass: "0 24px 80px rgba(0, 0, 0, 0.28)",
        "glow-cyan": "0 0 28px rgba(var(--neural-cyan), 0.35)",
        "glow-violet": "0 0 28px rgba(var(--neural-violet), 0.28)",
        "glow-amber": "0 0 28px rgba(var(--neural-amber), 0.28)",
      },
      backgroundImage: {
        "neural-grid":
          "linear-gradient(to right, rgba(var(--neural-cyan), 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(var(--neural-cyan), 0.05) 1px, transparent 1px)",
        "neural-radial":
          "radial-gradient(circle at top, rgba(var(--neural-cyan), 0.18), transparent 35%), radial-gradient(circle at bottom right, rgba(var(--neural-violet), 0.16), transparent 30%)",
      },
      animation: {
        "pulse-subtle": "pulse-subtle 2.6s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
        "cursor-pulse": "cursor-pulse 1.8s ease-in-out infinite",
        shimmer: "shimmer 1.8s linear infinite",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "0.72", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        blink: {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        "cursor-pulse": {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
          "50%": { transform: "translate(-50%, -50%) scale(1.12)" },
        },
        shimmer: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(100%)" },
        },
      },
    },
  },
};

export default config;
