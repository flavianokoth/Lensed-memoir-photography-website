// src/components/Gallery.tsx
import Image from "next/image";

const images = [
  { src: "/gallery 1.jpg", alt: "gallery 1" },
  { src: "/images/gallery 2.jpg", alt: "gallery 2" },
  { src: "/images/gallery 3.jpg", alt: "gallery 3" },
  { src: "/images/gallery 4.jpg", alt: "photo 4" },
  { src: "/images/gallery 5.jpg", alt: "photo 5" },
  { src: "/images/gallery 6.jpg", alt: "photo 6" },
  { src: "/images/gallery 7.jpg", alt: "photo 7" },
  { src: "/images/gallery 8.jpg", alt: "photo 8" },
  // Add more if you wish
]

export function Gallery() {
  return (
    <section className="p-6 max-w-7xl mx-auto">
      <div 
        className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((image, idx) => (
          <div key={idx} className="break-inside-avoid">
            <Image 
              src={image.src} 
              alt={image.alt} 
              width={500} 
              height={500} 
              className="w-full mb-4 object-cover rounded-lg shadow-md" 
            />
          </div>
        ))}
      </div>
    </section>
  )
}
