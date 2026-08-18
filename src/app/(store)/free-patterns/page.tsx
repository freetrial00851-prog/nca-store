import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { getFreeProducts } from "@/lib/data/products";

export default async function FreePatternsPage() {
  const products = await getFreeProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Free Patterns" }]} />
      <div className="flex items-center gap-4 mb-8">
        <div className="h-14 w-14 rounded-full bg-nca-sage flex items-center justify-center shrink-0">
          <Gift className="h-7 w-7 text-nca-green" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold">Free Patterns</h1>
          <p className="text-muted-foreground mt-1">Download these patterns at no cost — perfect for trying NCA.</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-6">No free patterns available right now.</p>
          <Link href="/shop"><Button>Browse All Patterns</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
