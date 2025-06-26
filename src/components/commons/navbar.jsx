import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ["About Me", "Skills", "Projects", "Why me"];

  useEffect(() => {
    const sections = ["aboutme", "skills", "projects", "whyme"];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          const sectionId = visible.target.id;
          const match = {
            aboutme: "About Me",
            skills: "Skills",
            projects: "Projects",
            whyme: "Why me",
          };
          setActive(match[sectionId]);
        }
      },
      { threshold: 0.4 }
    );

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const smoothScrollTo = (targetY, duration, offset = 80) => {
  const startY = window.scrollY;
  const diff = targetY - offset - startY;
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

const handleNavClick = (item) => {
  const id = item.replace(/\s+/g, "").toLowerCase();
  const target = document.getElementById(id);

  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    alert(`No section found for ID: ${id}`);
  }

  setActive(item);
  setMenuOpen(false);
};



  return (
    <nav className="fixed w-full px-6 py-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/">
            <h1
              className="text-[#F4FEFE] text-3xl font-light"
              style={{ fontFamily: "Allura" }}
            >
              Abdul Salam Khan
            </h1>
          </Link>
        </div>

        <ul className="hidden md:flex gap-6 px-2 py-1 rounded-full border border-[#58717D] backdrop-blur-md">
          {navItems.map((item) => (
            <motion.li
              key={item}
              className={`px-4 py-1 text-sm rounded-full cursor-pointer font-medium relative transition duration-300 ${
                active === item ? "text-[#F4FEFE]" : "text-[#B4C3CC]"
              }`}
              whileHover={{ scale: 1.1 }}
              onClick={() => handleNavClick(item)}
            >
              <span
                className={`absolute inset-0 rounded-full z-[-1] transition-all duration-300 ${
                  active === item
                    ? "bg-gradient-to-r from-[#1E3A46] to-[#58717D] shadow-lg shadow-[#58717D]/40"
                    : ""
                }`}
              ></span>
              {item}
            </motion.li>
          ))}
        </ul>

        <motion.button
          whileHover={{ scale: 1.1 }}
          className="hidden md:inline-block text-[#F4FEFE] font-medium text-sm px-5 py-2 rounded-full bg-gradient-to-r from-[#1E3A46] to-[#58717D] shadow-md shadow-[#58717D]/50"
          onClick={() => handleNavClick("Contact Us")}
        >
          Contact Us
        </motion.button>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#F4FEFE] focus:outline-none"
          >
            {menuOpen ? <HiX size={26} /> : <HiMenu size={26} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 flex flex-col gap-4 rounded-xl px-6 py-4 border border-[#58717D] backdrop-blur-lg"
          >
            {navItems.map((item) => (
              <li
                key={item}
                className={`text-sm font-medium cursor-pointer transition duration-300 ${
                  active === item ? "text-[#F4FEFE]" : "text-[#B4C3CC]"
                }`}
                onClick={() => handleNavClick(item)}
              >
                {item}
              </li>
            ))}

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full text-[#F4FEFE] font-medium text-sm px-5 py-2 mt-2 rounded-full bg-gradient-to-r from-[#1E3A46] to-[#58717D] shadow-md shadow-[#58717D]/50"
              onClick={() => handleNavClick("Contact Us")}
            >
              Contact Us
            </motion.button>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}
