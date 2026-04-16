"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = require("../config/env");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Interactive Urban Farming Platform API',
            version: '1.0.0',
            description: 'API documentation for the urban farming backend.',
        },
        servers: [
            {
                url: `http://localhost:${env_1.env.port}/api/v1`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // read routes for JSDoc
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
