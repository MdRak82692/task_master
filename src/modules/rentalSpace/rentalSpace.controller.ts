import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as rentalSpaceService from './rentalSpace.service';
import { extractPagination } from '../../utils/pagination';

export const createSpace = catchAsync(async (req: Request, res: Response) => {
  const space = await rentalSpaceService.createSpace(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Rental space created successfully',
    data: space,
  });
});

export const getSpaces = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = extractPagination(req);
  const filters = {
    location: req.query.location as string | undefined,
    startDate: req.query.startDate as string | undefined,
    endDate: req.query.endDate as string | undefined,
  };

  const { spaces, total } = await rentalSpaceService.getSpaces(filters, skip, limit);

  sendResponse(res, {
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

export const getSpace = catchAsync(async (req: Request, res: Response) => {
  const space = await rentalSpaceService.getSpaceById(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rental space retrieved successfully',
    data: space,
  });
});

export const updateSpace = catchAsync(async (req: Request, res: Response) => {
  const space = await rentalSpaceService.updateSpace(req.user.id, req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rental space updated successfully',
    data: space,
  });
});

export const deleteSpace = catchAsync(async (req: Request, res: Response) => {
  await rentalSpaceService.deleteSpace(req.user.id, req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rental space deleted successfully',
  });
});
