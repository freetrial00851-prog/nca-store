"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import { requireUser } from "@/lib/auth-helpers";
import {
  MOCK_PROFILE,
  MOCK_ORDERS,
  getMockOrder,
  getMockOrderProducts,
} from "@/lib/data/mock-account";
import type { Profile, Product, OrderStatus } from "@/types/database";

export type OrderWithProducts = {
  id: string;
  status: OrderStatus;
  total_amount: number;
  subtotal: number;
  discount_amount: number;
  created_at: string;
  item_count: number;
  products: Product[];
};

function parseDate(value: FormDataEntryValue | null): string | null {
  const str = String(value ?? "").trim();
  return str ? str : null;
}

export async function updateProfile(formData: FormData) {
  if (isDemoMode()) {
    revalidatePath("/account/settings");
    return { success: true };
  }

  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: formData.get("full_name") as string,
      phone: formData.get("phone") as string,
      date_of_birth: parseDate(formData.get("date_of_birth")),
      country: formData.get("country") as string,
      language: formData.get("language") as string,
    })
    .eq("id", user.id);

  if (error) throw error;
  revalidatePath("/account/settings");
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  if (isDemoMode()) return { success: true };

  const supabase = await createClient();
  const newPassword = formData.get("new_password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
  return { success: true };
}

export async function updateNotifications(formData: FormData) {
  if (isDemoMode()) {
    revalidatePath("/account/settings");
    return { success: true };
  }

  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      email_updates: formData.get("email_updates") === "on",
      marketing_emails: formData.get("marketing_emails") === "on",
      order_updates: formData.get("order_updates") === "on",
    })
    .eq("id", user.id);

  if (error) throw error;
  revalidatePath("/account/settings");
  return { success: true };
}

export async function updateNewsletter(formData: FormData) {
  if (isDemoMode()) {
    revalidatePath("/account/newsletter");
    return { success: true };
  }

  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      newsletter_subscribed: formData.get("subscribed") === "on",
      newsletter_frequency: formData.get("frequency") as string,
    })
    .eq("id", user.id);

  if (error) throw error;
  revalidatePath("/account/newsletter");
  return { success: true };
}

export async function getProfile(): Promise<Profile | null> {
  if (isDemoMode()) return MOCK_PROFILE as Profile;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}

export async function getAccountStats() {
  if (isDemoMode()) {
    return {
      totalOrders: MOCK_ORDERS.length,
      totalDownloads: 5,
      wishlistItems: 3,
      rewardPoints: MOCK_PROFILE.reward_points,
    };
  }

  const user = await requireUser();
  const supabase = await createClient();

  const [orders, downloads, wishlist, profile] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact" }).eq("user_id", user.id),
    supabase.from("downloads").select("id", { count: "exact" }).eq("user_id", user.id),
    supabase.from("wishlists").select("id", { count: "exact" }).eq("user_id", user.id),
    supabase.from("profiles").select("reward_points").eq("id", user.id).single(),
  ]);

  return {
    totalOrders: orders.count ?? 0,
    totalDownloads: downloads.count ?? 0,
    wishlistItems: wishlist.count ?? 0,
    rewardPoints: profile.data?.reward_points ?? 0,
  };
}

export async function getRecentOrders(limit = 50) {
  if (isDemoMode()) return MOCK_ORDERS.slice(0, limit);

  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((order) => {
    const items = order.order_items as { count: number }[] | undefined;
    const itemCount = items?.[0]?.count ?? 0;
    return { ...order, item_count: itemCount };
  });
}

export async function getOrderById(id: string): Promise<OrderWithProducts | null> {
  if (isDemoMode()) {
    const order = getMockOrder(id);
    if (!order) return null;
    return { ...order, products: getMockOrderProducts(order) };
  }

  const user = await requireUser();
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(*))")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !order) return null;

  const orderItems = (order.order_items ?? []) as { product?: Product }[];
  const products = orderItems
    .map((item) => item.product)
    .filter((p): p is Product => Boolean(p));

  return {
    id: order.id,
    status: order.status,
    total_amount: order.total_amount,
    subtotal: order.subtotal,
    discount_amount: order.discount_amount,
    created_at: order.created_at,
    item_count: products.length,
    products,
  };
}

export async function subscribeNewsletter(email: string) {
  if (!email || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (isDemoMode()) {
    return { success: true, message: "Thanks for subscribing! Check your inbox for 10% off." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase
      .from("profiles")
      .update({ newsletter_subscribed: true, email })
      .eq("id", user.id);
  }

  return { success: true, message: "Thanks for subscribing!" };
}
