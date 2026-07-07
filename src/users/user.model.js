'use strict';

import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';
import { generateUserId } from '../../helpers/uuid-generator.js';

// Modelo User - Compatible con la estructura de .NET (ApplicationDbContext)
// .NET fuerza PascalCase para: UserName, UserSurname, UserStatus, UserCreatedAt
// Las demás columnas usan snake_case
export const User = sequelize.define(
  'User',
  {
    Id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      field: 'id',
      defaultValue: () => generateUserId(),
    },
    UserName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'UserName',
    },
    UserSurname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'UserSurname',
    },
    Username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'username',
    },
    Email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      field: 'email',
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password',
    },
    UserStatus: {
      type: DataTypes.STRING(20),
      defaultValue: 'INACTIVE',
      allowNull: false,
      field: 'UserStatus',
    },
    BranchId: {
      type: DataTypes.STRING(16),
      allowNull: true,
      field: 'branch_id',
    },
    UserCreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'UserCreatedAt',
    },
    DeletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
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
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: false,
  }
);

// Modelo UserProfile
export const UserProfile = sequelize.define(
  'UserProfile',
  {
    Id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      field: 'id',
      defaultValue: () => generateUserId(),
    },
    UserId: {
      type: DataTypes.STRING(16),
      allowNull: false,
      field: 'user_id',
    },
    ProfilePictureUrl: {
      type: DataTypes.STRING(512),
      defaultValue: '',
      field: 'profile_picture_url',
    },
    Phone: {
      type: DataTypes.STRING(8),
      allowNull: true,
      field: 'phone',
    },
  },
  {
    tableName: 'user_profiles',
    timestamps: false,
  }
);

// Modelo UserEmail
export const UserEmail = sequelize.define(
  'UserEmail',
  {
    Id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      field: 'id',
      defaultValue: () => generateUserId(),
    },
    UserId: {
      type: DataTypes.STRING(16),
      allowNull: false,
      field: 'user_id',
    },
    EmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'email_verified',
    },
    EmailVerificationToken: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'email_verification_token',
    },
    EmailVerificationTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'email_verification_token_expiration',
    },
  },
  {
    tableName: 'user_emails',
    timestamps: false,
  }
);

// Modelo UserPasswordReset
export const UserPasswordReset = sequelize.define(
  'UserPasswordReset',
  {
    Id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      field: 'id',
      defaultValue: () => generateUserId(),
    },
    UserId: {
      type: DataTypes.STRING(16),
      allowNull: false,
      field: 'user_id',
    },
    PasswordResetToken: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'password_reset_token',
    },
    PasswordResetTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'password_reset_token_expiration',
    },
  },
  {
    tableName: 'user_password_resets',
    timestamps: false,
  }
);

// Relaciones
User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'UserProfile' });
UserProfile.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

User.hasOne(UserEmail, { foreignKey: 'user_id', as: 'UserEmail' });
UserEmail.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

User.hasOne(UserPasswordReset, { foreignKey: 'user_id', as: 'UserPasswordReset' });
UserPasswordReset.belongsTo(User, { foreignKey: 'user_id', as: 'User' });
