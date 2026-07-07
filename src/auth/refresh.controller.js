'use strict';

import { verifyRefreshToken } from '../../helpers/refresh-token.js';
import { generateJWT } from '../../helpers/generate-jwt.js';
import { findUserById } from '../../helpers/user-db.js';
import { CLIENT_ROLE } from '../../helpers/role-constants.js';

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token es requerido',
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find user
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

    // Get user role
    const userRole = user.UserRoles?.[0]?.Role?.Name || CLIENT_ROLE;

    // Generate new access token
    const newToken = await generateJWT(user.Id, userRole);

    return res.status(200).json({
      success: true,
      token: newToken,
      accessToken: newToken,
      refreshToken: req.body.refreshToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });
  } catch (error) {
    console.error('Error in refresh controller:', error);
    
    return res.status(401).json({
      success: false,
      message: 'Refresh token inválido o expirado',
    });
  }
};

export const logout = async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // by removing the tokens from storage
  return res.status(200).json({
    success: true,
    message: 'Sesión cerrada exitosamente',
  });
};
