import dateService from './dateService.js';
import jiraService from './jiraService.js';
import ollamaService from './ollamaService.js';
import Team from '../models/Team.js';

class ReportGenerator {
    async generateWeeklyReport(teamId, startDate, endDate) {
        try {
            const team = await Team.findById(teamId);
            if (!team) {
                throw new Error('Team not found');
            }

            const report = {
                teamName: team.teamName,
                period: {
                    startDate: dateService.formatDate(startDate),
                    endDate: dateService.formatDate(endDate)
                },
                summary: {},
                members: [],
                highlights: [],
                concerns: []
            };

            return report;
        } catch (error) {
            console.error('Generate weekly report error:', error.message);
            throw new Error(`Failed to generate weekly report: ${error.message}`);
        }
    }

    async generateMonthlyReport(teamId, year, month) {
        try {
            const team = await Team.findById(teamId);
            if (!team) {
                throw new Error('Team not found');
            }

            const { startDate, endDate } = dateService.getMonthRange(year, month);

            const report = {
                teamName: team.teamName,
                period: {
                    month,
                    year,
                    startDate: dateService.formatDate(startDate),
                    endDate: dateService.formatDate(endDate)
                },
                summary: {},
                trends: {},
                members: []
            };

            return report;
        } catch (error) {
            console.error('Generate monthly report error:', error.message);
            throw new Error(`Failed to generate monthly report: ${error.message}`);
        }
    }

    async generateQuarterlyReport(teamId, year, quarter) {
        try {
            const team = await Team.findById(teamId);
            if (!team) {
                throw new Error('Team not found');
            }

            const { startDate, endDate } = dateService.getQuarterRange(year, quarter);

            const report = {
                teamName: team.teamName,
                period: {
                    quarter,
                    year,
                    startDate: dateService.formatDate(startDate),
                    endDate: dateService.formatDate(endDate)
                },
                summary: {},
                quarterlyTrends: {},
                achievements: [],
                challenges: []
            };

            return report;
        } catch (error) {
            console.error('Generate quarterly report error:', error.message);
            throw new Error(`Failed to generate quarterly report: ${error.message}`);
        }
    }

    async generateIndividualReport(userId, teamId, startDate, endDate) {
        try {
            const report = {
                userId,
                teamId,
                period: {
                    startDate: dateService.formatDate(startDate),
                    endDate: dateService.formatDate(endDate)
                },
                metrics: {},
                accomplishments: [],
                summary: ''
            };

            return report;
        } catch (error) {
            console.error('Generate individual report error:', error.message);
            throw new Error(`Failed to generate individual report: ${error.message}`);
        }
    }

    async generateCapacityReport(teamId, startDate, endDate) {
        try {
            const team = await Team.findById(teamId);
            if (!team) {
                throw new Error('Team not found');
            }

            const report = {
                teamName: team.teamName,
                period: {
                    startDate: dateService.formatDate(startDate),
                    endDate: dateService.formatDate(endDate)
                },
                totalCapacity: 0,
                usedCapacity: 0,
                remainingCapacity: 0,
                members: [],
                recommendations: []
            };

            return report;
        } catch (error) {
            console.error('Generate capacity report error:', error.message);
            throw new Error(`Failed to generate capacity report: ${error.message}`);
        }
    }

    generateExecutiveSummary(data) {
        const summary = {
            keyMetrics: {
                totalIssues: data.totalIssues || 0,
                totalStoryPoints: data.totalStoryPoints || 0,
                averageUtilization: data.averageUtilization || 0,
                teamVelocity: data.teamVelocity || 0
            },
            highlights: data.highlights || [],
            concerns: data.concerns || [],
            recommendations: data.recommendations || []
        };

        return summary;
    }

