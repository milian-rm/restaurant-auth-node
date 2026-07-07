'use strict';

import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import {
  findUserByEmail,
  findUserByUsername,
  findUserById,
  findUserByEmailVerificationToken,
  findUserByPasswordResetToken,
  createUser,
  updateUser,
} from './user-db.js';
import { UserPasswordReset } from '../src/users/user.model.js';
import { getRoleByName } from './role-db.js';
import { generateJWT } from './generate-jwt.js';
import { generateRefreshToken } from './refresh-token.js';
import { sendEmailVerification, sendPasswordResetEmail } from './email-service.js';
import { uploadImage, getDefaultAvatarUrl } from './cloudinary-service.js';
import { CLIENT_ROLE } from './role-constants.js';
import { generateUserId, generateToken } from './uuid-generator.js';

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 102400,
  timeCost: 2,
  parallelism: 8,
  saltLength: 16,
  hashLength: 32,
};

function convertDotNetArgon2Hash(hash) {
  if (!hash || !hash.startsWith('$argon2id$')) return hash;
  const parts = hash.split('$');
  if (parts.length !== 6) return hash;
  const convertB64 = (b64) => b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `$argon2id$${parts[2]}$${parts[3]}$${convertB64(parts[4])}$${convertB64(parts[5])}`;
}

export const registerUserHelper = async (userData) => {
  const { name, surname, username, email, password, phone, profilePicture } = userData;

  const existingEmail = await findUserByEmail(email);
  if (existingEmail) throw new Error('El correo electrónico ya está registrado');

  const existingUsername = await findUserByUsername(username);
  if (existingUsername) throw new Error('El nombre de usuario ya está en uso');

  const hashedPassword = await argon2.hash(password, ARGON2_OPTIONS);

  let profilePictureUrl = getDefaultAvatarUrl();
  if (profilePicture) {
    try { profilePictureUrl = await uploadImage(profilePicture); } catch {}
  }

  const defaultRole = await getRoleByName(CLIENT_ROLE);
  if (!defaultRole) throw new Error('Rol por defecto no encontrado');

  const isAdmin = false;
  const emailVerificationToken = isAdmin ? null : generateToken();
  const emailVerificationTokenExpiration = isAdmin ? null : new Date(Date.now() + 24 * 60 * 60 * 1000);

  const userId = generateUserId();
  const user = await createUser({
    Id: userId,
    UserName: name,
    UserSurname: surname,
    Username: username,
    Email: email.toLowerCase(),
    Password: hashedPassword,
    UserStatus: isAdmin ? 'ACTIVE' : 'INACTIVE',
    UserCreatedAt: new Date(),
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
    UserProfile: {
      Id: generateUserId(),
      UserId: userId,
      ProfilePictureUrl: profilePictureUrl,
      Phone: phone,
    },
    UserEmail: {
      Id: generateUserId(),
      UserId: userId,
      EmailVerified: isAdmin,
      EmailVerificationToken: emailVerificationToken,
      EmailVerificationTokenExpiration: emailVerificationTokenExpiration,
    },
    UserRoles: [{
      Id: generateUserId(),
      UserId: userId,
      RoleId: defaultRole.Id,
    }],
  });

  if (!isAdmin) {
    sendEmailVerification(email, username, emailVerificationToken).catch((err) =>
      console.error('Error sending verification email:', err)
    );
  }

  return {
    success: true,
    message: isAdmin
      ? 'Usuario administrador registrado exitosamente.'
      : 'Usuario registrado exitosamente. Verifica tu email.',
    user: {
      id: user.Id,
      firstName: user.UserName,
      lastName: user.UserSurname,
      systemUsername: user.Username,
      email: user.Email,
      role: defaultRole.Name,
      userStatus: user.UserStatus,
      isEmailVerified: isAdmin,
      userCreatedAt: user.UserCreatedAt,
    },
    emailVerificationRequired: !isAdmin,
  };
};

