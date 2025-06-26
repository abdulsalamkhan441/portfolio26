import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { skills } from "../../data/skills";

export default function Skills() {
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const handleScroll = (e) => {
      if (!canScroll) e.preventDefault();
    };

    document.body.style.overflow = canScroll ? "auto" : "hidden";
    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("touchmove", handleScroll, { passive: false });

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [canScroll]);

  return (
    <div id="skills">
      <section className="pt-20 snap-screen h-screen w-full px-6 flex flex-col items-center justify-center text-[#F4FEFE]">
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-3xl md:text-4xl font-bold text-center mb-4"
      >
        The <span className="text-[#00E3CC]">Stack</span> That Builds the Magic
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-[#B4C3CC] max-w-xl text-center mb-10 text-base md:text-lg"
      >
        These are the tools and technologies I specialize in. I build responsive,
        scalable, and beautiful front-end interfaces with these.
      </motion.p>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 w-full max-w-5xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
        onAnimationComplete={() => setCanScroll(true)}
      >
        {skills.map(({ name, icon: Icon }, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
            className="flex flex-col items-center justify-center p-6 bg-[#182B31] border border-[#58717D] rounded-2xl shadow-lg shadow-[#58717D]/20 hover:shadow-[#58717D]/40 transition duration-300"
          >
            <Icon className="w-10 h-10 mb-2 text-[#F4FEFE]" />
            <span className="text-sm font-medium text-[#B4C3CC]">{name}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
    </div>
  );
}
