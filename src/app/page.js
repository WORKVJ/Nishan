import AppShell from "@/components/AppShell";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Intro from "@/components/Intro";
import Projects from "@/components/Projects";
import Gallery from "@/components/Gallery";
import Artists from "@/components/Artists";
import About from "@/components/About";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { gear, disciplines } from "@/data/content";

export default function Home() {
  return (
    <AppShell>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <div className="ribbons" role="region" aria-label="Systems, consoles and disciplines">
          <Marquee items={gear} variant="marquee--accent" speed={0.03} />
          <Marquee items={disciplines} variant="marquee--back" speed={0.03} reverse />
        </div>
        <Intro />
        <Projects />
        <Gallery />
        <Artists />
        <About />
        <Services />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </AppShell>
  );
}
