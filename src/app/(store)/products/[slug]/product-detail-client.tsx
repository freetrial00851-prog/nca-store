"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Download,
  Shield,
  FileText,
  Globe,
  BookOpen,
  Camera,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/products/product-card";
import { ProductImage } from "@/components/products/product-image";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import type { Product } from "@/types/database";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const tabs = ["Description", "What's Included", "Materials", "Skill Level", "Size", "Tags", "Reviews"];

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: Props) {
  const [activeTab, setActiveTab] = useState("Description");
  const [selectedImage, setSelectedImage] = useState(0);
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const mounted = useMounted();
  const inWishlist = mounted && isInWishlist(product.id);
  const effectivePrice = getEffectivePrice(product);
  const onSale = product.sale_price !== null && product.sale_price < product.price;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Added to cart!");
  };

  const specs = [
    { icon: BookOpen, label: "Skill Level", value: product.skill_level },
    { icon: Globe, label: "Language", value: product.language },
    { icon: FileText, label: "Format", value: product.format },
    { icon: BookOpen, label: "Pages", value: `${product.pages_count} pages` },
    { icon: Camera, label: "Photos", value: "40+ step-by-step" },
    { icon: Download, label: "Delivery", value: "Instant Download" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: product.category?.name ?? "Shop", href: `/category/${product.category?.slug ?? "shop"}` },
          { label: product.title },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-10 mt-4">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square bg-nca-sage rounded-2xl overflow-hidden mb-4 shadow-md">
            {product.is_new && (
              <Badge variant="new" className="absolute top-4 left-4 z-10">NEW</Badge>
            )}
            <button
              onClick={() => toggleItem(product)}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center z-10 hover:scale-105 transition-transform"
            >
              <Heart className={cn("h-5 w-5", inWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
            </button>
            <ProductImage slug={product.slug} alt={product.title} />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "relative h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors",
                  selectedImage === i ? "border-nca-green" : "border-transparent"
                )}
              >
                <ProductImage slug={product.slug} alt="" sizes="64px" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          {product.category && (
            <Badge variant="secondary" className="mb-2">{product.category.name}</Badge>
          )}
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">{product.title}</h1>
          <StarRating
            rating={product.average_rating ?? 5}
            reviewCount={product.review_count}
            showValue
            size="md"
          />

          <div className="grid grid-cols-2 gap-3 my-6">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <Icon className="h-4 w-4 text-nca-green shrink-0" />
                <span className="text-muted-foreground">{label}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-nca-green">
                {formatPrice(effectivePrice)} USD
              </span>
              {onSale && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Link href="/checkout" className="flex-1">
              <Button size="lg" variant="outline" className="w-full">Buy Now</Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() => toggleItem(product)}
            >
              <Heart className={cn("h-4 w-4 mr-2", inWishlist && "fill-red-500 text-red-500")} />
              Wishlist
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2 p-3 bg-nca-sage/50 rounded-lg">
              <Download className="h-5 w-5 text-nca-green shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Instant Download</p>
                <p className="text-xs text-muted-foreground">Available immediately after purchase</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-nca-sage/50 rounded-lg">
              <Lock className="h-5 w-5 text-nca-green shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Secure Checkout</p>
                <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="flex gap-6 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab
                  ? "border-nca-green text-nca-green"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}{tab === "Reviews" && product.review_count ? ` (${product.review_count})` : ""}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === "Description" && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-xl font-bold mb-4">Pattern Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
              <div className="aspect-video bg-nca-sage rounded-xl" />
            </div>
          )}
          {activeTab === "What's Included" && (
            <p className="text-muted-foreground">{product.whats_included ?? "Detailed PDF pattern with step-by-step instructions and photos."}</p>
          )}
          {activeTab === "Materials" && (
            <p className="text-muted-foreground">{product.materials ?? "See pattern PDF for complete materials list."}</p>
          )}
          {activeTab === "Skill Level" && (
            <p className="text-muted-foreground">This pattern is rated <strong>{product.skill_level}</strong>.</p>
          )}
          {activeTab === "Size" && (
            <p className="text-muted-foreground">{product.size_info ?? "See pattern PDF for size details."}</p>
          )}
          {activeTab === "Tags" && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
          {activeTab === "Reviews" && (
            <div className="text-center py-8 text-muted-foreground">
              <StarRating rating={product.average_rating ?? 5} size="lg" />
              <p className="mt-2">{product.review_count ?? 0} reviews</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold">You May Also Like</h2>
            <Link href="/shop" className="text-sm text-nca-green hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
