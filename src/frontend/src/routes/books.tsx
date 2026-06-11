import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { createRoute, useNavigate, useSearch } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookCard } from "../components/BookCard";
import { Layout } from "../components/Layout";
import { SkeletonGrid } from "../components/SkeletonCard";
import { GENRES } from "../data/mockBooks";
import { useAllBooks } from "../hooks/useBookNest";
import type { Book } from "../types";
import { Route as rootRoute } from "./__root";

// ─── Search Params ────────────────────────────────────────────────────────────

interface BooksSearch {
  q?: string;
  genre?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sort?: string;
  page?: string;
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books",
  validateSearch: (s: Record<string, unknown>): BooksSearch => ({
    q: typeof s.q === "string" ? s.q : undefined,
    genre: typeof s.genre === "string" ? s.genre : undefined,
    minPrice: typeof s.minPrice === "string" ? s.minPrice : undefined,
    maxPrice: typeof s.maxPrice === "string" ? s.maxPrice : undefined,
    minRating: typeof s.minRating === "string" ? s.minRating : undefined,
    sort: typeof s.sort === "string" ? s.sort : undefined,
    page: typeof s.page === "string" ? s.page : undefined,
  }),
  component: BooksPage,
});

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Top Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
] as const;

const RATING_OPTIONS = [4.5, 4, 3.5, 3] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseGenres(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw.split(",").filter(Boolean);
}

function encodeGenres(genres: string[]): string | undefined {
  return genres.length > 0 ? genres.join(",") : undefined;
}

// ─── Filter Sidebar Content ───────────────────────────────────────────────────

interface FilterPanelProps {
  selectedGenres: string[];
  minPrice: string;
  maxPrice: string;
  minRating: string;
  onGenreToggle: (genre: string) => void;
  onMinPrice: (v: string) => void;
  onMaxPrice: (v: string) => void;
  onMinRating: (v: string) => void;
  onClearAll: () => void;
  hasFilters: boolean;
}

