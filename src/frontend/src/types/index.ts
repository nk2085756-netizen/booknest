export type {
  Book,
  Order,
  OrderItem,
  OrderStatus,
  Review,
  Result,
  UserId,
  Timestamp,
} from "../backend.d.ts";

export interface CartItem {
  bookId: string;
  title: string;
  author: string;
  coverUrl: string;
  price: number;
  qty: number;
}

export interface CartStore {
  items: CartItem[];
  addItem: (book: {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    price: number;
  }) => void;
  removeItem: (bookId: string) => void;
  updateQty: (bookId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export interface WishlistStore {
  bookIds: Set<string>;
  toggleWishlist: (bookId: string) => void;
  isWishlisted: (bookId: string) => boolean;
  setWishlist: (bookIds: string[]) => void;
}
