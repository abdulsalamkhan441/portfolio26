"use client";

import { useEffect, useRef } from "react";

const NAV_LINKS = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#stky-root" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const SOCIALS = [
  {
    icon: "ti-brand-github",
    label: "GitHub",
    href: "https
  },
  {
    icon: "ti-brand-linkedin",
    label: "LinkedIn",
    href: "https
  },
  { icon: "ti-mail", label: "Email", href: "abdulsalamkhanwbd@gmail.com" },
];

export default function FooterSection() {
  const year = new Date().getFullYear();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
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
      { threshold: 0.15 },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https

        

        .ft-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--color-text);
          position: relative;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-size: 48px 48px;
          
          --grid-color: rgba(167, 158, 156, 0.03);
  
          background-image:
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
        }

        .ft-root * { box-sizing: border-box; margin: 0; padding: 0; }

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

        .ft-glow {
          position: absolute;
          left: 50%;
          top: -10%;
          width: 640px; height: 320px;
          transform: translateX(-50%);
          background: radial-gradient(ellipse, var(--color-accent-soft-strong) 0%, transparent 70%);
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.55;
          animation: ft-glow-pulse 10s ease-in-out infinite;
        }

        @keyframes ft-glow-pulse {
          0%, 100% { opacity: 0.4; transform: translateX(-50%) scale(1); }
          50%       { opacity: 0.65; transform: translateX(-50%) scale(1.08); }
        }

        
        .ft-cta {
          position: relative;
          z-index: 1;
          padding: 120px 6% 90px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 28px;
        }

        .ft-cta-eyebrow {
          font-size: 11px; font-weight: 600; color: var(--color-text-muted);
          text-transform: uppercase; letter-spacing: 0.16em;
        }

        .ft-cta-title {
          font-size: clamp(34px, 6vw, 64px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--color-text);
          max-width: 780px;
        }

        .ft-cta-accent {
          background: linear-gradient(90deg, var(--color-accent), var(--color-text));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .ft-cta-link {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 16px; font-weight: 600;
          color: var(--color-text);
          background: var(--color-accent);
          padding: 15px 30px;
          border-radius: 50px;
          text-decoration: none;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.3s ease, transform 0.3s ease, filter 0.3s ease;
        }

        .ft-cta-link::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
          transform: translateX(-120%);
          transition: transform 0.6s ease;
        }

        .ft-cta-link:hover::before { transform: translateX(120%); }

        .ft-cta-link:hover {
          box-shadow: 0 12px 34px -10px var(--color-accent-mid);
          transform: translateY(-2px);
          filter: brightness(1.08);
        }

        .ft-cta-arrow { transition: transform 0.3s ease; }
        .ft-cta-link:hover .ft-cta-arrow { transform: translate(3px, -3px); }

        
        .ft-bar {
          position: relative;
          z-index: 1;
          border-top: 0.5px solid var(--clr-grid-line-accent);
          padding: 28px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .ft-bar-name {
          font-size: 14px; font-weight: 700; color: var(--color-text);
        }

        .ft-bar-copyright {
          font-size: 12.5px; color: var(--color-text-muted);
          margin-left: 10px;
          font-weight: 500;
        }

        .ft-bar-left { display: flex; align-items: baseline; }

        .ft-bar-nav {
          display: flex; gap: 28px;
        }

        .ft-bar-link {
          font-size: 13px; font-weight: 500; color: var(--color-text-muted);
          text-decoration: none;
          position: relative;
          transition: color 0.25s ease;
        }

        .ft-bar-link::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: -3px;
          height: 1px;
          background: var(--color-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }

        .ft-bar-link:hover { color: var(--color-text); }
        .ft-bar-link:hover::after { transform: scaleX(1); }

        .ft-bar-socials { display: flex; gap: 8px; }

        .ft-social-link {
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          color: var(--color-text-muted); font-size: 15px;
          text-decoration: none;
          border: 0.5px solid transparent;
          transition: color 0.25s ease, background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
        }

        .ft-social-link:hover {
          color: var(--color-accent);
          background: var(--color-accent-soft);
          border-color: var(--color-border);
          transform: translateY(-2px);
        }
        .global-layout-grid2 {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-size: 48px 48px;
          
          --grid-color: rgba(167, 158, 156, 0.03);
  
          background-image:
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
        }

        @media (max-width: 760px) {
          .ft-cta { padding: 90px 6% 64px; gap: 22px; }
          .ft-bar { flex-direction: column; align-items: flex-start; gap: 18px; }
          .ft-bar-nav { gap: 20px; flex-wrap: wrap; }
          .ft-glow { width: 420px; height: 240px; }
        }

        @media (max-width: 420px) {
          .ft-bar-left { flex-direction: column; align-items: flex-start; gap: 4px; }
          .ft-bar-copyright { margin-left: 0; }
          .ft-cta-link { width: 100%; justify-content: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ft-cta-link, .ft-bar-link, .ft-social-link, .ft-glow { transition: none !important; animation: none !important; }
          [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>

      <footer ref={rootRef} className="ft-root" id="footer" aria-label="Footer">
        <div className="ft-glow" aria-hidden="true" />

        <div className="ft-cta" data-reveal>
          <span className="ft-cta-eyebrow">Got a project in mind?</span>
          <h2 className="ft-cta-title">
            Let&apos;s build something{" "}
            <span className="ft-cta-accent">great together</span>
          </h2>
          <a className="ft-cta-link" href="#contact">
            Start a conversation
            <span className="ft-cta-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>

        <div className="ft-bar" data-reveal>
          <div className="ft-bar-left">
            <span className="ft-bar-name">ASK</span>
            <span className="ft-bar-copyright">
              © {year}. All rights reserved.
            </span>
          </div>

          <nav className="ft-bar-nav" aria-label="Footer navigation">
            {NAV_LINKS.map((link) => (
              <a className="ft-bar-link" href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ft-bar-socials">
            {SOCIALS.map((s) => (
              <a
                className="ft-social-link"
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={s.label}
              >
                <i className={`ti ${s.icon}`} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
