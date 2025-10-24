import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import 'express-async-errors';

import morganMiddleware, { requestLogger } from './middleware/logger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import teamsRoutes from './routes/teams.js';
import usersRoutes from './routes/users.js';
import holidaysRoutes from './routes/holidays.js';
import ptoRoutes from './routes/pto.js';
import timeTrendRoutes from './routes/timeTrend.js';
import teamworkInsightsRoutes from './routes/teamworkInsights.js';
import futureCapacityRoutes from './routes/futureCapacity.js';
import auditLogsRoutes from './routes/auditLogs.js';
import teamJqlsRoutes from './routes/teamJqls.js';
import constantsRoutes from './routes/constants.js';

const app = express();
import distributionListRoutes from './routes/distributionLists.js';

app.use(helmet());
app.use(compression());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morganMiddleware);
}
app.use(requestLogger);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/holidays', holidaysRoutes);
app.use('/api/pto', ptoRoutes);
app.use('/api/time-trend', timeTrendRoutes);
app.use('/api/teamwork-insights', teamworkInsightsRoutes);
app.use('/api/future-capacity', futureCapacityRoutes);
app.use('/api/audit-logs', auditLogsRoutes);
app.use('/api/distribution-lists', distributionListRoutes);
app.use('/api/team-jqls', teamJqlsRoutes);
app.use('/api/constants', constantsRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;