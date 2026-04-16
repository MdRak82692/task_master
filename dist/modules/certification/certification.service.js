"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCertificationStatus = exports.getAllCertifications = exports.getMyCertifications = exports.submitCertification = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = require("../../utils/AppError");
const submitCertification = async (userId, data) => {
    const profile = await prisma_1.default.vendorProfile.findUnique({ where: { userId } });
    if (!profile) {
        throw new AppError_1.AppError(404, 'Vendor profile not found');
    }
    return await prisma_1.default.sustainabilityCert.create({
        data: {
            vendorId: profile.id,
            certifyingAgency: data.certifyingAgency,
            certificationDate: new Date(data.certificationDate),
        },
    });
};
exports.submitCertification = submitCertification;
const getMyCertifications = async (userId) => {
    const profile = await prisma_1.default.vendorProfile.findUnique({ where: { userId } });
    if (!profile) {
        throw new AppError_1.AppError(404, 'Vendor profile not found');
    }
    return await prisma_1.default.sustainabilityCert.findMany({
        where: { vendorId: profile.id },
    });
};
exports.getMyCertifications = getMyCertifications;
const getAllCertifications = async (skip, limit) => {
    const certs = await prisma_1.default.sustainabilityCert.findMany({
        skip,
        take: limit,
        include: {
            vendor: {
                select: { farmName: true, user: { select: { email: true } } },
            },
        },
    });
    const total = await prisma_1.default.sustainabilityCert.count();
    return { certs, total };
};
exports.getAllCertifications = getAllCertifications;
const updateCertificationStatus = async (id, status) => {
    const cert = await prisma_1.default.sustainabilityCert.update({
        where: { id },
        data: { status },
    });
    if (status === 'APPROVED') {
        await prisma_1.default.vendorProfile.update({
            where: { id: cert.vendorId },
            data: { certificationStatus: 'APPROVED' },
        });
    }
    return cert;
};
exports.updateCertificationStatus = updateCertificationStatus;
