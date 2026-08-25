import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-center py-2 gap-2">
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/custom-order">Custom Order</Link>
    </div>
  );
};
export default Navbar;
