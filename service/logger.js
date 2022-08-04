const winston = require("winston");

const myformate = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} | [  ${level}  ] | ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    myformate
  ),
  transports: [
    // this is console the message in the console
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "info.log" }),
  ],
});

module.exports = logger;
