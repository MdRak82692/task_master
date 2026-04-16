import { Router } from 'express';
import * as userController from '../modules/user/user.controller';
import { auth } from '../middlewares/auth';
import { z } from 'zod';
import { validate } from '../middlewares/validate';

const router = Router();

const statusSchema = z.object({
  body: z.object({
    status: z.enum(['ACTIVE', 'INACTIVE', 'BANNED']),
  }),
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', auth('ADMIN'), userController.getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get single user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: User object
 */
router.get('/:id', auth('ADMIN'), userController.getUser);

/**
 * @swagger
 * /users/{id}/status:
 *   patch:
 *     summary: Update user status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, BANNED]
 *     responses:
 *       200:
 *         description: User status updated
 */
router.patch('/:id/status', auth('ADMIN'), validate(statusSchema), userController.updateStatus);

export default router;
