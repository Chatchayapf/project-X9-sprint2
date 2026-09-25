import multer from "multer";

const storage = multer.memoryStorage();

export const uploadImages = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files are allowed"));
    }
    return callback(null, true);
  },
}).array("images", 5);
