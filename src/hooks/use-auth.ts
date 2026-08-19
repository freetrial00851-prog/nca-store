"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthUiStore } from "@/lib/store/auth-ui-store";
import { addToWishlist, removeFromWishlist } from "@/app/actions/wishlist";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { isClientDemoMode } from "@/lib/checkout-client";
import { toast } from "sonner";
import type { Product } from "@/types/database";

export type AuthSessionUser = { id: string; email?: string } | null;

export function useAuthSession(initialUser?: AuthSessionUser) {
  const seededFromServer = initialUser !== undefined;
  const [user, setUser] = useState<AuthSessionUser>(initialUser ?? null);
  const [loading, setLoading] = useState(!seededFromServer);

  useEffect(() => {
    if (isClientDemoMode()) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase.auth.getUser().then(({ data, error }) => {
      setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: Boolean(user) };
}

export function useFavoriteAction() {
  const pathname = usePathname();
  const { user, loading } = useAuthSession();
  const openAuthModal = useAuthUiStore((s) => s.openAuthModal);
  const { toggleItem, isInWishlist, addItem, removeItem } = useWishlistStore();
  const [pending, setPending] = useState<string | null>(null);

  const handleFavorite = useCallback(
    async (product: Product) => {
      const inWishlist = isInWishlist(product.id);
      const returnTo =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : pathname;

      if (isClientDemoMode()) {
        toggleItem(product);
        toast.success(inWishlist ? "Removed from favorites" : "Saved to your favorites");
        return;
      }

      if (loading) return;

      if (!user) {
        if (!inWishlist) {
          openAuthModal({
            message: "Sign in to save this pattern",
            intent: {
              returnTo,
              action: "favorite",
              productId: product.id,
              productSnapshot: {
                id: product.id,
                slug: product.slug,
                title: product.title,
                price: product.price,
                sale_price: product.sale_price,
                images: product.images ?? [],
                category_id: product.category_id,
                skill_level: product.skill_level,
                is_new: product.is_new,
                is_active: product.is_active,
              },
            },
          });
        }
        return;
      }

      setPending(product.id);
      try {
        if (inWishlist) {
          removeItem(product.id);
          await removeFromWishlist(product.id);
          toast.success("Removed from favorites");
        } else {
          addItem(product);
          await addToWishlist(product.id);
          toast.success("Saved to your favorites");
        }
      } catch {
        toggleItem(product);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setPending(null);
      }
    },
    [user, loading, isInWishlist, toggleItem, addItem, removeItem, openAuthModal, pathname]
  );

  return { handleFavorite, pending, isInWishlist };
}
