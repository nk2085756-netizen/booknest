import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { BookOpen, Mail } from "lucide-react";

const footerLinks = {
  Explore: [
    { label: "Browse All Books", to: "/books" },
    { label: "New Arrivals", to: "/books", search: { sort: "newest" } },
    { label: "Bestsellers", to: "/books", search: { sort: "rating" } },
    { label: "Gift Cards", to: "/" },
  ],
  Account: [
    { label: "My Library", to: "/account" },
    { label: "Wishlist", to: "/wishlist" },
    { label: "Order History", to: "/account" },
    { label: "Reading Progress", to: "/account" },
  ],
  Company: [
    { label: "About Us", to: "/" },
    { label: "Book Club", to: "/" },
    { label: "Blog", to: "/" },
    { label: "Contact", to: "/" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/60 mt-auto">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded w-fit"
            >
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                BookNest
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your premium destination for curated books and digital reading.
              Discover stories that inspire, educate, and transport.
            </p>
            {/* Newsletter */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Stay in the loop
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2"
                aria-label="Newsletter signup"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="email"
                    data-ocid="footer.newsletter_input"
                    placeholder="Your email address"
                    className="pl-8 h-9 text-sm bg-background text-sm"
                    aria-label="Email for newsletter"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  data-ocid="footer.newsletter_submit_button"
                  className="h-9 px-4 text-xs shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      search={"search" in link ? link.search : undefined}
                      className="text-sm text-muted-foreground hover:text-foreground transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-border/40" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BookNest. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-smooth underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
