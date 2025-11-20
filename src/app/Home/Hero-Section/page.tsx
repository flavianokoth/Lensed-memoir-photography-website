import Image from "next/image";
import Link from "next/link";

export default function HomeHero() {
  return (
    <section
      id="hero"
      data-header-theme="dark"
      className="relative min-h-screen flex items-center pt-24"
    >
      <div className="absolute inset-0">
        <Image
          src="/background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col justify-center sm:items-start text-white">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase max-w-3xl leading-tight mb-6">
          Capturing Moments <br /> Creating Memories
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
            href="#gallery"
            className="text-white border border-white px-6 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black transition"
          >
            See Our Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
