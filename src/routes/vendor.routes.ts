import { Router } from 'express';
import * as vendorController from '../modules/vendor/vendor.controller';
import { auth } from '../middlewares/auth';
import { z } from 'zod';
import { validate } from '../middlewares/validate';

const router = Router();

const profileSchema = z.object({
  body: z.object({
    farmName: z.string().min(1, 'Farm name is required'),
    farmLocation: z.string().min(1, 'Farm location is required'),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    farmName: z.string().optional(),
    farmLocation: z.string().optional(),
  }),
});

/**
 * @swagger
 * /vendors:
 *   get:
 *     summary: Get all vendors
 *     tags: [Vendors]
 *     responses:
 *       200:
 *         description: List of vendors
 */
router.get('/', vendorController.getVendors);

/**
 * @swagger
 * /vendors/profile:
 *   post:
 *     summary: Create vendor profile
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               farmName:
 *                 type: string
 *               farmLocation:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vendor profile created
 */
router.post('/profile', auth('VENDOR'), validate(profileSchema), vendorController.createProfile);

/**
 * @swagger
 * /vendors/profile/me:
 *   get:
 *     summary: Get my vendor profile
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My vendor profile
 */
router.get('/profile/me', auth('VENDOR'), vendorController.getMe);

/**
 * @swagger
 * /vendors/profile/me:
 *   patch:
 *     summary: Update my vendor profile
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               farmName:
 *                 type: string
 *               farmLocation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch('/profile/me', auth('VENDOR'), validate(updateProfileSchema), vendorController.updateMe);

export default router;
