import Link from "next/link";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { StarRating } from "@/components/ui/star-rating";
import { ProductImage } from "@/components/products/product-image";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { MOCK_REVIEWS } from "@/lib/data/mock-account";
import { MOCK_PRODUCTS } from "@/lib/data/mock-data";

export default function ReviewsPage() {
  const myReviews = MOCK_REVIEWS.filter((r) => r.user_id === "demo-user").map((review) => ({
    review,
    product: MOCK_PRODUCTS.find((p) => p.id === review.product_id)!,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account" },
          { label: "Reviews" },
        ]}
        className="mb-6"
      />
      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <h1 className="font-serif text-3xl font-bold mb-6">My Reviews</h1>
          {myReviews.length === 0 ? (
            <p className="text-muted-foreground">You haven&apos;t written any reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {myReviews.map(({ product, review }) => (
                <div key={review.id} className="flex gap-4 bg-white rounded-xl border border-border p-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                    <ProductImage slug={product.slug} alt={product.title} sizes="64px" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${product.slug}`} className="font-medium hover:text-nca-green">
                      {product.title}
                    </Link>
                    <StarRating rating={review.rating} className="my-1" />
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(review.created_at)}</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
