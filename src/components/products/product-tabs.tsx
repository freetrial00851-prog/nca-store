"use client";

import { useState } from "react";
import type { Product } from "@/types/database";
import { StarRating } from "@/components/ui/star-rating";
import { getMockReviewsForProduct } from "@/lib/data/mock-account";
import { formatDate } from "@/lib/utils";

const tabs = [
  { id: "description", label: "Description" },
  { id: "included", label: "What's Included" },
  { id: "materials", label: "Materials" },
  { id: "skill", label: "Skill Level" },
  { id: "size", label: "Size" },
  { id: "tags", label: "Tags" },
  { id: "reviews", label: "Reviews" },
] as const;

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<string>("description");
  const reviews = getMockReviewsForProduct(product.id);

  return (
    <div className="bg-white rounded-xl border border-border">
      <div className="flex overflow-x-auto border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-3 text-xs font-medium uppercase tracking-wide whitespace-nowrap transition-colors ${
              active === tab.id
                ? "text-nca-green border-b-2 border-nca-green"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.id === "reviews" && product.review_count ? ` (${product.review_count})` : ""}
          </button>
        ))}
      </div>

      <div className="p-6">
        {active === "description" && (
          <div className="prose prose-sm max-w-none">
            <h3 className="font-serif text-lg font-bold mb-3">Pattern Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
        )}
        {active === "included" && <p className="text-muted-foreground">{product.whats_included}</p>}
        {active === "materials" && <p className="text-muted-foreground">{product.materials}</p>}
        {active === "skill" && (
          <p className="text-muted-foreground">
            This pattern is rated <strong>{product.skill_level}</strong>.
          </p>
        )}
        {active === "size" && <p className="text-muted-foreground">{product.size_info}</p>}
        {active === "tags" && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-nca-sage text-nca-green text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
        {active === "reviews" && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-serif text-4xl font-bold">{product.average_rating?.toFixed(1)}</span>
              <div>
                <StarRating rating={product.average_rating ?? 0} size="sm" />
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {product.review_count} reviews
                </p>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this pattern!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{review.profile?.full_name ?? "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
                    </div>
                    <StarRating rating={review.rating} size="sm" className="mb-2" />
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
