import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, createRoute } from "@tanstack/react-router";
import { BookOpen, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { BookCard } from "../components/BookCard";
import { Layout } from "../components/Layout";
import { MOCK_BOOKS } from "../data/mockBooks";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../hooks/useBookNest";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wishlist",
  component: WishlistPage,
});

function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const wishlistIds = useWishlistStore((s) => s.bookIds);
  const removeFromWishlist = useWishlistStore((s) => s.toggleWishlist);
  const addItem = useCartStore((s) => s.addItem);
  const { data: backendWishlist, isLoading } = useWishlist();

  const wishlisted = backendWishlist?.length
    ? backendWishlist
    : MOCK_BOOKS.filter((b) => wishlistIds.has(b.id));

  const handleAddAllToCart = () => {
    for (const book of wishlisted) {
      if (book.inStock) {
        addItem({
          id: book.id,
          title: book.title,
          author: book.author,
          coverUrl: book.coverUrl,
          price: book.price,
        });
      }
    }
  };

  return (
    <Layout>
      {/* Page header */}
      <div className="bg-card border-b border-border/60">
        <div className="container py-8 md:py-10">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  My Wishlist
                </h1>
              </div>
              <p className="text-muted-foreground text-sm mt-1 pl-12">
                {isLoading ? (
                  <Skeleton className="h-4 w-24 inline-block" />
                ) : (
                  <>
                    {wishlisted.length} book{wishlisted.length !== 1 ? "s" : ""}{" "}
                    saved
                  </>
                )}
              </p>
            </div>
            {wishlisted.length > 0 && (
              <Button
                data-ocid="wishlist.add_all_to_cart"
                onClick={handleAddAllToCart}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth gap-2 shadow-subtle"
              >
                <ShoppingCart className="h-4 w-4" />
                Add All to Cart
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-background py-8 flex-1">
        <div className="container">
          {isLoading ? (
            <div
              data-ocid="wishlist.loading_state"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="space-y-3">
                  <Skeleton className="aspect-[2/3] rounded-xl w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : !isAuthenticated && wishlisted.length === 0 ? (
            /* Not logged in empty state */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              data-ocid="wishlist.login_prompt"
              className="text-center py-24 max-w-sm mx-auto space-y-5"
            >
              <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                <Heart className="h-9 w-9 text-primary/60" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-semibold text-foreground">
                  Sign in to save books
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Create a free account to save your favorite books and access
                  them anytime.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  asChild
                  data-ocid="wishlist.login_button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
                >
                  <Link to="/account">Sign In to BookNest</Link>
                </Button>
                <Button asChild variant="outline" className="transition-smooth">
                  <Link to="/books" data-ocid="wishlist.browse_button">
                    Browse Books
                  </Link>
                </Button>
              </div>
            </motion.div>
          ) : wishlisted.length === 0 ? (
            /* Authenticated empty state */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              data-ocid="wishlist.empty_state"
              className="text-center py-24 max-w-sm mx-auto space-y-5"
            >
              <div className="relative mx-auto w-24 h-24">
                <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center">
                  <Heart className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-xl bg-primary/10 border-2 border-background flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-semibold text-foreground">
                  Your wishlist is empty
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Save books you love by clicking the heart icon on any book
                  card.
                </p>
              </div>
              <Button
                asChild
                data-ocid="wishlist.browse_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
              >
                <Link to="/books">Browse Books</Link>
              </Button>
            </motion.div>
          ) : (
            /* Wishlist grid */
            <div className="space-y-5">
              <div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
                data-ocid="wishlist.grid"
              >
                {wishlisted.map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                    className="relative group"
                    data-ocid={`wishlist.item.${i + 1}`}
                  >
                    <BookCard book={book} index={i + 1} />
                    <button
                      type="button"
                      aria-label={`Remove ${book.title} from wishlist`}
                      data-ocid={`wishlist.remove.${i + 1}`}
                      onClick={() => removeFromWishlist(book.id)}
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-smooth p-1.5 rounded-full bg-destructive/90 text-destructive-foreground shadow-subtle z-10 hover:bg-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Footer action */}
              {wishlisted.length >= 3 && (
                <div className="flex justify-center pt-4 border-t border-border/40">
                  <Button
                    data-ocid="wishlist.add_all_to_cart_bottom"
                    onClick={handleAddAllToCart}
                    variant="outline"
                    className="transition-smooth gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add All to Cart (
                    {wishlisted.filter((b) => b.inStock).length} in stock)
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
