import Image from "next/image";

const images = [
  "/gallery 1.jpg",
  "/gallery 2.jpg",
  "/gallery 3.jpg",
  "/gallery 4.jpg",
  "/gallery 5.jpg",
  "/gallery 6.jpg",
  "/gallery 7.jpg",
  "/gallery 8.jpg",
  "/gallery 9.jpg",
  "/gallery 10.jpg",
  "/gallery12.avif",
  // Add more image paths as needed
];

export default function GallerySection() {
  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#05554F]">Gallery</h2>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
        {images.map((src, idx) => (
          <div key={idx} className="mb-4 break-inside-avoid rounded-lg overflow-hidden shadow-lg">
            <Image
              src={src}
              alt={`Gallery photo ${idx + 1}`}
              width={400}
              height={600}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}