import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Optionally clear cart here instead if it wasn't cleared before redirect
    // (In our case we clear it after Stripe is successful, but actually 
    // it's better to clear it when the webhook is received or here)
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center">
      <div className="card bg-base-100 shadow-xl border border-success/30 p-8 space-y-4">
        <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto text-4xl">
          ✓
        </div>
        <h2 className="text-3xl font-bold">ชำระเงินสำเร็จ!</h2>
        <p className="text-base-content/70">
          ขอบคุณสำหรับการสั่งซื้อ ระบบได้รับยอดเงินของคุณเรียบร้อยแล้วและกำลังดำเนินการ
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
          <button onClick={() => navigate('/orders')} className="btn btn-primary">
            ดูประวัติคำสั่งซื้อ
          </button>
          <button onClick={() => navigate('/')} className="btn btn-outline">
            กลับสู่หน้าแรก
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
