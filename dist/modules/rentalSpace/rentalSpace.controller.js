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
exports.deleteSpace = exports.updateSpace = exports.getSpace = exports.getSpaces = exports.createSpace = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const response_1 = require("../../utils/response");
const rentalSpaceService = __importStar(require("./rentalSpace.service"));
const pagination_1 = require("../../utils/pagination");
exports.createSpace = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const space = await rentalSpaceService.createSpace(req.user.id, req.body);
    (0, response_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Rental space created successfully',
        data: space,
    });
});
exports.getSpaces = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.extractPagination)(req);
    const filters = {
        location: req.query.location,
        availability: req.query.availability,
    };
    const { spaces, total } = await rentalSpaceService.getSpaces(filters, skip, limit);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Rental spaces retrieved successfully',
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: spaces,
    });
});
exports.getSpace = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const space = await rentalSpaceService.getSpaceById(req.params.id);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Rental space retrieved successfully',
        data: space,
    });
});
exports.updateSpace = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const space = await rentalSpaceService.updateSpace(req.user.id, req.params.id, req.body);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Rental space updated successfully',
        data: space,
    });
});
exports.deleteSpace = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await rentalSpaceService.deleteSpace(req.user.id, req.params.id);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Rental space deleted successfully',
    });
});
