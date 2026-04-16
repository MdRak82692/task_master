import prisma from '../../config/prisma';
import { AppError } from '../../utils/AppError';

export const createBooking = async (customerId: string, data: any) => {
  const space = await prisma.rentalSpace.findUnique({ where: { id: data.rentalSpaceId } });
  
  if (!space) throw new AppError(404, 'Rental space not found');
  if (!space.availability) throw new AppError(400, 'Space is not available');

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  // Check conflicts
  const conflicts = await prisma.rentalBooking.findFirst({
    where: {
      rentalSpaceId: space.id,
      status: { in: ['PENDING', 'CONFIRMED'] },
      OR: [
        { startDate: { lte: endDate }, endDate: { gte: startDate } }
      ]
    }
  });

  if (conflicts) throw new AppError(400, 'Space is already booked for these dates');

  return await prisma.rentalBooking.create({
    data: {
      rentalSpaceId: space.id,
      customerId,
      startDate,
      endDate,
    },
  });
};

export const getMyBookings = async (userId: string, role: string, skip: number, limit: number) => {
  const where: any = {};
  
  if (role === 'CUSTOMER') {
    where.customerId = userId;
  } else if (role === 'VENDOR') {
    const profile = await prisma.vendorProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError(404, 'Vendor profile not found');
    where.rentalSpace = { vendorId: profile.id };
  }

  const bookings = await prisma.rentalBooking.findMany({
    where,
    skip,
    take: limit,
    include: {
      rentalSpace: { select: { location: true } }
    },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.rentalBooking.count({ where });
  return { bookings, total };
};

export const getAllBookings = async (skip: number, limit: number) => {
  const bookings = await prisma.rentalBooking.findMany({
    skip,
    take: limit,
    include: { rentalSpace: true },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.rentalBooking.count();
  return { bookings, total };
};

export const cancelBooking = async (userId: string, role: string, id: string) => {
  const booking = await prisma.rentalBooking.findUnique({ 
    where: { id },
    include: { rentalSpace: true }
  });

  if (!booking) throw new AppError(404, 'Booking not found');

  if (role === 'CUSTOMER' && booking.customerId !== userId) {
    throw new AppError(403, 'Not authorized');
  }

  return await prisma.rentalBooking.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });
};
