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
exports.rejectCert = exports.approveCert = exports.getCerts = exports.getMyCerts = exports.submitCert = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const response_1 = require("../../utils/response");
const validationService = __importStar(require("./certification.service"));
const pagination_1 = require("../../utils/pagination");
exports.submitCert = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const cert = await validationService.submitCertification(req.user.id, req.body);
    (0, response_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Certification submitted successfully',
        data: cert,
    });
});
exports.getMyCerts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const certs = await validationService.getMyCertifications(req.user.id);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Certifications retrieved successfully',
        data: certs,
    });
});
exports.getCerts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.extractPagination)(req);
    const { certs, total } = await validationService.getAllCertifications(skip, limit);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Certifications retrieved successfully',
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: certs,
    });
});
exports.approveCert = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const cert = await validationService.updateCertificationStatus(req.params.id, 'APPROVED');
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Certification approved',
        data: cert,
    });
});
exports.rejectCert = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const cert = await validationService.updateCertificationStatus(req.params.id, 'REJECTED');
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Certification rejected',
        data: cert,
    });
});
