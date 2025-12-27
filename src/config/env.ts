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
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_SERVER: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  INFO_EMAIL: z.string(),
  INFO_EMAIL_PASSWORD: z.string().optional(),
  HELPDESK_EMAIL: z.string(),
  HELPDESK_EMAIL_PASSWORD: z.string().optional(),
  RESET_PASSWORD_FRONTED_ROUTE: z.string(),
  RESET_PASSWORD_FRONTEND_HOST: z.string(),
  GOOGLE_CLOUD_KEY: z.string(),
  STORAGE_DOWNLOAD_FOLDER: z.string(),
  NODE_ENV: z.string().default('development')
});

export const ENV = envSchema.parse(process.env);
