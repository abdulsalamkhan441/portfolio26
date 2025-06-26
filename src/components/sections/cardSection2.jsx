import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import image1 from "../../assets/8.png";
import image2 from "../../assets/9.png";
import image3 from "../../assets/15.png";

const imageArray = [image1, image2, image3];

const images = [
  { id: 0, src: image1, link: "https://askweb9.netlify.app/" },
  { id: 1, src: image2, link: "https://askweb10.netlify.app/" },
  { id: 2, src: image3, link: "https://askweb17.netlify.app/" },
];

export default function CardSection2() {
  const controls = useAnimation();
  const [triggered, setTriggered] = useState(false);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          controls.start("visible");
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => containerRef.current && observer.unobserve(containerRef.current);
  }, [triggered, controls]);

  const radius = 320;
  const angleStep = (2 * Math.PI) / images.length;

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 py-10"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={triggered ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        className="relative z-20 text-center text-[#F4FEFE] max-w-lg px-4 mb-10"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          The Heartbeat of <span className="text-[#00E3CC]">Progress</span>
        </h2>
        <p className="text-[#B4C3CC] text-sm sm:text-base md:text-lg leading-relaxed">
          At the heart of my work lies precision, performance, and purpose. This is what powers every pixel.
        </p>
      </motion.div>

      {isMobile ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={triggered ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 gap-6 w-full max-w-sm z-10"
        >
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={triggered ? { opacity: 1, scale: 1 } : {}}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 100,
                damping: 14,
              }}
              className="relative rounded-2xl overflow-hidden shadow-2xl bg-white"
            >
              <img
                src={img.src}
                alt={`image-${index}`}
                className="w-full h-72 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-2 text-sm">
                <a
                  href={img.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full h-full"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Check Now
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <>
          {images.map((img, index) => {
            const angle = index * angleStep;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={img.id}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.9 }}
                animate={controls}
                variants={{
                  visible: {
                    x,
                    y,
                    opacity: 1,
                    scale: 1,
                    transition: {
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 100,
                      damping: 14,
                    },
                  },
                }}
                className="absolute group w-[220px] h-[220px] rounded-xl overflow-hidden shadow-xl border-2 border-white/10 bg-white" 
              >
                <img
                  src={img.src}
                  alt={`image-${index}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <a
                    href={img.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium tracking-wide w-full h-full flex items-center justify-center"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Check Now
                  </a>
                </div>
              </motion.div>
            );
          })}
        </>
      )}
    </section>
  );
}