    formatReportAsHTML(report) {
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #1976d2; }
          h2 { color: #424242; border-bottom: 2px solid #1976d2; padding-bottom: 5px; }
          .metric { display: inline-block; margin: 10px 20px; }
          .metric-value { font-size: 32px; font-weight: bold; color: #1976d2; }
          .metric-label { font-size: 14px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f5f5f5; }
        </style>
      </head>
      <body>
        <h1>${report.teamName} - Report</h1>
        <p><strong>Period:</strong> ${report.period.startDate} to ${report.period.endDate}</p>
        <h2>Summary</h2>
        <div>
          ${Object.entries(report.summary || {}).map(([key, value]) => `
            <div class="metric">
              <div class="metric-value">${value}</div>
              <div class="metric-label">${key}</div>
            </div>
          `).join('')}
          ${report.summary?.totalPtoHours !== undefined ? `
            <div class="metric">
              <div class="metric-value">${report.summary.totalPtoHours}h</div>
              <div class="metric-label">Total PTO Hours</div>
            </div>
          ` : ''}
          ${report.summary?.totalHolidayHours !== undefined ? `
            <div class="metric">
              <div class="metric-value">${report.summary.totalHolidayHours}h</div>
              <div class="metric-label">Total Holiday Hours</div>
            </div>
          ` : ''}
        </div>
        ${report.members && report.members.length > 0 ? `
          <h2>Team Members</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Working Hours</th>
                <th>PTO Hours</th>
                <th>Holiday Hours</th>
                <th>Utilization %</th>
              </tr>
            </thead>
            <tbody>
              ${report.members.map(m => `
                <tr>
                  <td>${m.name}</td>
                  <td>${m.metrics?.workingHours?.toFixed(1) || 0}h</td>
                  <td>${m.metrics?.ptoHours?.toFixed(1) || 0}h</td>
                  <td>${m.metrics?.holidayHours?.toFixed(1) || 0}h</td>
                  <td>${m.metrics?.utilization?.toFixed(1) || 0}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}
      </body>
      </html>
    `;

        return html;
    }

    formatReportAsMarkdown(report) {
        let markdown = `# ${report.teamName} - Report\n\n`;
        markdown += `**Period:** ${report.period.startDate} to ${report.period.endDate}\n\n`;
        markdown += `## Summary\n\n`;

        if (report.summary) {
            Object.entries(report.summary).forEach(([key, value]) => {
                markdown += `- **${key}:** ${value}\n`;
            });
        }

        markdown += `\n## Details\n\n`;

        if (report.members && report.members.length > 0) {
            markdown += `### Team Members\n\n`;
            report.members.forEach(member => {
                markdown += `- ${member.name}: ${member.contribution || 'N/A'}\n`;
            });
        }

        return markdown;
    }

    formatReportAsJSON(report) {
        return JSON.stringify(report, null, 2);
    }

    async exportReport(report, format = 'json') {
        try {
            switch (format.toLowerCase()) {
                case 'html':
                    return this.formatReportAsHTML(report);
                case 'markdown':
                case 'md':
                    return this.formatReportAsMarkdown(report);
                case 'json':
                default:
                    return this.formatReportAsJSON(report);
            }
        } catch (error) {
            console.error('Export report error:', error.message);
            throw new Error(`Failed to export report: ${error.message}`);
        }
    }

    calculateTrends(currentData, previousData) {
        const trends = {};

        const metrics = ['totalIssues', 'totalStoryPoints', 'utilization'];

        metrics.forEach(metric => {
            const current = currentData[metric] || 0;
            const previous = previousData[metric] || 0;

            if (previous === 0) {
                trends[metric] = { value: current, change: 0, direction: 'stable' };
            } else {
                const change = ((current - previous) / previous) * 100;
                trends[metric] = {
                    value: current,
                    change: Math.round(change * 100) / 100,
                    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
                };
            }
        });

        return trends;
    }

    identifyTopPerformers(members, metric = 'storyPoints', count = 3) {
        return members
            .sort((a, b) => (b[metric] || 0) - (a[metric] || 0))
            .slice(0, count);
    }

    identifyBottlenecks(data) {
        const bottlenecks = [];

        if (data.averageUtilization > 90) {
            bottlenecks.push('Team is operating at high utilization');
        }

        if (data.blockedIssues > 5) {
            bottlenecks.push(`${data.blockedIssues} issues are blocked`);
        }

        return bottlenecks;
    }
}

const reportGenerator = new ReportGenerator();

export default reportGenerator;