import { motion } from "framer-motion";
import { useRef } from "react";
import emailjs from "@emailjs/browser";
import map from "../../assets/map.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ContactSection() {
  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          alert("✅ Message sent successfully!");
          formRef.current.reset();
        },
        (error) => {
          alert("❌ Failed to send message. " + error.text);
        }
      );
  };

  return (
    <div id="contactus" className="snap-start">
      <section className="w-full relative overflow-hidden px-4 sm:px-6 md:px-10 pt-28 pb-20 text-[#F4FEFE] flex items-center box-border">
        <img
          src={map}
          alt="Map background"
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-10 md:opacity-20"
          style={{ pointerEvents: "none" }}
          loading="lazy"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="mb-6 sm:mb-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-2xl xs:text-3xl sm:text-4xl font-bold"
              >
                <span className="text-[#00E3CC]">Ping Me</span> – Let's Talk Pixels
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-[#B4C3CC] mt-2 text-xs xs:text-sm"
              >
                Test our abilities freely
              </motion.p>
            </div>

            <form ref={formRef} onSubmit={sendEmail} className="space-y-3 sm:space-y-4">
              <motion.input
                name="user_name"
                variants={fadeInUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                required
                className="w-full p-2 sm:p-3 bg-transparent border border-[#58717D]/50 hover:border-[#58717D] text-[#F4FEFE] placeholder-[#B4C3CC] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00E3CC] transition-all"
                placeholder="Name"
              />
              <motion.input
                name="user_email"
                type="email"
                variants={fadeInUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                required
                className="w-full p-2 sm:p-3 bg-transparent border border-[#58717D]/50 hover:border-[#58717D] text-[#F4FEFE] placeholder-[#B4C3CC] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00E3CC] transition-all"
                placeholder="Email"
              />
              <motion.input
                name="user_phone"
                type="tel"
                variants={fadeInUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="w-full p-2 sm:p-3 bg-transparent border border-[#58717D]/50 hover:border-[#58717D] text-[#F4FEFE] placeholder-[#B4C3CC] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00E3CC] transition-all"
                placeholder="Phone"
              />
              <motion.textarea
                name="message"
                variants={fadeInUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                required
                className="w-full p-2 sm:p-3 bg-transparent border border-[#58717D]/50 hover:border-[#58717D] text-[#F4FEFE] placeholder-[#B4C3CC] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00E3CC] transition-all"
                placeholder="Your message"
                rows="4"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto bg-gradient-to-r from-[#1E3A46] to-[#58717D] hover:from-[#1E3A46]/90 hover:to-[#58717D]/90 rounded-full text-[#F4FEFE] font-semibold px-5 py-2 sm:px-6 sm:py-3 shadow-md transition-all"
              >
                SEND
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="text-[#B4C3CC] mt-8 lg:mt-0"
          >
            <h2 className="text-[#F4FEFE] text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 font-semibold">
              Contact Information
            </h2>
            <div className="space-y-1 sm:space-y-2">
              <p>490 Beverly Street</p>
              <p>Winnipeg</p>
              <p>Canada</p>
            </div>
            <div className="mt-4 sm:mt-6 space-y-1 sm:space-y-2">
              <p>
                Call us: <span className="text-[#F4FEFE]">431-788-2868</span>
              </p>
              <p>
                Mon to Fri: <span className="text-[#F4FEFE]">09:00 – 18:00</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
