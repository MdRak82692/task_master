import { EventEmitter } from 'events';

// Simple event emitter used as a pub/sub mechanism
// In a real distributed system, we would use Redis Pub/Sub or RabbitMQ
class TrackingEmitter extends EventEmitter {}

export const trackingEmitter = new TrackingEmitter();

export const EVENTS = {
  TRACKING_UPDATED: 'TRACKING_UPDATED',
  TRACKING_CREATED: 'TRACKING_CREATED',
};
