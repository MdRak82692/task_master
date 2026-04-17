import prisma from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { OrderStatus } from '@prisma/client';

export const createOrder = async (userId: string, data: any) => {
  const product = await prisma.produce.findUnique({ where: { id: data.produceId } });

  if (!product) throw new AppError(404, 'Product not found');
  if (product.availableQuantity <= 0) throw new AppError(400, 'Product is out of stock');

  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        produceId: data.produceId,
        vendorId: product.vendorId, // as requested
      },
    });

    await tx.produce.update({
      where: { id: data.produceId },
      data: { availableQuantity: product.availableQuantity - data.quantity },
    });

    return order;
  });
};

export const getMyOrders = async (userId: string, role: string, skip: number, limit: number) => {
  const where: any = {};

  if (role === 'CUSTOMER') {
    where.userId = userId;
  } else if (role === 'VENDOR') {
    const profile = await prisma.vendorProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError(404, 'Vendor profile not found');
    where.vendorId = profile.id;
  }

  const orders = await prisma.order.findMany({
    where,
    skip,
    take: limit,
    include: {
      produce: { select: { name: true, price: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.order.count({ where });
  return { orders, total };
};

export const getAllOrders = async (skip: number, limit: number) => {
  const orders = await prisma.order.findMany({
    skip,
    take: limit,
    include: {
      produce: { select: { name: true } },
      user: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.order.count();
  return { orders, total };
};

export const updateOrderStatus = async (userId: string, role: string, id: string, status: OrderStatus) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new AppError(404, 'Order not found');

  if (role === 'VENDOR') {
    const profile = await prisma.vendorProfile.findUnique({ where: { userId } });
    if (order.vendorId !== profile?.id) throw new AppError(403, 'Not authorized');
  } else if (role !== 'ADMIN') {
    throw new AppError(403, 'Not authorized');
  }

  return await prisma.order.update({
    where: { id },
    data: { status },
  });
};
