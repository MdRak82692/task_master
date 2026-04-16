import prisma from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { trackingEmitter, EVENTS } from './plantTrack.events';

export const createTrack = async (customerId: string, data: any) => {
  const rentalSpace = await prisma.rentalSpace.findUnique({
    where: { id: data.rentalSpaceId },
  });

  if (!rentalSpace) throw new AppError(404, 'Rental space not found');

  const track = await prisma.plantTrack.create({
    data: {
      customerId,
      vendorId: rentalSpace.vendorId, // associate with space owner
      rentalSpaceId: data.rentalSpaceId,
      plantName: data.plantName,
      expectedHarvestDate: data.expectedHarvestDate ? new Date(data.expectedHarvestDate) : null,
    },
  });

  trackingEmitter.emit(EVENTS.TRACKING_CREATED, track);

  return track;
};

export const getMyTracks = async (userId: string, role: string, skip: number, limit: number) => {
  const where: any = {};
  
  if (role === 'CUSTOMER') {
    where.customerId = userId;
  } else if (role === 'VENDOR') {
    const profile = await prisma.vendorProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError(404, 'Vendor profile not found');
    where.vendorId = profile.id;
  }

  const tracks = await prisma.plantTrack.findMany({
    where,
    skip,
    take: limit,
    orderBy: { updatedAt: 'desc' },
  });

  const total = await prisma.plantTrack.count({ where });
  return { tracks, total };
};

export const getTrackById = async (id: string) => {
  const track = await prisma.plantTrack.findUnique({ where: { id } });
  if (!track) throw new AppError(404, 'Plant track not found');
  return track;
};

export const updateTrack = async (userId: string, role: string, id: string, data: any) => {
  const track = await prisma.plantTrack.findUnique({ where: { id } });
  if (!track) throw new AppError(404, 'Plant track not found');

  if (role === 'CUSTOMER' && track.customerId !== userId) throw new AppError(403, 'Not authorized');
  if (role === 'VENDOR') {
    const profile = await prisma.vendorProfile.findUnique({ where: { userId } });
    if (track.vendorId !== profile?.id) throw new AppError(403, 'Not authorized');
  }

  const updated = await prisma.plantTrack.update({
    where: { id },
    data,
  });

  trackingEmitter.emit(EVENTS.TRACKING_UPDATED, updated);

  return updated;
};
