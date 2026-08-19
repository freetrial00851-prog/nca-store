"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@/types/database";
import type { FormActionState } from "@/app/actions/admin";
import { uploadFileClient, slugifyClient } from "@/lib/admin-upload-client";

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
  const [state, formAction, actionPending] = useActionState(action, initialState);
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, startUploading] = useTransition();
  const pending = actionPending || isUploading;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploadError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.delete("image");

    startUploading(async () => {
      try {
        if (file && file.size > 0) {
          const name = (fd.get("name") as string) || category?.name || "category";
          const slug = category?.slug || slugifyClient(name);
          const path = `categories/${slug}-${Date.now()}.${file.name.split(".").pop()?.toLowerCase() || "jpg"}`;
          const url = await uploadFileClient("product-images", path, file);
          fd.set("image_url", url);
        }
        formAction(fd);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      }
    });
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
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
            <Input name="image" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>

          {(state.error || uploadError) && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {uploadError || state.error}
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
