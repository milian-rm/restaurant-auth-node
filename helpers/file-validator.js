'use strict';

import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const validateImage = (file) => {
  if (!file) {
    return { isValid: true, errorMessage: null };
  }

  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedMimes.includes(file.mimetype)) {
    return {
      isValid: false,
      errorMessage: 'Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, GIF, WebP)',
    };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      errorMessage: 'El archivo es demasiado grande. El tamaño máximo es 5MB',
    };
  }

  return { isValid: true, errorMessage: null };
};

export const generateSecureFileName = (originalName) => {
  const ext = path.extname(originalName);
  return `${uuidv4()}${ext}`;
};
