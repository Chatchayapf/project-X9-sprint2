import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext/CartContext";
import { useAuth } from "../context/AuthContext/AuthContext";
import { updateCartItem, removeCartItem } from "../services/cartServices";

const Navbar = ({
  cartItems: propCartItems,
  updateQuantity: propUpdateQuantity,
  removeItem: propRemoveItem,
}) => {
  const navigate = useNavigate();
  const cartContext = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const { setCartItems } = cartContext;
  const cartItems = propCartItems || cartContext.cartItems || [];
  const updateQuantity = propUpdateQuantity || cartContext.updateQuantity;
  const removeItem = propRemoveItem || cartContext.removeItem;

  const [activeMenu, setActiveMenu] = useState("product");

  const handleLogout = async () => {
    document.activeElement.blur();
    try {
      await logout();
      navigate("/signin", { replace: true });
    } catch (error) {
      window.alert(`ออกจากระบบไม่สำเร็จ: ${error.message || "Request failed"}`);
    }
  };

  const handleQuantityChange = async (id, change) => {
    if (!isLoggedIn) {
      updateQuantity?.(id, change);
      return;
    }

    try {
      const response = await updateCartItem(
        id,
        change > 0 ? "increase" : "decrease",
      );
      setCartItems(
        response.cart.map((entry) => ({
          ...entry.product_id,
          id: entry.product_id._id,
          price: entry.product_price ?? entry.product_id.price,
          quantity: entry.product_quantity,
        })),
      );
    } catch (error) {
      console.error("Could not update cart item:", error.message);
    }
  };

  const handleRemoveItem = async (id) => {
    if (!isLoggedIn) {
      removeItem?.(id);
      return;
    }

    try {
      const response = await removeCartItem(id);
      setCartItems(
        response.cart.map((entry) => ({
          ...entry.product_id,
          id: entry.product_id._id,
          price: entry.product_price ?? entry.product_id.price,
          quantity: entry.product_quantity,
        })),
      );
    } catch (error) {
      console.error("Could not remove cart item:", error.message);
    }
  };

  const menuItems = [
    { id: "home", label: "Home", path: "/" },
    { id: "products", label: "Products", path: "/#products" },
    { id: "contact", label: "Contact", path: "/#contact" },
    { id: "custom-order", label: "Custom Order", path: "/#custom-order-cta" },
  ];

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <>
      <div className="navbar bg-base-100 sticky top-0 z-50 shadow-sm px-4 md:px-8 lg:px-12 border-b border-base-200">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={(e) => {
                      setActiveMenu(item.id);
                      if (
                        item.path.startsWith("/#") &&
                        window.location.pathname === "/"
                      ) {
                        e.preventDefault();
                        const targetId = item.path.substring(2);
                        document
                          .getElementById(targetId)
                          ?.scrollIntoView({ behavior: "smooth" });
                        window.history.pushState(null, "", item.path);
                      }
                    }}
                    className={activeMenu === item.id ? "active" : ""}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer normal-case text-xl"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
              D9
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-base-content">Digi</span>
              <span className="font-bold text-primary">9</span>
              <span className="font-bold text-base-content">Craft</span>
              <div className="text-[9px] text-base-content/50 tracking-widest uppercase -mt-1">
                Creative Digital Assets
              </div>
            </div>
          </Link>
        </div>

        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal px-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={(e) => {
                    setActiveMenu(item.id);
                    if (
                      item.path.startsWith("/#") &&
                      window.location.pathname === "/"
                    ) {
                      e.preventDefault();
                      const targetId = item.path.substring(2);
                      document
                        .getElementById(targetId)
                        ?.scrollIntoView({ behavior: "smooth" });
                      window.history.pushState(null, "", item.path);
                    }
                  }}
                  className={
                    activeMenu === item.id ? "active text-primary" : ""
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end gap-2">
          {/* Theme Toggle */}
          <label className="swap swap-rotate btn btn-ghost btn-circle">
            <input type="checkbox" className="theme-controller" value="dark" />

            {/* sun icon */}
            <svg
              className="swap-off fill-current w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-on fill-current w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>

          {/* Cart Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="badge badge-sm badge-error indicator-item text-white">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
            <div
              tabIndex={0}
              className="mt-3 z-[1] card card-compact dropdown-content w-80 bg-base-100 shadow-xl border border-base-200"
            >
              <div className="card-body">
                <span className="font-bold text-lg">{cartCount} Items</span>
                <span className="text-info">
                  Subtotal: ฿{cartSubtotal.toLocaleString()}
                </span>

                <div className="max-h-64 overflow-y-auto mt-2 space-y-3">
                  {cartItems.length === 0 ? (
                    <p className="text-center text-sm text-base-content/50 py-4">
                      ไม่มีสินค้าในตะกร้า
                    </p>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-base-200 rounded-md flex items-center justify-center text-xl">
                          {item.tag === "Ebook"
                            ? "📚"
                            : item.tag === "Template"
                              ? "📄"
                              : item.tag === "Souvenir"
                                ? "🎁"
                                : "👕"}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold line-clamp-1">
                            {item.name}
                          </h4>
                          <div className="text-xs text-base-content/60">
                            ฿{item.price}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="btn btn-xs btn-circle btn-ghost"
                          >
                            -
                          </button>
                          <span className="text-sm w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="btn btn-xs btn-circle btn-ghost"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="btn btn-xs btn-circle btn-ghost text-error ml-1"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="card-actions mt-3">
                  <button
                    className="btn btn-primary btn-block"
                    disabled={cartItems.length === 0}
                    onClick={() => {
                      // Close dropdown via active element trick and navigate
                      document.activeElement.blur();
                      navigate("/checkout");
                    }}
                  >
                    View Cart & Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Login / Profile Button */}
          {isLoggedIn ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar placeholder"
              >
                <div className="bg-primary/10 text-primary font-semibold rounded-full w-10 h-10 flex items-center justify-center border border-primary/20">
                  <span className="text-xs">
                    {user?.firstname?.[0]?.toUpperCase() || ""}
                    {user?.lastname?.[0]?.toUpperCase() || ""}
                  </span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="menu-title text-xs text-base-content/60">
                  {user?.firstname} {user?.lastname}
                </li>
                <li>
                  <Link
                    to="/users/me"
                    onClick={() => document.activeElement.blur()}
                  >
                    My Profile
                  </Link>
                </li>
                {user?.role !== "admin" && (
                  <li>
                    <Link
                      to="/orders"
                      onClick={() => document.activeElement.blur()}
                    >
                      My Orders
                    </Link>
                  </li>
                )}
                {user?.role === "admin" && (
                  <li>
                    <Link
                      to="/admin/products"
                      onClick={() => document.activeElement.blur()}
                    >
                      Product Management
                    </Link>
                  </li>
                )}
                {user?.role === "admin" && (
                  <li>
                    <Link
                      to="/admin/orders"
                      onClick={() => document.activeElement.blur()}
                    >
                      All Orders
                    </Link>
                  </li>
                )}
                {user?.role === "admin" && (
                  <li>
                    <Link
                      to="/admin/custom-orders"
                      onClick={() => document.activeElement.blur()}
                    >
                      Custom Orders
                    </Link>
                  </li>
                )}
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              to="/signin"
              className="btn btn-ghost btn-circle"
              aria-label="Login"
              title="Login"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
