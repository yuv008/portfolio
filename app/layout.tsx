import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { GrainOverlay } from "@/components/layout/GrainOverlay";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yuvraj Sanghai — Systems Engineer & AI Infrastructure",
  description:
    "I build the systems behind the intelligence. Voice pipelines, RAG architectures, TTS fine-tuning, semantic caching, and AI infrastructure.",
  openGraph: {
    title: "Yuvraj Sanghai",
    description: "I build the systems behind the intelligence.",
    url: "https://yuvrajsanghai.dev",
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
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GrainOverlay />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
