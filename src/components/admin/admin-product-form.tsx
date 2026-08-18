"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { Category, Product } from "@/types/database";

interface AdminProductFormProps {
  categories: Category[];
  product?: Product;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

export function AdminProductForm({
  categories,
  product,
  action,
  submitLabel,
}: AdminProductFormProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <form action={action} encType="multipart/form-data" className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input
              name="title"
              required
              defaultValue={product?.title}
              placeholder="Baby Bunny Lovey Crochet Pattern PDF"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-1 block">Description</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={product?.description ?? ""}
              className="w-full rounded-lg border border-input px-3 py-2 text-sm"
              placeholder="Pattern description..."
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <select
              name="category_id"
              defaultValue={product?.category_id ?? categories[0]?.id}
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
              defaultValue={product?.skill_level ?? "Easy"}
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
              defaultValue={product?.price}
              placeholder="4.99"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Sale Price ($)</label>
            <Input
              name="sale_price"
              type="number"
              step="0.01"
              defaultValue={product?.sale_price ?? ""}
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Pages</label>
            <Input
              name="pages_count"
              type="number"
              defaultValue={product?.pages_count ?? ""}
              placeholder="12"
            />
          </div>
          <div className="flex flex-col gap-3 justify-end">
            {product && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_active" defaultChecked={product.is_active} /> Active
              </label>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_featured" defaultChecked={product?.is_featured} /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_bestseller" defaultChecked={product?.is_bestseller} /> Bestseller
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_new"
                defaultChecked={product?.is_new ?? !product}
              />{" "}
              New Arrival
            </label>
          </div>

          <div className="md:col-span-2 rounded-lg border border-dashed border-nca-green/40 bg-nca-sage/20 p-4">
            <h3 className="text-sm font-semibold text-nca-green mb-3">Pattern Files</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Pattern PDF {product ? "(replace)" : ""}
                </label>
                <Input name="file" type="file" accept=".pdf,application/pdf" />
                {product?.file_url && (
                  <p className="text-xs text-muted-foreground mt-1">Current: {product.file_url}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Product Images</label>
                <Input name="images" type="file" accept="image/*" multiple />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload 1–4 gallery images (JPG, PNG, WebP)
                </p>
              </div>
            </div>
            {product?.images && product.images.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {product.images.length} image(s) on file — upload new ones to add/replace
              </p>
            )}
          </div>

          <div className="md:col-span-2 flex gap-3">
            <Button type="submit">{submitLabel}</Button>
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
