import Image from "next/image";

const images = [
  { src: "/gallery 1.jpg", alt: "Gallery 1" },
  { src: "/gallery 2.jpg", alt: "Gallery 2" },
  { src: "/gallery 3.jpg", alt: "Gallery 3" },
  { src: "/gallery 4.jpg", alt: "Gallery 4" },
  { src: "/gallery 5.jpg", alt: "Gallery 5" },
  { src: "/gallery 6.jpg", alt: "Gallery 6" },
];

export default function Gallery() {
  return (
    <section className="p-5 sm:p-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
          Welcome to Our <span className="text-yellow-500">Gallery</span>
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Step into a world captured through the lens.
        </p>
      </div>

      <div className="columns-1 gap-5 sm:columns-2 sm:gap-8 md:columns-3 lg:columns-4 [&>img:not(:first-child)]:mt-8">
        {images.map((image, idx) => (
          <div key={idx} className="break-inside-avoid mb-6">
            <Image
              src={image.src}
              alt={image.alt}
              width={500}
              height={500}
              className="w-full object-cover rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
