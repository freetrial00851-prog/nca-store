"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import { addToWishlist, syncWishlistProductIds } from "@/app/actions/wishlist";
import type { PendingAuthAction } from "@/lib/auth-intent";

import type { ProductSnapshot } from "@/lib/auth-intent";

interface PendingIntentInput {
  returnTo: string;
  action?: PendingAuthAction | null;
  productId?: string;
  productSnapshot?: ProductSnapshot;
}

export async function completePendingAuthAction(intent: PendingIntentInput | null) {
  if (!intent || isDemoMode()) {
    return { success: true };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };

  let favoritedProductId: string | undefined;

  if (intent.action === "favorite" && intent.productId) {
    await addToWishlist(intent.productId);
    favoritedProductId = intent.productId;
    revalidatePath(intent.returnTo);
    revalidatePath("/account/wishlist");
  }

  return { success: true, favoritedProductId };
}

export async function syncGuestWishlistOnLogin(productIds: string[]) {
  if (isDemoMode() || productIds.length === 0) return { success: true };
  await syncWishlistProductIds(productIds);
  revalidatePath("/account/wishlist");
  return { success: true };
}
