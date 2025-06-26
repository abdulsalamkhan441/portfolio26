import '../App.css'
import { useEffect } from "react";
import BackgroundWrapper from '../components/commons/BackgroundWrapper'
import Footer from '../components/commons/Footer'
import Navbar from '../components/commons/navbar'
import AboutSection from '../components/sections/AboutSection'
import First from '../components/sections/Hero'
import ProjectsSection from '../components/sections/ProjectsSection'
import Skills from '../components/sections/Skills'
import AboutBoxes from '../components/sections/AboutBoxes'
import ContactSection from '../components/sections/ContactSection'

function LandingPage() {
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest("a");
      if (anchor && anchor.hash) {
        const target = document.querySelector(anchor.hash);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY;
          smoothScrollTo(top, 1200);
        }
      }
    };

    const smoothScrollTo = (targetY, duration) => {
      const startY = window.scrollY;
      const diff = targetY - startY;
      let start;

      function step(timestamp) {
        if (!start) start = timestamp;
        const time = timestamp - start;
        const percent = Math.min(time / duration, 1);
        window.scrollTo(0, startY + diff * percent);
        if (time < duration) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <BackgroundWrapper>
      <Navbar />

      <div className="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth">
        <section id="hero" className="snap-start h-screen">
          <First />
        </section>

        <section className="snap-start h-screen">
          <AboutSection />
        </section>

        <section className="snap-start h-screen">
          <Skills />
        </section>

        <section className="snap-start h-screen">
          <ProjectsSection />
        </section>

        <section className="snap-start">
          <AboutBoxes />
        </section>

        <section id="contact" className="snap-start">
          <ContactSection />
        </section>
      </div>
      <Footer />
    </BackgroundWrapper>
  );
}

export default LandingPage;
