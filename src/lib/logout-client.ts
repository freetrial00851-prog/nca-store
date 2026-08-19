import { useWishlistStore } from "@/lib/store/wishlist-store";
import { isClientDemoMode } from "@/lib/checkout-client";

/**
 * Single source of truth for signing the user out — used by both the admin
 * sidebar and the account sidebar so the behavior (and any future change to
 * it) stays identical in both places. Logs out immediately on one click, no
 * confirmation step.
 */
export async function performLogout() {
  try {
    if (!isClientDemoMode()) {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    }
  } finally {
    useWishlistStore.getState().clearWishlist();
    window.location.assign("/");
  }
}
