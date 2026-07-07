'use strict';

import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';

// Role Model
export const Role = sequelize.define(
  'Role',
  {
    Id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      field: 'id',
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'name',
      validate: {
        notEmpty: { msg: 'El nombre de rol es obligatorio' },
      },
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    tableName: 'roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// UserRole Model (junction table)
export const UserRole = sequelize.define(
  'UserRole',
  {
    Id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      field: 'id',
    },
    UserId: {
      type: DataTypes.STRING(16),
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    RoleId: {
      type: DataTypes.STRING(16),
      allowNull: false,
      field: 'role_id',
      references: {
        model: 'roles',
        key: 'id',
      },
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    tableName: 'user_roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Define associations
Role.hasMany(UserRole, { foreignKey: 'role_id', as: 'UserRoles' });
UserRole.belongsTo(Role, { foreignKey: 'role_id', as: 'Role' });

// User-UserRole association (imported from user.model.js to avoid circular dependency)
import { User } from '../users/user.model.js';
User.hasMany(UserRole, { foreignKey: 'user_id', as: 'UserRoles' });
UserRole.belongsTo(User, { foreignKey: 'user_id', as: 'User' });
