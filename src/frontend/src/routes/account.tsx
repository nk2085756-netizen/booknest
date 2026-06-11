import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, createRoute } from "@tanstack/react-router";
import {
  BookMarked,
  BookOpen,
  Heart,
  Library,
  LogIn,
  ShoppingBag,
  Star,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { OrderStatus } from "../backend";
import { BookCard } from "../components/BookCard";
import { Layout } from "../components/Layout";
import { MOCK_BOOKS } from "../data/mockBooks";
import { useAuth } from "../hooks/useAuth";
import { useMyOrders, useWishlist } from "../hooks/useBookNest";
import { useWishlistStore } from "../store/wishlistStore";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: AccountPage,
});

const STATUS_STYLES: Record<string, string> = {
  [OrderStatus.pending]: "bg-primary/10 text-primary border-primary/30",
  [OrderStatus.confirmed]: "bg-accent/10 text-accent border-accent/30",
  [OrderStatus.shipped]: "bg-chart-2/10 text-chart-2 border-chart-2/30",
  [OrderStatus.delivered]: "bg-accent/15 text-accent border-accent/40",
  [OrderStatus.cancelled]:
    "bg-destructive/10 text-destructive border-destructive/30",
};

const MOCK_READING_PROGRESS = [
  {
    bookId: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    progress: 72,
    coverUrl: "https://picsum.photos/seed/midnight-library/300/450",
  },
  {
    bookId: "3",
    title: "Dune",
    author: "Frank Herbert",
    progress: 34,
    coverUrl: "https://picsum.photos/seed/dune-book/300/450",
  },
  {
    bookId: "7",
    title: "Educated",
    author: "Tara Westover",
    progress: 100,
    coverUrl: "https://picsum.photos/seed/educated-book/300/450",
  },
];

