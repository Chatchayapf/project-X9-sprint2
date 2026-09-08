import { useState } from "react";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    alert(`✅ เพิ่ม "${product.name}" ลงตะกร้าแล้ว!`);
  };

  const updateQuantity = (id, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }),
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
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
