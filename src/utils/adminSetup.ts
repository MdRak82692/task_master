import prisma from '../config/prisma';
import { UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

// No need to create new PrismaClient() here


export const setupAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = '123456';

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      console.log('🔄 Admin user not found. Creating automatic admin...');

      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      await prisma.user.create({
        data: {
          name: 'Super Admin',
          email: adminEmail,
          password: hashedPassword,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
        },
      });

      console.log(`✅ Admin user created successfully: ${adminEmail}`);
    } else {
      console.log('✅ Admin user verified.');
    }
  } catch (error) {
    console.error('❌ Error during automatic admin setup:', error);
  }
};
