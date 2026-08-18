"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getProductImage } from "@/lib/data/product-images";

interface ProductGalleryProps {
  slug: string;
  title: string;
  images?: string[];
  isNew?: boolean;
}

export function ProductGallery({ slug, title, images, isNew }: ProductGalleryProps) {
  const gallery =
    images && images.length > 0 ? images : [getProductImage(slug), getProductImage(slug)];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square rounded-xl bg-nca-sage overflow-hidden mb-4">
        {isNew && (
          <span className="absolute top-4 left-4 z-10 rounded-md bg-nca-green px-2 py-0.5 text-xs font-semibold text-white">
            NEW
          </span>
        )}
        <Image
          src={gallery[active] ?? gallery[0]}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-2">
          {gallery.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors",
                active === i ? "border-nca-green" : "border-transparent hover:border-nca-green/40"
              )}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
