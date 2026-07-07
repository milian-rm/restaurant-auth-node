'use strict';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = { userId };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
        issuer: process.env.JWT_ISSUER || 'AuthService',
        audience: process.env.JWT_AUDIENCE || 'AuthService',
      },
      (err, token) => {
        if (err) {
          console.error('Error generating refresh token:', err);
          reject('No se pudo generar el refresh token');
        }
        resolve(token);
      }
    );
  });
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: process.env.JWT_ISSUER || 'AuthService',
    audience: process.env.JWT_AUDIENCE || 'AuthService',
  });
};
