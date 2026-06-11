import Common "common";

module {
  public type Book = {
    id : Text;
    title : Text;
    author : Text;
    genre : Text;
    price : Float;
    rating : Float;
    reviewCount : Nat;
    description : Text;
    coverUrl : Text;
    isbn : Text;
    publishYear : Nat;
    inStock : Bool;
  };

  public type OrderItem = {
    bookId : Text;
    title : Text;
    price : Float;
    qty : Nat;
  };

  public type OrderStatus = {
    #pending;
    #confirmed;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type Order = {
    id : Text;
    userId : Common.UserId;
    items : [OrderItem];
    total : Float;
    status : OrderStatus;
    createdAt : Common.Timestamp;
  };

  public type Review = {
    bookId : Text;
    reviewerName : Text;
    rating : Float;
    comment : Text;
    createdAt : Common.Timestamp;
  };
};
