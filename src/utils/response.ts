import { Response } from 'express';

type MetaData = {
  page?: number;
  limit?: number;
  total?: number;
  totalPage?: number;
};

export const sendResponse = <T>(
  res: Response,
  data: {
    statusCode: number;
    success: boolean;
    message?: string;
    meta?: MetaData;
    data?: T;
  }
) => {
  const responseData = {
    success: data.success,
    message: data.message || (data.success ? 'Success' : 'Error'),
    meta: data.meta || undefined,
    data: data.data || undefined,
  };

  res.status(data.statusCode).json(responseData);
};
