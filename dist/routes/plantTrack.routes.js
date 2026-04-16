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
const trackController = __importStar(require("../modules/plantTrack/plantTrack.controller"));
const auth_1 = require("../middlewares/auth");
const zod_1 = require("zod");
const validate_1 = require("../middlewares/validate");
const router = (0, express_1.Router)();
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
const trackSchema = zod_1.z.object({
    body: zod_1.z.object({
        rentalSpaceId: zod_1.z.string().uuid(),
        plantName: zod_1.z.string().min(1),
        expectedHarvestDate: zod_1.z.string().datetime().optional(),
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
router.get('/me', (0, auth_1.auth)('CUSTOMER', 'VENDOR'), trackController.getMyTracks);
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
router.post('/', (0, auth_1.auth)('CUSTOMER'), (0, validate_1.validate)(trackSchema), trackController.createTrack);
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
router.get('/:id', (0, auth_1.auth)('CUSTOMER', 'VENDOR'), trackController.getTrack);
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
router.patch('/:id', (0, auth_1.auth)('CUSTOMER', 'VENDOR'), trackController.updateTrack);
exports.default = router;