export const loginUserHelper = async (emailOrUsername, password) => {
  let user;
  if (emailOrUsername.includes('@')) {
    user = await findUserByEmail(emailOrUsername);
  } else {
    user = await findUserByUsername(emailOrUsername);
  }

  if (!user) throw new Error('Correo o contraseña incorrectos');

  let validPassword = false;
  try {
    validPassword = await argon2.verify(user.Password, password);
  } catch {
    try {
      const convertedHash = convertDotNetArgon2Hash(user.Password);
      validPassword = await argon2.verify(convertedHash, password);
    } catch {
      validPassword = false;
    }
  }

  if (!validPassword) throw new Error('Correo o contraseña incorrectos');

  if (!user.UserEmail?.EmailVerified) {
    throw new Error('Tu cuenta no está activa. Por favor verifica tu email.');
  }

  if (user.UserStatus !== 'ACTIVE') {
    throw new Error('Tu cuenta está desactivada. Contacta al administrador.');
  }

  const userRole = user.UserRoles?.[0]?.Role?.Name || CLIENT_ROLE;
  const token = await generateJWT(user.Id, userRole);
  const refreshToken = await generateRefreshToken(user.Id);

  const expiresIn = process.env.JWT_EXPIRES_IN || '15m';
  const expiresAt = new Date();
  if (expiresIn.endsWith('m')) expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(expiresIn));
  else if (expiresIn.endsWith('h')) expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn));
  else if (expiresIn.endsWith('d')) expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));

  return {
    Success: true,
    Message: 'Login exitoso',
    Token: token,
    RefreshToken: refreshToken,
    ExpiresIn: expiresIn,
    ExpiresAt: expiresAt.toISOString(),
    UserDetails: {
      id: user.Id,
      userName: user.UserName,
      userSurname: user.UserSurname,
      systemUsername: user.Username,
      userEmail: user.Email,
      role: userRole,
      userStatus: user.UserStatus,
      isEmailVerified: user.UserEmail?.EmailVerified || false,
      userCreatedAt: user.UserCreatedAt,
      profilePicture: user.UserProfile?.ProfilePictureUrl || getDefaultAvatarUrl(),
      phone: user.UserProfile?.Phone,
      branchId: user.BranchId,
    },
  };
};

export const verifyEmailHelper = async (token) => {
  const user = await findUserByEmailVerificationToken(token);
  if (!user) throw new Error('Token de verificación inválido');
  if (user.UserEmail?.EmailVerificationTokenExpiration < new Date()) {
    throw new Error('Token de verificación expirado');
  }

  user.UserStatus = 'ACTIVE';
  user.UpdatedAt = new Date();
  await user.save();

  user.UserEmail.EmailVerified = true;
  user.UserEmail.EmailVerificationToken = null;
  user.UserEmail.EmailVerificationTokenExpiration = null;
  await user.UserEmail.save();

  return { success: true, message: 'Email verificado exitosamente' };
};

export const resendVerificationEmailHelper = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) return { success: false, message: 'Usuario no encontrado' };
  if (user.UserEmail?.EmailVerified) return { success: false, message: 'El correo ya ha sido verificado' };

  const newToken = generateToken();
  const newExpiry = new Date();
  newExpiry.setHours(newExpiry.getHours() + 24);

  user.UserEmail.EmailVerificationToken = newToken;
  user.UserEmail.EmailVerificationTokenExpiration = newExpiry;
  await user.UserEmail.save();
  await sendEmailVerification(user.Email, user.Username, newToken);

  return { success: true, message: 'Correo de verificación reenviado' };
};

export const forgotPasswordHelper = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    return { success: true, message: 'Si el correo existe, se enviarán instrucciones', data: { initiated: true } };
  }

  const resetToken = generateToken();
  const resetTokenExpiry = new Date();
  resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

  if (user.UserPasswordReset) {
    user.UserPasswordReset.PasswordResetToken = resetToken;
    user.UserPasswordReset.PasswordResetTokenExpiration = resetTokenExpiry;
    await user.UserPasswordReset.save();
  } else {
    await UserPasswordReset.create({
      Id: generateUserId(),
      UserId: user.Id,
      PasswordResetToken: resetToken,
      PasswordResetTokenExpiration: resetTokenExpiry,
    });
  }
  await sendPasswordResetEmail(user.Email, user.Username, resetToken);

  return { success: true, message: 'Correo de recuperación enviado', data: { initiated: true } };
};

export const resetPasswordHelper = async (token, newPassword) => {
  const user = await findUserByPasswordResetToken(token);
  if (!user) throw new Error('Token de recuperación inválido');
  if (user.UserPasswordReset?.PasswordResetTokenExpiration < new Date()) {
    throw new Error('Token de recuperación expirado');
  }

  const hashedPassword = await argon2.hash(newPassword, ARGON2_OPTIONS);
  user.Password = hashedPassword;
  user.UpdatedAt = new Date();
  await user.save();

  if (user.UserPasswordReset) {
    user.UserPasswordReset.PasswordResetToken = 'CONSUMED_' + uuidv4();
    user.UserPasswordReset.PasswordResetTokenExpiration = new Date();
    await user.UserPasswordReset.save();
  }
  return { success: true, message: 'Contraseña restablecida correctamente' };
};
