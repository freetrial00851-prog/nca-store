"use client";

import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/app/actions/admin";

export function DeleteProductButton({ productId, productTitle }: { productId: string; productTitle: string }) {
  return (
    <form
      action={async () => {
        await deleteProduct(productId);
      }}
      onSubmit={(e) => {
        if (!window.confirm(`Remove "${productTitle}" from the store? It will be hidden from customers (this can be undone by re-activating it later).`)) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="outline" size="sm" className="text-red-600 hover:text-red-700">
        Delete
      </Button>
    </form>
  );
}
