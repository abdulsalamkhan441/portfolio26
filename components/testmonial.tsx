"use client";

import { useEffect, useRef } from "react";

const TESTIMONIALS = [
  {
    quote:
      "Working with them was seamless from start to finish. They took our Figma designs and turned them into a pixel-perfect, blazing-fast site — and caught details we hadn't even thought about.",
    name: "Muhammad I.",
    role: "Co-founder",
    company: "IGI Global Trading",
    avatar: "/test2.jpg",
    rating: 5,
  },
  {
    quote:
      "Genuinely one of the most reliable front-end developers I've worked with. Clear communication, clean code, and always delivered ahead of schedule. Our conversion rate went up almost immediately after launch.",
    name: "Master T.",
    role: "Founder",
    company: "Spirit 1",
    avatar: "/test1.png",
    rating: 5,
  },
];

export default function TestimonialsSection() {
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
      { threshold: 0.15 },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .ts-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--color-text);
        }

        .ts-root * { box-sizing: border-box; margin: 0; padding: 0; }

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

        .ts-sub { font-size: 14px; color: var(--color-text-muted); line-height: 1.7; }

        
        .ts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }

        .ts-card {
          position: relative;
          background: linear-gradient(135deg, #030923 0%, #000000 100%);
          border: 0.5px solid var(--clr-grid-line-accent);
          border-radius: 20px;
          padding: 44px 40px 36px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          overflow: hidden;
          transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }

        .ts-card::after {
          content: '';
          position: absolute; top: 0; left: 24px; right: 24px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
          opacity: 0; transition: opacity 0.3s;
        }

        .ts-card:hover {
          border-color: var(--color-border);
          transform: translateY(-4px);
          box-shadow: 0 24px 48px -20px rgba(0, 0, 0, 0.5);
        }

        .ts-card:hover::after { opacity: 1; }

        .ts-quote-mark {
          font-family: Georgia, serif;
          font-size: 64px;
          line-height: 1;
          color: var(--color-accent-soft);
          font-weight: 700;
          height: 34px;
          transition: color 0.3s ease, transform 0.3s ease;
        }

        .ts-card:hover .ts-quote-mark {
          color: var(--color-accent-soft-strong);
          transform: translateY(-2px);
        }

        .ts-quote-text {
          font-size: 17px;
          font-weight: 500;
          line-height: 1.7;
          color: var(--color-text);
          letter-spacing: -0.005em;
        }

        .ts-stars {
          display: flex;
          gap: 4px;
        }

        .ts-star {
          color: var(--color-accent);
          font-size: 14px;
          display: inline-block;
          opacity: 0;
          transform: scale(0.5);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }

        .ts-card.is-visible .ts-star {
          opacity: 1;
          transform: scale(1);
        }

        .ts-star:nth-child(1) { transition-delay: 0.05s; }
        .ts-star:nth-child(2) { transition-delay: 0.1s; }
        .ts-star:nth-child(3) { transition-delay: 0.15s; }
        .ts-star:nth-child(4) { transition-delay: 0.2s; }
        .ts-star:nth-child(5) { transition-delay: 0.25s; }

        .ts-footer {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-top: 24px;
          border-top: 0.5px solid var(--clr-grid-line-accent);
        }

        .ts-avatar {
          width: 46px; height: 46px;
          border-radius: 50%;
          object-fit: cover;
          border: 0.5px solid var(--color-border);
          flex-shrink: 0;
          background: var(--color-bg-deep);
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .ts-avatar-fallback {
          width: 46px; height: 46px;
          border-radius: 50%;
          border: 0.5px solid var(--color-border);
          background: var(--color-accent-soft);
          color: var(--color-accent);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 700;
          flex-shrink: 0;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .ts-card:hover .ts-avatar,
        .ts-card:hover .ts-avatar-fallback {
          transform: scale(1.06);
          border-color: var(--color-accent);
        }

        .ts-person { display: flex; flex-direction: column; gap: 2px; }
        .ts-name { font-size: 14px; font-weight: 700; color: var(--color-text); }
        .ts-role { font-size: 12px; color: var(--color-text-muted); }
        .ts-role span { color: var(--color-accent); }

        
        @media (max-width: 860px) {
          .ts-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 540px) {
          .ts-card { padding: 32px 24px 28px; }
          .ts-quote-text { font-size: 15px; }
        }

        @media (max-width: 380px) {
          .ts-footer { flex-wrap: wrap; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ts-card, .ts-avatar, .ts-avatar-fallback, .ts-star, .ts-quote-mark {
            transition: none !important; transform: none !important; opacity: 1 !important;
          }
          [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="section-root"
        id="testimonials"
        aria-label="Testimonials"
      >
        <div className="global-layout-grid" aria-hidden="true" />
        <div className="section-separator" aria-hidden="true" />

        <div className="section-inner">
          <header className="section-header" data-reveal>
            <div className="section-eyebrow">
              <div className="section-eyebrow-line" aria-hidden="true" />
              <span className="section-eyebrow-text">Testimonials</span>
            </div>
            <h2 className="section-title">
              What people <span className="section-title-accent">say</span>
            </h2>
            <p className="ts-sub">
              A few words from people I&apos;ve worked with directly on real
              projects.
            </p>
          </header>

          <div className="ts-grid" role="list">
            {TESTIMONIALS.map((t) => (
              <div className="ts-card" key={t.name} role="listitem" data-reveal>
                <span className="ts-quote-mark" aria-hidden="true">
                  &ldquo;
                </span>

                <p className="ts-quote-text">{t.quote}</p>

                <div
                  className="ts-stars"
                  aria-label={`${t.rating} out of 5 stars`}
                >
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span className="ts-star" key={i} aria-hidden="true">
                      ★
                    </span>
                  ))}
                </div>

                <div className="ts-footer">
                  {t.avatar ? (
                    <img className="ts-avatar" src={t.avatar} alt={t.name} />
                  ) : (
                    <div className="ts-avatar-fallback" aria-hidden="true">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                  <div className="ts-person">
                    <span className="ts-name">{t.name}</span>
                    <span className="ts-role">
                      {t.role} <span>· {t.company}</span>
                    </span>
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
