import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as userService from './user.service';
import { extractPagination } from '../../utils/pagination';

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = extractPagination(req);
  const { users, total } = await userService.getAllUsers(skip, limit);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully',
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: users,
  });
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    data: user,
  });
});

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const user = await userService.updateUserStatus(req.params.id, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User status updated successfully',
    data: user,
  });
});
