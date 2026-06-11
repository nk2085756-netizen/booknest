import Types "../types/books-catalog";
import Common "../types/common";
import Lib "../lib/books-catalog";
import List "mo:core/List";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";

mixin (
  books : List.List<Types.Book>,
  wishlists : Map.Map<Common.UserId, Set.Set<Text>>,
  orders : List.List<Types.Order>,
  reviews : Map.Map<Text, List.List<Types.Review>>,
) {
  // Seed sample books on first load
  do {
    if (books.size() == 0) {
      for (b in Lib.sampleBooks().values()) {
        books.add(b);
      };
    };
  };

  var nextOrderId : Nat = 0;

  // ── Catalog ───────────────────────────────────────────────────────────────

  public query func getAllBooks() : async [Types.Book] {
    Lib.getAllBooks(books);
  };

  public query func getBookById(id : Text) : async ?Types.Book {
    Lib.getBookById(books, id);
  };

  public query func searchBooks(searchTerm : Text) : async [Types.Book] {
    Lib.searchBooks(books, searchTerm);
  };

  public query func getBooksByGenre(genre : Text) : async [Types.Book] {
    Lib.getBooksByGenre(books, genre);
  };

  // ── Wishlist ──────────────────────────────────────────────────────────────

  public shared ({ caller }) func addToWishlist(bookId : Text) : async Common.Result {
    if (caller.isAnonymous()) {
      return #err("Authentication required");
    };
    Lib.addToWishlist(wishlists, caller, bookId);
  };

  public shared ({ caller }) func removeFromWishlist(bookId : Text) : async Common.Result {
    if (caller.isAnonymous()) {
      return #err("Authentication required");
    };
    Lib.removeFromWishlist(wishlists, caller, bookId);
  };

  public shared query ({ caller }) func getWishlist() : async [Types.Book] {
    if (caller.isAnonymous()) {
      return [];
    };
    Lib.getWishlist(wishlists, books, caller);
  };

  // ── Orders ────────────────────────────────────────────────────────────────

  public shared ({ caller }) func placeOrder(items : [Types.OrderItem]) : async { #ok : Types.Order; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Authentication required");
    };
    let outcome = Lib.placeOrder(orders, books, caller, items, nextOrderId);
    nextOrderId := outcome.newNextOrderId;
    outcome.result;
  };

  public shared query ({ caller }) func getMyOrders() : async [Types.Order] {
    if (caller.isAnonymous()) {
      return [];
    };
    Lib.getMyOrders(orders, caller);
  };

  // ── Reviews ───────────────────────────────────────────────────────────────

  public shared func addReview(
    bookId : Text,
    reviewerName : Text,
    rating : Float,
    comment : Text,
  ) : async Common.Result {
    Lib.addReview(reviews, books, bookId, reviewerName, rating, comment);
  };

  public query func getReviews(bookId : Text) : async [Types.Review] {
    Lib.getReviews(reviews, bookId);
  };
};
