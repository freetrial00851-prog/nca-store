import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductImage } from "@/components/products/product-image";
import { getAdminOrderById } from "@/app/actions/admin";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface AdminOrderDetailProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailProps) {
  const { id } = await params;
  const result = await getAdminOrderById(id);
  if (!result) notFound();

  const { order, customer } = result;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-nca-green mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <h1 className="font-serif text-3xl font-bold">Order #{id}</h1>
        <Badge variant={order.status === "Completed" ? "success" : "secondary"}>{order.status}</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-8">{formatDateTime(order.created_at)}</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-medium mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="font-medium mb-4">Customer</h2>
            <p className="text-sm text-muted-foreground">
              {customer.name}
              <br />
              {customer.email}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-medium mb-4">Items ({order.products.length})</h2>
          <div className="space-y-4">
            {order.products.map((product) => (
              <div key={product.id} className="flex items-center gap-4 border-b border-border pb-4 last:border-0">
                <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0">
                  <ProductImage slug={product.slug} alt={product.title} sizes="56px" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(product.sale_price ?? product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
