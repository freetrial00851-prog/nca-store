import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { getAdminOrders } from "@/app/actions/admin";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Orders Management</h1>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium">#{order.id}</td>
                  <td className="p-4">
                    <p>{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                  </td>
                  <td className="p-4">{formatDate(order.created_at)}</td>
                  <td className="p-4">{formatPrice(order.total_amount)}</td>
                  <td className="p-4">
                    <Badge variant={order.status === "Completed" ? "success" : "secondary"}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
