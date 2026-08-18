import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Download,
  Shield,
  FileText,
  Globe,
  BookOpen,
  Camera,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/products/product-card";
import { ProductActions } from "@/components/products/product-actions";
import { ProductTabs } from "@/components/products/product-tabs";
import { ProductGallery } from "@/components/products/product-gallery";
import { getProductBySlug, getProducts, getCategories } from "@/lib/data/products";
import { formatPrice, getEffectivePrice } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return { title: product.title };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, allProducts, categories] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
    getCategories(),
  ]);
  if (!product) notFound();

  const category = categories.find((c) => c.id === product.category_id);
  const related = allProducts
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 6);

  const price = getEffectivePrice(product);
  const onSale = product.sale_price != null && product.sale_price < product.price;
  const isFree = price === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          {
            label: category?.name ?? "Shop",
            href: category ? `/category/${category.slug}` : "/shop",
          },
          { label: product.title },
        ]}
        className="mb-6"
      />

      <div className="grid lg:grid-cols-2 gap-10 mb-16">
        <ProductGallery slug={product.slug} title={product.title} isNew={product.is_new} />

        <div>
          <Badge variant="success" className="mb-2">{product.skill_level}</Badge>
          <h1 className="font-serif text-3xl font-bold mb-2">{product.title}</h1>
          {product.average_rating && (
            <StarRating rating={product.average_rating} reviewCount={product.review_count} showValue className="mb-4" />
          )}

          <ul className="space-y-2 text-sm text-muted-foreground mb-4">
            <li className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Skill Level: {product.skill_level}</li>
            <li className="flex items-center gap-2"><Globe className="h-4 w-4" /> Language: {product.language}</li>
            <li className="flex items-center gap-2"><FileText className="h-4 w-4" /> Format: {product.format} Download</li>
            <li className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Pages: {product.pages_count} pages</li>
            <li className="flex items-center gap-2"><Camera className="h-4 w-4" /> Step-by-step photos included</li>
            <li className="flex items-center gap-2"><Download className="h-4 w-4" /> Instant Download</li>
          </ul>

          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              {isFree ? (
                <span className="font-serif text-3xl font-bold text-nca-green">Free</span>
              ) : (
                <>
                  <span className="font-serif text-3xl font-bold text-nca-green">{formatPrice(price)}</span>
                  {onSale && (
                    <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
                  )}
                  <span className="text-sm text-muted-foreground">USD</span>
                </>
              )}
            </div>
          </div>

          <ProductActions product={product} />

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-nca-sage/50">
              <Download className="h-5 w-5 text-nca-green shrink-0" />
              <div>
                <p className="text-sm font-medium">Instant Download</p>
                <p className="text-xs text-muted-foreground">Access immediately after purchase</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-nca-sage/50">
              <Shield className="h-5 w-5 text-nca-green shrink-0" />
              <div>
                <p className="text-sm font-medium">Secure Checkout</p>
                <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductTabs product={product} />

      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold">You May Also Like</h2>
            <Link href="/shop" className="text-sm text-nca-green hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
