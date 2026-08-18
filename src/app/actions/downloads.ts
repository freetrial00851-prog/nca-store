"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import { getMockDownloads } from "@/lib/data/mock-account";
import { MOCK_PRODUCTS } from "@/lib/data/mock-data";
import type { Product } from "@/types/database";

const SIGNED_URL_EXPIRY = 60;

export async function getSecureDownloadUrl(productId: string) {
  if (isDemoMode()) {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!product) return { error: "Product not found" };
    return { demo: true, title: product.title };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to download" };
  }

  const { data: download } = await supabase
    .from("downloads")
    .select("*, product:products(file_url, title)")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (!download?.product?.file_url) {
    return {
      error:
        "Download not ready yet. The pattern PDF may still be uploading — contact support if this persists.",
    };
  }

  const admin = await createAdminClient();
  const { data: signedUrl, error } = await admin.storage
    .from("pattern-files")
    .createSignedUrl(download.product.file_url, SIGNED_URL_EXPIRY);

  if (error || !signedUrl) {
    return { error: "Failed to generate download link" };
  }

  await supabase
    .from("downloads")
    .update({
      download_count: download.download_count + 1,
      last_downloaded_at: new Date().toISOString(),
    })
    .eq("id", download.id);

  return { url: signedUrl.signedUrl };
}

export async function getUserDownloads(): Promise<
  { product: Product; purchased_at: string; download_count: number }[]
> {
  if (isDemoMode()) {
    return getMockDownloads().map((product) => ({
      product,
      purchased_at: product.created_at,
      download_count: 2,
    }));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from("downloads")
    .select("*, product:products(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? []).map((d) => ({
    product: d.product as Product,
    purchased_at: d.created_at,
    download_count: d.download_count,
  }));
}
