import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/products/product-card";
import { getBestsellers } from "@/lib/data/products";

export default async function BestsellersPage() {
  const products = await getBestsellers();

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Bestsellers" }]} />
      <h1 className="font-serif text-3xl font-bold mt-4">Bestsellers</h1>
      <p className="text-muted-foreground mt-1 mb-8">Our most-loved patterns by the NCA community.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
