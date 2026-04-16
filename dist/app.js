"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = require("./middlewares/errorHandler");
const AppError_1 = require("./utils/AppError");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./docs/swagger");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
// Swagger Docs
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Apply Rate limiting to auth routes
app.use('/api/v1/auth', rateLimiter_1.authLimiter);
app.use('/api/v1', rateLimiter_1.apiLimiter);
// Routes
app.use('/api/v1', routes_1.default);
// Base route
app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Interactive Urban Farming API running.' });
});
// 404 Route
app.all('*', (req, res, next) => {
    next(new AppError_1.AppError(404, `Can't find ${req.originalUrl} on this server!`));
});
// Global Error Handler
app.use(errorHandler_1.globalErrorHandler);
exports.default = app;
