import { env } from '@/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schema } from './schemas';

export const pgInstance = postgres(env.DATABASE_URL);
export const dbClient = drizzle(pgInstance, { schema });
