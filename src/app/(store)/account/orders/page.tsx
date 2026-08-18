import { AccountSidebar } from "@/components/account/account-sidebar";
import { OrdersTable } from "@/components/account/orders-table";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getRecentOrders } from "@/app/actions/profile";

export default async function OrdersPage() {
  const orders = await getRecentOrders(20);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account" },
          { label: "Orders" },
        ]}
        className="mb-6"
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <h1 className="font-serif text-3xl font-bold mb-6">My Orders</h1>
          <OrdersTable orders={orders} />
        </div>
      </div>
    </div>
  );
}
