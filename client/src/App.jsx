import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CustomOrderPage from "./pages/CustomOrderPage";
import Contact from "./pages/Contact";
import SignInPage from "./pages/SignInPage";
import CheckoutPage from "./pages/CheckoutPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      // navbar
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/contact", element: <Contact /> },
      { path: "/custom-order", element: <CustomOrderPage /> },

      // signin & checkout
      { path: "/signin", element: <SignInPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
