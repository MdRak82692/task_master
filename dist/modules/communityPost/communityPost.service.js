"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getPostById = exports.getPosts = exports.createPost = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = require("../../utils/AppError");
const createPost = async (userId, data) => {
    return await prisma_1.default.communityPost.create({
        data: {
            userId,
            postContent: data.postContent,
        },
    });
};
exports.createPost = createPost;
const getPosts = async (skip, limit) => {
    const posts = await prisma_1.default.communityPost.findMany({
        skip,
        take: limit,
        include: {
            user: { select: { name: true, role: true } },
        },
        orderBy: { postDate: 'desc' },
    });
    const total = await prisma_1.default.communityPost.count();
    return { posts, total };
};
exports.getPosts = getPosts;
const getPostById = async (id) => {
    const post = await prisma_1.default.communityPost.findUnique({
        where: { id },
        include: { user: { select: { name: true } } },
    });
    if (!post)
        throw new AppError_1.AppError(404, 'Post not found');
    return post;
};
exports.getPostById = getPostById;
const updatePost = async (userId, role, id, data) => {
    const post = await prisma_1.default.communityPost.findUnique({ where: { id } });
    if (!post)
        throw new AppError_1.AppError(404, 'Post not found');
    if (post.userId !== userId && role !== 'ADMIN')
        throw new AppError_1.AppError(403, 'Not authorized');
    return await prisma_1.default.communityPost.update({
        where: { id },
        data: { postContent: data.postContent },
    });
};
exports.updatePost = updatePost;
const deletePost = async (userId, role, id) => {
    const post = await prisma_1.default.communityPost.findUnique({ where: { id } });
    if (!post)
        throw new AppError_1.AppError(404, 'Post not found');
    if (post.userId !== userId && role !== 'ADMIN')
        throw new AppError_1.AppError(403, 'Not authorized');
    return await prisma_1.default.communityPost.delete({ where: { id } });
};
exports.deletePost = deletePost;
