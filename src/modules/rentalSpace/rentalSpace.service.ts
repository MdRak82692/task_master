import prisma from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { Prisma } from '@prisma/client';

export const createSpace = async (userId: string, data: any) => {
  const profile = await prisma.vendorProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(404, 'Vendor profile not found');

  return await prisma.rentalSpace.create({
    data: {
      vendorId: profile.id,
      location: data.location,
      size: data.size,
      price: data.price,
      description: data.description,
      amenities: data.amenities,
    },
  });
};

export const getSpaces = async (
  filters: any,
  skip: number,
  limit: number,
) => {
  const where: Prisma.RentalSpaceWhereInput = {};

  if (filters.location) {
    where.location = { contains: filters.location, mode: 'insensitive' };
  }

  // ── Availability filter by date-time range ──────────────────────────────
  if (filters.startDate && filters.endDate) {
    const requestedStart = new Date(filters.startDate);
    const requestedEnd = new Date(filters.endDate);

    if (isNaN(requestedStart.getTime()) || isNaN(requestedEnd.getTime())) {
      throw new AppError(400, 'Invalid startDate or endDate format. Use ISO 8601 (e.g. 2026-04-20T10:00:00Z)');
    }

    if (requestedStart >= requestedEnd) {
      throw new AppError(400, 'startDate must be before endDate');
    }

    // Find all spaces that have a conflicting booking in the requested window
    const conflictingBookings = await prisma.rentalBooking.findMany({
      where: {
        status: { in: ['PENDING', 'CONFIRMED'] },
        // Overlap condition: existing.start < requested.end AND existing.end > requested.start
        startDate: { lt: requestedEnd },
        endDate:   { gt: requestedStart },
      },
      select: { rentalSpaceId: true },
    });

    const bookedSpaceIds = [...new Set(conflictingBookings.map((b) => b.rentalSpaceId))];

    // Exclude those booked spaces
    if (bookedSpaceIds.length > 0) {
      where.id = { notIn: bookedSpaceIds };
    }
  }
  // ────────────────────────────────────────────────────────────────────────

  const spaces = await prisma.rentalSpace.findMany({
    where,
    skip,
    take: limit,
    include: { vendor: { select: { farmName: true, user: { select: { name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.rentalSpace.count({ where });
  return { spaces, total };
};

export const getSpaceById = async (id: string) => {
  const space = await prisma.rentalSpace.findUnique({
    where: { id },
    include: { vendor: { select: { farmName: true } } },
  });

  if (!space) throw new AppError(404, 'Rental space not found');
  return space;
};

export const updateSpace = async (userId: string, id: string, data: any) => {
  const profile = await prisma.vendorProfile.findUnique({ where: { userId } });
  const space = await prisma.rentalSpace.findUnique({ where: { id } });

  if (!space) throw new AppError(404, 'Rental space not found');
  if (space.vendorId !== profile?.id) throw new AppError(403, 'Not authorized');

  return await prisma.rentalSpace.update({
    where: { id },
    data,
  });
};

export const deleteSpace = async (userId: string, id: string) => {
  const profile = await prisma.vendorProfile.findUnique({ where: { userId } });
  const space = await prisma.rentalSpace.findUnique({ where: { id } });

  if (!space) throw new AppError(404, 'Rental space not found');
  if (space.vendorId !== profile?.id) throw new AppError(403, 'Not authorized');

  return await prisma.rentalSpace.delete({ where: { id } });
};
