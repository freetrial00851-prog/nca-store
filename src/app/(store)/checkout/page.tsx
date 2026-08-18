"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { createCheckoutSession } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import {
  getDemoSuccessPath,
  isClientDemoMode,
  isClientStripeConfigured,
  isNextRedirectError,
} from "@/lib/checkout-client";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const mounted = useMounted();
  const { items, getSubtotal, getTotal, couponCode, discountAmount } = useCartStore();
  const [loading, setLoading] = useState(false);
  const subtotal = getSubtotal();
  const total = getTotal();
  const isDemo = isClientDemoMode();
  const hasStripe = isClientStripeConfigured();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      if (isDemo) {
        router.push(getDemoSuccessPath());
        return;
      }

      const result = await createCheckoutSession(items, couponCode ?? undefined);

      if (result?.url) {
        window.location.assign(result.url);
        return;
      }

      toast.error("Could not start checkout. Please try again.");
    } catch (error) {
      if (isNextRedirectError(error)) throw error;
      toast.error(error instanceof Error ? error.message : "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Loading checkout...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Nothing to Checkout</h1>
        <p className="text-muted-foreground">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="font-serif text-3xl font-bold mt-4 mb-8">Checkout</h1>

      <div className="bg-white rounded-xl border border-border p-6 mb-6">
        <h2 className="font-medium mb-4">Order Summary</h2>
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex justify-between py-2 text-sm">
            <span>{product.title} × {quantity}</span>
            <span>{formatPrice(getEffectivePrice(product) * quantity)}</span>
          </div>
        ))}
        <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount{couponCode ? ` (${couponCode})` : ""}</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <Button size="lg" className="w-full" onClick={handleCheckout} disabled={loading}>
        <Lock className="h-4 w-4 mr-2" />
        {loading ? "Processing..." : isDemo ? "Complete Demo Checkout" : hasStripe ? "Pay with Stripe" : "Complete Order"}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-4">
        {isDemo
          ? "Demo mode — no payment required. Connect Supabase to enable live accounts and downloads."
          : hasStripe
            ? "Secure payment powered by Stripe. Your patterns will be available for instant download after payment."
            : "Live mode — order is saved to your account instantly. Stripe can be added later for card payments."}
      </p>
    </div>
  );
}
