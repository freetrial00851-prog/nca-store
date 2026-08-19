"use client";

import { AuthModal } from "@/components/auth/auth-modal";
import { PendingActionHandler } from "@/components/auth/pending-action-handler";
import { WishlistHydrator } from "@/components/auth/wishlist-hydrator";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function StoreProviders() {
  return (
    <>
      <AuthModal />
      <CartDrawer />
      <PendingActionHandler />
      <WishlistHydrator />
    </>
  );
}
