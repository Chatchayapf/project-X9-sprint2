import { Link } from "react-router-dom";
import { ShieldX, Home } from "lucide-react";

const Forbidden = () => {
  return (
    <div className="hero min-h-[60vh] bg-base-100">
      <div className="hero-content text-center">
        <div className="max-w-md space-y-6">
          <ShieldX className="w-16 h-16 text-error mx-auto" />
          <h1 className="text-6xl font-extrabold text-error">403</h1>
          <p className="text-xl text-base-content/70">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
          <p className="text-sm text-base-content/60">
            หน้านี้สงวนไว้สำหรับผู้ดูแลระบบ (Admin) เท่านั้น
          </p>
          <Link to="/" className="btn btn-primary mt-6">
            <Home className="w-4 h-4" />
            <span>กลับหน้าแรก</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Forbidden;
