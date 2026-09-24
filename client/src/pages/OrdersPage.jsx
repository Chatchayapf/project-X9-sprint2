import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cancelOrder, getMyOrders } from "../services/orderServices";

const formatPrice = (price) => `฿${Number(price).toLocaleString()}`;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  const loadOrders = useCallback(async () => {
    setError("");
    try {
      const result = await getMyOrders();
      setOrders(result);
    } catch (requestError) {
      setError(requestError.message || "Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleCancel = async (orderId) => {
    setCancellingId(orderId);
    setError("");
    try {
      const updatedOrder = await cancelOrder(orderId);
      setOrders((current) => current.map((order) =>
        order._id === orderId ? updatedOrder : order));
    } catch (requestError) {
      setError(requestError.message || "Could not cancel this order.");
    } finally {
      setCancellingId("");
    }
  };

  return (
    <main className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {error && <p role="alert" className="alert alert-error mb-4">{error}</p>}
      {loading ? (
        <p>Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="card bg-base-200 p-8 text-center gap-4">
          <p>You have no orders yet.</p>
          <Link to="/all-products" className="btn btn-primary self-center">Browse products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <section key={order._id} className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body gap-3">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <h2 className="font-semibold">Order #{order._id}</h2>
                    <p className="text-sm text-base-content/60">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.order_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.total_price)}</p>
                    <p className="text-sm capitalize">{order.order_status} · payment {order.payment_status}</p>
                  </div>
                </div>
                <ul className="divide-y divide-base-200">
                  {order.items.map((item, index) => (
                    <li key={`${order._id}-${index}`} className="py-2 flex justify-between gap-4 text-sm">
                      <span>{item.product_id?.name || "Product"} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                {["pending", "processing"].includes(order.order_status) && (
                  <div className="card-actions justify-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline btn-error"
                      disabled={cancellingId === order._id}
                      onClick={() => handleCancel(order._id)}
                    >
                      {cancellingId === order._id ? "Cancelling…" : "Cancel order"}
                    </button>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
};

export default OrdersPage;
