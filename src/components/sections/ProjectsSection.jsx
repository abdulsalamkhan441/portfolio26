import { motion } from "framer-motion";
import projects from "../../data/projects";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ProjectsSection() {
  return (
    <div id="projects">
      <section
      className="pt-20 snap-screen w-full h-screen px-4 sm:px-6 text-[#F4FEFE] bg-transparent flex items-center justify-center overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto w-full py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-4 sm:mb-6"
        >
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold">
            <span className="text-[#00E3CC]">Crafted</span> with Code, Fueled by Passion
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            viewport={{ once: true }}
            className="text-[#B4C3CC] mt-2 text-xs xs:text-sm max-w-2xl mx-auto"
          >
            Some of the professional and personal projects I've crafted.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-5 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-auto"
        >
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className={`h-full relative group rounded-lg md:rounded-xl overflow-hidden shadow-md 
  transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
  bg-[#1E3A46]/30 backdrop-blur-md border border-[#1E3A46]/50 ${
    idx === 0 ? "xl:col-span-2 xl:row-span-2" : ""
  }`}
            >
              <Link to={project.to} className="absolute inset-0 z-10" />

              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 cursor-pointer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F212E]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-4 sm:p-5 relative z-20">
                <h3 className="text-base sm:text-lg font-semibold text-[#F4FEFE]">
                  {project.title}
                </h3>
                {idx === 0 ? (
                  <ul className="list-disc list-inside text-xs sm:text-sm text-[#B4C3CC] mt-1">
                    {project.description
                      .split("\n")
                      .slice(1)
                      .map((line, i) => (
                        <li key={i}>{line.replace(/^- /, "")}</li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-xs sm:text-sm text-[#B4C3CC] mt-1">
                    {project.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] xs:text-xs px-2 py-1 bg-[#0F212E]/50 rounded-full text-[#8FA4AD]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
    </div>
  );
}
