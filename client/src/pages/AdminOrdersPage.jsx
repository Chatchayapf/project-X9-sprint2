import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext/AuthContext";
import { getAllOrders } from "../services/orderServices";

const formatPrice = (price) => `฿${Number(price).toLocaleString()}`;

const AdminOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getAllOrders();
      setOrders(result);
    } catch (requestError) {
      setError(requestError.message || "Could not load all orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") loadOrders();
    else setLoading(false);
  }, [user, loadOrders]);

  if (user?.role !== "admin") {
    return (
      <main className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <h1 className="text-2xl font-bold mb-3">Admin access required</h1>
        <p className="mb-5">Sign in with an administrator account to view all orders.</p>
        <Link to="/signin" className="btn btn-primary">Sign in</Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">All Orders</h1>
        <button type="button" className="btn btn-outline btn-sm" onClick={loadOrders} disabled={loading}>
          Refresh
        </button>
      </div>

      {error && <p role="alert" className="alert alert-error mb-4">{error}</p>}
      {loading ? (
        <p>Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="card bg-base-200 p-8 text-center">There are no orders yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Order status</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="font-mono text-xs">{order._id}</td>
                  <td>{order.user_id?.email || order.user_id?._id || "—"}</td>
                  <td>
                    <ul className="space-y-1">
                      {order.items.map((item, index) => (
                        <li key={`${order._id}-${index}`}>
                          {item.product_id?.name || "Product"} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{formatPrice(order.total_price)}</td>
                  <td className="capitalize">{order.order_status}</td>
                  <td className="capitalize">{order.payment_status}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-sm text-base-content/60 mt-3">{orders.length} order{orders.length === 1 ? "" : "s"}</p>
    </main>
  );
};

export default AdminOrdersPage;
