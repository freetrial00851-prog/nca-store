"use client";

import { useActionState, useState, useTransition } from "react";
import { updateHeroImage, type UpdateHeroImageState } from "@/app/actions/admin";
import { uploadFileClient } from "@/lib/admin-upload-client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HERO_IMAGE } from "@/lib/data/product-images";
import Image from "next/image";

const initialState: UpdateHeroImageState = {};

export function HeroImageForm({ initialHeroImageUrl }: { initialHeroImageUrl: string }) {
  const [state, formAction, actionPending] = useActionState(updateHeroImage, initialState);
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, startUploading] = useTransition();
  const isDefault = initialHeroImageUrl === HERO_IMAGE;
  const pending = actionPending || isUploading;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setUploadError("Please choose an image to upload.");
      return;
    }
    setUploadError(null);
    startUploading(async () => {
      try {
        const path = `site/hero-${Date.now()}.${file.name.split(".").pop()?.toLowerCase() || "jpg"}`;
        const url = await uploadFileClient("product-images", path, file);
        const fd = new FormData();
        fd.set("hero_image_url", url);
        formAction(fd);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      }
    });
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-semibold mb-1">Hero Image</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The circular photo shown on the homepage hero section.
          {isDefault && " Currently using a placeholder stock photo — upload your own to replace it."}
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0">
            <Image src={initialHeroImageUrl} alt="Current hero image" fill className="object-cover" unoptimized />
          </div>

          <form onSubmit={handleSubmit} className="flex-1 space-y-3">
            <label className="text-sm font-medium block">Upload new image</label>
            <Input
              name="hero_image"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">
              Square images work best (e.g. 800×800px). JPG, PNG, or WebP.
            </p>

            {(state.error || uploadError) && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {uploadError || state.error}
              </p>
            )}
            {state.success && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                Hero image updated — refresh the homepage to see it live.
              </p>
            )}

            <Button type="submit" disabled={pending}>
              {pending ? "Uploading..." : "Update Hero Image"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
