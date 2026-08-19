"use client";

import { useEffect, useRef } from "react";
import { useAuthSession } from "@/hooks/use-auth";
import { getWishlistProducts } from "@/app/actions/wishlist";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { isClientDemoMode } from "@/lib/checkout-client";

/** Loads server wishlist into client store when user is authenticated. */
export function WishlistHydrator() {
  const { user, loading } = useAuthSession();
  const mergeItems = useWishlistStore((s) => s.mergeItems);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    if (isClientDemoMode() || loading) return;

    if (!user) {
      if (lastUserId.current) {
        clearWishlist();
        lastUserId.current = null;
      }
      return;
    }

    if (lastUserId.current === user.id) return;
    lastUserId.current = user.id;

    getWishlistProducts()
      .then((products) => mergeItems(products))
      .catch(() => {
        // Non-fatal — local wishlist still works
      });
  }, [user, loading, mergeItems, clearWishlist]);

  return null;
}
