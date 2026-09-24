import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(img) {
  const res = await cloudinary.uploader.upload(img, {
    folder: "digi9_product",
  });
  if (!res) {
    throw new Error("Can't connect to Cloudinary!!");
  }
  const img_url = cloudinary.url(res.public_id, {
    transformation: [
      {
        quality: "auto",
        fetch_format: "auto",
      },
      {
        width: 1200,
        height: 1200,
        crop: "fill",
        gravity: "auto",
      },
    ],
  });

  console.log(img_url);

  return img_url;
}

export const getPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const filename = parts.pop().split(".")[0];
  const folder = parts.pop();
  return `${folder}/${filename}`;
};

export async function deleteImage(url) {
  try {
    const publicId = getPublicIdFromUrl(url);
    const res = await cloudinary.uploader.destroy(publicId);
    return res;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
}
