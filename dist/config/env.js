"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const envVarsSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('3000'),
    DATABASE_URL: zod_1.z.string().min(1),
    JWT_SECRET: zod_1.z.string().min(1),
    JWT_EXPIRES_IN: zod_1.z.string().default('1d'),
});
const envVars = envVarsSchema.safeParse(process.env);
if (!envVars.success) {
    console.error('Environment variables validation error:', envVars.error.format());
    process.exit(1);
}
exports.env = {
    env: envVars.data.NODE_ENV,
    port: parseInt(envVars.data.PORT, 10),
    db: {
        url: envVars.data.DATABASE_URL,
    },
    jwt: {
        secret: envVars.data.JWT_SECRET,
        expiresIn: envVars.data.JWT_EXPIRES_IN,
    },
};
