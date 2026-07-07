'use strict';

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_ENABLE_SSL === 'true',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmailVerification = async (email, username, token) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'Restaurante'}" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Verifica tu correo electrónico',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Bienvenido al Sistema de Restaurante</h2>
        <p>Hola <strong>${username}</strong>,</p>
        <p>Gracias por registrarte. Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Verificar Correo
          </a>
        </div>
        <p style="color: #666; font-size: 12px;">Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
        <p style="color: #666; font-size: 12px; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #999; font-size: 11px; margin-top: 20px;">Este enlace expirará en 24 horas.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, username, token) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'Restaurante'}" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Restablece tu contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Restablecimiento de Contraseña</h2>
        <p>Hola <strong>${username}</strong>,</p>
        <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente botón para crear una nueva contraseña:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Restablecer Contraseña
          </a>
        </div>
        <p style="color: #666; font-size: 12px;">Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
        <p style="color: #666; font-size: 12px; word-break: break-all;">${resetUrl}</p>
        <p style="color: #999; font-size: 11px; margin-top: 20px;">Este enlace expirará en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
