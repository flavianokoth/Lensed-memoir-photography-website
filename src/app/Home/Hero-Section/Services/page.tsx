"use client";

import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";

const services = [
  {
    title: "Wedding Photography",
    image: "/wedding photo.jpg",
    description: "Capturing the joy and elegance of your big day.",
    link: "/services/wedding",
  },
  {
    title: "Portrait Photography",
    image: "/potrait photo.webp",
    description: "Professional portraits that highlight your personality.",
    link: "/services/portrait",
  },
  {
    title: "Event Photography",
    image: "/event photo.jpg",
    description: "Preserving the moments that matter at your special events.",
    link: "/services/event",
  },
  {
    title: "Landscape Photography",
    image: "/landscape photo.jpg",
    description: "Breathtaking views captured with precision and art.",
    link: "/services/landscape",
  },
  {
  title: "Product Photography",
  image: "/product photo.jpg",
  description: "Showcase your products in the best light with high-resolution, creative shots.",
  link: "/services/product",
},
{
  title: "lifestylPhotography",
  image: "/lifestyle photo.jpg",
  description: "Capture the essence of your special occasions.",
  link: "/services/event",
},

];

// Services Section Component
export default function ServicesSection() {
  const { ref: inViewRef, inView } = useInView({ threshold: 0.2 });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1.2, spacing: 16 },
    loop: true,
    mode: "free",
    breakpoints: {
      "(min-width: 768px)": { slides: { perView: 4, spacing: 16 } },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  return (
    <section ref={inViewRef} className="py-24 px-4 sm:px-8 lg:px-16 bg-amber-50">
      <AnimatePresence>
        {inView && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h2 className="text-yellow-500 text-sm font-bold uppercase tracking-wide mb-2">
              Services
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-black mb-12">
              Professional Photography Services
            </h3>

            {/* Keen slider */}
            <div ref={sliderRef} className="keen-slider">
              {services.map((service, index) => (
                <div
                   key={index}
                   className="keen-slider__slide bg-white shadow-lg rounded-xl overflow-hidden relative group min-h-[380px]"
                 >
                   <div className="relative h-56 w-full">
                     <Image src={service.image} alt={service.title} fill className="object-cover" />
                   </div>
                   <div className="p-4 text-left">
                     <h4 className="text-xl font-semibold mb-1 text-black">
                       {service.title}
                     </h4>
                     <p className="text-sm text-gray-600 mb-8">
                       {service.description}
                     </p>
                     <Link
                       href={service.link}
                       className="absolute bottom-4 left-4 text-sm text-black font-medium flex items-center hover:underline"
                     >
                       Read more <span className="ml-1">&#8594;</span>
                     </Link>
                   </div>
                 </div>
               ))}
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {services.map((_, index) => (
                <button
                   key={index}
                   onClick={() => instanceRef.current?.moveToIdx(index)}
                   className={`w-3 h-3 rounded-full ${
                     currentSlide === index ? "bg-yellow-500" : "bg-gray-300"
                   }`}
                 ></button>
               ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  )
}

