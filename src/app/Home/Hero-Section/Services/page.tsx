'use client';

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaRing,
  FaUserAlt,
  FaCalendarAlt,
  FaMountain,
  FaBoxOpen,
  FaCameraRetro,
} from "react-icons/fa";

const services = [
   {
     title: "Wedding Photography",
     description: "Capturing the joy and elegance of your big day.",
     link: "/services/wedding",
     icon: FaRing,
   },
   {
     title: "Portrait Photography",
     description: "Professional portraits that highlight your personality.",
     link: "/services/portrait",
     icon: FaUserAlt,
   },
   {
     title: "Event Photography",
     description: "Preserving the moments that matter at your events.",
     link: "/services/event",
     icon: FaCalendarAlt,
   },
   {
     title: "Landscape Photography",
     description: "Breathtaking views captured with precision and art.",
     link: "/services/landscape",
     icon: FaMountain,
   },
   {
     title: "Product Photography",
     description: "Showcase your products with high-resolution creative shots.",
     link: "/services/product",
     icon: FaBoxOpen,
   },
   {
     title: "Lifestyle Photography",
     description: "Capture the essence of your everyday, candid moments.",
     link: "/services/lifestyle",
     icon: FaCameraRetro,
   },
 ];

// Services Section Component
export default function ServicesSection() {
  const { ref: inViewRef, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section
      id="services"
      data-header-theme="light"
      ref={inViewRef}
      className="py-24 px-4 sm:px-8 lg:px-16 bg-amber-50"
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
             <h2 className="text-yellow-500 text-sm font-bold uppercase tracking-wide mb-2">
               Services
             </h2>
             <h3 className="text-3xl md:text-4xl font-bold text-black mb-12">
               Professional Photography Services
             </h3>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map(({ title, description, link, icon: Icon }, index) => (
                 <div
                  key={title}
                  className={`bg-white shadow-lg rounded-2xl p-6 text-left flex flex-col gap-4 border border-white hover:border-yellow-200 transition ${
                    index >= 4 ? "lg:col-span-2" : ""
                  }`}
                >
                  <div className="h-14 w-14 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-2xl mx-auto lg:mx-0">
                    <Icon aria-hidden />
                  </div>
                  <div className={index >= 4 ? "text-center lg:text-left" : ""}>
                    <h4 className="text-xl font-semibold text-black mb-2">
                      {title}
                    </h4>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                  <Link
                    href={link}
                    className={`mt-auto inline-flex items-center text-sm font-semibold text-[#05554F] hover:text-[#ff7b00] transition ${
                      index >= 4 ? "justify-center lg:justify-start" : ""
                    }`}
                  >
                    Learn more <span className="ml-2">&#8594;</span>
                  </Link>
                </div>
              ))}
            </div>
      </motion.div>
    </section>
  );
}
