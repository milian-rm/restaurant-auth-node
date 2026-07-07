'use strict';

import rateLimit from 'express-rate-limit';

// General request limit
export const requestLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    success: false,
    message: 'Demasiadas peticiones. Por favor intenta de nuevo más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth-specific rate limit (more restrictive)
export const authRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    success: false,
    message: 'Demasiadas peticiones de autenticación. Por favor intenta de nuevo más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API rate limit
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // 50 requests per minute
  message: {
    success: false,
    message: 'Demasiadas peticiones a la API. Por favor intenta de nuevo más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
