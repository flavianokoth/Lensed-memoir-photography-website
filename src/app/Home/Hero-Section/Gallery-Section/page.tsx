"use client";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
export default function GallerySection() {
  const { ref, inView } = useInView({ threshold: 0.2 });

  // Just 6 images for 2 columns x 3 rows
  const gallery = [
    { src: "/gallery 1.jpg", alt: "Gallery 1" },
    { src: "/gallery 2.jpg", alt: "Gallery 2" },
    { src: "/gallery 3.jpg", alt: "Gallery 3" },
    { src: "/gallery 4.jpg", alt: "Gallery 4" },
    { src: "/gallery 5.jpg", alt: "Gallery 5" },
    { src: "/gallery 6.jpg", alt: "Gallery 6" },
  ];

  return (
    <section ref={ref} className="py-24 px-4 sm:px-8 lg:px-16 bg-white">
      <AnimatePresence>
        {inView && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-7xl mx-auto text-center"
          >
            <h2 className="text-yellow-500 text-sm font-bold uppercase mb-2 tracking-widest">
              Our Gallery
            </h2>

            {/* 2 columns, 3 rows, with gaps */}
            <div
              className="grid grid-cols-2 gap-6 my-12"
            >
              {gallery.map((item, index) => (
                <div key={index} className="relative w-full h-64">
                   <Image
                     src={item.src}
                     alt={item.alt}
                     fill
                     className="object-cover rounded-lg shadow-md"
                   />
                 </div>
               ))}
            </div>

            <Link
              href="./gallery"
              className="inline-block border border-black rounded-full px-6 py-2 text-sm font-semibold text-black hover:bg-gray-200 transition"
            >
              View All
            </Link>
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  )
}
