import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export function createWinstonLogger() {
  const isProd = process.env.NODE_ENV === 'production';

  return WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        level: isProd ? 'info' : 'debug',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(({ level, message, timestamp, context }) => {
            const ctx = context ? `[${context}] ` : '';
            return `${timestamp} ${level.toUpperCase()} ${ctx}${message}`;
          }),
        ),
      }),
      new winston.transports.File({
        filename: 'logs/app.log',
        level: isProd ? 'info' : 'debug',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  });
}