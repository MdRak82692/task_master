import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as plantTrackService from './plantTrack.service';
import { extractPagination } from '../../utils/pagination';
import { trackingEmitter, EVENTS } from './plantTrack.events';

export const createTrack = catchAsync(async (req: Request, res: Response) => {
  const track = await plantTrackService.createTrack(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Plant track created successfully',
    data: track,
  });
});

export const getMyTracks = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = extractPagination(req);
  const { tracks, total } = await plantTrackService.getMyTracks(req.user.id, req.user.role, skip, limit);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My plant tracks retrieved successfully',
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: tracks,
  });
});

export const getTrack = catchAsync(async (req: Request, res: Response) => {
  const track = await plantTrackService.getTrackById(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Plant track retrieved successfully',
    data: track,
  });
});

export const updateTrack = catchAsync(async (req: Request, res: Response) => {
  const track = await plantTrackService.updateTrack(req.user.id, req.user.role, req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Plant track updated successfully',
    data: track,
  });
});

export const streamTracks = (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(`data: ${JSON.stringify({ message: 'Connected to Plant Tracking Stream' })}\n\n`);

  const handleUpdate = (data: any) => {
    res.write(`data: ${JSON.stringify({ event: 'UPDATE', data })}\n\n`);
  };

  const handleCreate = (data: any) => {
    res.write(`data: ${JSON.stringify({ event: 'CREATE', data })}\n\n`);
  };

  trackingEmitter.on(EVENTS.TRACKING_UPDATED, handleUpdate);
  trackingEmitter.on(EVENTS.TRACKING_CREATED, handleCreate);

  req.on('close', () => {
    trackingEmitter.off(EVENTS.TRACKING_UPDATED, handleUpdate);
    trackingEmitter.off(EVENTS.TRACKING_CREATED, handleCreate);
  });
};
