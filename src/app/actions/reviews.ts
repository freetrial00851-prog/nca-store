"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import { requireUser } from "@/lib/auth-helpers";
import { MOCK_REVIEWS } from "@/lib/data/mock-account";
import { MOCK_PRODUCTS } from "@/lib/data/mock-data";
import type { Product } from "@/types/database";

export interface UserReview {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  product: Product;
}

export async function getUserReviews(): Promise<UserReview[]> {
  if (isDemoMode()) {
    return MOCK_REVIEWS.filter((r) => r.user_id === "demo-user")
      .map((review) => {
        const product = MOCK_PRODUCTS.find((p) => p.id === review.product_id);
        if (!product) return null;
        return {
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at,
          product,
        };
      })
      .filter((r): r is UserReview => Boolean(r));
  }

  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, product:products(*, category:categories(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? [])
    .map((row) => {
      const product = (row as unknown as { product?: Product }).product;
      if (!product) return null;
      return {
        id: row.id,
        rating: row.rating,
        comment: row.comment,
        created_at: row.created_at,
        product,
      };
    })
    .filter((r): r is UserReview => Boolean(r));
}

export async function getProductReviews(productId: string) {
  if (isDemoMode()) {
    const { getMockReviewsForProduct } = await import("@/lib/data/mock-account");
    return getMockReviewsForProduct(productId);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, profiles(full_name)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    created_at: row.created_at,
    author: (row as { profiles?: { full_name?: string } }).profiles?.full_name ?? "Customer",
  }));
}

export async function submitReview(productId: string, rating: number, comment: string) {
  if (isDemoMode()) {
    revalidatePath("/account/reviews");
    return { success: true };
  }

  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").upsert(
    {
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
    },
    { onConflict: "product_id,user_id" }
  );

  if (error) throw error;
  revalidatePath("/account/reviews");
  revalidatePath(`/products`);
  return { success: true };
}
