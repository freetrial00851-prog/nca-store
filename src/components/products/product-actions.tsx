"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, Zap, Heart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useMounted } from "@/hooks/use-mounted";
import { createCheckoutSession } from "@/app/actions/checkout";
import { addToWishlist, removeFromWishlist } from "@/app/actions/wishlist";
import {
  getDemoSuccessPath,
  isClientDemoMode,
  isNextRedirectError,
} from "@/lib/checkout-client";
import type { Product } from "@/types/database";
import { getEffectivePrice } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: Product }) {
  const mounted = useMounted();
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const router = useRouter();
  const inWishlist = mounted && isInWishlist(product.id);
  const isFree = getEffectivePrice(product) === 0;
  const isDemo = isClientDemoMode();

  async function handleBuyNow() {
    addToCart(product);

    try {
      if (isDemo) {
        router.push(getDemoSuccessPath());
        return;
      }

      const result = await createCheckoutSession([{ product, quantity: 1 }]);
      if (result?.url) {
        window.location.assign(result.url);
      }
    } catch (error) {
      if (isNextRedirectError(error)) throw error;
      toast.error(error instanceof Error ? error.message : "Please sign in to purchase");
      router.push("/auth/login?redirect=/cart");
    }
  }

  async function handleWishlist() {
    toggleItem(product);
    if (isDemo) return;

    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch {
      toast.error("Sign in to save items to your wishlist");
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        className="flex-1 gap-2"
        onClick={() => {
          addToCart(product);
          toast.success(isFree ? "Added to cart — free!" : "Added to cart");
        }}
      >
        <ShoppingBag className="h-4 w-4" /> Add to Cart
      </Button>
      <Button variant="outline" className="flex-1 gap-2" onClick={handleBuyNow}>
        {isFree ? (
          <>
            <Download className="h-4 w-4" /> Get Free Pattern
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" /> Buy Now
          </>
        )}
      </Button>
      <Button variant="outline" className="gap-2" onClick={handleWishlist}>
        <Heart className={cn("h-4 w-4", inWishlist && "fill-red-500 text-red-500")} />
        {inWishlist ? "In Wishlist" : "Add to Wishlist"}
      </Button>
    </div>
  );
}
