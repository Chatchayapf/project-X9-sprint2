import { useCallback, useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import { DollarSign, Package, ShoppingBag } from "lucide-react";
import {
  createProduct,
  deleteProduct,
  getAdminStats,
  getAllProducts,
  updateProduct,
} from "../services/adminServices";

const EMPTY_STATS = {
  totalRevenue: 0,
  totalSales: 0,
  totalProducts: 0,
  productSales: {},
};

const getProductList = (response) => {
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};

const getStats = (response) => response?.data || response || EMPTY_STATS;

const getFirstImage = (images) => (Array.isArray(images) ? images[0] : images);

const formatPrice = (price) => `฿${Number(price || 0).toLocaleString()}`;

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [productsResponse, statsResponse] = await Promise.all([
        getAllProducts(),
        getAdminStats(),
      ]);
      setProducts(getProductList(productsResponse));
      setStats(getStats(statsResponse));
    } catch (requestError) {
      setError(requestError.message || "ไม่สามารถโหลดข้อมูลสินค้าได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchDashboard, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchDashboard]);

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?")) return;

    try {
      await deleteProduct(id);
      alert("ลบสินค้าสำเร็จ!");
      await fetchDashboard();
    } catch (requestError) {
      alert("ลบสินค้าไม่สำเร็จ: " + requestError.message);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
        alert("อัปเดตสินค้าสำเร็จ!");
      } else {
        await createProduct(formData);
        alert("เพิ่มสินค้าสำเร็จ!");
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      await fetchDashboard();
    } catch (requestError) {
      alert("เกิดข้อผิดพลาด: " + requestError.message);
      throw requestError;
    }
  };

  const totalRevenue = Number(stats.totalRevenue || 0);
  const totalSales = Number(stats.totalSales || 0);
  const totalProducts = Number(stats.totalProducts ?? products.length);
  const productSales = stats.productSales || {};

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-gray-50/50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Product Management
        </h1>
      </div>

      {error && (
        <div role="alert" className="alert alert-error mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Total Revenue
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatPrice(totalRevenue)}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Package size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Total Products
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {totalProducts.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <ShoppingBag size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Total Sales
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {totalSales.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">Product Inventory</h3>
          <button
            type="button"
            className="btn btn-sm bg-purple-600 hover:bg-purple-700 border-none text-white shadow-sm rounded-lg"
            onClick={handleAddClick}
            disabled={loading}
          >
            + Add New Product
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 font-semibold">Product Name</th>
                <th className="py-4 px-6 font-semibold">Type</th>
                <th className="py-4 px-6 font-semibold">Price</th>
                <th className="py-4 px-6 font-semibold text-center">Total Sales</th>
                <th className="py-4 px-6 font-semibold text-center">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    ไม่มีข้อมูลสินค้า
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const image = getFirstImage(product.img_url);
                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50/50 border-b border-gray-50 last:border-0 text-sm"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {image ? (
                              <img
                                src={image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                          {product.tag || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="py-4 px-6 text-center text-gray-600">
                        {Number(productSales[product._id] || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-3">
                        <button
                          type="button"
                          className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
                          onClick={() => handleEditClick(product)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 font-medium transition-colors"
                          onClick={() => handleDeleteClick(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminProductsPage;
