"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../components/Header";
import { supabase } from "@/lib/supabase";

interface Photo {
  id: string;
  url: string;
  storage_path: string;
  alt: string;
  created_at: string;
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
      if (!supabase) {
        throw new Error("Supabase is not configured. Missing env vars.");
      }
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPhotos(data ?? []);
    } catch (err) {
      console.error("Error fetching photos:", err);
      setPhotos([]);
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
              <div key={photo.id} className="mb-4 break-inside-avoid rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={photo.url}
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
