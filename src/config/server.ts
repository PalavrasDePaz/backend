export const DB_DATABASE = process.env.DB_DATABASE || 'palavrasdepaz';
export const DB_USER = process.env.DB_USER || 'insert_user';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'insert_password';
export const DB_HOST = process.env.DB_HOST || ' insert_host';
export const DB_PORT: number = process.env.DB_PORT
  ? parseInt(process.env.DB_PORT)
  : 3306;
export const PORT= process.env.PORT ? parseInt(process.env.PORT) : 3000;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'insert_jwt_key';
export const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || 'insert_encryption_key';

export const EMAIL_SENDER = process.env.EMAIL_SENDER || 'insert_email';
export const EMAIL_APP_PASSWORD =
  process.env.EMAIL_APP_PASSWORD || 'insert_email_app_password';
export const CREATE_PASSWORD_ROUTE =
  process.env.CREATE_PASSWORD_ROUTE || '/redefinir-senha';
export const CREATE_PASSWORD_HOST =
  process.env.CREATE_PASSWORD_HOST || 'insert_host';