function FilterPanel({
  selectedGenres,
  minPrice,
  maxPrice,
  minRating,
  onGenreToggle,
  onMinPrice,
  onMaxPrice,
  onMinRating,
  onClearAll,
  hasFilters,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      {/* Genre */}
      <div>
        <h3 className="font-display font-semibold text-sm text-foreground mb-3">
          Genre
        </h3>
        <div className="space-y-2.5">
          {GENRES.map((genre) => (
            <div key={genre} className="flex items-center gap-2.5">
              <Checkbox
                id={`genre-${genre}`}
                checked={selectedGenres.includes(genre)}
                onCheckedChange={() => onGenreToggle(genre)}
                data-ocid={`books.genre_checkbox.${genre.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                className="rounded-sm"
              />
              <Label
                htmlFor={`genre-${genre}`}
                className="text-sm text-foreground/80 cursor-pointer hover:text-foreground transition-colors leading-tight"
              >
                {genre}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-display font-semibold text-sm text-foreground mb-3">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              $
            </span>
            <Input
              type="number"
              min={0}
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPrice(e.target.value)}
              data-ocid="books.min_price_input"
              className="pl-6 h-8 text-sm bg-background"
            />
          </div>
          <span className="text-muted-foreground text-xs">–</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              $
            </span>
            <Input
              type="number"
              min={0}
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onMaxPrice(e.target.value)}
              data-ocid="books.max_price_input"
              className="pl-6 h-8 text-sm bg-background"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Min Rating */}
      <div>
        <h3 className="font-display font-semibold text-sm text-foreground mb-3">
          Minimum Rating
        </h3>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              data-ocid={`books.rating_filter.${String(r).replace(".", "_")}`}
              onClick={() =>
                onMinRating(minRating === String(r) ? "" : String(r))
              }
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium transition-smooth",
                minRating === String(r)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground/70 hover:border-primary/60 hover:text-foreground",
              )}
            >
              <Star
                className={cn(
                  "h-3 w-3",
                  minRating === String(r) ? "fill-current" : "text-primary",
                )}
              />
              {r}+
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <>
          <Separator />
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="books.clear_all_filters_button"
            onClick={onClearAll}
            className="w-full gap-1.5 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <X className="h-3.5 w-3.5" />
            Clear all filters
          </Button>
        </>
      )}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div
      className="flex items-center justify-center gap-1 pt-8"
      data-ocid="books.pagination"
    >
      <Button
        variant="outline"
        size="sm"
        data-ocid="books.pagination_prev"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-8 px-2.5 gap-1 text-xs transition-smooth"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Prev
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((p, i) =>
          p === "ellipsis" ? (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis spacers use index
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              data-ocid={`books.pagination.page.${p}`}
              onClick={() => onPageChange(p)}
              className={cn(
                "w-8 h-8 rounded-md text-xs font-medium transition-smooth",
                p === currentPage
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "bg-background border border-border text-foreground/70 hover:bg-muted hover:text-foreground",
              )}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        data-ocid="books.pagination_next"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-8 px-2.5 gap-1 text-xs transition-smooth"
      >
        Next
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>

      <span className="ml-3 text-xs text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}

// ─── Active Filter Chips ──────────────────────────────────────────────────────

interface ActiveFiltersProps {
  searchTerm: string;
  selectedGenres: string[];
  minPrice: string;
  maxPrice: string;
  minRating: string;
  onRemoveSearch: () => void;
  onRemoveGenre: (g: string) => void;
  onRemoveMinPrice: () => void;
  onRemoveMaxPrice: () => void;
  onRemoveRating: () => void;
}

function ActiveFilters({
  searchTerm,
  selectedGenres,
  minPrice,
  maxPrice,
  minRating,
  onRemoveSearch,
  onRemoveGenre,
  onRemoveMinPrice,
  onRemoveMaxPrice,
  onRemoveRating,
}: ActiveFiltersProps) {
  const chips: { label: string; key: string; onRemove: () => void }[] = [];
  if (searchTerm)
    chips.push({
      label: `"${searchTerm}"`,
      key: "q",
      onRemove: onRemoveSearch,
    });
  for (const g of selectedGenres)
    chips.push({
      label: g,
      key: `genre-${g}`,
      onRemove: () => onRemoveGenre(g),
    });
  if (minPrice)
    chips.push({
      label: `From $${minPrice}`,
      key: "minPrice",
      onRemove: onRemoveMinPrice,
    });
  if (maxPrice)
    chips.push({
      label: `Up to $${maxPrice}`,
      key: "maxPrice",
      onRemove: onRemoveMaxPrice,
    });
  if (minRating)
    chips.push({
      label: `${minRating}★ & up`,
      key: "rating",
      onRemove: onRemoveRating,
    });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5" data-ocid="books.active_filters">
      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant="secondary"
          className="gap-1.5 text-xs pr-1.5 h-6"
        >
          {chip.label}
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`Remove filter: ${chip.label}`}
            className="rounded-sm hover:text-foreground transition-smooth ml-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function BooksPage() {
  const search = useSearch({ from: "/books" });
  const navigate = useNavigate({ from: "/books" });

  // Local UI state — debounced search only
  const [localSearch, setLocalSearch] = useState(search.q ?? "");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived from URL
  const selectedGenres = useMemo(
    () => parseGenres(search.genre),
    [search.genre],
  );
  const minPrice = search.minPrice ?? "";
  const maxPrice = search.maxPrice ?? "";
  const minRating = search.minRating ?? "";
  const sort = search.sort ?? "popularity";
  const page = Math.max(1, Number(search.page ?? "1"));

  // Local price/rating state (apply on commit)
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  // Sync local on URL change
  useEffect(() => {
    setLocalSearch(search.q ?? "");
  }, [search.q]);
  useEffect(() => {
    setLocalMinPrice(search.minPrice ?? "");
  }, [search.minPrice]);
  useEffect(() => {
    setLocalMaxPrice(search.maxPrice ?? "");
  }, [search.maxPrice]);

  // Data
  const { data: allBooks, isLoading } = useAllBooks();

  // ── Filter & Sort ────────────────────────────────────────────────────────

  const filteredBooks = useMemo(() => {
    let books: Book[] = allBooks ?? [];

    // Search
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q),
      );
    }

    // Genre multi-select
    if (selectedGenres.length > 0) {
      books = books.filter((b) => selectedGenres.includes(b.genre));
    }

    // Price
    if (minPrice) books = books.filter((b) => b.price >= Number(minPrice));
    if (maxPrice) books = books.filter((b) => b.price <= Number(maxPrice));

    // Rating
    if (minRating) books = books.filter((b) => b.rating >= Number(minRating));

    // Sort
    return [...books].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return Number(b.publishYear) - Number(a.publishYear);
        case "rating":
          return b.rating - a.rating;
        default:
          return Number(b.reviewCount) - Number(a.reviewCount); // popularity
      }
    });
  }, [
    allBooks,
    localSearch,
    selectedGenres,
    minPrice,
    maxPrice,
    minRating,
    sort,
  ]);

  // ── Pagination ───────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedBooks = filteredBooks.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // ── URL updaters ─────────────────────────────────────────────────────────

  const updateSearch = useCallback(
    (patch: Partial<BooksSearch>) => {
      void navigate({
        search: (prev) => ({ ...prev, ...patch, page: undefined }),
      });
    },
    [navigate],
  );

  const handleSearchChange = (val: string) => {
    setLocalSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateSearch({ q: val.trim() || undefined });
    }, 300);
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    updateSearch({ q: undefined });
  };

  const handleGenreToggle = (genre: string) => {
    const next = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    updateSearch({ genre: encodeGenres(next) });
  };

  const handleMinPriceCommit = (val: string) => {
    setLocalMinPrice(val);
    updateSearch({ minPrice: val || undefined });
  };

  const handleMaxPriceCommit = (val: string) => {
    setLocalMaxPrice(val);
    updateSearch({ maxPrice: val || undefined });
  };

  const handleMinRatingToggle = (val: string) => {
    updateSearch({ minRating: minRating === val ? undefined : val });
  };

  const handlePageChange = (p: number) => {
    void navigate({
      search: (prev) => ({ ...prev, page: p === 1 ? undefined : String(p) }),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (val: string) => {
    updateSearch({ sort: val === "popularity" ? undefined : val });
  };

  const clearAllFilters = () => {
    setLocalSearch("");
    setLocalMinPrice("");
    setLocalMaxPrice("");
    void navigate({ search: {} });
  };

  const hasFilters =
    !!localSearch ||
    selectedGenres.length > 0 ||
    !!minPrice ||
    !!maxPrice ||
    !!minRating;

  // ── Filter state label ───────────────────────────────────────────────────

  const filterStateSummary = (() => {
    const parts: string[] = [];
    if (localSearch) parts.push(`"${localSearch}"`);
    if (selectedGenres.length > 0) parts.push(selectedGenres.join(", "));
    if (minPrice || maxPrice)
      parts.push(
        minPrice && maxPrice
          ? `$${minPrice}–$${maxPrice}`
          : minPrice
            ? `from $${minPrice}`
            : `up to $${maxPrice}`,
      );
    if (minRating) parts.push(`${minRating}★+`);
    return parts.length > 0 ? `Filtered by: ${parts.join(" · ")}` : "";
  })();

  // ── Common filter props ──────────────────────────────────────────────────

  const filterProps: FilterPanelProps = {
    selectedGenres,
    minPrice: localMinPrice,
    maxPrice: localMaxPrice,
    minRating,
    onGenreToggle: handleGenreToggle,
    onMinPrice: handleMinPriceCommit,
    onMaxPrice: handleMaxPriceCommit,
    onMinRating: handleMinRatingToggle,
    onClearAll: clearAllFilters,
    hasFilters,
  };

  return (
    <Layout>
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="bg-card border-b border-border/60 py-8 md:py-10">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1.5">
                Browse Books
              </h1>
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  "Loading collection…"
                ) : (
                  <>
                    <span className="font-semibold text-foreground">
                      {filteredBooks.length.toLocaleString()}
                    </span>{" "}
                    book{filteredBooks.length !== 1 ? "s" : ""}{" "}
                    {filterStateSummary ? (
                      <span className="text-muted-foreground">
                        {filterStateSummary}
                      </span>
                    ) : (
                      "in our collection"
                    )}
                  </>
                )}
              </p>
            </div>

            {/* Mobile filter toggle */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  data-ocid="books.filters_open_modal_button"
                  className="lg:hidden gap-2 h-9 text-sm self-start sm:self-auto transition-smooth"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {hasFilters && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                      {selectedGenres.length +
                        (minPrice ? 1 : 0) +
                        (maxPrice ? 1 : 0) +
                        (minRating ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                data-ocid="books.filters_sheet"
                className="w-72 bg-card border-border overflow-y-auto"
              >
                <SheetHeader className="mb-6">
                  <SheetTitle className="font-display text-lg">
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <FilterPanel {...filterProps} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="bg-background flex-1 py-8">
        <div className="container">
          <div className="flex gap-8">
            {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
            <aside
              className="hidden lg:block w-56 shrink-0 sticky top-4 self-start"
              data-ocid="books.filters_panel"
            >
              <div className="bg-card rounded-xl border border-border/60 shadow-subtle p-5">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display font-semibold text-sm text-foreground">
                    Filters
                  </span>
                  {hasFilters && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <FilterPanel {...filterProps} />
              </div>
            </aside>

            {/* ── Book Grid Column ─────────────────────────────────────────── */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* ── Search + Sort bar ──────────────────────────────────────── */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    data-ocid="books.search_input"
                    value={localSearch}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search by title or author…"
                    className="pl-9 pr-8 h-9 text-sm bg-card border-border/60"
                    aria-label="Search books"
                  />
                  {localSearch && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      data-ocid="books.search_clear_button"
                      onClick={handleClearSearch}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  {/* Sort */}
                  <Select value={sort} onValueChange={handleSortChange}>
                    <SelectTrigger
                      data-ocid="books.sort_select"
                      className="w-[175px] h-9 text-sm bg-card border-border/60"
                      aria-label="Sort books"
                    >
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ── Active filters chips ──────────────────────────────────── */}
              <ActiveFilters
                searchTerm={localSearch}
                selectedGenres={selectedGenres}
                minPrice={minPrice}
                maxPrice={maxPrice}
                minRating={minRating}
                onRemoveSearch={handleClearSearch}
                onRemoveGenre={(g) => handleGenreToggle(g)}
                onRemoveMinPrice={() => updateSearch({ minPrice: undefined })}
                onRemoveMaxPrice={() => updateSearch({ maxPrice: undefined })}
                onRemoveRating={() => updateSearch({ minRating: undefined })}
              />

              {/* ── Grid / Skeleton / Empty ───────────────────────────────── */}
              {isLoading ? (
                <SkeletonGrid count={PAGE_SIZE} />
              ) : pagedBooks.length === 0 ? (
                <EmptyState onClear={clearAllFilters} hasFilters={hasFilters} />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${localSearch}-${search.genre}-${minPrice}-${maxPrice}-${minRating}-${sort}-${safePage}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
                    data-ocid="books.grid"
                  >
                    {pagedBooks.map((book, i) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        index={(safePage - 1) * PAGE_SIZE + i + 1}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* ── Pagination ────────────────────────────────────────────── */}
              {!isLoading && pagedBooks.length > 0 && (
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({
  onClear,
  hasFilters,
}: { onClear: () => void; hasFilters: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      data-ocid="books.empty_state"
      className="flex flex-col items-center justify-center py-24 text-center gap-5"
    >
      <div className="w-20 h-20 rounded-2xl bg-muted/70 flex items-center justify-center shadow-subtle">
        <BookOpen className="h-9 w-9 text-primary/50" />
      </div>
      <div className="space-y-1.5 max-w-xs">
        <h3 className="font-display text-xl font-semibold text-foreground">
          No books found
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {hasFilters
            ? "No books match your current filters. Try broadening your search or clearing some filters."
            : "Our collection is being updated. Check back soon."}
        </p>
      </div>
      {hasFilters && (
        <Button
          variant="outline"
          data-ocid="books.empty_state_clear_button"
          onClick={onClear}
          className="gap-2 transition-smooth hover:bg-primary hover:text-primary-foreground hover:border-primary"
        >
          <X className="h-4 w-4" />
          Clear all filters
        </Button>
      )}
    </motion.div>
  );
}
