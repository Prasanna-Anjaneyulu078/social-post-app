const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

let upload;

if (hasCloudinaryConfig) {
  const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "social_app_posts",
      allowed_formats: ["jpg", "png", "jpeg"],
    },
  });
  upload = multer({ storage: cloudinaryStorage });
} else {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });
  upload = multer({ storage });
}

module.exports = upload;