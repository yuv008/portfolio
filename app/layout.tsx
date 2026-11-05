import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Toaster } from "@/components/ui/Toaster";
import { HeroFieldLazy } from "@/components/three/HeroFieldLazy";
import { LiteMode } from "@/components/ui/LiteMode";
import { MotionDetails } from "@/components/ui/MotionDetails";


// Labels, numbers and buttons: a quiet mono. Body copy: Instrument Sans. Big headlines: Instrument Serif.
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  fallback: ["Courier New", "monospace"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yuvrajms.tech"),
  alternates: { canonical: "/" },
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

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
};

/** Structured data so search engines can connect the site with the same person's other profiles. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Yuvraj Sanghai",
  jobTitle: "AI R&D Engineer",
  url: "https://yuvrajms.tech",
  image: "https://yuvrajms.tech/og-image.png",
  sameAs: ["https://linkedin.com/in/yuvraj008", "https://github.com/yuv008", "https://huggingface.co/yuv008"],
  alumniOf: { "@type": "CollegeOrUniversity", name: "Pune Institute of Computer Technology" },
  knowsAbout: ["Voice AI", "AI agent evaluation", "Speech synthesis", "Retrieval-augmented generation", "LLM fine-tuning", "AI infrastructure"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${instrumentSans.variable} ${instrumentSerif.variable} dark`}
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <LiteMode />
        <MotionDetails />
        <HeroFieldLazy
          className="pointer-events-none fixed inset-0 z-0"
          colors={["#e6e6e6", "#acacac", "#dbdbdb"]}
          particles={64000}
          opacity={0.5}
          scrollDim={0.7}
          scrollLinked
        />
        <div className="relative z-10">
          <Toaster />
          <TopNavBar />

          {children}
        </div>
      </body>
    </html>
  );
}
