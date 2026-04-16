"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.getAllBookings = exports.getMyBookings = exports.createBooking = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = require("../../utils/AppError");
const createBooking = async (customerId, data) => {
    const space = await prisma_1.default.rentalSpace.findUnique({ where: { id: data.rentalSpaceId } });
    if (!space)
        throw new AppError_1.AppError(404, 'Rental space not found');
    if (!space.availability)
        throw new AppError_1.AppError(400, 'Space is not available');
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    // Check conflicts
    const conflicts = await prisma_1.default.rentalBooking.findFirst({
        where: {
            rentalSpaceId: space.id,
            status: { in: ['PENDING', 'CONFIRMED'] },
            OR: [
                { startDate: { lte: endDate }, endDate: { gte: startDate } }
            ]
        }
    });
    if (conflicts)
        throw new AppError_1.AppError(400, 'Space is already booked for these dates');
    return await prisma_1.default.rentalBooking.create({
        data: {
            rentalSpaceId: space.id,
            customerId,
            startDate,
            endDate,
        },
    });
};
exports.createBooking = createBooking;
const getMyBookings = async (userId, role, skip, limit) => {
    const where = {};
    if (role === 'CUSTOMER') {
        where.customerId = userId;
    }
    else if (role === 'VENDOR') {
        const profile = await prisma_1.default.vendorProfile.findUnique({ where: { userId } });
        if (!profile)
            throw new AppError_1.AppError(404, 'Vendor profile not found');
        where.rentalSpace = { vendorId: profile.id };
    }
    const bookings = await prisma_1.default.rentalBooking.findMany({
        where,
        skip,
        take: limit,
        include: {
            rentalSpace: { select: { location: true } }
        },
        orderBy: { createdAt: 'desc' },
    });
    const total = await prisma_1.default.rentalBooking.count({ where });
    return { bookings, total };
};
exports.getMyBookings = getMyBookings;
const getAllBookings = async (skip, limit) => {
    const bookings = await prisma_1.default.rentalBooking.findMany({
        skip,
        take: limit,
        include: { rentalSpace: true },
        orderBy: { createdAt: 'desc' },
    });
    const total = await prisma_1.default.rentalBooking.count();
    return { bookings, total };
};
exports.getAllBookings = getAllBookings;
const cancelBooking = async (userId, role, id) => {
    const booking = await prisma_1.default.rentalBooking.findUnique({
        where: { id },
        include: { rentalSpace: true }
    });
    if (!booking)
        throw new AppError_1.AppError(404, 'Booking not found');
    if (role === 'CUSTOMER' && booking.customerId !== userId) {
        throw new AppError_1.AppError(403, 'Not authorized');
    }
    return await prisma_1.default.rentalBooking.update({
        where: { id },
        data: { status: 'CANCELLED' },
    });
};
exports.cancelBooking = cancelBooking;
