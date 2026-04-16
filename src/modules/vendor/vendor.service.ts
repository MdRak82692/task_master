import prisma from '../../config/prisma';
import { AppError } from '../../utils/AppError';

export const createProfile = async (userId: string, data: any) => {
  const existing = await prisma.vendorProfile.findUnique({ where: { userId } });
  if (existing) {
    throw new AppError(409, 'Vendor profile already exists');
  }

  return await prisma.vendorProfile.create({
    data: {
      userId,
      farmName: data.farmName,
      farmLocation: data.farmLocation,
    },
  });
};

export const getProfile = async (userId: string) => {
  const profile = await prisma.vendorProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(404, 'Vendor profile not found');
  }

  return profile;
};

export const updateProfile = async (userId: string, data: any) => {
  const profile = await prisma.vendorProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new AppError(404, 'Vendor profile not found');
  }

  return await prisma.vendorProfile.update({
    where: { userId },
    data: {
      farmName: data.farmName,
      farmLocation: data.farmLocation,

    },
  });
};

export const getAllVendors = async (skip: number, limit: number) => {
  const vendors = await prisma.vendorProfile.findMany({
    skip,
    take: limit,
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  const total = await prisma.vendorProfile.count();
  return { vendors, total };
};
