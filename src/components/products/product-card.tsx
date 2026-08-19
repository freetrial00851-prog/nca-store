"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/products/product-image";
import { useCartStore } from "@/lib/store/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { useFavoriteAction } from "@/hooks/use-auth";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import type { Product } from "@/types/database";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItemAndOpenDrawer = useCartStore((s) => s.addItemAndOpenDrawer);
  const { handleFavorite, pending, isInWishlist } = useFavoriteAction();
  const mounted = useMounted();
  const inWishlist = mounted && isInWishlist(product.id);
  const effectivePrice = getEffectivePrice(product);
  const onSale = product.sale_price !== null && product.sale_price < product.price;

  return (
    <div className={cn("group bg-white rounded-2xl border border-border/80 overflow-hidden hover:shadow-lg hover:border-nca-sage transition-all duration-300", className)}>
      <div className="relative aspect-square overflow-hidden bg-nca-sage/30">
        <Link href={`/products/${product.slug}`} className="block absolute inset-0">
          <ProductImage
            slug={product.slug}
            alt={product.title}
            imageUrl={product.images?.[0]}
            className="group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          {product.is_new && <Badge variant="new" className="text-[10px] font-bold px-2">NEW</Badge>}
          {onSale && <Badge variant="sale" className="text-[10px] font-bold px-2">SALE</Badge>}
        </div>
        <button
          type="button"
          onClick={() => handleFavorite(product)}
          disabled={pending === product.id}
          aria-label={inWishlist ? "Remove from favorites" : "Add to favorites"}
          className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-60"
        >
          {pending === product.id ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Heart className={cn("h-4 w-4", inWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
          )}
        </button>
      </div>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-sm leading-snug line-clamp-2 hover:text-nca-green transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Crochet Pattern PDF</p>

        <div className="flex items-end justify-between mt-3 pt-3 border-t border-border/50">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg font-bold text-nca-green">
                {effectivePrice === 0 ? "Free" : formatPrice(effectivePrice)}
              </span>
              {onSale && (
                <span className="text-xs text-red-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {product.average_rating && (
              <StarRating rating={product.average_rating} reviewCount={product.review_count} showValue size="sm" className="mt-1" />
            )}
          </div>
          <Button
            size="icon"
            className="h-9 w-9 rounded-full bg-nca-green hover:bg-nca-green-dark shrink-0"
            aria-label="Add to cart"
            onClick={() => {
              const added = addItemAndOpenDrawer(product);
              toast.success(added ? "Added to cart" : "Already in your cart");
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
