import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import type { Book } from "../types";
import { StarRating } from "./StarRating";

interface BookCardProps {
  book: Book;
  index?: number;
  className?: string;
}

export function BookCard({ book, index = 0, className }: BookCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(book.id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: book.id,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      price: book.price,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(book.id);
  };

  return (
    <Link
      to="/books/$bookId"
      params={{ bookId: book.id }}
      data-ocid={`book.item.${index}`}
      className={cn(
        "group flex flex-col gap-0 rounded-xl overflow-hidden bg-card border border-border/50 hover-lift shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        <img
          src={book.coverUrl}
          alt={`${book.title} cover`}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          loading="lazy"
        />
        {!book.inStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <Badge variant="secondary" className="text-xs font-medium">
              Out of Stock
            </Badge>
          </div>
        )}
        {/* Wishlist button */}
        <button
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          data-ocid={`book.wishlist_toggle.${index}`}
          onClick={handleWishlist}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-full shadow-subtle transition-smooth",
            isWishlisted
              ? "bg-primary text-primary-foreground"
              : "bg-card/80 text-muted-foreground hover:bg-card hover:text-primary",
          )}
        >
          <Heart
            className={cn("h-3.5 w-3.5", isWishlisted && "fill-current")}
          />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <p className="text-xs text-muted-foreground truncate">{book.genre}</p>
        <h3 className="font-display text-sm font-semibold leading-snug line-clamp-2 text-foreground min-w-0">
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <StarRating rating={book.rating} size="sm" />
          <span className="text-xs text-muted-foreground">
            ({Number(book.reviewCount).toLocaleString()})
          </span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-sm font-bold text-primary font-body">
            ${book.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            variant="outline"
            data-ocid={`book.add_to_cart.${index}`}
            onClick={handleAddToCart}
            disabled={!book.inStock}
            className="h-7 px-2.5 text-xs gap-1 transition-smooth hover:bg-primary hover:text-primary-foreground hover:border-primary"
          >
            <ShoppingCart className="h-3 w-3" />
            Add
          </Button>
        </div>
      </div>
    </Link>
  );
}
