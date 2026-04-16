import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { globalErrorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/AppError';
import { authLimiter, apiLimiter } from './middlewares/rateLimiter';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import routes from './routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Apply Rate limiting to auth routes
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1', apiLimiter);

// Routes
app.use('/api/v1', routes);

// Base route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Interactive Urban Farming API running.' });
});

// 404 Route
app.all('*', (req: Request, res: Response, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
