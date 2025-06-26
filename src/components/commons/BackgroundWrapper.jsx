import { motion } from "framer-motion";
import { useMemo } from "react";

export default function BackgroundWrapper({ children }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 150 }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 3,
      })),
    []
  );

  const meteors = useMemo(
    () =>
      Array.from({ length: 3 }, () => ({
        top: `${Math.random() * 100}%`,
        duration: 3 + Math.random() * 2,
      })),
    []
  );

  return (
    <div className="relative w-full min-h-screen bg-[#0A0E14] overflow-hidden">
      <motion.div
        className="absolute w-[400px] h-[400px] bg-[#1E3A46] opacity-30 rounded-full blur-3xl top-[-100px] left-[-100px]"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] bg-[#58717D] opacity-20 rounded-full blur-2xl bottom-[-100px] right-[-100px]"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] bg-[#1E3A46] opacity-25 rounded-full blur-3xl left-3/4 top-[30%] transform -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-[300px] h-[300px] bg-[#58717D] opacity-15 rounded-full blur-2xl left-1/4 top-[65%] transform -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {stars.map((star, i) => (
        <motion.span
          key={`star-${i}`}
          className="absolute w-[3px] h-[3px] bg-white rounded-full"
          style={{
            top: star.top,
            left: star.left,
          }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.5, 1] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}

      {meteors.map((meteor, i) => (
        <motion.div
          key={`meteor-${i}`}
          className="absolute w-40 h-[2px] bg-gradient-to-r from-white via-[#B4C3CC] to-transparent blur-sm opacity-80"
          initial={{
            top: meteor.top,
            left: "-200px",
            rotate: 180,
          }}
          animate={{ left: "120%" }}
          transition={{
            duration: meteor.duration,
            repeat: Infinity,
            delay: i * 4,
            ease: "linear",
          }}
        />
      ))}

      <motion.div
        className="absolute w-[500px] h-[300px] bg-[#ffffff1a] rounded-full blur-2xl top-[30%] left-[40%] opacity-5"
        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
