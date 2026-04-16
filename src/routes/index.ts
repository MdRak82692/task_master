import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import vendorRoutes from './vendor.routes';
import certificationRoutes from './certification.routes';
import productRoutes from './product.routes';
import rentalSpaceRoutes from './rentalSpace.routes';
import bookingRoutes from './booking.routes';
import orderRoutes from './order.routes';
import plantTrackRoutes from './plantTrack.routes';
import communityPostRoutes from './communityPost.routes';
import adminRoutes from './admin.routes';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: authRoutes },
  { path: '/users', route: userRoutes },
  { path: '/vendors', route: vendorRoutes },
  { path: '/certifications', route: certificationRoutes },
  { path: '/products', route: productRoutes },
  { path: '/rental-spaces', route: rentalSpaceRoutes },
  { path: '/bookings', route: bookingRoutes },
  { path: '/orders', route: orderRoutes },
  { path: '/plant-tracks', route: plantTrackRoutes },
  { path: '/community-posts', route: communityPostRoutes },
  { path: '/admin', route: adminRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
