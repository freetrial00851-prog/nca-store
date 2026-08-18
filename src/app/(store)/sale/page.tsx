import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/products/product-card";
import { getProducts } from "@/lib/data/products";
import { Badge } from "@/components/ui/badge";

export default async function SalePage() {
  const products = await getProducts();
  const onSale = products.filter((p) => p.sale_price !== null && p.sale_price < p.price);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Sale" }]} />
      <div className="mt-6 mb-10">
        <Badge variant="sale" className="mb-3">Limited Time</Badge>
        <h1 className="font-serif text-4xl font-bold">Sale Patterns</h1>
        <p className="text-muted-foreground mt-2">Save on our most popular crochet patterns.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {onSale.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {onSale.length === 0 && (
        <p className="text-center text-muted-foreground py-16">
          No sale items right now. <Link href="/shop" className="text-nca-green hover:underline">Browse all patterns</Link>
        </p>
      )}
    </div>
  );
}
