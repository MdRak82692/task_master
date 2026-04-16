"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.getAllOrders = exports.getMyOrders = exports.createOrder = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const response_1 = require("../../utils/response");
const orderService = __importStar(require("./order.service"));
const pagination_1 = require("../../utils/pagination");
exports.createOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const order = await orderService.createOrder(req.user.id, req.body);
    (0, response_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Order created successfully',
        data: order,
    });
});
exports.getMyOrders = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.extractPagination)(req);
    const { orders, total } = await orderService.getMyOrders(req.user.id, req.user.role, skip, limit);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'My orders retrieved successfully',
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: orders,
    });
});
exports.getAllOrders = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.extractPagination)(req);
    const { orders, total } = await orderService.getAllOrders(skip, limit);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'All orders retrieved successfully',
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: orders,
    });
});
exports.updateStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const order = await orderService.updateOrderStatus(req.user.id, req.user.role, req.params.id, req.body.status);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Order status updated successfully',
        data: order,
    });
});
