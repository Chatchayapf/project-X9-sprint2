import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import CustomOrderPage from "./pages/CustomOrderPage";
import Contact from "./pages/Contact";
import SignInPage from "./pages/SignInPage";
import CheckoutPage from "./pages/CheckoutPage";
import SignUpPage from "./pages/SignUpPage";
import AllProductsPage from "./pages/AllProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import OrdersPage from "./pages/OrdersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminCustomOrdersPage from "./pages/AdminCustomOrdersPage";
import { CartProvider } from "./context/CartContext/CartProvider";
import { AuthProvider } from "./context/AuthContext/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "all-products", element: <AllProductsPage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "contact", element: <Contact /> },
      { path: "custom-order", element: <CustomOrderPage /> },
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "admin/orders", element: <AdminOrdersPage /> },
      { path: "admin/custom-orders", element: <AdminCustomOrdersPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
