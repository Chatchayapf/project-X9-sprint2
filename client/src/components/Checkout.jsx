import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { checkoutCart } from '../services/checkoutServices';

const Checkout = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    paymentMethod: 'credit_card'
  });

  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = cartSubtotal * 0.07;
  const total = cartSubtotal + tax;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setCheckoutError('');
    setIsSubmitting(true);

    try {
      await checkoutCart();
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      setCheckoutError(error.message || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="card bg-base-100 shadow-xl border border-success/30 p-8 space-y-4">
          <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto text-4xl">
            ✓
          </div>
          <h2 className="text-3xl font-bold">สั่งซื้อสำเร็จ!</h2>
          <p className="text-base-content/70">
            ขอบคุณสำหรับการสั่งซื้อ ระบบได้ส่งรายละเอียดและลิงก์ดาวน์โหลดสินค้าไปที่อีเมล <span className="font-semibold text-base-content">{formData.email}</span> แล้ว
          </p>
          <div className="pt-4">
            <button onClick={() => navigate('/orders')} className="btn btn-primary mr-2">
              View My Orders
            </button>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              กลับสู่หน้าแรก
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">ตะกร้าสินค้าว่างเปล่า</h2>
        <Link to="/#products" className="btn btn-primary">ไปเลือกซื้อสินค้ากันเลย</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form */}
        <div className="lg:col-span-7 space-y-6">
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="card bg-base-100 shadow-sm border border-base-200 p-6 space-y-4">
            <h2 className="text-xl font-semibold border-b border-base-200 pb-2">ข้อมูลผู้สั่งซื้อ (Billing Details)</h2>
            
            <div className="form-control">
              <label className="label"><span className="label-text">ชื่อ-นามสกุล</span></label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input input-bordered w-full" placeholder="John Doe" />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">อีเมล (สำหรับรับลิงก์ดาวน์โหลด)</span></label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input input-bordered w-full" placeholder="john@example.com" />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">ที่อยู่ (Option)</span></label>
              <textarea name="address" value={formData.address} onChange={handleChange} className="textarea textarea-bordered h-24" placeholder="กรอกที่อยู่ (ถ้ามี)"></textarea>
            </div>

            <h2 className="text-xl font-semibold border-b border-base-200 pb-2 mt-6">วิธีการชำระเงิน (Payment)</h2>
            <div className="space-y-2">
              <label className="label cursor-pointer justify-start gap-3 border p-3 rounded-lg hover:bg-base-200 transition">
                <input type="radio" name="paymentMethod" value="credit_card" className="radio radio-primary" checked={formData.paymentMethod === 'credit_card'} onChange={handleChange} />
                <span className="label-text font-medium flex items-center gap-2">💳 บัตรเครดิต / เดบิต</span>
              </label>
              <label className="label cursor-pointer justify-start gap-3 border p-3 rounded-lg hover:bg-base-200 transition">
                <input type="radio" name="paymentMethod" value="promptpay" className="radio radio-primary" checked={formData.paymentMethod === 'promptpay'} onChange={handleChange} />
                <span className="label-text font-medium flex items-center gap-2">📱 พร้อมเพย์ (PromptPay)</span>
              </label>
            </div>
          </form>
        </div>

        {/* Right Order Summary */}
        <div className="lg:col-span-5">
          <div className="card bg-base-100 shadow-sm border border-base-200 p-6 sticky top-24">
            <h2 className="text-xl font-semibold border-b border-base-200 pb-2 mb-4">สรุปคำสั่งซื้อ (Order Summary)</h2>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                    <div className="text-xs text-base-content/60 mt-1">จำนวน: {item.quantity}</div>
                  </div>
                  <div className="font-semibold text-sm whitespace-nowrap">฿{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="divider my-4"></div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/70">มูลค่าสินค้า (Subtotal)</span>
                <span>฿{cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/70">ภาษีมูลค่าเพิ่ม (VAT 7%)</span>
                <span>฿{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="divider my-4"></div>

            <div className="flex justify-between items-center font-bold text-lg">
              <span>ยอดชำระสุทธิ (Total)</span>
              <span className="text-primary text-xl">฿{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            {checkoutError && (
              <p role="alert" className="text-error text-sm mt-4">{checkoutError}</p>
            )}
            <button type="submit" form="checkout-form" disabled={isSubmitting} className="btn btn-primary w-full mt-6 text-lg">
              ยืนยันการสั่งซื้อ (Place Order)
            </button>
            <p className="text-center text-xs text-base-content/50 mt-3">
              *การชำระเงินนี้เป็นการจำลองระบบ (Simulated Payment)
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
