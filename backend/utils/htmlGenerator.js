// For Copy HTML and Download HTML (matching UI exactly)
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

    // Icon SVGs
    const icons = {
        assignment: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
        trending: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>',
        timer: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>',
        speed: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44zm-9.79 6.84a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z"/></svg>',
        beach: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M13.127 14.56l1.43-1.43 6.44 6.443L19.57 21zm4.293-5.73l2.86-2.86c-3.95-3.95-10.35-3.96-14.3-.02 3.93-1.3 8.31-.25 11.44 2.88zM5.95 5.98c-3.94 3.95-3.93 10.35.02 14.3l2.86-2.86C5.7 14.29 4.65 9.91 5.95 5.98zm.02-.02l-.01.01c-.38 3.01 1.17 6.88 4.3 10.02l5.73-5.73c-3.13-3.13-7.01-4.68-10.02-4.3z"/></svg>',
        event: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h10v2H7z"/></svg>'
    };

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
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 40px 20px;
        }
        .container { 
            max-width: 1400px; 
            margin: 0 auto; 
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 50px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 15s ease-in-out infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.3; }
        }
        .header h1 { 
            font-size: 42px; 
            font-weight: 800;
            margin-bottom: 12px;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .header p { 
            font-size: 18px;
            opacity: 0.95;
            position: relative;
            z-index: 1;
        }
        .content { padding: 40px; }
        
        .section-title {
            font-size: 28px;
            font-weight: 700;
            color: #333;
            margin: 0 0 30px 0;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        /* Metric Cards */
        .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
            gap: 24px; 
            margin-bottom: 50px;
        }
        .metric-card { 
            background: white;
            border-radius: 16px;
            padding: 28px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
            border: 1px solid rgba(0,0,0,0.05);
        }
        .metric-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }
        .metric-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 20px;
        }
        .metric-icon {
            width: 56px;
            height: 56px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            flex-shrink: 0;
        }
        .metric-label {
            font-size: 14px;
            color: #666;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .metric-value { 
            font-size: 48px; 
            font-weight: 800; 
            line-height: 1;
            margin-bottom: 8px;
        }
        .metric-subtitle { 
            font-size: 13px; 
            color: #888; 
            font-weight: 500;
        }
        
        /* AI Summary */
        .summary-section { 
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            border: 2px solid rgba(102, 126, 234, 0.2);
            border-radius: 16px; 
            padding: 40px; 
            margin-bottom: 50px;
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.15);
        }
        .summary-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
        }
        .summary-icon {
            width: 64px;
            height: 64px;
            border-radius: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
        }
        .summary-section h2 { 
            font-size: 28px;
            color: #667eea;
            font-weight: 700;
        }
        .summary-section p { 
            font-size: 17px;
            line-height: 1.9;
            color: #555;
            white-space: pre-line;
        }
        
        /* Charts */
        .charts-section {
            margin-bottom: 50px;
        }
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 30px;
        }
        .chart-container {
            background: white;
            border: 1px solid rgba(0,0,0,0.08);
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .chart-container h3 {
            font-size: 20px;
            color: #333;
            margin-bottom: 24px;
            font-weight: 700;
        }
        .chart-wrapper {
            position: relative;
            height: 400px;
        }
        
        /* Member Cards */
        .members-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
            gap: 30px;
        }
        .member-card { 
            background: white; 
            border: 2px solid transparent;
            border-radius: 16px; 
            padding: 28px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }
        .member-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
            border-color: #667eea;
        }
        .member-header { 
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
        }
        .member-name { 
            font-size: 22px; 
            font-weight: 700; 
            color: #667eea;
            margin-bottom: 4px;
        }
        .member-email { 
            font-size: 13px; 
            color: #888;
            font-weight: 500;
        }
        .member-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        /* Metric Chips */
        .metrics-chips { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 12px; 
            margin-bottom: 24px;
        }
        .metric-chip { 
            text-align: center; 
            padding: 14px 12px; 
            border-radius: 10px;
            color: white;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            transition: all 0.2s ease;
        }
        .metric-chip:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .member-summary { 
            background: rgba(102, 126, 234, 0.05);
            padding: 20px; 
            border-radius: 12px; 
            border-left: 4px solid #667eea;
            border: 1px solid rgba(102, 126, 234, 0.1);
        }
        .member-summary h4 { 
            font-size: 13px;
            color: #667eea; 
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 700;
        }
        .member-summary p { 
            font-size: 14px; 
            line-height: 1.7; 
            color: #555;
        }
        
        .footer { 
            text-align: center; 
            margin-top: 60px; 
            padding: 40px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-top: 3px solid #667eea;
        }
        .footer p { 
            margin: 8px 0; 
            color: #666;
            font-size: 14px;
        }
        .footer strong {
            color: #667eea;
            font-weight: 700;
        }
        
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
            .member-card, .metric-card { page-break-inside: avoid; }
        }
        
        @media (max-width: 768px) {
            .charts-grid, .members-grid, .metrics-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 ${teamName}</h1>
            <p><strong>Team Insights Report</strong></p>
            <p>${period.startDate} to ${period.endDate}</p>
        </div>

        <div class="content">
            <!-- Team Metrics -->
            <h2 class="section-title">📊 Team Overview</h2>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-icon" style="background: linear-gradient(135deg, #667eea 0%, #667eeadd 100%); box-shadow: 0 4px 14px #667eea40;">
                            ${icons.assignment}
                        </div>
                        <div class="metric-label">Total Issues</div>
                    </div>
                    <div class="metric-value" style="color: #667eea;">${teamMetrics.totalIssuesCompleted}</div>
                    <div class="metric-subtitle">Completed</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-icon" style="background: linear-gradient(135deg, #764ba2 0%, #764ba2dd 100%); box-shadow: 0 4px 14px #764ba240;">
                            ${icons.trending}
                        </div>
                        <div class="metric-label">Story Points</div>
                    </div>
                    <div class="metric-value" style="color: #764ba2;">${teamMetrics.totalStoryPoints}</div>
                    <div class="metric-subtitle">Delivered</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-icon" style="background: linear-gradient(135deg, #43e97b 0%, #43e97bdd 100%); box-shadow: 0 4px 14px #43e97b40;">
                            ${icons.timer}
                        </div>
                        <div class="metric-label">Utilization</div>
                    </div>
                    <div class="metric-value" style="color: #43e97b;">${teamMetrics.teamUtilization.toFixed(1)}%</div>
                    <div class="metric-subtitle">Average</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fa709add 100%); box-shadow: 0 4px 14px #fa709a40;">
                            ${icons.speed}
                        </div>
                        <div class="metric-label">Burn Rate</div>
                    </div>
                    <div class="metric-value" style="color: #fa709a;">${teamMetrics.teamBurnRate.toFixed(2)}</div>
                    <div class="metric-subtitle">Points/Hour</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-icon" style="background: linear-gradient(135deg, #2196F3 0%, #2196F3dd 100%); box-shadow: 0 4px 14px #2196F340;">
                            ${icons.timer}
                        </div>
                        <div class="metric-label">Time Spent</div>
                    </div>
                    <div class="metric-value" style="color: #2196F3;">${(teamMetrics.totalTimeSpent || 0).toFixed(1)}h</div>
                    <div class="metric-subtitle">Total Hours</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-icon" style="background: linear-gradient(135deg, #FF5722 0%, #FF5722dd 100%); box-shadow: 0 4px 14px #FF572240;">
                            ${icons.timer}
                        </div>
                        <div class="metric-label">Time Estimate</div>
                    </div>
                    <div class="metric-value" style="color: #FF5722;">${(teamMetrics.totalEstimate || 0).toFixed(1)}h</div>
                    <div class="metric-subtitle">Original Estimate</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-icon" style="background: linear-gradient(135deg, #9C27B0 0%, #9C27B0dd 100%); box-shadow: 0 4px 14px #9C27B040;">
                            ${icons.timer}
                        </div>
                        <div class="metric-label">Working Hours</div>
                    </div>
                    <div class="metric-value" style="color: #9C27B0;">${(teamMetrics.totalWorkingHours || 0).toFixed(1)}h</div>
                    <div class="metric-subtitle">Available</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-icon" style="background: linear-gradient(135deg, #30cfd0 0%, #30cfd0dd 100%); box-shadow: 0 4px 14px #30cfd040;">
                            ${icons.beach}
                        </div>
                        <div class="metric-label">PTO Hours</div>
                    </div>
                    <div class="metric-value" style="color: #30cfd0;">${(teamMetrics.totalPtoHours || 0).toFixed(1)}h</div>
                    <div class="metric-subtitle">Team PTO</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-icon" style="background: linear-gradient(135deg, #FF6B6B 0%, #FF6B6Bdd 100%); box-shadow: 0 4px 14px #FF6B6B40;">
                            ${icons.event}
                        </div>
                        <div class="metric-label">Holiday Hours</div>
                    </div>
                    <div class="metric-value" style="color: #FF6B6B;">${(teamMetrics.totalHolidayHours || 0).toFixed(1)}h</div>
                    <div class="metric-subtitle">Company Holidays</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-icon" style="background: linear-gradient(135deg, #00BCD4 0%, #00BCD4dd 100%); box-shadow: 0 4px 14px #00BCD440;">
                            ${icons.speed}
                        </div>
                        <div class="metric-label">Actual/Estimate</div>
                    </div>
                    <div class="metric-value" style="color: #00BCD4;">${(teamMetrics.timeActualVsEstimate || 0).toFixed(2)}</div>
                    <div class="metric-subtitle">Accuracy Ratio</div>
                </div>
            </div>

            <!-- AI Team Summary -->
            <div class="summary-section">
                <div class="summary-header">
                    <div class="summary-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <h2>AI Team Summary</h2>
                </div>
                <p>${teamSummary}</p>
            </div>

            <!-- Charts -->
            <div class="charts-section">
                <h2 class="section-title">📊 Visual Analytics</h2>
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
            <h2 class="section-title">👥 Individual Contributions</h2>
            <div class="members-grid">
                ${members.map(member => `
                    <div class="member-card">
                        <div class="member-header">
                            <div>
                                <div class="member-name">${member.name}</div>
                                <div class="member-email">${member.email}</div>
                            </div>
                            <div class="member-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                        </div>
                        
                        <div class="metrics-chips">
                            <div class="metric-chip" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                ${member.metrics.issuesCompleted} Issues
                            </div>
                            <div class="metric-chip" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                                ${member.metrics.storyPoints} Points
                            </div>
                            <div class="metric-chip" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                                ${member.metrics.utilization.toFixed(1)}% Util
                            </div>
                            <div class="metric-chip" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                                ${member.metrics.storyBurnRate.toFixed(2)} Rate
                            </div>
                            <div class="metric-chip" style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);">
                                ${(member.metrics.ptoHours || 0).toFixed(1)}h PTO
                            </div>
                            <div class="metric-chip" style="background: linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%);">
                                ${(member.metrics.holidayHours || 0).toFixed(1)}h Holiday
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

        <div class="footer">
            <p><strong>Generated by Team Management System</strong></p>
            <p>${new Date().toLocaleString()}</p>
            <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
    </div>

    <script>
        window.addEventListener('DOMContentLoaded', function() {
            const colors = ${colorsJson};
            
            const pieCtx = document.getElementById('pieChart').getContext('2d');
            new Chart(pieCtx, {
                type: 'doughnut',
                data: {
                    labels: ${pieLabels},
                    datasets: [{
                        data: ${pieValues},
                        backgroundColor: colors,
                        borderColor: '#fff',
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                font: { size: 13, weight: '600' },
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: { size: 14, weight: '700' },
                            bodyFont: { size: 13 },
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
                        borderWidth: 2,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: { size: 14, weight: '700' },
                            bodyFont: { size: 13 },
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
                                font: { size: 12, weight: '600' },
                                callback: function(value) {
                                    return value + '%';
                                }
                            },
                            title: {
                                display: true,
                                text: 'Utilization %',
                                font: { size: 14, weight: '700' }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45,
                                font: { size: 12, weight: '600' }
                            },
                            grid: {
                                display: false
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
