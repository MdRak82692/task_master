"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../../utils/AppError");
const env_1 = require("../../config/env");
const client_1 = require("@prisma/client");
const registerUser = async (data) => {
    const existingUser = await prisma_1.default.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        throw new AppError_1.AppError(409, 'Email already exists');
    }
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
    const userRole = data.role ? data.role : client_1.UserRole.CUSTOMER;
    const newUser = await prisma_1.default.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: userRole,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    return newUser;
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const user = await prisma_1.default.user.findUnique({ where: { email: data.email } });
    if (!user || user.status !== 'ACTIVE') {
        throw new AppError_1.AppError(401, 'Invalid credentials or inactive user');
    }
    const isMatch = await bcryptjs_1.default.compare(data.password, user.password);
    if (!isMatch) {
        throw new AppError_1.AppError(401, 'Invalid credentials');
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, env_1.env.jwt.secret, {
        expiresIn: env_1.env.jwt.expiresIn,
    });
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
};
exports.loginUser = loginUser;
