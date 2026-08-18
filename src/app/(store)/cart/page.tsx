"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ArrowLeft, Lock, Download, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/products/product-card";
import { ProductImage } from "@/components/products/product-image";
import { useCartStore } from "@/lib/store/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice, getEffectivePrice, calculateDiscount } from "@/lib/utils";
import { validateCoupon } from "@/app/actions/checkout";
import { MOCK_PRODUCTS } from "@/lib/data/mock-data";
import { toast } from "sonner";
import { useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const mounted = useMounted();
  const { items, removeItem, updateQuantity, clearCart, couponCode, setCouponCode, setDiscountAmount, getSubtotal, getTotal, discountAmount } =
    useCartStore();
  const [couponInput, setCouponInput] = useState(couponCode ?? "");
  const [discount, setDiscount] = useState(discountAmount);

  const subtotal = getSubtotal();
  const total = getTotal();

  async function handleApplyCoupon() {
    const result = await validateCoupon(couponInput);
    if (result.valid && result.coupon) {
      if (result.coupon.min_order_amount && subtotal < result.coupon.min_order_amount) {
        toast.error(`Minimum order of ${formatPrice(result.coupon.min_order_amount)} required`);
        return;
      }
      const amount = calculateDiscount(subtotal, result.coupon);
      setDiscount(amount);
      setDiscountAmount(amount);
      setCouponCode(couponInput);
      toast.success("Coupon applied!");
    } else if (!result.valid) {
      setDiscount(0);
      setDiscountAmount(0);
      setCouponCode(null);
      toast.error(result.message);
    }
  }

  function handleProceedToCheckout() {
    router.push("/checkout");
  }

  const recommendations = MOCK_PRODUCTS.filter(
    (p) => !items.some((i) => i.product.id === p.id)
  ).slice(0, 4);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Your Cart ({items.length})</h1>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} className="mt-2" />
        </div>
        <Link href="/shop" className="flex items-center gap-1 text-sm text-nca-green hover:underline">
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Link href="/shop"><Button>Browse Patterns</Button></Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <th className="p-4">Product</th>
                    <th className="p-4 hidden sm:table-cell">Price</th>
                    <th className="p-4">Qty</th>
                    <th className="p-4 hidden sm:table-cell">Total</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(({ product, quantity }) => (
                    <tr key={product.id} className="border-b border-border last:border-0">
                      <td className="p-4">
                        <div className="flex gap-3">
                          <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                            <ProductImage slug={product.slug} alt={product.title} sizes="64px" />
                          </div>
                          <div>
                            <Link href={`/products/${product.slug}`} className="font-medium text-sm hover:text-nca-green">
                              {product.title}
                            </Link>
                            <p className="text-xs text-muted-foreground">Crochet Pattern PDF</p>
                            <Badge variant="success" className="mt-1">✓ Instant PDF Download</Badge>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">{formatPrice(getEffectivePrice(product))}</td>
                      <td className="p-4">
                        <div className="flex items-center border border-border rounded-lg w-fit">
                          <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-2 py-1"><Minus className="h-3 w-3" /></button>
                          <span className="px-3 text-sm">{quantity}</span>
                          <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-2 py-1"><Plus className="h-3 w-3" /></button>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell font-medium">
                        {formatPrice(getEffectivePrice(product) * quantity)}
                      </td>
                      <td className="p-4">
                        <button onClick={() => removeItem(product.id)} className="text-muted-foreground hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button variant="outline" size="sm" className="mt-4" onClick={clearCart}>Clear Cart</Button>
          </div>

          <div>
            <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
              <h2 className="font-serif text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>
                )}
                <div className="flex justify-between"><span>Tax</span><span>{formatPrice(0)}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                  <span>Total</span><span>{formatPrice(total)} USD</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">Have a coupon code?</p>
                <div className="flex gap-2">
                  <Input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Enter code" />
                  <Button variant="outline" onClick={handleApplyCoupon}>Apply</Button>
                </div>
              </div>

              <Button className="w-full mt-6 gap-2" onClick={handleProceedToCheckout}>
                <Lock className="h-4 w-4" />
                Proceed to Checkout
              </Button>

              <div className="mt-6 space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Download className="h-4 w-4 text-nca-green" /> Instant Download after purchase</div>
                <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-nca-green" /> Secure Checkout</div>
                <div className="flex items-center gap-2"><Heart className="h-4 w-4 text-nca-green" /> Satisfaction Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
