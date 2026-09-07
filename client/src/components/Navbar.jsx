import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-between py-2 gap-2">
      <div>
        <Link to="/">Logo</Link>
      </div>
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="all-products">Products</Link>
        <Link to="contact">Contact</Link>
        <Link to="custom-order">Custom Order</Link>
      </div>
      <div className="flex gap-4">
        <Link to="/checkout">Cart</Link>
        <Link to="/signin">Login/Register</Link>
      </div>
    </div>
  );
};
export default Navbar;
