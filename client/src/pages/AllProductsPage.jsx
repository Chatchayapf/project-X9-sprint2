import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext/CartContext';

const filterTabs = ['All type', 'Ebook', 'Template', 'Souvenir', 'T-shirt Design'];

export default function AllProductsPage() {
  const { handleAddToCart } = useCart();
  const location = useLocation();
  const initialFilter = location.state?.filter ?? 'All type';
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) => {
    const matchFilter = activeFilter === 'All type' || p.tag === activeFilter;
    const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-10">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-base-content/60 hover:text-primary transition-colors mb-3"
          >
            ← กลับหน้าหลัก
          </Link>
          <h1 className="text-3xl font-bold text-base-content">สินค้าทั้งหมด</h1>
          <p className="text-base-content/50 text-sm mt-1">
            แสดง {filtered.length} รายการ จากทั้งหมด {products.length} รายการ
          </p>
        </div>
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`btn btn-sm rounded-full ${activeFilter === tab ? 'btn-neutral' : 'btn-outline'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
            <div className="card-body p-3 gap-1.5">
              <div className={`badge badge-sm border-none w-fit ${product.tagColor}`}>
                {product.tag}
              </div>
              <h3 className="card-title text-xs font-semibold leading-snug line-clamp-2 mt-1">
                {product.name}
              </h3>
              <p className="text-[10px] text-base-content/60 leading-relaxed line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-base-content/60">
                <span className="text-warning">★</span>
                <span>{product.rating}</span>
                <span className="opacity-70">({product.reviews})</span>
                <span className="ml-auto opacity-70 truncate max-w-[50px]">โหลด {product.quantity.toLocaleString()}</span>
              </div>
              <div className="card-actions justify-between items-center mt-auto pt-2 border-t border-base-200">
                <span className="text-sm font-bold">฿{product.price}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn btn-primary btn-xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg">ไม่พบสินค้าที่ตรงกับการค้นหา</p>
        </div>
      )}
    </div>
  );
}