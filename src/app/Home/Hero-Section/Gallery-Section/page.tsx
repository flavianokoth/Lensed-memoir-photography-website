"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Photo {
  id: string;
  url: string;
  storage_path: string;
  alt: string;
  created_at: string;
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
      if (!supabase) {
        throw new Error("Supabase is not configured. Missing env vars.");
      }
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      setGallery(data ?? []);
    } catch (err) {
      console.error("Error fetching photos:", err);
      setGallery([]);
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
                    key={item.id}
                    className="mb-4 break-inside-avoid rounded-lg overflow-hidden shadow-md"
                  >
                    <Image
                      src={item.url}
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
