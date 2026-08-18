/** Placeholder product & category images matching NCA design aesthetic */
export const PRODUCT_IMAGES: Record<string, string> = {
  "baby-bunny-lovey": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
  "granny-square-tote": "https://images.unsplash.com/photo-1590874103328-eac03a2e6160?w=600&h=600&fit=crop",
  "daisy-bucket-hat": "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop",
  "cozy-cardigan": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop",
  "sunflower-coaster-set": "https://images.unsplash.com/photo-1582794543139-688e9a4a0046?w=600&h=600&fit=crop",
  "teddy-bear-amigurumi": "https://images.unsplash.com/photo-1530124566582-538259176050?w=600&h=600&fit=crop",
};

export const CATEGORY_IMAGES: Record<string, string> = {
  amigurumi: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
  wearables: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop",
  "bags-totes": "https://images.unsplash.com/photo-1590874103328-eac03a2e6160?w=200&h=200&fit=crop",
  "home-decor": "https://images.unsplash.com/photo-1582794543139-688e9a4a0046?w=200&h=200&fit=crop",
  "baby-kids": "https://images.unsplash.com/photo-1515488042361-ee00e0170bb8?w=200&h=200&fit=crop",
  seasonal: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=200&h=200&fit=crop",
};

export const HERO_IMAGE = "https://images.unsplash.com/photo-1593693395680-d8974b4d8f26?w=800&h=800&fit=crop";
export const NEWSLETTER_IMAGE = "https://images.unsplash.com/photo-1593693395680-d8974b4d8f26?w=400&h=300&fit=crop";

export function getProductImage(slug: string): string {
  return PRODUCT_IMAGES[slug] ?? "https://images.unsplash.com/photo-1593693395680-d8974b4d8f26?w=600&h=600&fit=crop";
}

export function getCategoryImage(slug: string): string {
  return CATEGORY_IMAGES[slug] ?? "https://images.unsplash.com/photo-1593693395680-d8974b4d8f26?w=200&h=200&fit=crop";
}
