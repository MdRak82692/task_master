import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from './env';

const pool = new Pool({
  connectionString: env.db.url,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: env.env === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
