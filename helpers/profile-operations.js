'use strict';

import { findUserById, findUserByUsername, updateUser } from './user-db.js';
import { getDefaultAvatarUrl, uploadImage } from './cloudinary-service.js';

export const getUserProfileHelper = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw new Error('Usuario no encontrado');

  return {
    id: user.Id,
    firstName: user.UserName,
    lastName: user.UserSurname,
    systemUsername: user.Username,
    email: user.Email,
    role: user.UserRoles?.[0]?.Role?.Name || 'CLIENT',
    userStatus: user.UserStatus,
    isEmailVerified: user.UserEmail?.EmailVerified || false,
    userCreatedAt: user.UserCreatedAt,
    updatedAt: user.UpdatedAt,
    profilePicture: user.UserProfile?.ProfilePictureUrl || getDefaultAvatarUrl(),
    phone: user.UserProfile?.Phone,
    branchId: user.BranchId,
  };
};

export const getUserProfileByUsernameHelper = async (username) => {
  const user = await findUserByUsername(username);
  if (!user) throw new Error('Usuario no encontrado');

  return {
    id: user.Id,
    firstName: user.UserName,
    lastName: user.UserSurname,
    systemUsername: user.Username,
    email: user.Email,
    role: user.UserRoles?.[0]?.Role?.Name || 'CLIENT',
    userStatus: user.UserStatus,
    isEmailVerified: user.UserEmail?.EmailVerified || false,
    userCreatedAt: user.UserCreatedAt,
    updatedAt: user.UpdatedAt,
    profilePicture: user.UserProfile?.ProfilePictureUrl || getDefaultAvatarUrl(),
    phone: user.UserProfile?.Phone,
    branchId: user.BranchId,
  };
};

export const updateProfilePictureHelper = async (userId, imagePath) => {
  const user = await findUserById(userId);
  if (!user) throw new Error('Usuario no encontrado');

  const newProfilePicture = await uploadImage(imagePath);

  if (user.UserProfile) {
    user.UserProfile.ProfilePictureUrl = newProfilePicture;
  } else {
    user.UserProfile = {
      Id: userId,
      UserId: userId,
      ProfilePictureUrl: newProfilePicture,
      Phone: '',
    };
  }

  user.UpdatedAt = new Date();
  await updateUser(user);

  return {
    id: user.Id,
    firstName: user.UserName,
    lastName: user.UserSurname,
    systemUsername: user.Username,
    email: user.Email,
    profilePicture: newProfilePicture,
  };
};
