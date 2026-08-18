import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { DollarSign, Download, Package, TrendingUp } from "lucide-react";
import { getAdminStats } from "@/app/actions/admin";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: "Total Revenue", value: formatPrice(stats.revenue), icon: DollarSign, change: "Live data" },
    { label: "Total Orders", value: String(stats.orderCount), icon: TrendingUp, change: "Live data" },
    { label: "Total Downloads", value: String(stats.downloadCount), icon: Download, change: "Live data" },
    { label: "Active Products", value: String(stats.productCount), icon: Package, change: "Live data" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, change }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon className="h-5 w-5 text-nca-green" />
                <span className="text-xs text-green-600">{change}</span>
              </div>
              <p className="font-serif text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-medium mb-4">Recent Sales</h2>
          <div className="h-48 flex items-center justify-center text-muted-foreground bg-muted/30 rounded-lg">
            Sales chart — connect analytics for live charts
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
