import Checkout from "../components/Checkout";
import { useCart } from "../context/CartContext/CartContext";

const CheckoutPage = () => {
  const { cartItems } = useCart();

  return (
    <Checkout
      cartItems={cartItems}
    />
  );
};

export default CheckoutPage;