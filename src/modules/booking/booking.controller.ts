import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as bookingService from './booking.service';
import { extractPagination } from '../../utils/pagination';

export const createBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.createBooking(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Booking created successfully',
    data: booking,
  });
});

export const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = extractPagination(req);
  const { bookings, total } = await bookingService.getMyBookings(req.user.id, req.user.role, skip, limit);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My bookings retrieved successfully',
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: bookings,
  });
});

export const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = extractPagination(req);
  const { bookings, total } = await bookingService.getAllBookings(skip, limit);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All bookings retrieved successfully',
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: bookings,
  });
});

export const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.cancelBooking(req.user.id, req.user.role, req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking cancelled successfully',
    data: booking,
  });
});
