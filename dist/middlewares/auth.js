"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../utils/AppError");
const env_1 = require("../config/env");
const prisma_1 = __importDefault(require("../config/prisma"));
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            let token;
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
            }
            if (!token) {
                return next(new AppError_1.AppError(401, 'You are not logged in! Please log in to get access.'));
            }
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwt.secret);
            const currentUser = await prisma_1.default.user.findUnique({
                where: { id: decoded.id },
            });
            if (!currentUser) {
                return next(new AppError_1.AppError(401, 'The user belonging to this token does no longer exist.'));
            }
            if (roles.length && !roles.includes(currentUser.role)) {
                return next(new AppError_1.AppError(403, 'You do not have permission to perform this action'));
            }
            req.user = currentUser;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.auth = auth;
