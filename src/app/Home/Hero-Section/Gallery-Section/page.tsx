"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const API = "http://localhost:4000/api";

interface Photo {
  _id: string;
  url: string;
  alt: string;
}

export default function GallerySection() {
  const [gallery, setGallery] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/photos`);
      if (res.ok) {
        const data = await res.json();
        // Show only first 6 photos on home page
        setGallery(data.slice(0, 6));
      }
    } catch (err) {
      console.error("Error fetching photos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="gallery"
      data-header-theme="light"
      className="py-24 px-4 sm:px-8 lg:px-16 bg-white"
    >
      <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-yellow-500 text-sm font-bold uppercase mb-2 tracking-widest">
              Our Gallery
            </h2>

            {/* Masonry columns - consistent on all screen sizes */}
            {loading ? (
              <div className="py-12">
                <p className="text-gray-500">Loading gallery...</p>
              </div>
            ) : gallery.length === 0 ? (
              <div className="py-12">
                <p className="text-gray-500">No photos in gallery yet.</p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 my-12">
                {gallery.map((item) => (
                  <div
                    key={item._id}
                    className="mb-4 break-inside-avoid rounded-lg overflow-hidden shadow-md"
                  >
                    <Image
                      src={item.url.startsWith("http") ? item.url : `http://localhost:4000${item.url}`}
                      alt={item.alt || "Gallery photo"}
                      width={600}
                      height={400}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}

            <div>
              <Link
                href="/Gallery"
                className="inline-block border border-black rounded-full px-6 py-2 text-sm font-semibold text-black hover:bg-gray-200 transition"
              >
                View All
              </Link>
            </div>
          </div>
    </section>
  );
}
