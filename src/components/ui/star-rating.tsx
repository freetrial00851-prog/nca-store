import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "sm",
  showValue = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              i < Math.floor(rating)
                ? "fill-nca-gold text-nca-gold"
                : i < rating
                ? "fill-nca-gold/50 text-nca-gold"
                : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground">
          {rating.toFixed(1)}
          {reviewCount !== undefined && ` (${reviewCount} reviews)`}
        </span>
      )}
    </div>
  );
}
