import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Toaster } from "react-hot-toast";
import { CustomCursor } from "@/components/ui/CustomCursor";


const jetbrainsMono = JetBrains_Mono({
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
        backgroundImage: [
          "radial-gradient(circle at top, rgba(110,231,255,0.11), transparent 28%)",
          "radial-gradient(circle at bottom right, rgba(171,138,255,0.12), transparent 24%)",
          "linear-gradient(to right, rgba(110,231,255,0.07) 1px, transparent 1px)",
          "linear-gradient(to bottom, rgba(110,231,255,0.06) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "auto, auto, 48px 48px, 48px 48px",
        backgroundAttachment: "fixed",
      }}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body text-text-strong">
        <CustomCursor />
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
      </body>
    </html>
  );
}
