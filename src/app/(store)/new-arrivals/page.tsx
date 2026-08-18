import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/products/product-card";
import { getProducts } from "@/lib/data/products";

export default async function NewArrivalsPage() {
  const products = (await getProducts()).filter((p) => p.is_new);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "New Arrivals" }]} />
      <h1 className="font-serif text-3xl font-bold mt-4">New Arrivals</h1>
      <p className="text-muted-foreground mt-1 mb-8">Fresh patterns added to our collection.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
