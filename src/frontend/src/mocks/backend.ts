import type { backendInterface, Book, Order, Review, OrderItem } from "../backend";
import { OrderStatus } from "../backend";

const sampleBooks: Book[] = [
  {
    id: "1",
    title: "The Women's Hour",
    author: "Elaine Weiss",
    genre: "Literary Fiction",
    description: "A riveting account of the final days of the suffrage movement in America.",
    isbn: "978-0-670-02533-4",
    price: 14.99,
    rating: 4.5,
    reviewCount: BigInt(128),
    coverUrl: "https://covers.openlibrary.org/b/id/8739161-L.jpg",
    publishYear: BigInt(2018),
    inStock: true,
  },
  {
    id: "2",
    title: "Even Rights",
    author: "Jaime Sernon",
    genre: "Biographies & Memoirs",
    description: "An inspiring memoir about the fight for equality and justice.",
    isbn: "978-0-385-54734-7",
    price: 12.99,
    rating: 4.2,
    reviewCount: BigInt(87),
    coverUrl: "https://covers.openlibrary.org/b/id/10527843-L.jpg",
    publishYear: BigInt(2021),
    inStock: true,
  },
  {
    id: "3",
    title: "History & Culture",
    author: "Narca Barnson",
    genre: "History & Culture",
    description: "A comprehensive exploration of world history through cultural lenses.",
    isbn: "978-0-307-59315-5",
    price: 16.99,
    rating: 4.7,
    reviewCount: BigInt(203),
    coverUrl: "https://covers.openlibrary.org/b/id/9255566-L.jpg",
    publishYear: BigInt(2020),
    inStock: true,
  },
  {
    id: "4",
    title: "Sci-Fi & Fantasy",
    author: "Jiana Sarsen",
    genre: "Sci-Fi & Fantasy",
    description: "A dazzling collection of science fiction stories about the cosmos.",
    isbn: "978-0-593-31072-1",
    price: 11.99,
    rating: 4.4,
    reviewCount: BigInt(156),
    coverUrl: "https://covers.openlibrary.org/b/id/12818862-L.jpg",
    publishYear: BigInt(2022),
    inStock: false,
  },
  {
    id: "5",
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Literary Fiction",
    description: "Between life and death there is a library, and its shelves go on forever.",
    isbn: "978-0-525-55947-4",
    price: 13.99,
    rating: 4.6,
    reviewCount: BigInt(342),
    coverUrl: "https://covers.openlibrary.org/b/id/10516313-L.jpg",
    publishYear: BigInt(2020),
    inStock: true,
  },
  {
    id: "6",
    title: "Educated",
    author: "Tara Westover",
    genre: "Biographies & Memoirs",
    description: "A memoir about a young girl who grows up in a survivalist family.",
    isbn: "978-0-399-59050-4",
    price: 15.99,
    rating: 4.8,
    reviewCount: BigInt(521),
    coverUrl: "https://covers.openlibrary.org/b/id/8739165-L.jpg",
    publishYear: BigInt(2018),
    inStock: true,
  },
];

const sampleReviews: Review[] = [
  {
    bookId: "1",
    reviewerName: "Sarah M.",
    rating: 5,
    comment: "Absolutely captivating. I couldn't put it down!",
    createdAt: BigInt(1700000000),
  },
  {
    bookId: "1",
    reviewerName: "John D.",
    rating: 4,
    comment: "Great read, very informative and well-written.",
    createdAt: BigInt(1700100000),
  },
];

const sampleOrder: Order = {
  id: "order-1",
  status: OrderStatus.pending,
  total: 27.98,
  userId: { toText: () => "user-1", isAnonymous: () => false } as any,
  createdAt: BigInt(1700000000),
  items: [
    { bookId: "1", title: "The Women's Hour", qty: BigInt(1), price: 14.99 },
    { bookId: "2", title: "Even Rights", qty: BigInt(1), price: 12.99 },
  ],
};

export const mockBackend: backendInterface = {
  getAllBooks: async () => sampleBooks,
  getBookById: async (id: string) => sampleBooks.find((b) => b.id === id) ?? null,
  getBooksByGenre: async (genre: string) =>
    sampleBooks.filter((b) => b.genre.toLowerCase() === genre.toLowerCase()),
  searchBooks: async (term: string) =>
    sampleBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(term.toLowerCase()) ||
        b.author.toLowerCase().includes(term.toLowerCase())
    ),
  getMyOrders: async () => [sampleOrder],
  placeOrder: async (_items: OrderItem[]) => ({
    __kind__: "ok" as const,
    ok: sampleOrder,
  }),
  getReviews: async (_bookId: string) => sampleReviews,
  addReview: async () => ({ __kind__: "ok" as const, ok: null }),
  getWishlist: async () => [sampleBooks[0], sampleBooks[2]],
  addToWishlist: async () => ({ __kind__: "ok" as const, ok: null }),
  removeFromWishlist: async () => ({ __kind__: "ok" as const, ok: null }),
};
