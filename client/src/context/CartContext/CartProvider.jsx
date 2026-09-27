import { useEffect, useRef, useState } from "react";
import { CartContext } from "./CartContext";
import { useAuth } from "../AuthContext/AuthContext";
import {
  addItemToCart,
  getCart,
  mergeCart,
  removeCartItem,
  updateCartItem,
} from "../../services/cartServices";

const GUEST_CART_KEY = "d9_guest_cart";

const readGuestCart = () => {
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeGuestCart = (items) => {
  try {
    if (items.length > 0) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    } else {
      localStorage.removeItem(GUEST_CART_KEY);
    }
  } catch {
    // storage unavailable (private mode / quota) — the cart simply stays in memory
  }
};

const toCartItems = (cart = []) => cart.map((entry) => {
  const product = entry.product_id;
  if (!product || typeof product !== "object") return null;

  return {
    ...product,
    id: product._id,
    name: product.name,
    price: entry.product_price ?? product.price,
    quantity: entry.product_quantity,
    image: product.img_url?.[0],
  };
}).filter(Boolean);

const toMergePayload = (items) => items.map((item) => ({
  product_id: item.id,
  product_quantity: item.quantity,
}));

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => readGuestCart());
  const { user } = useAuth();
  const userId = user?._id;

  // Tracks which account the guest cart has already been merged into, so a re-render
  // (or a second render pass before the first merge settles) cannot merge it twice.
  const mergedForUser = useRef(null);
  // While false the current cartItems belong to the server, and must not be written
  // back into the guest slot in localStorage.
  const guestOwnedCart = useRef(true);
  // Distinguishes a first mount as a guest (nothing to clear) from a real sign-out.
  const previousUserId = useRef(null);
  // Identifies the newest in-flight sync. A response from an older run is dropped
  // instead of being written into the state of a different account.
  const syncRun = useRef(0);

  useEffect(() => {
    if (guestOwnedCart.current) writeGuestCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    if (!userId) {
      // First mount as a guest: the lazy state initialiser already loaded the stored
      // cart, so clearing here would throw the guest's items away on every refresh.
      if (!previousUserId.current) return;

      // A real sign-out: those items now belong to the account, so drop the guest
      // slot to stop them leaking into whoever signs in next.
      previousUserId.current = null;
      mergedForUser.current = null;
      guestOwnedCart.current = true;
      syncRun.current += 1; // invalidate a response that is still on its way
      writeGuestCart([]);
      setCartItems([]);
      return;
    }

    previousUserId.current = userId;

    if (mergedForUser.current === userId) return;

    mergedForUser.current = userId;
    guestOwnedCart.current = false;

    // StrictMode invokes mount effects twice, and the guard above is what keeps that
    // down to a single merge request. The surviving run therefore must not be
    // cancelled on cleanup: nothing else would apply its response, and the cart would
    // come back empty after every refresh.
    const runId = syncRun.current + 1;
    syncRun.current = runId;

    const syncCart = async () => {
      // Read the guest cart from localStorage rather than from state: on sign in the
      // state above may already have been cleared, and storage is the source of truth.
      const guestCart = readGuestCart();

      try {
        const response = guestCart.length > 0
          ? await mergeCart(toMergePayload(guestCart))
          : await getCart();

        if (syncRun.current !== runId) return;

        // Only discard the guest cart once the server has accepted it, otherwise a
        // failed request would silently drop the items.
        writeGuestCart([]);
        setCartItems(toCartItems(response.cart));
      } catch (error) {
        console.error("Could not load cart:", error.message);
        if (syncRun.current !== runId) return;
        // Clear as well: re-merging the same cart on the next sign in would double it.
        writeGuestCart([]);
        setCartItems([]);
      }
    };

    syncCart();
  }, [userId]);

  const handleAddToCart = async (product) => {
    const productId = product.id ?? product._id;

    if (userId) {
      try {
        const response = await addItemToCart(productId, 1);
        setCartItems(toCartItems(response.cart));
      } catch (error) {
        console.error("Could not add item to cart:", error.message);
        alert(error.message);
        return;
      }
    } else {
      setCartItems((previousItems) => {
        const existing = previousItems.find((item) => item.id === productId);
        if (existing) {
          return previousItems.map((item) => item.id === productId
            ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...previousItems, { ...product, id: productId, quantity: 1 }];
      });
    }

    alert(`Added "${product.name}" to cart.`);
  };

  const updateQuantity = async (id, change) => {
    if (userId) {
      try {
        const response = await updateCartItem(id, change > 0 ? "increase" : "decrease");
        setCartItems(toCartItems(response.cart));
      } catch (error) {
        console.error("Could not update cart item:", error.message);
      }
      return;
    }

    setCartItems((previousItems) => previousItems
      .map((item) => (item.id === id ? { ...item, quantity: item.quantity + change } : item))
      .filter((item) => item.quantity > 0));
  };

  const removeItem = async (id) => {
    if (userId) {
      try {
        const response = await removeCartItem(id);
        setCartItems(toCartItems(response.cart));
      } catch (error) {
        console.error("Could not remove cart item:", error.message);
      }
      return;
    }

    setCartItems((previousItems) => previousItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    writeGuestCart([]);
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        handleAddToCart,
        onAddToCart: handleAddToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
