import morgan from 'morgan';
import logger from '../utils/logger.js';

const stream = {
    write: (message) => logger.http(message.trim())
};

const skip = () => {
    const env = process.env.NODE_ENV || 'development';
    return env !== 'development';
};

const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream, skip }
);

export const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            userId: req.user?._id
        };

        if (res.statusCode >= 400) {
            logger.error('Request failed', logData);
        } else if (process.env.LOG_LEVEL === 'debug') {
            logger.debug('Request completed', logData);
        }
    });

    next();
};

export default morganMiddleware;