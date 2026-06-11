import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

const sizeMap = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating({
  rating,
  maxStars = 5,
  size = "sm",
  interactive = false,
  onRate,
  className,
}: StarRatingProps) {
  const iconSize = sizeMap[size];

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role={interactive ? "radiogroup" : undefined}
      aria-label={`Rating: ${rating} out of ${maxStars}`}
    >
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        const val = i + 1;
        return (
          <button
            key={val}
            type="button"
            role={interactive ? "radio" : undefined}
            aria-checked={interactive ? i < rating : undefined}
            aria-label={
              interactive ? `${val} star${val !== 1 ? "s" : ""}` : undefined
            }
            onClick={interactive && onRate ? () => onRate(val) : undefined}
            className={cn(
              "relative",
              interactive
                ? "cursor-pointer hover:scale-110 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                : "cursor-default pointer-events-none",
            )}
            tabIndex={interactive ? 0 : -1}
          >
            <Star
              className={cn(
                iconSize,
                filled
                  ? "fill-primary text-primary"
                  : partial
                    ? "fill-primary/40 text-primary/40"
                    : "fill-muted text-muted-foreground/30",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
