import Types "types/books-catalog";
import Common "types/common";
import BooksCatalogApi "mixins/books-catalog-api";
import List "mo:core/List";
import Map "mo:core/Map";
import Set "mo:core/Set";

actor {
  let books : List.List<Types.Book> = List.empty();
  let wishlists : Map.Map<Common.UserId, Set.Set<Text>> = Map.empty();
  let orders : List.List<Types.Order> = List.empty();
  let reviews : Map.Map<Text, List.List<Types.Review>> = Map.empty();

  include BooksCatalogApi(books, wishlists, orders, reviews);
};
