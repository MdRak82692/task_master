import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as vendorService from './vendor.service';
import { extractPagination } from '../../utils/pagination';

export const createProfile = catchAsync(async (req: Request, res: Response) => {
  const profile = await vendorService.createProfile(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Vendor profile created successfully',
    data: profile,
  });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const profile = await vendorService.getProfile(req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendor profile retrieved successfully',
    data: profile,
  });
});

export const updateMe = catchAsync(async (req: Request, res: Response) => {
  const profile = await vendorService.updateProfile(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendor profile updated successfully',
    data: profile,
  });
});

export const getVendors = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = extractPagination(req);
  const { vendors, total } = await vendorService.getAllVendors(skip, limit);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendors retrieved successfully',
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: vendors,
  });
});
