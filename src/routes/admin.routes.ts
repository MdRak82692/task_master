import { Request, Response } from 'express';
import { Router } from 'express';
import prisma from '../config/prisma';
import { auth } from '../middlewares/auth';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/response';

const getOverview = catchAsync(async (req: Request, res: Response) => {
  const [
    totalUsers,
    totalVendors,
    totalProducts,
    totalOrders,
    totalBookings,
    pendingCertifications,
    totalPosts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.vendorProfile.count(),
    prisma.produce.count(),
    prisma.order.count(),
    prisma.rentalBooking.count(),
    prisma.sustainabilityCert.count({ where: { status: 'PENDING' } }),
    prisma.communityPost.count(),
  ]);

  sendResponse(res, {
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

const router = Router();

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
router.get('/overview', auth('ADMIN'), getOverview);

export default router;
