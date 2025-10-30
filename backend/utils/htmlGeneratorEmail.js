// For Email (table-based, no JavaScript, inline styles)
export const generateInsightsEmailHTML = (insightsData) => {
    const { period, teamMetrics, teamSummary, members, teamName } = insightsData;

    // Helper to safely format numbers
    const fmt = (val) => val != null ? val : 0;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Insights Report - ${teamName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f7fa; padding: 20px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 900px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 700; color: #ffffff;">🎯 ${teamName}</h1>
                            <p style="margin: 0; font-size: 16px; color: #ffffff; opacity: 0.95;">Team Insights Report</p>
                            <p style="margin: 8px 0 0 0; font-size: 16px; color: #ffffff; opacity: 0.95;">${period.startDate} to ${period.endDate}</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px;">
                            
                            <!-- Team Metrics Header -->
                            <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #333; font-weight: 600;">📊 Team Overview</h2>
                            
                            <!-- All Metrics Grid (5 columns, 2 rows) -->
                            <table width="100%" cellpadding="8" cellspacing="8" border="0" style="margin-bottom: 30px;">
                                <!-- Row 1 -->
                                <tr>
                                    <td width="20%" style="padding: 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #667eea; border-radius: 8px; padding: 16px;">
                                            <tr><td>
                                                <p style="margin: 0 0 6px 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Total Issues</p>
                                                <p style="margin: 0; font-size: 28px; font-weight: 700; color: #667eea; line-height: 1;">${teamMetrics.totalIssuesCompleted}</p>
                                                <p style="margin: 6px 0 0 0; font-size: 10px; color: #888;">Completed</p>
                                            </td></tr>
                                        </table>
                                    </td>
                                    <td width="20%" style="padding: 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #764ba2; border-radius: 8px; padding: 16px;">
                                            <tr><td>
                                                <p style="margin: 0 0 6px 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Story Points</p>
                                                <p style="margin: 0; font-size: 28px; font-weight: 700; color: #764ba2; line-height: 1;">${teamMetrics.totalStoryPoints}</p>
                                                <p style="margin: 6px 0 0 0; font-size: 10px; color: #888;">Delivered</p>
                                            </td></tr>
                                        </table>
                                    </td>
                                    <td width="20%" style="padding: 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #43e97b; border-radius: 8px; padding: 16px;">
                                            <tr><td>
                                                <p style="margin: 0 0 6px 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Utilization</p>
                                                <p style="margin: 0; font-size: 28px; font-weight: 700; color: #43e97b; line-height: 1;">${teamMetrics.teamUtilization.toFixed(1)}%</p>
                                                <p style="margin: 6px 0 0 0; font-size: 10px; color: #888;">Average</p>
                                            </td></tr>
                                        </table>
                                    </td>
                                    <td width="20%" style="padding: 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #fa709a; border-radius: 8px; padding: 16px;">
                                            <tr><td>
                                                <p style="margin: 0 0 6px 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Burn Rate</p>
                                                <p style="margin: 0; font-size: 28px; font-weight: 700; color: #fa709a; line-height: 1;">${teamMetrics.teamBurnRate.toFixed(2)}</p>
                                                <p style="margin: 6px 0 0 0; font-size: 10px; color: #888;">Points/Hour</p>
                                            </td></tr>
                                        </table>
                                    </td>
                                    <td width="20%" style="padding: 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #2196F3; border-radius: 8px; padding: 16px;">
                                            <tr><td>
                                                <p style="margin: 0 0 6px 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Time Spent</p>
                                                <p style="margin: 0; font-size: 28px; font-weight: 700; color: #2196F3; line-height: 1;">${fmt(teamMetrics.totalTimeSpent).toFixed(1)}h</p>
                                                <p style="margin: 6px 0 0 0; font-size: 10px; color: #888;">Total Hours</p>
                                            </td></tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Row 2 -->
                                <tr>
                                    <td width="20%" style="padding: 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #FF5722; border-radius: 8px; padding: 16px;">
                                            <tr><td>
                                                <p style="margin: 0 0 6px 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Time Estimate</p>
                                                <p style="margin: 0; font-size: 28px; font-weight: 700; color: #FF5722; line-height: 1;">${fmt(teamMetrics.totalEstimate).toFixed(1)}h</p>
                                                <p style="margin: 6px 0 0 0; font-size: 10px; color: #888;">Original Estimate</p>
                                            </td></tr>
                                        </table>
                                    </td>
                                    <td width="20%" style="padding: 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #9C27B0; border-radius: 8px; padding: 16px;">
                                            <tr><td>
                                                <p style="margin: 0 0 6px 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Working Hours</p>
                                                <p style="margin: 0; font-size: 28px; font-weight: 700; color: #9C27B0; line-height: 1;">${fmt(teamMetrics.totalWorkingHours).toFixed(1)}h</p>
                                                <p style="margin: 6px 0 0 0; font-size: 10px; color: #888;">Available</p>
                                            </td></tr>
                                        </table>
                                    </td>
                                    <td width="20%" style="padding: 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #30cfd0; border-radius: 8px; padding: 16px;">
                                            <tr><td>
                                                <p style="margin: 0 0 6px 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">PTO Hours</p>
                                                <p style="margin: 0; font-size: 28px; font-weight: 700; color: #30cfd0; line-height: 1;">${fmt(teamMetrics.totalPtoHours).toFixed(1)}h</p>
                                                <p style="margin: 6px 0 0 0; font-size: 10px; color: #888;">Team PTO</p>
                                            </td></tr>
                                        </table>
                                    </td>
                                    <td width="20%" style="padding: 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #FF6B6B; border-radius: 8px; padding: 16px;">
                                            <tr><td>
                                                <p style="margin: 0 0 6px 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Holiday Hours</p>
                                                <p style="margin: 0; font-size: 28px; font-weight: 700; color: #FF6B6B; line-height: 1;">${fmt(teamMetrics.totalHolidayHours).toFixed(1)}h</p>
                                                <p style="margin: 6px 0 0 0; font-size: 10px; color: #888;">Company Holidays</p>
                                            </td></tr>
                                        </table>
                                    </td>
                                    <td width="20%" style="padding: 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #00BCD4; border-radius: 8px; padding: 16px;">
                                            <tr><td>
                                                <p style="margin: 0 0 6px 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Actual/Estimate</p>
                                                <p style="margin: 0; font-size: 28px; font-weight: 700; color: #00BCD4; line-height: 1;">${fmt(teamMetrics.timeActualVsEstimate).toFixed(2)}</p>
                                                <p style="margin: 6px 0 0 0; font-size: 10px; color: #888;">Accuracy Ratio</p>
                                            </td></tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- AI Team Summary -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                                <tr>
                                    <td>
                                        <h2 style="margin: 0 0 16px 0; font-size: 24px; color: #ffffff; font-weight: 600;">🤖 AI Team Summary</h2>
                                        <div style="font-size: 15px; line-height: 1.8; color: #ffffff; opacity: 0.95; white-space: pre-line;">${teamSummary}</div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Individual Members -->
                            <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #333; font-weight: 600;">👥 Individual Contributions</h2>
                            
                            ${members.map(member => `
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                                <!-- Member Header -->
                                <tr>
                                    <td style="border-bottom: 2px solid #f0f0f0; padding-bottom: 16px;">
                                        <p style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #333;">${member.name}</p>
                                        <p style="margin: 0; font-size: 13px; color: #666;">${member.email}</p>
                                    </td>
                                </tr>
                                
                                <!-- Member Metrics (6 metrics in 2 rows) -->
                                <tr>
                                    <td style="padding-top: 16px;">
                                        <table width="100%" cellpadding="6" cellspacing="6" border="0">
                                            <!-- Row 1 -->
                                            <tr>
                                                <td width="33%" style="text-align: center; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;">
                                                    <p style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">${member.metrics.issuesCompleted}</p>
                                                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.3px;">Issues</p>
                                                </td>
                                                <td width="33%" style="text-align: center; padding: 12px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px;">
                                                    <p style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">${member.metrics.storyPoints}</p>
                                                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.3px;">Story Points</p>
                                                </td>
                                                <td width="33%" style="text-align: center; padding: 12px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); border-radius: 8px;">
                                                    <p style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">${member.metrics.utilization.toFixed(1)}%</p>
                                                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.3px;">Utilization</p>
                                                </td>
                                            </tr>
                                            <!-- Row 2 -->
                                            <tr>
                                                <td width="33%" style="text-align: center; padding: 12px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border-radius: 8px;">
                                                    <p style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">${member.metrics.storyBurnRate.toFixed(2)}</p>
                                                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.3px;">Burn Rate</p>
                                                </td>
                                                <td width="33%" style="text-align: center; padding: 12px; background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); border-radius: 8px;">
                                                    <p style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">${fmt(member.metrics.ptoHours).toFixed(1)}h</p>
                                                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.3px;">PTO Hours</p>
                                                </td>
                                                <td width="33%" style="text-align: center; padding: 12px; background: linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%); border-radius: 8px;">
                                                    <p style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">${fmt(member.metrics.holidayHours).toFixed(1)}h</p>
                                                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.3px;">Holiday Hours</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Work Summary -->
                                <tr>
                                    <td style="padding-top: 16px;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 3px solid #667eea; border-radius: 8px; padding: 16px;">
                                            <tr>
                                                <td>
                                                    <p style="margin: 0 0 10px 0; font-size: 13px; color: #667eea; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">📝 Work Summary</p>
                                                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #555; white-space: pre-line;">${member.aiSummary}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            `).join('')}
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="text-align: center; padding: 30px; background: #f8f9fa; border-top: 2px solid #e0e0e0;">
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: #666; font-weight: 600;">Generated by Team Management System</p>
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: #666;">${new Date().toLocaleString()}</p>
                            <p style="margin: 0; font-size: 13px; color: #666;">© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
