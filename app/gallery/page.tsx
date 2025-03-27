"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";

const galleryImages = [
  {
    id: 1,
    src: "/images/gallery/sydney-opera-house.jpg",
    alt: "Sydney Opera House",
    category: "Landmarks",
  },
  {
    id: 2,
    src: "/images/gallery/great-barrier-reef.jpg",
    alt: "Great Barrier Reef",
    category: "Nature",
  },
  {
    id: 3,
    src: "/images/gallery/uluru.jpg",
    alt: "Uluru",
    category: "Landmarks",
  },
  {
    id: 4,
    src: "/images/gallery/kangaroo.jpg",
    alt: "Kangaroo",
    category: "Wildlife",
  },
  {
    id: 5,
    src: "/images/gallery/koala.jpg",
    alt: "Koala",
    category: "Wildlife",
  },
  {
    id: 6,
    src: "/images/gallery/bondi-beach.jpg",
    alt: "Bondi Beach",
    category: "Beaches",
  },
  {
    id: 7,
    src: "/images/gallery/blue-mountains.jpg",
    alt: "Blue Mountains",
    category: "Nature",
  },
  {
    id: 8,
    src: "/images/gallery/whitsunday-islands.jpg",
    alt: "Whitsunday Islands",
    category: "Beaches",
  },
];

const categories = ["All", "Landmarks", "Nature", "Wildlife", "Beaches"];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  const filteredImages = selectedCategory === "All"
    ? galleryImages
    : galleryImages.filter(image => image.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
        Photo Gallery
      </h1>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {image.alt}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogTitle className="sr-only">
            {selectedImage?.alt || "Image Preview"}
          </DialogTitle>
          {selectedImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 