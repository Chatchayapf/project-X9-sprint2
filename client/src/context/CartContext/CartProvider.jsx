import { useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import { useAuth } from "../AuthContext/AuthContext";
import { addItemToCart, getCart } from "../../services/cartServices";

const toCartItems = (cart = []) => cart.map((entry) => {
  const product = entry.product_id;
  if (!product || typeof product !== "object") return null;

  return {
    ...product,
    id: product._id,
    name: product.name,
    price: entry.product_price ?? product.price,
    quantity: entry.product_quantity,
    image: product.image,
  };
}).filter(Boolean);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      setCartItems([]);
      return;
    }

    let cancelled = false;
    getCart()
      .then((response) => {
        if (!cancelled) setCartItems(toCartItems(response.cart));
      })
      .catch((error) => console.error("Could not load cart:", error.message));

    return () => { cancelled = true; };
  }, [isLoggedIn]);

  const handleAddToCart = async (product) => {
    const productId = product.id ?? product._id;

    if (isLoggedIn) {
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
            ? { ...item, quantity: item.quantity + 1 }
            : item);
        }
        return [...previousItems, { ...product, id: productId, quantity: 1 }];
      });
    }

    alert(`Added "${product.name}" to cart.`);
  };

  const updateQuantity = (id, change) => {
    setCartItems((previousItems) => previousItems.map((item) => {
      if (item.id !== id) return item;
      const quantity = item.quantity + change;
      return quantity > 0 ? { ...item, quantity } : item;
    }));
  };

  const removeItem = (id) => {
    setCartItems((previousItems) => previousItems.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

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
