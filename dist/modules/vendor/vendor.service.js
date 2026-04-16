"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVendors = exports.updateProfile = exports.getProfile = exports.createProfile = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = require("../../utils/AppError");
const createProfile = async (userId, data) => {
    const existing = await prisma_1.default.vendorProfile.findUnique({ where: { userId } });
    if (existing) {
        throw new AppError_1.AppError(409, 'Vendor profile already exists');
    }
    return await prisma_1.default.vendorProfile.create({
        data: {
            userId,
            farmName: data.farmName,
            farmLocation: data.farmLocation,
        },
    });
};
exports.createProfile = createProfile;
const getProfile = async (userId) => {
    const profile = await prisma_1.default.vendorProfile.findUnique({
        where: { userId },
    });
    if (!profile) {
        throw new AppError_1.AppError(404, 'Vendor profile not found');
    }
    return profile;
};
exports.getProfile = getProfile;
const updateProfile = async (userId, data) => {
    const profile = await prisma_1.default.vendorProfile.findUnique({ where: { userId } });
    if (!profile) {
        throw new AppError_1.AppError(404, 'Vendor profile not found');
    }
    return await prisma_1.default.vendorProfile.update({
        where: { userId },
        data,
    });
};
exports.updateProfile = updateProfile;
const getAllVendors = async (skip, limit) => {
    const vendors = await prisma_1.default.vendorProfile.findMany({
        skip,
        take: limit,
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
        },
    });
    const total = await prisma_1.default.vendorProfile.count();
    return { vendors, total };
};
exports.getAllVendors = getAllVendors;
