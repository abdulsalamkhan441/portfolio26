"use client";

import { useEffect, useRef, useState } from "react";

const CONTACT_INFO = [
  {
    icon: "ti-mail",
    label: "Email",
    value: "abdulsalamkhanwbd@gmail.com",
    href: "mailto:abdulsalamkhanwbd@gmail.com",
  },
  {
    icon: "ti-map-pin",
    label: "Location",
    value: "Available worldwide · Remote",
    href: null,
  },
  {
    icon: "ti-clock",
    label: "Response time",
    value: "Usually within 24 hours",
    href: null,
  },
];

const SOCIALS = [
  { icon: "ti-brand-github", label: "GitHub", href: "https://github.com/abdulsalamkhan441" },
  { icon: "ti-brand-linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/abdulsalam-khan-/" },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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
      { threshold: 0.12 }
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus("sending");
    try {
      // Connects directly to our secure API route handler
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .ct-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--color-text);
        }

        .ct-root * { box-sizing: border-box; margin: 0; padding: 0; }

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

        .ct-glow {
          position: absolute;
          width: 480px; height: 480px;
          right: -6%;
          top: 10%;
          border-radius: 50%;
          background: radial-gradient(circle, var(--color-accent-soft-strong) 0%, transparent 70%);
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
          animation: ct-glow-drift 16s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes ct-glow-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-24px, 26px) scale(1.1); }
        }

        .ct-sub { font-size: 14px; color: var(--color-text-muted); line-height: 1.7; max-width: 480px; }

        .ct-cols {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 64px;
          align-items: start;
        }

        .ct-left { display: flex; flex-direction: column; gap: 36px; }

        .ct-status {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--color-accent-soft);
          border: 0.5px solid var(--color-border);
          border-radius: 20px;
          padding: 8px 16px;
          width: fit-content;
        }

        .ct-status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--color-accent);
          box-shadow: 0 0 0 0 var(--color-accent-mid);
          animation: ct-pulse 2s infinite;
        }

        @keyframes ct-pulse {
          0% { box-shadow: 0 0 0 0 var(--color-accent-mid); }
          70% { box-shadow: 0 0 0 8px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }

        .ct-status-text { font-size: 12px; font-weight: 600; color: var(--color-text); letter-spacing: 0.02em; }

        .ct-info-list { display: flex; flex-direction: column; gap: 4px; }

        .ct-info-item {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 6px;
          border-top: 0.5px solid var(--clr-grid-line-accent);
          text-decoration: none;
          color: inherit;
          transition: padding-left 0.3s ease;
        }

        .ct-info-item:last-child { border-bottom: 0.5px solid var(--clr-grid-line-accent); }

        a.ct-info-item:hover { padding-left: 12px; }
        a.ct-info-item:hover .ct-info-icon { background: var(--color-accent); color: var(--color-text); border-color: var(--color-accent); }
        a.ct-info-item:hover .ct-info-value { color: var(--color-accent); }

        .ct-info-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: var(--color-surface);
          border: 0.5px solid var(--clr-grid-line-accent);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-text-muted); font-size: 17px; flex-shrink: 0;
          transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }

        .ct-info-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .ct-info-label {
          font-size: 10px; font-weight: 600; color: var(--color-text-muted);
          text-transform: uppercase; letter-spacing: 0.1em;
        }
        .ct-info-value {
          font-size: 14px; font-weight: 600; color: var(--color-text);
          transition: color 0.3s ease;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .ct-socials { display: flex; gap: 10px; }

        .ct-social-link {
          width: 42px; height: 42px; border-radius: 11px;
          background: var(--color-bg-elevated);
          border: 0.5px solid var(--clr-grid-line-accent);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-text-muted); font-size: 17px;
          text-decoration: none;
          transition: border-color 0.3s ease, color 0.3s ease, transform 0.3s ease, background 0.3s ease;
        }

        .ct-social-link:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-accent-soft);
          transform: translateY(-3px);
        }

        .ct-form {
          display: flex; flex-direction: column; gap: 20px;
          background: linear-gradient(135deg, #041A53 0%, #030923 60%, #000000 100%);
          border: 0.5px solid var(--color-border);
          border-radius: 20px;
          padding: 40px;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .ct-form::after {
          content: '';
          position: absolute; top: 0; left: 24px; right: 24px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
        }

        .ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

        .ct-field { display: flex; flex-direction: column; gap: 8px; }

        .ct-label {
          font-size: 11px; font-weight: 600; color: var(--color-text-muted);
          text-transform: uppercase; letter-spacing: 0.09em;
        }

        .ct-input, .ct-textarea {
          background: var(--color-bg-deep);
          border: 0.5px solid var(--clr-grid-line-accent);
          border-radius: 10px;
          padding: 13px 15px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text);
          outline: none;
          transition: border-color 0.25s ease, background 0.25s ease;
          resize: none;
        }

        .ct-input::placeholder, .ct-textarea::placeholder { color: var(--color-text-muted); }

        .ct-input:focus, .ct-textarea:focus {
          border-color: var(--color-accent);
          background: var(--color-accent-soft);
        }

        .ct-textarea { min-height: 140px; line-height: 1.6; }

        .ct-submit {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          background: var(--color-accent);
          color: var(--color-text);
          border: none;
          border-radius: 10px;
          padding: 15px 24px;
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.01em;
          cursor: pointer;
          margin-top: 6px;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.25s ease, transform 0.2s ease, filter 0.25s ease, opacity 0.25s ease;
        }

        .ct-submit::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
          transform: translateX(-120%);
          transition: transform 0.6s ease;
        }

        .ct-submit:hover:not(:disabled)::before { transform: translateX(120%); }

        .ct-submit:hover:not(:disabled) {
          box-shadow: 0 10px 30px -10px var(--color-accent-mid);
          transform: translateY(-2px);
          filter: brightness(1.08);
        }
        .ct-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .ct-submit-arrow { transition: transform 0.25s ease; }
        .ct-submit:hover:not(:disabled) .ct-submit-arrow { transform: translate(3px, -3px); }

        .ct-status-msg {
          font-size: 12.5px; font-weight: 600;
          padding: 10px 14px; border-radius: 8px;
          display: flex; align-items: center; gap: 8px;
        }

        .ct-status-msg--sent {
          color: var(--color-accent);
          background: var(--color-accent-soft);
          border: 0.5px solid var(--color-border);
        }

        .ct-status-msg--error {
          color: var(--color-text);
          background: var(--color-bg-deep);
          border: 0.5px solid var(--clr-grid-line-accent);
        }

        @media (max-width: 900px) {
          .ct-cols { grid-template-columns: 1fr; gap: 40px; }
          .ct-glow { width: 340px; height: 340px; }
        }

        @media (max-width: 540px) {
          .ct-form { padding: 28px 22px; }
          .ct-row { grid-template-columns: 1fr; gap: 18px; }
        }

        @media (max-width: 380px) {
          .ct-socials { flex-wrap: wrap; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ct-submit, .ct-social-link, .ct-info-item, .ct-status-dot, .ct-glow { transition: none !important; animation: none !important; }
          [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>

      <section ref={sectionRef} className="section-root" id="contact" aria-label="Contact">
        <div className="global-layout-grid" aria-hidden="true" />
        <div className="ct-glow" aria-hidden="true" />
        <div className="section-separator" aria-hidden="true" />

        <div className="section-inner">
          <header className="section-header" data-reveal>
            <div className="section-eyebrow">
              <div className="section-eyebrow-line" aria-hidden="true" />
              <span className="section-eyebrow-text">Contact</span>
            </div>
            <h2 className="section-title">
              Let&apos;s build <span className="section-title-accent">something</span>
            </h2>
            <p className="ct-sub">
              Have a project in mind or just want to say hi? Fill out the form
              and I&apos;ll get back to you within a day.
            </p>
          </header>

          <div className="ct-cols">
            <div className="ct-left" data-reveal>
              <div className="ct-status">
                <span className="ct-status-dot" aria-hidden="true" />
                <span className="ct-status-text">Available for new projects</span>
              </div>

              <div className="ct-info-list">
                {CONTACT_INFO.map((item) =>
                  item.href ? (
                    <a
                      className="ct-info-item"
                      key={item.label}
                      href={item.href}
                    >
                      <span className="ct-info-icon" aria-hidden="true">
                        <i className={`ti ${item.icon}`} />
                      </span>
                      <span className="ct-info-text">
                        <span className="ct-info-label">{item.label}</span>
                        <span className="ct-info-value">{item.value}</span>
                      </span>
                    </a>
                  ) : (
                    <div className="ct-info-item" key={item.label}>
                      <span className="ct-info-icon" aria-hidden="true">
                        <i className={`ti ${item.icon}`} />
                      </span>
                      <span className="ct-info-text">
                        <span className="ct-info-label">{item.label}</span>
                        <span className="ct-info-value">{item.value}</span>
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="ct-socials">
                {SOCIALS.map((s) => (
                  <a
                    className="ct-social-link"
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

            <form className="ct-form" onSubmit={handleSubmit} data-reveal>
              <div className="ct-row">
                <div className="ct-field">
                  <label className="ct-label" htmlFor="ct-name">Name</label>
                  <input
                    id="ct-name"
                    name="name"
                    className="ct-input"
                    type="text"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="ct-field">
                  <label className="ct-label" htmlFor="ct-email">Email</label>
                  <input
                    id="ct-email"
                    name="email"
                    className="ct-input"
                    type="email"
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="ct-field">
                <label className="ct-label" htmlFor="ct-message">Message</label>
                <textarea
                  id="ct-message"
                  name="message"
                  className="ct-textarea"
                  placeholder="Tell me a bit about your project..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                className="ct-submit"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending..." : "Send message"}
                <span className="ct-submit-arrow" aria-hidden="true">→</span>
              </button>

              {status === "sent" && (
                <div className="ct-status-msg ct-status-msg--sent" role="status">
                  <i className="ti ti-circle-check" aria-hidden="true" />
                  Message sent — I&apos;ll reply within 24 hours.
                </div>
              )}

              {status === "error" && (
                <div className="ct-status-msg ct-status-msg--error" role="alert">
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  Something went wrong. Try emailing me directly instead.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}