import { Router } from 'express';
import * as certController from '../modules/certification/certification.controller';
import { auth } from '../middlewares/auth';
import { z } from 'zod';
import { validate } from '../middlewares/validate';

const router = Router();

const certSchema = z.object({
  body: z.object({
    certifyingAgency: z.string().min(1, 'Agency is required'),
    certificationDate: z.string().datetime(),
    certificationType: z.string().min(1, 'Certification type is required'),
    description: z.string().min(1, 'Description is required'),
  }),
});

const updateCertStatusSchema = z.object({
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED']),
  }),
});



/**
 * @swagger
 * /certifications:
 *   post:
 *     summary: Submit a new certification
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               certifyingAgency:
 *                 type: string
 *               certificationDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Certification submitted
 */
router.post('/', auth('VENDOR'), validate(certSchema), certController.submitCert);

/**
 * @swagger
 * /certifications:
 *   get:
 *     summary: Get all certifications
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of certifications
 */
router.get('/', auth('ADMIN'), certController.getCerts);

/**
 * @swagger
 * /certifications/{id}/approve:
 *   patch:
 *     summary: Approve a certification
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Certification approved
 */
router.patch('/:id', auth('ADMIN'), validate(updateCertStatusSchema), certController.updateCertStatus);

/**
 * @swagger
 * /certifications/{id}/reject:
 *   patch:
 *     summary: Reject a certification
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Certification rejected
 */


export default router;
