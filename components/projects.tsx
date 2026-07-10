"use client";

import { useEffect, useRef, useState } from "react";

const PROJECTS = [
  {
    num: "01",
    tags: "React · Vite · TypeScript",
    title: "MOVIONZ",
    desc: "A responsive movie browsing app that allows users to explore trending films, view details, and discover new content. Built using React and Tailwind CSS with a dynamic UI and external movie API integration.",
    image: "/5p.png",
    link: "https
  },
  {
    num: "02",
    tags: "React · Tailwind CSS · Node.js",
    title: "Spirit-1-taekwondo",
    desc: "Spirit 1 Taekwondo empowers students with disciplined training, modern instruction, and a supportive community.Built with React and Tailwind, the site delivers a fast, clean, and accessible experience for every visitor.",
    image: "/1p.png",
    link: "https
  },
  {
    num: "03",
    tags: "Tailwind CSS · Framer Motion · React",
    title: "NorthPoint Construction",
    desc: "A clean and responsive website for a fictional construction company. Designed to showcase services, portfolio, and contact information with a professional layout and smooth user experience.",
    image: "/3p.png",
    link: "https
  },
  {
    num: "04",
    tags: "React · WebSockets · Figma",
    title: "Furniro",
    desc: "A sleek and responsive ecommerce web app built with React and Tailwind CSS. Includes product listing, shopping cart with localStorage, and smooth user interactions.",
    image: "/4p.png",
    link: "https
  },
  {
    num: "05",
    tags: "React Native · Context API · REST API",
    title: "Innovative global trading",
    desc: "Developed a sleek, professional business website for IGI using React and Tailwind CSS to enhance brand credibility. The site delivers a fast, responsive, and modern corporate experience with clear sections for services, company details, testimonials, and contact.",
    image: "/2p.png",
    link: "https
  },
];

