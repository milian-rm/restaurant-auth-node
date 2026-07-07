'use strict';

import { verifyJWT } from '../helpers/generate-jwt.js';
import { findUserById } from '../helpers/user-db.js';

export const validateJWT = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No hay token en la petición',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyJWT(token);
    
    // Find user to ensure they still exist and are active
    const user = await findUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    if (user.UserStatus !== 'ACTIVE') {
      return res.status(401).json({
        success: false,
        message: 'Usuario desactivado',
      });
    }

    // Attach user info to request
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = user;
    
    next();
  } catch (error) {
    console.error('JWT validation error:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }
};

// Middleware to check specific roles
export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado',
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para realizar esta acción',
      });
    }

    next();
  };
};
