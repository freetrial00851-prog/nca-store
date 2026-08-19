"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/demo-mode";
import { getAdminDb } from "@/lib/auth-helpers";
import { slugify } from "@/lib/utils";
import type { Product, Coupon } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

async function uploadPatternPdf(
  admin: SupabaseClient,
  slug: string,
  file: File
): Promise<string> {
  const path = `patterns/${slug}.pdf`;
  const { error } = await admin.storage.from("pattern-files").upload(path, file, {
    upsert: true,
    contentType: "application/pdf",
  });
  if (error) throw new Error(`PDF upload failed: ${error.message}`);
  return path;
}

async function uploadProductImages(
  admin: SupabaseClient,
  slug: string,
  formData: FormData,
  existing: string[] = []
): Promise<string[]> {
  const entries = formData.getAll("images");
  const uploaded: string[] = [...existing];

  for (const entry of entries) {
    if (!(entry instanceof File) || entry.size === 0) continue;

    const ext = entry.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${slug}/${Date.now()}-${uploaded.length}.${ext}`;
    const { error } = await admin.storage.from("product-images").upload(path, entry, {
      upsert: true,
      contentType: entry.type || "image/jpeg",
    });
    if (error) throw new Error(`Image upload failed: ${error.message}`);

    const { data } = admin.storage.from("product-images").getPublicUrl(path);
    uploaded.push(data.publicUrl);
  }

  return uploaded;
}

export async function createProduct(formData: FormData) {
  if (isDemoMode()) {
    revalidatePath("/admin/products");
    redirect("/admin/products");
  }

  const admin = await getAdminDb();
  const title = formData.get("title") as string;
  const slug = slugify(title);

  const { data, error } = await admin.from("products").insert({
    title,
    slug,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    sale_price: formData.get("sale_price")
      ? parseFloat(formData.get("sale_price") as string)
      : null,
    category_id: formData.get("category_id") as string,
    skill_level: formData.get("skill_level") as "Beginner" | "Easy" | "Intermediate" | "Advanced",
    language: "English",
    pages_count: parseInt(formData.get("pages_count") as string) || 0,
    format: "PDF",
    is_featured: formData.get("is_featured") === "on",
    is_bestseller: formData.get("is_bestseller") === "on",
    is_new: formData.get("is_new") === "on",
    is_active: true,
  }).select().single();

  if (error) throw new Error(error.message);

  const file = formData.get("file") as File | null;
  let fileUrl: string | null = null;
  if (file && file.size > 0 && data) {
    fileUrl = await uploadPatternPdf(admin, data.slug, file);
  }

  const images = await uploadProductImages(admin, slug, formData);

  await admin
    .from("products")
    .update({
      ...(fileUrl ? { file_url: fileUrl } : {}),
      ...(images.length ? { images } : {}),
    })
    .eq("id", data.id);

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  if (isDemoMode()) {
    revalidatePath("/admin/products");
    redirect("/admin/products");
  }

  const admin = await getAdminDb();

  const { error } = await admin.from("products").update({
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    sale_price: formData.get("sale_price")
      ? parseFloat(formData.get("sale_price") as string)
      : null,
    category_id: formData.get("category_id") as string,
    skill_level: formData.get("skill_level") as "Beginner" | "Easy" | "Intermediate" | "Advanced",
    pages_count: parseInt(formData.get("pages_count") as string) || 0,
    is_featured: formData.get("is_featured") === "on",
    is_bestseller: formData.get("is_bestseller") === "on",
    is_new: formData.get("is_new") === "on",
    is_active: formData.get("is_active") === "on",
  }).eq("id", id);

  if (error) throw new Error(error.message);

  const { data: current } = await admin
    .from("products")
    .select("slug, images")
    .eq("id", id)
    .single();

  const file = formData.get("file") as File | null;
  const updates: { file_url?: string; images?: string[] } = {};

  if (file && file.size > 0 && current) {
    updates.file_url = await uploadPatternPdf(admin, current.slug, file);
  }

  const images = await uploadProductImages(
    admin,
    current?.slug ?? id,
    formData,
    (current?.images as string[]) ?? []
  );
  if (images.length) updates.images = images;

  if (Object.keys(updates).length) {
    await admin.from("products").update(updates).eq("id", id);
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  if (isDemoMode()) return { success: true };

  const admin = await getAdminDb();
  const { error } = await admin.from("products").update({ is_active: false }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateHeroImage(formData: FormData) {
  if (isDemoMode()) {
    revalidatePath("/admin/homepage");
    revalidatePath("/");
    return;
  }

  const admin = await getAdminDb();
  const file = formData.get("hero_image") as File | null;

  if (!file || file.size === 0) {
    throw new Error("Please choose an image to upload.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `site/hero-${Date.now()}.${ext}`;

  const { error: uploadError } = await admin.storage
    .from("product-images")
    .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });

  if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

  const { data } = admin.storage.from("product-images").getPublicUrl(path);

  const { error } = await admin
    .from("site_settings")
    .upsert({ key: "hero_image_url", value: data.publicUrl, updated_at: new Date().toISOString() });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function getAdminCoupons(): Promise<Coupon[]> {
  if (isDemoMode()) {
    const { MOCK_COUPONS } = await import("@/lib/data/mock-data");
    return MOCK_COUPONS;
  }

  const admin = await getAdminDb();
  const { data, error } = await admin
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Coupon[]) ?? [];
}

export async function createCoupon(formData: FormData) {
  if (isDemoMode()) {
    revalidatePath("/admin/coupons");
    return { success: true };
  }

  const admin = await getAdminDb();

  const { error } = await admin.from("coupons").insert({
    code: (formData.get("code") as string).toUpperCase(),
    discount_type: formData.get("discount_type") as "percentage" | "fixed",
    value: parseFloat(formData.get("value") as string),
    min_order_amount: formData.get("min_order_amount")
      ? parseFloat(formData.get("min_order_amount") as string)
      : 0,
    is_active: true,
    expires_at: (formData.get("expires_at") as string) || null,
    max_uses: formData.get("max_uses")
      ? parseInt(formData.get("max_uses") as string)
      : null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function toggleCoupon(id: string, isActive: boolean) {
  if (isDemoMode()) return { success: true };

  const admin = await getAdminDb();
  const { error } = await admin.from("coupons").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function updateOrderStatus(id: string, status: "Processing" | "Completed" | "Cancelled" | "Refunded") {
  if (isDemoMode()) return { success: true };

  const admin = await getAdminDb();
  const { error } = await admin.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { success: true };
}

export async function grantDownloadAccess(userId: string, productId: string, orderId: string) {
  if (isDemoMode()) return { success: true };

  const admin = await getAdminDb();
  const { error } = await admin.from("downloads").upsert(
    {
      user_id: userId,
      product_id: productId,
      order_id: orderId,
      download_count: 0,
    },
    { onConflict: "user_id,product_id,order_id" }
  );

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function getAdminStats() {
  if (isDemoMode()) {
    const { MOCK_ORDERS } = await import("@/lib/data/mock-account");
    const { getProducts } = await import("@/lib/data/products");
    const products = await getProducts();
    const revenue = MOCK_ORDERS.reduce((sum, o) => sum + o.total_amount, 0);
    return {
      revenue,
      orderCount: MOCK_ORDERS.length,
      productCount: products.length,
      downloadCount: 28,
    };
  }

  const admin = await getAdminDb();

  const [orders, products, downloads] = await Promise.all([
    admin.from("orders").select("total_amount, status"),
    admin.from("products").select("id", { count: "exact" }).eq("is_active", true),
    admin.from("downloads").select("id", { count: "exact" }),
  ]);

  const completed = orders.data?.filter((o) => o.status === "Completed") ?? [];
  const revenue = completed.reduce((sum, o) => sum + Number(o.total_amount), 0);

  return {
    revenue,
    orderCount: orders.data?.length ?? 0,
    productCount: products.count ?? 0,
    downloadCount: downloads.count ?? 0,
  };
}

export interface AdminOrderRow {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  customer_name: string;
  customer_email: string;
}

export async function getAdminOrders(): Promise<AdminOrderRow[]> {
  if (isDemoMode()) {
    const { MOCK_ORDERS, MOCK_CUSTOMERS } = await import("@/lib/data/mock-account");
    const customer = MOCK_CUSTOMERS[0];
    return MOCK_ORDERS.map((order) => ({
      id: order.id,
      created_at: order.created_at,
      total_amount: order.total_amount,
      status: order.status,
      customer_name: customer.name,
      customer_email: customer.email,
    }));
  }

  const admin = await getAdminDb();
  const { data: orders, error } = await admin
    .from("orders")
    .select("id, created_at, total_amount, status, user_id")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!orders?.length) return [];

  const userIds = [...new Set(orders.map((o) => o.user_id))];
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds);

  const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

  return orders.map((order) => {
    const profile = profileMap.get(order.user_id);
    return {
      id: order.id,
      created_at: order.created_at,
      total_amount: Number(order.total_amount),
      status: order.status,
      customer_name: profile?.full_name ?? "Customer",
      customer_email: profile?.email ?? "",
    };
  });
}

export interface AdminCustomerRow {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
}

export async function getAdminCustomers(): Promise<AdminCustomerRow[]> {
  if (isDemoMode()) {
    const { MOCK_CUSTOMERS } = await import("@/lib/data/mock-account");
    return MOCK_CUSTOMERS;
  }

  const admin = await getAdminDb();
  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, full_name, email, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!profiles?.length) return [];

  const { data: orders } = await admin
    .from("orders")
    .select("user_id, total_amount")
    .eq("status", "Completed");

  const stats = new Map<string, { count: number; spent: number }>();
  for (const order of orders ?? []) {
    const current = stats.get(order.user_id) ?? { count: 0, spent: 0 };
    stats.set(order.user_id, {
      count: current.count + 1,
      spent: current.spent + Number(order.total_amount),
    });
  }

  return profiles.map((profile) => {
    const orderStats = stats.get(profile.id) ?? { count: 0, spent: 0 };
    return {
      id: profile.id,
      name: profile.full_name ?? "Customer",
      email: profile.email ?? "",
      orders: orderStats.count,
      spent: orderStats.spent,
      joined: profile.created_at,
    };
  });
}

export async function getAdminOrderById(id: string) {
  if (isDemoMode()) {
    const { getOrderById } = await import("@/app/actions/profile");
    const order = await getOrderById(id);
    if (!order) return null;
    const { MOCK_CUSTOMERS } = await import("@/lib/data/mock-account");
    return { order, customer: MOCK_CUSTOMERS[0], userId: "demo-user" };
  }

  const admin = await getAdminDb();
  const { data: order, error } = await admin
    .from("orders")
    .select("*, order_items(*, product:products(*))")
    .eq("id", id)
    .single();

  if (error || !order) return null;

  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, email")
    .eq("id", order.user_id)
    .single();

  const orderItems = (order.order_items ?? []) as { product?: Product }[];
  const products = orderItems
    .map((item) => item.product)
    .filter((p): p is Product => Boolean(p));

  return {
    order: {
      id: order.id,
      status: order.status,
      total_amount: Number(order.total_amount),
      subtotal: Number(order.subtotal),
      discount_amount: Number(order.discount_amount),
      created_at: order.created_at,
      products,
    },
    customer: {
      name: profile?.full_name ?? "Customer",
      email: profile?.email ?? "",
    },
    userId: order.user_id as string,
  };
}
