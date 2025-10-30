import jiraService from '../services/jiraService.js';
import ollamaService from '../services/ollamaService.js';
import dateService from '../services/dateService.js';
import emailService from '../services/emailService.js';
import { generateInsightsHTML } from '../utils/htmlGenerator.js';
import { generateInsightsEmailHTML } from '../utils/htmlGeneratorEmail.js';
import Team from '../models/Team.js';
import JiraQuery from '../models/JiraQuery.js';


export const generateTeamworkInsights = async (req, res) => {
    try {
        const { teamId, startDate, endDate } = req.body;

        if (!teamId || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'teamId, startDate, and endDate are required'
            });
        }

        console.log('=== Generating Teamwork Insights ===');
        console.log('Team ID (MongoDB):', teamId);
        console.log('Date Range:', startDate, 'to', endDate);

        // Get team from MongoDB
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found in database'
            });
        }

        console.log('Team Found:', team.teamName);

        // Get JQL query from JiraQuery collection
        const jiraQueryDoc = await JiraQuery.findOne({
            teamId,
            jqlKey: 'workinsights_query'
        });

        if (!jiraQueryDoc) {
            return res.status(400).json({
                success: false,
                message: 'workinsights_query not configured for this team'
            });
        }

        console.log('JQL Query Found');

        // Build Jira accounts list
        const jiraAccounts = [];
        for (const member of team.members) {
            if (!member.jiraAccountId) {
                console.warn(`Jira Account ID not configured for member: ${member.name}`);
                continue;
            }
            jiraAccounts.push(member.jiraAccountId);
        }

        if (jiraAccounts.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No team members with Jira Account IDs configured'
            });
        }

        console.log('Jira accounts list:', jiraAccounts);

        // Replace placeholders
        let jqlQuery = jiraQueryDoc.jql
            .replace('$assignees', jiraAccounts.map(acc => `"${acc}"`).join(', '))
            .replace('$startDate', `"${startDate}"`)
            .replace('$endDate', `"${endDate}"`);

        console.log('=== Final JQL Query ===');
        console.log(jqlQuery);
        console.log('========================');

        // Execute the Jira query
        const issues = await jiraService.executeQuery(jqlQuery);
        console.log(`Retrieved ${issues.length} issues from Jira`);

        // Group issues by assignee
        const groupedByAssignee = {};

        for (const issue of issues) {
            const assigneeId = issue.assignee?.accountId || 'unassigned';
            const assigneeName = issue.assignee?.displayName || 'Unassigned';

            if (!groupedByAssignee[assigneeId]) {
                groupedByAssignee[assigneeId] = {
                    assigneeId,
                    assigneeName,
                    email: issue.assignee?.emailAddress || '',
                    issues: [],
                    tickets: []
                };
            }

            groupedByAssignee[assigneeId].issues.push(issue);

            // Pre-summarize long descriptions
            let summarizedDescription = issue.description || '';
            if (summarizedDescription.length > 200) {
                try {
                    summarizedDescription = await ollamaService.summarizeTicketDescription(summarizedDescription, 200);
                } catch (error) {
                    console.warn(`Failed to summarize description for ${issue.key}:`, error.message);
                    summarizedDescription = summarizedDescription.substring(0, 200) + '...';
                }
            }

            groupedByAssignee[assigneeId].tickets.push({
                key: issue.key,
                summary: issue.summary,
                description: summarizedDescription,
                storyPoints: issue.storyPoints || 0,
                timeSpent: issue.timeSpentHours || 0
            });
        }

        const members = [];
        let totalTimeSpent = 0;
        let totalWorkingHours = 0;
        let totalEstimate = 0;

        // Process each team member
        for (const member of team.members) {
            try {
                if (!member.jiraAccountId) {
                    console.warn(`Jira Account ID not configured for member: ${member.name}`);
                    continue;
                }

                const assigneeId = member.jiraAccountId;

                // Filter issues assigned to this Jira account
                const data = groupedByAssignee[assigneeId];
                if (!data) {
                    console.warn(`No issues found for ${member.name} (${assigneeId})`);
                    continue;
                }

                // Calculate working hours
                const workingHours = await dateService.getWorkingHours(
                    new Date(startDate),
                    new Date(endDate),
                    teamId,
                    member._id,
                    team.location || 'US'
                );

                // Calculate PTO hours for the member
                const ptoHours = await dateService.getPTOHours(
                    member._id,
                    new Date(startDate),
                    new Date(endDate)
                );

                // Calculate Holiday hours (same for all members)
                const holidayHours = await dateService.getHolidayHours(
                    new Date(startDate),
                    new Date(endDate),
                    team.location || 'US'
                );

                // Calculate metrics
                const memberTimeSpent = data.issues.reduce((sum, i) => sum + (i.timeSpentHours || 0), 0);
                const memberStoryPoints = data.issues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);
                const memberEstimate = data.issues.reduce((sum, i) => sum + (i.originalEstimateHours || 0), 0);

                const utilization = workingHours > 0
                    ? (memberTimeSpent / workingHours) * 100
                    : 0;

                const storyBurnRate = memberTimeSpent > 0
                    ? memberStoryPoints / memberTimeSpent
                    : 0;

                // Prepare ticket summaries for AI - include descriptions
                const ticketSummaries = data.tickets.map(ticket =>
                    `${ticket.key}: ${ticket.summary}\nDescription: ${ticket.description || 'No description'}`
                ).join('\n\n');

                // Generate AI summary
                let aiSummary = '';
                try {
                    aiSummary = await ollamaService.generateSummary(ticketSummaries);
                } catch (error) {
                    console.error(`AI summary error for ${data.assigneeName}:`, error);
                    aiSummary = 'Unable to generate AI summary at this time.';
                }

                totalTimeSpent += memberTimeSpent;
                totalWorkingHours += workingHours;
                totalEstimate += memberEstimate;

                members.push({
                    userId: assigneeId,
                    name: member.name,
                    email: data.email,
                    aiSummary,
                    tickets: data.tickets,
                    metrics: {
                        issuesCompleted: data.issues.length,
                        storyPoints: memberStoryPoints,
                        timeSpent: memberTimeSpent,
                        estimate: memberEstimate,
                        workingHours,
                        ptoHours: Math.round(ptoHours * 100) / 100,
                        holidayHours: Math.round(holidayHours * 100) / 100,
                        utilization: Math.round(utilization * 100) / 100,
                        storyBurnRate: Math.round(storyBurnRate * 100) / 100
                    }
                });
            } catch (error) {
                console.error(`Error calculating metrics for ${member.name}:`, error);
            }
        }

        // Sort members by story points
        members.sort((a, b) => b.metrics.storyPoints - a.metrics.storyPoints);

        // Calculate team-level metrics
        const totalPtoHours = members.reduce((sum, m) => sum + m.metrics.ptoHours, 0);
        const totalHolidayHours = members.reduce((sum, m) => sum + m.metrics.holidayHours, 0);

        const teamMetrics = {
            totalIssuesCompleted: issues.length,
            totalStoryPoints: members.reduce((sum, m) => sum + m.metrics.storyPoints, 0),
            totalTimeSpent,
            totalEstimate,
            totalWorkingHours,
            totalPtoHours: Math.round(totalPtoHours * 100) / 100,
            totalHolidayHours: Math.round(totalHolidayHours * 100) / 100,
            teamUtilization: totalWorkingHours > 0
                ? parseFloat(((totalTimeSpent / totalWorkingHours) * 100).toFixed(2))
                : 0,
            teamBurnRate: totalTimeSpent > 0
                ? parseFloat((members.reduce((sum, m) => sum + m.metrics.storyPoints, 0) / totalTimeSpent).toFixed(2))
                : 0,
            timeActualVsEstimate: totalEstimate > 0
                ? parseFloat((totalTimeSpent / totalEstimate).toFixed(2))
                : 0
        };

        // Generate team-level AI summary
        let teamSummary = '';
        try {
            // Collect all ticket details for team context
            const allTicketDetails = members.flatMap(m =>
                m.tickets.map(t => `${t.key}: ${t.summary}\nDescription: ${t.description || 'No description'}`)
            ).join('\n\n');

            const teamPrompt = `**Performance Data for ${team.teamName}:**
Period: ${startDate} → ${endDate}
Total Issues Completed: ${teamMetrics.totalIssuesCompleted}
Total Story Points: ${teamMetrics.totalStoryPoints}
Time Utilization: ${teamMetrics.teamUtilization.toFixed(1)}%
Story Burn Rate: ${teamMetrics.teamBurnRate.toFixed(2)} points/hour

**Top Contributors:**
${members.slice(0, 3).map((m, i) =>
                `${i + 1}. ${m.name}: ${m.metrics.storyPoints} pts, ${m.metrics.issuesCompleted} issues`
            ).join('\n')}

**Detailed Worklog / Ticket Data:**
${allTicketDetails}

**Your Task:**
You are an expert agile performance analyst. Generate a structured weekly performance summary.

Use this **exact format** (if a section has no relevant data, write "N/A"):

### 1. Summary
[2-3 sentences describing overall team performance this period]

### 2. Key Accomplishments
[Major deliverables or noteworthy achievements completed]

### 3. Critical Work
[Most important or high-impact tasks that were delivered]

### 4. Risks/Concerns
[Potential issues: low/over utilization, bottlenecks, technical debt, scope risks]

### 5. Recommendations
[Clear, actionable steps to improve team performance]

**Guidelines:**
- Keep total response between 8-15 sentences
- Focus on insights, not raw data repetition
- Be specific and analytical
- Use professional tone`;

            teamSummary = await ollamaService.generateContentWithRetry(
                teamPrompt,
                ollamaService.validateTeamSummaryFormat,
                3
            );
        } catch (error) {
            console.error('Team AI summary error:', error);
            teamSummary = `### 1. Summary\nThe team completed ${teamMetrics.totalIssuesCompleted} issues with ${teamMetrics.totalStoryPoints} story points during this period, achieving an average utilization of ${teamMetrics.teamUtilization.toFixed(1)}%.\n\n### 2. Key Accomplishments\nN/A\n\n### 3. Critical Work\nN/A\n\n### 4. Risks/Concerns\nN/A\n\n### 5. Recommendations\nN/A`;
        }

        const responseData = {
            period: { startDate, endDate },
            teamName: team.teamName,
            teamMetrics,
            teamSummary,
            members
        };

        res.status(200).json({
            success: true,
            data: responseData
        });
    } catch (error) {
        console.error('Generate teamwork insights error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

export const exportInsightsHTML = async (req, res) => {
    try {
        const { insightsData } = req.body;

        if (!insightsData) {
            return res.status(400).json({
                success: false,
                message: 'insightsData is required'
            });
        }

        console.log('=== Export Insights HTML ===');
        console.log('Team:', insightsData.teamName);
        console.log('Period:', insightsData.period);
        console.log('Members:', insightsData.members.length);

        // Generate HTML with charts for Copy/Download
        const htmlContent = generateInsightsHTML(insightsData);

        res.status(200).json({
            success: true,
            data: {
                html: htmlContent
            }
        });
    } catch (error) {
        console.error('Export insights HTML error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

export const sendInsightsEmail = async (req, res) => {
    try {
        const { insightsData, recipients } = req.body;

        if (!insightsData || !recipients || recipients.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'insightsData and recipients are required'
            });
        }

        console.log('=== Send Insights Email ===');
        console.log('Recipients:', recipients);
        console.log('Team:', insightsData.teamName);

        // Generate HTML using the already-generated insights data
        const htmlContent = generateInsightsEmailHTML(insightsData);

        // Send email
        await emailService.send({
            to: recipients.join(', '),
            subject: `Team Insights Report - ${insightsData.teamName} (${insightsData.period.startDate} to ${insightsData.period.endDate})`,
            html: htmlContent
        });

        res.status(200).json({
            success: true,
            message: `Insights email sent to ${recipients.length} recipient(s)`
        });
    } catch (error) {
        console.error('Send insights email error:', error);
        // SMTP-specific errors
        if (error.message.includes('Email authentication failed')) {
            return res.status(503).json({
                success: false,
                message: 'Email authentication failed. SMTP credentials are invalid.'
            });
        }

        if (error.message.includes('Email server connection refused')) {
            return res.status(503).json({
                success: false,
                message: 'Cannot connect to email server. Please check SMTP host and port configuration.'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to send email'
        });
    }
};
