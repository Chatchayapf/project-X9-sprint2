import { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";

const filterTabs = [
  "All type",
  "Ebook",
  "Template",
  "Souvenir",
  "T-shirt Design",
];

const ProductGrid = ({
  onAddToCart,
  activeFilter = "All type",
  setActiveFilter,
}) => {
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const matchFilter = activeFilter === "All type" || p.tag === activeFilter;
    const matchSearch = (p.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <section id="products" className="w-full px-4 md:px-8 lg:px-12 py-10">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2 items-center">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`btn btn-sm rounded-full ${
                activeFilter === tab ? "btn-neutral" : "btn-outline"
              }`}
            >
              {tab}
            </button>
          ))}
          {/* Separator */}
          <span className="w-px h-5 bg-base-content/20 mx-1 hidden sm:block" />
          <Link
            to="/all-products"
            className="btn btn-sm btn-primary rounded-full gap-1.5 shadow-sm"
          >
            ดูทั้งหมด
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered input-sm pl-9 rounded-full w-full max-w-xs"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-200 border border-base-200"
          >
            {/* รูปสินค้า — คลิกเพื่อดูรายละเอียด */}
            <Link
              to={`/product/${product.id}`}
              className="block relative group/img w-full aspect-square bg-base-200 flex items-center justify-center overflow-hidden cursor-pointer"
            >
              <img
                src={`/images/products/product-${product.id}.jpg`}
                alt={product.name}
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                <span className="opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 text-[10px] font-semibold text-white bg-black/50 px-2 py-0.5 rounded-full">
                  ดูรายละเอียด
                </span>
              </div>
            </Link>
            {/* ข้อมูลสินค้า */}
            <div className="card-body p-3 gap-1.5">
              {/* Tag */}
              <div
                className={`badge badge-sm border-none w-fit ${product.tagColor}`}
              >
                {product.tag}
              </div>
              {/* ชื่อและคำอธิบาย */}
              <h3 className="card-title text-xs font-semibold leading-snug line-clamp-2 mt-1">
                {product.name}
              </h3>
              <p className="text-[10px] text-base-content/60 leading-relaxed line-clamp-2">
                {product.description}
              </p>
              {/* Rating */}
              <div className="flex items-center gap-1 text-[10px] text-base-content/60">
                <span className="text-warning">★</span>
                <span>{product.rating}</span>
                <span className="opacity-70">({product.reviews})</span>
                <span className="ml-auto opacity-70 truncate max-w-[50px]">
                  โหลด {product.quantity.toLocaleString()}
                </span>
              </div>
              {/* ราคา + ปุ่ม Add to Cart */}
              <div className="card-actions justify-between items-center mt-auto pt-2 border-t border-base-200">
                <span className="text-sm font-bold">฿{product.price}</span>
                <button
                  onClick={() => onAddToCart(product)}
                  className="btn btn-primary btn-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p>ไม่พบสินค้าที่ตรงกับการค้นหา</p>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
