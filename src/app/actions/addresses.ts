"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import { requireUser } from "@/lib/auth-helpers";
import type { MockAddress } from "@/lib/data/mock-account";
import { MOCK_ADDRESSES } from "@/lib/data/mock-account";

export type Address = MockAddress;

export async function getAddresses(): Promise<Address[]> {
  if (isDemoMode()) return MOCK_ADDRESSES;

  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Address[]) ?? [];
}

export async function createAddress(formData: FormData) {
  if (isDemoMode()) {
    revalidatePath("/account/addresses");
    return { success: true };
  }

  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase.from("addresses").insert({
    user_id: user.id,
    type: (formData.get("type") as "shipping" | "billing") || "shipping",
    full_name: formData.get("full_name") as string,
    address_line1: formData.get("address_line1") as string,
    address_line2: (formData.get("address_line2") as string) || null,
    city: formData.get("city") as string,
    state: (formData.get("state") as string) || null,
    postal_code: formData.get("postal_code") as string,
    country: formData.get("country") as string,
    phone: (formData.get("phone") as string) || null,
    is_default: formData.get("is_default") === "on",
  });

  if (error) throw error;
  revalidatePath("/account/addresses");
  return { success: true };
}

export async function deleteAddress(id: string) {
  if (isDemoMode()) {
    revalidatePath("/account/addresses");
    return { success: true };
  }

  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/account/addresses");
  return { success: true };
}
