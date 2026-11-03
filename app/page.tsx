import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { StressTest } from "@/components/sections/StressTest";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";
import { WispGuide } from "@/components/ui/WispGuide";

export default function Home() {
  return (
    <main id="main-content" className="relative z-10">
      <Hero />
      <About />
      <StressTest />
      <Experience />
      <Education />
      <Projects />
      <Skills />
      <Achievements />
      <Contact />
      <Footer />
      <WispGuide />
    </main>
  );
}
