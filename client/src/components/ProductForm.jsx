import { useState, useEffect } from "react";

const ProductForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    date: new Date().toISOString().split("T")[0],
    tag: "All type",
    img_url: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        date: initialData.date || new Date().toISOString().split("T")[0],
        tag: initialData.tag || "All type",
        img_url: initialData.img_url ? initialData.img_url[0] : "",
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "กรุณากรอกชื่อสินค้า";
    if (!formData.description.trim()) newErrors.description = "กรุณากรอกรายละเอียดสินค้า";
    
    if (formData.price === "" || isNaN(formData.price)) {
      newErrors.price = "กรุณากรอกราคาให้ถูกต้อง";
    } else if (Number(formData.price) < 0) {
      newErrors.price = "ราคาต้องไม่ติดลบ";
    }

    if (!formData.date) newErrors.date = "กรุณาเลือกวันที่";
    if (!formData.tag.trim()) newErrors.tag = "กรุณาเลือกหรือกรอกหมวดหมู่ (Tag)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // transform img_url string to array to match backend model
      const submitData = { ...formData, img_url: [formData.img_url] };
      onSubmit(submitData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-base-100 w-full max-w-lg rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">
          {initialData ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="form-control">
            <label className="label font-medium">ชื่อสินค้า <span className="text-error">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
              placeholder="เช่น เสื้อยืดพิมพ์ลาย"
            />
            {errors.name && <span className="text-error text-sm mt-1">{errors.name}</span>}
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label font-medium">รายละเอียด <span className="text-error">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`textarea textarea-bordered h-24 w-full ${errors.description ? 'textarea-error' : ''}`}
              placeholder="คำอธิบายสินค้าเบื้องต้น..."
            />
            {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
          </div>

          <div className="flex gap-4">
            {/* Price */}
            <div className="form-control w-1/2">
              <label className="label font-medium">ราคา (฿) <span className="text-error">*</span></label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.price ? 'input-error' : ''}`}
                placeholder="0.00"
              />
              {errors.price && <span className="text-error text-sm mt-1">{errors.price}</span>}
            </div>

            {/* Date */}
            <div className="form-control w-1/2">
              <label className="label font-medium">วันที่ลงสินค้า <span className="text-error">*</span></label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.date ? 'input-error' : ''}`}
              />
              {errors.date && <span className="text-error text-sm mt-1">{errors.date}</span>}
            </div>
          </div>

          {/* Tag */}
          <div className="form-control">
            <label className="label font-medium">หมวดหมู่ (Tag) <span className="text-error">*</span></label>
            <select
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              className={`select select-bordered w-full ${errors.tag ? 'select-error' : ''}`}
            >
              <option value="All type">All type</option>
              <option value="Ebook">Ebook</option>
              <option value="Template">Template</option>
              <option value="Souvenir">Souvenir</option>
              <option value="T-shirt Design">T-shirt Design</option>
            </select>
            {errors.tag && <span className="text-error text-sm mt-1">{errors.tag}</span>}
          </div>

          {/* Image URL */}
          <div className="form-control">
            <label className="label font-medium">URL รูปภาพ</label>
            <input
              type="url"
              name="img_url"
              value={formData.img_url}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              ยกเลิก
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
