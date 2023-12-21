import { format, createLogger, transports } from "winston";
import { fileNameNowPrefix } from "./helpers.js";

const LOGGER_LEVEL = "info";

const customFormat = format.printf(
  ({ level, message, timestamp }) => `${timestamp} | ${level} | ${message}`
);

const initLogger = () => {
  const time = fileNameNowPrefix();

  const formatTimestamp = format.timestamp({ format: "HH:mm:ss" });

  const level = ["info", "error", "debug".includes(LOGGER_LEVEL)]
    ? LOGGER_LEVEL
    : "info";

  const logger = createLogger({
    transports: [
      new transports.Console({
        level,
        format: format.combine(
          format.colorize(),
          format.splat(),
          formatTimestamp,
          customFormat
        ),
      }),
      new transports.File({
        level: "debug",
        filename: `./logs/${time}_debug.log`,
        format: format.combine(format.splat(), formatTimestamp, customFormat),
      }),
      new transports.File({
        level: "info",
        filename: `./logs/${time}_info.log`,
        format: format.combine(format.splat(), formatTimestamp, customFormat),
      }),
      new transports.File({
        level: "error",
        filename: `./logs/${time}_error.log`,
        format: format.combine(format.splat(), formatTimestamp, customFormat),
      }),
    ],
  });

  return logger;
};

export const logger = initLogger();
