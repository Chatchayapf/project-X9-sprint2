import mongoose from "mongoose";

// Sub-schema สำหรับรายการสินค้าในคำสั่งซื้อ
const orderItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "items.product_model", // อ้างอิง Model ตามค่าที่อยู่ในฟิลด์ product_model
    },
    product_model: {
      type: String,
      required: true,
      enum: ["Product", "CustomProduct"], // ระบุว่า items ชิ้นนี้มาจาก Collection ไหน
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    customization: {
      detail: { type: String }, // สำหรับเก็บรายละเอียดเพิ่มเติม (หรือ null ได้ตามต้องการ)
    },
  },
  { _id: false }, // ปิดการสร้าง _id อัตโนมัติสำหรับแต่ละ item ย่อย
);

// Schema หลักสำหรับ Order
const orderSchema = new mongoose.Schema(
  {
    order_type: {
      type: String,
      enum: ["standard", "custom"], // ประเภทของออร์เดอร์
      default: "standard",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // เชื่อมกับ User Model
      required: true,
    },
    items: [orderItemSchema], // Array ของรายการสินค้าที่สั่งซื้อ
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"], // สถานะการชำระเงิน
      default: "pending",
      required: true,
    },
    order_status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"], // สถานะคำสั่งซื้อ
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Order = mongoose.model("Order", orderSchema);
