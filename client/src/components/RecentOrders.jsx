import { ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const formatPrice = (price) => `฿${Number(price).toLocaleString()}`;

const getOrderStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "shipped":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPaymentStatusBadge = (status) => {
  switch (status) {
    case "paid":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "failed":
    case "refunded":
      return "bg-rose-100 text-rose-800 border-rose-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const RecentOrders = ({ orders }) => {
  // ดึงมาแสดงแค่ 2 รายการล่าสุด
  const recentOrders =
    orders && orders.length > 0 ? [...orders].reverse().slice(0, 3) : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-base-200 p-6 md:p-8">
      {/* Header & View All Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="text-purple-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">
            ประวัติการสั่งซื้อล่าสุด
          </h2>
        </div>
        <Link
          to="/orders"
          className="btn btn-ghost btn-sm text-purple-600 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-1"
        >
          ดูทั้งหมด <ArrowRight size={16} />
        </Link>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {recentOrders.length > 0 ? (
          recentOrders.map((order) => (
            <div
              key={order._id}
              className="p-5 bg-base-50 rounded-xl border border-base-200 space-y-3"
            >
              {/* Order Header: ID, Date, Status, Total */}
              <div className="flex flex-wrap justify-between items-start gap-2 border-b border-base-200 pb-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    Order #{order._id}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()} &bull;{" "}
                    {order.order_type || "standard"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-900 text-base">
                    {formatPrice(order.total_price)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 justify-end text-xs font-medium capitalize">
                    {/* Badge แสดง order_status */}
                    <span
                      className={`px-2 py-0.5 rounded-md border ${getOrderStatusBadge(order.order_status)}`}
                    >
                      {order.order_status}
                    </span>
                    {/* Badge แสดง payment_status */}
                    <span
                      className={`px-2 py-0.5 rounded-md border ${getPaymentStatusBadge(order.payment_status)}`}
                    >
                      Payment: {order.payment_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Items List (แสดงชื่อสินค้าและจำนวน) */}
              <ul className="space-y-1.5 text-sm pt-1">
                {order.items?.map((item, index) => (
                  <li
                    key={`${order._id}-${index}`}
                    className="flex justify-between items-center text-gray-700"
                  >
                    <span className="line-clamp-1">
                      {item.product_id?.name || "Product"} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900 text-xs">
                      {formatPrice((item.price || 0) * (item.quantity || 1))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div className="text-center py-6 bg-base-50 rounded-xl border border-dashed border-base-200">
            <p className="text-sm text-gray-500">ยังไม่มีประวัติการสั่งซื้อ</p>
            <Link
              to="/all-products"
              className="text-purple-600 text-sm font-medium mt-2 inline-block hover:underline"
            >
              เริ่มเลือกดูสินค้าเลย
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
