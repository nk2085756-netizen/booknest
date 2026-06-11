import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Link, createRoute, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  Heart,
  Home,
  Send,
  ShoppingCart,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { BookCard } from "../components/BookCard";
import { Layout } from "../components/Layout";
import { SkeletonBookDetail } from "../components/SkeletonCard";
import { StarRating } from "../components/StarRating";
import { MOCK_BOOKS } from "../data/mockBooks";
import {
  useAddReview,
  useAllBooks,
  useBookById,
  useReviews,
} from "../hooks/useBookNest";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import type { Review } from "../types";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books/$bookId",
  component: BookDetailPage,
});

// --- Sub-components ---

function Breadcrumb({
  genre,
  title,
}: {
  genre: string;
  title: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap"
    >
      <Link
        to="/"
        data-ocid="book_detail.breadcrumb_home"
        className="flex items-center gap-1 hover:text-foreground transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        <Home className="h-3.5 w-3.5" />
        Home
      </Link>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
      <Link
        to="/books"
        search={{ genre }}
        data-ocid="book_detail.breadcrumb_genre"
        className="hover:text-foreground transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded truncate max-w-[120px] sm:max-w-none"
      >
        {genre}
      </Link>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
      <span
        className="text-foreground font-medium truncate max-w-[160px] sm:max-w-xs"
        aria-current="page"
      >
        {title}
      </span>
    </nav>
  );
}

