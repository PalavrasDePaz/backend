import { ENV } from './env';

export const DB_DATABASE = ENV.DB_DATABASE;
export const DB_USER = ENV.DB_USER;
export const DB_PASSWORD = ENV.DB_PASSWORD;
export const DB_HOST = ENV.DB_HOST;
export const DB_PORT: number = ENV.DB_PORT ? parseInt(ENV.DB_PORT) : 3306;
export const PORT = ENV.PORT ? parseInt(ENV.PORT) : 3000;
export const JWT_SECRET_KEY = ENV.JWT_SECRET_KEY;
export const ENCRYPTION_KEY = ENV.ENCRYPTION_KEY;

export const EMAIL_SENDER = ENV.EMAIL_SENDER;
export const EMAIL_APP_PASSWORD = ENV.EMAIL_APP_PASSWORD;
export const CREATE_PASSWORD_ROUTE = ENV.CREATE_PASSWORD_ROUTE;
export const CREATE_PASSWORD_HOST = ENV.CREATE_PASSWORD_HOST;
