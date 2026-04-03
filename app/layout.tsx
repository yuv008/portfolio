import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { TopNavBar } from "@/components/layout/TopNavBar";


const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
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
    <html lang="en" className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} ${inter.variable} dark`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface font-body selection:bg-primary/30 neural-grid min-h-screen">
        <TopNavBar />

        {children}
      </body>
    </html>
  );
}
