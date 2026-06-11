import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRoute } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import {
  BookOpen,
  BookText,
  Brain,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Globe2,
  GraduationCap,
  Lightbulb,
  Search,
  SmilePlus,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { BookCard } from "../components/BookCard";
import { Layout } from "../components/Layout";
import { SkeletonCard } from "../components/SkeletonCard";
import { GENRES, GENRE_DESCRIPTIONS, MOCK_BOOKS } from "../data/mockBooks";
import { useAllBooks } from "../hooks/useBookNest";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

// ─── Static data ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    id: "t1",
    name: "Sarah Mitchell",
    role: "Avid Reader",
    initials: "SM",
    text: "BookNest has completely transformed how I discover new books. The curated collections feel like they were made just for me. I've found so many hidden gems.",
    rating: 5,
  },
  {
    id: "t2",
    name: "James Okonkwo",
    role: "Literature Teacher",
    initials: "JO",
    text: "I recommend BookNest to all my students. The variety of genres and the quality of curation is unmatched anywhere online. An exceptional literary resource.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Priya Sharma",
    role: "Book Club Organizer",
    initials: "PS",
    text: "Our entire book club uses BookNest for discovering our monthly reads. The reviews and ratings are incredibly helpful and the checkout experience is seamless.",
    rating: 5,
  },
];

const GENRE_META: Record<string, { icon: React.ReactNode; count: number }> = {
  Fiction: { icon: <BookText className="h-6 w-6" />, count: 3200 },
  "Non-Fiction": { icon: <Globe2 className="h-6 w-6" />, count: 1850 },
  "Sci-Fi & Fantasy": {
    icon: <FlaskConical className="h-6 w-6" />,
    count: 2100,
  },
  "Self-Help": { icon: <Lightbulb className="h-6 w-6" />, count: 980 },
  Children: { icon: <SmilePlus className="h-6 w-6" />, count: 1420 },
  Academic: { icon: <GraduationCap className="h-6 w-6" />, count: 760 },
  "Biographies & Memoirs": { icon: <User className="h-6 w-6" />, count: 640 },
};

