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
      availability: data.availability ?? true,
    },
  });
};

export const getSpaces = async (filters: any, skip: number, limit: number) => {
  const where: Prisma.RentalSpaceWhereInput = {};

  if (filters.location) {
    where.location = { contains: filters.location, mode: 'insensitive' };
  }
  if (filters.availability !== undefined) {
    where.availability = filters.availability === 'true';
  }

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
