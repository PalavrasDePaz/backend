import z from 'zod';

const envSchema = z.object({
  DB_DATABASE: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string().optional(),
  PORT: z.string().optional(),
  JWT_SECRET_KEY: z.string(),
  ENCRYPTION_KEY: z.string(),
  EMAIL_SENDER: z.string(),
  EMAIL_APP_PASSWORD: z.string(),
  CREATE_PASSWORD_ROUTE: z.string(),
  CREATE_PASSWORD_HOST: z.string()
});

export const ENV = envSchema.parse(process.env);
