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
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getProducts = exports.createProduct = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const response_1 = require("../../utils/response");
const productService = __importStar(require("./product.service"));
const pagination_1 = require("../../utils/pagination");
exports.createProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const product = await productService.createProduct(req.user.id, req.body);
    (0, response_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Product created successfully',
        data: product,
    });
});
exports.getProducts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagination_1.extractPagination)(req);
    const filters = {
        search: req.query.search,
        category: req.query.category,
        vendorId: req.query.vendorId,
        sortBy,
        sortOrder,
    };
    const { products, total } = await productService.getProducts(filters, skip, limit);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Products retrieved successfully',
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: products,
    });
});
exports.getProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Product retrieved successfully',
        data: product,
    });
});
exports.updateProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const product = await productService.updateProduct(req.user.id, req.params.id, req.body);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Product updated successfully',
        data: product,
    });
});
exports.deleteProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await productService.deleteProduct(req.user.id, req.params.id);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Product deleted successfully',
    });
});
