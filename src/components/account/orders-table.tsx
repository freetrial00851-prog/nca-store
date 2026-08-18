"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/database";

interface OrderRow {
  id: string;
  status: OrderStatus | string;
  total_amount: number;
  created_at: string;
  item_count?: number;
}

const statusTabs = ["All Orders", "Completed", "Processing", "Cancelled", "Refunded"] as const;

const statusMap: Record<(typeof statusTabs)[number], OrderStatus | null> = {
  "All Orders": null,
  Completed: "Completed",
  Processing: "Processing",
  Cancelled: "Cancelled",
  Refunded: "Refunded",
};

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const [activeTab, setActiveTab] = useState<(typeof statusTabs)[number]>("All Orders");

  const displayOrders = useMemo(() => {
    const status = statusMap[activeTab];
    if (!status) return orders;
    return orders.filter((o) => o.status === status);
  }, [orders, activeTab]);

  return (
    <>
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors",
              activeTab === tab
                ? "bg-nca-green text-white"
                : "bg-white border border-border text-muted-foreground hover:border-nca-green"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {displayOrders.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No orders with this status.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4 hidden sm:table-cell">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {displayOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium">#{order.id}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(order.created_at)}</td>
                  <td className="p-4 hidden sm:table-cell">
                    {"item_count" in order ? order.item_count : 1}
                  </td>
                  <td className="p-4">{formatPrice(order.total_amount)}</td>
                  <td className="p-4">
                    <Badge variant={order.status === "Completed" ? "success" : "secondary"}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
