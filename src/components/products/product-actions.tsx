"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Zap, Heart, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { useFavoriteAction } from "@/hooks/use-auth";
import { createCheckoutSession } from "@/app/actions/checkout";
import {
  getDemoSuccessPath,
  isClientDemoMode,
  isNextRedirectError,
} from "@/lib/checkout-client";
import { buildAuthLoginUrl } from "@/lib/auth-intent";
import type { Product } from "@/types/database";
import { getEffectivePrice } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProductActions({
  product,
  owned = false,
}: {
  product: Product;
  owned?: boolean;
}) {
  const mounted = useMounted();
  const addItemAndOpenDrawer = useCartStore((s) => s.addItemAndOpenDrawer);
  const isInCart = useCartStore((s) => s.isInCart);
  const { handleFavorite, pending, isInWishlist } = useFavoriteAction();
  const router = useRouter();
  const inWishlist = mounted && isInWishlist(product.id);
  const inCart = mounted && isInCart(product.id);
  const isFree = getEffectivePrice(product) === 0;
  const isDemo = isClientDemoMode();
  const [buyLoading, setBuyLoading] = useState(false);

  async function handleBuyNow() {
    if (owned) {
      router.push("/account/downloads");
      return;
    }

    setBuyLoading(true);
    addItemAndOpenDrawer(product);

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
      toast.error("Please sign in to complete your purchase");
      router.push(buildAuthLoginUrl({ returnTo: "/checkout", action: "checkout" }));
    } finally {
      setBuyLoading(false);
    }
  }

  function handleAddToCart() {
    if (owned) {
      toast.info("You already own this pattern. View it in My Downloads.");
      return;
    }
    const added = addItemAndOpenDrawer(product);
    toast.success(added ? "Added to cart" : "Already in your cart");
  }

  if (owned) {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="flex-1 gap-2">
          <Link href="/account/downloads">
            <Download className="h-4 w-4" /> View Downloads
          </Link>
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => handleFavorite(product)}
          disabled={pending === product.id}
        >
          {pending === product.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={cn("h-4 w-4", inWishlist && "fill-red-500 text-red-500")} />
          )}
          {inWishlist ? "In Wishlist" : "Add to Wishlist"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button className="flex-1 gap-2" onClick={handleAddToCart}>
        <ShoppingBag className="h-4 w-4" />
        {inCart ? "In Cart" : isFree ? "Add to Cart — Free" : "Add to Cart"}
      </Button>
      <Button
        variant="outline"
        className="flex-1 gap-2"
        onClick={handleBuyNow}
        disabled={buyLoading}
      >
        {buyLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Processing...
          </>
        ) : isFree ? (
          <>
            <Download className="h-4 w-4" /> Get Free Pattern
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" /> Buy Now
          </>
        )}
      </Button>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => handleFavorite(product)}
        disabled={pending === product.id}
      >
        {pending === product.id ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart className={cn("h-4 w-4", inWishlist && "fill-red-500 text-red-500")} />
        )}
        {inWishlist ? "In Wishlist" : "Add to Wishlist"}
      </Button>
    </div>
  );
}
