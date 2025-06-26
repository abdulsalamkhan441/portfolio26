import { motion } from "framer-motion";
import picture1 from "../../assets/picture1.svg";
import { useEffect, useState } from "react";

export default function First() {
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    if (!canScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [canScroll]);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20"
    >
      <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left">
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onAnimationComplete={() => setCanScroll(true)}
          className="text-4xl md:text-5xl font-bold text-[#B4C3CC] mb-4"
        >
          Front-end Developer
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-base md:text-lg text-[#F4FEFE] mt-2 leading-relaxed max-w-2xl"
        >
          Front-End Developer focused on performance, accessibility, and seamless
          user experiences. With expertise in React, Tailwind CSS, and modern
          animation libraries like Framer Motion, I specialize in turning complex
          designs into high-performing, responsive web interfaces. My goal is to
          blend design precision with functional excellence.
        </motion.p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          href="/resume.pdf" 
          download 
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-[#1E3A46] to-[#58717D] rounded-full text-sm font-medium text-[#F4FEFE] shadow-lg shadow-[#1E3A46]/40"
        >
          Download Resume
        </motion.a>
      </div>
      <div className="flex-1 flex items-center justify-center mt-10 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1, ease: "easeOut" }}
          className="w-full max-w-[400px] md:max-w-[450px] h-auto flex items-center justify-center rounded-2xl overflow-hidden"
        >
          <img
            src={picture1}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </motion.div>
      </div>
    </section>
  );
}