const DISPLAY_GENRES = GENRES.slice(0, 6);

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  name,
  role,
  initials,
  text,
  rating,
  index,
}: (typeof TESTIMONIALS)[0] & { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      data-ocid={`home.testimonial.${index + 1}`}
      className="bg-card border border-border/60 rounded-2xl p-6 shadow-subtle flex flex-col gap-4"
    >
      <StarDisplay rating={rating} />
      <p className="text-sm text-muted-foreground leading-relaxed italic flex-1">
        &ldquo;{text}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-border/40">
        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-primary">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {name}
          </p>
          <p className="text-xs text-muted-foreground truncate">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Featured Carousel ────────────────────────────────────────────────────────

function FeaturedCarousel({
  books,
  isLoading,
}: { books: typeof MOCK_BOOKS; isLoading: boolean }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
  });
  const [prevEnabled, setPrevEnabled] = useState(false);
  const [nextEnabled, setNextEnabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevEnabled(emblaApi.canScrollPrev());
    setNextEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* Carousel viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 md:gap-5">
          {isLoading
            ? Array.from({ length: 6 }, (_, i) => (
                <div
                  key={`sk-${i + 1}`}
                  className="shrink-0 w-44 sm:w-52 md:w-56"
                >
                  <SkeletonCard />
                </div>
              ))
            : books.map((book, i) => (
                <div key={book.id} className="shrink-0 w-44 sm:w-52 md:w-56">
                  <BookCard book={book} index={i + 1} />
                </div>
              ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        aria-label="Previous books"
        data-ocid="carousel.prev_button"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!prevEnabled}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border shadow-elevated flex items-center justify-center text-foreground transition-smooth hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Next books"
        data-ocid="carousel.next_button"
        onClick={() => emblaApi?.scrollNext()}
        disabled={!nextEnabled}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border shadow-elevated flex items-center justify-center text-foreground transition-smooth hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dot indicators */}
      {scrollSnaps.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {scrollSnaps.map((_, i) => (
            <button
              key={`dot-${i + 1}`}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              data-ocid={`carousel.dot.${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`rounded-full transition-smooth ${
                i === selectedIndex
                  ? "w-5 h-2 bg-primary"
                  : "w-2 h-2 bg-border hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Search Section ───────────────────────────────────────────────────────────

function SearchSection() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: { q?: string; genre?: string } = {};
    if (query.trim()) params.q = query.trim();
    if (genre) params.genre = genre;
    navigate({ to: "/books", search: params });
  };

  return (
    <section
      className="bg-secondary/40 border-y border-border/50 py-10 md:py-12"
      data-ocid="home.search_section"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Find your next read
          </p>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
            Search Our Collection
          </h2>
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, ISBN..."
                data-ocid="home.search_input"
                className="pl-9 bg-card border-border/60 focus-visible:ring-primary h-11 text-sm"
              />
            </div>
            {/* Genre select */}
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              data-ocid="home.search_genre_select"
              className="h-11 px-3 rounded-md border border-border/60 bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-w-[140px]"
            >
              <option value="">All Genres</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <Button
              type="submit"
              data-ocid="home.search_submit_button"
              className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth shadow-subtle"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Newsletter Section ───────────────────────────────────────────────────────

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section
      className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/60 py-16 md:py-20 overflow-hidden"
      data-ocid="home.newsletter_section"
    >
      {/* decorative blobs */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-accent/8 blur-3xl pointer-events-none" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="max-w-xl mx-auto text-center space-y-5"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 mx-auto">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Never Miss a Great Book
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Subscribe to our weekly newsletter and receive curated
            recommendations, early access to new releases, and exclusive member
            discounts.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              data-ocid="newsletter.success_state"
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-accent/15 border border-accent/30 text-accent-foreground"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">
                You&rsquo;re on the list! Welcome to BookNest.
              </span>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                data-ocid="newsletter.email_input"
                className="flex-1 h-11 bg-card border-border/60 focus-visible:ring-primary text-sm"
              />
              <Button
                type="submit"
                data-ocid="newsletter.subscribe_button"
                className="h-11 px-7 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth shadow-elevated whitespace-nowrap"
              >
                Subscribe Free
              </Button>
            </form>
          )}
          <p className="text-xs text-muted-foreground">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar() {
  const stats = [
    { label: "Books Available", value: "10K+" },
    { label: "Happy Readers", value: "50K+" },
    { label: "Avg. Rating", value: "4.9★" },
    { label: "Genres", value: "12+" },
  ];

  return (
    <div className="border-t border-border/50 mt-8 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-0">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex flex-col items-center text-center ${i > 0 ? "sm:border-l border-border/40" : ""}`}
        >
          <p className="font-display text-2xl font-bold text-foreground">
            {s.value}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function HomePage() {
  const { data: books, isLoading } = useAllBooks();
  const displayBooks = books ?? MOCK_BOOKS;

  const featuredBooks = displayBooks.slice(0, 8);
  const staffPicks = displayBooks.filter((b) => b.rating >= 4.7).slice(0, 6);
  const topStaffPick = staffPicks[0] ?? displayBooks[0];

  return (
    <Layout>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-secondary/70 via-background to-accent/8 overflow-hidden">
        {/* decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/8 blur-3xl pointer-events-none" />

        <div className="container py-16 md:py-24 lg:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-6 order-2 lg:order-1"
            >
              <Badge
                variant="secondary"
                className="gap-1.5 text-xs font-semibold px-3 py-1.5 bg-primary/10 text-primary border-primary/20 rounded-full"
              >
                <Sparkles className="h-3 w-3" />
                Curated for Discerning Readers
              </Badge>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Discover Your{" "}
                <span className="text-gradient">Next Favorite</span>
                <br className="hidden sm:block" /> Book
              </h1>

              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md">
                Premium online bookstore and digital library. Thousands of
                hand-curated titles across every genre — from timeless classics
                to contemporary bestsellers.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  data-ocid="hero.browse_button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth shadow-elevated px-8 rounded-xl"
                >
                  <Link to="/books">Browse Collection</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  data-ocid="hero.start_reading_button"
                  className="transition-smooth border-border/70 hover:bg-muted/60 rounded-xl"
                >
                  <Link to="/books" search={{ sort: "newest" }}>
                    New Arrivals
                  </Link>
                </Button>
              </div>

              <StatsBar />
            </motion.div>

            {/* Right — hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-elevated aspect-[4/3]">
                <img
                  src="/assets/generated/hero-books.dim_1200x600.jpg"
                  alt="Curated book collection at BookNest"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/25 via-transparent to-transparent" />
              </div>

              {/* Floating Staff Pick card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-5 -left-5 bg-card rounded-2xl p-4 shadow-elevated border border-border/50 max-w-[200px] hidden sm:block"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
                    <Brain className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
                    Staff Pick
                  </span>
                </div>
                <p className="font-display text-sm font-semibold text-foreground line-clamp-1">
                  {topStaffPick?.title ?? "The Midnight Library"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {topStaffPick?.author ?? "Matt Haig"}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <StarDisplay rating={5} />
                </div>
              </motion.div>

              {/* Floating badge: books count */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.75 }}
                className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-2xl px-4 py-2 shadow-elevated text-center hidden sm:block"
              >
                <p className="font-display text-lg font-bold">10K+</p>
                <p className="text-[10px] font-medium opacity-80">Books</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Search ───────────────────────────────────────────── */}
      <SearchSection />

      {/* ── Categories ───────────────────────────────────────── */}
      <section
        className="bg-background py-14 md:py-18"
        data-ocid="home.categories_section"
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Explore
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Featured Categories
              </h2>
            </div>
            <Link
              to="/books"
              data-ocid="home.view_all_categories_link"
              className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {DISPLAY_GENRES.map((genre, i) => {
              const meta = GENRE_META[genre];
              return (
                <motion.div
                  key={genre}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <Link
                    to="/books"
                    search={{ genre }}
                    data-ocid={`home.category.${i + 1}`}
                    className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-card border border-border/50 hover-lift shadow-subtle text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth block"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                      {meta?.icon ?? <BookOpen className="h-6 w-6" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-snug">
                        {genre}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {meta?.count.toLocaleString()} books
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Genre description strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 p-4 rounded-xl bg-muted/40 border border-border/30"
          >
            <p className="text-xs text-muted-foreground text-center">
              {GENRE_DESCRIPTIONS.Fiction} ·{" "}
              {GENRE_DESCRIPTIONS["Sci-Fi & Fantasy"]} ·{" "}
              {GENRE_DESCRIPTIONS["Self-Help"]}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Books Carousel ───────────────────────────── */}
      <section
        className="bg-muted/30 border-y border-border/40 py-14 md:py-18"
        data-ocid="home.featured_section"
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Handpicked
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Featured Books
              </h2>
            </div>
            <Link
              to="/books"
              data-ocid="home.view_all_books_link"
              className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              See all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="px-5"
          >
            <FeaturedCarousel books={featuredBooks} isLoading={isLoading} />
          </motion.div>
        </div>
      </section>

      {/* ── Staff Picks ───────────────────────────────────────── */}
      <section
        className="bg-background py-14 md:py-18"
        data-ocid="home.staff_picks_section"
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-3 text-xs px-3 py-1 rounded-full">
              <BookOpen className="h-3 w-3 mr-1.5" />
              Curated by Our Team
            </Badge>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Staff Picks
            </h2>
            <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
              Our booksellers read everything. These are the titles they
              can&rsquo;t stop recommending.
            </p>
          </motion.div>

          <div
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {staffPicks.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="snap-start shrink-0 w-44 sm:w-52"
              >
                <BookCard book={book} index={i + 1} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section
        className="bg-muted/30 border-y border-border/40 py-14 md:py-18"
        data-ocid="home.testimonials_section"
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Community
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              What Our Readers Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.id} {...t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────── */}
      <NewsletterSection />

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section
        className="bg-background py-12 md:py-16"
        data-ocid="home.cta_section"
      >
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto space-y-5"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Start Your Reading Journey
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Join over 50,000 readers who have found their next favorite book
              on BookNest.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                data-ocid="home.cta_browse_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth shadow-elevated px-10 rounded-xl"
              >
                <Link to="/books">Explore All Books</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                data-ocid="home.cta_account_button"
                className="transition-smooth rounded-xl border-border/70"
              >
                <Link to="/account">My Account</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
