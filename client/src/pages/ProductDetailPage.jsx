import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { tagEmoji } from "../data/products";
import { useCart } from "../context/CartContext/CartContext";
import { getProductById } from "../services/productsServices";

export default function ProductDetailPage() {
  const { handleAddToCart } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-base-content/50">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4">กำลังโหลดข้อมูลสินค้า...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-base-content/50">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-bold">ไม่พบสินค้า</h2>
        <Link to="/" className="btn btn-primary btn-sm rounded-full">
          กลับหน้าหลัก
        </Link>
      </div>
    );
  }

  const images = product.images ?? [tagEmoji(product.tag)];

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-10 max-w-5xl mx-auto">
      {/* Back + Category chips */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Link
          to="/all-products"
          className="inline-flex items-center gap-1.5 text-sm text-base-content/60 hover:text-primary transition-colors"
        >
          ← สินค้าทั้งหมด
        </Link>
        <span className="w-px h-4 bg-base-content/20 mx-1" />
        {["Ebook", "Template", "Souvenir", "T-shirt Design"].map((cat) => (
          <Link
            key={cat}
            to="/all-products"
            state={{ filter: cat }}
            className={`btn btn-xs btn-outline rounded-full ${product.tag === cat ? "btn-neutral text-base-content border-base-content" : ""}`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ---- Left: Image Gallery ---- */}
        <div className="flex flex-col gap-3">
          {/* Main image */}
          <div className="bg-base-200 rounded-2xl flex items-center justify-center overflow-hidden aspect-square shadow-inner select-none transition-all duration-200">
            <img
              src={product.img_url ? product.img_url[0] : `/images/products/product-${product.id}.jpg`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl bg-base-200 flex items-center justify-center text-3xl transition-all duration-150 border-2 ${
                    selectedImage === idx
                      ? "border-primary scale-105 shadow-md"
                      : "border-transparent hover:border-base-300"
                  }`}
                >
                  {img}
                </button>
              ))}
            </div>
          )}

          {/* Image count badge */}
          <p className="text-xs text-base-content/40">
            รูปภาพที่ {selectedImage + 1} / {images.length} —
            รูปภาพจริงจะอัปเดตภายหลัง
          </p>
        </div>

        {/* ---- Right: Product Info ---- */}
        <div className="flex flex-col gap-4">
          {/* Tag */}
          <span
            className={`badge badge-sm border-none w-fit ${product.tagColor}`}
          >
            {product.tag}
          </span>

          {/* Title */}
          <h1 className="text-3xl font-bold text-base-content leading-snug">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <span className="text-warning text-base">★</span>
            <span className="font-semibold text-base-content">
              {product.rating}
            </span>
            <span>({product.reviews} รีวิว)</span>
            <span className="ml-2 opacity-60">
              • {product.details?.pages || product.details?.slides || product.details?.quantity || "ไฟล์ดิจิทัล"}
            </span>
          </div>

          {/* Description */}
          <p className="text-base-content/70 leading-relaxed text-sm">
            {product.description}
          </p>

          <div className="divider my-1" />

          {/* Price */}
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-base-content">
              ฿{product.price}
            </span>
            <span className="text-base-content/40 text-sm mb-1">/ ไฟล์</span>
          </div>



          {/* File info */}
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-outline badge-sm gap-1">
              📁 ไฟล์ดิจิทัล
            </span>
            <span className="badge badge-outline badge-sm gap-1">
              ⚡ รับทันทีหลังชำระ
            </span>
            <span className="badge badge-outline badge-sm gap-1">
              🖼️ {images.length} รูปภาพ
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              onClick={() => handleAddToCart(product)}
              className="btn btn-primary flex-1 rounded-xl gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              เพิ่มลงตะกร้า
            </button>
          </div>
        </div>
      </div>

      {/* ---- Spec Table ---- */}
      {product.details && (
        <div className="mt-10 border-t border-base-200 pt-8">
          <h2 className="text-lg font-bold text-base-content mb-4">
            รายละเอียดสินค้า
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-0 bg-base-200/40 rounded-2xl p-6">
            {Object.entries(product.details).map(([key, value]) => {
              const labelMap = {
                pages: "จำนวนหน้า",
                slides: "จำนวนสไลด์",
                quantity: "จำนวน",
                format: "รูปแบบไฟล์",
                language: "ภาษา",
                suitableFor: "เหมาะสำหรับ",
                license: "สิทธิ์การใช้งาน",
                software: "โปรแกรมที่รองรับ",
                editability: "การปรับแต่ง",
                colorScheme: "ชุดสี",
                resolution: "ความละเอียด",
                printMethod: "วิธีพิมพ์/สกรีน",
                colors: "จำนวนสี",
                platform: "แพลตฟอร์ม",
                usage: "การใช้งาน",
                lastUpdated: "อัปเดตล่าสุด",
              };
              const label = labelMap[key] ?? key;
              return (
                <div
                  key={key}
                  className="flex items-start gap-3 py-3 border-b border-base-200/60 last:border-none"
                >
                  <span className="text-xs text-base-content/50 w-36 shrink-0 pt-0.5">
                    {label}
                  </span>
                  <span className="text-sm text-base-content font-medium">
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
