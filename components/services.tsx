"use client";

import { useEffect, useRef } from "react";

const SERVICES = [
  {
    num: "01",
    icon: "ti-code",
    title: "Front-End Development",
    tagline: "Building fast, modern web apps from the ground up.",
    desc: "I build responsive, production-ready interfaces using React, Next.js, and TypeScript — structured for performance, accessibility, and long-term maintainability.",
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    num: "02",
    icon: "ti-layout-grid",
    title: "Figma to Code",
    tagline: "Pixel-perfect translations of your design files.",
    desc: "I turn Figma designs into precise, responsive UI — matching spacing, typography, and interaction details exactly, with no guesswork left in.",
    tags: ["Figma", "Design Systems", "Responsive Layout"],
  },
  {
    num: "03",
    icon: "ti-bolt",
    title: "Performance Optimisation",
    tagline: "Faster load times, smoother interactions.",
    desc: "I audit and optimise existing apps — reducing bundle size, improving Core Web Vitals, and eliminating render bottlenecks so your site feels instant.",
    tags: ["Lighthouse", "Code Splitting", "Caching"],
  },
  {
    num: "04",
    icon: "ti-device-mobile",
    title: "Responsive & Mobile UI",
    tagline: "Interfaces that work on every screen.",
    desc: "Every project is built mobile-first and tested across breakpoints, so your product looks and behaves consistently from phone to ultrawide monitor.",
    tags: ["Mobile-First", "Cross-Browser", "Accessibility"],
  },
  {
    num: "05",
    icon: "ti-tool",
    title: "Maintenance & Support",
    tagline: "Ongoing improvements after launch.",
    desc: "I offer continued support after handoff — bug fixes, feature additions, dependency updates, and small iterations as your product evolves.",
    tags: ["Bug Fixes", "Updates", "Iteration"],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const targets = root.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        .sv-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--color-text);
        }

        .sv-root * { box-sizing: border-box; margin: 0; padding: 0; }

        [data-reveal] {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
        }

        [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .sv-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          gap: 32px; flex-wrap: wrap;
        }

        .sv-header-left { display: flex; flex-direction: column; gap: 14px; max-width: 560px; }

        .sv-sub { font-size: 14px; color: var(--color-text-muted); line-height: 1.7; }

        .sv-count {
          font-size: 12px; font-weight: 600; color: var(--color-text-muted);
          text-transform: uppercase; letter-spacing: 0.1em;
          white-space: nowrap; padding-bottom: 4px;
        }

        .sv-count b { color: var(--color-accent); font-weight: 700; }

        
        .sv-list {
          display: flex; flex-direction: column;
          border-top: 0.5px solid var(--clr-grid-line-accent);
        }

        .sv-item {
          position: relative;
          border-bottom: 0.5px solid var(--clr-grid-line-accent);
          overflow: hidden;
        }

        .sv-item-ghost {
          position: absolute;
          right: 2%;
          top: 50%;
          transform: translateY(-50%);
          font-size: 140px;
          font-weight: 800;
          color: transparent;
          -webkit-text-stroke: 1px var(--color-accent-soft);
          line-height: 1;
          pointer-events: none;
          user-select: none;
          transition: -webkit-text-stroke-color 0.4s ease, transform 0.4s ease;
          z-index: 0;
        }

        .sv-item:hover .sv-item-ghost {
          -webkit-text-stroke-color: var(--color-accent-mid);
          transform: translateY(-50%) scale(1.05);
        }

        .sv-item-head {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 24px;
          padding: 30px 4px;
          cursor: default;
        }

        .sv-item-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: var(--color-surface);
          border: 0.5px solid var(--clr-grid-line-accent);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-text-muted); font-size: 20px; flex-shrink: 0;
          transition: background 0.35s ease, color 0.35s ease, transform 0.35s ease, border-color 0.35s ease;
        }

        .sv-item:hover .sv-item-icon {
          background: var(--color-accent);
          border-color: var(--color-accent);
          color: var(--color-text);
          transform: rotate(-8deg) scale(1.05);
        }

        .sv-item-num {
          font-size: 12px; font-weight: 700; color: var(--color-text-muted);
          letter-spacing: 0.06em; flex-shrink: 0; width: 26px;
          transition: color 0.35s ease;
        }

        .sv-item:hover .sv-item-num { color: var(--color-accent); }

        .sv-item-titles { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }

        .sv-item-title {
          font-size: 22px; font-weight: 700; letter-spacing: -0.01em; color: var(--color-text);
          transition: color 0.3s ease, transform 0.3s ease;
        }

        .sv-item:hover .sv-item-title { transform: translateX(4px); }

        .sv-item-tagline { font-size: 13px; color: var(--color-text-muted); }

        .sv-item-arrow {
          width: 40px; height: 40px; border-radius: 50%;
          border: 0.5px solid var(--clr-grid-line-accent);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-text-muted); font-size: 16px; flex-shrink: 0;
          transition: transform 0.35s ease, border-color 0.35s ease, background 0.35s ease, color 0.35s ease;
        }

        .sv-item:hover .sv-item-arrow {
          transform: rotate(45deg);
          border-color: var(--color-accent);
          background: var(--color-accent-soft);
          color: var(--color-accent);
        }

        
        .sv-item-panel {
          position: relative; z-index: 1;
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sv-item:hover .sv-item-panel,
        .sv-item:focus-within .sv-item-panel {
          grid-template-rows: 1fr;
        }

        .sv-item-panel-inner { overflow: hidden; }

        .sv-item-panel-content {
          display: flex; flex-direction: column; gap: 16px;
          padding: 0 4px 30px 98px;
          max-width: 620px;
        }

        .sv-item-desc { font-size: 14px; color: var(--color-text-muted); line-height: 1.7; }

        .sv-tags { display: flex; flex-wrap: wrap; gap: 8px; }

        .sv-tag {
          font-size: 11px; font-weight: 600; color: var(--color-accent);
          background: var(--color-surface);
          border: 0.5px solid var(--clr-grid-line-accent);
          border-radius: 20px;
          padding: 5px 12px;
          transition: border-color 0.25s ease, background 0.25s ease;
        }

        .sv-item:hover .sv-tag {
          border-color: var(--color-border);
          background: var(--color-accent-soft);
        }

        
        @media (max-width: 960px) {
          .sv-item-ghost { font-size: 110px; }
        }

        @media (max-width: 720px) {
          .sv-item-ghost { font-size: 90px; opacity: 0.6; }
          .sv-item-head { gap: 14px; padding: 24px 2px; }
          .sv-item-icon { width: 40px; height: 40px; font-size: 17px; }
          .sv-item-title { font-size: 17px; }
          .sv-item-tagline { display: none; }
          .sv-item-panel-content { padding: 0 2px 24px 56px; }
          .sv-item-arrow { width: 34px; height: 34px; }
        }

        @media (max-width: 540px) {
          .sv-header { flex-direction: column; align-items: flex-start; gap: 16px; }
        }

        @media (max-width: 420px) {
          .sv-item-panel-content { padding-left: 40px; }
          .sv-item-ghost { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sv-item-panel, .sv-item-icon, .sv-item-arrow, .sv-item-title, .sv-item-ghost, .sv-tag {
            transition: none !important;
          }
          [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>

      <section ref={sectionRef} className="section-root" id="services" aria-label="Services">
        <div className="global-layout-grid" aria-hidden="true" />
        <div className="section-separator" aria-hidden="true" />

        <div className="section-inner">
          <header className="sv-header" data-reveal>
            <div className="sv-header-left">
              <div className="section-eyebrow">
                <div className="section-eyebrow-line" aria-hidden="true" />
                <span className="section-eyebrow-text">Services</span>
              </div>
              <h2 className="section-title">
                How I can <span className="section-title-accent">help</span>
              </h2>
              <p className="sv-sub">
                Hover any service to see what&apos;s included — from first line of code to post-launch support.
              </p>
            </div>
            <span className="sv-count">
              <b>{String(SERVICES.length).padStart(2, "0")}</b> / Services offered
            </span>
          </header>

          <div className="sv-list" role="list" data-reveal>
            {SERVICES.map((s) => (
              <div className="sv-item" key={s.num} role="listitem" tabIndex={0}>
                <span className="sv-item-ghost" aria-hidden="true">{s.num}</span>

                <div className="sv-item-head">
                  <span className="sv-item-num">{s.num}</span>
                  <div className="sv-item-icon" aria-hidden="true">
                    <i className={`ti ${s.icon}`} />
                  </div>
                  <div className="sv-item-titles">
                    <span className="sv-item-title">{s.title}</span>
                    <span className="sv-item-tagline">{s.tagline}</span>
                  </div>
                  <div className="sv-item-arrow" aria-hidden="true">
                    <i className="ti ti-arrow-up-right" />
                  </div>
                </div>

                <div className="sv-item-panel">
                  <div className="sv-item-panel-inner">
                    <div className="sv-item-panel-content">
                      <p className="sv-item-desc">{s.desc}</p>
                      <div className="sv-tags">
                        {s.tags.map((tag) => (
                          <span className="sv-tag" key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}