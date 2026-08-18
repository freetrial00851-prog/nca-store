"use client";

import Link from "next/link";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCartStore } from "@/lib/store/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { toast } from "sonner";

export default function WishlistPage() {
  const mounted = useMounted();
  const { items, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  function moveAllToCart() {
    items.forEach((p) => addToCart(p));
    toast.success("All items added to cart");
  }

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account" },
          { label: "Wishlist" },
        ]}
        className="mb-6"
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-serif text-3xl font-bold">My Wishlist ({items.length})</h1>
            {items.length > 0 && (
              <div className="flex gap-2">
                <Button onClick={moveAllToCart}>Move All to Cart</Button>
                <Button variant="outline" onClick={clearWishlist}>
                  Clear
                </Button>
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-border">
              <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
              <Link href="/shop">
                <Button>Browse Patterns</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
