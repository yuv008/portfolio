import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Toaster } from "react-hot-toast";
import { HeroFieldLazy } from "@/components/three/HeroFieldLazy";
import { LiteMode } from "@/components/ui/LiteMode";


const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  fallback: ["Courier New", "monospace"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yuvrajms.tech"),
  title: "Yuvraj Sanghai — AI R&D Engineer",
  description:
    "AI R&D Engineer. I build VEE Legion, which finds failures in voice and chat AI agents before customers do, and the voice systems behind them.",
  openGraph: {
    title: "Yuvraj Sanghai",
    description: "Voice and chat AI agents fail in ways nobody sees until a customer complains. I build VEE Legion, which finds those failures first.",
    url: "https://yuvrajms.tech",
    siteName: "Yuvraj Sanghai",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yuvraj Sanghai",
    description: "Voice and chat AI agents fail in ways nobody sees until a customer complains. I build the QA platform that finds those failures first.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${inter.variable} dark`}
      style={{
        background:
          "radial-gradient(ellipse at 18% 12%, rgba(230,230,230,0.08), transparent 34%), radial-gradient(ellipse at 82% 36%, rgba(172,172,172,0.07), transparent 38%), rgb(10 10 11)",
      }}
    >
      <head>
        {/* Icons: a self-hosted subset of Material Symbols (about 11 KiB instead of the full 1.1 MB font).
            Regenerate with `node scripts/build-icon-font.mjs` after adding an icon. */}
        <link rel="preload" href="/fonts/material-symbols-subset.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="font-body text-text-strong relative">
        <LiteMode />
        <HeroFieldLazy
          className="pointer-events-none fixed inset-0 z-0"
          colors={["#e6e6e6", "#acacac", "#dbdbdb"]}
          particles={64000}
          opacity={0.5}
          scrollDim={0.7}
          scrollLinked
        />
        <div className="relative z-10">
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                border: "1px solid rgba(var(--neural-cyan), 0.22)",
                background: "rgba(var(--neural-surface), 0.94)",
                color: "rgb(var(--neural-text))",
                fontFamily: "var(--font-display)",
              },
            }}
          />
          <TopNavBar />

          {children}
        </div>
      </body>
    </html>
  );
}
