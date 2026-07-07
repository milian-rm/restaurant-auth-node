'use strict';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateJWT = (userId, role) => {
  return new Promise((resolve, reject) => {
    const payload = { userId, role };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        issuer: process.env.JWT_ISSUER || 'AuthService',
        audience: process.env.JWT_AUDIENCE || 'AuthService',
      },
      (err, token) => {
        if (err) {
          console.error('Error generating JWT:', err);
          reject('No se pudo generar el token');
        }
        resolve(token);
      }
    );
  });
};

export const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: process.env.JWT_ISSUER || 'AuthService',
    audience: process.env.JWT_AUDIENCE || 'AuthService',
  });
};
