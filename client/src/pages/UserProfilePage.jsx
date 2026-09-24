import { useState, useEffect } from "react";
import { getMyOrders } from "../services/orderServices";
import ProfileInfo from "../components/ProfileInfo";
import EditProfileForm from "../components/EditProfileForm";
import RecentOrders from "../components/RecentOrders";

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res);
      } catch (error) {
        console.error("ดึงข้อมูลประวัติการสั่งซื้อไม่สำเร็จ", error);
      }
    };
    fetchMyOrders();
  }, []);

  const successfulOrdersCount =
    orders?.filter(
      (order) =>
        order.payment_status === "paid" || order.order_status === "delivered",
    ).length || 0;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Profile & Edit Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-base-200 p-6 md:p-8 mb-6">
        {!isEditing ? (
          <ProfileInfo
            onEdit={() => setIsEditing(true)}
            successCount={successfulOrdersCount}
          />
        ) : (
          <EditProfileForm onCancel={() => setIsEditing(false)} />
        )}
      </div>

      {/* Recent Orders Section */}
      <RecentOrders orders={orders || []} />
    </div>
  );
};

export default UserProfilePage;