function LoginPrompt({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center py-24 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        data-ocid="account.login_prompt"
        className="text-center max-w-sm mx-auto space-y-6 px-6"
      >
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto shadow-subtle">
          <Library className="h-9 w-9 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-3xl font-bold text-foreground">
            Welcome to BookNest
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Sign in to access your personal library, track orders, manage your
            wishlist, and get personalized reading recommendations.
          </p>
        </div>
        <div className="space-y-3 pt-2">
          <Button
            data-ocid="account.login_button"
            onClick={onLogin}
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth shadow-subtle font-semibold gap-2"
          >
            <LogIn className="h-4 w-4" />
            Sign In with Internet Identity
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full transition-smooth"
          >
            <Link to="/books" data-ocid="account.browse_link">
              Browse Books Without Signing In
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
          {[
            { icon: Heart, label: "Wishlist" },
            { icon: ShoppingBag, label: "Orders" },
            { icon: BookOpen, label: "Library" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: { label: string; value: number | string; icon: React.ElementType }) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-3 shadow-subtle">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-xl font-bold text-foreground font-display">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function ReadingProgressCard({
  item,
}: { item: (typeof MOCK_READING_PROGRESS)[0] }) {
  const isFinished = item.progress === 100;
  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 flex gap-4 shadow-subtle">
      <img
        src={item.coverUrl}
        alt={item.title}
        className="w-14 aspect-[2/3] object-cover rounded-lg shadow-subtle shrink-0"
      />
      <div className="flex-1 min-w-0 space-y-2">
        <div>
          <h4 className="font-display font-semibold text-sm text-foreground line-clamp-1">
            {item.title}
          </h4>
          <p className="text-xs text-muted-foreground">{item.author}</p>
        </div>
        <div className="space-y-1.5">
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${item.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {item.progress}% complete
            </span>
            {isFinished && (
              <Badge className="text-[10px] h-4 px-1.5 bg-accent/15 text-accent border border-accent/30">
                Finished
              </Badge>
            )}
          </div>
        </div>
        {!isFinished && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs px-3 transition-smooth hover:bg-primary hover:text-primary-foreground hover:border-primary"
          >
            Continue Reading
          </Button>
        )}
      </div>
    </div>
  );
}

function AccountPage() {
  const { isAuthenticated, isInitializing, principalText, login, logout } =
    useAuth();
  const { data: orders, isLoading: ordersLoading } = useMyOrders();
  const { data: backendWishlist } = useWishlist();
  const wishlistIds = useWishlistStore((s) => s.bookIds);

  const wishlisted = backendWishlist?.length
    ? backendWishlist
    : MOCK_BOOKS.filter((b) => wishlistIds.has(b.id));

  const removeFromWishlist = useWishlistStore((s) => s.toggleWishlist);

  const shortPrincipal = principalText
    ? `${principalText.slice(0, 5)}...${principalText.slice(-5)}`
    : "Anonymous";

  const initials = principalText
    ? principalText.slice(0, 2).toUpperCase()
    : "BN";

  if (isInitializing) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-muted animate-pulse mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 mx-auto" />
              <Skeleton className="h-3 w-24 mx-auto" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <LoginPrompt onLogin={login} />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Profile Header */}
      <div className="bg-card border-b border-border/60">
        <div className="container py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center shadow-subtle"
              >
                <span className="font-display text-lg font-bold text-primary">
                  {initials}
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h1 className="font-display text-2xl font-bold text-foreground">
                  My Account
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                  {shortPrincipal}
                </p>
              </motion.div>
            </div>
            <Button
              variant="outline"
              data-ocid="account.logout_button"
              onClick={logout}
              size="sm"
              className="transition-smooth text-muted-foreground hover:text-foreground hover:border-border"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-background py-8 flex-1">
        <div className="container max-w-4xl">
          <Tabs defaultValue="overview" data-ocid="account.tabs">
            <TabsList className="bg-muted/50 border border-border/40 mb-8 h-10">
              <TabsTrigger
                value="overview"
                data-ocid="account.overview_tab"
                className="gap-1.5 text-sm"
              >
                <User className="h-3.5 w-3.5" /> Overview
              </TabsTrigger>
              <TabsTrigger
                value="wishlist"
                data-ocid="account.wishlist_tab"
                className="gap-1.5 text-sm"
              >
                <Heart className="h-3.5 w-3.5" /> Wishlist
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                data-ocid="account.orders_tab"
                className="gap-1.5 text-sm"
              >
                <ShoppingBag className="h-3.5 w-3.5" /> Orders
              </TabsTrigger>
              <TabsTrigger
                value="reading"
                data-ocid="account.reading_tab"
                className="gap-1.5 text-sm"
              >
                <BookMarked className="h-3.5 w-3.5" /> Reading
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-subtle">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                      <span className="font-display text-2xl font-bold text-primary">
                        {initials}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-display text-xl font-bold text-foreground">
                        Welcome back!
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1 break-all font-mono">
                        {principalText}
                      </p>
                      <Badge className="mt-2 text-xs bg-accent/10 text-accent border border-accent/30">
                        BookNest Member
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard
                    label="Books in Wishlist"
                    value={wishlisted.length}
                    icon={Heart}
                  />
                  <StatCard
                    label="Total Orders"
                    value={orders?.length ?? 0}
                    icon={ShoppingBag}
                  />
                  <StatCard
                    label="Books Read"
                    value={
                      MOCK_READING_PROGRESS.filter((r) => r.progress === 100)
                        .length
                    }
                    icon={Star}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="transition-smooth h-12 gap-2 justify-start px-5"
                  >
                    <Link to="/wishlist" data-ocid="account.go_to_wishlist">
                      <Heart className="h-4 w-4 text-primary" />
                      <span>View Wishlist</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="transition-smooth h-12 gap-2 justify-start px-5"
                  >
                    <Link to="/books" data-ocid="account.go_to_books">
                      <BookOpen className="h-4 w-4 text-accent" />
                      <span>Browse Books</span>
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {wishlisted.length === 0 ? (
                  <div
                    data-ocid="account.wishlist_empty_state"
                    className="text-center py-20 bg-muted/30 rounded-2xl border border-border/40"
                  >
                    <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      No saved books yet
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                      Click the heart icon on any book to save it to your
                      wishlist.
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
                    >
                      <Link
                        to="/books"
                        data-ocid="account.wishlist_browse_button"
                      >
                        Discover Books
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {wishlisted.length} book
                        {wishlisted.length !== 1 ? "s" : ""} saved
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="transition-smooth gap-1.5"
                      >
                        <Link
                          to="/wishlist"
                          data-ocid="account.view_full_wishlist"
                        >
                          View Full Wishlist
                        </Link>
                      </Button>
                    </div>
                    <div
                      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                      data-ocid="account.wishlist_grid"
                    >
                      {wishlisted.slice(0, 8).map((book, i) => (
                        <div
                          key={book.id}
                          className="relative group"
                          data-ocid={`account.wishlist.item.${i + 1}`}
                        >
                          <BookCard book={book} index={i + 1} />
                          <button
                            type="button"
                            aria-label="Remove from wishlist"
                            data-ocid={`account.wishlist.remove.${i + 1}`}
                            onClick={() => removeFromWishlist(book.id)}
                            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-smooth p-1.5 rounded-full bg-destructive/90 text-destructive-foreground shadow-subtle z-10"
                          >
                            <span className="text-[10px] font-bold">✕</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {ordersLoading ? (
                  <div
                    className="space-y-3"
                    data-ocid="account.orders_loading_state"
                  >
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="bg-card border border-border/50 rounded-xl p-5"
                      >
                        <div className="flex justify-between mb-3">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-48 mb-2" />
                        <Skeleton className="h-3 w-36" />
                      </div>
                    ))}
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <div
                    data-ocid="account.orders_empty_state"
                    className="text-center py-20 bg-muted/30 rounded-2xl border border-border/40"
                  >
                    <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      No orders yet
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                      Your order history will appear here once you make a
                      purchase.
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
                    >
                      <Link
                        to="/books"
                        data-ocid="account.orders_browse_button"
                      >
                        Start Shopping
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4" data-ocid="account.orders_list">
                    {orders.map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        data-ocid={`account.order.${i + 1}`}
                        className="bg-card border border-border/50 rounded-xl p-5 shadow-subtle"
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <p className="text-sm font-semibold text-foreground font-mono">
                              #{order.id.slice(0, 12)}…
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(
                                Number(order.createdAt) / 1_000_000,
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <Badge
                            className={`text-xs border capitalize ${STATUS_STYLES[order.status] ?? ""}`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="mt-4 space-y-1.5">
                          {order.items.map((item) => (
                            <div
                              key={item.bookId}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-muted-foreground truncate flex-1 mr-4">
                                {item.title}{" "}
                                <span className="text-muted-foreground/60">
                                  × {Number(item.qty)}
                                </span>
                              </span>
                              <span className="text-foreground font-medium shrink-0">
                                ${(item.price * Number(item.qty)).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-border/40 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""}
                          </span>
                          <span className="font-semibold text-foreground">
                            Total:{" "}
                            <span className="text-primary">
                              ${order.total.toFixed(2)}
                            </span>
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Reading Progress Tab */}
            <TabsContent value="reading">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Reading Progress
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Track your reading journey
                    </p>
                  </div>
                  <Badge className="text-xs bg-accent/10 text-accent border border-accent/30">
                    {
                      MOCK_READING_PROGRESS.filter((r) => r.progress === 100)
                        .length
                    }{" "}
                    Finished
                  </Badge>
                </div>

                <div className="space-y-3" data-ocid="account.reading_list">
                  {MOCK_READING_PROGRESS.map((item, i) => (
                    <motion.div
                      key={item.bookId}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      data-ocid={`account.reading.item.${i + 1}`}
                    >
                      <ReadingProgressCard item={item} />
                    </motion.div>
                  ))}
                </div>

                <div className="bg-muted/40 border border-border/40 rounded-xl p-5 text-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Purchase digital books to add them to your reading list.
                  </p>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="mt-3 transition-smooth"
                  >
                    <Link to="/books" data-ocid="account.reading_browse_button">
                      Browse Digital Books
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