export default function StickyComponent() {
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(idx);
          }
        });
      },
      { 
        root: null, 
       
        rootMargin: "-20% 0px -60% 0px", 
        threshold: 0 
      }
    );

    panelRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleScrollToPanel = (index: number) => {
    const targetPanel = panelRefs.current[index];
    if (targetPanel) {
      targetPanel.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <>
      <style>{`
        @import url('https

        .stky-root {
          background: var(--color-bg);
          position: relative;
        }

        .stky-root * { box-sizing: border-box; margin: 0; padding: 0; }

        main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-bottom: 2rem;
          background-color: transparent;
          color: var(--color-text);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          z-index: 1;
        }

        
        .sticky {
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 4rem;
          box-sizing: border-box;
          background: transparent;
        }

        .stky-title {
          font-size: clamp(2.4rem, 4vw, 3.5rem);
          margin: 0 0 1.75rem 0;
        }

        .description {
          color: var(--color-text-muted);
          font-size: 1rem;
          line-height: 1.7;
          max-width: 420px;
          margin-bottom: 2.5rem;
        }
        .project-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-top: 0.5px solid var(--color-border);
          padding-top: 1.5rem;
        }
        .project-item {
          display: flex;
          align-items: center;
          padding: 0.9rem 0.75rem;
          border-radius: 8px;
          color: var(--color-text-muted);
          transition: background 0.35s ease, color 0.35s ease;
          cursor: pointer; 
          background: none;
          border: none;
          width: 100%;
          text-align: left;
        }
        .project-item:hover {
          color: var(--color-text);
          background-color: rgba(255, 255, 255, 0.02);
        }
        .project-item.active {
          background-color: var(--color-surface);
          color: var(--color-text);
        }
        .project-num {
          font-family: 'Inter', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          margin-right: 1.25rem;
          transition: color 0.35s ease;
        }
        .project-item.active .project-num {
          color: var(--color-accent);
        }
        .project-name {
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.9rem;
          width: 100%;
          justify-content: space-between;
        }
        .active-line {
          width: 0px;
          height: 1.5px;
          background-color: var(--color-accent);
          display: inline-block;
          transition: width 0.4s ease;
        }
        .project-item.active .active-line {
          width: 20px;
        }

        
        .content {
          padding: 4rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          background: transparent;
        }

        .panel {
          display: flex;
          align-items: center;
          min-height: 70vh; 
        }

        .project-card {
          width: 100%;
          background: transparent;
          border: 0.5px solid var(--clr-grid-line-accent);
          border-radius: 20px;
          padding: 3rem;
          min-height: 480px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          text-decoration: none;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.35s ease,
                      box-shadow 0.35s ease;
        }

        .project-card:hover {
          transform: translateY(-6px);
          border-color: var(--color-border);
          box-shadow: 0 24px 50px -16px rgba(0, 0, 0, 0.55),
                      0 0 0 1px var(--color-border);
        }

        .card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.7;
          filter: saturate(0.8) brightness(0.8);
          transform: scale(1.02);
          transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease;
        }

        .project-card:hover .card-img {
          opacity: 0.2;
          transform: scale(1.08);
          filter: saturate(0.75) brightness(0.55);
        }

        .card-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--color-bg-elevated) 18%, transparent 80%);
          transition: opacity 0.4s ease;
          opacity: 0;
        }

        .project-card:hover .card-scrim {
          opacity: 1;
        }

        .card-counter {
          position: absolute;
          top: 2rem;
          left: 2rem;
          border: 0.5px solid var(--color-border);
          background-color: var(--color-bg-deep);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: var(--color-text-muted);
          padding: 0.3rem 0.9rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          z-index: 2;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .project-card:hover .card-counter {
          opacity: 1;
        }

        .card-tags {
          position: relative;
          z-index: 2;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-accent);
          margin-bottom: 1rem;
          font-weight: 700;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .project-card:hover .card-tags {
          opacity: 1;
        }

        .card-title {
          position: relative;
          z-index: 2;
          font-size: 2rem;
          font-weight: 800;
          margin: 0 0 1.1rem 0;
          color: var(--color-text);
          letter-spacing: -0.02em;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .project-card:hover .card-title {
          opacity: 1;
        }

        .card-desc {
          position: relative;
          z-index: 2;
          color: var(--color-text-muted);
          font-size: 1rem;
          line-height: 1.65;
          margin: 0 0 1.75rem 0;
          max-width: 92%;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .project-card:hover .card-desc {
          opacity: 1;
        }

        .card-link {
          position: relative;
          z-index: 2;
          color: var(--color-text);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid var(--color-border);
          width: max-content;
          padding-bottom: 2px;
          opacity: 0;
          transition: color 0.25s ease, gap 0.25s ease, border-color 0.25s ease, opacity 0.4s ease;
        }

        .project-card:hover .card-link {
          opacity: 1;
        }

        .card-link:hover {
          color: var(--color-accent);
          border-color: var(--color-accent);
          gap: 0.75rem;
        }

        .card-link-arrow {
          transition: transform 0.25s ease;
        }
        .card-link:hover .card-link-arrow {
          transform: translate(2px, -2px);
        }

        
        @media (max-width: 1080px) {
          .sticky, .content { padding: 3rem; }
        }

        @media (max-width: 900px) {
          main { grid-template-columns: 1fr; }
          .sticky { position: static; height: auto; padding: 3rem 1.5rem; }
          .content { padding: 1.5rem; gap: 1.75rem; }
          .project-card { padding: 2rem; min-height: 380px; }
          .panel { min-height: auto; }
        }

        @media (max-width: 480px) {
          .card-title { font-size: 1.5rem; }
          .card-desc { max-width: 100%; }
          .card-counter { top: 1.25rem; left: 1.25rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .project-card, .card-img, .card-desc, .card-link, .active-line { transition: none !important; }
        }
      `}</style>

      <main className="stky-root" id="stky-root">
        <div className="global-layout-grid" aria-hidden="true" />

        <div className="sticky">
          <div className="section-eyebrow">
            <span className="section-eyebrow-line" aria-hidden="true"></span>
            <span className="section-eyebrow-text">Projects</span>
          </div>

          <h1 className="section-title stky-title">
            Things I&apos;ve <span className="section-title-accent">built</span>
          </h1>

          <p className="description">
            A selection of projects spanning dashboards, SaaS products, and
            interactive applications — built with a focus on clean code,
            performance, and pixel-accurate UI.
          </p>

          <div className="project-list" role="tablist" aria-label="Project Selection">
            {PROJECTS.map((p, i) => (
              <button
                key={p.num}
                className={`project-item${i === activeIndex ? " active" : ""}`}
                role="tab"
                aria-selected={i === activeIndex}
                onClick={() => handleScrollToPanel(i)}
              >
                <span className="project-num">{p.num}</span>
                <span className="project-name">
                  {p.title}
                  <span className="active-line" aria-hidden="true"></span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="content">
          {PROJECTS.map((p, i) => (
            <div
              key={p.num}
              className="panel"
              data-index={i}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
            >
              <a
                className="project-card"
                href={p.link}
                target="_blank"
                rel="noreferrer noopener"
              >
                <img className="card-img" src={p.image} alt={p.title} />
                <div className="card-scrim" aria-hidden="true" />
                <div className="card-counter">
                  {p.num} / {String(PROJECTS.length).padStart(2, "0")}
                </div>
                <div className="card-tags">{p.tags}</div>
                <h2 className="card-title">{p.title}</h2>
                <p className="card-desc">{p.desc}</p>
                <span className="card-link">
                  View project
                  <span className="card-link-arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </a>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}