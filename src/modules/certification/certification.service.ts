import prisma from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { CertificationStatus } from '@prisma/client';

export const submitCertification = async (userId: string, data: any) => {
  const profile = await prisma.vendorProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new AppError(404, 'Vendor profile not found');
  }

  return await prisma.sustainabilityCert.create({
    data: {
      vendorId: profile.id,
      certifyingAgency: data.certifyingAgency,
      certificationDate: new Date(data.certificationDate),
      certificationType: data.certificationType,
      description: data.description,
    },
  });
};



export const getAllCertifications = async (skip: number, limit: number) => {
  const certs = await prisma.sustainabilityCert.findMany({
    skip,
    take: limit,
    include: {
      vendor: {
        select: { farmName: true, user: { select: { email: true, name: true } } },
      },
    },
  });

  const total = await prisma.sustainabilityCert.count();
  return { certs, total };
};

export const updateCertificationStatus = async (id: string, status: CertificationStatus) => {

  console.log(id, status);

  const cert = await prisma.sustainabilityCert.update({
    where: { id },
    data: { status },
  });

  if (status === 'APPROVED') {
    await prisma.vendorProfile.update({
      where: { id: cert.vendorId },
      data: { certificationStatus: 'APPROVED' },
    });
  }

  return cert;
};
