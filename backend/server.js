import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/database.js';
import logger from './utils/logger.js';
import jiraConfig from './config/jira.js';
import ollamaConfig from './config/ollama.js';
import emailConfig from './config/email.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        console.log('🚀 Starting Team Management Application...\n');

        await connectDB();

        console.log('🔍 Testing external services...');

        const jiraTest = await jiraConfig.testConnection();
        if (jiraTest) {
            console.log('✅ Jira connection successful');
        } else {
            console.warn('⚠️  Jira connection failed - check configuration');
        }

        const ollamaTest = await ollamaConfig.testConnection();
        if (ollamaTest) {
            console.log('✅ Ollama connection successful');
        } else {
            console.warn('⚠️  Ollama connection failed - check if ollama serve is running');
        }

        const emailTest = await emailConfig.testConnection();
        if (emailTest) {
            console.log('✅ Email server connection successful');
        } else {
            console.warn('⚠️  Email server connection failed - check SMTP configuration');
        }

        console.log('');

        const server = app.listen(PORT, () => {
            logger.info(`Server started on port ${PORT}`);
            console.log('✅ Server is running');
            console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`   Port: ${PORT}`);
            console.log(`   API: http://localhost:${PORT}/api`);
            console.log(`   Health: http://localhost:${PORT}/api/health`);
            console.log('\n🎉 Application ready to accept requests!\n');
        });

        process.on('unhandledRejection', (err) => {
            logger.error('Unhandled Rejection:', err);
            console.error('❌ Unhandled Rejection:', err);
            server.close(() => process.exit(1));
        });

        process.on('uncaughtException', (err) => {
            logger.error('Uncaught Exception:', err);
            console.error('❌ Uncaught Exception:', err);
            process.exit(1);
        });

        process.on('SIGTERM', () => {
            logger.info('SIGTERM received, shutting down gracefully');
            console.log('\n🛑 SIGTERM received, shutting down gracefully...');
            server.close(() => {
                logger.info('Process terminated');
                console.log('✅ Process terminated');
                process.exit(0);
            });
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();