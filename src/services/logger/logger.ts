import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'debug.log', level: 'debug' }),
    new transports.File({ filename: 'combined.log' }),
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  ],
  exceptionHandlers: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    }),
    new transports.File({ filename: 'error.log', level: 'error' })
  ]
});
