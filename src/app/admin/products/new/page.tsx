import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategories } from "@/lib/data/products";
import { createProduct } from "@/app/actions/admin";
import { AdminProductForm } from "@/components/admin/admin-product-form";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-nca-green mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>
      <h1 className="font-serif text-3xl font-bold mb-8">Add New Pattern</h1>
      <AdminProductForm categories={categories} action={createProduct} submitLabel="Save Pattern" />
    </div>
  );
}
