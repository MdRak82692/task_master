import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as orderService from './order.service';
import { extractPagination } from '../../utils/pagination';

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.createOrder(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order created successfully',
    data: order,
  });
});

export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = extractPagination(req);
  const { orders, total } = await orderService.getMyOrders(req.user.id, req.user.role, skip, limit);

  sendResponse(res, {
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

export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = extractPagination(req);
  const { orders, total } = await orderService.getAllOrders(skip, limit);

  sendResponse(res, {
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

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.updateOrderStatus(req.user.id, req.user.role, req.params.id, req.body.status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order status updated successfully',
    data: order,
  });
});
