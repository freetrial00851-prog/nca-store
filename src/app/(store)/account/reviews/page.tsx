import Link from "next/link";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { StarRating } from "@/components/ui/star-rating";
import { ProductImage } from "@/components/products/product-image";
import { formatDate } from "@/lib/utils";
import { getUserReviews } from "@/app/actions/reviews";

export default async function ReviewsPage() {
  const myReviews = await getUserReviews();

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
              {myReviews.map(({ product, rating, comment, created_at, id }) => (
                <div key={id} className="flex gap-4 bg-white rounded-xl border border-border p-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                    <ProductImage slug={product.slug} alt={product.title} sizes="64px" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${product.slug}`} className="font-medium hover:text-nca-green">
                      {product.title}
                    </Link>
                    <StarRating rating={rating} className="my-1" />
                    <p className="text-sm text-muted-foreground">{comment}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
