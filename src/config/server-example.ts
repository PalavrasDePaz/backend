export const DB_DATABASE = process.env.DB_DATABASE || 'palavrasdepaz';
export const DB_USER = process.env.DB_USER || 'insert_user';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'insert_password';
export const DB_HOST = process.env.DB_HOST || 'insert_host';
export const DB_PORT: number = process.env.DB_PORT
  ? parseInt(process.env.DB_PORT)
  : 3306;
