import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import "dotenv/config";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateFileName = (originalName) => {
  const timestamp = Date.now();

  const baseName = path.basename(originalName, path.extname(originalName));

  return `${timestamp}-${baseName}`;
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: process.env.APP_ENV === "production" ? "production" : "development",
    public_id: (req, file) => generateFileName(file.originalname),
    transformation: [
      {
        quality: "auto:good",
        fetch_format: "auto",
      },
    ],
  },
});

export { cloudinary, storage };
