import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getCategories, getProductById } from "@/lib/data/products";
import { updateProduct } from "@/app/actions/admin";

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

      <Card>
        <CardContent className="p-6">
          <form action={updateWithId} className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input name="title" required defaultValue={product.title} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea
                name="description"
                rows={4}
                defaultValue={product.description ?? ""}
                className="w-full rounded-lg border border-input px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <select
                name="category_id"
                defaultValue={product.category_id ?? categories[0]?.id}
                className="w-full h-10 rounded-lg border border-input px-3 text-sm"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Skill Level</label>
              <select
                name="skill_level"
                defaultValue={product.skill_level}
                className="w-full h-10 rounded-lg border border-input px-3 text-sm"
              >
                {["Beginner", "Easy", "Intermediate", "Advanced"].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Price ($)</label>
              <Input
                name="price"
                type="number"
                step="0.01"
                required
                defaultValue={product.price}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Sale Price ($)</label>
              <Input
                name="sale_price"
                type="number"
                step="0.01"
                defaultValue={product.sale_price ?? ""}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Pages</label>
              <Input
                name="pages_count"
                type="number"
                defaultValue={product.pages_count ?? 0}
              />
            </div>
            <div className="flex flex-col gap-3 justify-end">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_active" defaultChecked={product.is_active} /> Active
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_featured" defaultChecked={product.is_featured} /> Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_bestseller" defaultChecked={product.is_bestseller} /> Bestseller
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_new" defaultChecked={product.is_new} /> New Arrival
              </label>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <Button type="submit">Save Changes</Button>
              <Link href="/admin/products">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
