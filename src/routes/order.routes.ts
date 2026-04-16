import { Router } from 'express';
import * as orderController from '../modules/order/order.controller';
import { auth } from '../middlewares/auth';
import { z } from 'zod';
import { validate } from '../middlewares/validate';

const router = Router();

const orderSchema = z.object({
  body: z.object({
    produceId: z.string().uuid('produceId must be a valid UUID'),
  }),
});

const statusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']),
  }),
});

/**
 * @swagger
 * /orders/me:
 *   get:
 *     summary: Get my orders (Vendor or Customer)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my orders
 */
router.get('/me', auth('CUSTOMER', 'VENDOR'), orderController.getMyOrders);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               produceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order placed
 */
router.post('/', auth('CUSTOMER'), validate(orderSchema), orderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 */
router.get('/', auth('ADMIN'), orderController.getAllOrders);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
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
 *                 enum: [PENDING, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Order updated
 */
router.patch('/:id/status', auth('VENDOR', 'ADMIN'), validate(statusSchema), orderController.updateStatus);

export default router;
