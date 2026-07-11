"use client";

import { useRef, useEffect } from "react";

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("ex-visible");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const animTargets = sectionRef.current?.querySelectorAll(".ex-animate-in");
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

        .ex-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          width: 100%;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          color: var(--clr-sand);
          background-color: var(--color-bg, #0d0e12);
        }

        .ex-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .ex-sep {
          position: absolute; top: 0; left: 6%; right: 6%; height: 0.5px;
          background: linear-gradient(to right, transparent, var(--color-border-strong, rgba(255,255,255,0.1)), transparent);
        }

        .ex-inner {
          position: relative; z-index: 2;
          padding-top: 120px;
          max-width: 1440px;
          margin: 0 auto;
          display: flex; flex-direction: column; gap: 80px;
        }

        /* --- HARDWARE-ACCELERATED TRANSITION ENGINE --- */
        .ex-animate-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        .ex-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .ex-header { display: flex; flex-direction: column; gap: 14px; max-width: 700px; }

        .ex-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--color-surface, rgba(255,255,255,0.03));
          border: 0.5px solid var(--color-border, rgba(255,255,255,0.1)); border-radius: 20px;
          padding: 5px 14px; width: fit-content;
        }

        .ex-eyebrow-line { width: 18px; height: 1.5px; background: var(--color-accent, #00f0ff); border-radius: 2px; flex-shrink: 0; }

        .ex-eyebrow-text {
          font-size: 11px; font-weight: 600; color: var(--color-text-muted, #8a8f98);
          text-transform: uppercase; letter-spacing: 0.14em;
        }

        .ex-title {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800; line-height: 1.15; letter-spacing: -0.03em; color: var(--color-text, #ffffff);
        }

        .ex-title-accent {
          background: linear-gradient(90deg, var(--color-accent, #00f0ff), var(--color-text, #ffffff));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .ex-cols {
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start;
        }

        .ex-section-label {
          font-size: 11px; font-weight: 600; color: var(--color-accent, #00f0ff);
          text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 28px;
        }

        /* Timeline and Track Customization */
        .ex-timeline { display: flex; flex-direction: column; }

        .ex-timeline-item { display: flex; gap: 24px; padding-bottom: 36px; }
        .ex-timeline-item:last-child { padding-bottom: 0; }

        .ex-timeline-track {
          display: flex; flex-direction: column; align-items: center; flex-shrink: 0;
        }

        .ex-timeline-dot {
          width: 12px; height: 12px; border-radius: 50%;
          border: 2px solid var(--color-border-strong, rgba(255,255,255,0.15)); background: var(--color-bg, #0d0e12);
          flex-shrink: 0; margin-top: 5px;
          transition: border-color 0.4s ease, background-color 0.4s ease, box-shadow 0.4s ease;
        }

        .ex-timeline-item--active .ex-timeline-dot { 
          border-color: var(--color-accent, #00f0ff); 
          background: var(--color-accent, #00f0ff); 
          box-shadow: 0 0 12px var(--color-accent, #00f0ff);
        }

        .ex-timeline-line {
          flex: 1; width: 1px; margin-top: 8px; min-height: 32px;
          background: linear-gradient(to bottom, var(--color-border-strong, rgba(255,255,255,0.15)), transparent);
        }

        .ex-timeline-item:last-child .ex-timeline-line { display: none; }

        .ex-timeline-body { display: flex; flex-direction: column; gap: 4px; padding-top: 1px; }

        .ex-timeline-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--color-accent-soft, rgba(0, 240, 255, 0.06));
          border: 0.5px solid var(--color-accent-outline-strong, rgba(0, 240, 255, 0.2));
          border-radius: 5px; padding: 3px 10px;
          font-size: 10px; font-weight: 600; color: var(--color-accent, #00f0ff);
          letter-spacing: 0.06em; text-transform: uppercase;
          width: fit-content; margin-bottom: 8px;
        }

        .ex-timeline-role { font-size: 15px; font-weight: 700; color: var(--color-text, #ffffff); line-height: 1.3; }
        .ex-timeline-company { font-size: 13px; color: var(--color-accent, #00f0ff); font-weight: 500; margin-top: 1px; }
        .ex-timeline-period { font-size: 11px; color: var(--color-text-muted, #8a8f98); margin: 4px 0 10px; }
        .ex-timeline-desc { font-size: 14px; color: var(--color-text-muted, #8a8f98); line-height: 1.7; }

        /* Value Cards Layout Optimization */
        .ex-values-col { display: flex; flex-direction: column; gap: 14px; }

        .ex-value-card {
          background: var(--color-overlay-medium, rgba(255,255,255,0.01));
          border: 0.5px solid var(--color-border-strong, rgba(255,255,255,0.08)); border-radius: 16px;
          padding: 24px;
          display: flex; flex-direction: column; gap: 16px;
          position: relative; overflow: hidden;
          transition: border-color 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
          cursor: default;
        }

        .ex-value-card::after {
          content: '';
          position: absolute; top: 0; left: 16px; right: 16px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-accent, #00f0ff), transparent);
          opacity: 0; transition: opacity 0.3s ease;
        }

        .ex-value-card:hover { 
          border-color: var(--color-accent, #00f0ff); 
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }
        .ex-value-card:hover::after { opacity: 1; }
        .ex-value-card:hover .ex-value-icon { background: var(--color-accent-soft-medium, rgba(0, 240, 255, 0.12)); color: var(--color-accent, #00f0ff); }
        .ex-value-card:hover .ex-value-bar-fill { transform: scaleX(1); }

        .ex-value-top { display: flex; align-items: flex-start; justify-content: space-between; }

        .ex-value-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: var(--color-accent-soft, rgba(0, 240, 255, 0.05));
          border: 0.5px solid var(--color-accent-outline, rgba(0, 240, 255, 0.15));
          display: flex; align-items: center; justify-content: center;
          color: var(--color-text-muted, #8a8f98); font-size: 18px; flex-shrink: 0;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .ex-value-num {
          font-size: 11px; font-weight: 700;
          color: var(--color-accent-faint, rgba(0, 240, 255, 0.3)); letter-spacing: 0.04em; margin-top: 2px;
        }

        .ex-value-body { display: flex; flex-direction: column; gap: 6px; }
        .ex-value-title { font-size: 15px; font-weight: 700; color: var(--color-text, #ffffff); letter-spacing: -0.01em; }
        .ex-value-sub { font-size: 13px; color: var(--color-text-muted, #8a8f98); line-height: 1.65; }

        .ex-value-bar { height: 2px; background: var(--color-surface-muted, rgba(255,255,255,0.04)); border-radius: 2px; overflow: hidden; }
        .ex-value-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-accent, #00f0ff), var(--color-accent-soft-strong, rgba(0, 240, 255, 0.4)));
          border-radius: 2px;
          transform: scaleX(0.96);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* --- RESPONSIVE MEDIA BREAKPOINTS --- */
        @media (max-width: 1024px) {
          .ex-cols { gap: 48px; }
        }

        @media (max-width: 900px) {
          .ex-inner { padding: 90px 6%; gap: 64px; }
          .ex-cols { grid-template-columns: 1fr; gap: 56px; }
        }

        @media (max-width: 640px) {
          .ex-inner { padding: 72px 5%; gap: 48px; }
          .ex-timeline-item { gap: 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ex-animate-in {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .ex-value-card { transition: none !important; transform: none !important; box-shadow: none !important; }
          .ex-value-bar-fill { transition: none !important; transform: none !important; }
        }
      `}</style>

      <section ref={sectionRef} className="ex-root section-root" id="experience" aria-label="Experience and values">
        <div className="global-layout-grid" aria-hidden="true" />
        <div className="ex-inner">
          <header className="ex-header ex-animate-in">
            <div className="ex-eyebrow">
              <div className="ex-eyebrow-line" aria-hidden="true" />
              <span className="ex-eyebrow-text">Experience</span>
            </div>
            <h2 className="ex-title">
              Where I&apos;ve been,<br />
              <span className="ex-title-accent">what I stand for</span>
            </h2>
          </header>

          <div className="ex-cols">
            <div className="ex-animate-in" style={{ transitionDelay: "0.1s" }}>
              <p className="ex-section-label">Work history</p>
              <div className="ex-timeline" role="list">
                {[
                  {
                    role: "Front-End Developer",
                    company: "IGI Global Trading",
                    period: "2025 — 2026",
                    desc: "Building modern, responsive web applications using React, Next.js, TypeScript, and Tailwind CSS. Responsible for UI implementation, performance optimisation, and translating Figma designs into production-ready interfaces.",
                    active: false,
                  },
                  {
                    role: "Freelance Front-End Developer",
                    company: "Client Projects",
                    period: "2023 — 2025",
                    desc: "Designed and developed responsive landing pages, dashboards, and interactive web apps. Sharpened skills in React, JavaScript, animations, and component-based architecture across a range of client briefs.",
                    active: false,
                  },
                  {
                    role: "Self-directed learning",
                    company: "Foundation phase",
                    period: "2022 — 2023",
                    desc: "Built a strong foundation in HTML, CSS, JavaScript, React, and Git through intensive self-study and hands-on project work.",
                    active: false,
                  },
                ].map((item, index) => (
                  <div
                    key={item.role + item.company}
                    className={`ex-timeline-item ex-animate-in ${item.active ? " ex-timeline-item--active" : ""}`}
                    style={{ transitionDelay: `${(index + 2) * 0.1}s` }}
                    role="listitem"
                  >
                    <div className="ex-timeline-track" aria-hidden="true">
                      <div className="ex-timeline-dot" />
                      <div className="ex-timeline-line" />
                    </div>
                    <div className="ex-timeline-body">
                      {item.active && (
                        <span className="ex-timeline-badge">
                          <i className="ti ti-circle-filled" style={{ fontSize: 7, marginRight: 4 }} aria-hidden="true" />
                          Current
                        </span>
                      )}
                      <div className="ex-timeline-role">{item.role}</div>
                      <div className="ex-timeline-company">{item.company}</div>
                      <div className="ex-timeline-period">{item.period}</div>
                      <div className="ex-timeline-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ex-animate-in" style={{ transitionDelay: "0.2s" }}>
              <p className="ex-section-label">What I value</p>
              <div className="ex-values-col" role="list">
                {[
                  { icon: "ti-bolt",       num: "01", title: "Performance",    sub: "Lightning-fast apps optimised for speed, responsiveness, and user experience.", bar: "95%" },
                  { icon: "ti-focus-2",    num: "02", title: "Precision",       sub: "Pixel-perfect interfaces built from design files with attention to every detail.", bar: "90%" },
                  { icon: "ti-components", num: "03", title: "Scalable code",   sub: "Reusable, maintainable components structured for long-term growth and easy handoff.", bar: "85%" },
                  { icon: "ti-telescope",  num: "04", title: "Always learning", sub: "Constantly exploring modern tech and best practices to deliver better work.", bar: "78%" },
                ].map((v, index) => (
                  <div 
                    key={v.title} 
                    className="ex-value-card ex-animate-in" 
                    style={{ transitionDelay: `${(index + 3) * 0.1}s` }}
                    role="listitem"
                  >
                    <div className="ex-value-top">
                      <div className="ex-value-icon" aria-hidden="true">
                        <i className={`ti ${v.icon}`} />
                      </div>
                      <span className="ex-value-num">{v.num}</span>
                    </div>
                    <div className="ex-value-body">
                      <div className="ex-value-title">{v.title}</div>
                      <div className="ex-value-sub">{v.sub}</div>
                    </div>
                    <div className="ex-value-bar">
                      <div className="ex-value-bar-fill" style={{ width: v.bar }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}