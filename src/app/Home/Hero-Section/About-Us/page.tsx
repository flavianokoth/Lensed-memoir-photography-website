"use client";

import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutPage() {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <section
      className="bg-cover bg-center bg-no-repeat py-20 px-4 sm:px-8 lg:px-16"
      style={{ backgroundImage: "url('/aboutsection.jpg')" }}
    >
      <AnimatePresence>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        >
          {/* Left Image */}
          <div className="w-full h-80 relative">
            <Image
              src="/img25.png"
              alt="Photographer behind the lens"
              fill
              className="object-cover rounded-xl"
            />
          </div>

          {/* Right Text Content */}
          <div className="text-white">
            <h2 className="text-lg text-yellow-500 font-bold uppercase mb-2">
              About Us
            </h2>
            <h3 className="text-4xl font-extrabold text-black mb-6">
              Behind The Lens
            </h3>
            <p className="text-base text-gray-900 leading-relaxed mb-6">
              At the heart of our photography is a passion for storytelling. With
              years of experience capturing life&#39;s most cherished moments, we
              believe every photo should reflect the essence of your unique
              journey. Our approach blends creativity with technical skill to
              deliver images that last a lifetime. Whether it&#39;s a candid portrait
              or a breathtaking landscape, we are committed to turning your vision
              into art.
            </p>
            <Link
              href="/contact"
              className="inline-block border border-black rounded-full px-6 py-2 text-sm font-medium text-black hover:bg-gray-200 transition"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
