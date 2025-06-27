'use client';

import Link from 'next/link';

export default function HomeHero() {
  return (
    <section className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center pt-20"
      style={{ backgroundImage: "url('./background.jpg')" }} // Place hero-bg.jpg in public folder
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 flex flex-col justify-center sm:items-start text-white">
        <h1 className="text-2xl sm:text-5xl md:text-6xl font-extrabold uppercase max-w-3xl leading-tight mb-6">
          Capturing Moments <br/> Creating Memories
        </h1>

        <p className="text-base sm:text-lg md:text-xl max-w-xl mb-8 text-gray-200">
          Capturing your most memorable moments with creativity and precision,
          turning them into timeless images that tell your story.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="#contact"
            className="text-white border border-white px-6 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black transition"
          >
            Contact Us
          </Link>
          <Link
            href="./gallery"
            className="text-white border border-white px-6 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black transition"
          >
            See Our Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
