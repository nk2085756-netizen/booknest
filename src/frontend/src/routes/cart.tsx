import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, createRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Layout } from "../components/Layout";
import { useCartStore } from "../store/cartStore";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const TAX_RATE = 0.08;

function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const navigate = useNavigate();

  const subtotal = totalPrice;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <Layout>
      <div className="bg-card border-b border-border/60 py-8">
        <div className="container">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
              </h1>
              {items.length > 0 && (
                <p className="text-muted-foreground text-xs mt-0.5">
                  Review your selections before checkout
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background py-8 flex-1">
        <div className="container">
          <AnimatePresence mode="wait">
            {items.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                data-ocid="cart.empty_state"
                className="text-center py-24 space-y-5"
              >
                <div className="w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center mx-auto">
                  <BookOpen className="h-9 w-9 text-muted-foreground/40" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-semibold text-foreground">
                    Your cart is empty
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Discover thousands of books — add the ones you love to your
                    cart.
                  </p>
                </div>
                <Button
                  asChild
                  data-ocid="cart.browse_button"
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth gap-2 shadow-elevated mt-2"
                >
                  <Link to="/books">
                    <BookOpen className="h-4 w-4" />
                    Browse Books
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="cart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="grid lg:grid-cols-[1fr_340px] gap-8"
              >
                {/* Item list */}
                <div className="space-y-3" data-ocid="cart.items_list">
                  <AnimatePresence initial={false}>
                    {items.map((item, i) => (
                      <motion.div
                        key={item.bookId}
                        layout
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        data-ocid={`cart.item.${i + 1}`}
                        className="bg-card border border-border/50 rounded-xl p-4 shadow-subtle flex gap-4"
                      >
                        <Link
                          to="/books/$bookId"
                          params={{ bookId: item.bookId }}
                          className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                        >
                          <img
                            src={item.coverUrl}
                            alt={item.title}
                            className="w-14 h-20 object-cover rounded-lg shadow-subtle transition-smooth hover:opacity-80"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            to="/books/$bookId"
                            params={{ bookId: item.bookId }}
                            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                          >
                            <h3 className="font-display text-sm font-semibold text-foreground line-clamp-2 hover:text-primary transition-smooth">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.author}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-sm font-bold text-primary">
                              ${item.price.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Subtotal:{" "}
                              <span className="font-semibold text-foreground">
                                ${(item.price * item.qty).toFixed(2)}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between shrink-0 gap-3">
                          <button
                            type="button"
                            data-ocid={`cart.remove_button.${i + 1}`}
                            onClick={() => removeItem(item.bookId)}
                            aria-label={`Remove ${item.title} from cart`}
                            className="p-1.5 text-muted-foreground hover:text-destructive transition-smooth rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          <div className="flex items-center gap-1.5 bg-muted/40 rounded-lg px-1 py-1">
                            <button
                              type="button"
                              data-ocid={`cart.decrease_qty.${i + 1}`}
                              onClick={() =>
                                updateQty(item.bookId, item.qty - 1)
                              }
                              aria-label="Decrease quantity"
                              className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-semibold w-6 text-center text-foreground">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              data-ocid={`cart.increase_qty.${i + 1}`}
                              onClick={() =>
                                updateQty(item.bookId, item.qty + 1)
                              }
                              aria-label="Increase quantity"
                              className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <div className="pt-2">
                    <Link
                      to="/books"
                      data-ocid="cart.continue_shopping_link"
                      className="text-sm text-primary hover:text-primary/80 transition-smooth flex items-center gap-1.5 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      ← Continue Shopping
                    </Link>
                  </div>
                </div>

                {/* Order summary */}
                <div className="lg:sticky lg:top-20 h-fit">
                  <div
                    className="bg-card border border-border/50 rounded-xl p-5 shadow-subtle"
                    data-ocid="cart.summary"
                  >
                    <h2 className="font-display text-lg font-bold text-foreground mb-4">
                      Order Summary
                    </h2>
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Subtotal ({itemCount}{" "}
                          {itemCount === 1 ? "item" : "items"})
                        </span>
                        <span className="text-foreground font-medium">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Estimated Tax (8%)
                        </span>
                        <span className="text-foreground font-medium">
                          ${tax.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-accent font-semibold">Free</span>
                      </div>
                    </div>

                    <Separator className="my-4 bg-border/40" />

                    <div className="flex justify-between font-bold text-foreground text-base">
                      <span>Total</span>
                      <span className="text-primary text-lg">
                        ${total.toFixed(2)}
                      </span>
                    </div>

                    <Button
                      data-ocid="cart.checkout_button"
                      onClick={() => void navigate({ to: "/checkout" })}
                      className="w-full mt-5 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth gap-2 shadow-elevated"
                      size="lg"
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Button>

                    <div className="mt-4 pt-4 border-t border-border/30 space-y-1.5">
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="text-accent">✓</span>
                        Free shipping on all orders
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="text-accent">✓</span>
                        Secure checkout with encryption
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="text-accent">✓</span>
                        30-day return policy
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
