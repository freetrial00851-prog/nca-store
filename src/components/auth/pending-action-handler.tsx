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

      // Right after a hard-navigation login redirect, the browser client can
      // momentarily fail to see the just-set session cookie (same race as the
      // Header auth-state bug). Retry a couple of times with a short delay
      // before giving up, instead of bailing on the very first check.
      let user = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          user = data.user;
          break;
        }
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
      }
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
