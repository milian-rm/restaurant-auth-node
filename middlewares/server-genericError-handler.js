'use strict';

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle specific error types
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors.map((e) => e.message),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'El recurso ya existe',
      errors: err.errors.map((e) => e.message),
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
  });
};
