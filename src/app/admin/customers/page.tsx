import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { getAdminCustomers } from "@/app/actions/admin";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Customers</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                <th className="p-4">Customer</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="p-4">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </td>
                  <td className="p-4">{c.orders}</td>
                  <td className="p-4">{formatPrice(c.spent)}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(c.joined)}</td>
                  <td className="p-4">
                    <Badge variant="success">Active</Badge>
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
