const winston = require('winston');
const path = require('path');

// Function to generate a filename based on the current timestamp
const generateFilename = () => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `log-${timestamp}.log`;
};

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

// Custom format to include filename and function name
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create a directory for logs if it doesn't exist
const logDir = path.resolve(__dirname, '../logs');
require('fs').mkdirSync(logDir, { recursive: true });

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDir, generateFilename()),
      level: 'info', // Default to 'info' if logLevel is not defined
      format: winston.format.combine(
        winston.format.uncolorize(), // Remove color codes for file logging
        logFormat
      )
    })
  ]
});

module.exports = logger;
