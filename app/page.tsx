import dynamic from "next/dynamic";
import { HeroSignal } from "@/components/sections/HeroSignal";
import { ValueBand } from "@/components/sections/ValueBand";
import { PipelineTimeline } from "@/components/sections/PipelineTimeline";
import { TheLab } from "@/components/sections/TheLab";
import { SignalStrength } from "@/components/sections/SignalStrength";
import { Handshake } from "@/components/sections/Handshake";
import { Footer } from "@/components/layout/Footer";

// Lazy-load heavy below-fold sections to improve initial bundle
const EngineRoom = dynamic(() =>
  import("@/components/sections/EngineRoom").then((m) => ({ default: m.EngineRoom }))
);
const StackGraph = dynamic(() =>
  import("@/components/sections/StackGraph").then((m) => ({ default: m.StackGraph }))
);

export default function Home() {
  return (
    <main id="main-content">
      <HeroSignal />
      <ValueBand />
      <PipelineTimeline />
      <EngineRoom />
      <StackGraph />
      <TheLab />
      <SignalStrength />
      <Handshake />
      <Footer />
    </main>
  );
}
