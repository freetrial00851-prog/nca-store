"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { grantDownloadAccess, updateOrderStatus } from "@/app/actions/admin";
import { toast } from "sonner";
import type { Product } from "@/types/database";

interface AdminOrderActionsProps {
  orderId: string;
  userId: string;
  status: string;
  products: Product[];
}

export function AdminOrderActions({ orderId, userId, status, products }: AdminOrderActionsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {status !== "Completed" && (
        <Button
          size="sm"
          onClick={async () => {
            try {
              await updateOrderStatus(orderId, "Completed");
              toast.success("Order marked completed");
              router.refresh();
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Failed to update order");
            }
          }}
        >
          Mark Completed
        </Button>
      )}
      {status !== "Cancelled" && (
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            try {
              await updateOrderStatus(orderId, "Cancelled");
              toast.success("Order cancelled");
              router.refresh();
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Failed to update order");
            }
          }}
        >
          Cancel Order
        </Button>
      )}
      {products.map((product) => (
        <Button
          key={product.id}
          variant="secondary"
          size="sm"
          onClick={async () => {
            try {
              await grantDownloadAccess(userId, product.id, orderId);
              toast.success(`Download access granted for ${product.title}`);
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Failed to grant access");
            }
          }}
        >
          Grant Download: {product.title.slice(0, 20)}…
        </Button>
      ))}
    </div>
  );
}
