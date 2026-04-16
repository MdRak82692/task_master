"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSpace = exports.updateSpace = exports.getSpaceById = exports.getSpaces = exports.createSpace = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = require("../../utils/AppError");
const createSpace = async (userId, data) => {
    const profile = await prisma_1.default.vendorProfile.findUnique({ where: { userId } });
    if (!profile)
        throw new AppError_1.AppError(404, 'Vendor profile not found');
    return await prisma_1.default.rentalSpace.create({
        data: {
            vendorId: profile.id,
            location: data.location,
            size: data.size,
            price: data.price,
            availability: data.availability ?? true,
        },
    });
};
exports.createSpace = createSpace;
const getSpaces = async (filters, skip, limit) => {
    const where = {};
    if (filters.location) {
        where.location = { contains: filters.location, mode: 'insensitive' };
    }
    if (filters.availability !== undefined) {
        where.availability = filters.availability === 'true';
    }
    const spaces = await prisma_1.default.rentalSpace.findMany({
        where,
        skip,
        take: limit,
        include: { vendor: { select: { farmName: true, user: { select: { name: true } } } } },
        orderBy: { createdAt: 'desc' },
    });
    const total = await prisma_1.default.rentalSpace.count({ where });
    return { spaces, total };
};
exports.getSpaces = getSpaces;
const getSpaceById = async (id) => {
    const space = await prisma_1.default.rentalSpace.findUnique({
        where: { id },
        include: { vendor: { select: { farmName: true } } },
    });
    if (!space)
        throw new AppError_1.AppError(404, 'Rental space not found');
    return space;
};
exports.getSpaceById = getSpaceById;
const updateSpace = async (userId, id, data) => {
    const profile = await prisma_1.default.vendorProfile.findUnique({ where: { userId } });
    const space = await prisma_1.default.rentalSpace.findUnique({ where: { id } });
    if (!space)
        throw new AppError_1.AppError(404, 'Rental space not found');
    if (space.vendorId !== profile?.id)
        throw new AppError_1.AppError(403, 'Not authorized');
    return await prisma_1.default.rentalSpace.update({
        where: { id },
        data,
    });
};
exports.updateSpace = updateSpace;
const deleteSpace = async (userId, id) => {
    const profile = await prisma_1.default.vendorProfile.findUnique({ where: { userId } });
    const space = await prisma_1.default.rentalSpace.findUnique({ where: { id } });
    if (!space)
        throw new AppError_1.AppError(404, 'Rental space not found');
    if (space.vendorId !== profile?.id)
        throw new AppError_1.AppError(403, 'Not authorized');
    return await prisma_1.default.rentalSpace.delete({ where: { id } });
};
exports.deleteSpace = deleteSpace;
