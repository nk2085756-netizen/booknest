import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export type Timestamp = bigint;
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface OrderItem {
    qty: bigint;
    title: string;
    bookId: string;
    price: number;
}
export interface Book {
    id: string;
    title: string;
    inStock: boolean;
    isbn: string;
    publishYear: bigint;
    description: string;
    author: string;
    genre: string;
    rating: number;
    coverUrl: string;
    price: number;
    reviewCount: bigint;
}
export interface Order {
    id: string;
    status: OrderStatus;
    total: number;
    userId: UserId;
    createdAt: Timestamp;
    items: Array<OrderItem>;
}
export interface Review {
    createdAt: Timestamp;
    bookId: string;
    reviewerName: string;
    comment: string;
    rating: number;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export interface backendInterface {
    addReview(bookId: string, reviewerName: string, rating: number, comment: string): Promise<Result>;
    addToWishlist(bookId: string): Promise<Result>;
    getAllBooks(): Promise<Array<Book>>;
    getBookById(id: string): Promise<Book | null>;
    getBooksByGenre(genre: string): Promise<Array<Book>>;
    getMyOrders(): Promise<Array<Order>>;
    getReviews(bookId: string): Promise<Array<Review>>;
    getWishlist(): Promise<Array<Book>>;
    placeOrder(items: Array<OrderItem>): Promise<{
        __kind__: "ok";
        ok: Order;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeFromWishlist(bookId: string): Promise<Result>;
    searchBooks(searchTerm: string): Promise<Array<Book>>;
}
