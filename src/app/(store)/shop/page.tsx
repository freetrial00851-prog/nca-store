import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ShopCatalog } from "@/components/shop/shop-catalog";
import { getProducts, getCategories } from "@/lib/data/products";

interface ShopPageProps {
  searchParams: Promise<{ q?: string; category?: string; skill?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Shop All" }]} />
      <h1 className="font-serif text-3xl font-bold mt-4">All Patterns</h1>
      <p className="text-muted-foreground mt-1">Browse our full collection of premium crochet patterns.</p>
      <ShopCatalog
        products={products}
        categories={categories}
        initialQuery={params.q}
        initialCategory={params.category}
        initialSkill={params.skill}
      />
    </div>
  );
}
