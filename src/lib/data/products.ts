import type { Category, Product } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/data/mock-data";

function useMockData() {
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function getCategories(): Promise<Category[]> {
  if (useMockData()) return MOCK_CATEGORIES;

  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return data ?? MOCK_CATEGORIES;
}

export async function getProducts(): Promise<Product[]> {
  if (useMockData()) return MOCK_PRODUCTS;

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return (data as Product[]) ?? MOCK_PRODUCTS;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.is_featured || p.is_new).slice(0, 4);
}

export async function getBestsellers(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.is_bestseller).slice(0, 4);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (useMockData()) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data as Product | null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (useMockData()) {
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("id", id)
    .single();
  return data as Product | null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) return [];
  return products.filter((p) => p.category_id === category.id);
}

export async function getProductsBySkillLevel(level: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.skill_level === level);
}

export async function getFreeProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.price === 0 || p.tags.some((t) => t.toLowerCase() === "free"));
}
