import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const boxVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hovered: {
    y: -5,
    transition: { duration: 0.3 },
  },
};

export default function AboutBoxes({ aboutBoxes = [] }) {
  return (
    <div id="whyme" className="snap-always snap-start">
<section className="w-full relative overflow-hidden px-4 sm:px-6 md:px-10 pt-28 pb-20 text-[#F4FEFE] flex items-center box-border">
        <div className="max-w-7xl mx-auto w-full mt-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold">
              <span className="text-[#00E3CC]">Designed</span> to Deliver, Built to Impress
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              viewport={{ once: true }}
              className="text-[#B4C3CC] mt-2 text-xs xs:text-sm max-w-2xl mx-auto"
            >
              Some more details about myself
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-h-[50vh]"
          >
            <div className="flex flex-col gap-4 sm:gap-6">
              <motion.div
                variants={boxVariants}
                whileHover="hovered"
                className="relative bg-[#182B31]/90 hover:bg-[#182B31] rounded-xl sm:rounded-2xl p-5 sm:p-6 
                  shadow-lg shadow-[#58717D]/20 hover:shadow-[#58717D]/40 transition duration-300
                  backdrop-blur-sm border border-[#1E3A46]/50"
              >
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00E3CC]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="relative z-10 flex flex-col">
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#F4FEFE] mb-2 sm:mb-3">
                    My Current Goal
                  </h2>
                  <p className="text-xs sm:text-sm text-[#B4C3CC]">
                     To master full-stack development and deepen my expertise in
                  React and AI integration — not just as a developer, but as a
                  builder of scalable, meaningful applications. I aim to
                  actively contribute to open-source communities, sharpen
                  problem-solving through collaboration, and continuously push
                  my creative and technical boundaries. I'm focused on working
                  with global teams, adapting to evolving tech stacks, and
                  delivering solutions that are not only innovative, but
                  impactful. Staying current with modern frameworks, design
                  patterns, and industry trends is not a task — it's a habit. My
                  mission is to transform knowledge into experiences that create
                  value and leave a lasting impression.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={boxVariants}
                whileHover="hovered"
                className="relative bg-[#182B31]/90 hover:bg-[#182B31] rounded-xl sm:rounded-2xl p-5 sm:p-6 
                  shadow-lg shadow-[#58717D]/20 hover:shadow-[#58717D]/40 transition duration-300
                  backdrop-blur-sm border border-[#1E3A46]/50"
              >
                <div className="relative z-10 flex flex-col">
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#F4FEFE] mb-2 sm:mb-3">
                    My Message
                  </h2>
                  <p className="text-xs sm:text-sm text-[#B4C3CC]">
                    I don’t just build user interfaces — I design seamless,
                  responsive, and purpose-driven digital experiences that speak
                  with clarity, move with intent, and look sharp on every
                  screen. Every component I write reflects precision,
                  performance, and passion. My goal is always the same: create
                  experiences that feel effortless to use but impossible to
                  forget. I believe great design isn’t just about visuals — it’s
                  about emotion, flow, and solving real problems with elegance.
                  I obsess over the small details — the micro-interactions, the
                  hover states, the scroll behaviors — because I know they make
                  the difference. I write clean, scalable code not for machines,
                  but for the developers who follow. And at the heart of it all,
                  I build for people — not just pixels.
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6">
              <motion.div
                variants={boxVariants}
                whileHover="hovered"
                className="relative bg-[#182B31]/90 hover:bg-[#182B31] rounded-xl sm:rounded-2xl p-5 sm:p-6 
                  shadow-lg shadow-[#58717D]/20 hover:shadow-[#58717D]/40 transition duration-300
                  backdrop-blur-sm border border-[#1E3A46]/50"
              >
                <div className="relative z-10 flex flex-col">
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#F4FEFE] mb-2 sm:mb-3">
                    Experience
                  </h2>
                  <p className="text-xs sm:text-sm text-[#B4C3CC]">
                    Over the past year, I’ve built a strong foundation as a
                  front-end developer — crafting responsive, accessible, and
                  dynamic user interfaces using tools like React, Tailwind CSS,
                  and Framer Motion. I’ve worked on real-world projects ranging
                  from portfolio sites to data-driven apps, translating design
                  concepts into live, interactive experiences. My focus on clean
                  code, reusable components, and smooth performance has enabled
                  me to deliver consistent results across desktop and mobile
                  platforms. Whether debugging layout issues or implementing
                  subtle animations, I aim to build with purpose, clarity, and
                  user-first thinking.I actively collaborated with
                  cross-functional teams and designers, ensuring every UI detail
                  aligned perfectly with user goals and brand identity.I
                  leveraged Git and GitHub for version control and task
                  management, maintaining clean commits and collaborative
                  efficiency.Through consistent practice, I improved at breaking
                  down complex UI problems into modular, maintainable
                  components.Beyond the code, I constantly refined my
                  understanding of performance optimization, accessibility, and
                  responsive design patterns.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={boxVariants}
                whileHover="hovered"
                className="relative bg-[#182B31]/90 hover:bg-[#182B31] rounded-xl sm:rounded-2xl p-5 sm:p-6 
                  shadow-lg shadow-[#58717D]/20 hover:shadow-[#58717D]/40 transition duration-300
                  backdrop-blur-sm border border-[#1E3A46]/50"
              >
                <div className="relative z-10 flex flex-col">
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#F4FEFE] mb-2 sm:mb-3">
                    Employment
                  </h2>
                  <p className="text-xs sm:text-sm text-[#B4C3CC]">
                    2024 till 2025
                    <br />
                    IGI Global Treading inc. <br /> Junior Front-end developer
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}