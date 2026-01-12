import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'qayyim', // Optional: folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any, 
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req: any, res) => {
  res.send(`${req.file?.path}`); // Return the full URL path from cloudinary
});

export default router;
