'use strict';

import { User } from './user.model.js';
import { Role, UserRole } from '../auth/role.model.js';
import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import { PLATFORM_ADMIN_ROLE, BRANCH_ADMIN_ROLE } from '../../helpers/role-constants.js';

// Get all users (admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: UserRole,
        as: 'UserRoles',
        include: [{ model: Role, as: 'Role' }],
      },
    ],
    attributes: { exclude: ['Password'] },
  });

  return res.status(200).json({
    success: true,
    data: users,
  });
});

// Get user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByPk(userId, {
    include: [
      {
        model: UserRole,
        as: 'UserRoles',
        include: [{ model: Role, as: 'Role' }],
      },
    ],
    attributes: { exclude: ['Password'] },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado',
    });
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
});

// Update user role (admin only)
export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { roleId } = req.body;

  // Check if requester is platform admin
  if (req.userRole !== PLATFORM_ADMIN_ROLE) {
    return res.status(403).json({
      success: false,
      message: 'Solo el administrador plataforma puede cambiar roles',
    });
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado',
    });
  }

  // Check if role exists
  const role = await Role.findByPk(roleId);
  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Rol no encontrado',
    });
  }

  // Update user role
  await UserRole.destroy({ where: { UserId: userId } });
  await UserRole.create({
    Id: Date.now().toString(),
    UserId: userId,
    RoleId: roleId,
  });

  return res.status(200).json({
    success: true,
    message: 'Rol actualizado exitosamente',
  });
});

// Get users by role
export const getUsersByRole = asyncHandler(async (req, res) => {
  const { roleName } = req.params;

  const role = await Role.findOne({ where: { Name: roleName } });
  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Rol no encontrado',
    });
  }

  const userRoles = await UserRole.findAll({
    where: { RoleId: role.Id },
    include: [
      {
        model: User,
        as: 'User',
        attributes: { exclude: ['Password'] },
      },
    ],
  });

  const users = userRoles.map((ur) => ur.User);

  return res.status(200).json({
    success: true,
    data: users,
  });
});

// Get user roles
export const getUserRoles = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const userRoles = await UserRole.findAll({
    where: { UserId: userId },
    include: [{ model: Role, as: 'Role' }],
  });

  const roles = userRoles.map((ur) => ur.Role);

  return res.status(200).json({
    success: true,
    data: roles,
  });
});
