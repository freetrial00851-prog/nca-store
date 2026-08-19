"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { completePendingAuthAction } from "@/app/actions/pending-auth";
import { getWishlistProducts } from "@/app/actions/wishlist";
import { loadAuthIntent, clearAuthIntent } from "@/lib/auth-intent";
import { isClientDemoMode } from "@/lib/checkout-client";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { toast } from "sonner";
import type { Product } from "@/types/database";

/** Runs pending auth actions after page load (login redirect or email confirmation return). */
export function PendingActionHandler() {
  const router = useRouter();
  const addWishlistItem = useWishlistStore((s) => s.addItem);
  const mergeItems = useWishlistStore((s) => s.mergeItems);

  useEffect(() => {
    if (isClientDemoMode()) return;

    async function run() {
      const intent = loadAuthIntent();
      if (!intent) return;

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      try {
        await completePendingAuthAction(intent);

        if (intent.action === "favorite") {
          if (intent.productSnapshot) {
            addWishlistItem(intent.productSnapshot as Product);
          } else {
            const products = await getWishlistProducts();
            mergeItems(products);
          }
          toast.success("Saved to your favorites");
        }

        clearAuthIntent();
        router.refresh();
      } catch {
        clearAuthIntent();
      }
    }

    run();
  }, [router, addWishlistItem, mergeItems]);

  return null;
}
