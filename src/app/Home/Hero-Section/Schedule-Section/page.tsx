"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function ScheduleSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section
      id="Schedule-Section"
      data-header-theme="dark"
      ref={ref}
      className="relative py-20 px-4 sm:px-8 lg:px-16 overflow-hidden"
    >
      {/* Background image with softer blur overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background-schedule.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-green-800 bg-opacity-30 backdrop-blur-sm"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
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
    </section>
  );
}
