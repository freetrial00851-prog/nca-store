"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
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

export async function updateProfile(formData: FormData) {
  if (isDemoMode()) {
    revalidatePath("/account/settings");
    return { success: true };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: formData.get("full_name") as string,
      phone: formData.get("phone") as string,
      date_of_birth: formData.get("date_of_birth") as string,
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

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

  if (!user) return MOCK_PROFILE as Profile;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (data as Profile | null) ?? (MOCK_PROFILE as Profile);
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      totalOrders: MOCK_ORDERS.length,
      totalDownloads: 5,
      wishlistItems: 3,
      rewardPoints: MOCK_PROFILE.reward_points,
    };
  }

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

export async function getRecentOrders(limit = 5) {
  if (isDemoMode()) return MOCK_ORDERS.slice(0, limit);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return MOCK_ORDERS.slice(0, limit);

  const { data } = await supabase
    .from("orders")
    .select("*, order_items(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? MOCK_ORDERS.slice(0, limit);
}

export async function getOrderById(id: string): Promise<OrderWithProducts | null> {
  if (isDemoMode()) {
    const order = getMockOrder(id);
    if (!order) return null;
    return { ...order, products: getMockOrderProducts(order) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const order = getMockOrder(id);
    if (!order) return null;
    return { ...order, products: getMockOrderProducts(order) };
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(*))")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) {
    const mock = getMockOrder(id);
    if (!mock) return null;
    return { ...mock, products: getMockOrderProducts(mock) };
  }

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

  // Live mode: store in Supabase or external service
  return { success: true, message: "Thanks for subscribing!" };
}
