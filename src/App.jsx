import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CustomOrderPage from "./pages/CustomOrderPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/custom-order", element: <CustomOrderPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
