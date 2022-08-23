const winston = require("winston");
/**
 * @description my formate show log info
 * @param {level} level create the log description like error , info ,debug etc,
 * @param {message} message show the message like which type of message occurs
 * @param {timestamp} timestamp is basically show the logs time and data
 */
const myformate = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} | [  ${level}  ] | ${message}`;
});

/**
 * @description create a date
 * @param {date} 
 */
const date = new Date()
/**
 * @description create logger info
 * @param {level} level it option you can also put here or put with the transports
 * @param {format} format extract from the my formate
 * @param {transports} transports create the logs file and store the logs info 
 */
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    myformate
  ),
  transports: [
    // this is console the message in the console
    new winston.transports.Console(),
    new winston.transports.File({ filename: `logs_file/error_${date.getFullYear()+'-'+date.getDate()+'-'+date.getDay()}.log`, level: "error" }),
    new winston.transports.File({ filename: `logs_file/info_${date.getFullYear()+'-'+date.getDate()+'-'+date.getDay()}.log` }),
  ],
});

module.exports = logger;
