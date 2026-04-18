import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Scrollytelling } from "@/components/sections/Scrollytelling";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main id="main-content" className="relative z-10">
      <Hero />
      <About />
      <Scrollytelling />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
