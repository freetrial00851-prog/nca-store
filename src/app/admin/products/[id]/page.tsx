import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCategories, getProductById } from "@/lib/data/products";
import { updateProduct } from "@/app/actions/admin";
import { AdminProductForm } from "@/components/admin/admin-product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-nca-green mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>
      <h1 className="font-serif text-3xl font-bold mb-2">Edit Pattern</h1>
      <p className="text-sm text-muted-foreground mb-8">{product.slug}</p>
      <AdminProductForm
        categories={categories}
        product={product}
        action={updateWithId}
        submitLabel="Save Changes"
      />
    </div>
  );
}
