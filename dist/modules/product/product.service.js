"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = require("../../utils/AppError");
const createProduct = async (userId, data) => {
    const profile = await prisma_1.default.vendorProfile.findUnique({ where: { userId } });
    if (!profile) {
        throw new AppError_1.AppError(404, 'Vendor profile not found');
    }
    return await prisma_1.default.produce.create({
        data: {
            vendorId: profile.id,
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            availableQuantity: data.availableQuantity,
            certificationStatus: profile.certificationStatus, // Inherit from vendor
        },
    });
};
exports.createProduct = createProduct;
const getProducts = async (filters, skip, limit) => {
    const where = {};
    if (filters.search) {
        where.name = { contains: filters.search, mode: 'insensitive' };
    }
    if (filters.category) {
        where.category = filters.category;
    }
    if (filters.vendorId) {
        where.vendorId = filters.vendorId;
    }
    const products = await prisma_1.default.produce.findMany({
        where,
        skip,
        take: limit,
        include: {
            vendor: {
                select: { farmName: true, certificationStatus: true },
            },
        },
        orderBy: filters.sortBy ? { [filters.sortBy]: filters.sortOrder } : { createdAt: 'desc' },
    });
    const total = await prisma_1.default.produce.count({ where });
    return { products, total };
};
exports.getProducts = getProducts;
const getProductById = async (id) => {
    const product = await prisma_1.default.produce.findUnique({
        where: { id },
        include: { vendor: { select: { farmName: true } } },
    });
    if (!product) {
        throw new AppError_1.AppError(404, 'Product not found');
    }
    return product;
};
exports.getProductById = getProductById;
const updateProduct = async (userId, id, data) => {
    const profile = await prisma_1.default.vendorProfile.findUnique({ where: { userId } });
    const product = await prisma_1.default.produce.findUnique({ where: { id } });
    if (!product)
        throw new AppError_1.AppError(404, 'Product not found');
    if (product.vendorId !== profile?.id)
        throw new AppError_1.AppError(403, 'Not authorized to edit this product');
    return await prisma_1.default.produce.update({
        where: { id },
        data,
    });
};
exports.updateProduct = updateProduct;
const deleteProduct = async (userId, id) => {
    const profile = await prisma_1.default.vendorProfile.findUnique({ where: { userId } });
    const product = await prisma_1.default.produce.findUnique({ where: { id } });
    if (!product)
        throw new AppError_1.AppError(404, 'Product not found');
    if (product.vendorId !== profile?.id)
        throw new AppError_1.AppError(403, 'Not authorized to delete this product');
    return await prisma_1.default.produce.delete({ where: { id } });
};
exports.deleteProduct = deleteProduct;
