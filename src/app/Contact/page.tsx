"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Header from "../components/Header";

export default function Contact() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });

  return (
    <div>
      <Header />
      <section
        id="contact"
        data-header-theme="light"
        ref={ref}
        className="py-24 px-4 sm:px-8 lg:px-16 min-h-screen bg-gray-50 pt-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.7 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 100, scale: 0.7 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto rounded-3xl bg-white p-8 md:p-12 shadow-lg"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-[#05554F]">Contact Us</h2>
          <p className="text-sm md:text-base text-gray-600 mb-8">
            Get in touch with us to schedule your photography session or ask any questions. We&apos;d love to hear from you!
          </p>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#05554F] focus:border-transparent transition"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#05554F] focus:border-transparent transition"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#05554F] focus:border-transparent transition resize-none"
                placeholder="Tell us about your photography needs..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#05554F] hover:bg-[#033d38] text-white font-semibold px-6 py-3 rounded-md transition-colors duration-200"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
