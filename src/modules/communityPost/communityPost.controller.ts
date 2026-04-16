import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as postService from './communityPost.service';
import { extractPagination } from '../../utils/pagination';

export const createPost = catchAsync(async (req: Request, res: Response) => {
  const post = await postService.createPost(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Post created successfully',
    data: post,
  });
});

export const getPosts = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = extractPagination(req);
  const { posts, total } = await postService.getPosts(skip, limit);

  sendResponse(res, {
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

export const getPost = catchAsync(async (req: Request, res: Response) => {
  const post = await postService.getPostById(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post retrieved successfully',
    data: post,
  });
});

export const updatePost = catchAsync(async (req: Request, res: Response) => {
  const post = await postService.updatePost(req.user.id, req.user.role, req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post updated successfully',
    data: post,
  });
});

export const deletePost = catchAsync(async (req: Request, res: Response) => {
  await postService.deletePost(req.user.id, req.user.role, req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post deleted successfully',
  });
});
