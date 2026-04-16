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
const vendorController = __importStar(require("../modules/vendor/vendor.controller"));
const auth_1 = require("../middlewares/auth");
const zod_1 = require("zod");
const validate_1 = require("../middlewares/validate");
const router = (0, express_1.Router)();
const profileSchema = zod_1.z.object({
    body: zod_1.z.object({
        farmName: zod_1.z.string().min(1, 'Farm name is required'),
        farmLocation: zod_1.z.string().min(1, 'Farm location is required'),
    }),
});
const updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        farmName: zod_1.z.string().optional(),
        farmLocation: zod_1.z.string().optional(),
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
router.post('/profile', (0, auth_1.auth)('VENDOR'), (0, validate_1.validate)(profileSchema), vendorController.createProfile);
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
router.get('/profile/me', (0, auth_1.auth)('VENDOR'), vendorController.getMe);
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
router.patch('/profile/me', (0, auth_1.auth)('VENDOR'), (0, validate_1.validate)(updateProfileSchema), vendorController.updateMe);
exports.default = router;
