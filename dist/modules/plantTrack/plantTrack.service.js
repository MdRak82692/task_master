"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTrack = exports.getTrackById = exports.getMyTracks = exports.createTrack = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = require("../../utils/AppError");
const plantTrack_events_1 = require("./plantTrack.events");
const createTrack = async (customerId, data) => {
    const rentalSpace = await prisma_1.default.rentalSpace.findUnique({
        where: { id: data.rentalSpaceId },
    });
    if (!rentalSpace)
        throw new AppError_1.AppError(404, 'Rental space not found');
    const track = await prisma_1.default.plantTrack.create({
        data: {
            customerId,
            vendorId: rentalSpace.vendorId, // associate with space owner
            rentalSpaceId: data.rentalSpaceId,
            plantName: data.plantName,
            expectedHarvestDate: data.expectedHarvestDate ? new Date(data.expectedHarvestDate) : null,
        },
    });
    plantTrack_events_1.trackingEmitter.emit(plantTrack_events_1.EVENTS.TRACKING_CREATED, track);
    return track;
};
exports.createTrack = createTrack;
const getMyTracks = async (userId, role, skip, limit) => {
    const where = {};
    if (role === 'CUSTOMER') {
        where.customerId = userId;
    }
    else if (role === 'VENDOR') {
        const profile = await prisma_1.default.vendorProfile.findUnique({ where: { userId } });
        if (!profile)
            throw new AppError_1.AppError(404, 'Vendor profile not found');
        where.vendorId = profile.id;
    }
    const tracks = await prisma_1.default.plantTrack.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
    });
    const total = await prisma_1.default.plantTrack.count({ where });
    return { tracks, total };
};
exports.getMyTracks = getMyTracks;
const getTrackById = async (id) => {
    const track = await prisma_1.default.plantTrack.findUnique({ where: { id } });
    if (!track)
        throw new AppError_1.AppError(404, 'Plant track not found');
    return track;
};
exports.getTrackById = getTrackById;
const updateTrack = async (userId, role, id, data) => {
    const track = await prisma_1.default.plantTrack.findUnique({ where: { id } });
    if (!track)
        throw new AppError_1.AppError(404, 'Plant track not found');
    if (role === 'CUSTOMER' && track.customerId !== userId)
        throw new AppError_1.AppError(403, 'Not authorized');
    if (role === 'VENDOR') {
        const profile = await prisma_1.default.vendorProfile.findUnique({ where: { userId } });
        if (track.vendorId !== profile?.id)
            throw new AppError_1.AppError(403, 'Not authorized');
    }
    const updated = await prisma_1.default.plantTrack.update({
        where: { id },
        data,
    });
    plantTrack_events_1.trackingEmitter.emit(plantTrack_events_1.EVENTS.TRACKING_UPDATED, updated);
    return updated;
};
exports.updateTrack = updateTrack;
