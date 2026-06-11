import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import { MOCK_BOOKS } from "../data/mockBooks";
import type { Book, Order, OrderItem, Review } from "../types";

function useBackendActor() {
  return useActor(createActor);
}

export function useAllBooks() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Book[]>({
    queryKey: ["books", "all"],
    queryFn: async () => {
      if (!actor) return MOCK_BOOKS;
      const result = await actor.getAllBooks();
      return result.length > 0 ? result : MOCK_BOOKS;
    },
    enabled: !isFetching,
    placeholderData: MOCK_BOOKS,
    staleTime: 60_000,
  });
}

export function useBookById(id: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Book | null>({
    queryKey: ["books", id],
    queryFn: async () => {
      if (!actor) return MOCK_BOOKS.find((b) => b.id === id) ?? null;
      return actor.getBookById(id);
    },
    enabled: !!id && !isFetching,
    staleTime: 60_000,
  });
}

export function useSearchBooks(searchTerm: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Book[]>({
    queryKey: ["books", "search", searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      if (!actor) {
        const lower = searchTerm.toLowerCase();
        return MOCK_BOOKS.filter(
          (b) =>
            b.title.toLowerCase().includes(lower) ||
            b.author.toLowerCase().includes(lower),
        );
      }
      return actor.searchBooks(searchTerm);
    },
    enabled: searchTerm.length > 1 && !isFetching,
    staleTime: 30_000,
  });
}

export function useBooksByGenre(genre: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Book[]>({
    queryKey: ["books", "genre", genre],
    queryFn: async () => {
      if (!actor) return MOCK_BOOKS.filter((b) => b.genre === genre);
      return actor.getBooksByGenre(genre);
    },
    enabled: !!genre && !isFetching,
    placeholderData: MOCK_BOOKS.filter((b) => b.genre === genre),
    staleTime: 60_000,
  });
}

export function useReviews(bookId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Review[]>({
    queryKey: ["reviews", bookId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviews(bookId);
    },
    enabled: !!bookId && !isFetching,
    staleTime: 30_000,
  });
}

export function useWishlist() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Book[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWishlist();
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

export function useMyOrders() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

export function useAddToWishlist() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bookId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.addToWishlist(bookId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useRemoveFromWishlist() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bookId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeFromWishlist(bookId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function usePlaceOrder() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (items: OrderItem[]) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(items);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useAddReview() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookId,
      reviewerName,
      rating,
      comment,
    }: {
      bookId: string;
      reviewerName: string;
      rating: number;
      comment: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addReview(bookId, reviewerName, rating, comment);
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["reviews", vars.bookId] }),
  });
}
