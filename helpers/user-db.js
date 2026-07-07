'use strict';

import { User, UserProfile, UserEmail, UserPasswordReset } from '../src/users/user.model.js';
import { UserRole } from '../src/auth/role.model.js';
import { Role } from '../src/auth/role.model.js';

export const findUserByEmail = async (email) => {
  return User.findOne({
    where: { Email: email.toLowerCase() },
    include: [
      { model: UserProfile, as: 'UserProfile' },
      { model: UserEmail, as: 'UserEmail' },
      {
        model: UserRole,
        as: 'UserRoles',
        include: [{ model: Role, as: 'Role' }],
      },
    ],
  });
};

export const findUserByUsername = async (username) => {
  return User.findOne({
    where: { Username: username },
    include: [
      { model: UserProfile, as: 'UserProfile' },
      { model: UserEmail, as: 'UserEmail' },
      {
        model: UserRole,
        as: 'UserRoles',
        include: [{ model: Role, as: 'Role' }],
      },
    ],
  });
};

export const findUserById = async (userId) => {
  return User.findByPk(userId, {
    include: [
      { model: UserProfile, as: 'UserProfile' },
      { model: UserEmail, as: 'UserEmail' },
      { model: UserPasswordReset, as: 'UserPasswordReset' },
      {
        model: UserRole,
        as: 'UserRoles',
        include: [{ model: Role, as: 'Role' }],
      },
    ],
  });
};

export const findUserByEmailVerificationToken = async (token) => {
  return User.findOne({
    include: [
      {
        model: UserEmail,
        as: 'UserEmail',
        where: { EmailVerificationToken: token },
      },
      { model: UserProfile, as: 'UserProfile' },
      {
        model: UserRole,
        as: 'UserRoles',
        include: [{ model: Role, as: 'Role' }],
      },
    ],
  });
};

export const findUserByPasswordResetToken = async (token) => {
  return User.findOne({
    include: [
      {
        model: UserPasswordReset,
        as: 'UserPasswordReset',
        where: { PasswordResetToken: token },
      },
      { model: UserProfile, as: 'UserProfile' },
      { model: UserEmail, as: 'UserEmail' },
      {
        model: UserRole,
        as: 'UserRoles',
        include: [{ model: Role, as: 'Role' }],
      },
    ],
  });
};

export const createUser = async (userData) => {
  return User.create(userData, {
    include: [
      { model: UserProfile, as: 'UserProfile' },
      { model: UserEmail, as: 'UserEmail' },
      { model: UserRole, as: 'UserRoles' },
    ],
  });
};

export const updateUser = async (user) => {
  return user.save();
};
