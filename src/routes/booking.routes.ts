import { Router } from 'express';
import * as bookingController from './booking.controller';
import { auth } from '../../middlewares/auth';
import { z } from 'zod';
import { validate } from '../../middlewares/validate';

const router = Router();

const bookingSchema = z.object({
  body: z.object({
    rentalSpaceId: z.string().uuid(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),
});

/**
 * @swagger
 * /bookings/me:
 *   get:
 *     summary: Get my rental bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my bookings
 */
router.get('/me', auth('CUSTOMER', 'VENDOR'), bookingController.getMyBookings);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create rental booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rentalSpaceId:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Booking created
 */
router.post('/', auth('CUSTOMER'), validate(bookingSchema), bookingController.createBooking);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 */
router.get('/', auth('ADMIN'), bookingController.getAllBookings);

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Booking cancelled
 */
router.patch('/:id/cancel', auth('CUSTOMER', 'VENDOR', 'ADMIN'), bookingController.cancelBooking);

export default router;
