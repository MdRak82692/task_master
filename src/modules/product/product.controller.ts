import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as productService from './product.service';
import { extractPagination } from '../../utils/pagination';

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip, sortBy, sortOrder } = extractPagination(req);
  
  const filters = {
    search: req.query.search as string,
    category: req.query.category as string,
    vendorId: req.query.vendorId as string,
    sortBy,
    sortOrder,
  };

  const { products, total } = await productService.getProducts(filters, skip, limit);

  sendResponse(res, {
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

export const getProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product retrieved successfully',
    data: product,
  });
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(req.user.id, req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await productService.deleteProduct(req.user.id, req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product deleted successfully',
  });
});
