import { getSiteSetting } from "@/app/actions/site-settings";
import { updateHeroImage } from "@/app/actions/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HERO_IMAGE } from "@/lib/data/product-images";
import Image from "next/image";

export default async function AdminHomepagePage() {
  const heroImageUrl = (await getSiteSetting("hero_image_url")) ?? HERO_IMAGE;
  const isDefault = heroImageUrl === HERO_IMAGE;

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-2">Homepage</h1>
      <p className="text-muted-foreground mb-8">
        Manage content shown on your storefront&apos;s homepage.
      </p>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold mb-1">Hero Image</h2>
          <p className="text-sm text-muted-foreground mb-4">
            The circular photo shown on the homepage hero section.
            {isDefault && " Currently using a placeholder stock photo — upload your own to replace it."}
          </p>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0">
              <Image src={heroImageUrl} alt="Current hero image" fill className="object-cover" unoptimized />
            </div>

            <form action={updateHeroImage} encType="multipart/form-data" className="flex-1 space-y-3">
              <label className="text-sm font-medium block">Upload new image</label>
              <Input name="hero_image" type="file" accept="image/*" required />
              <p className="text-xs text-muted-foreground">
                Square images work best (e.g. 800×800px). JPG, PNG, or WebP.
              </p>
              <Button type="submit">Update Hero Image</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
