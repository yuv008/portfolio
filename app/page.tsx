import { HeroSignal } from "@/components/sections/HeroSignal";
import { PipelineTimeline } from "@/components/sections/PipelineTimeline";
import { EngineRoom } from "@/components/sections/EngineRoom";
import { StackGraph } from "@/components/sections/StackGraph";
import { TheLab } from "@/components/sections/TheLab";
import { SignalStrength } from "@/components/sections/SignalStrength";
import { Handshake } from "@/components/sections/Handshake";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <HeroSignal />
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
