import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default('1d'),
});

const envVars = envVarsSchema.safeParse(process.env);

if (!envVars.success) {
  console.error('Environment variables validation error:', envVars.error.format());
  process.exit(1);
}

export const env = {
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
