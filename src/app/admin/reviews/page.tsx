import { getAdminReviews } from "@/app/actions/admin";
import { DeleteReviewButton } from "@/components/admin/delete-review-button";
import { formatDate } from "@/lib/utils";

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                <th className="p-4">Product</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Comment</th>
                <th className="p-4">Author</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium">{review.productTitle}</td>
                  <td className="p-4">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</td>
                  <td className="p-4 text-muted-foreground max-w-xs truncate">{review.comment ?? "—"}</td>
                  <td className="p-4 text-muted-foreground">{review.authorName}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(review.created_at)}</td>
                  <td className="p-4">
                    <DeleteReviewButton reviewId={review.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
