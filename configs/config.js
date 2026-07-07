'use strict';

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    issuer: process.env.JWT_ISSUER || 'AuthService',
    audience: process.env.JWT_AUDIENCE || 'AuthService',
  },
  
  // Database
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5435'),
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  
  // SMTP
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_ENABLE_SSL === 'true',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    from: process.env.SMTP_FROM,
    fromName: process.env.SMTP_FROM_NAME,
  },
  
  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    baseUrl: process.env.CLOUDINARY_BASE_URL,
    folder: process.env.CLOUDINARY_FOLDER || 'restaurant_auth/profiles',
    defaultAvatar: process.env.CLOUDINARY_DEFAULT_AVATAR_FILENAME || 'avatar-default.png',
  },
  
  // Security
  security: {
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
    lockoutTimeMs: parseInt(process.env.LOCKOUT_TIME_MS || '1800000'),
    verificationEmailExpiryHours: parseInt(process.env.VERIFICATION_EMAIL_EXPIRY_HOURS || '24'),
    passwordResetExpiryHours: parseInt(process.env.PASSWORD_RESET_EXPIRY_HOURS || '1'),
  },
  
  // CORS
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
    adminAllowedOrigins: process.env.ADMIN_ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  },
};
