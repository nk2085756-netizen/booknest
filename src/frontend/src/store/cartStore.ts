import { create } from "zustand";
import type { CartItem, CartStore } from "../types";

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (book) => {
    set((state) => {
      const existing = state.items.find((i) => i.bookId === book.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.bookId === book.id ? { ...i, qty: i.qty + 1 } : i,
          ),
        };
      }
      const newItem: CartItem = {
        bookId: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        price: book.price,
        qty: 1,
      };
      return { items: [...state.items, newItem] };
    });
  },

  removeItem: (bookId) => {
    set((state) => ({ items: state.items.filter((i) => i.bookId !== bookId) }));
  },

  updateQty: (bookId, qty) => {
    if (qty <= 0) {
      get().removeItem(bookId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.bookId === bookId ? { ...i, qty } : i)),
    }));
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

  totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
}));
