import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductImage } from "@/components/products/product-image";
import { DownloadButton } from "@/components/account/download-button";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { getOrderById } from "@/app/actions/profile";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account" },
          { label: "Orders", href: "/account/orders" },
          { label: `#${id}` },
        ]}
        className="mb-6"
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="font-serif text-3xl font-bold">Order #{id}</h1>
            <Badge variant={order.status === "Completed" ? "success" : "secondary"}>{order.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-8">{formatDateTime(order.created_at)}</p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-medium mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span><span>-{formatPrice(order.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between"><span>Tax</span><span>{formatPrice(0)}</span></div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span><span>{formatPrice(order.total_amount)}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span>Payment Status</span>
                    <Badge variant="success">Paid</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="font-medium mb-4">Billing Address</h2>
                <p className="text-sm text-muted-foreground">
                  Sarah Johnson<br />
                  123 Main Street<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-medium mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex gap-4">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                        <ProductImage slug={product.slug} alt={product.title} sizes="64px" />
                      </div>
                      <div>
                        <Link href={`/products/${product.slug}`} className="font-medium text-sm hover:text-nca-green">
                          {product.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(product.sale_price ?? product.price)}
                        </p>
                      </div>
                    </div>
                    <DownloadButton productId={product.id} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Link href="/account/orders">
              <Button variant="outline">← Back to Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
