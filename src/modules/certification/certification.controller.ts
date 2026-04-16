import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as validationService from './certification.service';
import { extractPagination } from '../../utils/pagination';

export const submitCert = catchAsync(async (req: Request, res: Response) => {
  const cert = await validationService.submitCertification(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Certification submitted successfully',
    data: cert,
  });
});

export const getMyCerts = catchAsync(async (req: Request, res: Response) => {
  const certs = await validationService.getMyCertifications(req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Certifications retrieved successfully',
    data: certs,
  });
});

export const getCerts = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = extractPagination(req);
  const { certs, total } = await validationService.getAllCertifications(skip, limit);

  sendResponse(res, {
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

export const approveCert = catchAsync(async (req: Request, res: Response) => {
  const cert = await validationService.updateCertificationStatus(req.params.id, 'APPROVED');

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Certification approved',
    data: cert,
  });
});

export const rejectCert = catchAsync(async (req: Request, res: Response) => {
  const cert = await validationService.updateCertificationStatus(req.params.id, 'REJECTED');

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Certification rejected',
    data: cert,
  });
});
