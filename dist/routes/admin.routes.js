"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../config/prisma"));
const auth_1 = require("../middlewares/auth");
const catchAsync_1 = require("../utils/catchAsync");
const response_1 = require("../utils/response");
const getOverview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const [totalUsers, totalVendors, totalProducts, totalOrders, totalBookings, pendingCertifications, totalPosts,] = await Promise.all([
        prisma_1.default.user.count(),
        prisma_1.default.vendorProfile.count(),
        prisma_1.default.produce.count(),
        prisma_1.default.order.count(),
        prisma_1.default.rentalBooking.count(),
        prisma_1.default.sustainabilityCert.count({ where: { status: 'PENDING' } }),
        prisma_1.default.communityPost.count(),
    ]);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Admin overview retrieved successfully',
        data: {
            totalUsers,
            totalVendors,
            totalProducts,
            totalOrders,
            totalBookings,
            pendingCertifications,
            totalPosts,
        },
    });
});
const router = (0, express_1.Router)();
/**
 * @swagger
 * /admin/overview:
 *   get:
 *     summary: Admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics
 */
router.get('/overview', (0, auth_1.auth)('ADMIN'), getOverview);
exports.default = router;
