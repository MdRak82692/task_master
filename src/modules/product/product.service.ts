import prisma from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { Prisma } from '@prisma/client';

export const createProduct = async (userId: string, data: any) => {
  const profile = await prisma.vendorProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new AppError(404, 'Vendor profile not found');
  }

  if (profile.certificationStatus !== 'APPROVED') {
    throw new AppError(403, 'Vendor profile not approved');
  }

  return await prisma.produce.create({
    data: {
      vendorId: profile.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      availableQuantity: data.quantity,
      certificationStatus: profile.certificationStatus, // Inherit from vendor
    },
  });
};

export const getProducts = async (filters: any, skip: number, limit: number) => {
  const where: Prisma.ProduceWhereInput = {};

  if (filters.search) {
    where.name = { contains: filters.search, mode: 'insensitive' };
  }
  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.vendorId) {
    where.vendorId = filters.vendorId;
  }

  const products = await prisma.produce.findMany({
    where,
    skip,
    take: limit,
    include: {
      vendor: {
        select: { farmName: true, certificationStatus: true },
      },
    },
    orderBy: filters.sortBy ? { [filters.sortBy]: filters.sortOrder } : { createdAt: 'desc' },
  });

  const total = await prisma.produce.count({ where });

  return { products, total };
};

export const getProductById = async (id: string) => {
  const product = await prisma.produce.findUnique({
    where: { id },
    include: {
      vendor: {
        select: {
          farmName: true, user: {
            select: {
              name: true
            }
          }
        }
      }
    },
  });

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  return product;
};

export const updateProduct = async (userId: string, id: string, data: any) => {
  const profile = await prisma.vendorProfile.findUnique({ where: { userId } });
  const product = await prisma.produce.findUnique({ where: { id } });

  if (!product) throw new AppError(404, 'Product not found');
  if (product.vendorId !== profile?.id) throw new AppError(403, 'Not authorized to edit this product');

  // availableQuantity = পুরনো quantity + নতুন quantity (যদি পাঠানো হয়)
  const newAvailableQuantity =
    data.quantity !== undefined
      ? product.availableQuantity + data.quantity
      : undefined;

  return await prisma.produce.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      availableQuantity: newAvailableQuantity,

    },
  });
};


export const deleteProduct = async (userId: string, id: string) => {
  const profile = await prisma.vendorProfile.findUnique({ where: { userId } });
  const product = await prisma.produce.findUnique({ where: { id } });

  if (!product) throw new AppError(404, 'Product not found');
  if (product.vendorId !== profile?.id) throw new AppError(403, 'Not authorized to delete this product');

  return await prisma.produce.delete({ where: { id } });
};
