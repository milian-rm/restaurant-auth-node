'use strict';

import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Configure multer storage
const storage = multer.memoryStorage();

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, GIF, WebP)'), false);
  }
};

// Configure multer upload
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// Handle multer errors
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. El tamaño máximo es 5MB',
      });
    }
    return res.status(400).json({
      success: false,
      message: `Error al subir archivo: ${err.message}`,
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Error al procesar el archivo',
    });
  }
  
  next();
};
