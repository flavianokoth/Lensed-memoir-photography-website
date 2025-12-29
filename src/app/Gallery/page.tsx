"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../components/Header";

const API = "http://localhost:4000/api";

interface Photo {
  _id: string;
  url: string;
  alt: string;
}

export default function GallerySection() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/photos`);
      const data = await res.json();
      setPhotos(data);
    } catch (err) {
      console.error("Error fetching photos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <section className="max-w-6xl mx-auto py-12 px-4 pt-32">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#05554F]">Gallery</h2>
        
        {loading ? (
          <p className="text-center text-gray-500">Loading gallery...</p>
        ) : photos.length === 0 ? (
          <p className="text-center text-gray-500">No photos in gallery yet.</p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {photos.map((photo) => (
              <div key={photo._id} className="mb-4 break-inside-avoid rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={photo.url.startsWith("http") ? photo.url : `http://localhost:4000${photo.url}`}
                  alt={photo.alt || "Gallery photo"}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-lg"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
