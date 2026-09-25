import { useEffect, useRef, useState } from "react";

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const getToday = () => new Date().toISOString().split("T")[0];

const getImages = (initialData) => {
  const images = initialData?.img_url;
  if (Array.isArray(images)) return images.filter(Boolean);
  if (typeof images === "string") return [images];
  return [];
};

const getFormData = (initialData) => ({
  name: initialData?.name || "",
  description: initialData?.description || "",
  price: initialData?.price ?? "",
  date: initialData?.date || getToday(),
  tag: initialData?.tag || "All type",
});

const ProductForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(() => getFormData(initialData));
  const [existingImages, setExistingImages] = useState(() => getImages(initialData));
  const [removedExistingImages, setRemovedExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPreviews, setSelectedPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const objectUrlsRef = useRef([]);

  useEffect(() => {
    setFormData(getFormData(initialData));
    setExistingImages(getImages(initialData));
    setRemovedExistingImages([]);
    setSelectedFiles([]);
    setSelectedPreviews([]);
    setErrors({});

    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "กรุณากรอกชื่อสินค้า";
    if (!formData.description.trim()) newErrors.description = "กรุณากรอกรายละเอียดสินค้า";

    if (formData.price === "" || !Number.isFinite(Number(formData.price))) {
      newErrors.price = "กรุณากรอกราคาให้ถูกต้อง";
    } else if (Number(formData.price) < 0) {
      newErrors.price = "ราคาต้องไม่ติดลบ";
    }

    if (!formData.date) newErrors.date = "กรุณาเลือกวันที่";
    if (!formData.tag.trim()) newErrors.tag = "กรุณาเลือกหมวดหมู่ (Tag)";
    if (existingImages.length + selectedFiles.length === 0) {
      newErrors.images = "กรุณาเลือกรูปภาพอย่างน้อย 1 รูป";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) {
      setErrors((previous) => ({ ...previous, [name]: null }));
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    const nextImageCount = existingImages.length + selectedFiles.length + files.length;
    if (nextImageCount > MAX_IMAGES) {
      setErrors((previous) => ({
        ...previous,
        images: `เลือกรูปได้ไม่เกิน ${MAX_IMAGES} รูป`,
      }));
      return;
    }

    if (files.some((file) => !file.type.startsWith("image/"))) {
      setErrors((previous) => ({
        ...previous,
        images: "กรุณาเลือกไฟล์รูปภาพเท่านั้น",
      }));
      return;
    }

    if (files.some((file) => file.size > MAX_IMAGE_SIZE)) {
      setErrors((previous) => ({
        ...previous,
        images: "ขนาดรูปภาพต้องไม่เกิน 5 MB ต่อรูป",
      }));
      return;
    }

    const previews = files.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.push(url);
      return url;
    });

    setSelectedFiles((previous) => [...previous, ...files]);
    setSelectedPreviews((previous) => [...previous, ...previews]);
    setErrors((previous) => ({ ...previous, images: null }));
  };

  const handleRemoveExistingImage = (index) => {
    const image = existingImages[index];
    if (!image) return;

    const nextImageCount = existingImages.length - 1 + selectedFiles.length;
    setExistingImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index),
    );
    setRemovedExistingImages((previous) =>
      previous.includes(image) ? previous : [...previous, image],
    );
    setErrors((previous) => ({
      ...previous,
      images:
        nextImageCount === 0 ? "กรุณาเลือกรูปภาพอย่างน้อย 1 รูป" : null,
    }));
  };

  const handleRemoveSelectedImage = (index) => {
    const preview = selectedPreviews[index];
    if (!preview) return;

    URL.revokeObjectURL(preview);
    objectUrlsRef.current = objectUrlsRef.current.filter(
      (url) => url !== preview,
    );

    const nextImageCount = existingImages.length + selectedFiles.length - 1;
    setSelectedFiles((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index),
    );
    setSelectedPreviews((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index),
    );
    setErrors((previous) => ({
      ...previous,
      images:
        nextImageCount === 0 ? "กรุณาเลือกรูปภาพอย่างน้อย 1 รูป" : null,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });
    selectedFiles.forEach((file) => submitData.append("images", file));
    if (removedExistingImages.length > 0) {
      submitData.append("removeImages", JSON.stringify(removedExistingImages));
    }

    setIsSubmitting(true);
    try {
      await onSubmit(submitData);
    } catch (error) {
      setErrors((previous) => ({ ...previous, submit: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageCount = existingImages.length + selectedFiles.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-base-100 w-full max-w-lg rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">
          {initialData ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label font-medium">
              ชื่อสินค้า <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
              placeholder="เช่น เสื้อยืดพิมพ์ลาย"
            />
            {errors.name && <span className="text-error text-sm mt-1">{errors.name}</span>}
          </div>

          <div className="form-control">
            <label className="label font-medium">
              รายละเอียด <span className="text-error">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`textarea textarea-bordered h-24 w-full ${errors.description ? "textarea-error" : ""}`}
              placeholder="คำอธิบายสินค้าเบื้องต้น..."
            />
            {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
          </div>

          <div className="flex gap-4">
            <div className="form-control w-1/2">
              <label className="label font-medium">
                ราคา (฿) <span className="text-error">*</span>
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.price ? "input-error" : ""}`}
                placeholder="0.00"
              />
              {errors.price && <span className="text-error text-sm mt-1">{errors.price}</span>}
            </div>

            <div className="form-control w-1/2">
              <label className="label font-medium">
                วันที่ลงสินค้า <span className="text-error">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.date ? "input-error" : ""}`}
              />
              {errors.date && <span className="text-error text-sm mt-1">{errors.date}</span>}
            </div>
          </div>

          <div className="form-control">
            <label className="label font-medium">
              หมวดหมู่ (Tag) <span className="text-error">*</span>
            </label>
            <select
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              className={`select select-bordered w-full ${errors.tag ? "select-error" : ""}`}
            >
              <option value="All type">All type</option>
              <option value="Ebook">Ebook</option>
              <option value="Template">Template</option>
              <option value="Souvenir">Souvenir</option>
              <option value="T-shirt Design">T-shirt Design</option>
            </select>
            {errors.tag && <span className="text-error text-sm mt-1">{errors.tag}</span>}
          </div>

          <div className="form-control">
            <label className="label font-medium" htmlFor="product-images">
              รูปภาพ
            </label>
            <input
              id="product-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full"
            />
            <span className="text-xs text-base-content/60 mt-1">
              เลือกได้สูงสุด {MAX_IMAGES} รูป ต้องมีอย่างน้อย 1 รูป และขนาดไม่เกิน 5 MB ต่อรูป
            </span>
            {errors.images && <span className="text-error text-sm mt-1">{errors.images}</span>}
            {errors.submit && <span className="text-error text-sm mt-1">{errors.submit}</span>}
            {imageCount > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {existingImages.map((image, index) => (
                  <div
                    key={`existing-${image}-${index}`}
                    className="relative overflow-hidden rounded-lg"
                  >
                    <img
                      src={image}
                      alt={`รูปสินค้า ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      className="btn btn-circle btn-xs btn-error absolute right-1 top-1 shadow-md"
                      onClick={() => handleRemoveExistingImage(index)}
                      aria-label={`ลบรูปสินค้า ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {selectedPreviews.map((image, index) => (
                  <div
                    key={`new-${image}`}
                    className="relative overflow-hidden rounded-lg"
                  >
                    <img
                      src={image}
                      alt={`รูปใหม่ ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      className="btn btn-circle btn-xs btn-error absolute right-1 top-1 shadow-md"
                      onClick={() => handleRemoveSelectedImage(index)}
                      aria-label={`ลบรูปใหม่ ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting
                ? "กำลังบันทึก..."
                : initialData
                  ? "บันทึกการแก้ไข"
                  : "เพิ่มสินค้า"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
