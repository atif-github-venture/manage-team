import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Email Configuration (SMTP)
 * Creates and configures Nodemailer transporter
 */

class EmailConfig {
    constructor() {
        this.config = {
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        };

        this.emailFrom = process.env.EMAIL_FROM || process.env.SMTP_USER;
        this.adminEmail = process.env.ADMIN_EMAIL;
        this.enabled = process.env.EMAIL_ENABLED !== 'false';

        // Validate configuration
        this.validateConfig();

        // Create transporter
        if (this.enabled) {
            this.transporter = this.createTransporter();
        }
    }

    validateConfig() {
        if (!this.enabled) {
            console.log('⚠️  Email notifications are disabled');
            return;
        }

        if (!this.config.host) {
            throw new Error('SMTP_HOST is not defined in environment variables');
        }
        if (!this.config.auth.user) {
            throw new Error('SMTP_USER is not defined in environment variables');
        }
        if (!this.config.auth.pass) {
            throw new Error('SMTP_PASS is not defined in environment variables');
        }
    }

    createTransporter() {
        try {
            const transporter = nodemailer.createTransport(this.config);

            // Log configuration (without sensitive data)
            console.log('📧 Email configuration loaded');
            console.log(`   Host: ${this.config.host}`);
            console.log(`   Port: ${this.config.port}`);
            console.log(`   Secure: ${this.config.secure}`);
            console.log(`   From: ${this.emailFrom}`);

            return transporter;
        } catch (error) {
            console.error('❌ Failed to create email transporter:', error.message);
            throw error;
        }
    }

    getTransporter() {
        if (!this.enabled) {
            throw new Error('Email is disabled. Set EMAIL_ENABLED=true in .env');
        }
        return this.transporter;
    }

    getConfig() {
        return {
            enabled: this.enabled,
            from: this.emailFrom,
            adminEmail: this.adminEmail,
            host: this.config.host,
            port: this.config.port,
        };
    }

    // Test connection
    async testConnection() {
        if (!this.enabled) {
            console.log('⚠️  Email is disabled, skipping connection test');
            return false;
        }

        try {
            await this.transporter.verify();
            console.log('✅ Email server connection successful');
            console.log(`   Ready to send emails from: ${this.emailFrom}`);
            return true;
        } catch (error) {
            console.error('❌ Email connection test failed:', error.message);

            // Provide helpful error messages
            if (error.code === 'EAUTH') {
                console.error('   Authentication failed. Check SMTP_USER and SMTP_PASS');
                console.error('   For Gmail, use an App Password: https://myaccount.google.com/apppasswords');
            } else if (error.code === 'ECONNECTION') {
                console.error('   Cannot connect to SMTP server. Check SMTP_HOST and SMTP_PORT');
            }

            return false;
        }
    }

    // Send test email
    async sendTestEmail(to = null) {
        if (!this.enabled) {
            throw new Error('Email is disabled');
        }

        const recipient = to || this.adminEmail;

        if (!recipient) {
            throw new Error('No recipient email specified');
        }

        try {
            const info = await this.transporter.sendMail({
                from: this.emailFrom,
                to: recipient,
                subject: 'Test Email - Team Management App',
                text: 'This is a test email from Team Management Application. If you receive this, email configuration is working correctly!',
                html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #1976d2;">✅ Email Configuration Test</h2>
            <p>This is a test email from <strong>Team Management Application</strong>.</p>
            <p>If you receive this, your email configuration is working correctly!</p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Sent from: ${this.emailFrom}<br>
              Timestamp: ${new Date().toISOString()}
            </p>
          </div>
        `,
            });

            console.log('✅ Test email sent successfully');
            console.log(`   Message ID: ${info.messageId}`);
            console.log(`   To: ${recipient}`);

            return info;
        } catch (error) {
            console.error('❌ Failed to send test email:', error.message);
            throw error;
        }
    }
}

// Create and export singleton instance
const emailConfig = new EmailConfig();

export default emailConfig;
export const emailTransporter = emailConfig.enabled ? emailConfig.getTransporter() : null;