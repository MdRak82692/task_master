import prisma from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { UserStatus } from '@prisma/client';

export const getAllUsers = async (skip: number, limit: number) => {
  const users = await prisma.user.findMany({
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
  
  const total = await prisma.user.count();
  return { users, total };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};

export const updateUserStatus = async (id: string, status: UserStatus) => {
  return await prisma.user.update({
    where: { id },
    data: { status },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};
