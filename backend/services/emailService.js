import emailConfig from '../config/email.js';

class EmailService {
    async send(options) {
        try {
            const config = emailConfig.getConfig();

            if (!config.enabled) {
                console.log('Email is disabled, skipping send');
                return null;
            }

            // Create transporter with fresh credentials
            const transporter = await emailConfig.createTransporter();

            const mailOptions = {
                from: options.from || config.from,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
                attachments: options.attachments
            };

            const info = await transporter.sendMail(mailOptions);

            console.log('Email sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Email send error:', error.message);

            // Provide specific error messages
            if (error.message.includes('Error')) {
                throw error; // Re-throw Error errors as-is
            }

            if (error.code === 'EAUTH') {
                throw new Error('Email authentication failed - SMTP credentials invalid');
            }

            if (error.code === 'ECONNREFUSED') {
                throw new Error('Email server connection refused - check SMTP host and port');
            }

            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    async sendWeeklyInsights(data) {
        try {
            const { teamName, recipients, insights } = data;
            const { period, teamMetrics, members } = insights;

            const subject = `Weekly Team Insights - ${teamName} (${period.startDate} to ${period.endDate})`;

            const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: #1976d2; color: white; padding: 20px; border-radius: 5px; }
            .metrics { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .metric-item { display: inline-block; margin: 10px 20px 10px 0; }
            .metric-value { font-size: 24px; font-weight: bold; color: #1976d2; }
            .metric-label { font-size: 14px; color: #666; }
            .member { background: white; border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .member-name { font-weight: bold; color: #1976d2; margin-bottom: 5px; }
            .member-metrics { font-size: 14px; color: #666; margin: 5px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Weekly Team Insights</h1>
              <p>${teamName}</p>
              <p>${period.startDate} to ${period.endDate}</p>
            </div>

            <div class="metrics">
              <h2>Team Summary</h2>
              <div class="metric-item">
                <div class="metric-value">${teamMetrics.totalIssuesCompleted}</div>
                <div class="metric-label">Issues Completed</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">${teamMetrics.totalStoryPoints}</div>
                <div class="metric-label">Story Points</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">${Math.round(teamMetrics.teamUtilization)}%</div>
                <div class="metric-label">Team Utilization</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">${teamMetrics.teamBurnRate.toFixed(2)}</div>
                <div class="metric-label">Avg Burn Rate</div>
              </div>
            </div>

            <h2>Individual Contributions</h2>
            ${members.map(member => `
              <div class="member">
                <div class="member-name">${member.name}</div>
                <div class="member-metrics">
                  📊 ${member.metrics.issuesCompleted} issues | 
                  ⭐ ${member.metrics.storyPoints} points | 
                  📈 ${member.metrics.utilization}% utilization
                </div>
                <p>${member.aiSummary}</p>
              </div>
            `).join('')}

            <div class="footer">
              <p>This is an automated weekly insights email from Team Management Application.</p>
              <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `;

            const text = `
Weekly Team Insights - ${teamName}
${period.startDate} to ${period.endDate}

Team Summary:
- Issues Completed: ${teamMetrics.totalIssuesCompleted}
- Story Points: ${teamMetrics.totalStoryPoints}
- Team Utilization: ${Math.round(teamMetrics.teamUtilization)}%
- Avg Burn Rate: ${teamMetrics.teamBurnRate.toFixed(2)}

Individual Contributions:
${members.map(m => `
${m.name}
  - ${m.metrics.issuesCompleted} issues, ${m.metrics.storyPoints} points, ${m.metrics.utilization}% utilization
  - ${m.aiSummary}
`).join('\n')}
      `;

            return await this.send({
                to: recipients.join(', '),
                subject,
                text,
                html
            });
        } catch (error) {
            console.error('Send weekly insights error:', error.message);
            throw error;
        }
    }

    async sendPTONotification(data) {
        try {
            const { user, pto, action } = data;

            const subject = `PTO ${action === 'approved' ? 'Approved' : action === 'rejected' ? 'Rejected' : 'Requested'} - ${user.name}`;

            const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .status { padding: 10px; border-radius: 5px; margin: 20px 0; }
            .approved { background: #4caf50; color: white; }
            .rejected { background: #f44336; color: white; }
            .pending { background: #ff9800; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>PTO ${action}</h2>
            <div class="status ${action.toLowerCase()}">
              Status: ${action.toUpperCase()}
            </div>
            <p><strong>Employee:</strong> ${user.name}</p>
            <p><strong>Start Date:</strong> ${new Date(pto.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> ${new Date(pto.endDate).toLocaleDateString()}</p>
            <p><strong>Type:</strong> ${pto.type}</p>
            ${pto.reason ? `<p><strong>Reason:</strong> ${pto.reason}</p>` : ''}
          </div>
        </body>
        </html>
      `;

            return await this.send({
                to: user.email,
                subject,
                html
            });
        } catch (error) {
            console.error('Send PTO notification error:', error.message);
            throw error;
        }
    }

    async sendPasswordResetEmail(data) {
        try {
            const { email, resetToken } = data;

            const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

            const subject = 'Password Reset Request';

            const html = `
        <!DOCTYPE html>
        <html>
        <body>
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </body>
        </html>
      `;

            return await this.send({
                to: email,
                subject,
                html
            });
        } catch (error) {
            console.error('Send password reset email error:', error.message);
            throw error;
        }
    }

    async sendWelcomeEmail(data) {
        try {
            const { user, tempPassword } = data;

            const subject = 'Welcome to Team Management Application';

            const html = `
        <!DOCTYPE html>
        <html>
        <body>
          <h2>Welcome ${user.firstName}!</h2>
          <p>Your account has been created for Team Management Application.</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          <p><strong>Login URL:</strong> <a href="${process.env.FRONTEND_URL}">${process.env.FRONTEND_URL}</a></p>
          <p>Please change your password after logging in.</p>
        </body>
        </html>
      `;

            return await this.send({
                to: user.email,
                subject,
                html
            });
        } catch (error) {
            console.error('Send welcome email error:', error.message);
            throw error;
        }
    }
}

const emailService = new EmailService();

export default emailService;
