"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import { requireUser } from "@/lib/auth-helpers";
import type { Product } from "@/types/database";

export async function getWishlistProducts(): Promise<Product[]> {
  if (isDemoMode()) return [];

  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlists")
    .select("product:products(*, category:categories(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? [])
    .map((row) => (row as unknown as { product?: Product }).product)
    .filter((p): p is Product => Boolean(p));
}

export async function addToWishlist(productId: string) {
  if (isDemoMode()) return { success: true };

  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("wishlists").upsert(
    { user_id: user.id, product_id: productId },
    { onConflict: "user_id,product_id" }
  );

  if (error) throw error;
  revalidatePath("/account/wishlist");
  return { success: true };
}

export async function removeFromWishlist(productId: string) {
  if (isDemoMode()) return { success: true };

  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId);

  if (error) throw error;
  revalidatePath("/account/wishlist");
  return { success: true };
}

export async function syncWishlistProductIds(productIds: string[]) {
  if (isDemoMode()) return { success: true };

  const user = await requireUser();
  const supabase = await createClient();

  if (productIds.length === 0) {
    await supabase.from("wishlists").delete().eq("user_id", user.id);
    return { success: true };
  }

  const { data: existing } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", user.id);

  const existingIds = new Set((existing ?? []).map((r) => r.product_id));
  const incomingIds = new Set(productIds);

  const toAdd = productIds.filter((id) => !existingIds.has(id));
  const toRemove = [...existingIds].filter((id) => !incomingIds.has(id));

  if (toAdd.length) {
    await supabase.from("wishlists").insert(
      toAdd.map((product_id) => ({ user_id: user.id, product_id }))
    );
  }

  if (toRemove.length) {
    await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .in("product_id", toRemove);
  }

  revalidatePath("/account/wishlist");
  return { success: true };
}
