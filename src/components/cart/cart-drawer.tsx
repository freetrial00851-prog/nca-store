"use client";

import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import { ProductImage } from "@/components/products/product-image";
import { toast } from "sonner";

export function CartDrawer() {
  const mounted = useMounted();
  const {
    items,
    drawerOpen,
    closeDrawer,
    removeItem,
    getSubtotal,
    getTotal,
    discountAmount,
  } = useCartStore();

  const subtotal = mounted ? getSubtotal() : 0;
  const total = mounted ? getTotal() : 0;

  function handleRemove(productId: string) {
    const snapshot = items.find((i) => i.product.id === productId);
    removeItem(productId);
    toast("Removed from cart", {
      action: snapshot
        ? {
            label: "Undo",
            onClick: () => {
              useCartStore.getState().addItem(snapshot.product, snapshot.quantity);
            },
          }
        : undefined,
    });
  }

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[65]">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeDrawer}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-label="Your cart"
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-serif text-xl font-bold text-nca-green flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="p-2 rounded-md hover:bg-muted"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!mounted || items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-3 pb-4 border-b border-border/50">
                <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-nca-sage/30">
                  <ProductImage
                    slug={item.product.slug}
                    alt={item.product.title}
                    imageUrl={item.product.images?.[0]}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">{item.product.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Digital PDF</p>
                  <p className="text-sm font-semibold text-nca-green mt-1">
                    {formatPrice(getEffectivePrice(item.product))}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(item.product.id)}
                  className="text-xs text-muted-foreground hover:text-red-600 shrink-0"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border p-4 space-y-3 bg-nca-cream/30">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-nca-green">{formatPrice(total)}</span>
          </div>

          <Button asChild className="w-full" disabled={!mounted || items.length === 0}>
            <Link href="/checkout" onClick={closeDrawer}>
              Checkout
            </Link>
          </Button>
          <Button variant="outline" className="w-full" onClick={closeDrawer}>
            Continue Shopping
          </Button>
        </div>
      </aside>
    </div>
  );
}
