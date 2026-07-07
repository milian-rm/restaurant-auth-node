'use strict';

import { Router } from 'express';
import * as userController from './user.controller.js';
import { validateJWT, checkRole } from '../../middlewares/validate-JWT.js';
import { PLATFORM_ADMIN_ROLE, BRANCH_ADMIN_ROLE } from '../../helpers/role-constants.js';

const router = Router();

// All routes require authentication
router.use(validateJWT);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: Obtiene todos los usuarios
 *     description: Retorna la lista de todos los usuarios (solo administradores)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: No autorizado
 */
router.get('/', checkRole(PLATFORM_ADMIN_ROLE, BRANCH_ADMIN_ROLE), userController.getAllUsers);

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Obtiene un usuario por ID
 *     description: Retorna la información de un usuario específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:userId', checkRole(PLATFORM_ADMIN_ROLE, BRANCH_ADMIN_ROLE), userController.getUserById);

/**
 * @swagger
 * /api/v1/users/{userId}/role:
 *   put:
 *     tags: [Users]
 *     summary: Actualiza el rol de un usuario
 *     description: Cambia el rol de un usuario (solo administrador plataforma)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *             properties:
 *               roleId:
 *                 type: string
 *                 description: ID del nuevo rol
 *     responses:
 *       200:
 *         description: Rol actualizado
 *       403:
 *         description: No autorizado
 */
router.put('/:userId/role', checkRole(PLATFORM_ADMIN_ROLE), userController.updateUserRole);

/**
 * @swagger
 * /api/v1/users/{userId}/roles:
 *   get:
 *     tags: [Users]
 *     summary: Obtiene los roles de un usuario
 *     description: Retorna los roles asignados a un usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Roles del usuario
 */
router.get('/:userId/roles', checkRole(PLATFORM_ADMIN_ROLE, BRANCH_ADMIN_ROLE), userController.getUserRoles);

/**
 * @swagger
 * /api/v1/users/by-role/{roleName}:
 *   get:
 *     tags: [Users]
 *     summary: Obtiene usuarios por rol
 *     description: Retorna todos los usuarios con un rol específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: roleName
 *         in: path
 *         required: true
 *         type: string
 *         description: Nombre del rol
 *     responses:
 *       200:
 *         description: Lista de usuarios con el rol especificado
 */
router.get('/by-role/:roleName', checkRole(PLATFORM_ADMIN_ROLE, BRANCH_ADMIN_ROLE), userController.getUsersByRole);

export default router;
