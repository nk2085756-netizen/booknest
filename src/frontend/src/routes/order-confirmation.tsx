import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, createRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Package,
  ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "../components/Layout";
import { useCartStore } from "../store/cartStore";
import type { CartItem } from "../types";
import { Route as rootRoute } from "./__root";

interface OrderConfirmationSearch {
  orderId?: string;
  customerName?: string;
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-confirmation",
  validateSearch: (s: Record<string, unknown>): OrderConfirmationSearch => ({
    orderId: typeof s.orderId === "string" ? s.orderId : undefined,
    customerName:
      typeof s.customerName === "string" ? s.customerName : undefined,
  }),
  component: OrderConfirmationPage,
});

function useOrderSnapshot(liveItems: CartItem[], clearCart: () => void) {
  const snapshotRef = useRef<CartItem[] | null>(null);
  const [snapshot, setSnapshot] = useState<CartItem[]>([]);

  useEffect(() => {
    if (snapshotRef.current !== null) return;
    snapshotRef.current = liveItems;
    setSnapshot(liveItems);
    if (liveItems.length > 0) clearCart();
  }, [liveItems, clearCart]);

  return snapshot;
}

function OrderConfirmationPage() {
  const { orderId, customerName } = Route.useSearch();
  const liveItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const items = useOrderSnapshot(liveItems, clearCart);

  const displayOrderId = orderId
    ? orderId.startsWith("#")
      ? orderId
      : `#${orderId}`
    : `#BN-${String(Math.floor(10000 + Math.random() * 90000))}`;

  const firstName = customerName ? customerName.split(" ")[0] : null;

  const deliveryFrom = new Date();
  deliveryFrom.setDate(deliveryFrom.getDate() + 3);
  const deliveryTo = new Date();
  deliveryTo.setDate(deliveryTo.getDate() + 5);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const itemsTotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const grandTotal = itemsTotal * 1.08;

  return (
    <Layout>
      <div className="flex-1 bg-background">
        {/* Success banner */}
        <div className="bg-accent/8 border-b border-accent/15 py-12">
          <div className="container max-w-2xl text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
                delay: 0.1,
              }}
              className="w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-5"
              data-ocid="order_confirmation.success_icon"
            >
              <CheckCircle
                className="h-10 w-10 text-accent"
                strokeWidth={1.8}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="space-y-2"
            >
              <h1 className="font-display text-3xl font-bold text-foreground">
                {firstName ? `Thank you, ${firstName}!` : "Order Confirmed!"}
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                Your order has been placed successfully. You'll receive a
                confirmation email shortly.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container max-w-2xl py-8 space-y-6">
          {/* Order metadata */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.35 }}
            className="bg-card border border-border/50 rounded-xl p-5 shadow-subtle"
            data-ocid="order_confirmation.panel"
          >
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Order Number
                </p>
                <p className="font-mono font-bold text-foreground text-sm">
                  {displayOrderId}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center justify-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Estimated Delivery
                </p>
                <p className="font-medium text-foreground text-sm">
                  {fmt(deliveryFrom)} – {fmt(deliveryTo)}
                </p>
                <p className="text-xs text-muted-foreground">
                  3–5 business days
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center justify-center gap-1">
                  <Package className="h-3 w-3" />
                  Shipping
                </p>
                <p className="font-medium text-accent text-sm">Free Standard</p>
              </div>
            </div>
          </motion.div>

          {/* Order items */}
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.35 }}
              className="bg-card border border-border/50 rounded-xl p-5 shadow-subtle"
              data-ocid="order_confirmation.items_list"
            >
              <h2 className="font-display text-sm font-bold text-foreground mb-4">
                Items Ordered
              </h2>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div
                    key={item.bookId}
                    data-ocid={`order_confirmation.item.${i + 1}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-9 h-13 object-cover rounded shadow-subtle shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.author} · Qty: {item.qty}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary shrink-0">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-4 bg-border/40" />
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${itemsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span>${(itemsTotal * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-accent font-medium">Free</span>
                </div>
              </div>
              <Separator className="my-3 bg-border/40" />
              <div className="flex justify-between font-bold text-foreground">
                <span>Total Charged</span>
                <span className="text-primary">${grandTotal.toFixed(2)}</span>
              </div>
            </motion.div>
          )}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.35 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              asChild
              data-ocid="order_confirmation.continue_shopping_button"
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth gap-2 shadow-elevated"
            >
              <Link to="/books">
                <BookOpen className="h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              data-ocid="order_confirmation.view_orders_button"
              size="lg"
              className="transition-smooth gap-2"
            >
              <Link to="/account">
                <ShoppingBag className="h-4 w-4" />
                View My Orders
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
