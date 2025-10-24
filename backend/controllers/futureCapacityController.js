import jiraService from '../services/jiraService.js';
import capacityCalculationService from '../services/capacityCalculationService.js';
import capacityDataAggregator from '../utils/capacityDataAggregator.js';
import dateService from '../services/dateService.js';
import Team from '../models/Team.js';
import JiraQuery from '../models/JiraQuery.js';

/**
 * Main endpoint to calculate future capacity for a team
 */
export const calculateFutureCapacity = async (req, res) => {
    try {
        const { teamId, startDate, endDate } = req.body;

        if (!teamId || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'teamId, startDate, and endDate are required'
            });
        }

        console.log('=== Calculating Future Capacity ===');
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
            jqlKey: 'future_capacity'
        });

        if (!jiraQueryDoc) {
            return res.status(400).json({
                success: false,
                message: 'future_capacity query not configured for this team'
            });
        }

        // Build Jira accounts list and member mapping
        const jiraAccounts = [];
        const memberJiraMap = {}; // Map Jira account ID to member info

        for (const member of team.members) {
            if (!member.jiraAccountId) {
                console.warn(`Jira Account ID not configured for member: ${member.name}`);
                continue;
            }

            jiraAccounts.push(member.jiraAccountId);
            memberJiraMap[member.jiraAccountId] = {
                _id: member._id,
                name: member.name,
                email: member.email,
                designation: member.designation
            };
        }

        if (jiraAccounts.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No team members with Jira Account IDs configured'
            });
        }

        console.log('Jira accounts list:', jiraAccounts);

        // Replace placeholders in JQL
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

        // Aggregate issues by assignee using utility
        const groupedByAssignee = capacityDataAggregator.aggregateByAssignee(issues, memberJiraMap);

        // Calculate status breakdown using utility
        const statusBreakdown = capacityDataAggregator.calculateStatusBreakdown(issues);

        // Prepare assigned work by member for capacity calculation
        const assignedWorkByMember = {};
        for (const [assigneeId, data] of Object.entries(groupedByAssignee)) {
            if (data.memberId) {
                assignedWorkByMember[data.memberId.toString()] = {
                    originalEstimate: data.originalEstimate,
                    timeSpent: data.timeSpent,
                    timeRemaining: data.timeRemaining,
                    storyPoints: data.storyPoints,
                    issueCount: data.issues.length
                };
            }
        }

        // Calculate team capacity using modular service
        const capacityResult = await capacityCalculationService.calculateTeamCapacity({
            teamId,
            startDate,
            endDate,
            assignedWorkByMember
        });

        // Enrich issues with computed fields using utility
        const jiraDomain = process.env.JIRA_BASE_URL || 'your-jira-domain';
        const enrichedIssues = issues.map(issue => {
            const memberInfo = memberJiraMap[issue.assignee?.accountId];
            return capacityDataAggregator.enrichIssue(issue, memberInfo, jiraDomain);
        });

        // Sort issues by assignee and status
        const sortedIssues = capacityDataAggregator.sortIssues(enrichedIssues, 'assignee');

        // Sort team members by utilization
        const sortedMembers = capacityDataAggregator.sortTeamMembers(capacityResult.members, 'utilization');

        // Calculate team summary
        const summary = capacityDataAggregator.calculateTeamSummary(enrichedIssues, sortedMembers);

        // Calculate holiday hours using dateService
        const start = new Date(startDate);
        const end = new Date(endDate);
        const totalHolidayHours = await dateService.getHolidayHours(start, end, team.location || 'US');

        // Calculate total for team (multiply by number of members)
        const teamHolidayHours = totalHolidayHours * sortedMembers.length;
        summary.totalHolidayHours = Math.round(teamHolidayHours * 100) / 100;

        // Add totalPtoHours from members (already calculated in capacityCalculationService)
        summary.totalPtoHours = sortedMembers.reduce((sum, member) => sum + (member.ptoHours || 0), 0);
        summary.totalPtoHours = Math.round(summary.totalPtoHours * 100) / 100;

        // Identify bottlenecks
        const bottlenecks = capacityCalculationService.identifyBottlenecks(sortedMembers);

        // Get reallocation suggestions
        const reallocationSuggestions = capacityCalculationService.suggestReallocation(sortedMembers);

        // Calculate risk assessment
        const riskAssessment = capacityDataAggregator.calculateRiskAssessment(sortedMembers, statusBreakdown);

        // Build response
        res.status(200).json({
            success: true,
            data: {
                teamName: team.teamName,
                period: capacityResult.period,
                summary,
                statusBreakdown,
                teamMembers: sortedMembers,
                issues: sortedIssues,
                analytics: {
                    bottlenecks,
                    reallocationSuggestions,
                    riskAssessment
                }
            }
        });
    } catch (error) {
        console.error('Calculate future capacity error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

/**
 * Get capacity by team ID (query params)
 */
export const getCapacityByTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'startDate and endDate are required'
            });
        }

        req.body = { teamId, startDate, endDate };
        await calculateFutureCapacity(req, res);
    } catch (error) {
        console.error('Get capacity by team error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

/**
 * Get capacity by date range (query params)
 */
export const getCapacityByDateRange = async (req, res) => {
    try {
        const { teamId, startDate, endDate } = req.query;

        if (!teamId || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'teamId, startDate, and endDate are required'
            });
        }

        req.body = { teamId, startDate, endDate };
        await calculateFutureCapacity(req, res);
    } catch (error) {
        console.error('Get capacity by date range error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

/**
 * Get capacity analytics for a team
 */
export const getCapacityAnalytics = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'startDate and endDate are required'
            });
        }

        // Reuse the main calculation
        req.body = { teamId, startDate, endDate };

        // Create a custom response handler to extract only analytics
        const originalJson = res.json;
        res.json = function(data) {
            if (data.success && data.data) {
                return originalJson.call(this, {
                    success: true,
                    data: {
                        teamName: data.data.teamName,
                        period: data.data.period,
                        analytics: data.data.analytics
                    }
                });
            }
            return originalJson.call(this, data);
        };

        await calculateFutureCapacity(req, res);
    } catch (error) {
        console.error('Get capacity analytics error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};