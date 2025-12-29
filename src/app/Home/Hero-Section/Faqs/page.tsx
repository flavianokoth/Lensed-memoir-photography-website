"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "We offer wedding, portrait, event, and commercial photography services tailored to your needs.",
  },
  {
    question: "How can I book a session?",
    answer:
      "You can book a session by clicking the 'Schedule Us' button or contacting us through our contact page.",
  },
  {
    question: "Do you travel for shoots?",
    answer:
      "Yes, we are available for travel both locally and internationally. Additional fees may apply.",
  },
  {
    question: "How soon will I receive my photos?",
    answer:
      "You will receive your edited photos within 2 weeks after the shoot.",
  },
];

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" data-header-theme="light" ref={ref} className="max-w-2xl mx-auto py-12 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 80, scale: 0.8 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 80, scale: 0.8 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-3xl font-bold mb-8 text-center text-[#05554F]"
      >
        Frequently Asked Questions
      </motion.h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -150, scale: 0.8 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -150, scale: 0.8 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              delay: idx * 0.15 
            }}
            className="bg-white shadow-lg rounded-lg p-4 transition-all duration-200"
          >
            <button
              className="w-full flex justify-between items-center text-left font-semibold text-lg text-[#ff7b00] focus:outline-none"
              onClick={() => toggleFaq(idx)}
            >
              <span>{faq.question}</span>
              <span className="ml-2">
                {openIndex === idx ? (
                  // Up arrow
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#05554F"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 15l6-6 6 6"
                    />
                  </svg>
                ) : (
                  // Down arrow
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#05554F"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                )}
              </span>
            </button>

            {openIndex === idx && (
              <p className="mt-2 text-gray-700">{faq.answer}</p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
