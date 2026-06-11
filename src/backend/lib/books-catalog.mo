import Types "../types/books-catalog";
import Common "../types/common";
import List "mo:core/List";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Principal "mo:core/Principal";

module {
  // ── Sample Data ───────────────────────────────────────────────────────────

  public func sampleBooks() : [Types.Book] {
    [
      {
        id = "b001";
        title = "The Midnight Library";
        author = "Matt Haig";
        genre = "Fiction";
        price = 14.99;
        rating = 4.7;
        reviewCount = 312;
        description = "Between life and death there is a library. When Nora Seed finds herself in the Midnight Library, she has a chance to make things right.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg";
        isbn = "978-0525559474";
        publishYear = 2020;
        inStock = true;
      },
      {
        id = "b002";
        title = "Atomic Habits";
        author = "James Clear";
        genre = "Self-Help";
        price = 16.99;
        rating = 4.9;
        reviewCount = 548;
        description = "Tiny changes, remarkable results. An easy and proven way to build good habits and break bad ones.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg";
        isbn = "978-0735211292";
        publishYear = 2018;
        inStock = true;
      },
      {
        id = "b003";
        title = "Sapiens: A Brief History of Humankind";
        author = "Yuval Noah Harari";
        genre = "Non-Fiction";
        price = 18.99;
        rating = 4.8;
        reviewCount = 621;
        description = "A sweeping narrative of humanity's creation and evolution that explores who we are, how we got here, and where we're going.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg";
        isbn = "978-0062316097";
        publishYear = 2015;
        inStock = true;
      },
      {
        id = "b004";
        title = "Introduction to Algorithms";
        author = "Thomas H. Cormen";
        genre = "Academic";
        price = 29.99;
        rating = 4.6;
        reviewCount = 198;
        description = "The leading algorithms textbook, covering a broad range of algorithms in depth with rigorous mathematical analysis.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg";
        isbn = "978-0262033848";
        publishYear = 2022;
        inStock = true;
      },
      {
        id = "b005";
        title = "The Very Hungry Caterpillar";
        author = "Eric Carle";
        genre = "Children";
        price = 8.99;
        rating = 4.9;
        reviewCount = 874;
        description = "A classic picture book about a caterpillar who eats through a variety of foods before transforming into a butterfly.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780399226908-L.jpg";
        isbn = "978-0399226908";
        publishYear = 1969;
        inStock = true;
      },
      {
        id = "b006";
        title = "Educated";
        author = "Tara Westover";
        genre = "Non-Fiction";
        price = 15.99;
        rating = 4.8;
        reviewCount = 432;
        description = "A memoir about a young girl who grows up in a strict survivalist family and goes on to earn a PhD from Cambridge.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg";
        isbn = "978-0399590504";
        publishYear = 2018;
        inStock = true;
      },
      {
        id = "b007";
        title = "The Great Gatsby";
        author = "F. Scott Fitzgerald";
        genre = "Fiction";
        price = 9.99;
        rating = 4.1;
        reviewCount = 509;
        description = "A novel about the Jazz Age in the United States told through the eyes of Nick Carraway and his neighbor Jay Gatsby.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg";
        isbn = "978-0743273565";
        publishYear = 1925;
        inStock = true;
      },
      {
        id = "b008";
        title = "Think and Grow Rich";
        author = "Napoleon Hill";
        genre = "Self-Help";
        price = 11.99;
        rating = 4.5;
        reviewCount = 367;
        description = "After interviewing over 500 wealthy individuals, Hill presents principles for achieving success and accumulating wealth.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg";
        isbn = "978-1585424337";
        publishYear = 1937;
        inStock = true;
      },
      {
        id = "b009";
        title = "Clean Code";
        author = "Robert C. Martin";
        genre = "Academic";
        price = 24.99;
        rating = 4.4;
        reviewCount = 276;
        description = "A handbook of agile software craftsmanship with best practices for writing readable, maintainable code.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg";
        isbn = "978-0132350884";
        publishYear = 2008;
        inStock = true;
      },
      {
        id = "b010";
        title = "Harry Potter and the Sorcerer's Stone";
        author = "J.K. Rowling";
        genre = "Children";
        price = 12.99;
        rating = 4.9;
        reviewCount = 1204;
        description = "The first installment in the beloved Harry Potter series, following a young wizard's first year at Hogwarts School.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg";
        isbn = "978-0439708180";
        publishYear = 1997;
        inStock = true;
      },
      {
        id = "b011";
        title = "Dune";
        author = "Frank Herbert";
        genre = "Fiction";
        price = 16.99;
        rating = 4.7;
        reviewCount = 493;
        description = "Set in the distant future, Dune tells the story of Paul Atreides as his family assumes control of a desert planet.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg";
        isbn = "978-0441013593";
        publishYear = 1965;
        inStock = true;
      },
      {
        id = "b012";
        title = "The Power of Now";
        author = "Eckhart Tolle";
        genre = "Self-Help";
        price = 13.99;
        rating = 4.6;
        reviewCount = 285;
        description = "A guide to spiritual enlightenment, focusing on the importance of living in the present moment.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9781577314806-L.jpg";
        isbn = "978-1577314806";
        publishYear = 1997;
        inStock = true;
      },
      {
        id = "b013";
        title = "Becoming";
        author = "Michelle Obama";
        genre = "Non-Fiction";
        price = 17.99;
        rating = 4.8;
        reviewCount = 716;
        description = "An intimate, powerful memoir by the former First Lady of the United States, chronicling her journey from Chicago's South Side.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg";
        isbn = "978-1524763138";
        publishYear = 2018;
        inStock = true;
      },
      {
        id = "b014";
        title = "Where the Wild Things Are";
        author = "Maurice Sendak";
        genre = "Children";
        price = 7.99;
        rating = 4.8;
        reviewCount = 653;
        description = "A timeless picture book about a young boy named Max who sails to a land of wild creatures.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780060254926-L.jpg";
        isbn = "978-0060254926";
        publishYear = 1963;
        inStock = true;
      },
      {
        id = "b015";
        title = "The Design of Everyday Things";
        author = "Don Norman";
        genre = "Academic";
        price = 19.99;
        rating = 4.5;
        reviewCount = 189;
        description = "A seminal book on human-centered design, explaining how good design makes products intuitive and satisfying to use.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780465050659-L.jpg";
        isbn = "978-0465050659";
        publishYear = 2013;
        inStock = true;
      },
      {
        id = "b016";
        title = "1984";
        author = "George Orwell";
        genre = "Fiction";
        price = 10.99;
        rating = 4.7;
        reviewCount = 823;
        description = "A dystopian novel set in a totalitarian society, following Winston Smith's rebellion against the oppressive Party.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg";
        isbn = "978-0451524935";
        publishYear = 1949;
        inStock = true;
      },
      {
        id = "b017";
        title = "Deep Work";
        author = "Cal Newport";
        genre = "Self-Help";
        price = 14.99;
        rating = 4.6;
        reviewCount = 341;
        description = "Rules for focused success in a distracted world, arguing that deep work is the superpower of the 21st century.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg";
        isbn = "978-1455586691";
        publishYear = 2016;
        inStock = true;
      },
      {
        id = "b018";
        title = "A Short History of Nearly Everything";
        author = "Bill Bryson";
        genre = "Non-Fiction";
        price = 15.99;
        rating = 4.7;
        reviewCount = 402;
        description = "An entertaining journey through the history of science, from the Big Bang to the rise of civilization.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780767908177-L.jpg";
        isbn = "978-0767908177";
        publishYear = 2003;
        inStock = true;
      },
      {
        id = "b019";
        title = "The Hobbit";
        author = "J.R.R. Tolkien";
        genre = "Fiction";
        price = 12.99;
        rating = 4.8;
        reviewCount = 671;
        description = "Bilbo Baggins, a homebody hobbit, is swept into an epic quest to reclaim a treasure guarded by a dragon.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg";
        isbn = "978-0547928227";
        publishYear = 1937;
        inStock = true;
      },
      {
        id = "b020";
        title = "Charlotte's Web";
        author = "E.B. White";
        genre = "Children";
        price = 8.99;
        rating = 4.9;
        reviewCount = 589;
        description = "The classic tale of a pig named Wilbur and his friendship with a spider named Charlotte who saves his life.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780061124952-L.jpg";
        isbn = "978-0061124952";
        publishYear = 1952;
        inStock = true;
      },
      {
        id = "b021";
        title = "Thinking, Fast and Slow";
        author = "Daniel Kahneman";
        genre = "Non-Fiction";
        price = 17.99;
        rating = 4.6;
        reviewCount = 453;
        description = "Nobel laureate Kahneman explains the two systems that drive the way we think and make choices.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg";
        isbn = "978-0374533557";
        publishYear = 2011;
        inStock = true;
      },
      {
        id = "b022";
        title = "The 7 Habits of Highly Effective People";
        author = "Stephen R. Covey";
        genre = "Self-Help";
        price = 15.99;
        rating = 4.7;
        reviewCount = 512;
        description = "A principle-centered approach for solving personal and professional problems through a paradigm of character ethics.";
        coverUrl = "https://covers.openlibrary.org/b/isbn/9780743269513-L.jpg";
        isbn = "978-0743269513";
        publishYear = 1989;
        inStock = true;
      },
    ];
  };

  // ── Catalog ───────────────────────────────────────────────────────────────

  public func getAllBooks(books : List.List<Types.Book>) : [Types.Book] {
    books.toArray();
  };

  public func getBookById(books : List.List<Types.Book>, id : Text) : ?Types.Book {
    books.find(func(b) { b.id == id });
  };

  public func searchBooks(books : List.List<Types.Book>, searchTerm : Text) : [Types.Book] {
    let lower = searchTerm.toLower();
    books.filter(func(b) {
      b.title.toLower().contains(#text lower) or b.author.toLower().contains(#text lower)
    }).toArray();
  };

  public func getBooksByGenre(books : List.List<Types.Book>, genre : Text) : [Types.Book] {
    let lower = genre.toLower();
    books.filter(func(b) { b.genre.toLower() == lower }).toArray();
  };

  // ── Wishlist ──────────────────────────────────────────────────────────────

  public func addToWishlist(
    wishlists : Map.Map<Common.UserId, Set.Set<Text>>,
    caller : Common.UserId,
    bookId : Text,
  ) : Common.Result {
    let userSet = switch (wishlists.get(caller)) {
      case (?s) s;
      case null {
        let s = Set.empty<Text>();
        wishlists.add(caller, s);
        s;
      };
    };
    userSet.add(bookId);
    #ok;
  };

  public func removeFromWishlist(
    wishlists : Map.Map<Common.UserId, Set.Set<Text>>,
    caller : Common.UserId,
    bookId : Text,
  ) : Common.Result {
    switch (wishlists.get(caller)) {
      case null #err("Wishlist not found");
      case (?userSet) {
        userSet.remove(bookId);
        #ok;
      };
    };
  };

  public func getWishlist(
    wishlists : Map.Map<Common.UserId, Set.Set<Text>>,
    books : List.List<Types.Book>,
    caller : Common.UserId,
  ) : [Types.Book] {
    switch (wishlists.get(caller)) {
      case null [];
      case (?userSet) {
        books.filter(func(b) { userSet.contains(b.id) }).toArray();
      };
    };
  };

  // ── Orders ────────────────────────────────────────────────────────────────

  public func placeOrder(
    orders : List.List<Types.Order>,
    books : List.List<Types.Book>,
    caller : Common.UserId,
    items : [Types.OrderItem],
    nextOrderId : Nat,
  ) : { result : { #ok : Types.Order; #err : Text }; newNextOrderId : Nat } {
    if (items.size() == 0) {
      return { result = #err("Order must contain at least one item"); newNextOrderId = nextOrderId };
    };
    // Validate all books exist and are in stock
    for (item in items.values()) {
      switch (books.find(func(b) { b.id == item.bookId })) {
        case null {
          return { result = #err("Book not found: " # item.bookId); newNextOrderId = nextOrderId };
        };
        case (?book) {
          if (not book.inStock) {
            return { result = #err("Book out of stock: " # book.title); newNextOrderId = nextOrderId };
          };
        };
      };
    };
    // Calculate total
    var total : Float = 0.0;
    for (item in items.values()) {
      total := total + item.price * Int.toFloat(item.qty);
    };
    let orderId = "ord-" # nextOrderId.toText();
    let order : Types.Order = {
      id = orderId;
      userId = caller;
      items;
      total;
      status = #confirmed;
      createdAt = Time.now();
    };
    orders.add(order);
    { result = #ok(order); newNextOrderId = nextOrderId + 1 };
  };

  public func getMyOrders(
    orders : List.List<Types.Order>,
    caller : Common.UserId,
  ) : [Types.Order] {
    orders.filter(func(o) { Principal.equal(o.userId, caller) }).toArray();
  };

  // ── Reviews ───────────────────────────────────────────────────────────────

  public func addReview(
    reviews : Map.Map<Text, List.List<Types.Review>>,
    books : List.List<Types.Book>,
    bookId : Text,
    reviewerName : Text,
    rating : Float,
    comment : Text,
  ) : Common.Result {
    switch (books.find(func(b) { b.id == bookId })) {
      case null #err("Book not found: " # bookId);
      case (?_) {
        let review : Types.Review = {
          bookId;
          reviewerName;
          rating;
          comment;
          createdAt = Time.now();
        };
        let bookReviews = switch (reviews.get(bookId)) {
          case (?list) list;
          case null {
            let list = List.empty<Types.Review>();
            reviews.add(bookId, list);
            list;
          };
        };
        bookReviews.add(review);
        // Update book rating average
        let sum = bookReviews.foldLeft(0.0, func(acc : Float, r : Types.Review) : Float { acc + r.rating });
        let count = bookReviews.size();
        let newRating = if (count == 0) rating else sum / Int.toFloat(count);
        books.mapInPlace(func(b) {
          if (b.id == bookId) {
            { b with rating = newRating; reviewCount = count }
          } else {
            b
          }
        });
        #ok;
      };
    };
  };

  public func getReviews(
    reviews : Map.Map<Text, List.List<Types.Review>>,
    bookId : Text,
  ) : [Types.Review] {
    switch (reviews.get(bookId)) {
      case null [];
      case (?list) list.toArray();
    };
  };
};
