"use client";

import { useRef, useEffect } from "react";

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("ab-visible");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    const animTargets = sectionRef.current?.querySelectorAll(".ab-animate-in");
    animTargets?.forEach((target) => observer.observe(target));

    return () => {
      animTargets?.forEach((target) => observer.unobserve(target));
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .ab-root {
          width: 100%;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          color: var(--clr-sand);
          background-color: var(--color-bg, #0d0e12);
        }

        .ab-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .ab-inner {
          position: relative; z-index: 2;
          max-width: 1440px;
          margin: 0 auto;
          display: flex; flex-direction: column; gap: 72px;
        }

        .ab-animate-in {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        .ab-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .ab-header { display: flex; flex-direction: column; gap: 14px; max-width: 700px; }

        .ab-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--clr-surface, rgba(255,255,255,0.03));
          border: 0.5px solid var(--clr-slate-gray, rgba(255,255,255,0.1)); border-radius: 20px;
          padding: 5px 14px; width: fit-content;
        }

        .ab-eyebrow-line { width: 18px; height: 1.5px; background: var(--clr-copper, var(--color-accent)); border-radius: 2px; flex-shrink: 0; }

        .ab-eyebrow-text {
          font-size: 11px; font-weight: 600; color: var(--clr-taupe, #a0a5b5);
          text-transform: uppercase; letter-spacing: 0.14em;
        }

        .ab-title {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800; line-height: 1.15; letter-spacing: -0.03em; color: var(--color-text, #ffffff);
        }

        .ab-title-accent {
          background: linear-gradient(90deg, var(--color-accent, #00f0ff), var(--color-text, #ffffff));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .ab-cols { 
          display: grid; 
          grid-template-columns: minmax(320px, 420px) 1fr; 
          gap: 80px; 
          align-items: start; 
        }

        .ab-left { display: flex; flex-direction: column; gap: 32px; }

        .ab-portrait-wrap {
          position: relative; width: 100%; aspect-ratio: 4/3;
          border-radius: 20px; overflow: hidden;
          border: 0.5px solid var(--color-border, rgba(255,255,255,0.15)); background: var(--color-bg-deep, #07080a);
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.4s ease;
        }
        
        .ab-portrait-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.4s ease;
        }

        .ab-portrait-wrap:hover {
          border-color: var(--color-accent, #00f0ff);
        }

        .ab-portrait-placeholder { display: flex; flex-direction: column; align-items: center; gap: 14px; }

        .ab-portrait-avatar {
          width: 80px; height: 80px; border-radius: 50%;
          background: linear-gradient(135deg, var(--color-accent, #00f0ff), var(--color-bg-elevated, #161920));
          border: 2px solid var(--color-border, rgba(255,255,255,0.15));
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; font-weight: 800; color: var(--color-text, #ffffff); flex-shrink: 0;
          box-shadow: 0 8px 24px rgba(0, 240, 255, 0.15);
        }

        .ab-portrait-hint { font-size: 11px; color: var(--color-text-muted, #8a8f98); text-transform: uppercase; letter-spacing: 0.12em; }

        .ab-portrait-corner { position: absolute; width: 28px; height: 28px; border-color: var(--color-accent, #00f0ff); border-style: solid; opacity: 0.4; transition: transform 0.4s ease; }
        .ab-portrait-tl { top: 16px; left: 16px; border-width: 2px 0 0 2px; }
        .ab-portrait-br { bottom: 16px; right: 16px; border-width: 0 2px 2px 0; }
        
        .ab-portrait-wrap:hover .ab-portrait-tl { transform: translate(-4px, -4px); }
        .ab-portrait-wrap:hover .ab-portrait-br { transform: translate(4px, 4px); }
        .ab-portrait-wrap:hover .ab-portrait-img { transform: scale(1.05); }

        .ab-bio-block { display: flex; flex-direction: column; gap: 16px; }
        .ab-bio-text { font-size: 15px; color: var(--color-text-muted, #8a8f98); line-height: 1.75; }
        .ab-bio-strong { color: var(--color-text, #ffffff); font-weight: 600; }
        .ab-bio-links { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 10px; }

        .ab-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; font-family: inherit;
          padding: 11px 22px; border-radius: 9px;
          cursor: pointer; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); text-decoration: none;
        }

        .ab-btn-primary { background: var(--color-accent, #00f0ff); color: var(--color-bg, #0d0e12); border: none; }
        .ab-btn-primary:hover { background: var(--color-text, #ffffff); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(255,255,255,0.1); }
        .ab-btn-ghost { background: transparent; color: var(--color-text, #ffffff); border: 0.5px solid var(--color-border, rgba(255,255,255,0.15)); }
        .ab-btn-ghost:hover { border-color: var(--color-accent, #00f0ff); color: var(--color-accent, #00f0ff); background: rgba(0, 240, 255, 0.02); }

        /* Right Side Column */
        .ab-right { display: flex; flex-direction: column; gap: 48px; }

        .ab-section-label {
          font-size: 11px; font-weight: 600; color: var(--color-accent, #00f0ff);
          text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 20px;
        }

        .ab-skills-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 14px; 
        }

        .ab-skill-card {
          background: var(--color-overlay-strong, rgba(255,255,255,0.02));
          border: 0.5px solid var(--color-accent-outline, rgba(255,255,255,0.08));
          border-radius: 16px; padding: 20px;
          display: flex; flex-direction: column; gap: 12px;
          transition: border-color 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
        }

        .ab-skill-card:hover { 
          border-color: var(--color-accent, #00f0ff); 
          transform: translateY(-4px); 
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }

        .ab-skill-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: var(--color-accent-soft, rgba(0, 240, 255, 0.06));
          border: 0.5px solid var(--color-accent-outline, rgba(0, 240, 255, 0.15));
          display: flex; align-items: center; justify-content: center;
          color: var(--color-accent, #00f0ff); font-size: 18px; flex-shrink: 0;
        }

        .ab-skill-name { font-size: 14px; font-weight: 600; color: var(--color-text, #ffffff); }
        .ab-skill-tags { display: flex; flex-wrap: wrap; gap: 6px; }

        .ab-skill-tag {
          font-size: 11px; color: var(--color-text-muted, #8a8f98);
          background: var(--color-surface-muted, rgba(255,255,255,0.04));
          border: 0.5px solid var(--color-border-strong, rgba(255,255,255,0.08));
          border-radius: 5px; padding: 3px 8px;
        }
        .ab-stat-row { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 14px; 
        }

        .ab-stat-card {
          background: var(--color-overlay-medium, rgba(255,255,255,0.01));
          border: 0.5px solid var(--color-border-strong, rgba(255,255,255,0.08));
          border-radius: 14px; padding: 20px 16px;
          display: flex; flex-direction: column; gap: 6px;
          position: relative; overflow: hidden;
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }

        .ab-stat-card:hover { 
          border-color: var(--color-accent, #00f0ff);
          background-color: var(--color-overlay-strong, rgba(255,255,255,0.03));
        }

        .ab-stat-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--color-accent, #00f0ff), transparent);
          opacity: 0; transition: opacity 0.3s ease;
        }
        .ab-stat-card:hover::before { opacity: 0.6; }

        .ab-stat-num { font-size: clamp(24px, 3.5vw, 32px); font-weight: 800; color: var(--color-accent, #00f0ff); letter-spacing: -0.04em; line-height: 1; }
        .ab-stat-lbl { font-size: 12px; color: var(--color-text-muted, #8a8f98); line-height: 1.4; }

        .ab-delay-1 { transition-delay: 0.1s; }
        .ab-delay-2 { transition-delay: 0.2s; }
        .ab-delay-3 { transition-delay: 0.3s; }
        .ab-delay-4 { transition-delay: 0.4s; }
        .ab-delay-5 { transition-delay: 0.5s; }

        @media (prefers-reduced-motion: reduce) {
          .ab-animate-in {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .ab-skill-card { transition: none !important; transform: none !important; box-shadow: none !important; }
          .ab-portrait-wrap:hover .ab-portrait-tl,
          .ab-portrait-wrap:hover .ab-portrait-br { transform: none !important; }
        }

        @media (max-width: 1024px) {
          .ab-cols { gap: 48px; }
        }

        @media (max-width: 960px) {
          .ab-inner { padding: 90px 6%; gap: 56px; }
          .ab-cols { grid-template-columns: 1fr; gap: 56px; }
          .ab-left { max-width: 600px; }
        }

        @media (max-width: 640px) {
          .ab-skills-grid { grid-template-columns: 1fr; gap: 12px; }
          .ab-stat-row { grid-template-columns: 1fr; gap: 12px; }
          .ab-inner { padding: 72px 5%; gap: 48px; }
        }
      `}</style>

      <section ref={sectionRef} className="ab-root section-root" id="about" aria-label="About me">
        <div className="global-layout-grid" aria-hidden="true" />
        <div className="ab-inner">

          <header className="ab-header ab-animate-in">
            <div className="ab-eyebrow">
              <div className="ab-eyebrow-line" aria-hidden="true" />
              <span className="ab-eyebrow-text">About me</span>
            </div>
            <h2 className="ab-title">
              Passion for building<br />
              <span className="ab-title-accent">exceptional web experiences</span>
            </h2>
          </header>

          <div className="ab-cols">

            <div className="ab-left ab-animate-in ab-delay-1">
              <div className="ab-portrait-wrap">
                  <img src="/mypic2.png" alt="KHAN" className="ab-portrait-img" />
                <div className="ab-portrait-corner ab-portrait-tl" aria-hidden="true" />
                <div className="ab-portrait-corner ab-portrait-br" aria-hidden="true" />
              </div>

              <div className="ab-bio-block">
                <p className="ab-bio-text">
                  Hi, I&apos;m <span className="ab-bio-strong">Abdul Salam Khan</span> — a
                  Front-End Developer who specialises in turning Figma designs into
                  clean, production-ready interfaces using React, Next.js, TypeScript,
                  and Tailwind CSS.
                </p>
                <p className="ab-bio-text">
                  I care about the details most people skip — performance, accessibility,
                  and interactions that feel <span className="ab-bio-strong">just right</span>.
                  Clean architecture and reusable components aren&apos;t a preference,
                  they&apos;re a habit.
                </p>
                <div className="ab-bio-links">
                  <a href="/resume.pdf" className="ab-btn ab-btn-primary" download="Abdul_Salam_Resume.docx">
                    Download Resume
                  </a>
                  <a href="#stky-root" className="ab-btn ab-btn-ghost">
                    View Projects
                  </a>
                  <a
                    href="https://github.com/abdulsalamkhan441"
                    className="ab-btn ab-btn-ghost"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub ↗
                  </a>
                </div>
              </div>
            </div>

            <div className="ab-right">
              <div className="ab-animate-in ab-delay-2">
                <p className="ab-section-label">Core expertise</p>
                <div className="ab-skills-grid">
                  {[
                    { icon: "ti-brand-react",      name: "Frontend dev",    tags: ["React", "Next.js", "TypeScript"], delayClass: "ab-delay-2" },
                    { icon: "ti-vector-triangle",    name: "UI engineering",  tags: ["Figma to code", "UI/UX", "framer"], delayClass: "ab-delay-3" },
                    { icon: "ti-palette",            name: "Styling",         tags: ["Tailwind CSS", "CSS3", "Framer Motion"], delayClass: "ab-delay-4" },
                    { icon: "ti-tool",               name: "Tooling",         tags: ["Git", "Vite", "Three.js"], delayClass: "ab-delay-5" },
                  ].map((skill, index) => (
                    <div key={skill.name} className={`ab-skill-card ab-animate-in ab-delay-${index + 2}`}>
                      <div className="ab-skill-icon" aria-hidden="true">
                        <i className={`ti ${skill.icon}`} />
                      </div>
                      <div className="ab-skill-name">{skill.name}</div>
                      <div className="ab-skill-tags">
                        {skill.tags.map((tag) => (
                          <span key={tag} className="ab-skill-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ab-animate-in ab-delay-4">
                <p className="ab-section-label">At a glance</p>
                <div className="ab-stat-row">
                  {[
                    { num: "4+",   lbl: "Years of experience" },
                    { num: "20+",  lbl: "Projects delivered" },
                    { num: "100%", lbl: "Figma-to-code accuracy" },
                  ].map((s, index) => (
                    <div key={s.lbl} className={`ab-stat-card ab-animate-in ab-delay-${index + 3}`}>
                      <span className="ab-stat-num">{s.num}</span>
                      <span className="ab-stat-lbl">{s.lbl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}