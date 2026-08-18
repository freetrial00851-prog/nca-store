import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/products/product-card";
import { getCategories, getProductsByCategory } from "@/lib/data/products";
import { getCategoryImage } from "@/lib/data/product-images";
import Image from "next/image";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  return { title: category ? `${category.name} | NCA` : "Category | NCA" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const products = await getProductsByCategory(slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: category.name }]} />

      <div className="flex flex-col md:flex-row items-center gap-6 mt-6 mb-10 p-8 bg-white rounded-2xl border border-border/60">
        <div className="relative h-24 w-24 rounded-full overflow-hidden shrink-0 ring-4 ring-nca-sage">
          <Image src={getCategoryImage(slug)} alt={category.name} fill className="object-cover" />
        </div>
        <div className="text-center md:text-left">
          <h1 className="font-serif text-3xl font-bold">{category.name}</h1>
          <p className="text-muted-foreground mt-1">{products.length} premium crochet patterns</p>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">No patterns in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
