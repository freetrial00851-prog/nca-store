"use server";

import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";

export async function getUserOwnedProductIds(): Promise<string[]> {
  if (isDemoMode()) return [];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("downloads")
    .select("product_id")
    .eq("user_id", user.id);

  return (data ?? []).map((d) => d.product_id);
}

export async function userOwnsProduct(productId: string): Promise<boolean> {
  const ids = await getUserOwnedProductIds();
  return ids.includes(productId);
}
