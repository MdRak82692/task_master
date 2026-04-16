import { PrismaClient, UserRole, UserStatus, CertificationStatus, GrowthStage } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.plantTrack.deleteMany();
  await prisma.rentalBooking.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.order.deleteMany();
  await prisma.sustainabilityCert.deleteMany();
  await prisma.rentalSpace.deleteMany();
  await prisma.produce.deleteMany();
  await prisma.vendorProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('123456', 10);

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@gmail.com',
      password: passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  console.log(`Created admin: ${admin.email}`);

  // Create 5 Customers
  const customers = [];
  for (let i = 1; i <= 5; i++) {
    const cust = await prisma.user.create({
      data: {
        name: `Customer ${i}`,
        email: `customer${i}@urbanfarm.com`,
        password: passwordHash,
        role: UserRole.CUSTOMER,
      },
    });
    customers.push(cust);
  }
  console.log('Created 5 customers.');

  // Create 10 Vendors
  const vendors = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: `Vendor ${i}`,
        email: `vendor${i}@urbanfarm.com`,
        password: passwordHash,
        role: UserRole.VENDOR,
      },
    });

    const vendorProfile = await prisma.vendorProfile.create({
      data: {
        userId: user.id,
        farmName: `Urban Farm ${i}`,
        farmLocation: `City District ${i}`,
        certificationStatus: i <= 5 ? CertificationStatus.APPROVED : CertificationStatus.PENDING,
      },
    });

    if (i <= 5) {
      await prisma.sustainabilityCert.create({
        data: {
          vendorId: vendorProfile.id,
          certifyingAgency: `Agency ${i}`,
          status: CertificationStatus.APPROVED,
        },
      });
    }

    vendors.push(vendorProfile);
  }
  console.log('Created 10 vendors and profiles.');

  // Create 100 Products (10 per vendor)
  const products = [];
  for (let i = 0; i < 10; i++) {
    const vendor = vendors[i];
    for (let j = 1; j <= 10; j++) {
      const prod = await prisma.produce.create({
        data: {
          vendorId: vendor.id,
          name: `Produce ${j} from Farm ${i + 1}`,
          description: `Freshly picked produce ${j} from ${vendor.farmName}.`,
          price: parseFloat((Math.random() * 10 + 1).toFixed(2)),
          category: j % 2 === 0 ? 'Vegetables' : 'Fruits',
          availableQuantity: Math.floor(Math.random() * 50) + 10,
          certificationStatus: vendor.certificationStatus,
        },
      });
      products.push(prod);
    }
  }
  console.log('Created 100 products.');

  // Create some Rental Spaces
  const spaces = [];
  for (let i = 0; i < 5; i++) {
    const space = await prisma.rentalSpace.create({
      data: {
        vendorId: vendors[i].id,
        location: `Plot ${i + 1} at ${vendors[i].farmLocation}`,
        size: Math.floor(Math.random() * 20) + 10, // 10-30 sqm
        price: parseFloat((Math.random() * 50 + 20).toFixed(2)),
        availability: true,
      },
    });
    spaces.push(space);
  }

  // Create some sample Orders
  for (let i = 0; i < 15; i++) {
    const targetProduct = products[Math.floor(Math.random() * products.length)];
    const targetCustomer = customers[Math.floor(Math.random() * customers.length)];
    await prisma.order.create({
      data: {
        userId: targetCustomer.id,
        produceId: targetProduct.id,
        vendorId: targetProduct.vendorId, // as requested
      },
    });
  }
  console.log('Created sample orders.');

  // Create some sample Community Posts
  for (let i = 0; i < 10; i++) {
    await prisma.communityPost.create({
      data: {
        userId: customers[Math.floor(Math.random() * customers.length)].id,
        postContent: `This is a sample engaging post ${i + 1} about urban farming and seasonal tips!`,
      },
    });
  }

  // Create some Rental Bookings & Plant Tracks
  const bookingCustomer = customers[0];
  const targetSpace = spaces[0];

  await prisma.rentalBooking.create({
    data: {
      customerId: bookingCustomer.id,
      rentalSpaceId: targetSpace.id,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      status: 'CONFIRMED',
    },
  });

  await prisma.plantTrack.create({
    data: {
      customerId: bookingCustomer.id,
      vendorId: targetSpace.vendorId,
      rentalSpaceId: targetSpace.id,
      plantName: 'Tomato Plant (Sample)',
      growthStage: GrowthStage.VEGETATIVE,
      expectedHarvestDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  });

  console.log('Seeding completed successfuly!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
