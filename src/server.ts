import app from './app';
import { env } from './config/env';
import prisma from './config/prisma';

process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

let server: any;

prisma
  .$connect()
  .then(() => {
    console.log('DB Connection successful!');
    server = app.listen(env.port, () => {
      console.log(`App running on port ${env.port}...`);
    });
  })
  .catch((err) => {
    console.error('FAILED TO CONNECT TO DATABASE!');
    console.error('Please ensure your PostgreSQL server is running and accessible.');
    console.error('If using Docker, run: docker-compose up -d');
    console.error('Error Details:', err.message);
    process.exit(1);
  });

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
