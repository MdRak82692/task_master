"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamTracks = exports.updateTrack = exports.getTrack = exports.getMyTracks = exports.createTrack = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const response_1 = require("../../utils/response");
const plantTrackService = __importStar(require("./plantTrack.service"));
const pagination_1 = require("../../utils/pagination");
const plantTrack_events_1 = require("./plantTrack.events");
exports.createTrack = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const track = await plantTrackService.createTrack(req.user.id, req.body);
    (0, response_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Plant track created successfully',
        data: track,
    });
});
exports.getMyTracks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.extractPagination)(req);
    const { tracks, total } = await plantTrackService.getMyTracks(req.user.id, req.user.role, skip, limit);
    (0, response_1.sendResponse)(res, {
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
exports.getTrack = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const track = await plantTrackService.getTrackById(req.params.id);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Plant track retrieved successfully',
        data: track,
    });
});
exports.updateTrack = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const track = await plantTrackService.updateTrack(req.user.id, req.user.role, req.params.id, req.body);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Plant track updated successfully',
        data: track,
    });
});
const streamTracks = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.write(`data: ${JSON.stringify({ message: 'Connected to Plant Tracking Stream' })}\n\n`);
    const handleUpdate = (data) => {
        res.write(`data: ${JSON.stringify({ event: 'UPDATE', data })}\n\n`);
    };
    const handleCreate = (data) => {
        res.write(`data: ${JSON.stringify({ event: 'CREATE', data })}\n\n`);
    };
    plantTrack_events_1.trackingEmitter.on(plantTrack_events_1.EVENTS.TRACKING_UPDATED, handleUpdate);
    plantTrack_events_1.trackingEmitter.on(plantTrack_events_1.EVENTS.TRACKING_CREATED, handleCreate);
    req.on('close', () => {
        plantTrack_events_1.trackingEmitter.off(plantTrack_events_1.EVENTS.TRACKING_UPDATED, handleUpdate);
        plantTrack_events_1.trackingEmitter.off(plantTrack_events_1.EVENTS.TRACKING_CREATED, handleCreate);
    });
};
exports.streamTracks = streamTracks;
