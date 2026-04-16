import { Router } from 'express';
import * as spaceController from '../modules/rentalSpace/rentalSpace.controller';
import { auth } from '../middlewares/auth';
import { z } from 'zod';
import { validate } from '../middlewares/validate';

const router = Router();

const spaceSchema = z.object({
  body: z.object({
    location: z.string().min(1, 'Location is required'),
    size: z.number().positive(),
    price: z.number().positive(),
    availability: z.boolean().optional(),
  }),
});

/**
 * @swagger
 * /rental-spaces:
 *   get:
 *     summary: Get all rental spaces
 *     tags: [RentalSpaces]
 *     responses:
 *       200:
 *         description: List of rental spaces
 */
router.get('/', spaceController.getSpaces);

/**
 * @swagger
 * /rental-spaces/{id}:
 *   get:
 *     summary: Get single rental space
 *     tags: [RentalSpaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Rental space retrieved
 */
router.get('/:id', spaceController.getSpace);

/**
 * @swagger
 * /rental-spaces:
 *   post:
 *     summary: Create rental space
 *     tags: [RentalSpaces]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *               size:
 *                 type: number
 *               price:
 *                 type: number
 *               availability:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Space created
 */
router.post('/', auth('VENDOR'), validate(spaceSchema), spaceController.createSpace);

/**
 * @swagger
 * /rental-spaces/{id}:
 *   patch:
 *     summary: Update rental space
 *     tags: [RentalSpaces]
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
 *     responses:
 *       200:
 *         description: Space updated
 */
router.patch('/:id', auth('VENDOR'), spaceController.updateSpace);

/**
 * @swagger
 * /rental-spaces/{id}:
 *   delete:
 *     summary: Delete rental space
 *     tags: [RentalSpaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Space deleted
 */
router.delete('/:id', auth('VENDOR'), spaceController.deleteSpace);

export default router;
