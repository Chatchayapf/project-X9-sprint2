import Checkout from "../components/Checkout";
import { useCart } from "../context/CartContext/CartContext";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();

  return (
    <Checkout
      cartItems={cartItems}
      clearCart={clearCart}
    />
  );
};

export default CheckoutPage;