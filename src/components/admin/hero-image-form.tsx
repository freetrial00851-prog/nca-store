"use client";

import { useActionState } from "react";
import { updateHeroImage, type UpdateHeroImageState } from "@/app/actions/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HERO_IMAGE } from "@/lib/data/product-images";
import Image from "next/image";

const initialState: UpdateHeroImageState = {};

export function HeroImageForm({ initialHeroImageUrl }: { initialHeroImageUrl: string }) {
  const [state, formAction, pending] = useActionState(updateHeroImage, initialState);
  const isDefault = initialHeroImageUrl === HERO_IMAGE;

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

          <form action={formAction} encType="multipart/form-data" className="flex-1 space-y-3">
            <label className="text-sm font-medium block">Upload new image</label>
            <Input name="hero_image" type="file" accept="image/*" required />
            <p className="text-xs text-muted-foreground">
              Square images work best (e.g. 800×800px). JPG, PNG, or WebP.
            </p>

            {state.error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {state.error}
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
