import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Route as rootRoute } from "./routes/__root";
import { Route as accountRoute } from "./routes/account";
import { Route as booksRoute } from "./routes/books";
import { Route as bookDetailRoute } from "./routes/books.$bookId";
import { Route as cartRoute } from "./routes/cart";
import { Route as checkoutRoute } from "./routes/checkout";
import { Route as indexRoute } from "./routes/index";
import { Route as orderConfirmationRoute } from "./routes/order-confirmation";
import { Route as wishlistRoute } from "./routes/wishlist";

const routeTree = rootRoute.addChildren([
  indexRoute,
  booksRoute,
  bookDetailRoute,
  accountRoute,
  wishlistRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
