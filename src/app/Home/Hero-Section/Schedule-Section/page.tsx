"use client";

import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ScheduleSection() {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="relative py-20 px-4 sm:px-8 lg:px-16 overflow-hidden"
    >
      {/* Background image with softer blur overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/background-schedule.jpg')" }}
      >
        <div className="absolute inset-0 bg-green-800 bg-opacity-30 backdrop-blur-sm"></div>
      </div>

      <AnimatePresence>
        {inView && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-3xl mx-auto text-center text-white"
          >
            <h2 className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-4">
              Schedule Now
            </h2>

            <p className="text-3xl font-semibold whitespace-pre-line leading-snug mb-8">
              Ready To Capture Your Unique Story?
              {"\n"}Let’s Book Your Session
              {"\n"}Today!
            </p>

            <Link
              href="/contact"
              className="inline-block border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-medium px-8 py-3 rounded-full transition"
            >
              Schedule Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
