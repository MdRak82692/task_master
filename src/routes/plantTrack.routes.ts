import { Router } from 'express';
import * as trackController from '../modules/plantTrack/plantTrack.controller';
import { auth } from '../middlewares/auth';
import { z } from 'zod';
import { validate } from '../middlewares/validate';

const router = Router();

// Stream endpoint must be before /:id to avoid matching :id with 'stream'
/**
 * @swagger
 * /plant-tracks/stream:
 *   get:
 *     summary: Connect to Server-Sent Events (SSE) for plant tracking real-time updates
 *     tags: [PlantTracks]
 *     responses:
 *       200:
 *         description: SSE Stream connection established
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 */
router.get('/stream', trackController.streamTracks);

const trackSchema = z.object({
  body: z.object({
    rentalSpaceId: z.string().uuid(),
    plantName: z.string().min(1),
    expectedHarvestDate: z.string().datetime().optional(),
  }),
});

/**
 * @swagger
 * /plant-tracks/me:
 *   get:
 *     summary: Get my plant tracks
 *     tags: [PlantTracks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of plant tracks
 */
router.get('/me', auth('CUSTOMER', 'VENDOR'), trackController.getMyTracks);

/**
 * @swagger
 * /plant-tracks:
 *   post:
 *     summary: Track a new plant (Customer only)
 *     tags: [PlantTracks]
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
 *               plantName:
 *                 type: string
 *               expectedHarvestDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Plant track created
 */
router.post('/', auth('CUSTOMER'), validate(trackSchema), trackController.createTrack);

/**
 * @swagger
 * /plant-tracks/{id}:
 *   get:
 *     summary: Get single tracking record
 *     tags: [PlantTracks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Plant track retrieved
 */
router.get('/:id', auth('CUSTOMER', 'VENDOR'), trackController.getTrack);

/**
 * @swagger
 * /plant-tracks/{id}:
 *   patch:
 *     summary: Update plant track status
 *     tags: [PlantTracks]
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
 *               growthStage:
 *                 type: string
 *                 enum: [SEED, SPROUT, VEGETATIVE, FLOWERING, HARVESTING]
 *               healthStatus:
 *                 type: string
 *                 enum: [EXCELLENT, GOOD, FAIR, POOR]
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plant track updated
 */
router.patch('/:id', auth('CUSTOMER', 'VENDOR'), trackController.updateTrack);

export default router;
