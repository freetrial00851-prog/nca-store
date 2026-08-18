import Image from "next/image";
import { cn } from "@/lib/utils";
import { getProductImage } from "@/lib/data/product-images";

interface ProductImageProps {
  slug: string;
  alt: string;
  imageUrl?: string | null;
  className?: string;
  fill?: boolean;
  sizes?: string;
}

export function ProductImage({
  slug,
  alt,
  imageUrl,
  className,
  fill = true,
  sizes,
}: ProductImageProps) {
  const src = imageUrl || getProductImage(slug);

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
