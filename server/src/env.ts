import { z } from 'zod/v4';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['dev', 'test', 'prod']).default('prod'),
  DATABASE_URL: z.url().startsWith('postgresql://'),
});

export const env = envSchema.parse(process.env);
