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
const spaceController = __importStar(require("../modules/rentalSpace/rentalSpace.controller"));
const auth_1 = require("../middlewares/auth");
const zod_1 = require("zod");
const validate_1 = require("../middlewares/validate");
const router = (0, express_1.Router)();
const spaceSchema = zod_1.z.object({
    body: zod_1.z.object({
        location: zod_1.z.string().min(1, 'Location is required'),
        size: zod_1.z.number().positive(),
        price: zod_1.z.number().positive(),
        availability: zod_1.z.boolean().optional(),
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
router.post('/', (0, auth_1.auth)('VENDOR'), (0, validate_1.validate)(spaceSchema), spaceController.createSpace);
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
router.patch('/:id', (0, auth_1.auth)('VENDOR'), spaceController.updateSpace);
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
router.delete('/:id', (0, auth_1.auth)('VENDOR'), spaceController.deleteSpace);
exports.default = router;
