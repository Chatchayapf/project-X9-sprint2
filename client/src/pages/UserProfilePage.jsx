import { User, Download, History, Award, Pencil } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext/AuthContext";
import { updateUserProfile } from "../services/userServices";

const UserProfilePage = () => {
  const { user: authUser, setUser } = useAuth();

  const orders = [
    {
      id: "ORD-8923",
      date: "2026-07-28",
      items: 2,
      total: 24.99,
      status: "Completed",
    },
    {
      id: "ORD-8711",
      date: "2026-07-15",
      items: 1,
      total: 9.99,
      status: "Completed",
    },
    {
      id: "ORD-8502",
      date: "2026-06-02",
      items: 3,
      total: 45.5,
      status: "Completed",
    },
  ];

  // Map real user fields from AuthContext
  const user = {
    name: authUser
      ? `${authUser.firstname} ${authUser.lastname}`
      : "-",
    email: authUser?.email ?? "-",
    memberSince: authUser?.createdAt
      ? new Date(authUser.createdAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "-",
    role: authUser?.role === "admin" ? "Admin" : "Member",
    downloads: orders.length,
  };

  const [selectedOrder, setSelectedOrder] = useState(null);

  // Edit profile state
  const [editForm, setEditForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    birth_date: "",
    gender: "",
    current_password: "",
    password: "",
    confirm_password: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);

  const openEditModal = () => {
    setEditForm({
      firstname: authUser?.firstname ?? "",
      lastname: authUser?.lastname ?? "",
      username: authUser?.username ?? "",
      email: authUser?.email ?? "",
      birth_date: authUser?.birth_date
        ? new Date(authUser.birth_date).toISOString().split("T")[0]
        : "",
      gender: authUser?.gender ?? "",
      current_password: "",
      password: "",
      confirm_password: "",
    });
    setEditError("");
    setEditSuccess(false);
    document.getElementById("edit_profile_modal").showModal();
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess(false);

    // Validate password ฝั่ง client ก่อน
    if (editForm.password || editForm.confirm_password || editForm.current_password) {
      if (!editForm.current_password) {
        return setEditError("กรุณาระบุรหัสผ่านปัจจุบัน");
      }
      if (!editForm.password) {
        return setEditError("กรุณาระบุรหัสผ่านใหม่");
      }
      if (editForm.password.length < 6) {
        return setEditError("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
      }
      if (editForm.password !== editForm.confirm_password) {
        return setEditError("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      }
      if (editForm.password === editForm.current_password) {
        return setEditError("รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม");
      }
    }

    setEditLoading(true);

    const payload = {
      firstname: editForm.firstname,
      lastname: editForm.lastname,
      username: editForm.username,
      email: editForm.email,
      birth_date: editForm.birth_date || undefined,
      gender: editForm.gender || undefined,
    };
    if (editForm.password) {
      payload.current_password = editForm.current_password;
      payload.password = editForm.password;
    }

    try {
      const res = await updateUserProfile(payload);
      // อัปเดต AuthContext ด้วย data จาก API response
      setUser((prev) => ({ ...prev, ...(res.data ?? payload) }));
      setEditSuccess(true);
      setTimeout(() => {
        document.getElementById("edit_profile_modal").close();
      }, 1000);
    } catch (err) {
      setEditError(err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setEditLoading(false);
    }
  };

  const openReceipt = (order) => {
    setSelectedOrder(order);
    document.getElementById("receipt_modal").showModal();
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-base-200 p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
            <User size={40} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {user.name}
            </h1>
            <p className="text-gray-500">
              {user.email} &bull; Member since {user.memberSince}
            </p>
            <button
              onClick={openEditModal}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              <Pencil size={14} />
              แก้ไขข้อมูล
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-yellow-100/80 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-xl flex flex-col items-center justify-center min-w-[120px]">
            <Award className="mb-1" size={24} />
            <span className="font-semibold text-sm">{user.role}</span>
          </div>
          <div className="bg-purple-100/80 border border-purple-200 text-purple-700 px-6 py-4 rounded-xl flex flex-col items-center justify-center min-w-[120px]">
            <Download className="mb-1" size={24} />
            <span className="font-semibold text-sm">
              {user.downloads} Downloads
            </span>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-2xl shadow-sm border border-base-200 overflow-hidden">
        <div className="p-6 border-b border-base-200 flex items-center gap-2">
          <History className="text-purple-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Order History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Items</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="hover:bg-base-50/50 border-b border-base-100 last:border-0 text-sm"
                >
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="py-4 px-6 text-gray-600">{order.date}</td>
                  <td className="py-4 px-6 text-gray-600">{order.items}</td>
                  <td className="py-4 px-6 font-semibold text-gray-900">
                    ฿{order.total.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => openReceipt(order)}
                      className="text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box p-8 max-w-md bg-white rounded-2xl">
          <h3 className="font-bold text-xl text-gray-900 mb-6">แก้ไขข้อมูลส่วนตัว</h3>

          <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  ชื่อจริง
                </label>
                <input
                  id="edit_firstname"
                  type="text"
                  name="firstname"
                  value={editForm.firstname}
                  onChange={handleEditChange}
                  className="input input-bordered w-full rounded-xl"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  นามสกุล
                </label>
                <input
                  id="edit_lastname"
                  type="text"
                  name="lastname"
                  value={editForm.lastname}
                  onChange={handleEditChange}
                  className="input input-bordered w-full rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Username
              </label>
              <input
                id="edit_username"
                type="text"
                name="username"
                value={editForm.username}
                onChange={handleEditChange}
                className="input input-bordered w-full rounded-xl"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </label>
              <input
                id="edit_email"
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                className="input input-bordered w-full rounded-xl"
                required
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  วันเกิด
                </label>
                <input
                  id="edit_birth_date"
                  type="date"
                  name="birth_date"
                  value={editForm.birth_date}
                  onChange={handleEditChange}
                  className="input input-bordered w-full rounded-xl"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  เพศ
                </label>
                <select
                  id="edit_gender"
                  name="gender"
                  value={editForm.gender}
                  onChange={handleEditChange}
                  className="select select-bordered w-full rounded-xl"
                >
                  <option value="">-- ไม่ระบุ --</option>
                  <option value="male">ชาย</option>
                  <option value="female">หญิง</option>
                  <option value="other">อื่นๆ</option>
                  <option value="not specified">ไม่ต้องการระบุ</option>
                </select>
              </div>
            </div>

            {/* Password Section */}
            <div className="border-t border-base-200 pt-4 mt-1">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                เปลี่ยนรหัสผ่าน{" "}
                <span className="text-gray-400 font-normal">(เว้นว่างถ้าไม่ต้องการเปลี่ยน)</span>
              </p>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    รหัสผ่านปัจจุบัน
                  </label>
                  <input
                    id="edit_current_password"
                    type="password"
                    name="current_password"
                    value={editForm.current_password}
                    onChange={handleEditChange}
                    placeholder="กรอกรหัสผ่านที่ใช้งานอยู่"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    รหัสผ่านใหม่
                  </label>
                  <input
                    id="edit_password"
                    type="password"
                    name="password"
                    value={editForm.password}
                    onChange={handleEditChange}
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <input
                    id="edit_confirm_password"
                    type="password"
                    name="confirm_password"
                    value={editForm.confirm_password}
                    onChange={handleEditChange}
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                    className={`input input-bordered w-full rounded-xl ${
                      editForm.confirm_password && editForm.password !== editForm.confirm_password
                        ? "input-error"
                        : ""
                    }`}
                  />
                  {editForm.confirm_password && editForm.password !== editForm.confirm_password && (
                    <p className="text-red-500 text-xs mt-1">รหัสผ่านไม่ตรงกัน</p>
                  )}
                </div>
              </div>
            </div>

            {editError && (
              <p className="text-red-500 text-sm text-center">{editError}</p>
            )}
            {editSuccess && (
              <p className="text-green-600 text-sm text-center font-medium">
                ✓ บันทึกข้อมูลสำเร็จ!
              </p>
            )}

            <div className="flex gap-3 mt-2">
              <button
                id="edit_submit_btn"
                type="submit"
                disabled={editLoading}
                className="btn btn-primary flex-1 rounded-xl"
              >
                {editLoading ? "กำลังบันทึก..." : "บันทึก"}
              </button>
              <button
                id="edit_cancel_btn"
                type="button"
                onClick={() => document.getElementById("edit_profile_modal").close()}
                className="btn btn-outline flex-1 rounded-xl border-gray-300 text-gray-700"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Receipt Modal */}
      <dialog id="receipt_modal" className="modal">
        <div className="modal-box p-8 max-w-md bg-white rounded-2xl">
          {selectedOrder && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-2xl text-gray-900">
                  ใบเสร็จรับเงิน
                </h3>
                <p className="text-gray-500 mt-1">
                  ขอบคุณที่อุดหนุนสินค้าของเรา
                </p>
              </div>

              <div className="bg-base-50 rounded-xl p-5 mb-6 border border-base-200">
                <div className="flex justify-between mb-3 pb-3 border-b border-base-200">
                  <span className="text-gray-500 text-sm">รหัสคำสั่งซื้อ</span>
                  <span className="font-medium text-gray-900">
                    {selectedOrder.id}
                  </span>
                </div>
                <div className="flex justify-between mb-3 pb-3 border-b border-base-200">
                  <span className="text-gray-500 text-sm">วันที่</span>
                  <span className="font-medium text-gray-900">
                    {selectedOrder.date}
                  </span>
                </div>
                <div className="flex justify-between mb-3 pb-3 border-b border-base-200">
                  <span className="text-gray-500 text-sm">จำนวนสินค้า</span>
                  <span className="font-medium text-gray-900">
                    {selectedOrder.items} ชิ้น
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-gray-900">
                    ยอดรวมทั้งสิ้น
                  </span>
                  <span className="font-bold text-xl text-purple-600">
                    ฿{selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="modal-action flex flex-col gap-3 mt-0">
                <button className="btn btn-primary w-full rounded-xl">
                  ดาวน์โหลดใบเสร็จ (PDF)
                </button>
                <form method="dialog" className="w-full">
                  <button className="btn btn-outline w-full rounded-xl border-gray-300 text-gray-700">
                    ปิดหน้าต่าง
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default UserProfilePage;
