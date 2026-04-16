"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStatus = exports.getUserById = exports.getAllUsers = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = require("../../utils/AppError");
const getAllUsers = async (skip, limit) => {
    const users = await prisma_1.default.user.findMany({
        skip,
        take: limit,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
        },
    });
    const total = await prisma_1.default.user.count();
    return { users, total };
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    });
    if (!user) {
        throw new AppError_1.AppError(404, 'User not found');
    }
    return user;
};
exports.getUserById = getUserById;
const updateUserStatus = async (id, status) => {
    return await prisma_1.default.user.update({
        where: { id },
        data: { status },
        select: { id: true, name: true, email: true, role: true, status: true },
    });
};
exports.updateUserStatus = updateUserStatus;
