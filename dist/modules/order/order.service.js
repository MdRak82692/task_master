"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getMyOrders = exports.createOrder = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = require("../../utils/AppError");
const createOrder = async (userId, data) => {
    const product = await prisma_1.default.produce.findUnique({ where: { id: data.produceId } });
    if (!product)
        throw new AppError_1.AppError(404, 'Product not found');
    if (product.availableQuantity <= 0)
        throw new AppError_1.AppError(400, 'Product is out of stock');
    return await prisma_1.default.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                userId,
                produceId: data.produceId,
                vendorId: product.vendorId, // as requested
            },
        });
        await tx.produce.update({
            where: { id: data.produceId },
            data: { availableQuantity: product.availableQuantity - 1 }, // simplified assuming qty=1 per order
        });
        return order;
    });
};
exports.createOrder = createOrder;
const getMyOrders = async (userId, role, skip, limit) => {
    const where = {};
    if (role === 'CUSTOMER') {
        where.userId = userId;
    }
    else if (role === 'VENDOR') {
        const profile = await prisma_1.default.vendorProfile.findUnique({ where: { userId } });
        if (!profile)
            throw new AppError_1.AppError(404, 'Vendor profile not found');
        where.vendorId = profile.id;
    }
    const orders = await prisma_1.default.order.findMany({
        where,
        skip,
        take: limit,
        include: {
            produce: { select: { name: true, price: true } },
            user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
    const total = await prisma_1.default.order.count({ where });
    return { orders, total };
};
exports.getMyOrders = getMyOrders;
const getAllOrders = async (skip, limit) => {
    const orders = await prisma_1.default.order.findMany({
        skip,
        take: limit,
        include: {
            produce: { select: { name: true } },
            user: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
    const total = await prisma_1.default.order.count();
    return { orders, total };
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (userId, role, id, status) => {
    const order = await prisma_1.default.order.findUnique({ where: { id } });
    if (!order)
        throw new AppError_1.AppError(404, 'Order not found');
    if (role === 'VENDOR') {
        const profile = await prisma_1.default.vendorProfile.findUnique({ where: { userId } });
        if (order.vendorId !== profile?.id)
            throw new AppError_1.AppError(403, 'Not authorized');
    }
    else if (role !== 'ADMIN') {
        throw new AppError_1.AppError(403, 'Not authorized');
    }
    return await prisma_1.default.order.update({
        where: { id },
        data: { status },
    });
};
exports.updateOrderStatus = updateOrderStatus;
