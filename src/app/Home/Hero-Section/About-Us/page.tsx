"use client";

import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

export default function AboutPage() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });

  return (
    <section
      id="about"
      data-header-theme="dark"
      ref={ref}
      className="bg-cover bg-center bg-no-repeat py-20 px-4 sm:px-8 lg:px-16"
      style={{ backgroundImage: "url('/aboutsection.jpg')" }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -150, scale: 0.8 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -150, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-80 relative"
          >
            <Image
              src="/img25.png"
              alt="Photographer behind the lens"
              fill
              className="object-cover rounded-xl"
            />
          </motion.div>

          {/* Right Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 150, scale: 0.8 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 150, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white"
          >
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
              href="/Contact"
              className="inline-block border border-black rounded-full px-6 py-2 text-sm font-medium text-black hover:bg-gray-200 transition"
            >
              Contact Us
            </Link>
          </motion.div>
      </div>
    </section>
  );
}
