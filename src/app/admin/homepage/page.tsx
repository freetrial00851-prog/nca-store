import { getSiteSetting } from "@/app/actions/site-settings";
import { HeroImageForm } from "@/components/admin/hero-image-form";
import { HERO_IMAGE } from "@/lib/data/product-images";

export default async function AdminHomepagePage() {
  const heroImageUrl = (await getSiteSetting("hero_image_url")) ?? HERO_IMAGE;

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-2">Homepage</h1>
      <p className="text-muted-foreground mb-8">
        Manage content shown on your storefront&apos;s homepage.
      </p>

      <HeroImageForm initialHeroImageUrl={heroImageUrl} />
    </div>
  );
}
