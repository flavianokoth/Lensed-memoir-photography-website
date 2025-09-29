"use client";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function GallerySection() {
  const { ref, inView } = useInView({ threshold: 0.2 });

  const gallery = [
    { src: "/gallery 1.jpg", alt: "Gallery 1" },
    { src: "/gallery 2.jpg", alt: "Gallery 2" },
    { src: "/gallery 3.jpg", alt: "Gallery 3" },
    { src: "/gallery 4.jpg", alt: "Gallery 4" },
    { src: "/gallery 5.jpg", alt: "Gallery 5" },
    { src: "/gallery 6.jpg", alt: "Gallery 6" },
  ];

  // Example random heights for masonry effect
  const heights = [300, 400, 250, 350, 280, 420];

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

            {/* Masonry columns */}
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4 my-12">
              {gallery.map((item, index) => (
                <div
                  key={index}
                  className="mb-4 break-inside-avoid rounded-lg overflow-hidden shadow-md"
                  style={{ height: heights[index % heights.length] }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={600}
                    height={heights[index % heights.length]}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>

            <Link
              href="./Gallery"
              className="inline-block border border-black rounded-full px-6 py-2 text-sm font-semibold text-black hover:bg-gray-200 transition"
            >
              View All
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}