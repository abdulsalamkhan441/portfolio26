import { motion } from "framer-motion";
import { FaXTwitter, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6"; 
import { Link } from "react-router-dom";
import { useCallback } from "react";

export default function Footer() {
  const links = [
    "About Me",
    "Skills",
    "Projects",
    "Why me",
    "Contact Us"
  ];

  const handleFooterNavClick = useCallback((item) => {
    const id = item.replace(/\s+/g, "").toLowerCase();
    const target = document.getElementById(id);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      alert(`No section found for ID: ${id}`);
    }
  }, []);

  return (
    <footer className="w-full text-[#B4C3CC] px-6 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#58717D] via-[#1E3A46] to-[#58717D] opacity-30 blur-sm"></div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          <div>
            <div className="flex items-center gap-3">
              <Link to="/"><h1 className="text-[#F4FEFE] text-3xl font-light" style={{fontFamily: "Allura"}}>Abdul Salam Khan </h1></Link>
            </div>
            <p className="mt-4 text-sm text-[#B4C3CC] max-w-xs">
              Designing the digital future with precision and performance.
            </p>
          </div>

          <div className="flex flex-col md:items-center gap-2">
            <h3 className="text-[#F4FEFE] text-lg font-semibold mb-2">Quick Links</h3>
            {links.map((link) => (
              <button
                key={link}
                onClick={() => handleFooterNavClick(link)}
                className="hover:text-[#F4FEFE] hover:underline hover:tracking-wide transition duration-300 text-left"
                style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
              >
                {link}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:items-end gap-4">
            <h3 className="text-[#F4FEFE] text-lg font-semibold">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://x.com/abdulsalamk_k"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B4C3CC] hover:text-[#F4FEFE] hover:scale-110 transition duration-300"
                aria-label="Twitter"
              >
                <FaXTwitter size={20} />
              </a>
              <a
                href="https://github.com/abdulsalamkhan441"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B4C3CC] hover:text-[#F4FEFE] hover:scale-110 transition duration-300"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://www.instagram.com/salam_k007/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B4C3CC] hover:text-[#F4FEFE] hover:scale-110 transition duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/abdulsalam-khan-148a1033b"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B4C3CC] hover:text-[#F4FEFE] hover:scale-110 transition duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="text-center text-xs text-[#58717D] mt-10">
        © 2025 ASK Design. All rights reserved.
      </p>
    </footer>
  );
}