function DescriptionSection({ text }: { text: string }) {
  const CLAMP = 300;
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > CLAMP;
  const displayed = isLong && !expanded ? `${text.slice(0, CLAMP)}…` : text;

  return (
    <div data-ocid="book_detail.description_section">
      <h2 className="font-display text-lg font-semibold text-foreground mb-2">
        Synopsis
      </h2>
      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
        {displayed}
      </p>
      {isLong && (
        <button
          type="button"
          data-ocid="book_detail.description_toggle"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-medium text-primary hover:text-primary/80 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const date = new Date(Number(review.createdAt) / 1_000_000);
  const formatted = Number.isNaN(date.getTime())
    ? "Recently"
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      data-ocid={`book_detail.review.${index + 1}`}
      className="bg-card border border-border/50 rounded-xl p-5 shadow-subtle"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-primary font-display">
              {review.reviewerName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {review.reviewerName}
            </p>
            <StarRating rating={review.rating} size="sm" className="mt-0.5" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground shrink-0 mt-1">
          {formatted}
        </p>
      </div>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed pl-12">
        {review.comment}
      </p>
    </motion.div>
  );
}

function AddReviewForm({ bookId }: { bookId: string }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const addReview = useAddReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || rating === 0 || !comment.trim()) {
      toast.error("Please fill in all fields and select a rating.");
      return;
    }
    try {
      await addReview.mutateAsync({
        bookId,
        reviewerName: name,
        rating,
        comment,
      });
      toast.success("Your review has been posted!");
      setName("");
      setRating(0);
      setComment("");
      setSubmitted(true);
    } catch {
      toast.error("Couldn't post your review. Please try again.");
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        data-ocid="book_detail.review_form.success_state"
        className="flex flex-col items-center gap-3 py-8 bg-accent/5 border border-accent/20 rounded-xl text-center"
      >
        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Star className="h-6 w-6 text-accent fill-accent" />
        </div>
        <p className="font-display font-semibold text-foreground">
          Thank you for your review!
        </p>
        <p className="text-sm text-muted-foreground">
          Your feedback helps other readers discover great books.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-sm text-primary hover:text-primary/80 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Write another review
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-ocid="book_detail.add_review_form"
      className="space-y-4 bg-card border border-border/50 rounded-xl p-5 shadow-subtle"
    >
      <h3 className="font-display text-base font-semibold text-foreground">
        Write a Review
      </h3>
      <div className="space-y-1.5">
        <Label htmlFor="reviewer-name" className="text-sm font-medium">
          Your Name
        </Label>
        <Input
          id="reviewer-name"
          data-ocid="book_detail.review_name_input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sarah M."
          required
          className="bg-background"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Your Rating</Label>
        <div className="flex items-center gap-2">
          <StarRating
            rating={rating}
            size="lg"
            interactive
            onRate={setRating}
            data-ocid="book_detail.review_star_picker"
          />
          {rating > 0 && (
            <span className="text-sm text-muted-foreground">
              {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
            </span>
          )}
        </div>
        {rating === 0 && (
          <p
            className="text-xs text-muted-foreground/70"
            data-ocid="book_detail.review_rating_hint"
          >
            Click stars to rate
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="review-comment" className="text-sm font-medium">
          Your Review
        </Label>
        <Textarea
          id="review-comment"
          data-ocid="book_detail.review_comment_textarea"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think of this book?"
          rows={4}
          required
          className="bg-background resize-none"
        />
      </div>
      <Button
        type="submit"
        data-ocid="book_detail.review_submit_button"
        disabled={addReview.isPending}
        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
      >
        {addReview.isPending ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            Posting…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Post Review
          </>
        )}
      </Button>
    </form>
  );
}

function RelatedBooks({
  currentId,
  genre,
}: {
  currentId: string;
  genre: string;
}) {
  const { data: allBooks } = useAllBooks();
  const books = (allBooks ?? MOCK_BOOKS)
    .filter((b) => b.genre === genre && b.id !== currentId)
    .slice(0, 4);

  if (books.length === 0) return null;

  return (
    <section className="mt-14" data-ocid="book_detail.related_books_section">
      <Separator className="bg-border/40 mb-8" />
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
        More in {genre}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {books.map((book, i) => (
          <BookCard key={book.id} book={book} index={i + 1} />
        ))}
      </div>
    </section>
  );
}

// --- Page ---

function NotFoundState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      data-ocid="book_detail.not_found"
      className="flex flex-col items-center text-center py-24 gap-5"
    >
      <div className="relative">
        <div className="text-8xl select-none">📚</div>
        <div className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <span className="text-destructive text-xs font-bold">?</span>
        </div>
      </div>
      <div className="space-y-2 max-w-sm">
        <h2 className="font-display text-3xl font-bold text-foreground">
          Book Not Found
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We couldn't find this book in our collection. It may have been removed
          or the link might be incorrect.
        </p>
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        <Button asChild data-ocid="book_detail.browse_books_button">
          <Link to="/books">Browse All Books</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          data-ocid="book_detail.go_home_button"
        >
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </motion.div>
  );
}

function BookDetailPage() {
  const { bookId } = Route.useParams();
  const navigate = useNavigate();
  const { data: book, isLoading } = useBookById(bookId);
  const { data: reviews, isLoading: reviewsLoading } = useReviews(bookId);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(bookId));

  const displayBook = book ?? MOCK_BOOKS.find((b) => b.id === bookId) ?? null;

  const handleAddToCart = () => {
    if (!displayBook) return;
    addItem({
      id: displayBook.id,
      title: displayBook.title,
      author: displayBook.author,
      coverUrl: displayBook.coverUrl,
      price: displayBook.price,
    });
    toast.success(`"${displayBook.title}" added to cart`);
  };

  const handleWishlist = () => {
    if (!displayBook) return;
    toggleWishlist(bookId);
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist ♥",
    );
  };

  const handleAuthorFilter = () => {
    if (!displayBook) return;
    void navigate({ to: "/books", search: { q: displayBook.author } });
  };

  return (
    <Layout>
      {/* Breadcrumb bar */}
      <div className="bg-card border-b border-border/60 py-3.5">
        <div className="container">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : displayBook ? (
            <Breadcrumb genre={displayBook.genre} title={displayBook.title} />
          ) : (
            <Breadcrumb genre="Books" title="Not Found" />
          )}
        </div>
      </div>

      <div className="bg-background py-10 flex-1">
        <div className="container max-w-5xl">
          {isLoading && !displayBook ? (
            <SkeletonBookDetail />
          ) : !displayBook ? (
            <NotFoundState />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Main Two-column Layout */}
              <div className="grid md:grid-cols-[320px_1fr] gap-8 md:gap-14">
                {/* Left: Cover */}
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, delay: 0.05 }}
                  className="space-y-4"
                >
                  <div
                    className="rounded-2xl overflow-hidden shadow-elevated aspect-[2/3] max-w-[320px] mx-auto md:mx-0 ring-1 ring-border/30"
                    data-ocid="book_detail.cover_image"
                  >
                    <img
                      src={displayBook.coverUrl}
                      alt={`${displayBook.title} cover`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 max-w-[320px] mx-auto md:mx-0">
                    <Button
                      data-ocid="book_detail.add_to_cart_button"
                      onClick={handleAddToCart}
                      disabled={!displayBook.inStock}
                      className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {displayBook.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      data-ocid="book_detail.wishlist_button"
                      onClick={handleWishlist}
                      aria-label={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      className={cn(
                        "transition-smooth shrink-0",
                        isWishlisted
                          ? "border-primary text-primary bg-primary/5"
                          : "hover:border-primary hover:text-primary",
                      )}
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4",
                          isWishlisted ? "fill-current" : "",
                        )}
                      />
                    </Button>
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="max-w-[320px] mx-auto md:mx-0">
                          <Button
                            variant="outline"
                            disabled
                            data-ocid="book_detail.read_sample_button"
                            className="w-full gap-2 opacity-60 cursor-not-allowed"
                          >
                            <BookOpen className="h-4 w-4" />
                            Read Sample
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="text-xs">Sample reading coming soon</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>

                {/* Right: Info */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                  className="space-y-5"
                >
                  {/* Genre badge + title + author */}
                  <div>
                    <Link
                      to="/books"
                      search={{ genre: displayBook.genre }}
                      data-ocid="book_detail.genre_badge"
                    >
                      <Badge
                        variant="secondary"
                        className="mb-3 text-xs cursor-pointer hover:bg-primary/10 hover:text-primary transition-smooth"
                      >
                        {displayBook.genre}
                      </Badge>
                    </Link>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
                      {displayBook.title}
                    </h1>
                    <button
                      type="button"
                      onClick={handleAuthorFilter}
                      data-ocid="book_detail.author_link"
                      className="text-muted-foreground text-base mt-1.5 hover:text-primary transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded inline-block"
                    >
                      by{" "}
                      <span className="underline underline-offset-2 decoration-dotted">
                        {displayBook.author}
                      </span>
                    </button>
                  </div>

                  {/* Rating */}
                  <div
                    className="flex items-center gap-3 flex-wrap"
                    data-ocid="book_detail.rating_row"
                  >
                    <StarRating rating={displayBook.rating} size="md" />
                    <span className="text-sm font-bold text-foreground">
                      {displayBook.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({Number(displayBook.reviewCount).toLocaleString()}{" "}
                      reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-display text-4xl font-bold text-primary"
                      data-ocid="book_detail.price"
                    >
                      ${displayBook.price.toFixed(2)}
                    </span>
                    {!displayBook.inStock && (
                      <Badge
                        variant="secondary"
                        className="text-xs text-destructive border-destructive/20 bg-destructive/10"
                      >
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  <Separator className="bg-border/40" />

                  {/* Meta grid */}
                  <div className="grid grid-cols-3 gap-4 bg-muted/40 rounded-xl p-4 border border-border/30">
                    {[
                      {
                        label: "Published",
                        value: String(Number(displayBook.publishYear)),
                      },
                      { label: "ISBN", value: displayBook.isbn },
                      { label: "Genre", value: displayBook.genre },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs text-muted-foreground mb-0.5">
                          {label}
                        </p>
                        <p className="text-sm font-medium text-foreground truncate">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Synopsis */}
                  <DescriptionSection text={displayBook.description} />
                </motion.div>
              </div>

              {/* Reviews Section */}
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-14"
                data-ocid="book_detail.reviews_section"
              >
                <Separator className="bg-border/40 mb-8" />
                <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
                  {/* Reviews list */}
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      Reader Reviews
                      {reviews && reviews.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium"
                        >
                          {reviews.length}
                        </Badge>
                      )}
                    </h2>

                    {reviewsLoading ? (
                      <div
                        className="space-y-4"
                        data-ocid="book_detail.reviews.loading_state"
                      >
                        {[1, 2, 3].map((n) => (
                          <div
                            key={n}
                            className="bg-card border border-border/40 rounded-xl p-5 space-y-3"
                          >
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-9 w-9 rounded-full" />
                              <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                              </div>
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                          </div>
                        ))}
                      </div>
                    ) : !reviews || reviews.length === 0 ? (
                      <div
                        data-ocid="book_detail.reviews.empty_state"
                        className="flex flex-col items-center text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border/50 gap-3"
                      >
                        <Star className="h-10 w-10 text-muted-foreground/30" />
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            No reviews yet
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Be the first to share your thoughts on this book!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((r, i) => (
                          <ReviewCard
                            key={`${r.reviewerName}-${String(r.createdAt)}`}
                            review={r}
                            index={i}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add review form */}
                  <div className="lg:sticky lg:top-24">
                    <AddReviewForm bookId={bookId} />
                  </div>
                </div>
              </motion.section>

              {/* Related books */}
              <RelatedBooks
                currentId={displayBook.id}
                genre={displayBook.genre}
              />
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
