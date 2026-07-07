'use strict';

import { body, validationResult } from 'express-validator';

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Normalize PascalCase fields from .NET frontend to lowercase
export const normalizeBody = (req, res, next) => {
  const b = req.body;
  if (b.UserName && !b.name) b.name = b.UserName;
  if (b.UserSurname && !b.surname) b.surname = b.UserSurname;
  if (b.Username && !b.username) b.username = b.Username;
  if (b.Email && !b.email) b.email = b.Email;
  if (b.Password && !b.password) b.password = b.Password;
  if (b.Phone && !b.phone) b.phone = b.Phone;
  if (b.EmailOrUsername && !b.emailOrUsername) b.emailOrUsername = b.EmailOrUsername;
  if (b.Token && !b.token) b.token = b.Token;
  if (b.NewPassword && !b.newPassword) b.newPassword = b.NewPassword;
  next();
};

// Register validation
export const validateRegister = [
  normalizeBody,
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede tener más de 100 caracteres'),
  body('surname')
    .trim()
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ max: 100 })
    .withMessage('El apellido no puede tener más de 100 caracteres'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario es requerido')
    .isLength({ max: 50 })
    .withMessage('El nombre de usuario no puede tener más de 50 caracteres')
    .isAlphanumeric()
    .withMessage('El nombre de usuario solo puede contener letras y números'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo es requerido')
    .isEmail()
    .withMessage('El correo electrónico no tiene un formato válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido')
    .isLength({ min: 8, max: 8 })
    .withMessage('El teléfono debe tener exactamente 8 dígitos')
    .isNumeric()
    .withMessage('El teléfono solo debe contener números'),
  handleValidationErrors,
];

// Login validation
export const validateLogin = [
  normalizeBody,
  body('emailOrUsername')
    .trim()
    .notEmpty()
    .withMessage('El correo o nombre de usuario es requerido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  handleValidationErrors,
];

// Verify email validation
export const validateVerifyEmail = [
  normalizeBody,
  body('token')
    .trim()
    .notEmpty()
    .withMessage('El token es requerido'),
  handleValidationErrors,
];

// Resend verification validation
export const validateResendVerification = [
  normalizeBody,
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo es requerido')
    .isEmail()
    .withMessage('El correo electrónico no tiene un formato válido'),
  handleValidationErrors,
];

// Forgot password validation
export const validateForgotPassword = [
  normalizeBody,
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo es requerido')
    .isEmail()
    .withMessage('El correo electrónico no tiene un formato válido'),
  handleValidationErrors,
];

// Reset password validation
export const validateResetPassword = [
  normalizeBody,
  body('token')
    .trim()
    .notEmpty()
    .withMessage('El token es requerido'),
  body('newPassword')
    .notEmpty()
    .withMessage('La nueva contraseña es requerida')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
  handleValidationErrors,
];
