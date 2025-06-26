import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import picture1 from "../../assets/picture1.svg";

export default function AboutSection() {
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    document.body.style.overflow = canScroll ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [canScroll]);

  return (
    <div id="aboutme">
      <section className="pt-20 snap-screen min-h-screen w-full flex items-center justify-center text-[#F4FEFE] px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-0">
      <div className="max-w-7xl w-full mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0"
        >
          <div className="w-[70%] xs:w-[60%] sm:w-[50%] md:w-[80%] aspect-square rounded-md flex items-center justify-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <img
              src={picture1}
              alt="Profile"
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>
        </motion.div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <motion.h2
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onAnimationComplete={() => setCanScroll(true)}
            className="text-2xl xs:text-3xl sm:text-4xl font-bold"
          >
            The <span className="text-[#00E3CC]">Vision</span> Behind the Code
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-[#8FA4AD] text-sm xs:text-base sm:text-lg max-w-md mx-auto md:mx-0 mt-3 sm:mt-4 leading-relaxed sm:leading-loose"
          >
            Front-End Developer focused on performance, accessibility, and seamless user experiences.
            With expertise in React, Tailwind CSS, and modern animation libraries like Framer Motion,
            I specialize in turning complex designs into high-performing, responsive web interfaces.
            My goal is to blend design precision with functional excellence.
          </motion.p>

          <motion.a
            href="mailto:abdulsalamkhanwbd@gmail.com"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="inline-block mt-4 text-sm sm:text-base text-[#5F7884] hover:text-[#00E3CC] transition-colors"
          >
            abdulsalamkhanwbd@gmail.com
          </motion.a>
        </div>
      </div>
    </section>
    </div>
  );
}