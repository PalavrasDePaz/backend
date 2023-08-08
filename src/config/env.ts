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
  INFO_EMAIL: z.string(),
  HELPDESK_EMAIL: z.string(),
  INFO_EMAIL_PASSWORD: z.string(),
  RESET_PASSWORD_FRONTED_ROUTE: z.string(),
  RESET_PASSWORD_FRONTEND_HOST: z.string(),
  GOOGLE_CLOUD_KEY: z.string(),
  STORAGE_DOWNLOAD_FOLDER: z.string()
});

export const ENV = envSchema.parse(process.env);
