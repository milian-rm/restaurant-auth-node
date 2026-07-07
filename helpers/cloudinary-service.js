'use strict';

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file) => {
  try {
    // If file is a path string, upload directly
    if (typeof file === 'string') {
      const result = await cloudinary.uploader.upload(file, {
        folder: process.env.CLOUDINARY_FOLDER || 'restaurant_auth/profiles',
        transformation: [
          { width: 300, height: 300, crop: 'fill' },
          { quality: 'auto' },
        ],
      });
      return result.secure_url;
    }

    // If file is a buffer (from multer), convert to base64
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: process.env.CLOUDINARY_FOLDER || 'restaurant_auth/profiles',
      transformation: [
        { width: 300, height: 300, crop: 'fill' },
        { quality: 'auto' },
      ],
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

export const getDefaultAvatarUrl = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const folder = process.env.CLOUDINARY_FOLDER || 'restaurant_auth/profiles';
  const defaultAvatar = process.env.CLOUDINARY_DEFAULT_AVATAR_FILENAME || 'avatar-default.png';
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${folder}/${defaultAvatar}`;
};
