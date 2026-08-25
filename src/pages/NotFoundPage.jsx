import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="hero min-h-[60vh] bg-base-100">
      <div className="hero-content text-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-6xl font-extrabold text-primary">404</h1>
          <p className="text-xl text-base-content/70">ไม่พบหน้าที่คุณต้องการ</p>
          <Link to="/" className="btn btn-primary mt-6">
            <Home className="w-4 h-4" />
            <span>กลับหน้าแรก</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default NotFoundPage;
