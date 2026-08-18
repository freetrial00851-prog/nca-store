import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getProductImage } from "@/lib/data/product-images";

interface ProductImageProps {
  slug: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
}

export function ProductImage({ slug, alt, className, fill = true, sizes }: ProductImageProps) {
  const src = getProductImage(slug);

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes ?? "(max-width: 768px) 50vw, 25vw"}
      className={cn("object-cover", className)}
    />
  );
}
