import Link from "next/link";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { AccountDashboardClient } from "@/components/account/account-dashboard-client";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductImage } from "@/components/products/product-image";
import { getAccountStats, getRecentOrders, getProfile } from "@/app/actions/profile";
import { getUserDownloads } from "@/app/actions/downloads";
import { formatPrice, formatDate } from "@/lib/utils";

export default async function AccountDashboardPage() {
  const [stats, orders, profile, downloads] = await Promise.all([
    getAccountStats(),
    getRecentOrders(),
    getProfile(),
    getUserDownloads(),
  ]);

  const name = profile?.full_name?.split(" ")[0] ?? "Sarah";
  const recentDownloads = downloads.slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Account" }]} className="mb-6" />

      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />

        <div className="flex-1">
          <h1 className="font-serif text-3xl font-bold mb-1">My Account</h1>
          <p className="text-muted-foreground mb-8">
            Welcome back, {name}! Here&apos;s what&apos;s happening with your account.
          </p>

          <AccountDashboardClient stats={stats} />

          <div className="grid lg:grid-cols-1 gap-6 mb-8 mt-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-serif text-lg font-bold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                        <th className="pb-3">Order</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Items</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-border last:border-0">
                          <td className="py-3">
                            <Link href={`/account/orders/${order.id}`} className="text-nca-green hover:underline">
                              #{order.id}
                            </Link>
                          </td>
                          <td className="py-3 text-muted-foreground">{formatDate(order.created_at)}</td>
                          <td className="py-3">{"item_count" in order ? order.item_count : 1}</td>
                          <td className="py-3">{formatPrice(order.total_amount)}</td>
                          <td className="py-3">
                            <Badge variant="success">{order.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Link href="/account/orders">
                  <Button variant="outline" className="mt-4 w-full">
                    View All Orders
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-serif text-lg font-bold mb-4">Recently Downloaded</h2>
              {recentDownloads.length === 0 ? (
                <p className="text-sm text-muted-foreground">No downloads yet. Browse patterns to get started.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {recentDownloads.map(({ product, purchased_at }) => (
                    <div key={product.id} className="flex gap-3">
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0">
                        <ProductImage slug={product.slug} alt={product.title} sizes="56px" />
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-2">{product.title}</p>
                        <p className="text-xs text-muted-foreground">Crochet Pattern PDF</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(purchased_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
