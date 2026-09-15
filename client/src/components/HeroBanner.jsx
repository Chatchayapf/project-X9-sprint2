import { Link } from "react-router-dom";

const categories = [
    { label: "Ebook", subLabel: "อีบุ๊ก", emoji: "📚" },
    { label: "Template", subLabel: "เทมเพลต", emoji: "📄" },
    { label: "Souvenir", subLabel: "ของที่ระลึก", emoji: "🎁" },
    { label: "T-shirt Design", subLabel: "ออกแบบเสื้อ", emoji: "👕" },
];

const HeroBanner = ({ onCategoryClick }) => {
    return (
        <section className="relative w-full overflow-hidden bg-[#120c08] text-white px-4 md:px-8 lg:px-12 py-10 md:py-20 shadow-2xl">
            <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-[#8a3c1b]/40 via-[#5c2711]/20 to-transparent blur-[80px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-[#a64e24]/30 via-[#5c2711]/15 to-transparent blur-[100px] -translate-y-1/4 translate-x-1/4 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-[#6e3015]/15 blur-[90px] rounded-full pointer-events-none" />
            <div className="relative z-10 w-full max-w-[1720px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14">
                <div className="flex-1 w-full max-w-3xl xl:max-w-4xl text-center lg:text-left">
                    <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[72px] xl:text-[80px] font-black text-white leading-[1.05] tracking-tight">
                        Digital <span className="text-[#e27d4c]">products</span>
                        <br />
                        instant delivery
                    </h1>
                    <ul className="mt-6 sm:mt-9 space-y-3 text-gray-200 text-sm sm:text-lg md:text-xl font-normal inline-block text-left w-full">
                        <li className="flex items-start gap-3">
                            <span className="text-[#e27d4c] font-bold text-lg md:text-2xl mt-0.5 shrink-0">
                                ✓
                            </span>
                            <span>ดิจิทัลไฟล์คุณภาพสูง พร้อมใช้งานทันที</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#e27d4c] font-bold text-lg md:text-2xl mt-0.5 shrink-0">
                                ✓
                            </span>
                            <span>
                                ไม่ต้องรอจัดส่ง ยกระดับงานของคุณได้ตั้งแต่วันนี้
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#e27d4c] font-bold text-lg md:text-2xl mt-0.5 shrink-0">
                                ✓
                            </span>
                            <span>ชำระเงินปุ๊บ รับสิทธิ์ดาวน์โหลดปั๊บ</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#e27d4c] font-bold text-lg md:text-2xl mt-0.5 shrink-0">
                                ✓
                            </span>
                            <span>
                                นำไปต่อยอดโตไอเดียของคุณได้แบบไม่มีข้อจำกัด
                            </span>
                        </li>
                    </ul>
                    <div className="mt-10 sm:mt-11 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-5">
                        <Link
                            to="/#products"
                            className="btn btn-lg px-10 sm:px-12 rounded-2xl bg-white text-black hover:bg-gray-100 shadow-2xl hover:shadow-orange-500/25 hover:scale-105 border-none transition-all"
                        >
                            ดูสินค้าทั้งหมด →
                        </Link>
                        <Link
                            to="/custom-order"
                            className="btn btn-outline btn-lg px-9 sm:px-11 rounded-2xl text-white border-[#8a3c1b]/40 hover:bg-[#3d251a] hover:border-[#e27d4c]/60 backdrop-blur-sm transition-all"
                        >
                            สั่งทำพิเศษ
                        </Link>
                    </div>
                </div>
                <div className="w-full lg:w-auto lg:flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-5 mt-6 lg:mt-0">
                    {categories.map((cat) => (
                        <button
                            key={cat.label}
                            onClick={() =>
                                onCategoryClick && onCategoryClick(cat.label)
                            }
                            className="card glass bg-[#241610]/75 hover:bg-[#331f16] border border-[#8a3c1b]/35 hover:border-[#e27d4c]/70 rounded-3xl p-5 lg:p-8 py-10 lg:py-14 shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 hover:shadow-orange-950/40 items-center justify-center gap-4 lg:gap-5 h-full"
                        >
                            <span className="text-5xl lg:text-6xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                                {cat.emoji}
                            </span>
                            <div className="text-center mt-2">
                                <div className="font-bold text-white text-base lg:text-xl tracking-tight leading-tight">
                                    {cat.label}
                                </div>
                                <div className="text-gray-400 text-xs lg:text-sm mt-2">
                                    {cat.subLabel}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;
