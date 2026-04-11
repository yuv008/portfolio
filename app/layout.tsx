import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Toaster } from "react-hot-toast";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { AnimatedBlobBackground } from "@/components/ui/AnimatedBlobBackground";


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
  title: "Yuvraj Sanghai — Systems Engineer & AI Infrastructure",
  description:
    "I build the systems behind the intelligence. Voice pipelines, RAG architectures, TTS fine-tuning, semantic caching, and AI infrastructure.",
  openGraph: {
    title: "Yuvraj Sanghai",
    description: "I build the systems behind the intelligence.",
    url: "https://yuvrajms.tech",
    siteName: "Yuvraj Sanghai",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yuvraj Sanghai",
    description: "I build the systems behind the intelligence.",
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
        backgroundColor: "rgb(8 12 18)",
      }}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body text-text-strong relative">
        <AnimatedBlobBackground />
        <ParticleBackground />
        <CustomCursor />
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
