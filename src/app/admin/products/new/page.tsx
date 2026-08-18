import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getCategories } from "@/lib/data/products";
import { createProduct } from "@/app/actions/admin";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-nca-green mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>
      <h1 className="font-serif text-3xl font-bold mb-8">Add New Pattern</h1>

      <Card>
        <CardContent className="p-6">
          <form action={createProduct} className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input name="title" required placeholder="Baby Bunny Lovey Crochet Pattern PDF" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea name="description" rows={4} className="w-full rounded-lg border border-input px-3 py-2 text-sm" placeholder="Pattern description..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <select name="category_id" className="w-full h-10 rounded-lg border border-input px-3 text-sm">
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Skill Level</label>
              <select name="skill_level" className="w-full h-10 rounded-lg border border-input px-3 text-sm">
                {["Beginner", "Easy", "Intermediate", "Advanced"].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Price ($)</label>
              <Input name="price" type="number" step="0.01" required placeholder="4.99" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Sale Price ($)</label>
              <Input name="sale_price" type="number" step="0.01" placeholder="Optional" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Pages</label>
              <Input name="pages_count" type="number" placeholder="12" />
            </div>
            <div className="flex flex-col gap-3 justify-end">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_featured" /> Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_bestseller" /> Bestseller
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_new" defaultChecked /> New Arrival
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Pattern PDF</label>
              <Input name="file" type="file" accept=".pdf" />
              <p className="text-xs text-muted-foreground mt-1">Upload to pattern-files storage bucket</p>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <Button type="submit">Save Pattern</Button>
              <Link href="/admin/products"><Button type="button" variant="outline">Cancel</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
