const winston = require("winston");

const myformate = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} | [  ${level}  ] | ${message}`;
});
// new Date
const date = new Date()

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    myformate
  ),
  transports: [
    // this is console the message in the console
    new winston.transports.Console(),
    new winston.transports.File({ filename: `log/error_${date.getFullYear()+'-'+date.getDate()+'-'+date.getDay()}.log`, level: "error" }),
    new winston.transports.File({ filename: `log/info_${date.getFullYear()+'-'+date.getDate()+'-'+date.getDay()}.log` }),
  ],
});

module.exports = logger;
