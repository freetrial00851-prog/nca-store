"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/demo-mode";
import { getAdminDb } from "@/lib/auth-helpers";
import { slugify } from "@/lib/utils";
import type { Product, Coupon, Category } from "@/types/database";

export async function createProduct(formData: FormData) {
  if (isDemoMode()) {
    revalidatePath("/admin/products");
    redirect("/admin/products");
  }

  const admin = await getAdminDb();
  const title = formData.get("title") as string;
  const slug = slugify(title);

  // File PDF/images are uploaded client-side beforehand (Vercel's serverless
  // functions have a hard 4.5MB body limit that can't be raised); this form
  // only receives the resulting URLs/paths as plain text fields.
  const fileUrl = (formData.get("file_url") as string) || null;
  const imagesRaw = (formData.get("images_json") as string) || "[]";
  const images: string[] = JSON.parse(imagesRaw);

  const { error } = await admin.from("products").insert({
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
    ...(fileUrl ? { file_url: fileUrl } : {}),
    ...(images.length ? { images } : {}),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  if (isDemoMode()) {
    revalidatePath("/admin/products");
    redirect("/admin/products");
  }

  const admin = await getAdminDb();

  const fileUrl = (formData.get("file_url") as string) || null;
  const imagesRaw = (formData.get("images_json") as string) || null;

  const { error } = await admin
    .from("products")
    .update({
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
      ...(fileUrl ? { file_url: fileUrl } : {}),
      ...(imagesRaw ? { images: JSON.parse(imagesRaw) } : {}),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

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

export type UpdateHeroImageState = { error?: string; success?: boolean };

export async function updateHeroImage(
  _prevState: UpdateHeroImageState,
  formData: FormData
): Promise<UpdateHeroImageState> {
  if (isDemoMode()) {
    revalidatePath("/admin/homepage");
    revalidatePath("/");
    return { success: true };
  }

  try {
    const url = (formData.get("hero_image_url") as string)?.trim();
    if (!url) return { error: "Please choose an image to upload." };

    const admin = await getAdminDb();
    const { error } = await admin
      .from("site_settings")
      .upsert({ key: "hero_image_url", value: url, updated_at: new Date().toISOString() });

    if (error) return { error: error.message };

    revalidatePath("/admin/homepage");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong. Please try again." };
  }
}

export type FormActionState = { error?: string; success?: boolean };

export async function createCategory(
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  if (isDemoMode()) return { error: "Categories can't be edited in demo mode." };

  try {
    const admin = await getAdminDb();
    const name = (formData.get("name") as string)?.trim();
    if (!name) return { error: "Name is required." };

    const slug = slugify(name);
    const sortOrder = parseInt(formData.get("sort_order") as string) || 0;
    const description = (formData.get("description") as string) || null;
    const imageUrl = (formData.get("image_url") as string) || null;

    const { error } = await admin
      .from("categories")
      .insert({ name, slug, sort_order: sortOrder, description, ...(imageUrl ? { image_url: imageUrl } : {}) });

    if (error) return { error: error.message };

    revalidatePath("/admin/categories");
    revalidatePath("/");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }

  redirect("/admin/categories");
}

export async function updateCategory(
  id: string,
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  if (isDemoMode()) return { error: "Categories can't be edited in demo mode." };

  try {
    const admin = await getAdminDb();
    const name = (formData.get("name") as string)?.trim();
    if (!name) return { error: "Name is required." };

    const sortOrder = parseInt(formData.get("sort_order") as string) || 0;
    const description = (formData.get("description") as string) || null;
    const imageUrl = (formData.get("image_url") as string) || null;

    const { error } = await admin
      .from("categories")
      .update({ name, sort_order: sortOrder, description, ...(imageUrl ? { image_url: imageUrl } : {}) })
      .eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/categories");
    revalidatePath("/");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }

  redirect("/admin/categories");
}

export async function deleteCategory(id: string): Promise<FormActionState> {
  if (isDemoMode()) return { error: "Categories can't be edited in demo mode." };

  const admin = await getAdminDb();

  const { count } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    return {
      error: `Can't delete — ${count} product(s) still use this category. Move or delete those products first.`,
    };
  }

  const { error } = await admin.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function getAdminCategories(): Promise<Category[]> {
  if (isDemoMode()) {
    const { MOCK_CATEGORIES } = await import("@/lib/data/mock-data");
    return MOCK_CATEGORIES;
  }

  const admin = await getAdminDb();
  const { data, error } = await admin.from("categories").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return (data as Category[]) ?? [];
}

export async function updateSiteSettings(
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  if (isDemoMode()) return { error: "Settings can't be edited in demo mode." };

  const admin = await getAdminDb();

  const keys = [
    "store_name",
    "store_tagline",
    "contact_email",
    "instagram_url",
    "facebook_url",
    "pinterest_url",
  ];

  const rows = keys.map((key) => ({
    key,
    value: ((formData.get(key) as string) || "").trim() || null,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await admin.from("site_settings").upsert(rows);
  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}

export interface AdminTeamMember {
  userId: string;
  email: string;
  name: string | null;
}

export async function getAdminTeam(): Promise<AdminTeamMember[]> {
  if (isDemoMode()) return [];

  const admin = await getAdminDb();
  const { data: roles, error } = await admin.from("roles").select("user_id").eq("role", "admin");
  if (error) throw new Error(error.message);
  if (!roles?.length) return [];

  const userIds = roles.map((r) => r.user_id);
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, full_name")
    .in("id", userIds);

  return userIds.map((userId) => {
    const profile = profiles?.find((p) => p.id === userId);
    return {
      userId,
      email: profile?.email ?? "(unknown email)",
      name: profile?.full_name ?? null,
    };
  });
}

export async function grantAdminByEmail(
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  if (isDemoMode()) return { error: "Team can't be edited in demo mode." };

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { error: "Email is required." };

  const admin = await getAdminDb();
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (!profile) {
    return { error: "No account found with that email. They need to sign up first." };
  }

  const { error } = await admin
    .from("roles")
    .upsert({ user_id: profile.id, role: "admin" }, { onConflict: "user_id" });

  if (error) return { error: error.message };

  revalidatePath("/admin/team");
  return { success: true };
}

export async function revokeAdmin(userId: string): Promise<FormActionState> {
  if (isDemoMode()) return { error: "Team can't be edited in demo mode." };

  const admin = await getAdminDb();
  const { error } = await admin.from("roles").delete().eq("user_id", userId).eq("role", "admin");
  if (error) return { error: error.message };

  revalidatePath("/admin/team");
  return { success: true };
}

export interface AdminReviewRow {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  productTitle: string;
  authorName: string;
}

export async function getAdminReviews(): Promise<AdminReviewRow[]> {
  if (isDemoMode()) return [];

  const admin = await getAdminDb();
  const { data, error } = await admin
    .from("reviews")
    .select("id, rating, comment, created_at, product:products(title), profiles(full_name)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const r = row as unknown as {
      id: string;
      rating: number;
      comment: string | null;
      created_at: string;
      product?: { title?: string };
      profiles?: { full_name?: string };
    };
    return {
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
      productTitle: r.product?.title ?? "Unknown product",
      authorName: r.profiles?.full_name ?? "Customer",
    };
  });
}

export async function deleteReview(id: string): Promise<FormActionState> {
  if (isDemoMode()) return { error: "Reviews can't be edited in demo mode." };

  const admin = await getAdminDb();
  const { error } = await admin.from("reviews").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/reviews");
  revalidatePath("/products");
  return { success: true };
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
