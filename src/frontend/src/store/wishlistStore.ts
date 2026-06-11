import { create } from "zustand";
import type { WishlistStore } from "../types";

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  bookIds: new Set<string>(),

  toggleWishlist: (bookId) => {
    set((state) => {
      const next = new Set(state.bookIds);
      if (next.has(bookId)) {
        next.delete(bookId);
      } else {
        next.add(bookId);
      }
      return { bookIds: next };
    });
  },

  isWishlisted: (bookId) => get().bookIds.has(bookId),

  setWishlist: (bookIds) => set({ bookIds: new Set(bookIds) }),
}));
