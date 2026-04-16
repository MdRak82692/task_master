"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certController = __importStar(require("../modules/certification/certification.controller"));
const auth_1 = require("../middlewares/auth");
const zod_1 = require("zod");
const validate_1 = require("../middlewares/validate");
const router = (0, express_1.Router)();
const certSchema = zod_1.z.object({
    body: zod_1.z.object({
        certifyingAgency: zod_1.z.string().min(1, 'Agency is required'),
        certificationDate: zod_1.z.string().datetime(),
    }),
});
/**
 * @swagger
 * /certifications/me:
 *   get:
 *     summary: Get my certifications
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my certifications
 */
router.get('/me', (0, auth_1.auth)('VENDOR'), certController.getMyCerts);
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
router.post('/', (0, auth_1.auth)('VENDOR'), (0, validate_1.validate)(certSchema), certController.submitCert);
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
router.get('/', (0, auth_1.auth)('ADMIN'), certController.getCerts);
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
router.patch('/:id/approve', (0, auth_1.auth)('ADMIN'), certController.approveCert);
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
router.patch('/:id/reject', (0, auth_1.auth)('ADMIN'), certController.rejectCert);
exports.default = router;
