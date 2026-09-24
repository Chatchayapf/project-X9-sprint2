import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext/AuthContext";
import {
  approveCustomOrder,
  getAllCustomOrders,
  rejectCustomOrder,
} from "../services/customOrderServices";

const AdminCustomOrdersPage = () => {
  const { user } = useAuth();
  const [customOrders, setCustomOrders] = useState([]);
  const [prices, setPrices] = useState({});
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [error, setError] = useState("");

  const loadCustomOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const orders = await getAllCustomOrders(statusFilter);
      setCustomOrders(orders);
    } catch (requestError) {
      setError(requestError.message || "Could not load custom orders.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (user?.role === "admin") loadCustomOrders();
    else setLoading(false);
  }, [user, loadCustomOrders]);

  const handleApprove = async (event, orderId) => {
    event.preventDefault();
    const price = Number(prices[orderId]);
    if (!Number.isFinite(price) || price < 0) return;

    setWorkingId(orderId);
    setError("");
    try {
      const result = await approveCustomOrder(orderId, price);
      setCustomOrders((current) => statusFilter === "pending"
        ? current.filter((order) => order._id !== orderId)
        : current.map((order) => order._id === orderId ? result.customOrder : order));
    } catch (requestError) {
      setError(requestError.message || "Could not approve this custom order.");
    } finally {
      setWorkingId("");
    }
  };

  const handleReject = async (orderId) => {
    setWorkingId(orderId);
    setError("");
    try {
      const updated = await rejectCustomOrder(orderId);
      setCustomOrders((current) => statusFilter === "pending"
        ? current.filter((order) => order._id !== orderId)
        : current.map((order) => order._id === orderId ? updated : order));
    } catch (requestError) {
      setError(requestError.message || "Could not reject this custom order.");
    } finally {
      setWorkingId("");
    }
  };

  if (user?.role !== "admin") {
    return (
      <main className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <h1 className="text-2xl font-bold mb-3">Admin access required</h1>
        <p className="mb-5">Sign in with an administrator account to manage custom orders.</p>
        <Link to="/signin" className="btn btn-primary">Sign in</Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Custom Orders</h1>
        <div className="flex gap-2 items-center">
          <label htmlFor="custom-order-status" className="text-sm">Status</label>
          <select
            id="custom-order-status"
            className="select select-bordered select-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
          <button type="button" className="btn btn-outline btn-sm" onClick={loadCustomOrders} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      {error && <p role="alert" className="alert alert-error mb-4">{error}</p>}
      {loading ? (
        <p>Loading custom orders…</p>
      ) : customOrders.length === 0 ? (
        <div className="card bg-base-200 p-8 text-center">No custom orders found.</div>
      ) : (
        <div className="space-y-4">
          {customOrders.map((order) => (
            <article key={order._id} className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-lg">{order.name}</h2>
                    <p className="text-sm text-base-content/60">
                      {order.user_id?.email || "Customer"} · {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="badge badge-outline capitalize">{order.status}</span>
                </div>
                <p className="whitespace-pre-wrap">{order.detail}</p>
                <div className="flex flex-wrap gap-2 text-sm text-base-content/70">
                  {order.tags?.map((tag) => <span key={tag} className="badge badge-ghost">{tag}</span>)}
                  {order.deadline_date && <span>Deadline: {new Date(order.deadline_date).toLocaleDateString()}</span>}
                </div>
                {order.price != null && <p className="font-medium">Price: ฿{Number(order.price).toLocaleString()}</p>}

                {order.status === "pending" && (
                  <div className="card-actions justify-end items-end mt-2">
                    <form className="flex flex-wrap gap-2 items-end" onSubmit={(event) => handleApprove(event, order._id)}>
                      <label className="form-control">
                        <span className="label-text text-xs mb-1">Approval price (฿)</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          className="input input-bordered input-sm w-36"
                          value={prices[order._id] ?? ""}
                          onChange={(event) => setPrices((current) => ({ ...current, [order._id]: event.target.value }))}
                        />
                      </label>
                      <button type="submit" className="btn btn-sm btn-success" disabled={workingId === order._id}>
                        Approve
                      </button>
                    </form>
                    <button
                      type="button"
                      className="btn btn-sm btn-error btn-outline"
                      disabled={workingId === order._id}
                      onClick={() => handleReject(order._id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      <p className="text-sm text-base-content/60 mt-3">{customOrders.length} custom order{customOrders.length === 1 ? "" : "s"}</p>
    </main>
  );
};

export default AdminCustomOrdersPage;
