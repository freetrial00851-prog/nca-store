"use client";

import { AuthModal } from "@/components/auth/auth-modal";
import { PendingActionHandler } from "@/components/auth/pending-action-handler";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function StoreProviders() {
  return (
    <>
      <AuthModal />
      <CartDrawer />
      <PendingActionHandler />
    </>
  );
}
