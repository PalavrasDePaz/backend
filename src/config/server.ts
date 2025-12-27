import { ENV } from './env';

export const DB_DATABASE = ENV.DB_DATABASE;
export const DB_USER = ENV.DB_USER;
export const DB_PASSWORD = ENV.DB_PASSWORD;
export const DB_HOST = ENV.DB_HOST;
export const DB_PORT: number = ENV.DB_PORT ? parseInt(ENV.DB_PORT) : 3306;
export const PORT = ENV.PORT ? parseInt(ENV.PORT) : 3000;
export const JWT_SECRET_KEY = ENV.JWT_SECRET_KEY;
export const ENCRYPTION_KEY = ENV.ENCRYPTION_KEY;

/**
 * Email Related Variables
 */

// SMTP variables
export const SMTP_USER = ENV.SMTP_USER || ENV.INFO_EMAIL;
export const SMTP_PASS = ENV.SMTP_PASS || ENV.INFO_EMAIL;
export const SMTP_SERVER = ENV.SMTP_SERVER || 'smtpi.kinghost.net';
export const SMTP_PORT = ENV.SMTP_PORT ? parseInt(ENV.SMTP_PORT) : 587;
export const SMTP_SECURE = ENV.SMTP_SECURE
  ? ENV.SMTP_SECURE.toLowerCase() === 'true'
  : false;

// Specific email settings
export const INFO_EMAIL = ENV.INFO_EMAIL;
export const INFO_EMAIL_USER = ENV.SMTP_USER || ENV.INFO_EMAIL;
export const INFO_EMAIL_PASSWORD =
  ENV.INFO_EMAIL_PASSWORD || ENV.SMTP_PASS || 'password';
export const HELPDESK_EMAIL = ENV.HELPDESK_EMAIL;
export const HELPDESK_EMAIL_USER = ENV.SMTP_USER || ENV.HELPDESK_EMAIL;
export const HELPDESK_EMAIL_PASSWORD =
  ENV.HELPDESK_EMAIL_PASSWORD || ENV.SMTP_PASS || 'password';

// IMAP Configuration
export const IMAP_SERVER = ENV.IMAP_SERVER;
export const IMAP_PORT = ENV.IMAP_PORT ? parseInt(ENV.IMAP_PORT) : 587;
export const IMAP_SECURE = ENV.IMAP_SECURE
  ? ENV.IMAP_SECURE.toLowerCase() === 'true'
  : false;
export const IMAP_SENT_MAILBOX_NAME = ENV.IMAP_SENT_MAILBOX_NAME || 'Sent';

export const RESET_PASSWORD_FRONTED_ROUTE = ENV.RESET_PASSWORD_FRONTED_ROUTE;
export const RESET_PASSWORD_FRONTEND_HOST = ENV.RESET_PASSWORD_FRONTEND_HOST;
export const GOOGLE_CLOUD_KEY = ENV.GOOGLE_CLOUD_KEY;
export const STORAGE_DOWNLOAD_FOLDER = ENV.STORAGE_DOWNLOAD_FOLDER;
export const NODE_ENV = ENV.NODE_ENV;
