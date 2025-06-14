// lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.ECOM_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.ECOM_CLOUDINARY_API_KEY,
  api_secret: process.env.ECOM_CLOUDINARY_API_SECRET,
});

export default cloudinary;