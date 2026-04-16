"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const prisma_1 = __importDefault(require("./config/prisma"));
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
let server;
prisma_1.default
    .$connect()
    .then(() => {
    console.log('DB Connection successful!');
    server = app_1.default.listen(env_1.env.port, () => {
        console.log(`App running on port ${env_1.env.port}...`);
    });
})
    .catch((err) => {
    console.error('FAILED TO CONNECT TO DATABASE!');
    console.error('Please ensure your PostgreSQL server is running and accessible.');
    console.error('If using Docker, run: docker-compose up -d');
    console.error('Error Details:', err.message);
    process.exit(1);
});
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
