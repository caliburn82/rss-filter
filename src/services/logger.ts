import { TransformableInfo } from 'logform';
import { format } from 'util';
import winston, { LoggerOptions } from 'winston';
import { LOGGER } from '../config';

const {
  printf, combine, colorize, timestamp
} = winston.format;

// add PID to log messages as Correlation ID
let logFormat = printf(
  (info: TransformableInfo) => JSON.stringify({
    ...info,
    message: `PID ${process.pid}: ${info.message}`,
  }),
);

// used for local development
if (LOGGER.FORMAT === 'pretty') {
  logFormat = combine(
    colorize({ all: true }),
    timestamp({ format: 'HH:mm:ss.ms' }),
    printf(
      (info: TransformableInfo) => (`${info.timestamp} ${info.level}: ${info.message}`),
    ),
  );
}

const options: LoggerOptions = {
  level: LOGGER.LEVEL, format: logFormat,
  transports: [new winston.transports.Console()],
};

const logger = winston.createLogger(options);

export default {
  set silent(silent: boolean) {
    logger.silent = silent;
  },

  debug: (...args: any[]) => logger.debug(format(...args)),
  error: (...args: any[]) => logger.error(format(...args)),
  info: (...args: any[]) => logger.info(format(...args)),
  warn: (...args: any[]) => logger.warn(format(...args)),
  silly: (...args: any[]) => logger.silly(format(...args)),
};
