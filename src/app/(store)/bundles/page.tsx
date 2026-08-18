import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/products/product-card";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/lib/data/products";
import { formatPrice, getEffectivePrice } from "@/lib/utils";

export default async function BundlesPage() {
  const products = await getProducts();
  const onSale = products.filter((p) => p.sale_price != null && p.sale_price < p.price);
  const bundleTotal = onSale.reduce((sum, p) => sum + getEffectivePrice(p), 0);
  const originalTotal = onSale.reduce((sum, p) => sum + p.price, 0);
  const savings = originalTotal - bundleTotal;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Pattern Bundles" }]} />
      <div className="mt-6 mb-10">
        <Badge variant="sale" className="mb-3">Save up to 40%</Badge>
        <h1 className="font-serif text-4xl font-bold">Pattern Bundles</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Curated collections of our most popular patterns at bundle pricing. Add individual patterns to your cart or grab the full set.
        </p>
        {onSale.length > 0 && (
          <p className="text-sm text-nca-green font-medium mt-3">
            Bundle of {onSale.length} patterns — {formatPrice(bundleTotal)} (save {formatPrice(savings)})
          </p>
        )}
      </div>

      {onSale.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">No bundle deals right now. Check back during our next sale!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {onSale.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
