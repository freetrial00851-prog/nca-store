"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@/types/database";
import type { FormActionState } from "@/app/actions/admin";

const initialState: FormActionState = {};

export function CategoryForm({
  category,
  action,
  submitLabel,
}: {
  category?: Category;
  action: (prevState: FormActionState, formData: FormData) => Promise<FormActionState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <Card>
      <CardContent className="p-6">
        <form action={formAction} encType="multipart/form-data" className="space-y-4 max-w-lg">
          <div>
            <label className="text-sm font-medium mb-1 block">Name</label>
            <Input name="name" required defaultValue={category?.name} placeholder="Amigurumi" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={category?.description ?? ""}
              className="w-full rounded-lg border border-input px-3 py-2 text-sm"
              placeholder="Optional short description"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Sort Order</label>
            <Input name="sort_order" type="number" defaultValue={category?.sort_order ?? 0} />
            <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first.</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Image {category ? "(replace)" : ""}
            </label>
            {category?.image_url && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden mb-2 border border-border">
                <Image src={category.image_url} alt={category.name} fill className="object-cover" unoptimized />
              </div>
            )}
            <Input name="image" type="file" accept="image/*" />
          </div>

          {state.error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : submitLabel}
            </Button>
            <Link href="/admin/categories">
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
