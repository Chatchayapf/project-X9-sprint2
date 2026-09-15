import { Link } from 'react-router-dom';

const CustomOrderCTA = () => {
  return (
    <div id="custom-order-cta" className="w-full px-4 md:px-8 lg:px-12 py-8 bg-gray-50">
      <div className="w-full">
        {/* Label */}
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
          สั่งทำงานออกแบบเฉพาะ
        </p>

        {/* Main Container: Warm Espresso / Terracotta Glow สไตล์ */}
        <div className="relative overflow-hidden rounded-2xl bg-[#120c08] text-white shadow-2xl">

          {/* Glow Effect — แสงสีส้มอิฐ/น้ำตาลอบอุ่น */}
          <div className="absolute bottom-0 left-0 right-0 h-[220px] bg-gradient-to-t from-[#8a3c1b]/40 via-[#5c2711]/15 to-transparent blur-[60px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-[#a64e24]/30 via-[#5c2711]/15 to-transparent blur-[90px] -translate-y-1/3 translate-x-1/4 rounded-full pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* ด้านซ้าย: ข้อความ */}
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                ต้องการงานสั่งทำพิเศษใช่ไหม?
              </h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                สั่งทำภาพประกอบ, ชุดแบรนด์ (Brand Kit) หรือเทมเพลตที่ออกแบบเฉพาะสำหรับธุรกิจคุณ
                <br />— พร้อมส่งมอบภายใน 5–7 วันทำการ
              </p>
            </div>

            {/* ด้านขวา: ปุ่ม */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link to="/custom-order" className="btn btn-lg bg-white text-black hover:bg-gray-100 rounded-xl whitespace-nowrap shadow-lg border-none transition-colors flex items-center justify-center">
                สั่งทำสินค้าเฉพาะ →
              </Link>
              <Link to="/#contact" className="btn btn-lg btn-outline text-white bg-[#2d1b13]/80 hover:bg-[#3d251a] border-[#8a3c1b]/40 hover:border-[#8a3c1b]/60 rounded-xl whitespace-nowrap backdrop-blur-sm transition-colors flex items-center justify-center">
                สอบถามเพิ่มเติม
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrderCTA;
