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
exports.deletePost = exports.updatePost = exports.getPost = exports.getPosts = exports.createPost = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const response_1 = require("../../utils/response");
const postService = __importStar(require("./communityPost.service"));
const pagination_1 = require("../../utils/pagination");
exports.createPost = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const post = await postService.createPost(req.user.id, req.body);
    (0, response_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Post created successfully',
        data: post,
    });
});
exports.getPosts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.extractPagination)(req);
    const { posts, total } = await postService.getPosts(skip, limit);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Posts retrieved successfully',
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: posts,
    });
});
exports.getPost = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const post = await postService.getPostById(req.params.id);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Post retrieved successfully',
        data: post,
    });
});
exports.updatePost = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const post = await postService.updatePost(req.user.id, req.user.role, req.params.id, req.body);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Post updated successfully',
        data: post,
    });
});
exports.deletePost = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await postService.deletePost(req.user.id, req.user.role, req.params.id);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Post deleted successfully',
    });
});
