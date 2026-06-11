import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.bookIds.size);
  const { isAuthenticated, isInitializing, isLoggingIn, login, logout } =
    useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      void navigate({ to: "/books", search: { q: searchValue.trim() } });
      setSearchOpen(false);
      setSearchValue("");
    }
  };

  const navLinks = [
    { to: "/books", label: "Browse" },
    { to: "/books", search: { genre: "Fiction" }, label: "Fiction" },
    { to: "/books", search: { genre: "Non-Fiction" }, label: "Non-Fiction" },
    { to: "/books", search: { genre: "Sci-Fi & Fantasy" }, label: "Sci-Fi" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-card border-b border-border/60 transition-smooth",
        scrolled ? "shadow-subtle" : "",
      )}
    >
      <div className="container flex h-16 items-center gap-4">
        {/* Logo */}
        <Link
          to="/"
          data-ocid="header.logo_link"
          className="flex items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold font-display">
              B
            </span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground hidden sm:block">
            BookNest
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-1 ml-4"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              search={link.search}
              data-ocid={`header.nav_${link.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}_link`}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth rounded-md hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Search bar (desktop) */}
        {searchOpen ? (
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 flex-1 max-w-sm animate-slide-up"
          >
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={searchRef}
                data-ocid="header.search_input"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search books, authors…"
                className="pl-9 h-9 text-sm bg-background"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => {
                setSearchOpen(false);
                setSearchValue("");
              }}
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            data-ocid="header.search_button"
            className="h-9 w-9 text-muted-foreground hover:text-foreground transition-smooth"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}

        {/* Wishlist */}
        <Link
          to="/wishlist"
          data-ocid="header.wishlist_link"
          className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground transition-smooth"
            aria-label={`Wishlist (${wishlistCount} items)`}
          >
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-0">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </Badge>
            )}
          </Button>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          data-ocid="header.cart_link"
          className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground transition-smooth"
            aria-label={`Cart (${totalItems} items)`}
          >
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-0">
                {totalItems > 9 ? "9+" : totalItems}
              </Badge>
            )}
          </Button>
        </Link>

        {/* Account / Login */}
        {isAuthenticated ? (
          <Link
            to="/account"
            data-ocid="header.account_link"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground transition-smooth"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button
            size="sm"
            data-ocid="header.login_button"
            onClick={login}
            disabled={isInitializing || isLoggingIn}
            className="h-8 px-4 text-xs font-medium transition-smooth bg-primary text-primary-foreground hover:bg-primary/90 hidden sm:flex"
          >
            {isInitializing
              ? "Loading…"
              : isLoggingIn
                ? "Signing in…"
                : "Sign In"}
          </Button>
        )}

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              data-ocid="header.mobile_menu_button"
              className="h-9 w-9 md:hidden text-muted-foreground"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-72 bg-card"
            data-ocid="header.mobile_menu_sheet"
          >
            <div className="flex flex-col gap-1 mt-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                Browse
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  search={link.search}
                  className="px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/60 rounded-md transition-smooth"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border/40 my-3" />
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/60 rounded-md transition-smooth"
                  >
                    My Account
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/60 rounded-md transition-smooth text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Button
                  size="sm"
                  data-ocid="header.mobile_login_button"
                  onClick={login}
                  disabled={isInitializing || isLoggingIn}
                  className="mx-3 bg-primary text-primary-foreground"
                >
                  {isInitializing ? "Loading…" : "Sign In"}
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
