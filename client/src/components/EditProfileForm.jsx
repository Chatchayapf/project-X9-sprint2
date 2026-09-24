import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { updateUserProfile } from "../services/userServices";
import { useAuth } from "../context/AuthContext/AuthContext";

const EditProfileForm = ({ onCancel }) => {
  const { user: authUser, setUser } = useAuth();

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

  // ดึงข้อมูลเดิมมาใส่ตอนเปิดฟอร์ม
  useEffect(() => {
    setEditForm((prev) => ({
      ...prev,
      firstname: authUser?.firstname ?? "",
      lastname: authUser?.lastname ?? "",
      username: authUser?.username ?? "",
      email: authUser?.email ?? "",
      birth_date: authUser?.birth_date
        ? new Date(authUser.birth_date).toISOString().split("T")[0]
        : "",
      gender: authUser?.gender ?? "",
    }));
  }, [authUser]);

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess(false);

    if (
      editForm.password ||
      editForm.confirm_password ||
      editForm.current_password
    ) {
      if (!editForm.current_password)
        return setEditError("กรุณาระบุรหัสผ่านปัจจุบัน");
      if (!editForm.password) return setEditError("กรุณาระบุรหัสผ่านใหม่");
      if (editForm.password.length < 6)
        return setEditError("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
      if (editForm.password !== editForm.confirm_password)
        return setEditError("รหัสผ่านไม่ตรงกัน");
      if (editForm.password === editForm.current_password)
        return setEditError("รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม");
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
      setUser((prev) => ({ ...prev, ...(res.data ?? payload) }));
      setEditSuccess(true);
      setTimeout(() => onCancel(), 1000);
    } catch (err) {
      setEditError(err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <form onSubmit={handleEditSubmit}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">แก้ไขข้อมูลส่วนตัว</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost btn-sm rounded-xl gap-1"
          >
            <X size={16} /> ยกเลิก
          </button>
          <button
            type="submit"
            disabled={editLoading}
            className="btn btn-primary btn-sm rounded-xl text-white gap-1"
          >
            <Check size={16} /> {editLoading ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ชื่อ */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            ชื่อจริง
          </label>
          <input
            type="text"
            name="firstname"
            value={editForm.firstname}
            onChange={handleEditChange}
            className="input input-bordered w-full rounded-xl"
            required
          />
        </div>
        {/* นามสกุล */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            นามสกุล
          </label>
          <input
            type="text"
            name="lastname"
            value={editForm.lastname}
            onChange={handleEditChange}
            className="input input-bordered w-full rounded-xl"
            required
          />
        </div>
        {/* Username */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={editForm.username}
            onChange={handleEditChange}
            className="input input-bordered w-full rounded-xl"
            required
          />
        </div>
        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={editForm.email}
            onChange={handleEditChange}
            className="input input-bordered w-full rounded-xl"
            required
          />
        </div>
        {/* วันเกิด */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            วันเกิด
          </label>
          <input
            type="date"
            name="birth_date"
            value={editForm.birth_date}
            onChange={handleEditChange}
            className="input input-bordered w-full rounded-xl"
          />
        </div>
        {/* เพศ */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            เพศ
          </label>
          <select
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

      <div className="border-t border-base-200 pt-4 mt-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          เปลี่ยนรหัสผ่าน{" "}
          <span className="text-gray-400 font-normal">
            (เว้นว่างไว้หากไม่ต้องการเปลี่ยน)
          </span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="password"
            name="current_password"
            value={editForm.current_password}
            onChange={handleEditChange}
            placeholder="รหัสผ่านปัจจุบัน"
            className="input input-bordered w-full rounded-xl"
          />
          <input
            type="password"
            name="password"
            value={editForm.password}
            onChange={handleEditChange}
            placeholder="รหัสผ่านใหม่"
            className="input input-bordered w-full rounded-xl"
          />
          <input
            type="password"
            name="confirm_password"
            value={editForm.confirm_password}
            onChange={handleEditChange}
            placeholder="ยืนยันรหัสผ่านใหม่"
            className={`input input-bordered w-full rounded-xl ${editForm.confirm_password && editForm.password !== editForm.confirm_password ? "input-error" : ""}`}
          />
        </div>
      </div>

      {editError && (
        <p className="text-red-500 text-sm mt-4 text-center font-medium">
          {editError}
        </p>
      )}
      {editSuccess && (
        <p className="text-green-600 text-sm mt-4 text-center font-medium">
          ✓ บันทึกข้อมูลเรียบร้อยแล้ว
        </p>
      )}
    </form>
  );
};

export default EditProfileForm;
