import { User, Award, Pencil, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext/AuthContext";

const ProfileInfo = ({ onEdit, successCount }) => {
  const { user: authUser } = useAuth();

  const getGenderText = (gender) => {
    switch (gender) {
      case "male":
        return "ชาย";
      case "female":
        return "หญิง";
      case "other":
        return "อื่นๆ";
      case "not specified":
        return "ไม่ต้องการระบุ";
      default:
        return "-";
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-base-200">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-2xl">
            {authUser?.firstname?.[0]?.toUpperCase() || <User size={40} />}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {authUser ? `${authUser.firstname} ${authUser.lastname}` : "-"}
            </h1>
            <p className="text-gray-500 text-sm">
              @{authUser?.username || "-"} &bull; Member since{" "}
              {authUser?.createdAt
                ? new Date(authUser.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-yellow-100/80 border border-yellow-200 text-yellow-700 px-5 py-3 rounded-xl flex items-center gap-2">
            <Award size={20} />
            <span className="font-semibold text-sm">
              {authUser?.role === "admin" ? "Admin" : "Member"}
            </span>
          </div>
          {authUser?.role !== "admin" && (
            <div className="bg-green-100/80 border border-green-200 text-green-700 px-5 py-3 rounded-xl flex items-center gap-2">
              <CheckCircle size={20} />
              <span className="font-semibold text-sm">{successCount} ซื้อสำเร็จ</span>
            </div>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            ข้อมูลส่วนตัวทั้งหมด
          </h2>
          <button
            onClick={onEdit}
            className="btn btn-primary btn-sm rounded-xl gap-2 text-white"
          >
            <Pencil size={14} /> แก้ไขข้อมูล
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-4 bg-base-50 rounded-xl border border-base-200">
            <span className="text-gray-500 block mb-1">ชื่อ-นามสกุล</span>
            <span className="font-semibold text-gray-900 text-base">
              {authUser?.firstname} {authUser?.lastname}
            </span>
          </div>
          <div className="p-4 bg-base-50 rounded-xl border border-base-200">
            <span className="text-gray-500 block mb-1">Username</span>
            <span className="font-semibold text-gray-900 text-base">
              @{authUser?.username || "-"}
            </span>
          </div>
          <div className="p-4 bg-base-50 rounded-xl border border-base-200">
            <span className="text-gray-500 block mb-1">อีเมล</span>
            <span className="font-semibold text-gray-900 text-base">
              {authUser?.email || "-"}
            </span>
          </div>
          <div className="p-4 bg-base-50 rounded-xl border border-base-200">
            <span className="text-gray-500 block mb-1">วันเกิด</span>
            <span className="font-semibold text-gray-900 text-base">
              {authUser?.birth_date
                ? new Date(authUser.birth_date).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "ไม่ได้ระบุ"}
            </span>
          </div>
          <div className="p-4 bg-base-50 rounded-xl border border-base-200">
            <span className="text-gray-500 block mb-1">เพศ</span>
            <span className="font-semibold text-gray-900 text-base">
              {getGenderText(authUser?.gender)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
