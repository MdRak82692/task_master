"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENTS = exports.trackingEmitter = void 0;
const events_1 = require("events");
// Simple event emitter used as a pub/sub mechanism
// In a real distributed system, we would use Redis Pub/Sub or RabbitMQ
class TrackingEmitter extends events_1.EventEmitter {
}
exports.trackingEmitter = new TrackingEmitter();
exports.EVENTS = {
    TRACKING_UPDATED: 'TRACKING_UPDATED',
    TRACKING_CREATED: 'TRACKING_CREATED',
};
