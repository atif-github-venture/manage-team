import jiraService from '../services/jiraService.js';
import dateService from '../services/dateService.js';
import Team from '../models/Team.js';
import JiraQuery from '../models/JiraQuery.js';

export const getAssociateView = async (req, res) => {
    try {
        const { teamId, associateId, startDate, endDate } = req.query;

        if (!teamId || !associateId || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'teamId, associateId, startDate, and endDate are required'
            });
        }

        console.log('=== Associate View Request ===');
        console.log('Team ID (MongoDB):', teamId);
        console.log('Associate ID (MongoDB):', associateId);
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

        // Find the member in the team
        const member = team.members.find(m => m._id.toString() === associateId);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }

        console.log('Member Found:', member.name);

        if (!member.jiraAccountId) {
            return res.status(400).json({
                success: false,
                message: `Jira Account ID not configured for member: ${member.name}`
            });
        }

        console.log('Jira Account:', member.jiraAccountId);

        // Get the JQL query from JiraQuery collection
        const jiraQuery = await JiraQuery.findOne({
            teamId,
            jqlKey: 'hist_query_associate'
        });

        if (!jiraQuery) {
            return res.status(400).json({
                success: false,
                message: 'hist_query_associate not configured for this team'
            });
        }

        // Replace placeholders in the query
        let jqlQuery = jiraQuery.jql
            .replace('$assignee', `"${member.jiraAccountId}"`)
            .replace('$startDate', `"${startDate}"`)
            .replace('$endDate', `"${endDate}"`);

        console.log('=== Final JQL Query ===');
        console.log(jqlQuery);
        console.log('========================');

        // Execute the Jira query
        const issues = await jiraService.executeQuery(jqlQuery);

        console.log('Issues Retrieved:', issues.length);

        // Calculate working hours for the associate
        const workingHours = await dateService.getWorkingHours(
            new Date(startDate),
            new Date(endDate),
            team.teamId,
            member._id.toString(),
            team.location || 'US'
        );

        // Calculate PTO hours for the member using dateService
        const totalPtoHours = await dateService.getPTOHours(
            member._id,
            new Date(startDate),
            new Date(endDate)
        );

        // Calculate Holiday hours using dateService
        const totalHolidayHours = await dateService.getHolidayHours(
            new Date(startDate),
            new Date(endDate),
            team.location || 'US'
        );

        // Calculate metrics
        const metrics = {
            totalIssues: issues.length,
            totalStoryPoints: issues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0),
            totalTimeSpent: issues.reduce((sum, issue) => sum + (issue.timeSpentHours || 0), 0),
            totalEstimate: issues.reduce((sum, issue) => sum + (issue.originalEstimateHours || 0), 0),
            totalWorkingHours: workingHours,
            totalPtoHours: Math.round(totalPtoHours * 100) / 100,
            totalHolidayHours: Math.round(totalHolidayHours * 100) / 100,
            utilization: 0,
            storyBurnRate: 0,
            timeActualVsOriginal: 0
        };

        if (metrics.totalWorkingHours > 0) {
            metrics.utilization = parseFloat(((metrics.totalTimeSpent / metrics.totalWorkingHours) * 100).toFixed(2));
        }

        if (metrics.totalTimeSpent > 0) {
            metrics.storyBurnRate = parseFloat((metrics.totalStoryPoints / metrics.totalTimeSpent).toFixed(2));
        }

        if (metrics.totalEstimate > 0) {
            metrics.timeActualVsOriginal = parseFloat((metrics.totalTimeSpent / metrics.totalEstimate).toFixed(2));
        }

        console.log('Metrics Calculated:', metrics);

        res.status(200).json({
            success: true,
            data: {
                metrics,
                issues: issues,
                associate: {
                    name: member.name,
                    jiraAccount: member.jiraAccountId
                },
                query: jqlQuery
            }
        });
    } catch (error) {
        console.error('Get associate view error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

export const calculateTeamMemberMetrics = async (teamId, startDate, endDate, issues) => {
    try {
        // Fetch the team from DB
        const team = await Team.findById(teamId);

        if (!team) {
            console.error('Team not found');
            return { cumulative: {}, members: {} };
        }

        const memberMetricsMap = {};
        const cumulativeMetrics = {
            totalIssues: 0,
            totalStoryPoints: 0,
            totalTimeSpent: 0,
            totalEstimate: 0,
            totalWorkingHours: 0,
            totalPtoHours: 0,
            totalHolidayHours: 0,
            utilization: 0,
            storyBurnRate: 0,
            timeActualVsOriginal: 0
        };

        // Calculate holidays once for the team using dateService
        const totalHolidayHours = await dateService.getHolidayHours(
            new Date(startDate),
            new Date(endDate),
            team.location || 'US'
        );

        for (const member of team.members) {
            try {
                if (!member.jiraAccountId) {
                    console.warn(`Jira Account ID not configured for member: ${member.name}`);
                    continue;
                }

                const assigneeId = member.jiraAccountId;

                // Filter issues assigned to this Jira account
                const memberIssues = issues.filter(issue => issue.assignee?.accountId === assigneeId);

                // Calculate working hours
                const workingHours = await dateService.getWorkingHours(
                    new Date(startDate),
                    new Date(endDate),
                    team.teamId,
                    member._id.toString(),
                    team.location || 'US'
                );

                // Calculate PTO hours for the member using dateService
                const memberPtoHours = await dateService.getPTOHours(
                    member._id,
                    new Date(startDate),
                    new Date(endDate)
                );

                const memberHolidayHours = totalHolidayHours;

                // Calculate metrics
                const metrics = {
                    memberId: member._id,
                    memberName: member.name,
                    jiraAccount: assigneeId,
                    totalIssues: memberIssues.length,
                    totalStoryPoints: memberIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0),
                    totalTimeSpent: memberIssues.reduce((sum, issue) => sum + (issue.timeSpentHours || 0), 0),
                    totalEstimate: memberIssues.reduce((sum, issue) => sum + (issue.originalEstimateHours || 0), 0),
                    totalWorkingHours: workingHours,
                    totalPtoHours: Math.round(memberPtoHours * 100) / 100,
                    totalHolidayHours: Math.round(memberHolidayHours * 100) / 100,
                    utilization: 0,
                    storyBurnRate: 0,
                    timeActualVsOriginal: 0
                };

                if (metrics.totalWorkingHours > 0) {
                    metrics.utilization = parseFloat(((metrics.totalTimeSpent / metrics.totalWorkingHours) * 100).toFixed(2));
                }

                if (metrics.totalTimeSpent > 0) {
                    metrics.storyBurnRate = parseFloat((metrics.totalStoryPoints / metrics.totalTimeSpent).toFixed(2));
                }

                if (metrics.totalEstimate > 0) {
                    metrics.timeActualVsOriginal = parseFloat((metrics.totalTimeSpent / metrics.totalEstimate).toFixed(2));
                }

                memberMetricsMap[member.name] = metrics;

                // Accumulate for cumulative metrics
                cumulativeMetrics.totalIssues += metrics.totalIssues;
                cumulativeMetrics.totalStoryPoints += metrics.totalStoryPoints;
                cumulativeMetrics.totalTimeSpent += metrics.totalTimeSpent;
                cumulativeMetrics.totalEstimate += metrics.totalEstimate;
                cumulativeMetrics.totalWorkingHours += metrics.totalWorkingHours;
                cumulativeMetrics.totalPtoHours += metrics.totalPtoHours;
                cumulativeMetrics.totalHolidayHours += metrics.totalHolidayHours;

            } catch (error) {
                console.error(`Error calculating metrics for ${member.name}:`, error);
            }
        }

        // Calculate cumulative percentages
        if (cumulativeMetrics.totalWorkingHours > 0) {
            cumulativeMetrics.utilization = parseFloat(((cumulativeMetrics.totalTimeSpent / cumulativeMetrics.totalWorkingHours) * 100).toFixed(2));
        }

        if (cumulativeMetrics.totalTimeSpent > 0) {
            cumulativeMetrics.storyBurnRate = parseFloat((cumulativeMetrics.totalStoryPoints / cumulativeMetrics.totalTimeSpent).toFixed(2));
        }

        if (cumulativeMetrics.totalEstimate > 0) {
            cumulativeMetrics.timeActualVsOriginal = parseFloat((cumulativeMetrics.totalTimeSpent / cumulativeMetrics.totalEstimate).toFixed(2));
        }

        return {
            cumulative: cumulativeMetrics,
            members: memberMetricsMap
        };
    } catch (error) {
        console.error('Calculate team member metrics error:', error);
        return { cumulative: {}, members: {} };
    }
};

export const getTeamMonthlyView = async (req, res) => {
    try {
        const { teamId, startDate, endDate } = req.query;

        if (!teamId || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'teamId, startDate, and endDate are required'
            });
        }

        console.log('=== Team View Request ===');
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

        // Build Jira accounts list from team members
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

        // Get the JQL query from JiraQuery collection
        const jiraQuery = await JiraQuery.findOne({
            teamId,
            jqlKey: 'hist_query_team'
        });

        if (!jiraQuery) {
            return res.status(400).json({
                success: false,
                message: 'hist_query_team not configured for this team'
            });
        }

        // Replace placeholders in the query
        let jqlQuery = jiraQuery.jql
            .replace('$assignees', jiraAccounts.map(acc => `"${acc}"`).join(', '))
            .replace('$startDate', `"${startDate}"`)
            .replace('$endDate', `"${endDate}"`);

        console.log('=== Final JQL Query ===');
        console.log(jqlQuery);
        console.log('========================');

        // Execute the Jira query
        const issues = await jiraService.executeQuery(jqlQuery);
        console.log('Issues Retrieved:', issues.length);

        const metrics = await calculateTeamMemberMetrics(teamId, startDate, endDate, issues);
        console.log('All member metrics calculated');

        res.status(200).json({
            success: true,
            data: metrics
        });
    } catch (error) {
        console.error('Get team monthly view error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

export const getTeamView = async (req, res) => {
    try {
        const { teamId, startDate, endDate } = req.query;

        if (!teamId || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'teamId, startDate, and endDate are required'
            });
        }

        // Get team from MongoDB
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found in database'
            });
        }

        // Build Jira accounts list from team members
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

        // Get the JQL query from JiraQuery collection
        const jiraQuery = await JiraQuery.findOne({
            teamId,
            jqlKey: 'hist_query'
        });

        if (!jiraQuery) {
            return res.status(400).json({
                success: false,
                message: 'hist_query not configured for this team'
            });
        }

        // Replace placeholders
        let jqlQueryStr = jiraQuery.jql
            .replace('$assignees', jiraAccounts.map(acc => `"${acc}"`).join(', '))
            .replace('$startDate', `"${startDate}"`)
            .replace('$endDate', `"${endDate}"`);

        const issues = await jiraService.executeQuery(jqlQueryStr);

        const groupedByAssignee = {};

        for (const issue of issues) {
            const assigneeId = issue.assignee?.accountId || 'unassigned';
            const assigneeName = issue.assignee?.displayName || 'Unassigned';

            if (!groupedByAssignee[assigneeId]) {
                groupedByAssignee[assigneeId] = {
                    assigneeId,
                    assigneeName,
                    totalIssues: 0,
                    totalStoryPoints: 0,
                    totalTimeSpent: 0,
                    totalEstimate: 0
                };
            }

            groupedByAssignee[assigneeId].totalIssues += 1;
            groupedByAssignee[assigneeId].totalStoryPoints += issue.storyPoints || 0;
            groupedByAssignee[assigneeId].totalTimeSpent += issue.timeSpentHours || 0;
            groupedByAssignee[assigneeId].totalEstimate += issue.originalEstimateHours || 0;
        }

        const teamData = Object.values(groupedByAssignee);

        res.status(200).json({
            success: true,
            data: teamData
        });
    } catch (error) {
        console.error('Get team view error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

export const getIndividualView = async (req, res) => {
    try {
        const { teamId, userId, startDate, endDate } = req.query;

        if (!teamId || !userId || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'teamId, userId, startDate, and endDate are required'
            });
        }

        // Get team from MongoDB
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found in database'
            });
        }

        // Build Jira accounts list from team members
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

        // Get the JQL query from JiraQuery collection
        const jiraQuery = await JiraQuery.findOne({
            teamId,
            jqlKey: 'hist_query'
        });

        if (!jiraQuery) {
            return res.status(400).json({
                success: false,
                message: 'hist_query not configured for this team'
            });
        }

        // Replace placeholders
        let jqlQueryStr = jiraQuery.jql
            .replace('$assignees', jiraAccounts.map(acc => `"${acc}"`).join(', '))
            .replace('$startDate', `"${startDate}"`)
            .replace('$endDate', `"${endDate}"`);

        const issues = await jiraService.executeQuery(jqlQueryStr);

        const userIssues = issues.filter(issue => issue.assignee?.accountId === userId);

        const workingHours = await dateService.getWorkingHours(
            new Date(startDate),
            new Date(endDate),
            teamId,
            userId,
            team.location || 'US'
        );

        const metrics = {
            totalIssues: userIssues.length,
            totalStoryPoints: userIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0),
            totalTimeSpent: userIssues.reduce((sum, issue) => sum + (issue.timeSpentHours || 0), 0),
            totalEstimate: userIssues.reduce((sum, issue) => sum + (issue.originalEstimateHours || 0), 0),
            totalWorkingHours: workingHours,
            utilization: 0,
            storyBurnRate: 0,
            timeActualVsEstimate: 0
        };

        if (metrics.totalWorkingHours > 0) {
            metrics.utilization = (metrics.totalTimeSpent / metrics.totalWorkingHours) * 100;
        }

        if (metrics.totalTimeSpent > 0) {
            metrics.storyBurnRate = metrics.totalStoryPoints / metrics.totalTimeSpent;
        }

        if (metrics.totalEstimate > 0) {
            metrics.timeActualVsEstimate = metrics.totalTimeSpent / metrics.totalEstimate;
        }

        res.status(200).json({
            success: true,
            data: {
                metrics,
                issues: userIssues
            }
        });
    } catch (error) {
        console.error('Get individual view error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};