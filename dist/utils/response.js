"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data) => {
    const responseData = {
        success: data.success,
        message: data.message || (data.success ? 'Success' : 'Error'),
        meta: data.meta || undefined,
        data: data.data || undefined,
    };
    res.status(data.statusCode).json(responseData);
};
exports.sendResponse = sendResponse;
