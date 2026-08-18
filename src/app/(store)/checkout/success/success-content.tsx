"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fulfillOrder, getOrderByOrderId } from "@/app/actions/checkout";
import { useCartStore } from "@/lib/store/cart-store";

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderIdParam = searchParams.get("order_id");
  const isDemo = searchParams.get("demo") === "1";
  const clearCart = useCartStore((s) => s.clearCart);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function process() {
      if (isDemo) {
        const order = await fulfillOrder("demo", true);
        if (order?.id) {
          setOrderId(order.id);
          clearCart();
        }
        setLoading(false);
        return;
      }

      if (orderIdParam) {
        const order = await getOrderByOrderId(orderIdParam);
        if (order?.id) {
          setOrderId(order.id);
          clearCart();
        }
        setLoading(false);
        return;
      }

      if (sessionId) {
        const order = await fulfillOrder(sessionId);
        if (order?.id) {
          setOrderId(order.id);
          clearCart();
        }
      }
      setLoading(false);
    }
    process();
  }, [sessionId, orderIdParam, isDemo, clearCart]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Processing your order...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-lg">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
      <h1 className="font-serif text-3xl font-bold mb-2">Thank You!</h1>
      <p className="text-muted-foreground mb-2">Your order has been placed successfully.</p>
      {isDemo && (
        <p className="text-xs text-muted-foreground mb-2">
          Demo checkout — connect Supabase for live orders and downloads.
        </p>
      )}
      {orderIdParam && !isDemo && (
        <p className="text-xs text-muted-foreground mb-2">
          Order saved to your account. Add Stripe later for card payments.
        </p>
      )}
      {orderId && <p className="text-sm mb-8">Order #{orderId}</p>}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/account/downloads">
          <Button size="lg">
            <Download className="h-4 w-4 mr-2" />
            Download Patterns
          </Button>
        </Link>
        <Link href="/shop">
          <Button size="lg" variant="outline">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
