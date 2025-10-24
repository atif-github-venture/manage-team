// Generate HTML template for email with embedded charts
export const generateInsightsHTML = (insightsData) => {
    const { period, teamMetrics, teamSummary, members, teamName } = insightsData;

    // Prepare chart data
    const pieChartData = members.map(m => ({
        name: m.name,
        value: m.metrics.storyPoints
    }));

    const barChartData = members.map(m => ({
        name: m.name,
        utilization: m.metrics.utilization
    }));

    const pieLabels = JSON.stringify(pieChartData.map(d => d.name));
    const pieValues = JSON.stringify(pieChartData.map(d => d.value));
    const barLabels = JSON.stringify(barChartData.map(d => d.name));
    const barValues = JSON.stringify(barChartData.map(d => d.utilization));

    const chartColors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
    const colorsJson = JSON.stringify(chartColors);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Insights Report - ${teamName}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333; 
            background: #f5f7fa;
            padding: 20px;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 { 
            font-size: 32px; 
            font-weight: 700;
            margin-bottom: 10px;
        }
        .header p { 
            font-size: 16px;
            opacity: 0.95;
        }
        .content { padding: 30px; }
        
        .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
            gap: 20px; 
            margin-bottom: 40px;
        }
        .metric-card { 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-left: 4px solid #667eea; 
            padding: 24px; 
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .metric-card h3 { 
            font-size: 13px; 
            color: #666; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
            font-weight: 600;
        }
        .metric-card .value { 
            font-size: 36px; 
            font-weight: 700; 
            color: #667eea;
            line-height: 1;
        }
        .metric-card .label { 
            font-size: 12px; 
            color: #888; 
            margin-top: 8px;
        }
        
        .summary-section { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px; 
            padding: 30px; 
            margin-bottom: 40px;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .summary-section h2 { 
            font-size: 24px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .summary-section p { 
            font-size: 16px;
            line-height: 1.8;
            opacity: 0.95;
        }
        
        .charts-section {
            margin-bottom: 40px;
        }
        .charts-section h2 {
            font-size: 24px;
            color: #333;
            margin-bottom: 24px;
            font-weight: 600;
        }
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        .chart-container {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .chart-container h3 {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .chart-wrapper {
            position: relative;
            height: 350px;
        }
        
        .members-section h2 { 
            font-size: 24px;
            color: #333; 
            margin-bottom: 24px;
            font-weight: 600;
        }
        .member-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 24px;
        }
        .member-card { 
            background: white; 
            border: 1px solid #e0e0e0; 
            border-radius: 12px; 
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .member-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }
        .member-header { 
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 2px solid #f0f0f0;
        }
        .member-name { 
            font-size: 20px; 
            font-weight: 700; 
            color: #333;
            margin-bottom: 4px;
        }
        .member-email { 
            font-size: 13px; 
            color: #666;
        }
        .member-metrics { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 12px; 
            margin: 20px 0;
        }
        .member-metric { 
            text-align: center; 
            padding: 12px; 
            background: #f8f9fa; 
            border-radius: 8px;
        }
        .member-metric .value { 
            font-size: 24px; 
            font-weight: 700; 
            color: #667eea;
            display: block;
        }
        .member-metric .label { 
            font-size: 11px; 
            color: #666; 
            margin-top: 4px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .member-summary { 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 16px; 
            border-radius: 8px; 
            margin-top: 16px;
            border-left: 3px solid #667eea;
        }
        .member-summary h4 { 
            font-size: 13px;
            color: #667eea; 
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }
        .member-summary p { 
            font-size: 14px; 
            line-height: 1.6; 
            color: #555;
        }
        
        .footer { 
            text-align: center; 
            margin-top: 50px; 
            padding: 30px;
            background: #f8f9fa;
            border-top: 2px solid #e0e0e0;
            color: #666; 
            font-size: 13px;
        }
        .footer p { margin: 8px 0; }
        
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
            .member-card { page-break-inside: avoid; }
        }
        
        @media (max-width: 768px) {
            .charts-grid {
                grid-template-columns: 1fr;
            }
            .member-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 ${teamName}</h1>
            <p>Team Insights Report</p>
            <p>${period.startDate} to ${period.endDate}</p>
        </div>

        <div class="content">
            <!-- Team Metrics -->
            <div class="metrics-grid">
                <div class="metric-card">
                    <h3>Total Issues</h3>
                    <div class="value">${teamMetrics.totalIssuesCompleted}</div>
                    <div class="label">Completed</div>
                </div>
                <div class="metric-card">
                    <h3>Story Points</h3>
                    <div class="value">${teamMetrics.totalStoryPoints}</div>
                    <div class="label">Delivered</div>
                </div>
                <div class="metric-card">
                    <h3>Utilization</h3>
                    <div class="value">${teamMetrics.teamUtilization.toFixed(1)}%</div>
                    <div class="label">Average</div>
                </div>
                <div class="metric-card">
                    <h3>Burn Rate</h3>
                    <div class="value">${teamMetrics.teamBurnRate.toFixed(2)}</div>
                    <div class="label">Points/Hour</div>
                </div>
                <div class="metric-card">
                    <h3>Time Spent</h3>
                    <div class="value">${(teamMetrics.totalTimeSpent || 0).toFixed(1)}h</div>
                    <div class="label">Total Hours</div>
                </div>
                <div class="metric-card">
                    <h3>Time Estimate</h3>
                    <div class="value">${(teamMetrics.totalEstimate || 0).toFixed(1)}h</div>
                    <div class="label">Original Estimate</div>
                </div>
                <div class="metric-card">
                    <h3>Working Hours</h3>
                    <div class="value">${(teamMetrics.totalWorkingHours || 0).toFixed(1)}h</div>
                    <div class="label">Available</div>
                </div>
                <div class="metric-card">
                    <h3>PTO Hours</h3>
                    <div class="value">${(teamMetrics.totalPtoHours || 0).toFixed(1)}h</div>
                    <div class="label">Team PTO</div>
                </div>
                <div class="metric-card">
                    <h3>Holiday Hours</h3>
                    <div class="value">${(teamMetrics.totalHolidayHours || 0).toFixed(1)}h</div>
                    <div class="label">Company Holidays</div>
                </div>
                <div class="metric-card">
                    <h3>Time Actual/Estimate</h3>
                    <div class="value">${(teamMetrics.timeActualVsEstimate || 0).toFixed(2)}</div>
                    <div class="label">Accuracy Ratio</div>
                </div>
            </div>

            <!-- AI Team Summary -->
            <div class="summary-section">
                <h2>🤖 AI Team Summary</h2>
                <div style="white-space: pre-line;">${teamSummary}</div>
            </div>

            <!-- Charts -->
            <div class="charts-section">
                <h2>📊 Visual Analytics</h2>
                <div class="charts-grid">
                    <div class="chart-container">
                        <h3>Story Points Distribution</h3>
                        <div class="chart-wrapper">
                            <canvas id="pieChart"></canvas>
                        </div>
                    </div>
                    <div class="chart-container">
                        <h3>Team Member Utilization</h3>
                        <div class="chart-wrapper">
                            <canvas id="barChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Individual Members -->
            <div class="members-section">
                <h2>👥 Individual Contributions</h2>
                <div class="member-grid">
                    ${members.map(member => `
                        <div class="member-card">
                            <div class="member-header">
                                <div class="member-name">${member.name}</div>
                                <div class="member-email">${member.email}</div>
                            </div>
                            
                            <div class="member-metrics">
                                <div class="member-metric">
                                    <span class="value">${member.metrics.issuesCompleted}</span>
                                    <span class="label">Issues</span>
                                </div>
                                <div class="member-metric">
                                    <span class="value">${member.metrics.storyPoints}</span>
                                    <span class="label">Story Points</span>
                                </div>
                                <div class="member-metric">
                                    <span class="value">${member.metrics.utilization.toFixed(1)}%</span>
                                    <span class="label">Utilization</span>
                                </div>
                                <div class="member-metric">
                                    <span class="value">${member.metrics.storyBurnRate.toFixed(2)}</span>
                                    <span class="label">Burn Rate</span>
                                </div>
                                <div class="member-metric">
                                    <span class="value">${(member.metrics.ptoHours || 0).toFixed(1)}h</span>
                                    <span class="label">PTO Hours</span>
                                </div>
                                <div class="member-metric">
                                    <span class="value">${(member.metrics.holidayHours || 0).toFixed(1)}h</span>
                                    <span class="label">Holiday Hours</span>
                                </div>
                            </div>

                            <div class="member-summary">
                                <h4>📝 Work Summary</h4>
                                <p>${member.aiSummary}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="footer">
            <p><strong>Generated by Team Management System</strong></p>
            <p>${new Date().toLocaleString()}</p>
            <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
    </div>

    <script>
        // Initialize charts after page load
        window.addEventListener('DOMContentLoaded', function() {
            const colors = ${colorsJson};
            
            // Pie Chart
            const pieCtx = document.getElementById('pieChart').getContext('2d');
            new Chart(pieCtx, {
                type: 'doughnut',
                data: {
                    labels: ${pieLabels},
                    datasets: [{
                        data: ${pieValues},
                        backgroundColor: colors,
                        borderColor: '#fff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                font: { size: 12 }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percent = ((context.parsed / total) * 100).toFixed(1);
                                    return context.label + ': ' + context.parsed + ' pts (' + percent + '%)';
                                }
                            }
                        }
                    }
                }
            });
            
            // Bar Chart
            const barCtx = document.getElementById('barChart').getContext('2d');
            new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: ${barLabels},
                    datasets: [{
                        label: 'Utilization %',
                        data: ${barValues},
                        backgroundColor: 'rgba(102, 126, 234, 0.8)',
                        borderColor: 'rgba(102, 126, 234, 1)',
                        borderWidth: 1,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return 'Utilization: ' + context.parsed.y.toFixed(1) + '%';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            },
                            title: {
                                display: true,
                                text: 'Utilization %'
                            }
                        },
                        x: {
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    }
                }
            });
        });
    </script>
</body>
</html>`;
};