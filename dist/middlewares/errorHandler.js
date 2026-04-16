"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const AppError_1 = require("../utils/AppError");
const env_1 = require("../config/env");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errorDetails = null;
    if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        errorDetails = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = 409;
            message = 'Duplicate field value entered';
            errorDetails = { field: err.meta?.target };
        }
        else if (err.code === 'P2025') {
            statusCode = 404;
            message = 'Record not found';
        }
    }
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again!';
    }
    else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your token has expired! Please log in again.';
    }
    else if (err instanceof Error) {
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
        ...(env_1.env.env === 'development' && { stack: err.stack }),
    });
};
exports.globalErrorHandler = globalErrorHandler;
